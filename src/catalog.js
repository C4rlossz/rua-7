import { isTrustedAsset } from './assetPolicy.js';

export const initialProducts = [
  { id: 'tenis-floral', name: 'Rua 7 Movimento 01', category: 'Tênis', subtitle: 'Um conceito original no seu ritmo.', price: 49990, sizes: ['37', '38', '39', '40', '41', '42', '43'], stock: 5, image: '/images/rua7-movimento-0.png', images: Array.from({ length: 6 }, (_, i) => `/images/rua7-movimento-${i}.png`), description: 'Conceito ilustrativo original da Rua 7, em branco e lavanda, criado por modelagem procedural. As imagens são renderizações do mesmo modelo 3D. Não representam um produto físico disponível para venda.', color: 'Branco / Lavanda', badge: 'Conceito Rua 7', provisional: true, placeholder: true },
  { id: 'tenis-02', name: 'Tênis — modelo 02', category: 'Tênis', subtitle: 'Seu próximo passo.', price: 44990, sizes: ['37', '38', '39', '40', '41', '42'], stock: 5, image: '/images/campaign-optimized.jpg', images: ['/images/campaign-optimized.jpg'], description: 'Espaço reservado para o segundo tênis da coleção. A foto é uma ilustração de campanha; os dados serão substituídos após o envio do produto.', color: 'A confirmar', badge: 'Em breve', provisional: true, placeholder: true },
  { id: 'blusa-01', name: 'Blusa — modelo 01', category: 'Roupas', type: 'hoodie', subtitle: 'Conforto no seu ritmo.', price: 18990, sizes: ['P', 'M', 'G', 'GG'], stock: 5, images: [], description: 'Espaço reservado para a blusa que fará parte da Rua 7. Foto, tecido e medidas aguardam confirmação.', color: 'A confirmar', provisional: true, placeholder: true },
  { id: 'calca-01', name: 'Calça — modelo 01', category: 'Roupas', type: 'pants', subtitle: 'Liberdade em cada movimento.', price: 22990, sizes: ['36', '38', '40', '42', '44'], stock: 5, images: [], description: 'Espaço reservado para a calça da coleção. Foto, material e medidas aguardam confirmação.', color: 'A confirmar', provisional: true, placeholder: true },
  { id: 'bone-01', name: 'Boné — modelo 01', category: 'Acessórios', type: 'cap', subtitle: 'O detalhe é seu.', price: 9990, sizes: ['Único'], stock: 5, images: [], description: 'Espaço reservado para o boné da coleção. Foto, acabamento e ajuste aguardam confirmação.', color: 'A confirmar', provisional: true, placeholder: true },
];

export function migrateCatalogMedia(products) {
  return products.map(p => {
    if (p.id === 'tenis-floral' && (p.image?.includes('air-floral-') || p.modelUrl?.includes('tenis-floral-v1'))) {
      const updated = initialProducts[0];
      return { ...p, name: updated.name, subtitle: updated.subtitle, image: updated.image, images: updated.images, modelUrl: '', description: updated.description, color: updated.color, badge: updated.badge, placeholder: true, provisional: true };
    }
    return p.image === '/images/campaign.png' ? { ...p, image:'/images/campaign-optimized.jpg', images:['/images/campaign-optimized.jpg'] } : p;
  });
}

export const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
export const isSafeImage = value => isTrustedAsset(value, 'image');

export function validateProduct(p) {
  if (!p || typeof p.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(p.id)) return false;
  return typeof p.name === 'string' && p.name.trim().length > 1 && p.name.length <= 120
    && ['Tênis', 'Roupas', 'Acessórios'].includes(p.category)
    && Number.isInteger(p.price) && p.price > 0 && p.price <= 100000000
    && Number.isInteger(p.stock) && p.stock >= 0 && p.stock <= 10000
    && Array.isArray(p.sizes) && p.sizes.length > 0 && p.sizes.length <= 30
    && p.sizes.every(s => typeof s === 'string' && s.trim().length > 0 && s.length <= 20) && new Set(p.sizes).size === p.sizes.length
    && (!p.image || isSafeImage(p.image))
    && (!p.images || (Array.isArray(p.images) && p.images.length <= 36 && p.images.every(isSafeImage)))
    && (!p.modelUrl || isTrustedAsset(p.modelUrl, 'model'))
    && Object.entries({ description: 2500, subtitle: 150, color: 100, badge: 40 }).every(([k, limit]) => p[k] === undefined || (typeof p[k] === 'string' && p[k].length <= limit))
    && ['provisional', 'placeholder'].every(k => p[k] === undefined || typeof p[k] === 'boolean')
    && (p.type === undefined || ['hoodie', 'pants', 'cap'].includes(p.type));
}

export function resolveCart(cart, products) {
  if (!Array.isArray(cart)) return [];
  const merged = new Map();
  for (const line of cart) {
    if (!line || typeof line !== 'object') continue;
    const product = products.find(p => p.id === line.productId);
    if (!product || !product.sizes.includes(line.size) || !Number.isInteger(line.qty) || line.qty <= 0 || product.stock < 1) continue;
    const key = `${product.id}:${line.size}`;
    const existing = merged.get(key);
    merged.set(key, { product, productId: product.id, size: line.size, qty: Math.min((existing?.qty || 0) + line.qty, product.stock) });
  }
  // Stock is a conservative limit for the entire product until per-size stock is supplied.
  const remaining = new Map(products.map(p => [p.id, p.stock]));
  return [...merged.values()].map(line => {
    const qty = Math.min(line.qty, remaining.get(line.productId));
    remaining.set(line.productId, remaining.get(line.productId) - qty);
    return { ...line, qty };
  }).filter(line => line.qty > 0);
}

export function cartTotal(lines) { return lines.reduce((sum, line) => sum + line.product.price * line.qty, 0); }
export function toCart(lines) { return lines.map(({ productId, size, qty }) => ({ productId, size, qty })); }

export function addCartLine(cart, products, productId, size, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product || !product.sizes.includes(size)) throw new Error('Escolha um tamanho disponível.');
  const lines = resolveCart(cart, products);
  const count = lines.filter(l => l.productId === productId).reduce((sum, l) => sum + l.qty, 0);
  if (!Number.isInteger(qty) || qty < 1 || count + qty > product.stock) throw new Error('A quantidade excede o estoque disponível.');
  return toCart(resolveCart([...toCart(lines), { productId, size, qty }], products));
}

export function makeDemoOrder(lines) {
  if (!lines.length || cartTotal(lines) <= 0) throw new Error('Sua sacola está vazia.');
  return { id: `R7-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString(), status: 'Demonstração', total: cartTotal(lines), items: lines.map(l => ({ name: l.product.name, size: l.size, qty: l.qty, price: l.product.price })) };
}

export function validateDemoOrder(order) {
  return Boolean(order && typeof order.id === 'string' && /^R7-[A-F0-9]{8}$/.test(order.id)
    && order.status === 'Demonstração' && typeof order.createdAt === 'string' && Number.isFinite(Date.parse(order.createdAt))
    && Number.isSafeInteger(order.total) && order.total > 0 && Array.isArray(order.items) && order.items.length > 0 && order.items.length <= 150
    && order.items.every(i => i && typeof i.name === 'string' && i.name.length > 0 && i.name.length <= 120
      && typeof i.size === 'string' && i.size.length > 0 && i.size.length <= 20
      && Number.isInteger(i.qty) && i.qty > 0 && i.qty <= 10000 && Number.isInteger(i.price) && i.price > 0 && i.price <= 100000000)
    && order.items.reduce((n,i) => n+i.price*i.qty,0) === order.total);
}
