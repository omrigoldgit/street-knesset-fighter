// Signature kit: the Tekken-style extras that make an MK recognisable at a glance. Weapons they
// never put down (a judge's gavel, a TV microphone, the coalition whip), Kisch's jet wings, the
// Iron Dome drones that shadow Netanyahu, and Barkat's Lion of Jerusalem.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { HeldId } from '../data/signatures';
import type { Rig } from './characterModel';
import type { Effects } from './effects';
import { additive } from './materials';

export interface SigContext {
  dt: number;
  time: number;
  airborne: boolean;
  /** Doing a special move or Heat Smash. */
  special: boolean;
  /** 0..1 progress through the current move. */
  moveT: number;
  intro: boolean;
  victory: boolean;
  /** Menu / select-screen display. */
  showcase: boolean;
  /** Remaining Iron Dome interceptions (0 = shield down). */
  shieldHits: number;
  /** Heat gauge 0..100. */
  heat: number;
  /** A special's own prop is in this hand. */
  propHand: 'l' | 'r' | null;
  /** The whip special is lashing out. */
  lash: boolean;
  fx?: Effects;
}

type P3 = [number, number, number];
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const Y_UP = V(0, 1, 0);

function part(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, pos: P3 = [0, 0, 0], rot: P3 = [0, 0, 0], scale?: P3): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  if (scale) m.scale.set(...scale);
  m.castShadow = true;
  parent.add(m);
  return m;
}

