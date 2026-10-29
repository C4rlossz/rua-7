import { forwardRef, Suspense, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import { Spherical, TOUCH, Vector3 } from 'three';
import { ChevronLeft, ChevronRight, Plus, Minus, RotateCcw, Play, Pause } from 'lucide-react';

const HOME = [-3.8, 2.2, 5.2];
function ProductModel({ url, onReady }) {
  // Original assets are uncompressed; avoid unused remote/WASM decoders under CSP.
  const { scene } = useGLTF(url, false, false);
  const instance = useMemo(() => scene.clone(true), [scene]);
  useEffect(() => { onReady(); }, [instance, onReady]);
  return <><Center><primitive object={instance} /></Center><ContactShadows position={[0, -.91, 0]} opacity={.25} scale={7} blur={2.7} far={4} resolution={256} frames={1} /></>;
}

const Controller = forwardRef(function Controller({ spinning, onInteraction, onEnd }, ref) {
  const controls = useRef(null);
  const { camera, invalidate } = useThree();
  useImperativeHandle(ref, () => ({
    move(theta = 0, phi = 0, zoom = 1) {
      const c = controls.current; if (!c) return;
      const s = new Spherical().setFromVector3(camera.position.clone().sub(c.target));
      s.theta += theta; s.phi = Math.max(.15, Math.min(Math.PI - .15, s.phi + phi));
      s.radius = Math.max(3, Math.min(10, s.radius * zoom));
      camera.position.copy(c.target).add(new Vector3().setFromSpherical(s));
      c.update(); invalidate(); onEnd();
    },
    reset() { const c = controls.current; if (!c) return; camera.position.set(...HOME); c.target.set(0, 0, 0); c.update(); invalidate(); onEnd(); },
  }), [camera, invalidate, onEnd]);
  useEffect(() => { invalidate(); }, [spinning, invalidate]);
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping dampingFactor={.09} autoRotate={spinning} autoRotateSpeed={.8} minDistance={3} maxDistance={10} minPolarAngle={.15} maxPolarAngle={Math.PI-.15} touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }} onStart={onInteraction} onEnd={onEnd} />;
});

export default function Model360({ url, active = true }) {
  const controller = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const onReady = useMemo(() => () => setReady(true), []);
  const onEnd = useMemo(() => () => setRevision(v => v + 1), []);
  function move(theta, phi, zoom) { setSpinning(false); controller.current?.move(theta, phi, zoom); }
  function key(e) {
    if (e.target !== e.currentTarget) return;
    const actions = { ArrowLeft: () => move(-.2), ArrowRight: () => move(.2), ArrowUp: () => move(0,-.15), ArrowDown: () => move(0,.15), '+': () => move(0,0,.86), '=': () => move(0,0,.86), '-': () => move(0,0,1.16), Home: () => { setSpinning(false); controller.current?.reset(); } };
    if (actions[e.key]) { e.preventDefault(); actions[e.key](); }
  }
  return <div className="model-canvas" role="group" tabIndex={0} aria-label="Tênis em 3D. Arraste para girar; use dois dedos ou a roda para zoom. Setas do teclado giram; mais e menos ajustam o zoom." onKeyDown={key} data-view-revision={revision} onPointerDown={e => e.stopPropagation()}>
    <Canvas aria-hidden="true" frameloop={active ? 'demand' : 'never'} camera={{ position: HOME, fov: 36 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={<span>Visualização 3D. As fotos originais também estão disponíveis.</span>}>
      <ambientLight intensity={1.5} /><hemisphereLight args={['#ffffff','#ada1bd',1]} />
      <directionalLight position={[-3,6,5]} intensity={3} /><directionalLight position={[4,3,-4]} intensity={2} color="#e5dcf7" />
      <Suspense fallback={null}><ProductModel url={url} onReady={onReady} /></Suspense>
      <Controller ref={controller} spinning={spinning && active} onInteraction={() => setSpinning(false)} onEnd={onEnd} />
    </Canvas>
    {!ready && <div className="model-loading" role="status"><span className="loading-ring" />Preparando seu tênis em 3D…</div>}
    <span className="sr-only" role="status">{ready ? 'Modelo 3D carregado.' : ''}</span>
    <div className="model-tools" aria-label="Controles do modelo 3D">
      <button aria-label="Girar à esquerda" disabled={!ready} onClick={() => move(-Math.PI/6)}><ChevronLeft size={17} /></button>
      <button aria-label="Girar à direita" disabled={!ready} onClick={() => move(Math.PI/6)}><ChevronRight size={17} /></button><span />
      <button aria-label="Aproximar" disabled={!ready} onClick={() => move(0,0,.85)}><Plus size={17} /></button>
      <button aria-label="Afastar" disabled={!ready} onClick={() => move(0,0,1.18)}><Minus size={17} /></button><span />
      <button aria-label="Restaurar vista" disabled={!ready} onClick={() => { setSpinning(false); controller.current?.reset(); }}><RotateCcw size={16} /></button>
      <button aria-label={spinning ? 'Pausar giro automático' : 'Iniciar giro automático'} aria-pressed={spinning} disabled={!ready} onClick={() => setSpinning(!spinning)}>{spinning ? <Pause size={15} /> : <Play size={15} />}</button>
    </div>
  </div>;
}
