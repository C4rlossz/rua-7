import { createContext, useContext, useEffect, useState } from 'react';
import { initialProducts, migrateCatalogMedia, validateProduct, validateDemoOrder, resolveCart, toCart, addCartLine } from './catalog';
import { observeAuth, observeCatalog, databaseReady, saveProduct } from './firebase';
import { readStored, writeStored, clearStoreData } from './storage';

const Store = createContext(null);
function readStorage(key, fallback) { try { return readStored(localStorage, key, fallback); } catch { return fallback; } }
function writeStorage(key, value) { try { writeStored(localStorage, key, value); } catch {} }
export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    if (databaseReady) return initialProducts;
    const stored = readStorage('rua7.catalog.v1', initialProducts);
    return Array.isArray(stored) && stored.length === 5 && stored.every(validateProduct) ? migrateCatalogMedia(stored) : initialProducts;
  });
  const [cart, setCart] = useState(() => readStorage('rua7.cart.v1', []));
  const [favorites, setFavorites] = useState(() => { const v = readStorage('rua7.favorites.v1', []); return Array.isArray(v) ? v.filter(id => typeof id === 'string') : []; });
  const [session, setSession] = useState({ user: null, isAdmin: false, loading: true });
  const [toast, setToast] = useState('');
  const [catalogError, setCatalogError] = useState('');
  const [orders, setOrders] = useState(() => { try { const v = readStored(sessionStorage, 'rua7.demo-orders', []); return Array.isArray(v) ? v.filter(validateDemoOrder).slice(0, 100) : []; } catch { return []; } });
  const [adminDemo, setAdminDemo] = useState(false);
  const lines = resolveCart(cart, products);
  useEffect(() => observeAuth(setSession), []);
  useEffect(() => observeCatalog(data => {
    if (!data) return;
    const remote = Object.values(data).filter(validateProduct);
    // Merge individual admin updates with the five local draft slots.
    setProducts(previous => migrateCatalogMedia(previous.map(p => remote.find(r => r.id === p.id) || p)));
    setCatalogError('');
  }, () => setCatalogError('Não foi possível atualizar o catálogo. Tente recarregar a página.')), []);
  useEffect(() => writeStorage('rua7.cart.v1', toCart(lines)), [cart, products]);
  useEffect(() => { if (!databaseReady) writeStorage('rua7.catalog.v1', products); }, [products]);
  useEffect(() => writeStorage('rua7.favorites.v1', favorites), [favorites]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 4200); return () => clearTimeout(t); }, [toast]);
  function addItem(id, size) { setCart(addCartLine(cart, products, id, size)); }
  function updateQuantity(productId, size, qty) {
    if (!Number.isInteger(qty)) return;
    if (qty <= 0) return setCart(toCart(lines.filter(l => !(l.productId === productId && l.size === size))));
    const other = lines.filter(l => !(l.productId === productId && l.size === size));
    try { setCart(addCartLine(toCart(other), products, productId, size, qty)); } catch (e) { setToast(e.message); }
  }
  function toggleFavorite(id) { setFavorites(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]); }
  async function updateProduct(product) {
    if (!validateProduct(product)) throw new Error('Confira nome, preço, tamanhos, estoque e imagens.');
    if (databaseReady) {
      if (!session.isAdmin) throw new Error('Acesso administrativo necessário.');
      await saveProduct(product);
    } else if (!adminDemo) throw new Error('Abra a demonstração administrativa para editar.');
    setProducts(previous => previous.map(p => p.id === product.id ? product : p));
  }
  function completeOrder(order) {
    if (!validateDemoOrder(order)) throw new Error('O resumo do pedido não pôde ser validado.');
    setOrders(previous => { const next = [order, ...previous].slice(0,100); try { writeStored(sessionStorage, 'rua7.demo-orders', next); } catch {} return next; });
    setCart([]);
  }
  function clearBrowserData() {
    let success = false;
    try { success = clearStoreData(localStorage, sessionStorage); } catch {}
    setCart([]); setFavorites([]); setOrders([]); setAdminDemo(false);
    if (!databaseReady) setProducts(initialProducts);
    setToast(success ? 'Dados da loja removidos deste navegador. A conta e dados de outros serviços permanecem separados.' : 'Os dados da tela foram limpos. Revise também o armazenamento nas configurações do navegador.');
  }
  return <Store.Provider value={{ products, lines, favorites, toggleFavorite, session, toast, notify: setToast, catalogError, addItem, updateQuantity, updateProduct, clearCart: () => setCart([]), orders, completeOrder, clearBrowserData, adminDemo, openAdminDemo: () => setAdminDemo(true), closeAdminDemo: () => setAdminDemo(false) }}>{children}</Store.Provider>;
}
export const useStore = () => useContext(Store);
