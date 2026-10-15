import * as THREE from 'three';
import { PANEL_W } from './panel.js';

const FOV = 30, REST_DIST = 12.5, MOVE = 1.2, PAN = 0.8, CELL_FILL = 0.62, CELL = 0.56;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const RIGHT = new THREE.Vector3(1, 0, 0);

// The only camera movements of the site: rest <-> cell, cell -> cell. No free camera.
export function createCameraRig(camera, panel) {
  camera.fov = FOV;
  camera.updateProjectionMatrix();
  const pos = new THREE.Vector3(), tgt = new THREE.Vector3();
  const par = new THREE.Vector2(), parGoal = new THREE.Vector2();
  let aspect = 16 / 9, cell = null, anim = null;

  function restPose() {
    const c = panel.centre();
    if (aspect >= 1) {
      const t = c.clone().add(new THREE.Vector3(0.13 * 2 * REST_DIST * TAN * aspect, -0.35, 0));
      return { t, p: t.clone().add(new THREE.Vector3(0, 1.6, REST_DIST)) };
    }
    const d = (PANEL_W / 0.6 / aspect) / (2 * TAN);           // panel spans ~60% of a portrait width
    const t = c.clone().add(new THREE.Vector3(0, 1.3, 0));     // panel sits low, hero text above it
    return { t, p: t.clone().add(new THREE.Vector3(0, 1.6 * d / REST_DIST, d)) };
  }

  function cellPose(i) {
    const c = panel.cellCentre(i), d = CELL / CELL_FILL / (2 * TAN);
    const shift = aspect >= 1.2 ? 0.27 * 2 * d * TAN * aspect : 0;   // cell on the left, sheet on the right
    return { t: c.clone().addScaledVector(RIGHT, shift), p: c.clone().addScaledVector(panel.normal(), d).addScaledVector(RIGHT, shift) };
  }

  const pose = () => (cell === null ? restPose() : cellPose(cell));

  function applyCamera() {
    camera.position.copy(pos);
    if (cell === null && !anim) camera.position.add(new THREE.Vector3(par.x * 0.3, par.y * 0.15, 0));
    camera.lookAt(tgt);
  }

  function jump() { const p = pose(); pos.copy(p.p); tgt.copy(p.t); applyCamera(); }

  return {
    setAspect(a) { aspect = a; if (anim) { const r = anim.res; anim = null; r(); } jump(); },
    go(index, instant) {
      const dur = cell !== null && index !== null ? PAN : MOVE;
      cell = index;
      if (anim) { anim.res(); anim = null; }      // a superseded move resolves at once
      if (instant) { jump(); return Promise.resolve(); }
      const p = pose();
      return new Promise(res => { anim = { p0: pos.clone(), t0: tgt.clone(), p1: p.p, t1: p.t, k: 0, dur, res }; });
    },
    setParallax(x, y) { parGoal.set(x, y); },
    tick(dt) {
      if (anim) {
        anim.k = Math.min(1, anim.k + dt / anim.dur);
        const e = ease(anim.k);
        pos.lerpVectors(anim.p0, anim.p1, e);
        tgt.lerpVectors(anim.t0, anim.t1, e);
        if (anim.k === 1) { const r = anim.res; anim = null; r(); }
        applyCamera();
        return true;
      }
      if (cell === null && par.distanceToSquared(parGoal) > 1e-6) {
        par.lerp(parGoal, 1 - Math.exp(-dt * 3));
        applyCamera();
        return true;
      }
      return false;
    },
  };
}
