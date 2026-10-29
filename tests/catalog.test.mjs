import test from 'node:test';
import assert from 'node:assert/strict';
import { initialProducts, resolveCart, addCartLine, cartTotal, makeDemoOrder, validateProduct } from '../src/catalog.js';

test('catálogo tem os cinco tipos pedidos e seis vistas originais do primeiro tênis', () => {
  assert.equal(initialProducts.length, 5);
  assert.equal(initialProducts.filter(p => p.category === 'Tênis').length, 2);
  assert.equal(initialProducts.filter(p => p.category === 'Roupas').length, 2);
  assert.equal(initialProducts.filter(p => p.category === 'Acessórios').length, 1);
  assert.equal(initialProducts[0].images.length, 6);
  assert.ok(initialProducts.every(validateProduct));
});
test('compra exige um tamanho válido e respeita estoque agregado entre tamanhos', () => {
  assert.throws(() => addCartLine([], initialProducts, 'tenis-floral', ''), /tamanho/);
  assert.throws(() => addCartLine([], initialProducts, 'tenis-floral', '99'), /tamanho/);
  const first = addCartLine([], initialProducts, 'tenis-floral', '38', 3);
  const both = addCartLine(first, initialProducts, 'tenis-floral', '39', 2);
  assert.equal(resolveCart(both, initialProducts).reduce((s, l) => s + l.qty, 0), 5);
  assert.throws(() => addCartLine(both, initialProducts, 'tenis-floral', '40'), /estoque/);
});
test('mesmo tamanho é agregado e os valores vêm do catálogo, não do navegador', () => {
  const cart = addCartLine([{ productId: 'tenis-floral', size: '38', qty: 1, price: 1 }], initialProducts, 'tenis-floral', '38');
  const lines = resolveCart(cart, initialProducts);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].qty, 2);
  assert.equal(cartTotal(lines), 99980);
});
test('sacola inválida e indisponibilidades não viram um pedido', () => {
  const cart = [null, 'corrompido', {}, { productId: 'nao-existe', size: '38', qty: 1 }, { productId: 'tenis-floral', size: '38', qty: -1 }, { productId: 'tenis-floral', size: '38', qty: .5 }, { productId: 'tenis-floral', size: 'XX', qty: 1 }];
  assert.deepEqual(resolveCart(cart, initialProducts), []);
  assert.deepEqual(resolveCart(null, initialProducts), []);
  assert.throws(() => makeDemoOrder([]), /vazia/);
  const unavailable = initialProducts.map(p => ({ ...p, stock: 0 }));
  assert.deepEqual(resolveCart([{ productId: 'tenis-floral', size: '38', qty: 1 }], unavailable), []);
});
test('dados persistidos adulterados não excedem estoque total do produto', () => {
  const lines = resolveCart([{ productId: 'tenis-floral', size: '38', qty: 100 }, { productId: 'tenis-floral', size: '39', qty: 100 }], initialProducts);
  assert.equal(lines.reduce((s, l) => s + l.qty, 0), 5);
});
test('pedido demonstrativo não guarda dados pessoais nem alega pagamento', () => {
  const order = makeDemoOrder(resolveCart([{ productId: 'bone-01', size: 'Único', qty: 2 }], initialProducts));
  assert.equal(order.total, 19980);
  assert.equal(order.status, 'Demonstração');
  assert.match(order.id, /^R7-/);
  assert.equal(order.items[0].size, 'Único');
  assert.deepEqual(Object.keys(order).sort(), ['createdAt', 'id', 'items', 'status', 'total']);
});
test('editor rejeita links executáveis, preço negativo e tamanhos ausentes', () => {
  const p = initialProducts[0];
  assert.equal(validateProduct({ ...p, image: 'javascript:alert(1)' }), false);
  assert.equal(validateProduct({ ...p, images: ['data:text/html,test'] }), false);
  assert.equal(validateProduct({ ...p, price: -1 }), false);
  assert.equal(validateProduct({ ...p, stock: .5 }), false);
  assert.equal(validateProduct({ ...p, sizes: [] }), false);
  assert.equal(validateProduct({ ...p, subtitle: {} }), false);
  assert.equal(validateProduct({ ...p, modelUrl: 'javascript:test.glb' }), false);
  assert.equal(validateProduct({ ...p, images: ['/images/product.png'], modelUrl: '/models/shoe.glb' }), true);
  assert.equal(validateProduct({ ...p, images: ['https://example.com/photo.png'] }), false);
});
