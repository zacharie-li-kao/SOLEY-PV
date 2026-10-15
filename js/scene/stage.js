import * as THREE from 'three';

// Renderer, camera and an on-demand loop: a frame is drawn only when a ticker reports a change.
export function createStage(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
  const tickers = [], resizers = [];
  let dirty = true, last = 0;

  new ResizeObserver(() => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    resizers.forEach(f => f(camera.aspect));
    dirty = true;
  }).observe(canvas);

  function frame(now) {
    requestAnimationFrame(frame);           // rAF stops by itself in hidden tabs
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    let active = false;
    for (const f of tickers) active = f(dt, now / 1000) || active;
    if (active || dirty) { renderer.render(scene, camera); dirty = false; }
  }

  return {
    renderer, scene, camera,
    addTicker: f => tickers.push(f),
    onResize: f => resizers.push(f),
    invalidate: () => { dirty = true; },
    start: () => requestAnimationFrame(frame),
    capture() { renderer.render(scene, camera); return canvas.toDataURL('image/png'); },
  };
}