/** Orients `o` so its +Y runs along `axis` and its +Z faces `face` (both in parent space). */
function orient(o: THREE.Object3D, axis: THREE.Vector3, face: THREE.Vector3): void {
  const y = axis.clone().normalize();
  const z = face.clone().sub(y.clone().multiplyScalar(face.dot(y))).normalize();
  const x = y.clone().cross(z);
  o.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

function labelTexture(lines: string[], fg: string, bg: string, w = 256, h = 320): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = fg;
  g.lineWidth = 8;
  g.strokeRect(14, 14, w - 28, h - 28);
  g.fillStyle = fg;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  lines.forEach((l, i) => {
    g.font = `bold ${i === 0 ? 46 : 30}px Arial, sans-serif`;
    g.fillText(l, w / 2, h * 0.36 + i * 58);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ------------------------------------------------------------------ held items

interface Held {
  group: THREE.Group;
  hand: 'l' | 'r';
  /** Hangs from the fist under gravity (briefcase). */
  pendulum?: { obj: THREE.Object3D; v: THREE.Vector3; dir: THREE.Vector3 };
  rope?: Rope;
}

/** Item models in item space: grip at the origin, the business end toward +Y, front face +Z. */
function buildHeldModel(id: HeldId, mats: THREE.Material[], std: (c: number, e?: THREE.MeshStandardMaterialParameters) => THREE.MeshStandardMaterial): THREE.Group {
  const g = new THREE.Group();
  const wood = std(0x6b3f1f, { roughness: 0.45 });
  const brass = std(0xd4a052, { metalness: 1, roughness: 0.3 });
  switch (id) {
    case 'gavel': {
      part(g, new THREE.CylinderGeometry(0.017, 0.022, 0.42, 12), wood, [0, 0.12, 0]);
      part(g, new THREE.CylinderGeometry(0.06, 0.06, 0.24, 20), wood, [0, 0.36, 0], [0, 0, Math.PI / 2]);
      for (const s of [-1, 1]) part(g, new THREE.CylinderGeometry(0.064, 0.064, 0.03, 20), brass, [s * 0.1, 0.36, 0], [0, 0, Math.PI / 2]);
      part(g, new THREE.SphereGeometry(0.024, 12, 8), brass, [0, -0.1, 0]);
      break;
    }
    case 'mic': {
      const black = std(0x16171a, { roughness: 0.35, metalness: 0.4 });
      part(g, new THREE.CylinderGeometry(0.02, 0.016, 0.2, 14), black, [0, 0.02, 0]);
      part(g, new THREE.SphereGeometry(0.036, 18, 12), std(0x9aa0a6, { metalness: 0.9, roughness: 0.45, wireframe: false }), [0, 0.15, 0]);
      // Channel flag: a coloured cube with the station logo.
      const tex = labelTexture(['TV', 'NEWS'], '#ffffff', '#1565c0', 128, 128);
      const flag = new THREE.MeshStandardMaterial({ color: tex ? 0xffffff : 0x1565c0, map: tex ?? undefined, roughness: 0.5 });
      mats.push(flag);
      part(g, new THREE.BoxGeometry(0.06, 0.05, 0.06), flag, [0, 0.085, 0]);
      break;
    }
    case 'megaphone': {
      const white = std(0xf1f1f1, { roughness: 0.4 });
      const red = std(0xd62828, { roughness: 0.4 });
      part(g, new THREE.CylinderGeometry(0.02, 0.022, 0.1, 12), std(0x222222), [0, 0.0, 0]);
      part(g, new THREE.CylinderGeometry(0.035, 0.035, 0.1, 16), white, [0, 0.08, -0.02]);
      part(g, new THREE.CylinderGeometry(0.11, 0.04, 0.2, 24, 1, true), white, [0, 0.22, -0.02]);
      part(g, new THREE.TorusGeometry(0.11, 0.008, 6, 24), red, [0, 0.32, -0.02], [Math.PI / 2, 0, 0]);
      part(g, new THREE.CircleGeometry(0.1, 24), std(0x333333, { side: THREE.DoubleSide }), [0, 0.14, -0.02], [-Math.PI / 2, 0, 0]);
      break;
    }
    case 'tome': {
      const tex = labelTexture(['חוקי יסוד', 'BASIC LAWS'], '#e9c46a', '#5a1f1f');
      const cover = new THREE.MeshStandardMaterial({ color: tex ? 0xffffff : 0x5a1f1f, map: tex ?? undefined, roughness: 0.6 });
      mats.push(cover);
      const leather = std(0x5a1f1f, { roughness: 0.6 });
      const pages = std(0xf3ead2, { roughness: 0.9 });
      part(g, new THREE.BoxGeometry(0.2, 0.27, 0.075), leather, [0, 0.12, 0]);
      part(g, new THREE.BoxGeometry(0.19, 0.26, 0.068), pages, [0.008, 0.12, 0]);
      part(g, new THREE.PlaneGeometry(0.19, 0.26), cover, [0, 0.12, 0.0385]);
      break;
    }
    case 'phone': {
      const body = std(0x1b1c20, { metalness: 0.6, roughness: 0.25 });
      const screen = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: 0x5aa9ff, emissiveIntensity: 0.9, roughness: 0.1 });
      mats.push(screen);
      part(g, new RoundedBoxGeometry(0.078, 0.155, 0.01, 2, 0.006), body, [0, 0.07, 0]);
      part(g, new THREE.PlaneGeometry(0.068, 0.138), screen, [0, 0.07, 0.0055]);
      break;
    }
    case 'briefcase': {
      const leather = std(0x3a2414, { roughness: 0.45 });
      part(g, new THREE.TorusGeometry(0.035, 0.009, 6, 16, Math.PI), std(0x1a1a1a), [0, 0.0, 0], [0, 0, 0]);
      part(g, new RoundedBoxGeometry(0.4, 0.3, 0.1, 3, 0.02), leather, [0, -0.18, 0]);
      for (const s of [-1, 1]) part(g, new THREE.BoxGeometry(0.03, 0.02, 0.105), brass, [s * 0.12, -0.04, 0]);
      const tex = labelTexture(['₪'], '#e9c46a', '#3a2414', 128, 128);
      if (tex) {
        const lbl = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5, transparent: true });
        mats.push(lbl);
        part(g, new THREE.PlaneGeometry(0.1, 0.1), lbl, [0, -0.18, 0.051]);
      }
      break;
    }
    case 'map': {
      const paper = std(0xe8dcb5, { roughness: 0.85 });
      const tie = std(0xa4161a);
      part(g, new THREE.CylinderGeometry(0.028, 0.028, 0.42, 16), paper, [0, 0.0, 0]);
      for (const y of [-0.12, 0.12]) part(g, new THREE.TorusGeometry(0.029, 0.004, 4, 16), tie, [0, y, 0], [Math.PI / 2, 0, 0]);
      break;
    }
    case 'whip': {
      const leather = std(0x2b1a10, { roughness: 0.5 });
      part(g, new THREE.CylinderGeometry(0.016, 0.02, 0.26, 10), leather, [0, 0.06, 0]);
      part(g, new THREE.SphereGeometry(0.024, 10, 8), brass, [0, -0.08, 0]);
      break;
    }
  }
  return g;
}

