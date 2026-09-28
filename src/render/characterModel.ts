// Procedural caricature models built from primitives, with a simple joint rig.
// Local space: the character faces +Z, its left side is +X, feet at y = 0.

import * as THREE from 'three';
import type { CharacterDef, Look } from '../game/characterTypes';
import { PARTIES } from '../data/parties';
import { OUTLINE_MAT, inflate, shade, toon } from './materials';

export const HIP_H = 0.95;

export interface Rig {
  root: THREE.Group;
  pivot: THREE.Group;
  hips: THREE.Group;
  spine: THREE.Group;
  chest: THREE.Group;
  neck: THREE.Group;
  head: THREE.Group;
  lSh: THREE.Group;
  lEl: THREE.Group;
  rSh: THREE.Group;
  rEl: THREE.Group;
  lHand: THREE.Group;
  rHand: THREE.Group;
  lHip: THREE.Group;
  lKnee: THREE.Group;
  rHip: THREE.Group;
  rKnee: THREE.Group;
  materials: THREE.MeshToonMaterial[];
  headRadius: number;
  def: CharacterDef;
}

interface Builder {
  mats: THREE.MeshToonMaterial[];
  matCache: Map<string, THREE.MeshToonMaterial>;
  outline: number;
}

function mat(b: Builder, color: number, extra?: Partial<THREE.MeshToonMaterialParameters>, key?: string): THREE.MeshToonMaterial {
  const k = key ?? `${color}:${extra ? JSON.stringify(extra) : ''}`;
  let m = b.matCache.get(k);
  if (!m) {
    m = toon(color, extra);
    b.matCache.set(k, m);
    b.mats.push(m);
  }
  return m;
}

function part(
  b: Builder,
  parent: THREE.Object3D,
  geo: THREE.BufferGeometry,
  material: THREE.Material,
  pos: [number, number, number] = [0, 0, 0],
  opts: { rot?: [number, number, number]; scale?: [number, number, number]; outline?: boolean; shadow?: boolean } = {},
): THREE.Mesh {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(pos[0], pos[1], pos[2]);
  if (opts.rot) mesh.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
  if (opts.scale) mesh.scale.set(opts.scale[0], opts.scale[1], opts.scale[2]);
  mesh.castShadow = opts.shadow !== false;
  mesh.receiveShadow = false;
  parent.add(mesh);
  if (opts.outline !== false && b.outline > 0) {
    const o = new THREE.Mesh(inflate(geo, b.outline), OUTLINE_MAT);
    o.castShadow = false;
    mesh.add(o);
  }
  return mesh;
}

function group(parent: THREE.Object3D, pos: [number, number, number] = [0, 0, 0]): THREE.Group {
  const g = new THREE.Group();
  g.position.set(pos[0], pos[1], pos[2]);
  parent.add(g);
  return g;
}

const capsule = (r: number, len: number) => new THREE.CapsuleGeometry(r, Math.max(0.001, len), 5, 12);

