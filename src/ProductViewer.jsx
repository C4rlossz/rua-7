import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Rotate3D, Maximize2, Play, Pause, MoveHorizontal, Image as ImageIcon } from 'lucide-react';
import { Modal, ProductArt } from './ui';
import { getProductModel } from './productModel';

const Model360 = lazy(() => import('./model360'));
const floralViews = ['Lateral externa', 'Perspectiva', 'Lateral interna', 'Calcanhar', 'Vista superior', 'Solado'];
class ModelBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? <div className="viewer-error" role="alert">O modelo 3D não pôde ser carregado.<button className="button secondary" onClick={this.props.onPhotos}>Ver fotos do produto</button></div> : this.props.children; }
}

export default function ProductViewer({ product }) {
  const modelAsset = getProductModel(product);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [model, setModel] = useState(false);
  const pointer = useRef(null);
  const reduced = useReducedMotion();
  const images = product.images || [];
  const count = images.length;
  const labels = product.id === 'tenis-floral' ? floralViews : images.map((_, i) => `Vista ${i + 1}`);
  useEffect(() => { setIndex(0); setPlaying(false); setModel(false); }, [product.id, modelAsset?.url]);
  useEffect(() => { if (!playing || count < 2) return; const id = setInterval(() => setIndex(v => (v + 1) % count), 1800); return () => clearInterval(id); }, [playing, count]);
  const move = delta => { setPlaying(false); setIndex(v => (v + delta + count) % count); };
  function onPointerDown(e) { if (count < 2 || model) return; pointer.current = { x: e.clientX, index }; e.currentTarget.setPointerCapture(e.pointerId); }
  function onPointerMove(e) {
    if (!pointer.current || model) return;
    const delta = e.clientX - pointer.current.x;
    if (Math.abs(delta) < 35) return;
    setPlaying(false);
    setIndex(((pointer.current.index + Math.round(-delta / 70)) % count + count) % count);
  }
  const stopPointer = () => { pointer.current = null; };
  const picture = <AnimatePresence mode="wait" initial={false}><motion.img key={index} src={images[index]} alt={`${product.name} — ${labels[index] || 'foto do produto'}`} draggable="false" initial={reduced ? { opacity: 1 } : { opacity: 0, scale: .89, rotateY: -16, y: 12 }} animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }} exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.04, rotateY: 12 }} transition={{ duration: reduced ? 0 : .25 }} className="angle-photo" onError={e => { e.currentTarget.alt = 'Foto indisponível. Escolha outro ângulo.'; }} /></AnimatePresence>;
  return <div className="viewer"><div className={`viewer-stage ${model ? 'showing-model' : ''}`} role="group" aria-label={`Visualizador de ${product.name}`} tabIndex={count > 1 && !model ? 0 : -1} onKeyDown={e => { if (!model && count > 1 && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); move(e.key === 'ArrowLeft' ? -1 : 1); } }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopPointer} onPointerCancel={stopPointer} onLostPointerCapture={stopPointer}>
      <div className="viewer-top"><span className="viewer-label"><span className="status-dot" />{model ? 'MODELO 3D · 360°' : count > 1 ? 'EXPLORE CADA ÂNGULO' : 'OLHE DE PERTO'}</span><button className="icon-btn" aria-label={model ? 'Ampliar modelo 3D' : 'Ampliar fotos'} onPointerDown={e => e.stopPropagation()} onClick={() => setExpanded(true)}><Maximize2 size={18} /></button></div>
      {model && modelAsset ? <ModelBoundary key={modelAsset.url} onPhotos={() => setModel(false)}><Suspense fallback={<p className="viewer-error">Preparando o modelo 3D…</p>}><Model360 url={modelAsset.url} active={!expanded} /></Suspense></ModelBoundary> : count ? picture : <ProductArt product={product} />}
      {count > 1 && !model && <div className="viewer-bottom"><button className="round-button" onPointerDown={e => e.stopPropagation()} onClick={() => move(-1)} aria-label="Ângulo anterior"><ChevronLeft size={19} /></button><span aria-live="polite">{String(index + 1).padStart(2, '0')} <span>/ {String(count).padStart(2, '0')}</span> <small>{labels[index]}</small></span><button className="round-button" onPointerDown={e => e.stopPropagation()} onClick={() => move(1)} aria-label="Próximo ângulo"><ChevronRight size={19} /></button></div>}
    </div>
    {(count > 1 || modelAsset) && <div className="viewer-controls"><span><MoveHorizontal size={17} />{model ? 'Arraste para girar · pinça para zoom' : `Arraste para explorar as ${count} vistas`}</span><div>{modelAsset && <><button className={model ? 'active' : ''} aria-pressed={model} onClick={() => { setModel(true); setPlaying(false); }}><Rotate3D size={17} />3D</button><button className={!model ? 'active' : ''} aria-pressed={!model} onClick={() => setModel(false)}><ImageIcon size={16} />Fotos</button></>}{count > 1 && !model && <button onClick={() => setPlaying(!playing)} aria-pressed={playing}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? 'Pausar' : 'Ver em movimento'}</button>}</div></div>}
    {model && modelAsset?.note && <p className="model-reference-note">{modelAsset.note}</p>}
    {(count > 1 || modelAsset) && <div className="thumbnails" aria-label="Vistas do produto">{images.map((src, i) => <button key={src} className={i === index && !model ? 'selected' : ''} aria-label={`Ver ${labels[i]}`} aria-pressed={i === index && !model} onClick={() => { setIndex(i); setModel(false); setPlaying(false); }}><img src={src} alt="" loading="lazy" draggable="false" /></button>)}{modelAsset && <button className={`thumbnail-3d ${model ? 'selected' : ''}`} aria-label="Explorar tênis em 360 graus" aria-pressed={model} onClick={() => { setModel(true); setPlaying(false); }}><Rotate3D size={19} /><span>360°</span></button>}</div>}
    <Modal open={expanded} onClose={() => setExpanded(false)} title={`${product.name} · ${model ? 'Modelo 3D' : labels[index] || 'Foto'}`} wide>{expanded && model && modelAsset ? <div className="expanded-model"><ModelBoundary key={modelAsset.url} onPhotos={() => setModel(false)}><Suspense fallback={<p>Carregando…</p>}><Model360 url={modelAsset.url} /></Suspense></ModelBoundary></div> : <div className="expanded-photo">{count ? picture : <ProductArt product={product} />}</div>}{count > 1 && !model && <div className="expanded-controls"><button className="button secondary" onClick={() => move(-1)}><ChevronLeft size={18} />Anterior</button><span>{index + 1} / {count}</span><button className="button secondary" onClick={() => move(1)}>Próxima<ChevronRight size={18} /></button></div>}</Modal>
  </div>;
}
