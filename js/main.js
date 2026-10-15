import { CELLS } from './config.js';
import { createRouter } from './router.js';
import { initTheme } from './theme.js';
import { initDownload } from './ui/download.js';
import { createSheet } from './ui/sheet.js';
import { initCells } from './ui/cells.js';
import { initGallery } from './ui/gallery.js';
import { initCopy } from './ui/copy.js';

const root = document.documentElement;
root.classList.add('js');
const bus = new EventTarget();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fade = reducedMotion ? 0 : 240;

const theme = initTheme(bus);
const router = createRouter(bus);
const sheet = createSheet(() => router.close());
let scene = null;
const cells = initCells(i => scene?.setHover(i));
initDownload(); initGallery(); initCopy();
document.getElementById('theme-toggle').addEventListener('click', () => theme.toggle());

function hasWebGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();   // free the probe's context slot
    return !!gl;
  } catch { return false; }
}

// The scene loads in the background: the page and any deep-linked section work before three.js arrives.
async function loadScene() {
  try {
    const { createScene } = await import('./scene/index.js');
    const s = createScene(document.getElementById('scene'), { reducedMotion, onCells: r => cells.place(r) });
    s.setTheme(theme.get(), true);
    const open = router.get();
    await s.go(open === null ? null : CELLS.findIndex(c => c.id === open), { instant: true });   // join the current state, no move
    scene = s;
    root.classList.add('has-scene');
    fireflies();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('scene-ready')));   // fade in after the first frame
    document.getElementById('scene').addEventListener('click', () => { if (router.get()) router.close(); });
    if (!reducedMotion && matchMedia('(pointer: fine)').matches) {
      addEventListener('pointermove', e => scene.setParallax(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1));
    }
  } catch (err) {
    console.warn('[SOLEY] 3D scene disabled:', err);   // the CSS panel stays in place
  }
}

const fireflies = () => scene?.setFireflies(theme.get() === 'night' && router.get() === null);
bus.addEventListener('theme', e => { scene?.setTheme(e.detail, false); fireflies(); });

let seq = 0, lastOpen = null;   // only the latest route may finish (fast clicks, Back during a move)
bus.addEventListener('route', async ({ detail: { section, initial } }) => {
  const my = ++seq;
  fireflies();
  cells.setActive(section);
  const index = section === null ? null : CELLS.findIndex(c => c.id === section);
  if (section && sheet.isOpen()) {
    // Section to section: the panel stays where it is, only the text changes.
    await sheet.swap(initial ? 0 : Math.min(fade, 150));
    if (my !== seq) return;
    scene?.go(index, { instant: initial });
    lastOpen = section;
    sheet.show(section);
    return;
  }
  if (!section) await sheet.hide(initial ? 0 : fade);
  if (my !== seq) return;
  if (!section && lastOpen) cells.focus(lastOpen);   // focus is back on the cell before the camera returns
  if (section) root.classList.add('reading');                 // hero steps aside before the camera moves in
  if (scene) await scene.go(index, { instant: initial });
  if (my !== seq) return;
  if (!section) root.classList.remove('reading');             // and comes back only once the panel has settled
  if (section) { lastOpen = section; sheet.show(section); }
});

router.start();
if (hasWebGL()) loadScene();
