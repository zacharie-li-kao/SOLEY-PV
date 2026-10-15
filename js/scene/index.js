import * as THREE from 'three';
import { createStage } from './stage.js';
import { createPanel } from './panel.js';
import { createGarden } from './garden.js';
import { createLighting } from './lighting.js';
import { createFireflies } from './fireflies.js';
import { createCameraRig } from './camera-rig.js';
import { CELLS, PRIMARY } from '../config.js';

export function createScene(canvas, { reducedMotion, onCells }) {
  const stage = createStage(canvas);
  const panel = createPanel(CELLS.findIndex(c => c.id === PRIMARY)), garden = createGarden();
  stage.scene.add(panel.group, garden.group);
  const lighting = createLighting(stage.scene, panel, garden);
  const rig = createCameraRig(stage.camera, panel);
  const v = new THREE.Vector3();
  let lastRects = [];
  // Screen columns (NDC x) covered by the panel, so fireflies are never spawned over it.
  const panelX = () => {
    if (!lastRects.length) return [-0.3, 0.3];
    const w = canvas.clientWidth;
    return [Math.min(...lastRects.map(r => r.x)) / w * 2 - 1, Math.max(...lastRects.map(r => r.x + r.w)) / w * 2 - 1];
  };
  const flies = createFireflies(stage.scene, stage.camera, panelX);
  let moved = true;

  function rects() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    stage.camera.updateMatrixWorld();
    return Array.from({ length: panel.count }, (_, i) => {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const c of panel.cellCorners(i)) {
        v.copy(c).project(stage.camera);
        const x = (v.x + 1) / 2 * w, y = (1 - v.y) / 2 * h;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    });
  }

  stage.onResize(aspect => { rig.setAspect(aspect); moved = true; });
  const shadows = () => { stage.renderer.shadowMap.needsUpdate = true; };   // the sun only moves while the theme fades
  shadows();
  stage.addTicker(dt => { const m = lighting.tick(dt); if (m) shadows(); return m; });
  stage.addTicker((dt, t) => (reducedMotion ? false : flies.tick(dt, t)));
  // Fog follows the camera distance, so the horizon fades the same way in every pose
  // (the phone reading pose sits far back and would otherwise fog the panel away).
  const centre = panel.centre();
  const fitFog = () => {
    const d = stage.camera.position.distanceTo(centre);
    stage.scene.fog.near = d - 1.5;
    stage.scene.fog.far = d + 12.5;
  };
  stage.addTicker(dt => {
    const m = rig.tick(dt);
    if (m || moved) { moved = false; fitFog(); lastRects = rects(); onCells(lastRects); }
    return m;
  });
  stage.start();

  return {
    go: (index, { instant }) => { panel.setActive(index ?? -1); stage.invalidate(); return rig.go(index, instant || reducedMotion); },
    setTheme: (t, instant) => { lighting.set(t, instant || reducedMotion); shadows(); stage.invalidate(); },
    setHover: i => { panel.setHover(i); stage.invalidate(); },
    setParallax: (x, y) => { if (!reducedMotion) rig.setParallax(x, y); },
    setFireflies: on => flies.setEnabled(on && !reducedMotion),
  };
}
