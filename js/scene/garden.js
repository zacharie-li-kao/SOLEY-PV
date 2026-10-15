import * as THREE from 'three';

export const STONE_POS = new THREE.Vector3(3.3, 0, 1.2);
const SIZE = 40, PX = 2048;   // the ground runs past the sun disc (z = -16) so the horizon cuts it cleanly

// Straight rake lines broken by concentric rings around the main stone (the GUI ripple, in 3D).
function rakeTexture() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = PX;
  const g = cv.getContext('2d'), k = PX / SIZE;
  const sx = (STONE_POS.x + SIZE / 2) * k, sy = (STONE_POS.z + SIZE / 2) * k;
  const step = 0.13 * k, ringMax = 2.4 * k;
  g.strokeStyle = '#fff';
  g.lineWidth = 1.6;
  g.beginPath();
  for (let y = step / 2; y < PX; y += step) {
    const dy = y - sy;
    if (Math.abs(dy) >= ringMax) { g.moveTo(0, y); g.lineTo(PX, y); continue; }
    const dx = Math.sqrt(ringMax * ringMax - dy * dy);
    g.moveTo(0, y); g.lineTo(sx - dx, y);
    g.moveTo(sx + dx, y); g.lineTo(PX, y);
  }
  for (let r = 0.75 * k; r <= ringMax; r += step) { g.moveTo(sx + r, sy); g.arc(sx, sy, r, 0, Math.PI * 2); }
  g.stroke();
  const t = new THREE.CanvasTexture(cv);
  t.anisotropy = 8;
  return t;
}

function stoneGeometry(seed) {
  const geo = new THREE.IcosahedronGeometry(1, 6), p = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    v.multiplyScalar(1 + 0.08 * Math.sin(v.x * 3.1 + seed) * Math.cos(v.y * 2.7 - seed) + 0.05 * Math.sin(v.z * 5.3 + seed * 2));
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createGarden() {
  const group = new THREE.Group();
  const plane = new THREE.PlaneGeometry(SIZE, SIZE);

  const gravelMat = new THREE.MeshStandardMaterial({ roughness: 1 });
  const ground = new THREE.Mesh(plane, gravelMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  const rakeMat = new THREE.MeshStandardMaterial({ roughness: 1, alphaMap: rakeTexture(), transparent: true, depthWrite: false });
  const rake = new THREE.Mesh(plane, rakeMat);
  rake.rotation.x = -Math.PI / 2;
  rake.position.y = 0.002;
  rake.receiveShadow = true;

  const mossMat = new THREE.MeshStandardMaterial({ roughness: 1 });
  const mound = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), mossMat);
  mound.scale.set(2.1, 0.34, 1.3);
  mound.position.set(0, -0.1, 0.1);
  mound.receiveShadow = true;

  const stoneMat = new THREE.MeshStandardMaterial({ roughness: 0.95 });
  const stone = (seed, pos, scale) => {
    const m = new THREE.Mesh(stoneGeometry(seed), stoneMat);
    m.position.copy(pos);
    m.scale.set(...scale);
    m.castShadow = m.receiveShadow = true;
    return m;
  };

  const orbMat = new THREE.MeshBasicMaterial({ fog: false });
  const orb = new THREE.Mesh(new THREE.CircleGeometry(1, 96), orbMat);
  orb.position.set(2.4, 2.4, -16);

  group.add(ground, rake, mound, orb,
    stone(1.3, STONE_POS.clone().setY(0.12), [0.55, 0.32, 0.45]),
    stone(4.1, new THREE.Vector3(4.6, 0.04, 2.3), [0.22, 0.12, 0.18]));

  return {
    group,
    setColors({ gravel, rake, moss, stone, orb }) {
      gravelMat.color.copy(gravel); rakeMat.color.copy(rake); mossMat.color.copy(moss);
      stoneMat.color.copy(stone); orbMat.color.copy(orb);
    },
    setOrb(scale, y) { orb.scale.setScalar(scale); orb.position.y = y; },
  };
}
