// Meshes for projectiles, traps and held props. Each prop is ~0.5 units, travelling along +X.

import * as THREE from 'three';
import type { PropStyle } from '../game/types';
import { additive, toon } from './materials';

type P3 = [number, number, number];

function add(g: THREE.Object3D, geo: THREE.BufferGeometry, color: number | THREE.Material, pos: P3 = [0, 0, 0], rot: P3 = [0, 0, 0], scale?: P3): THREE.Mesh {
  const m = new THREE.Mesh(geo, typeof color === 'number' ? toon(color) : color);
  m.position.set(...pos);
  m.rotation.set(...rot);
  if (scale) m.scale.set(...scale);
  m.castShadow = true;
  g.add(m);
  return m;
}

function textPlane(text: string, color: string, bg: string, w: number, h: number): THREE.Mesh {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = Math.round((256 * h) / w);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = color;
  ctx.font = `bold ${Math.round(c.height * 0.55)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, c.width / 2, c.height / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
}

const hasDOM = typeof document !== 'undefined';

export function buildProp(style: PropStyle, color: number): THREE.Group {
  const g = new THREE.Group();
  switch (style) {
    case 'orb':
    default:
      add(g, new THREE.SphereGeometry(0.22, 16, 12), additive(color, 0.9));
      add(g, new THREE.SphereGeometry(0.12, 12, 10), additive(0xffffff, 1));
      break;
    case 'ballot': {
      add(g, new THREE.BoxGeometry(0.4, 0.34, 0.34), 0x3b6fd8);
      add(g, new THREE.BoxGeometry(0.2, 0.02, 0.06), 0x111111, [0, 0.175, 0]);
      add(g, new THREE.BoxGeometry(0.14, 0.12, 0.005), 0xffffff, [0, 0.24, 0], [0, 0, 0.1]);
      break;
    }
    case 'gavel': {
      add(g, new THREE.CylinderGeometry(0.09, 0.09, 0.3, 12), 0x7a4a24, [0, 0.12, 0], [0, 0, Math.PI / 2]);
      add(g, new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8), 0x9c6b3b, [0, -0.08, 0]);
      add(g, new THREE.CylinderGeometry(0.1, 0.1, 0.03, 12), 0xd4a052, [0.155, 0.12, 0], [0, 0, Math.PI / 2]);
      add(g, new THREE.CylinderGeometry(0.1, 0.1, 0.03, 12), 0xd4a052, [-0.155, 0.12, 0], [0, 0, Math.PI / 2]);
      break;
    }
    case 'book': {
      add(g, new THREE.BoxGeometry(0.36, 0.46, 0.1), color);
      add(g, new THREE.BoxGeometry(0.34, 0.44, 0.08), 0xf5f0e0, [0.015, 0, 0]);
      break;
    }
    case 'paper': {
      add(g, new THREE.BoxGeometry(0.34, 0.44, 0.01), 0xffffff);
      for (let i = 0; i < 5; i++) add(g, new THREE.BoxGeometry(0.24, 0.02, 0.012), 0x777777, [0, 0.14 - i * 0.07, 0.002]);
      add(g, new THREE.BoxGeometry(0.1, 0.06, 0.014), color, [0.08, -0.17, 0.003]);
      break;
    }
    case 'coin': case 'shekel': {
      add(g, new THREE.CylinderGeometry(0.22, 0.22, 0.05, 20), 0xf2c14e, [0, 0, 0], [Math.PI / 2, 0, 0]);
      add(g, new THREE.TorusGeometry(0.2, 0.02, 6, 20), 0xd4a017);
      if (hasDOM) {
        const t = textPlane('₪', '#8a6500', 'rgba(0,0,0,0)', 0.28, 0.28);
        (t.material as THREE.MeshBasicMaterial).transparent = true;
        t.position.z = 0.03;
        g.add(t);
      }
      break;
    }
    case 'mic': {
      add(g, new THREE.SphereGeometry(0.11, 12, 10), 0x444444, [0.18, 0, 0]);
      add(g, new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10), 0x111111, [0, 0, 0], [0, 0, Math.PI / 2]);
      if (hasDOM) {
        const t = textPlane('NEWS', '#ffffff', '#' + color.toString(16).padStart(6, '0'), 0.14, 0.07);
        t.position.set(0.05, 0.07, 0);
        g.add(t);
      }
      break;
    }
    case 'tv': {
      add(g, new THREE.BoxGeometry(0.5, 0.36, 0.18), 0x222222);
      add(g, new THREE.PlaneGeometry(0.42, 0.28), additive(color, 0.9), [0, 0, 0.091]);
      add(g, new THREE.CylinderGeometry(0.008, 0.008, 0.25, 6), 0x999999, [0.08, 0.28, 0], [0, 0, -0.5]);
      add(g, new THREE.CylinderGeometry(0.008, 0.008, 0.25, 6), 0x999999, [-0.08, 0.28, 0], [0, 0, 0.5]);
      break;
    }
    case 'envelope': {
      add(g, new THREE.BoxGeometry(0.44, 0.28, 0.03), 0xf4efe1);
      add(g, new THREE.ConeGeometry(0.22, 0.14, 4), 0xe0d8c0, [0, 0.06, 0.02], [Math.PI, Math.PI / 4, 0], [1.4, 1, 0.1]);
      add(g, new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12), 0xb81d24, [0, 0, 0.02], [Math.PI / 2, 0, 0]);
      break;
    }
    case 'phone': {
      add(g, new THREE.BoxGeometry(0.22, 0.42, 0.04), 0x1a1a1a);
      add(g, new THREE.PlaneGeometry(0.19, 0.36), additive(color, 1), [0, 0, 0.021]);
      break;
    }
    case 'bomb': {
      add(g, new THREE.SphereGeometry(0.24, 18, 14), 0x1a1a1a);
      add(g, new THREE.CylinderGeometry(0.06, 0.06, 0.08, 10), 0x444444, [0, 0.26, 0]);
      add(g, new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6), 0xc8a06a, [0.03, 0.34, 0], [0, 0, -0.4]);
      add(g, new THREE.SphereGeometry(0.04, 8, 6), additive(0xffaa00, 1), [0.06, 0.4, 0]);
      add(g, new THREE.TorusGeometry(0.245, 0.02, 6, 24, Math.PI * 0.9), 0xff2222, [0, 0, 0], [0, 0, -Math.PI * 0.1]);
      break;
    }
    case 'plane': {
      const s = new THREE.Shape();
      s.moveTo(0.3, 0);
      s.lineTo(-0.25, 0.2);
      s.lineTo(-0.15, 0);
      s.lineTo(-0.25, -0.2);
      s.closePath();
      const m = add(g, new THREE.ShapeGeometry(s), new THREE.MeshToonMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
      m.rotation.x = Math.PI / 2;
      add(g, new THREE.BoxGeometry(0.5, 0.02, 0.02), 0xdddddd, [0.02, -0.03, 0]);
      break;
    }
    case 'jet': {
      add(g, new THREE.CylinderGeometry(0.06, 0.08, 0.6, 10), 0x7a8a99, [0, 0, 0], [0, 0, -Math.PI / 2]);
      add(g, new THREE.ConeGeometry(0.06, 0.18, 10), 0x55606b, [0.39, 0, 0], [0, 0, -Math.PI / 2]);
      add(g, new THREE.BoxGeometry(0.28, 0.02, 0.6), 0x6a7a89, [-0.04, 0, 0]);
      add(g, new THREE.BoxGeometry(0.12, 0.18, 0.02), 0x6a7a89, [-0.26, 0.09, 0]);
      add(g, new THREE.SphereGeometry(0.06, 8, 6), additive(0xff9900, 0.9), [-0.33, 0, 0]);
      break;
    }
    case 'tomato': {
      add(g, new THREE.SphereGeometry(0.2, 16, 12), 0xe0302e, [0, 0, 0], [0, 0, 0], [1, 0.85, 1]);
      add(g, new THREE.ConeGeometry(0.08, 0.06, 5), 0x2f8a2f, [0, 0.18, 0]);
      break;
    }
    case 'watermelon': {
      add(g, new THREE.SphereGeometry(0.26, 18, 14), 0x2d7a2d, [0, 0, 0], [0, 0, 0], [1.25, 1, 1]);
      for (let i = 0; i < 6; i++) add(g, new THREE.TorusGeometry(0.262, 0.012, 4, 24, Math.PI), 0x1b4d1b, [0, 0, 0], [0, (i / 6) * Math.PI, Math.PI / 2], [1, 1.25, 1]);
      break;
    }
    case 'brick': {
      add(g, new THREE.BoxGeometry(0.44, 0.2, 0.22), 0xb5462f);
      add(g, new THREE.BoxGeometry(0.46, 0.02, 0.24), 0xcfc6b8, [0, 0.1, 0]);
      break;
    }
    case 'bin': {
      add(g, new THREE.CylinderGeometry(0.2, 0.16, 0.42, 14), 0x2d8a4f);
      add(g, new THREE.CylinderGeometry(0.22, 0.22, 0.04, 14), 0x24703f, [0, 0.23, 0]);
      if (hasDOM) {
        const t = textPlane('♻', '#ffffff', 'rgba(0,0,0,0)', 0.2, 0.2);
        (t.material as THREE.MeshBasicMaterial).transparent = true;
        t.position.set(0, 0, 0.19);
        g.add(t);
      }
      break;
    }
    case 'cone': {
      add(g, new THREE.ConeGeometry(0.2, 0.55, 14), 0xff7b00, [0, 0.22, 0]);
      add(g, new THREE.CylinderGeometry(0.155, 0.13, 0.08, 14), 0xffffff, [0, 0.2, 0]);
      add(g, new THREE.BoxGeometry(0.44, 0.04, 0.44), 0xff7b00, [0, -0.04, 0]);
      break;
    }
    case 'train': {
      add(g, new THREE.BoxGeometry(0.8, 0.36, 0.3), color);
      add(g, new THREE.BoxGeometry(0.82, 0.12, 0.31), 0xdedede, [0, 0.1, 0]);
      for (let i = 0; i < 3; i++) add(g, new THREE.BoxGeometry(0.16, 0.1, 0.32), additive(0x9fe0ff, 0.8), [-0.25 + i * 0.25, 0.1, 0]);
      add(g, new THREE.SphereGeometry(0.19, 12, 10), color, [0.4, -0.02, 0], [0, 0, 0], [0.6, 0.9, 0.8]);
      add(g, new THREE.SphereGeometry(0.035, 8, 6), additive(0xffffaa, 1), [0.5, -0.06, 0.1]);
      add(g, new THREE.SphereGeometry(0.035, 8, 6), additive(0xffffaa, 1), [0.5, -0.06, -0.1]);
      break;
    }
    case 'tank': {
      add(g, new THREE.BoxGeometry(0.7, 0.2, 0.42), 0x4b5320, [0, -0.05, 0]);
      add(g, new THREE.BoxGeometry(0.34, 0.14, 0.3), 0x5a6428, [-0.04, 0.12, 0]);
      add(g, new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), 0x3a4218, [0.3, 0.14, 0], [0, 0, Math.PI / 2]);
      add(g, new THREE.BoxGeometry(0.76, 0.12, 0.1), 0x222222, [0, -0.15, 0.2]);
      add(g, new THREE.BoxGeometry(0.76, 0.12, 0.1), 0x222222, [0, -0.15, -0.2]);
      break;
    }
    case 'syringe': {
      add(g, new THREE.CylinderGeometry(0.06, 0.06, 0.34, 12), new THREE.MeshToonMaterial({ color: 0xe8f7ff, transparent: true, opacity: 0.75 }), [0, 0, 0], [0, 0, Math.PI / 2]);
      add(g, new THREE.CylinderGeometry(0.05, 0.05, 0.24, 10), additive(color, 0.9), [0.03, 0, 0], [0, 0, Math.PI / 2]);
      add(g, new THREE.CylinderGeometry(0.006, 0.006, 0.16, 6), 0xcccccc, [0.25, 0, 0], [0, 0, Math.PI / 2]);
      add(g, new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6), 0x999999, [-0.22, 0, 0], [0, 0, Math.PI / 2]);
      break;
    }
    case 'sign': {
      add(g, new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), 0x9c6b3b, [0, -0.22, 0]);
      add(g, new THREE.BoxGeometry(0.5, 0.34, 0.02), 0xffffff, [0, 0.14, 0]);
      if (hasDOM) {
        const t = textPlane('VOTE!', '#' + color.toString(16).padStart(6, '0'), '#ffffff', 0.46, 0.3);
        t.position.set(0, 0.14, 0.012);
        g.add(t);
      }
      break;
    }
    case 'megaphone': {
      add(g, new THREE.CylinderGeometry(0.2, 0.06, 0.4, 14, 1, true), new THREE.MeshToonMaterial({ color: 0xf2f2f2, side: THREE.DoubleSide }), [0.05, 0, 0], [0, 0, -Math.PI / 2]);
      add(g, new THREE.TorusGeometry(0.2, 0.02, 6, 20), color, [0.25, 0, 0], [0, Math.PI / 2, 0]);
      add(g, new THREE.BoxGeometry(0.05, 0.14, 0.05), 0x333333, [-0.08, -0.1, 0]);
      break;
    }
    case 'chalk': {
      add(g, new THREE.CylinderGeometry(0.035, 0.035, 0.26, 8), 0xffffff, [0, 0, 0], [0, 0, Math.PI / 2]);
      add(g, new THREE.SphereGeometry(0.12, 8, 6), additive(0xffffff, 0.35), [-0.12, 0, 0]);
      break;
    }
    case 'scissors': {
      add(g, new THREE.BoxGeometry(0.4, 0.04, 0.02), 0xcfd8dc, [0.1, 0.02, 0], [0, 0, 0.2]);
      add(g, new THREE.BoxGeometry(0.4, 0.04, 0.02), 0xcfd8dc, [0.1, -0.02, 0.01], [0, 0, -0.2]);
      add(g, new THREE.TorusGeometry(0.06, 0.018, 6, 12), color, [-0.14, 0.07, 0]);
      add(g, new THREE.TorusGeometry(0.06, 0.018, 6, 12), color, [-0.14, -0.07, 0]);
      break;
    }
    case 'tooth': {
      add(g, new THREE.SphereGeometry(0.2, 14, 10), 0xffffff, [0, 0.06, 0], [0, 0, 0], [1, 0.8, 0.9]);
      add(g, new THREE.ConeGeometry(0.07, 0.24, 8), 0xf4f4f4, [-0.08, -0.14, 0], [Math.PI, 0, 0.2]);
      add(g, new THREE.ConeGeometry(0.07, 0.24, 8), 0xf4f4f4, [0.08, -0.14, 0], [Math.PI, 0, -0.2]);
      break;
    }
    case 'drill': {
      add(g, new THREE.BoxGeometry(0.22, 0.14, 0.12), 0x2a9d8f);
      add(g, new THREE.BoxGeometry(0.08, 0.2, 0.1), 0x264653, [-0.06, -0.14, 0]);
      add(g, new THREE.ConeGeometry(0.035, 0.24, 8), 0xcccccc, [0.22, 0, 0], [0, 0, -Math.PI / 2]);
      break;
    }
    case 'star': {
      const s = new THREE.Shape();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 0.26 : 0.11;
        const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
        if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      s.closePath();
      add(g, new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: false }), 0xffd60a, [0, 0, -0.03]);
      break;
    }
    case 'flag': {
      add(g, new THREE.CylinderGeometry(0.015, 0.015, 0.7, 6), 0xdddddd, [-0.2, -0.1, 0]);
      add(g, new THREE.BoxGeometry(0.42, 0.28, 0.01), 0xffffff, [0.02, 0.1, 0]);
      add(g, new THREE.BoxGeometry(0.42, 0.04, 0.012), color, [0.02, 0.2, 0]);
      add(g, new THREE.BoxGeometry(0.42, 0.04, 0.012), color, [0.02, 0.0, 0]);
      break;
    }
    case 'wave': {
      const m = add(g, new THREE.TorusGeometry(0.3, 0.07, 8, 20, Math.PI), additive(color, 0.85), [0, -0.05, 0], [0, Math.PI / 2, 0]);
      m.scale.set(1, 1, 1.4);
      add(g, new THREE.TorusGeometry(0.2, 0.05, 8, 16, Math.PI), additive(0xffffff, 0.8), [0.05, -0.05, 0], [0, Math.PI / 2, 0]);
      break;
    }
    case 'sound': {
      for (let i = 0; i < 3; i++) {
        add(g, new THREE.TorusGeometry(0.12 + i * 0.07, 0.022, 6, 20, Math.PI * 0.8), additive(color, 0.9 - i * 0.2), [i * 0.07, 0, 0], [0, Math.PI / 2, Math.PI * 0.6]);
      }
      break;
    }
    case 'dish': {
      add(g, new THREE.SphereGeometry(0.24, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.35), new THREE.MeshToonMaterial({ color: 0xf0f0f0, side: THREE.DoubleSide }), [0, 0, 0], [0, 0, -Math.PI / 2]);
      add(g, new THREE.CylinderGeometry(0.01, 0.01, 0.2, 6), 0x777777, [0.1, 0, 0], [0, 0, Math.PI / 2]);
      add(g, new THREE.SphereGeometry(0.04, 8, 6), additive(color, 1), [0.2, 0, 0]);
      break;
    }
    case 'briefcase': {
      add(g, new THREE.BoxGeometry(0.46, 0.32, 0.12), 0x5b3a1e);
      add(g, new THREE.TorusGeometry(0.06, 0.015, 6, 12, Math.PI), 0x2a1a0e, [0, 0.16, 0]);
      add(g, new THREE.BoxGeometry(0.05, 0.04, 0.13), 0xd4a052, [0, 0.08, 0]);
      break;
    }
    case 'siren': {
      add(g, new THREE.CylinderGeometry(0.16, 0.18, 0.08, 14), 0x333333, [0, -0.1, 0]);
      add(g, new THREE.SphereGeometry(0.15, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), additive(color, 0.95), [0, -0.06, 0]);
      add(g, new THREE.SphereGeometry(0.28, 12, 10), additive(color, 0.25), [0, 0, 0]);
      break;
    }
    case 'tower': {
      add(g, new THREE.CylinderGeometry(0.02, 0.12, 0.8, 4, 1), 0xbfc7cf, [0, 0.3, 0]);
      for (let i = 0; i < 3; i++) add(g, new THREE.TorusGeometry(0.1 + i * 0.07, 0.012, 4, 16, Math.PI * 0.6), additive(color, 0.9), [0, 0.7, 0], [0, 0, Math.PI * 0.2]);
      add(g, new THREE.SphereGeometry(0.04, 8, 6), additive(0xff3355, 1), [0, 0.72, 0]);
      break;
    }
    case 'ball': {
      add(g, new THREE.SphereGeometry(0.2, 16, 12), 0xffffff);
      for (let i = 0; i < 3; i++) add(g, new THREE.TorusGeometry(0.2, 0.012, 4, 20), 0x111111, [0, 0, 0], [0, (i * Math.PI) / 3, 0]);
      break;
    }
    case 'whistle': {
      add(g, new THREE.CylinderGeometry(0.1, 0.1, 0.12, 12), 0xc0c0c0, [0, 0, 0], [Math.PI / 2, 0, 0]);
      add(g, new THREE.BoxGeometry(0.2, 0.06, 0.08), 0xb0b0b0, [0.12, 0.05, 0]);
      break;
    }
    case 'fire': {
      add(g, new THREE.ConeGeometry(0.2, 0.5, 10), additive(color, 0.9), [0, 0.05, 0], [0, 0, -Math.PI / 2]);
      add(g, new THREE.SphereGeometry(0.2, 12, 10), additive(0xffdd55, 0.9), [0.1, 0, 0]);
      add(g, new THREE.SphereGeometry(0.1, 10, 8), additive(0xffffff, 1), [0.12, 0, 0]);
      break;
    }
    case 'snowflake': {
      for (let i = 0; i < 3; i++) add(g, new THREE.BoxGeometry(0.46, 0.04, 0.04), additive(color, 0.95), [0, 0, 0], [0, 0, (i * Math.PI) / 3]);
      add(g, new THREE.SphereGeometry(0.2, 12, 10), additive(0xffffff, 0.25));
      break;
    }
    case 'leaf': {
      add(g, new THREE.SphereGeometry(0.22, 12, 8), 0x55a630, [0, 0, 0], [0, 0, 0.6], [1, 0.45, 0.12]);
      add(g, new THREE.BoxGeometry(0.4, 0.015, 0.02), 0x2b7a0b, [0, 0, 0], [0, 0, 0.6]);
      break;
    }
    case 'heart': {
      add(g, new THREE.SphereGeometry(0.12, 12, 10), color, [-0.08, 0.06, 0]);
      add(g, new THREE.SphereGeometry(0.12, 12, 10), color, [0.08, 0.06, 0]);
      add(g, new THREE.ConeGeometry(0.17, 0.24, 12), color, [0, -0.1, 0], [Math.PI, 0, 0]);
      break;
    }
    case 'shield': {
      add(g, new THREE.CylinderGeometry(0.25, 0.25, 0.04, 20), color, [0, 0, 0], [Math.PI / 2, 0, 0]);
      add(g, new THREE.TorusGeometry(0.25, 0.03, 6, 20), 0xd4a052);
      break;
    }
    case 'crane': {
      add(g, new THREE.BoxGeometry(0.06, 0.8, 0.06), 0xffba08, [0, 0.3, 0]);
      add(g, new THREE.BoxGeometry(0.7, 0.05, 0.05), 0xffba08, [0.2, 0.68, 0]);
      add(g, new THREE.CylinderGeometry(0.005, 0.005, 0.3, 4), 0x333333, [0.45, 0.52, 0]);
      add(g, new THREE.BoxGeometry(0.16, 0.08, 0.08), 0xb5462f, [0.45, 0.35, 0]);
      add(g, new THREE.BoxGeometry(0.36, 0.06, 0.36), 0x555555, [0, -0.08, 0]);
      break;
    }
    case 'map': {
      add(g, new THREE.BoxGeometry(0.5, 0.02, 0.36), 0xe9dcb5);
      add(g, new THREE.ConeGeometry(0.04, 0.12, 8), 0xd62828, [0.1, 0.07, 0.05], [Math.PI, 0, 0]);
      add(g, new THREE.ConeGeometry(0.04, 0.12, 8), 0x1d4ed8, [-0.12, 0.07, -0.06], [Math.PI, 0, 0]);
      add(g, new THREE.BoxGeometry(0.3, 0.022, 0.015), 0x588157, [0, 0.005, 0.02], [0, 0.4, 0]);
      break;
    }
    case 'clock': {
      add(g, new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20), 0xffffff, [0, 0.22, 0], [Math.PI / 2, 0, 0]);
      add(g, new THREE.TorusGeometry(0.22, 0.025, 6, 20), color, [0, 0.22, 0]);
      add(g, new THREE.BoxGeometry(0.02, 0.14, 0.02), 0x111111, [0, 0.27, 0.035]);
      add(g, new THREE.BoxGeometry(0.1, 0.02, 0.02), 0x111111, [0.05, 0.22, 0.035]);
      break;
    }
    case 'chair': {
      add(g, new THREE.BoxGeometry(0.34, 0.05, 0.34), 0x1f4f99, [0, 0, 0]);
      add(g, new THREE.BoxGeometry(0.34, 0.36, 0.05), 0x1f4f99, [0, 0.2, -0.15]);
      for (const x of [-0.14, 0.14]) for (const z of [-0.14, 0.14]) add(g, new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), 0x444444, [x, -0.17, z]);
      break;
    }
    case 'laptop': {
      add(g, new THREE.BoxGeometry(0.46, 0.02, 0.32), 0xb0b7c0, [0, -0.1, 0]);
      add(g, new THREE.BoxGeometry(0.46, 0.3, 0.02), 0xb0b7c0, [0, 0.05, -0.16], [-0.25, 0, 0]);
      add(g, new THREE.PlaneGeometry(0.42, 0.26), additive(color, 1), [0, 0.05, -0.145], [-0.25, 0, 0]);
      break;
    }
  }
  return g;
}