export function buildCharacter(def: CharacterDef, opts: { outline?: boolean } = {}): Rig {
  const look = def.look;
  const party = PARTIES[def.party];
  const b: Builder = { mats: [], matCache: new Map(), outline: opts.outline === false ? 0 : 0.012 };
  const female = !!look.female;
  const bw = look.build * (female ? 0.9 : 1);
  const sw = female ? 0.92 : 1.0;
  const limb = Math.sqrt(look.build);

  const skin = mat(b, look.skin);
  const skinDark = mat(b, shade(look.skin, 0.86));
  const jacketColor = look.outfit === 'shirt' || look.outfit === 'tshirt' ? look.shirt : look.jacket;
  const jacket = mat(b, jacketColor);
  const shirt = mat(b, look.shirt);
  const pants = mat(b, look.pants);
  const shoes = mat(b, look.shoes ?? 0x141414);
  const hairM = mat(b, look.hairColor);

  const root = new THREE.Group();
  root.scale.setScalar(look.height);
  const pivot = group(root, [0, HIP_H, 0]);
  const hips = group(pivot);

  // ---- pelvis & legs
  part(b, hips, new THREE.CylinderGeometry(0.16 * bw, 0.15 * bw, 0.2, 14), pants, [0, -0.02, 0], { scale: [1, 1, 0.75] });
  if (look.outfit === 'skirt') {
    part(b, hips, new THREE.CylinderGeometry(0.17 * bw, 0.27 * bw, 0.5, 16), pants, [0, -0.22, 0], { scale: [1, 1, 0.8] });
  } else if (look.outfit === 'suit' || look.outfit === 'open-suit' || look.outfit === 'blazer') {
    part(b, hips, new THREE.CylinderGeometry(0.185 * bw, 0.2 * bw, 0.2, 14), jacket, [0, 0.02, 0], { scale: [1, 1, 0.78] });
  }

  const legSkin = look.outfit === 'skirt';
  const legMat = legSkin ? mat(b, shade(look.skin, 0.8)) : pants;
  const buildLeg = (side: 1 | -1) => {
    const hip = group(hips, [side * 0.095 * bw, -0.05, 0]);
    part(b, hip, capsule(0.082 * limb, 0.3), legMat, [0, -0.22, 0]);
    const knee = group(hip, [0, -0.45, 0]);
    part(b, knee, capsule(0.068 * limb, 0.3), legMat, [0, -0.21, 0]);
    part(b, knee, new THREE.BoxGeometry(0.11, 0.07, 0.25), shoes, [0, -0.44, 0.05]);
    return { hip, knee };
  };
  const L = buildLeg(1);
  const R = buildLeg(-1);

  // ---- torso
  const spine = group(hips, [0, 0.06, 0]);
  const torsoTop = 0.205 * bw * sw;
  const torsoBot = 0.168 * bw;
  part(b, spine, new THREE.CylinderGeometry(torsoTop, torsoBot, 0.5, 16), jacket, [0, 0.25, 0], { scale: [1, 1, 0.66] });
  if (look.build > 1.1) {
    const belly = (look.build - 1.0) * 0.9;
    part(b, spine, new THREE.SphereGeometry(0.16 * bw, 16, 12), jacket, [0, 0.13, 0.03 + belly * 0.1], { scale: [1, 0.9, 0.6 + belly] });
  }
  if (female) {
    part(b, spine, new THREE.SphereGeometry(0.09, 12, 10), jacket, [0, 0.36, 0.08], { scale: [1.9, 0.8, 0.7], outline: false });
  }

  const front = torsoTop * 0.66 + 0.004;
  if (look.outfit === 'suit' || look.outfit === 'open-suit' || look.outfit === 'blazer' || look.outfit === 'skirt') {
    // Shirt "V" between the lapels.
    const v = new THREE.Shape();
    v.moveTo(-0.075, 0);
    v.lineTo(0.075, 0);
    v.lineTo(0, -0.2);
    v.closePath();
    const vm = part(b, spine, new THREE.ShapeGeometry(v), shirt, [0, 0.5, front], { outline: false, shadow: false });
    vm.rotation.x = -0.05;
    // Lapels
    const lapelM = mat(b, shade(jacketColor, 0.75));
    for (const s of [1, -1]) {
      part(b, spine, new THREE.BoxGeometry(0.018, 0.22, 0.01), lapelM, [s * 0.045, 0.39, front + 0.004], { rot: [0, 0, s * 0.36], outline: false, shadow: false });
    }
    if (look.tie !== null && look.tie !== undefined && look.outfit === 'suit') {
      const tieM = mat(b, look.tie);
      part(b, spine, new THREE.BoxGeometry(0.05, 0.3, 0.012), tieM, [0, 0.33, front + 0.008], { outline: false, shadow: false });
      part(b, spine, new THREE.BoxGeometry(0.055, 0.045, 0.02), tieM, [0, 0.48, front + 0.01], { outline: false, shadow: false });
    }
    // Party pin on the lapel.
    part(b, spine, new THREE.SphereGeometry(0.018, 8, 6), mat(b, party.color, { emissive: new THREE.Color(party.color), emissiveIntensity: 0.4 }, 'pin'), [0.1, 0.42, front + 0.01], { outline: false, shadow: false });
  } else if (look.outfit === 'shirt') {
    for (let i = 0; i < 4; i++) {
      part(b, spine, new THREE.SphereGeometry(0.009, 6, 4), mat(b, 0xdddddd), [0, 0.45 - i * 0.1, front + 0.002], { outline: false, shadow: false });
    }
  }

  const chest = group(spine, [0, 0.5, 0]);
  // Shoulder yoke
  part(b, chest, new THREE.SphereGeometry(torsoTop, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), jacket, [0, -0.02, 0], { scale: [1, 0.35, 0.66] });

  // ---- arms
  const shortSleeve = look.outfit === 'tshirt';
  const buildArm = (side: 1 | -1) => {
    const sh = group(chest, [side * (torsoTop + 0.035), -0.04, 0]);
    part(b, sh, new THREE.SphereGeometry(0.075 * limb, 12, 10), jacket, [0, 0, 0]);
    part(b, sh, capsule(0.06 * limb, 0.2), shortSleeve ? shirt : jacket, [0, -0.15, 0]);
    const el = group(sh, [0, -0.3, 0]);
    part(b, el, capsule(0.052 * limb, 0.18), shortSleeve ? skin : jacket, [0, -0.13, 0]);
    if (!shortSleeve && look.outfit !== 'shirt') {
      part(b, el, new THREE.CylinderGeometry(0.05 * limb, 0.05 * limb, 0.035, 10), shirt, [0, -0.255, 0], { outline: false });
    }
    const hand = group(el, [0, -0.3, 0]);
    part(b, hand, new THREE.SphereGeometry(0.064, 12, 10), skin, [0, 0, 0], { scale: [1, 1.05, 1.15] });
    return { sh, el, hand };
  };
  const LA = buildArm(1);
  const RA = buildArm(-1);

  // ---- neck & head
  const neck = group(chest, [0, 0.03, 0]);
  part(b, neck, new THREE.CylinderGeometry(0.058, 0.064, 0.12, 12), skin, [0, 0.05, 0]);
  if (look.outfit !== 'tshirt') {
    part(b, neck, new THREE.CylinderGeometry(0.07, 0.075, 0.05, 12), shirt, [0, 0.0, 0], { outline: false });
  }
  const head = group(neck, [0, 0.1, 0]);
  const R_ = 0.15 * (look.head ?? 1);
  buildHead(b, head, look, R_, skin, skinDark, hairM);

  const rig: Rig = {
    root, pivot, hips, spine, chest, neck, head,
    lSh: LA.sh, lEl: LA.el, rSh: RA.sh, rEl: RA.el, lHand: LA.hand, rHand: RA.hand,
    lHip: L.hip, lKnee: L.knee, rHip: R.hip, rKnee: R.knee,
    materials: b.mats,
    headRadius: R_,
    def,
  };
  return rig;
}

