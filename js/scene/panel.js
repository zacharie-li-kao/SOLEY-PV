import * as THREE from 'three';

const CELL = 0.56, GAP = 0.12, PAD = 0.18, COLS = 3, ROWS = 4;
export const PANEL_W = PAD * 2 + COLS * CELL + (COLS - 1) * GAP;   // 2.28
export const PANEL_H = PAD * 2 + ROWS * CELL + (ROWS - 1) * GAP;   // 2.96
const LEG_H = 0.55, TILT = -0.14, WHITE = new THREE.Color('#ffffff'), LIT = new THREE.Color('#5E7FC4');

function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

const slab = (w, h, r, depth) => new THREE.ExtrudeGeometry(roundedRect(w, h, r), {
  depth, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 8,
});

// The logo panel: rounded frame, 12 cells, two legs. Origin on the ground between the legs.
export function createPanel() {
  const group = new THREE.Group(), board = new THREE.Group();
  board.position.y = LEG_H + PANEL_H / 2;
  board.rotation.x = TILT;
  group.add(board);

  const frameMat = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 });
  const frame = new THREE.Mesh(slab(PANEL_W, PANEL_H, 0.18, 0.06), frameMat);
  frame.castShadow = frame.receiveShadow = true;
  board.add(frame);

  const cellGeo = slab(CELL, CELL, 0.07, 0.015);
  const cells = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const m = new THREE.Mesh(cellGeo, new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.15 }));
    const c = i % COLS, r = Math.floor(i / COLS);
    m.position.set(-PANEL_W / 2 + PAD + CELL / 2 + c * (CELL + GAP), PANEL_H / 2 - PAD - CELL / 2 - r * (CELL + GAP), 0.07);
    m.receiveShadow = true;
    board.add(m);
    cells.push(m);
  }

  const legMat = new THREE.MeshStandardMaterial({ roughness: 0.9 });
  for (const x of [-0.42, 0.42]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.13, LEG_H + 0.3, 0.1), legMat);
    leg.position.set(x, (LEG_H + 0.3) / 2 - 0.1, -0.05);
    leg.castShadow = true;
    group.add(leg);
  }

  const cellColor = new THREE.Color();
  let hovered = -1, active = -1;
  // The open section's cell turns a clearer blue (the logo blue); a hover only lightens slightly.
  const paint = () => cells.forEach((m, i) => {
    m.material.color.copy(cellColor);
    if (i === active) m.material.color.lerp(LIT, 0.55);
    else if (i === hovered) m.material.color.lerp(WHITE, 0.1);
  });
  const h = CELL / 2;

  return {
    group,
    count: cells.length,
    setColors({ frame, cell, leg }) { frameMat.color.copy(frame); legMat.color.copy(leg); cellColor.copy(cell); paint(); },
    setHover(i) { hovered = i; paint(); },
    setActive(i) { active = i; paint(); },
    cellCorners(i) {
      const m = cells[i];
      m.updateWorldMatrix(true, false);
      return [[-h, -h], [h, -h], [h, h], [-h, h]].map(([x, y]) => m.localToWorld(new THREE.Vector3(x, y, 0.03)));
    },
    centre() { board.updateWorldMatrix(true, false); return board.getWorldPosition(new THREE.Vector3()); },
  };
}
