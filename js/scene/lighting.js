import * as THREE from 'three';

// Starting values from the spec; tuned during the look test.
export const PRESETS = {
  day: {
    sky: '#E9ECE4', hemiSky: '#F4F5F0', hemiGround: '#C9CDBF', hemi: 1.6, sun: '#FFF6E6', sunI: 1.5, sunPos: [-4, 9, 6], shadow: 0.75,
    orb: '#EFE2B4', orbScale: 2.6, orbY: 2.1,
    gravel: '#E1E4DB', rake: '#D2D6CA', moss: '#93A68B', stone: '#9AA094', frame: '#FFFFFF', cell: '#2F3E63', leg: '#8A9283',
  },
  night: {
    sky: '#0B0F0D', hemiSky: '#46536E', hemiGround: '#101412', hemi: 2.1, sun: '#C9D4E8', sunI: 1.6, sunPos: [3, 9, 5], shadow: 0.45,
    orb: '#E6E9E4', orbScale: 0.75, orbY: 3.6,
    gravel: '#232A26', rake: '#37413B', moss: '#3A4E41', stone: '#4C5650', frame: '#4A5650', cell: '#2A3C6E', leg: '#55605A',
  },
};

const colours = p => Object.fromEntries(Object.entries(p).filter(([, v]) => typeof v === 'string').map(([k, v]) => [k, new THREE.Color(v)]));

export function createLighting(scene, panel, garden) {
  const hemi = new THREE.HemisphereLight();
  const sun = new THREE.DirectionalLight();
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 8, top: 6, bottom: -4, near: 1, far: 30 });
  sun.shadow.bias = -0.0005;
  scene.add(hemi, sun, sun.target);
  scene.background = new THREE.Color();
  scene.fog = new THREE.Fog(0x000000, 11, 25);   // far edge of the 30 m ground plane is fully fogged

  const A = colours(PRESETS.day), B = colours(PRESETS.night);
  const pa = new THREE.Vector3(...PRESETS.day.sunPos), pb = new THREE.Vector3(...PRESETS.night.sunPos);
  let mix = 0, from = 0, to = 0, k = 1;
  const DUR = 0.6;

  function apply(m) {
    const C = key => A[key].clone().lerp(B[key], m);
    const N = key => PRESETS.day[key] + (PRESETS.night[key] - PRESETS.day[key]) * m;
    scene.background.copy(C('sky'));
    scene.fog.color.copy(C('sky'));
    hemi.color.copy(C('hemiSky')); hemi.groundColor.copy(C('hemiGround')); hemi.intensity = N('hemi');
    sun.color.copy(C('sun')); sun.intensity = N('sunI'); sun.position.lerpVectors(pa, pb, m);
    sun.shadow.intensity = N('shadow');
    panel.setColors({ frame: C('frame'), cell: C('cell'), leg: C('leg') });
    garden.setColors({ gravel: C('gravel'), rake: C('rake'), moss: C('moss'), stone: C('stone'), orb: C('orb') });
    garden.setOrb(N('orbScale'), N('orbY'));
  }

  return {
    set(theme, instant) {
      to = theme === 'night' ? 1 : 0;
      from = mix;
      k = instant ? 1 : 0;
      if (instant) { mix = to; apply(mix); }
    },
    tick(dt) {
      if (k >= 1) return false;
      k = Math.min(1, k + dt / DUR);
      mix = from + (to - from) * k;
      apply(mix);
      return true;
    },
  };
}