/** Grip pose per item in hand-bone space: axis and front face (fingers run to -Y, thumb side +Z). */
const GRIPS: Record<HeldId, { axis: P3; face: P3 }> = {
  gavel: { axis: [0, -0.8, -0.6], face: [1, 0, 0] },
  mic: { axis: [0, -0.9, 0.45], face: [1, 0, 0] },
  megaphone: { axis: [0, -0.35, -0.95], face: [0, 1, 0] },
  tome: { axis: [0, -1, 0.1], face: [0, 0, -1] },
  phone: { axis: [0, -1, 0.2], face: [0, 0.2, 1] },
  briefcase: { axis: [0, -1, 0], face: [1, 0, 0] },
  map: { axis: [0, 0, 1], face: [1, 0, 0] },
  whip: { axis: [0, -0.7, -0.7], face: [1, 0, 0] },
};

// ------------------------------------------------------------------ whip rope (verlet)

class Rope {
  readonly mesh: THREE.InstancedMesh;
  private pts: THREE.Vector3[] = [];
  private prev: THREE.Vector3[] = [];
  private primed = false;
  private readonly seg: number;
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly s = new THREE.Vector3(1, 1, 1);

  constructor(private count: number, length: number, mat: THREE.Material, private anchor: THREE.Object3D) {
    this.seg = length / count;
    this.mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.009, 0.011, 1, 6), mat, count);
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false;
    for (let i = 0; i <= count; i++) {
      this.pts.push(new THREE.Vector3());
      this.prev.push(new THREE.Vector3());
    }
  }

  update(dt: number, visible: boolean): void {
    this.mesh.visible = visible;
    if (!visible) {
      this.primed = false;
      return;
    }
    const a = this.anchor.getWorldPosition(new THREE.Vector3());
    const scale = this.anchor.getWorldScale(new THREE.Vector3()).x || 1;
    const seg = this.seg * scale;
    if (!this.primed || this.pts[0].distanceTo(a) > 2) {
      this.pts.forEach((p, i) => p.set(a.x, a.y - i * seg, a.z));
      this.prev.forEach((p, i) => p.copy(this.pts[i]));
      this.primed = true;
    }
    const h = Math.min(dt, 1 / 30);
    const g = 9.8 * h * h;
    for (let i = 1; i < this.pts.length; i++) {
      const p = this.pts[i];
      const v = p.clone().sub(this.prev[i]).multiplyScalar(0.985);
      this.prev[i].copy(p);
      p.add(v);
      p.y -= g;
      if (p.y < 0.01) p.y = 0.01;
    }
    this.pts[0].copy(a);
    for (let it = 0; it < 6; it++) {
      for (let i = 0; i < this.pts.length - 1; i++) {
        const p = this.pts[i];
        const q = this.pts[i + 1];
        const d = q.clone().sub(p);
        const l = d.length() || 1e-6;
        const diff = (l - seg) / l;
        if (i === 0) q.addScaledVector(d, -diff);
        else {
          p.addScaledVector(d, diff * 0.5);
          q.addScaledVector(d, -diff * 0.5);
        }
      }
      this.pts[0].copy(a);
    }
    // Instances live in world space: undo the parent's transform.
    const parentInv = new THREE.Matrix4().copy(this.mesh.parent!.matrixWorld).invert();
    for (let i = 0; i < this.count; i++) {
      const p = this.pts[i];
      const q = this.pts[i + 1];
      const d = q.clone().sub(p);
      const l = d.length();
      this.q.setFromUnitVectors(Y_UP, d.normalize());
      this.s.set(1, l, 1);
      this.m4.compose(p.clone().add(q).multiplyScalar(0.5), this.q, this.s).premultiply(parentInv);
      this.mesh.setMatrixAt(i, this.m4);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

// ------------------------------------------------------------------ wings

class Wings {
  readonly group = new THREE.Group();
  private pivots: THREE.Group[] = [];
  private flames: THREE.Mesh[] = [];
  private w = 0;
  private wv = 0;

  constructor(rig: Rig, mats: THREE.Material[], std: (c: number, e?: THREE.MeshStandardMaterialParameters) => THREE.MeshStandardMaterial) {
    const metal = std(0x8a949e, { metalness: 0.85, roughness: 0.32 });
    const dark = std(0x3a4148, { metalness: 0.7, roughness: 0.4 });
    // Wing planform: span along +X, leading edge toward +Z.
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.16);
    shape.lineTo(0.78, -0.08);
    shape.lineTo(0.84, -0.2);
    shape.lineTo(0.6, -0.22);
    shape.lineTo(0, -0.26);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.008, bevelSegments: 2 });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0.008, 0);
    const roundelTex = (() => {
      if (typeof document === 'undefined') return null;
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d')!;
      g.fillStyle = '#ffffff';
      g.beginPath();
      g.arc(64, 64, 60, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = '#1f4fbf';
      g.lineWidth = 9;
      for (const r of [0, Math.PI]) {
        g.beginPath();
        for (let k = 0; k < 3; k++) {
          const a = r + (k * Math.PI * 2) / 3 - Math.PI / 2;
          const x = 64 + Math.cos(a) * 40;
          const y = 64 + Math.sin(a) * 40;
          if (k === 0) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.closePath();
        g.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();
    const roundel = new THREE.MeshStandardMaterial({ map: roundelTex ?? undefined, transparent: true, roughness: 0.5 });
    mats.push(roundel);
    for (const s of [1, -1]) {
      const pivot = new THREE.Group();
      pivot.position.set(s * 0.06, 0, 0);
      pivot.scale.x = s;
      // Fold first (chord upright, flat against the back), then drop the span down.
      pivot.rotation.order = 'ZYX';
      const wing = new THREE.Mesh(geo, metal);
      wing.castShadow = true;
      pivot.add(wing);
      part(pivot, new THREE.CircleGeometry(0.07, 24), roundel, [0.58, 0.026, -0.12], [-Math.PI / 2, 0, 0]);
      part(pivot, new THREE.BoxGeometry(0.5, 0.012, 0.03), dark, [0.3, 0.02, -0.24]);
      this.group.add(pivot);
      this.pivots.push(pivot);
    }
    // Jet pack housing and twin engines with afterburners.
    part(this.group, new RoundedBoxGeometry(0.2, 0.3, 0.1, 3, 0.03), dark, [0, 0.02, -0.02]);
    for (const s of [1, -1]) {
      part(this.group, new THREE.CylinderGeometry(0.04, 0.05, 0.2, 14), dark, [s * 0.07, -0.08, -0.02]);
      const flame = part(this.group, new THREE.ConeGeometry(0.045, 0.3, 14, 1, true), additive(0x7fc8ff, 0.8), [s * 0.07, -0.33, -0.02], [Math.PI, 0, 0]);
      flame.castShadow = false;
      this.flames.push(flame);
    }
    const chestY = 0.95 + 0.56;
    this.group.position.set(0, 1.38 - chestY, -0.2 * rig.body.girth - 0.02);
    rig.chest.add(this.group);
  }

  update(ctx: SigContext): void {
    const target = ctx.airborne || ctx.special || ctx.intro || ctx.victory || ctx.heat >= 100 ? 1 : 0;
    // Sprung deploy with a little overshoot.
    const k = 90;
    this.wv += (k * (target - this.w) - 2 * 0.6 * Math.sqrt(k) * this.wv) * ctx.dt;
    this.w += this.wv * ctx.dt;
    const w = this.w;
    this.pivots.forEach((p, i) => {
      const s = i === 0 ? 1 : -1;
      // Folded: flat against the back, tips pointing down. Deployed: spread, swept, flapping gently.
      const f = 1 - Math.min(1, Math.max(0, w));
      const flap = Math.sin(ctx.time * 5 + i) * 0.05 * w;
      p.rotation.set(f * (Math.PI / 2), s * 0.25 * (1 - f), s * (-1.25 * f + 0.12 * (1 - f) + flap));
      // Folded wings retract into the pack.
      const k = 0.3 + 0.7 * (1 - f);
      p.scale.set(s * k, k, k);
    });
    const burn = ctx.airborne ? 1 : ctx.special ? 0.6 : 0;
    for (const f of this.flames) {
      f.visible = burn > 0 && w > 0.4;
      f.scale.set(1, 0.6 + burn * (0.8 + Math.random() * 0.4), 1);
    }
    if (ctx.fx && ctx.airborne && w > 0.5 && Math.random() < 0.6) {
      const p = this.flames[Math.random() < 0.5 ? 0 : 1].getWorldPosition(new THREE.Vector3());
      ctx.fx.burst(p.x, p.y - 0.1, p.z, 0x9fd8ff, 1, 0.01, 0.05, 0.001, 14);
    }
  }
}

// ------------------------------------------------------------------ Iron Dome drones

class Drones {
  readonly group = new THREE.Group();
  private primed = false;
  private drones: { g: THREE.Group; rotors: THREE.Mesh[]; light: THREE.MeshBasicMaterial }[] = [];

  constructor(rig: Rig, mats: THREE.Material[], std: (c: number, e?: THREE.MeshStandardMaterialParameters) => THREE.MeshStandardMaterial) {
    const shell = std(0xe6e9ec, { metalness: 0.4, roughness: 0.35 });
    const dark = std(0x2b3036, { metalness: 0.6, roughness: 0.4 });
    const blade = new THREE.MeshStandardMaterial({ color: 0x222222, transparent: true, opacity: 0.45, roughness: 0.4 });
    mats.push(blade);
    for (let i = 0; i < 3; i++) {
      const g = new THREE.Group();
      part(g, new RoundedBoxGeometry(0.15, 0.05, 0.15, 2, 0.015), shell);
      // Interceptor launcher on top: three tubes.
      for (let t = -1; t <= 1; t++) part(g, new THREE.CylinderGeometry(0.014, 0.014, 0.11, 8), dark, [t * 0.032, 0.05, 0], [Math.PI / 2 - 0.5, 0, 0]);
      const rotors: THREE.Mesh[] = [];
      for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        part(g, new THREE.BoxGeometry(0.1, 0.01, 0.014), dark, [x * 0.07, 0.005, z * 0.07], [0, (x * z > 0 ? 1 : -1) * Math.PI / 4, 0]);
        const r = part(g, new THREE.CylinderGeometry(0.055, 0.055, 0.004, 16), blade, [x * 0.11, 0.025, z * 0.11]);
        r.castShadow = false;
        rotors.push(r);
      }
      const light = additive(0x6fd3ff, 0.9);
      part(g, new THREE.SphereGeometry(0.018, 10, 8), light, [0, -0.03, 0.06]).castShadow = false;
      g.scale.setScalar(1.4);
      this.group.add(g);
      this.drones.push({ g, rotors, light });
    }
    rig.root.add(this.group);
  }

  update(ctx: SigContext): void {
    const guard = ctx.shieldHits > 0 || ctx.intro || ctx.victory;
    const n = ctx.shieldHits > 0 ? Math.min(3, ctx.shieldHits) : guard ? 3 : 2;
    this.drones.forEach((d, i) => {
      d.g.visible = i < n;
      for (const r of d.rotors) r.rotation.y += ctx.dt * 60;
      const t = ctx.time;
      let target: THREE.Vector3;
      if (guard) {
        // Orbit the MK as an interception screen.
        const a = t * 2.4 + (i * Math.PI * 2) / n;
        target = V(Math.cos(a) * 0.8, 1.25 + Math.sin(t * 3 + i) * 0.12, Math.sin(a) * 0.8);
      } else {
        // Hover over the shoulders.
        const s = i === 0 ? 1 : -1;
        target = V(s * 0.5, 2.0 + Math.sin(t * 2.2 + i * 2) * 0.06, -0.35 + Math.cos(t * 1.7 + i) * 0.05);
      }
      if (this.primed) d.g.position.lerp(target, 1 - Math.exp(-ctx.dt * (guard ? 10 : 4)));
      else d.g.position.copy(target);
      d.g.rotation.z = Math.sin(t * 2 + i) * 0.12;
      d.light.color.setHex(ctx.shieldHits > 0 ? 0x6fd3ff : 0xff5a5a);
      d.light.opacity = 0.6 + 0.4 * Math.sin(t * 9 + i);
    });
    this.primed = true;
  }
}

// ------------------------------------------------------------------ the Lion of Jerusalem

class Lion {
  readonly group = new THREE.Group();
  private body = new THREE.Group();
  private head = new THREE.Group();
  private jaw = new THREE.Group();
  private legs: THREE.Group[] = [];
  private tail: THREE.Group[] = [];
  private show = 0;
  private pounceT = -1;

  constructor(rig: Rig, std: (c: number, e?: THREE.MeshStandardMaterialParameters) => THREE.MeshStandardMaterial) {
    const fur = std(0xc8913f, { roughness: 0.85 });
    const light = std(0xe2b877, { roughness: 0.9 });
    const maneM = std(0x7a4a1c, { roughness: 0.95 });
    const dark = std(0x1d1410, { roughness: 0.4 });
    const amber = std(0xf0b030, { roughness: 0.2, emissive: 0x402000 });
    // Torso.
    part(this.body, new THREE.CapsuleGeometry(0.2, 0.55, 8, 16), fur, [0, 0.62, -0.02], [Math.PI / 2, 0, 0], [1, 1, 0.92]);
    part(this.body, new THREE.SphereGeometry(0.17, 16, 12), light, [0, 0.52, 0.02], [0, 0, 0], [1, 0.7, 1.9]);
    // Shaggy mane: a sphere with noisy radial displacement.
    const mg = new THREE.SphereGeometry(0.3, 28, 20);
    const mp = mg.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < mp.count; i++) {
      const v = V(mp.getX(i), mp.getY(i), mp.getZ(i));
      const n = 1 + 0.16 * Math.sin(v.x * 40) * Math.sin(v.y * 37 + 1) * Math.sin(v.z * 33 + 2) + 0.08 * Math.sin(v.y * 90);
      v.multiplyScalar(n);
      mp.setXYZ(i, v.x, v.y, v.z);
    }
    mg.computeVertexNormals();
    part(this.body, mg, maneM, [0, 0.78, 0.32], [0.3, 0, 0], [1, 1.05, 0.9]);
    // Head (on its own pivot so it can roar).
    this.head.position.set(0, 0.84, 0.46);
    this.body.add(this.head);
    part(this.head, new THREE.SphereGeometry(0.15, 20, 16), fur, [0, 0.02, 0.06], [0, 0, 0], [1, 0.95, 1.05]);
    part(this.head, new THREE.SphereGeometry(0.085, 16, 12), light, [0, -0.04, 0.18], [0, 0, 0], [1.1, 0.8, 1]);
    part(this.head, new THREE.SphereGeometry(0.03, 10, 8), dark, [0, -0.005, 0.26], [0, 0, 0], [1.3, 0.8, 0.8]);
    for (const s of [-1, 1]) {
      part(this.head, new THREE.SphereGeometry(0.02, 10, 8), amber, [s * 0.06, 0.05, 0.17]);
      part(this.head, new THREE.SphereGeometry(0.01, 8, 6), dark, [s * 0.062, 0.05, 0.188]);
      part(this.head, new THREE.SphereGeometry(0.045, 10, 8), fur, [s * 0.1, 0.14, 0.02], [0, 0, 0], [1, 1, 0.5]);
    }
    this.jaw.position.set(0, -0.06, 0.1);
    this.head.add(this.jaw);
    part(this.jaw, new THREE.SphereGeometry(0.07, 14, 10), light, [0, -0.03, 0.06], [0, 0, 0], [1, 0.55, 1.1]);
    part(this.jaw, new THREE.SphereGeometry(0.05, 12, 8), std(0x8a2a2a, { roughness: 0.6 }), [0, -0.005, 0.07], [0, 0, 0], [1, 0.3, 1]);
    // Legs on shoulder / hip pivots.
    for (const [x, z] of [[0.13, 0.3], [-0.13, 0.3], [0.14, -0.33], [-0.14, -0.33]]) {
      const leg = new THREE.Group();
      leg.position.set(x, 0.62, z);
      part(leg, new THREE.CapsuleGeometry(0.07, 0.42, 6, 12), fur, [0, -0.3, 0]);
      part(leg, new THREE.SphereGeometry(0.08, 12, 10), light, [0, -0.58, 0.03], [0, 0, 0], [1, 0.6, 1.3]);
      this.body.add(leg);
      this.legs.push(leg);
    }
    // Tail: a chain with a dark tuft.
    let parent: THREE.Object3D = this.body;
    const base = new THREE.Group();
    base.position.set(0, 0.68, -0.48);
    this.body.add(base);
    parent = base;
    for (let i = 0; i < 6; i++) {
      const seg = new THREE.Group();
      seg.position.set(0, i === 0 ? 0 : -0.1, 0);
      part(seg, new THREE.CapsuleGeometry(0.018, 0.08, 4, 8), fur, [0, -0.05, 0]);
      if (i === 5) part(seg, new THREE.SphereGeometry(0.04, 10, 8), dark, [0, -0.11, 0], [0, 0, 0], [1, 1.4, 1]);
      parent.add(seg);
      this.tail.push(seg);
      parent = seg;
    }
    this.group.add(this.body);
    this.group.visible = false;
    rig.root.add(this.group);
  }

  update(ctx: SigContext): void {
    const t = ctx.time;
    const present = ctx.intro || ctx.victory || ctx.showcase;
    if (ctx.special && this.pounceT < 0) this.pounceT = 0;
    if (!ctx.special) this.pounceT = -1;
    const pouncing = this.pounceT >= 0;
    const target = present || pouncing ? 1 : 0;
    this.show += (target - this.show) * (1 - Math.exp(-ctx.dt * 8));
    this.group.visible = this.show > 0.02;
    if (!this.group.visible) return;
    this.group.scale.setScalar(this.show * 1.45);

    // Tail swish and breathing.
    this.tail.forEach((s, i) => {
      s.rotation.x = (i === 0 ? -0.9 : 0.25) + Math.sin(t * 2.2 - i * 0.6) * 0.1;
      s.rotation.z = Math.sin(t * 1.6 - i * 0.5) * 0.25;
    });
    this.body.position.y = Math.sin(t * 2.4) * 0.006;
    if (pouncing) {
      // Leap from behind the MK, over and past him at the opponent.
      const p = Math.min(1, ctx.moveT * 1.4);
      this.group.position.set(0.45 * (1 - p), Math.sin(p * Math.PI) * 0.45, -0.7 + p * 2.6);
      this.group.rotation.set(-Math.cos(p * Math.PI) * 0.35, 0, 0);
      this.legs.forEach((l, i) => (l.rotation.x = i < 2 ? -1.1 * Math.sin(p * Math.PI) : 1.0 * Math.sin(p * Math.PI)));
      this.head.rotation.x = -0.25;
      this.jaw.rotation.x = 0.55;
      if (ctx.fx && Math.random() < 0.4) {
        const w = this.head.getWorldPosition(new THREE.Vector3());
        ctx.fx.burst(w.x, w.y, w.z, 0xffc34d, 2, 0.03, 0.05, 0, 16);
      }
    } else {
      // Standing guard at the MK's side, roaring now and then.
      this.group.position.set(0.95, 0, -0.45);
      this.group.rotation.set(0, -0.45, 0);
      const roar = Math.max(0, Math.sin(t * 1.3)) ** 6;
      this.head.rotation.set(-0.1 - roar * 0.45, Math.sin(t * 0.7) * 0.25, 0);
      this.jaw.rotation.x = 0.08 + roar * 0.6;
      this.legs.forEach((l, i) => (l.rotation.x = Math.sin(t * 2.4 + i) * 0.02));
    }
  }
}

// ------------------------------------------------------------------ kit

export class SignatureKit {
  private held: Held | null = null;
  private wings: Wings | null = null;
  private drones: Drones | null = null;
  private lion: Lion | null = null;
  private own: THREE.Material[] = [];

  constructor(private rig: Rig) {
    const sig = rig.sig;
    const std = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness: 0.5, ...extra });
      m.envMapIntensity = 1.6;
      this.own.push(m);
      return m;
    };
    if (sig.held) {
      const bone = sig.held.hand === 'l' ? rig.lHand : rig.rHand;
      const group = new THREE.Group();
      const model = buildHeldModel(sig.held.id, this.own, std);
      group.add(model);
      const gx = sig.held.hand === 'l' ? -0.02 : 0.02;
      group.position.set(gx, -0.085, 0);
      const gr = GRIPS[sig.held.id];
      orient(group, V(...gr.axis), V(...gr.face));
      bone.add(group);
      this.held = { group, hand: sig.held.hand };
      if (sig.held.id === 'briefcase') this.held.pendulum = { obj: group, v: V(0, 0, 0), dir: V(0, -1, 0) };
      if (sig.held.id === 'whip') {
        const tip = new THREE.Object3D();
        tip.position.set(0, 0.2, 0);
        model.add(tip);
        const rope = new Rope(14, 1.05, std(0x2b1a10, { roughness: 0.55 }), tip);
        rig.root.add(rope.mesh);
        this.held.rope = rope;
      }
    }
    if (sig.companion === 'wings') this.wings = new Wings(rig, this.own, std);
    if (sig.companion === 'drones') this.drones = new Drones(rig, this.own, std);
    if (sig.companion === 'lion') this.lion = new Lion(rig, std);
  }

  /** Call after the rig is posed and placed (world matrices current). */
  update(ctx: SigContext): void {
    const h = this.held;
    if (h) {
      h.group.visible = ctx.propHand !== h.hand;
      if (h.pendulum) this.swingPendulum(h.pendulum, ctx.dt);
      h.rope?.update(ctx.dt, h.group.visible && !ctx.lash);
    }
    this.wings?.update(ctx);
    this.drones?.update(ctx);
    this.lion?.update(ctx);
  }

  /** Briefcase: hangs from the fist and swings under gravity. */
  private swingPendulum(p: NonNullable<Held['pendulum']>, dt: number): void {
    const parent = p.obj.parent!;
    const pq = parent.getWorldQuaternion(new THREE.Quaternion());
    // Current hang direction in world space, sprung toward straight down.
    const k = 60;
    const c = 2 * 0.25 * Math.sqrt(k);
    const down = V(0, -1, 0);
    const a = down.clone().sub(p.dir).multiplyScalar(k).addScaledVector(p.v, -c);
    p.v.addScaledVector(a, Math.min(dt, 0.05));
    p.dir.addScaledVector(p.v, Math.min(dt, 0.05)).normalize();
    // Item +Y points up the handle: its "down" is -Y, so align -Y with the hang direction.
    const worldQ = new THREE.Quaternion().setFromUnitVectors(V(0, -1, 0), p.dir);
    p.obj.quaternion.copy(pq.invert().multiply(worldQ));
  }

  dispose(): void {
    for (const m of this.own) m.dispose();
    this.rig.root.traverse((o) => {
      const im = o as THREE.InstancedMesh;
      if (im.isInstancedMesh) im.dispose();
    });
  }
}
