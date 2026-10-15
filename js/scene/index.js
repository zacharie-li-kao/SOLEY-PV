import * as THREE from 'three';
import { createStage } from './stage.js';
import { createPanel } from './panel.js';
import { createGarden } from './garden.js';
import { createLighting } from './lighting.js';
import { createFireflies } from './fireflies.js';
import { createCameraRig } from './camera-rig.js';

export function createScene(canvas, { reducedMotion, onCells }) {
  const stage = createStage(canvas);
  const panel = createPanel(), garden = createGarden();
  stage.scene.add(panel.group, garden.group);
  const lighting = createLighting(stage.scene, panel, garden);
  const flies = createFireflies(stage.scene);  const rig = createCameraRig(stage.camera, panel);
  const v = new THREE.Vector3();
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
  stage.addTicker(dt => lighting.tick(dt));
  stage.addTicker((dt, t) => (reducedMotion ? false : flies.tick(dt, t)));
  stage.addTicker(dt => {
    const m = rig.tick(dt);
    if (m || moved) { moved = false; onCells(rects()); }
    return m;
  });
  stage.start();

  return {
    go: (index, { instant }) => rig.go(index, instant || reducedMotion),
    setTheme: (t, instant) => { lighting.set(t, instant || reducedMotion); stage.invalidate(); },
    setHover: i => { panel.setHover(i); stage.invalidate(); },
    setParallax: (x, y) => { if (!reducedMotion) rig.setParallax(x, y); },
    setFireflies: on => flies.setEnabled(on && !reducedMotion),
    capture: () => stage.capture(),
  };
}
