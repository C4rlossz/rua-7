import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, ShoppingBag, Heart, Check, Share2, Copy } from 'lucide-react';
import { useStore } from './store';
import { money } from './catalog';
import { Breadcrumb, EmptyState, Modal, ProductArt, ProductCard } from './ui';
import ProductViewer from './ProductViewer';

export default function ProductPage() {
  const { id } = useParams();
  const { products, addItem, favorites, toggleFavorite, notify } = useStore();
  const product = products.find(p => p.id === id);
  const [size, setSize] = useState('');
  const [error, setError] = useState('');
  const [guide, setGuide] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [cep, setCep] = useState('');
  const [delivery, setDelivery] = useState('');
  const nav = useNavigate();
  useEffect(() => { setSize(''); setError(''); setDelivery(''); setCep(''); setSharing(false); }, [id]);
  if (!product) return <EmptyState title="Esta peça não está por aqui." text="Explore a coleção para encontrar seu próximo favorito." />;
  function buy(checkout) {
    if (!size) { setError('Escolha seu tamanho para continuar.'); document.getElementById('size-options')?.focus(); return; }
    try { addItem(product.id, size); setError(''); checkout ? nav('/checkout') : notify(`${product.name}, tamanho ${size}, adicionado à sacola.`); } catch (e) { setError(e.message); }
  }
  const favorite = favorites.includes(id);
  const url = window.location.origin + '/produto/' + product.id;
  async function copyLink() {
    try { await navigator.clipboard.writeText(url); notify('Link do produto copiado.'); }
    catch { setSharing(true); notify('Selecione e copie o link exibido.'); }
  }
  function consultDelivery(e) {
    e.preventDefault();
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    setDelivery(`CEP ${digits.slice(0,5)}-${digits.slice(5)}: esta consulta é demonstrativa. Frete e prazo serão informados na abertura da loja.`);
  }
  return <div className="section-shell product-page">
    <Breadcrumb current={product.name} />
    <div className="product-layout">
      <ProductViewer product={product} />
      <div className="product-info">
        <span className="product-store-label">RUA 7 / COLEÇÃO</span>
        <div className="product-title-row">
          <h1>{product.name}</h1>
          <button className="icon-btn product-share" aria-label="Compartilhar produto" onClick={() => setSharing(true)}><Share2 size={20} /></button>
        </div>
        <p className="product-subtitle">{product.subtitle}</p>
        <p className="product-kind">{product.category}</p>
        <div className="product-pricing"><p className="product-price">{money(product.price)}</p><span>Preço do produto{product.provisional ? ' · demonstrativo' : ''}</span></div>
        {product.provisional && <p className="product-draft-note"><span className="status-dot" />Preço, tamanhos e estoque aguardam confirmação.</p>}
        <div className="product-color-selection"><div className="color-swatch" aria-label="Cor ilustrada do produto"><ProductArt product={product} /></div><p>Cor selecionada<strong>{product.color}</strong></p></div>
        <div className="size-heading"><strong>Tamanho</strong><button className="text-link" onClick={() => setGuide(true)}>Tabela de medidas</button></div>
        <div className={`size-options ${error ? 'has-error' : ''}`} id="size-options" tabIndex={-1} role="group" aria-label="Escolha o tamanho" aria-describedby={error ? 'size-error' : undefined}>
          {product.sizes.map(s => <button key={s} disabled={product.stock < 1} className={size === s ? 'selected' : ''} aria-pressed={size === s} onClick={() => { setSize(s); setError(''); }}>{s}{size === s && <Check size={12} />}</button>)}
        </div>
        {error && <p className="field-error" id="size-error" role="alert">{error}</p>}
        <div className="purchase-actions">
          <button className="button primary full buy-now" disabled={product.stock < 1} onClick={() => buy(true)}>{product.stock > 0 ? 'Comprar agora' : 'Indisponível'}<ArrowUpRight size={18} /></button>
          <button className={`button secondary full product-favorite ${favorite ? 'saved' : ''}`} aria-pressed={favorite} onClick={() => toggleFavorite(id)}>{favorite ? 'Salvo nos favoritos' : 'Salvar como favoritos'}<Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button>
          <button className="text-link add-to-bag" disabled={product.stock < 1} onClick={() => buy(false)}><ShoppingBag size={15} />Adicionar à sacola</button>
        </div>
        <p className="demo-buy-note">Checkout demonstrativo. Nenhuma cobrança será feita.</p>
        <div className="product-sharing"><span>Compartilhar:</span><button onClick={copyLink}><Copy size={13} />Copiar link</button></div>
        <section className="delivery-estimate" aria-labelledby="delivery-heading">
          <div className="delivery-heading"><h2 id="delivery-heading">Calcular frete</h2><span>Consulta demonstrativa</span></div>
          <form onSubmit={consultDelivery}><label className="sr-only" htmlFor="product-cep">CEP para consultar entrega</label><input id="product-cep" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}-?[0-9]{3}" title="Informe um CEP com 8 números" maxLength={9} required placeholder="00000-000" value={cep} onChange={e => { setCep(e.target.value.replace(/[^0-9-]/g, '')); setDelivery(''); }} /><button type="submit">Calcular</button></form>
          {delivery && <p className="delivery-result" role="status">{delivery}</p>}
        </section>
        <div className="product-accordions">
          <details><summary>Sobre o produto</summary><p>{product.description}</p>{product.placeholder && <p className="muted-text">Imagem ilustrativa. Aguardando o produto definitivo.</p>}</details>
          <details><summary>Entrega e trocas</summary><p>Esta versão é demonstrativa. Não há envio, cobrança ou reserva de estoque. As condições oficiais serão informadas antes da abertura das vendas.</p></details>
        </div>
      </div>
    </div>
    <section className="related"><div className="section-heading"><h2>CONTINUE NO SEU RITMO.</h2><Link className="text-link" to="/colecao">Ver tudo<ArrowUpRight size={18} /></Link></div><div className="product-grid">{products.filter(p => p.id !== id).slice(0, 3).map(p => <ProductCard key={p.id} product={p} />)}</div></section>
    <Modal open={guide} onClose={() => setGuide(false)} title="Encontre seu tamanho"><p className="info-copy">Tamanhos disponíveis nesta ficha: <strong>{product.sizes.join(', ')}</strong>.</p><p className="info-copy">As medidas e a tabela do fabricante ainda não foram confirmadas. Esta área receberá as medidas específicas do produto antes da abertura das vendas.</p></Modal>
    <Modal open={sharing} onClose={() => setSharing(false)} title="Compartilhe seu próximo favorito"><p className="info-copy">Copie o link de {product.name} para compartilhar.</p><label className="sr-only" htmlFor="share-product-link">Link do produto</label><input id="share-product-link" value={url} readOnly onFocus={e => e.target.select()} /><button className="button primary full copy-product-link" onClick={copyLink}>Copiar link<Copy size={16} /></button></Modal>
  </div>;
}
