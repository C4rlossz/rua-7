import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, Heart, ShoppingBag, UserRound, Menu, X, ArrowRight, ShieldCheck, Package, MoveUpRight, Shirt } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useStore } from './store';
import { money } from './catalog';
import LegalFooter from './LegalFooter';

export function Logo({ inverse = false }) { return <img className={`logo ${inverse ? 'inverse' : ''}`} src="/images/logo-optimized.png" width="2172" height="724" alt="Rua 7 — início" />; }
export function Modal({ open, onClose, title, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (open && !el.open) { el.showModal(); el.querySelector('[data-autofocus]')?.focus(); } if (!open && el.open) el.close(); }, [open]);
  useEffect(() => { if (!open) return; const before = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = before; }; }, [open]);
  return <dialog ref={ref} className={`modal ${wide ? 'wide' : ''}`} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }} aria-label={title}><div className="modal-header"><h2>{title}</h2><button className="icon-btn" aria-label="Fechar" onClick={onClose}><X /></button></div>{children}</dialog>;
}

export function ProductArt({ product, className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [product.image]);
  if (product.image && !failed) return <img className={`product-photo ${className}`} src={product.image} alt={product.name} loading={eager ? 'eager' : 'lazy'} draggable="false" onError={() => setFailed(true)} />;
  return <div className={`product-placeholder ${className}`} role="img" aria-label={`Ilustração de ${product.name}; foto em breve`}>
    {product.type === 'hoodie' ? <svg viewBox="0 0 300 320" aria-hidden="true"><path d="M107 64q43-51 86 0l21 25 56 42-30 52-36-19 5 119H91l5-119-36 19-30-52 56-42Z" fill="#d4c3ef" stroke="#b3a0d0" strokeWidth="2"/><path d="M107 64q43 52 86 0M127 83v67m46-67v67M113 222h74l-9-40h-56Z" fill="none" stroke="#ac96cb" strokeWidth="3"/><text x="150" y="170" textAnchor="middle" fill="#6D28D9" fontSize="17" fontWeight="800">RUA 7</text></svg>
      : product.type === 'pants' ? <svg viewBox="0 0 300 320" aria-hidden="true"><path d="m92 38 116 0 19 251h-63l-14-158-14 158H73Z" fill="#4e3c61" stroke="#382747" strokeWidth="2"/><path d="M94 54h112M150 56v61m-56-27 30 20m82-20-30 20M81 171h42v46H78m141-46h-42v46h46" fill="none" stroke="#82728e" strokeWidth="2"/></svg>
      : <svg viewBox="0 0 300 320" aria-hidden="true"><path d="M66 177c-1-104 165-130 171 1l-84 26Z" fill="#6D28D9"/><path d="M68 177c-68 17-52 56 41 54 60-1 94-23 128-53l-84 17Z" fill="#4c1c9e"/><path d="M153 91v102M91 126l62 67" stroke="#9866e2" fill="none" strokeWidth="2"/><text x="160" y="164" textAnchor="middle" fill="white" fontSize="25" fontWeight="800">7</text></svg>}
    {' '}<span>VISUAL ILUSTRATIVO</span>
  </div>;
}

