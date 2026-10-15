import * as THREE from 'three';

const MAX = 3;
const rand = (a, b) => a + Math.random() * (b - a);

function glowTexture() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const g = cv.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.15, 'rgba(255,255,255,0.8)');
  gr.addColorStop(0.4, 'rgba(255,255,255,0.15)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(cv);
}

// Either side of the panel, near the ground; never in front of it.
function spawnPoint() {
  const left = Math.random() < 0.45;
  return new THREE.Vector3(left ? rand(-6.5, -2) : rand(2.2, 7.5), rand(0.25, 1.3), rand(-1, 3));
}

export function createFireflies(scene) {
  const tex = glowTexture();
  const flies = Array.from({ length: MAX }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, color: '#E3EFA0', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
    }));
    s.scale.setScalar(0.22);
    s.visible = false;
    scene.add(s);
    return { s, life: 0, dur: 0, wait: rand(1, 6) * (i + 1), vel: new THREE.Vector3(), phase: 0 };
  });
  let enabled = false;

  return {
    setEnabled(on) {
      enabled = on;
      if (!on) flies.forEach(f => { f.s.visible = false; f.s.material.opacity = 0; });
    },
    tick(dt, time) {
      if (!enabled) return false;
      let active = false;
      for (const f of flies) {
        if (!f.s.visible) {
          f.wait -= dt;
          if (f.wait > 0) continue;
          f.s.position.copy(spawnPoint());
          f.vel.set(rand(-0.12, 0.12), rand(-0.03, 0.05), rand(-0.08, 0.08));
          Object.assign(f, { dur: rand(4, 7), life: 0, phase: rand(0, 6.28) });
          f.s.visible = true;
        }
        f.life += dt;
        const k = f.life / f.dur;
        active = true;
        if (k >= 1) { f.s.visible = false; f.s.material.opacity = 0; f.wait = rand(3, 10); continue; }
        f.s.position.addScaledVector(f.vel, dt);
        f.s.position.y += Math.sin(time * 1.3 + f.phase) * 0.002;
        f.s.material.opacity = Math.sin(Math.PI * k) * (0.75 + 0.25 * Math.sin(time * 2.1 + f.phase));
      }
      return active;
    },
  };
}
