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
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

if (hasWebGL()) {
  try {
    const { createScene } = await import('./scene/index.js');
    scene = createScene(document.getElementById('scene'), { reducedMotion, onCells: r => cells.place(r) });
    root.classList.add('has-scene');
    scene.setTheme(theme.get(), true);
    if (!reducedMotion && matchMedia('(pointer: fine)').matches) {
      addEventListener('pointermove', e => scene.setParallax(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1));
    }
  } catch (err) {
    console.warn('[SOLEY] 3D scene disabled:', err);   // the CSS panel stays in place
    scene = null;
  }
}

const fireflies = () => scene?.setFireflies(theme.get() === 'night' && router.get() === null);
bus.addEventListener('theme', e => { scene?.setTheme(e.detail, false); fireflies(); });

let seq = 0, lastOpen = null;   // only the latest route may finish (fast clicks, Back during a move)
bus.addEventListener('route', async ({ detail: { section, initial } }) => {
  const my = ++seq;
  fireflies();
  if (sheet.isOpen()) await sheet.hide(initial ? 0 : Math.min(fade, 150));
  if (my !== seq) return;
  const index = section === null ? null : CELLS.findIndex(c => c.id === section);
  if (scene) await scene.go(index, { instant: initial });
  if (my !== seq) return;
  if (section) { lastOpen = section; sheet.show(section); return; }
  if (lastOpen) cells.focus(lastOpen);
});

router.start();