export function ProductCard({ product, index = 0 }) {
  const { favorites, toggleFavorite } = useStore();
  const reduced = useReducedMotion();
  const favorite = favorites.includes(product.id);
  return <motion.article className="product-card" initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ delay: Math.min(index, 4) * .06 }}>
    <div className="product-image-wrap"><Link to={`/produto/${product.id}`} aria-label={`Ver ${product.name}${product.placeholder ? ' — Rua 7 visual ilustrativo' : ''}`}><ProductArt product={product} /></Link>
      {product.badge && <span className={`badge ${product.placeholder ? 'muted' : ''}`}>{product.badge}</span>}
      <button className={`favorite-btn ${favorite ? 'active' : ''}`} aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${product.name} ${favorite ? 'dos' : 'aos'} favoritos`} aria-pressed={favorite} onClick={() => toggleFavorite(product.id)}><Heart size={19} fill={favorite ? 'currentColor' : 'none'} /></button>
      <Link className="quick-view" to={`/produto/${product.id}`}>Explorar produto <ArrowUpRight size={19} /></Link>
    </div>
    <div className="product-meta"><div><span className="tiny muted-text">{product.category} / {product.color}</span><h3><Link to={`/produto/${product.id}`}>{product.name}</Link></h3><p>{product.subtitle}</p></div><span className="price">{money(product.price)}<small>{product.provisional ? 'Preço demonstrativo' : 'Preço do produto'}</small></span></div>
  </motion.article>;
}

export function Header() {
  const { lines, session, favorites } = useStore();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [term, setTerm] = useState('');
  const { products } = useStore();
  const nav = useNavigate();
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const result = products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(term.toLowerCase()));
  return <><a className="skip-link" href="#main">Pular para o conteúdo</a><div className="utility-bar" role="region" aria-label="Informações da loja"><span>DA RUA. PRA VOCÊ.</span><span className="utility-center">SEU ESTILO OCUPA A RUA <ArrowUpRight size={12} /></span><Link to="/admin/login">Área do administrador <ArrowUpRight size={11} /></Link></div>
    <header className="header"><Link to="/" className="brand-link" onClick={() => setMenu(false)}><Logo /></Link><nav className="desktop-nav" aria-label="Navegação principal"><Link to="/colecao">Toda a coleção</Link><Link to="/colecao?categoria=Tenis">Tênis</Link><Link to="/colecao?categoria=Roupas">Streetwear</Link><Link to="/colecao?categoria=Acessorios">Acessórios</Link></nav><div className="header-actions"><button className="search-button" onClick={() => setSearch(true)} aria-label="Buscar produtos"><Search size={19} /><span>O que você procura?</span></button><Link className="icon-btn account-link" to="/login" aria-label={session.user ? 'Minha conta' : 'Entrar na minha conta'}><UserRound size={21} /></Link><Link className="icon-btn favorites-link" to="/favoritos" aria-label={`Favoritos, ${favorites.length} produtos`}><Heart size={21} /></Link><Link className="icon-btn bag-link" to="/sacola" aria-label={`Sacola com ${count} itens`}><ShoppingBag size={21} />{count > 0 && <span className="count-badge">{count}</span>}</Link><button className="icon-btn mobile-menu" onClick={() => setMenu(true)} aria-label="Abrir menu"><Menu /></button></div></header>
    <Modal open={menu} onClose={() => setMenu(false)} title="Explore a Rua"><nav className="mobile-nav">{[['Toda a coleção', '/colecao'], ['Tênis', '/colecao?categoria=Tenis'], ['Streetwear', '/colecao?categoria=Roupas'], ['Acessórios', '/colecao?categoria=Acessorios'], ['Minha conta', '/login'], ['Favoritos', '/favoritos'], ['Administração', '/admin/login']].map(([label, url]) => <Link key={label} to={url} onClick={() => setMenu(false)}>{label}<ArrowUpRight /></Link>)}</nav></Modal>
    <Modal open={search} onClose={() => setSearch(false)} title="Encontre seu próximo favorito"><div className="search-field"><Search /><input data-autofocus aria-label="Nome ou categoria do produto" placeholder="Busque por tênis, blusa, boné..." value={term} onChange={e => setTerm(e.target.value)} /></div><div className="search-results">{result.length ? result.map(p => <button key={p.id} onClick={() => { setSearch(false); nav(`/produto/${p.id}`); }}><div className="search-thumb"><ProductArt product={p} /></div><span>{p.name}<small>{money(p.price)}</small></span><ArrowUpRight size={18} /></button>) : <p>Nenhum produto encontrado. Tente outro nome.</p>}</div></Modal></>;
}

export function Footer() { return <LegalFooter />; }

export function Breadcrumb({ current }) { return <div className="breadcrumb"><Link to="/">Início</Link><span>/</span><Link to="/colecao">Coleção</Link><span>/</span><span>{current}</span></div>; }
export function EmptyState({ icon: Icon = ShoppingBag, title, text, to = '/colecao', label = 'Explorar coleção' }) { return <div className="empty-state"><Icon size={40} strokeWidth={1.2} /><h1>{title}</h1><p>{text}</p><Link className="button primary" to={to}>{label}<ArrowRight size={18} /></Link></div>; }