function buildHead(b: Builder, head: THREE.Group, look: Look, R: number, skin: THREE.Material, skinDark: THREE.Material, hairM: THREE.Material): void {
  const c = group(head, [0, 0.14, 0]);
  const skullScale: [number, number, number] = [0.92, 1.05, 1.0];
  part(b, c, new THREE.SphereGeometry(R, 24, 18), skin, [0, 0, 0], { scale: skullScale });
  // Jaw
  const jawW = look.female ? 0.84 : 0.95;
  part(b, c, new THREE.SphereGeometry(R * 0.8, 18, 12), skin, [0, -R * 0.35, R * 0.08], { scale: [jawW, 0.85, 0.95], outline: false });
  // Ears
  for (const s of [1, -1]) {
    part(b, c, new THREE.SphereGeometry(R * 0.22, 10, 8), skinDark, [s * R * 0.88, -R * 0.02, -R * 0.02], { scale: [0.5, 1, 0.8] });
  }
  // Eyes
  const white = mat(b, 0xffffff);
  const pupil = mat(b, 0x111111);
  for (const s of [1, -1]) {
    part(b, c, new THREE.SphereGeometry(R * 0.14, 12, 10), white, [s * R * 0.33, R * 0.12, R * 0.84], { outline: false, shadow: false });
    part(b, c, new THREE.SphereGeometry(R * 0.075, 10, 8), pupil, [s * R * 0.32, R * 0.11, R * 0.965], { outline: false, shadow: false });
  }
  // Brows
  const browM = mat(b, shade(look.facialHairColor ?? look.hairColor, look.hairColor > 0xa00000 ? 0.7 : 1));
  const browT = look.brows ?? 1;
  for (const s of [1, -1]) {
    part(b, c, new THREE.BoxGeometry(R * 0.38, R * 0.075 * browT, R * 0.09), browM, [s * R * 0.33, R * 0.33, R * 0.9], { rot: [0, s * 0.25, s * 0.2], outline: false, shadow: false });
  }
  // Nose & mouth
  part(b, c, new THREE.SphereGeometry(R * 0.17, 12, 10), skinDark, [0, -R * 0.03, R * 0.98], { scale: [0.8, 1.05, 1.1], outline: false, shadow: false });
  part(b, c, new THREE.BoxGeometry(R * 0.38, R * 0.05, R * 0.05), mat(b, 0x5a1e1e), [0, -R * 0.4, R * 0.9], { outline: false, shadow: false });

  buildHair(b, c, look, R, hairM);
  buildFacialHair(b, c, look, R);
  buildGlasses(b, c, look, R);
  buildHeadwear(b, c, look, R);
}

