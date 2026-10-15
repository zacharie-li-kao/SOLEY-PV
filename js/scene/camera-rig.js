import * as THREE from 'three';
import { PANEL_W, PANEL_H } from './panel.js';

const FOV = 30, REST_DIST = 12.5, MOVE = 1.2;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const RIGHT = new THREE.Vector3(1, 0, 0), UP = new THREE.Vector3(0, 1, 0);

// Two poses only: rest (the garden) and reading (the whole panel beside the open section).
// Every section shares the reading pose, so moving between sections never moves the camera.
export function createCameraRig(camera, panel) {
  camera.fov = FOV;
  camera.updateProjectionMatrix();
  const pos = new THREE.Vector3(), tgt = new THREE.Vector3();
  const par = new THREE.Vector2(), parGoal = new THREE.Vector2(), off = new THREE.Vector3();
  let aspect = 16 / 9, reading = false, anim = null, parW = 1;   // parW: parallax weight, 1 at rest, 0 while reading

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

  function readingPose() {
    const c = panel.centre();
    if (aspect >= 1) {
      // Panel in the free space left of the sheet (sheet ~56% of the width), filling ~62% of the height.
      const d = PANEL_H / 0.62 / (2 * TAN), visW = 2 * d * TAN * aspect;
      const t = c.clone().addScaledVector(RIGHT, 0.28 * visW).addScaledVector(UP, -0.1);
      return { t, p: t.clone().add(new THREE.Vector3(0, 0.6, d)) };
    }
    // Phone: the sheet covers the lower 62%, the panel stays small and tappable in the band above it.
    const d = PANEL_H / 0.28 / (2 * TAN), visH = 2 * d * TAN;
    const t = c.clone().addScaledVector(UP, -0.27 * visH);
    return { t, p: t.clone().add(new THREE.Vector3(0, 0.6, d)) };
  }

  const pose = () => (reading ? readingPose() : restPose());

  function applyCamera() {
    camera.position.copy(pos);
    if (parW) camera.position.add(off.set(par.x * 0.3 * parW, par.y * 0.15 * parW, 0));
    camera.lookAt(tgt);
  }

  function jump() { const p = pose(); parW = reading ? 0 : 1; pos.copy(p.p); tgt.copy(p.t); applyCamera(); }

  return {
    setAspect(a) { aspect = a; if (anim) { const r = anim.res; anim = null; r(); } jump(); },
    // index: a cell index (reading pose) or null (rest). Same pose for every cell.
    go(index, instant) {
      const next = index !== null, moving = !!anim;
      if (anim) { anim.res(); anim = null; }      // a superseded move resolves at once
      if (next === reading && !instant && !moving) return Promise.resolve();   // mid-move: restart toward the same pose
      reading = next;
      if (instant) { jump(); return Promise.resolve(); }
      const p = pose();
      return new Promise(res => { anim = { p0: pos.clone(), t0: tgt.clone(), p1: p.p, t1: p.t, k: 0, dur: MOVE, w0: parW, res }; });
    },
    setParallax(x, y) { parGoal.set(x, y); },
    tick(dt) {
      if (anim) {
        anim.k = Math.min(1, anim.k + dt / anim.dur);
        const e = ease(anim.k);
        pos.lerpVectors(anim.p0, anim.p1, e);
        tgt.lerpVectors(anim.t0, anim.t1, e);
        parW = anim.w0 + ((reading ? 0 : 1) - anim.w0) * e;
        if (anim.k === 1) { const r = anim.res; anim = null; parW = reading ? 0 : 1; r(); }
        applyCamera();
        return true;
      }
      if (!reading && par.distanceToSquared(parGoal) > 1e-6) {
        par.lerp(parGoal, 1 - Math.exp(-dt * 3));
        applyCamera();
        return true;
      }
      return false;
    },
  };
}
