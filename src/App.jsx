import { Suspense, lazy, useEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import Home, { CatalogPage, FavoritesPage } from './Home';
import { Footer, Header, EmptyState } from './ui';
import { useStore } from './store';

const ProductPage = lazy(() => import('./ProductPage'));
const Checkout = lazy(() => import('./Checkout'));
const CartPage = lazy(() => import('./Checkout').then(m => ({ default: m.CartPage })));
const OrderPage = lazy(() => import('./Checkout').then(m => ({ default: m.OrderPage })));
const AuthPage = lazy(() => import('./AuthPages'));
const Admin = lazy(() => import('./Admin'));
const LegalPage = lazy(() => import('./LegalPages'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  const previous = useRef(pathname);
  useEffect(() => { if (!hash) window.scrollTo({ top: 0, behavior: 'instant' }); if (previous.current !== pathname) document.getElementById('main')?.focus({ preventScroll: true }); document.title = (pathname === '/' ? 'Rua 7 — Seu estilo. Sua rua.' : 'Rua 7 — ' + (pathname.split('/')[1] || 'Loja')) + ' | Demonstração'; previous.current = pathname; }, [pathname, hash]);
  return null;
}
export default function App() {
  const { pathname } = useLocation();
  const { toast } = useStore();
  const admin = pathname.startsWith('/admin');
  return <MotionConfig reducedMotion="user"><ScrollManager />{!admin && <Header />}<main id="main" tabIndex={-1}><Suspense fallback={<div className="page-loading"><span className="loading-ring" />Preparando seu próximo passo…</div>}><Routes><Route path="/" element={<Home />} /><Route path="/colecao" element={<CatalogPage />} /><Route path="/produto/:id" element={<ProductPage />} /><Route path="/favoritos" element={<FavoritesPage />} /><Route path="/sacola" element={<CartPage />} /><Route path="/checkout" element={<Checkout />} /><Route path="/pedido/:id" element={<OrderPage />} /><Route path="/login" element={<AuthPage />} /><Route path="/admin/login" element={<AuthPage admin />} /><Route path="/admin" element={<Admin />} />{['privacidade','termos','cookies','acessibilidade','direitos','atendimento'].map(key => <Route key={key} path={'/'+key} element={<LegalPage pageKey={key} />} />)}<Route path="*" element={<EmptyState title="Esse caminho ainda não existe." text="Volte para a Rua e encontre seu próximo favorito." to="/" label="Voltar ao início" />} /></Routes></Suspense></main>{!admin && <Footer />}<AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}><CheckCircle2 size={20} />{toast}</motion.div>}</AnimatePresence></MotionConfig>;
}