function buildHair(b: Builder, c: THREE.Group, look: Look, R: number, hairM: THREE.Material): void {
  const cap = (radius: number, theta: number, tilt: number) => {
    const m = part(b, c, new THREE.SphereGeometry(radius, 24, 12, 0, Math.PI * 2, 0, theta), hairM, [0, R * 0.02, -R * 0.02], { scale: [0.95, 1.05, 1.02] });
    m.rotation.x = -tilt;
    return m;
  };
  const sideDoubleMat = (): THREE.Material => {
    const m = (hairM as THREE.MeshToonMaterial).clone();
    m.side = THREE.DoubleSide;
    b.mats.push(m);
    return m;
  };
  switch (look.hair) {
    case 'bald':
      break;
    case 'short':
      cap(R * 1.04, Math.PI * 0.46, 0.35);
      break;
    case 'buzz':
      cap(R * 1.02, Math.PI * 0.5, 0.35);
      break;
    case 'side':
      cap(R * 1.05, Math.PI * 0.46, 0.3);
      part(b, c, new THREE.SphereGeometry(R * 0.62, 14, 10), hairM, [R * 0.22, R * 0.74, R * 0.2], { scale: [1.35, 0.5, 1.15], rot: [-0.2, 0, -0.25] });
      break;
    case 'swept':
      cap(R * 1.05, Math.PI * 0.46, 0.3);
      part(b, c, new THREE.SphereGeometry(R * 0.7, 14, 10), hairM, [0, R * 0.78, R * 0.18], { scale: [1.3, 0.48, 1.25], rot: [-0.35, 0, 0] });
      break;
    case 'receding':
      cap(R * 1.04, Math.PI * 0.45, 0.85);
      break;
    case 'horseshoe': {
      const t = part(b, c, new THREE.TorusGeometry(R * 0.93, R * 0.17, 8, 24, Math.PI * 1.15), hairM, [0, R * 0.05, -R * 0.02]);
      t.rotation.set(-Math.PI / 2, 0, -Math.PI * 0.075);
      break;
    }
    case 'long': case 'wavy': {
      cap(R * 1.06, Math.PI * 0.52, 0.25);
      part(b, c, new THREE.CylinderGeometry(R * 1.02, R * 1.2, R * 2.3, 20, 1, true, Math.PI * 0.32, Math.PI * 1.36), sideDoubleMat(), [0, -R * 0.62, -R * 0.02], { scale: [0.95, 1, 1] });
      if (look.hair === 'wavy') {
        for (let i = 0; i < 6; i++) {
          const a = Math.PI * (0.55 + i * 0.18);
          part(b, c, new THREE.SphereGeometry(R * 0.32, 10, 8), hairM, [Math.sin(a) * R * 1.05, -R * (1.3 + (i % 2) * 0.25), Math.cos(a) * R * 1.0], { outline: false });
        }
      }
      break;
    }
    case 'bob':
      cap(R * 1.07, Math.PI * 0.52, 0.2);
      part(b, c, new THREE.CylinderGeometry(R * 1.05, R * 1.14, R * 1.35, 20, 1, true, Math.PI * 0.3, Math.PI * 1.4), sideDoubleMat(), [0, -R * 0.3, -R * 0.02], { scale: [0.95, 1, 1] });
      break;
    case 'bun':
      cap(R * 1.05, Math.PI * 0.5, 0.25);
      part(b, c, new THREE.SphereGeometry(R * 0.45, 12, 10), hairM, [0, R * 0.55, -R * 0.9]);
      break;
    case 'ponytail':
      cap(R * 1.05, Math.PI * 0.5, 0.25);
      part(b, c, capsule(R * 0.22, R * 1.1), hairM, [0, -R * 0.2, -R * 1.2], { rot: [0.5, 0, 0] });
      break;
    case 'curly': {
      cap(R * 1.12, Math.PI * 0.55, 0.2);
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const y = R * (0.3 + (i % 3) * 0.28);
        const rr = R * (1.0 + (i % 2) * 0.1);
        if (Math.cos(a) > 0.7 && y < R * 0.6) continue;
        part(b, c, new THREE.SphereGeometry(R * 0.33, 10, 8), hairM, [Math.sin(a) * rr, y, Math.cos(a) * rr - R * 0.05], { outline: false });
      }
      for (let i = 0; i < 8; i++) {
        const a = Math.PI * (0.6 + i * 0.1);
        part(b, c, new THREE.SphereGeometry(R * 0.34, 10, 8), hairM, [Math.sin(a) * R * 1.05, -R * (0.2 + (i % 3) * 0.3), Math.cos(a) * R * 1.0], { outline: false });
      }
      break;
    }
    case 'spiky':
      cap(R * 1.04, Math.PI * 0.46, 0.3);
      for (let i = 0; i < 7; i++) {
        const a = -0.9 + i * 0.3;
        part(b, c, new THREE.ConeGeometry(R * 0.18, R * 0.5, 6), hairM, [Math.sin(a) * R * 0.5, R * 0.95, Math.cos(a) * R * 0.2], { rot: [0, 0, -a * 0.6], outline: false });
      }
      break;
    case 'braids': {
      cap(R * 1.06, Math.PI * 0.52, 0.2);
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (0.62 + i * 0.095);
        part(b, c, capsule(R * 0.1, R * 1.9), hairM, [Math.sin(a) * R * 1.0, -R * 0.75, Math.cos(a) * R * 0.98], { outline: false });
      }
      break;
    }
  }
}

function buildFacialHair(b: Builder, c: THREE.Group, look: Look, R: number): void {
  const fh = look.facialHair ?? 'none';
  if (fh === 'none') return;
  const color = look.facialHairColor ?? look.hairColor;
  const solid = mat(b, color);
  const band = (radius: number, t0: number, t1: number, material: THREE.Material) => {
    part(b, c, new THREE.SphereGeometry(radius, 22, 12, -0.15, Math.PI + 0.3, Math.PI * t0, Math.PI * (t1 - t0)), material, [0, 0, R * 0.02], { scale: [0.93, 1.05, 1.02], outline: false });
  };
  const mustache = () => {
    part(b, c, capsule(R * 0.075, R * 0.34), solid, [0, -R * 0.26, R * 0.98], { rot: [0, 0, Math.PI / 2], outline: false });
  };
  switch (fh) {
    case 'stubble': {
      const m = mat(b, color, { transparent: true, opacity: 0.45 }, `stubble${color}`);
      band(R * 1.015, 0.58, 0.92, m);
      break;
    }
    case 'short':
      band(R * 1.035, 0.6, 0.94, solid);
      mustache();
      break;
    case 'full':
      band(R * 1.06, 0.56, 0.97, solid);
      part(b, c, new THREE.SphereGeometry(R * 0.48, 14, 10), solid, [0, -R * 0.82, R * 0.4], { scale: [1.1, 0.9, 0.9], outline: false });
      mustache();
      break;
    case 'long':
      band(R * 1.06, 0.56, 0.97, solid);
      part(b, c, new THREE.SphereGeometry(R * 0.5, 14, 10), solid, [0, -R * 0.8, R * 0.4], { scale: [1.1, 0.9, 0.9], outline: false });
      part(b, c, new THREE.ConeGeometry(R * 0.52, R * 1.5, 14), solid, [0, -R * 1.45, R * 0.45], { rot: [Math.PI - 0.2, 0, 0] });
      mustache();
      break;
    case 'goatee':
      part(b, c, new THREE.SphereGeometry(R * 0.3, 12, 10), solid, [0, -R * 0.75, R * 0.62], { outline: false });
      mustache();
      break;
    case 'mustache':
      mustache();
      break;
  }
}

function buildGlasses(b: Builder, c: THREE.Group, look: Look, R: number): void {
  const g = look.glasses ?? 'none';
  if (g === 'none') return;
  const frame = mat(b, g === 'thick' ? 0x1a1a1a : 0x2a2a2a);
  const tube = g === 'thick' ? R * 0.05 : R * 0.028;
  const lensM = new THREE.MeshBasicMaterial({ color: 0xbfe4ff, transparent: true, opacity: 0.22, depthWrite: false });
  for (const s of [1, -1]) {
    const pos: [number, number, number] = [s * R * 0.34, R * 0.12, R * 1.04];
    if (g === 'round') {
      part(b, c, new THREE.TorusGeometry(R * 0.22, tube, 6, 20), frame, pos, { outline: false, shadow: false });
    } else {
      part(b, c, new THREE.TorusGeometry(R * 0.23, tube, 4, 4), frame, pos, { rot: [0, 0, Math.PI / 4], scale: [1.25, 0.85, 1], outline: false, shadow: false });
    }
    part(b, c, new THREE.CircleGeometry(R * 0.2, 16), lensM, [pos[0], pos[1], pos[2] + 0.001], { outline: false, shadow: false });
    // Temple arm
    part(b, c, new THREE.BoxGeometry(tube * 1.2, tube * 1.2, R * 0.95), frame, [s * R * 0.62, R * 0.14, R * 0.55], { outline: false, shadow: false });
  }
  part(b, c, new THREE.BoxGeometry(R * 0.22, tube * 1.2, tube * 1.2), frame, [0, R * 0.16, R * 1.06], { outline: false, shadow: false });
}

function buildHeadwear(b: Builder, c: THREE.Group, look: Look, R: number): void {
  const hw = look.headwear ?? 'none';
  if (hw === 'none') return;
  const color = look.headwearColor ?? (hw === 'black-hat' ? 0x0b0b0b : 0x111111);
  const m = mat(b, color);
  switch (hw) {
    case 'kippah':
    case 'kippah-knit': {
      const g = group(c, [0, R * 0.94, -R * 0.32]);
      g.rotation.x = -0.45;
      part(b, g, new THREE.SphereGeometry(R * 0.55, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.22), m, [0, -R * 0.42, 0], { scale: [1, 0.9, 1] });
      if (hw === 'kippah-knit') {
        const ring = part(b, g, new THREE.TorusGeometry(R * 0.28, R * 0.03, 6, 20), mat(b, 0xffffff), [0, R * 0.08, 0], { outline: false });
        ring.rotation.x = Math.PI / 2;
      }
      break;
    }
    case 'black-hat': {
      const g = group(c, [0, R * 0.78, -R * 0.05]);
      g.rotation.x = -0.12;
      part(b, g, new THREE.CylinderGeometry(R * 1.62, R * 1.62, R * 0.07, 24), m, [0, 0, 0]);
      part(b, g, new THREE.CylinderGeometry(R * 0.88, R * 1.0, R * 0.95, 20), m, [0, R * 0.48, 0]);
      part(b, g, new THREE.CylinderGeometry(R * 1.01, R * 1.01, R * 0.18, 20), mat(b, 0x2a2a2a), [0, R * 0.12, 0], { outline: false });
      break;
    }
    case 'hat': {
      const g = group(c, [0, R * 0.72, 0]);
      g.rotation.x = -0.1;
      part(b, g, new THREE.CylinderGeometry(R * 1.45, R * 1.45, R * 0.06, 24), m, [0, 0, 0]);
      part(b, g, new THREE.SphereGeometry(R * 0.98, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), m, [0, 0, 0], { scale: [1, 0.75, 1] });
      break;
    }
    case 'beret':
      part(b, c, new THREE.SphereGeometry(R * 1.1, 20, 12), m, [R * 0.1, R * 0.78, -R * 0.05], { scale: [1.1, 0.35, 1.1], rot: [0, 0, -0.2] });
      break;
    case 'scarf':
      part(b, c, new THREE.SphereGeometry(R * 1.1, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), m, [0, 0, -R * 0.05], { scale: [0.96, 1.05, 1.02] });
      part(b, c, new THREE.CylinderGeometry(R * 1.02, R * 1.15, R * 1.3, 20, 1, true, Math.PI * 0.35, Math.PI * 1.3), m, [0, -R * 0.55, -R * 0.03]);
      break;
  }
}

export function disposeRig(rig: Rig): void {
  rig.root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.geometry.dispose();
    }
  });
  for (const m of rig.materials) m.dispose();
}
