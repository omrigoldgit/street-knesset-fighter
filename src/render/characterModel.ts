// Realistic procedural fighters. Each MK is one skinned body lofted around a bone skeleton
// (jacket, sleeves, trousers or skirt, neck) with painted garment textures, plus rigid parts on
// the bones: fists and other hand shapes, dress shoes, shirt collar and tie knot, and a head.
// Local space: the character faces +Z, its left side is +X, feet at y = 0.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { CharacterDef } from '../game/characterTypes';
import { PARTIES } from '../data/parties';
import type { PhotoHead } from './faces';
import { jacketTextures, sleeveTextures, trouserTextures, type JacketStyle } from './garments';
import { buildHead, buildPhotoHead } from './heads';
import { shade } from './materials';

export const HIP_H = 0.95;
/** Hip joint → knee, and knee → ankle, in model units (used by the leg IK). */
export const THIGH_LEN = 0.45;
export const SHIN_LEN = 0.44;
/** Ankle height above the sole. */
export const ANKLE_H = 0.035;

export type HandShape = 'fist' | 'open' | 'point' | 'thumb' | 'v';
const HAND_SHAPES: HandShape[] = ['fist', 'open', 'point', 'thumb', 'v'];

export interface Rig {
  root: THREE.Group;
  pivot: THREE.Group;
  hips: THREE.Bone;
  spine: THREE.Bone;
  chest: THREE.Bone;
  neck: THREE.Bone;
  head: THREE.Bone;
  lSh: THREE.Bone;
  lEl: THREE.Bone;
  rSh: THREE.Bone;
  rEl: THREE.Bone;
  lHand: THREE.Bone;
  rHand: THREE.Bone;
  lHip: THREE.Bone;
  lKnee: THREE.Bone;
  rHip: THREE.Bone;
  rKnee: THREE.Bone;
  lFoot: THREE.Bone;
  rFoot: THREE.Bone;
  materials: THREE.MeshStandardMaterial[];
  headRadius: number;
  def: CharacterDef;
  /** Photo "bobble-head" card when a photo face exists but no 3D face mesh was built. */
  faceSprite: THREE.Sprite | null;
  /** Skull centre, child of the head bone: heads are built here. */
  headMount: THREE.Group;
  hands: Record<'l' | 'r', Record<HandShape, THREE.Group>>;
  /** Textures and geometries to free with the rig. */
  disposables: { dispose(): void }[];
}

export function setHandShape(rig: Rig, side: 'l' | 'r', shape: HandShape): void {
  const set = rig.hands[side];
  for (const s of HAND_SHAPES) set[s].visible = s === shape;
}

// ------------------------------------------------------------------ lofted tubes

interface Sec {
  y: number;
  rx: number;
  rz: number;
  cx?: number;
  cz?: number;
  /** Superellipse exponent (2 = ellipse, higher = boxier). */
  n?: number;
  /** Extra forward / backward extent (belly, chest, seat). */
  front?: number;
  back?: number;
}

type Influence = [bone: number, weight: number][];

const ss = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function catmull(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

/** Smoothly interpolated cross-section at height y (sections sorted by ascending y). */
function sample(secs: Sec[], y: number): Required<Sec> {
  let i = 0;
  while (i < secs.length - 2 && y > secs[i + 1].y) i++;
  const a = secs[Math.max(0, i - 1)];
  const b = secs[i];
  const c = secs[i + 1];
  const d = secs[Math.min(secs.length - 1, i + 2)];
  const t = Math.max(0, Math.min(1, (y - b.y) / (c.y - b.y || 1)));
  const f = (k: keyof Sec, def: number) => catmull(a[k] ?? def, b[k] ?? def, c[k] ?? def, d[k] ?? def, t);
  return {
    y,
    rx: Math.max(0.004, f('rx', 0)),
    rz: Math.max(0.004, f('rz', 0)),
    cx: f('cx', 0),
    cz: f('cz', 0),
    n: Math.max(1.6, f('n', 2)),
    front: Math.max(0, f('front', 0)),
    back: Math.max(0, f('back', 0)),
  };
}

interface LoftOpts {
  rings: number;
  seg: number;
  influence: (x: number, y: number, z: number) => Influence;
  capBottom?: boolean;
  capTop?: boolean;
  /** Height range mapped to v = 0..1 (defaults to the tube's own range). */
  v0?: number;
  v1?: number;
}

function loft(secs: Sec[], o: LoftOpts): THREE.BufferGeometry {
  const y0 = secs[0].y;
  const y1 = secs[secs.length - 1].y;
  const v0 = o.v0 ?? y0;
  const v1 = o.v1 ?? y1;
  const cols = o.seg + 1;
  const pos: number[] = [];
  const uv: number[] = [];
  const skinI: number[] = [];
  const skinW: number[] = [];
  const idx: number[] = [];
  const pushSkin = (x: number, y: number, z: number) => {
    const inf = o.influence(x, y, z).filter(([, w]) => w > 1e-4).sort((p, q) => q[1] - p[1]).slice(0, 4);
    const tot = inf.reduce((s, [, w]) => s + w, 0) || 1;
    for (let k = 0; k < 4; k++) {
      skinI.push(inf[k]?.[0] ?? 0);
      skinW.push(inf[k] ? inf[k][1] / tot : 0);
    }
  };
  for (let r = 0; r <= o.rings; r++) {
    const y = y0 + ((y1 - y0) * r) / o.rings;
    const s = sample(secs, y);
    const e = 2 / s.n;
    for (let c = 0; c < cols; c++) {
      const u = c / o.seg;
      const ph = u * Math.PI * 2;
      const sn = Math.sin(ph);
      const cs = Math.cos(ph);
      const x = s.cx + s.rx * Math.sign(sn) * Math.abs(sn) ** e;
      const zr = cs > 0 ? s.rz + s.back : s.rz + s.front;
      const z = s.cz - zr * Math.sign(cs) * Math.abs(cs) ** e;
      pos.push(x, y, z);
      uv.push(u, (y - v0) / (v1 - v0));
      pushSkin(x, y, z);
    }
  }
  for (let r = 0; r < o.rings; r++) {
    for (let c = 0; c < o.seg; c++) {
      const a = r * cols + c;
      const b = a + 1;
      const d = a + cols;
      const e2 = d + 1;
      idx.push(a, b, d, b, e2, d);
    }
  }
  const cap = (ring: number, down: boolean) => {
    const s = sample(secs, ring === 0 ? y0 : y1);
    const center = pos.length / 3;
    const cy = ring === 0 ? y0 - (down ? 0.01 : 0) : y1 + 0.01;
    pos.push(s.cx, cy, s.cz);
    uv.push(0.5, ring === 0 ? 0 : 1);
    pushSkin(s.cx, cy, s.cz);
    const base = ring * cols;
    for (let c = 0; c < o.seg; c++) {
      if (down) idx.push(center, base + c + 1, base + c);
      else idx.push(center, base + c, base + c + 1);
    }
  };
  if (o.capBottom) cap(0, true);
  if (o.capTop) cap(o.rings, false);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinI, 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinW, 4));
  g.setIndex(idx);
  g.computeVertexNormals();
  // Weld normals across the UV seam (first and last column share positions).
  const n = g.getAttribute('normal') as THREE.BufferAttribute;
  for (let r = 0; r <= o.rings; r++) {
    const a = r * cols;
    const b = a + o.seg;
    const nx = n.getX(a) + n.getX(b);
    const ny = n.getY(a) + n.getY(b);
    const nz = n.getZ(a) + n.getZ(b);
    const l = Math.hypot(nx, ny, nz) || 1;
    n.setXYZ(a, nx / l, ny / l, nz / l);
    n.setXYZ(b, nx / l, ny / l, nz / l);
  }
  return g;
}

// ------------------------------------------------------------------ rigid parts

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0], scale?: [number, number, number]): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  if (scale) m.scale.set(...scale);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Left-hand shapes in hand-bone space (wrist at the origin, fingers toward -Y, palm facing -X). */
function buildHands(skin: THREE.Material, size: number): Record<HandShape, THREE.Group> {
  const s = size;
  const back = new RoundedBoxGeometry(0.048 * s, 0.075 * s, 0.08 * s, 3, 0.018 * s);
  const flatPalm = new RoundedBoxGeometry(0.03 * s, 0.085 * s, 0.082 * s, 3, 0.012 * s);
  const knuckles = new RoundedBoxGeometry(0.056 * s, 0.032 * s, 0.084 * s, 3, 0.014 * s);
  const curled = new RoundedBoxGeometry(0.024 * s, 0.05 * s, 0.078 * s, 3, 0.011 * s);
  const bump = new THREE.SphereGeometry(0.0105 * s, 10, 8);
  const finger = new THREE.CapsuleGeometry(0.009 * s, 0.062 * s, 4, 8);
  const thumb = new THREE.CapsuleGeometry(0.0118 * s, 0.038 * s, 4, 8);
  const fingerZ = [0.031, 0.01, -0.011, -0.031].map((z) => z * s);
  /** Chunky fist; `extended` fingers (0 = index) stick out straight. */
  const fist = (extended: number[], thumbUp = false): THREE.Group => {
    const g = new THREE.Group();
    g.add(mesh(back, skin, [0.004 * s, -0.045 * s, 0]));
    g.add(mesh(knuckles, skin, [-0.002 * s, -0.094 * s, 0]));
    g.add(mesh(curled, skin, [-0.03 * s, -0.074 * s, 0]));
    fingerZ.forEach((z, i) => {
      if (extended.includes(i)) g.add(mesh(finger, skin, [-0.004 * s, -0.14 * s, z]));
      else g.add(mesh(bump, skin, [0.02 * s, -0.103 * s, z]));
    });
    if (thumbUp) g.add(mesh(thumb, skin, [-0.012 * s, -0.052 * s, 0.062 * s], [Math.PI / 2, 0, 0]));
    else g.add(mesh(thumb, skin, [-0.045 * s, -0.08 * s, 0.01 * s], [Math.PI / 2, 0, 0]));
    return g;
  };
  const open = new THREE.Group();
  open.add(mesh(flatPalm, skin, [0, -0.048 * s, 0.002 * s]));
  fingerZ.forEach((z, i) => open.add(mesh(finger, skin, [0, -0.13 * s + Math.abs(i - 1.5) * 0.006 * s, z * 1.1])));
  open.add(mesh(thumb, skin, [-0.018 * s, -0.06 * s, 0.058 * s], [Math.PI / 2 - 0.5, 0, 0]));
  return {
    fist: fist([]),
    open,
    point: fist([0]),
    thumb: fist([], true),
    v: fist([0, 1]),
  };
}

function buildShoe(mat: THREE.Material, soleMat: THREE.Material, female: boolean): THREE.Group {
  const g = new THREE.Group();
  const upper = new THREE.CapsuleGeometry(0.048, 0.15, 6, 14);
  g.add(mesh(upper, mat, [0, -0.004, 0.05], [Math.PI / 2, 0, 0], [female ? 0.85 : 1, 1, female ? 0.62 : 0.72]));
  g.add(mesh(new RoundedBoxGeometry(female ? 0.085 : 0.104, 0.02, 0.27, 2, 0.008), soleMat, [0, -0.03, 0.05]));
  g.add(mesh(new RoundedBoxGeometry(0.085, female ? 0.05 : 0.028, 0.065, 2, 0.008), soleMat, [0, female ? -0.045 : -0.03, -0.055]));
  return g;
}

// ------------------------------------------------------------------ character

const hashId = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function buildCharacter(def: CharacterDef, opts: { face?: THREE.Texture | null; photo?: PhotoHead | null } = {}): Rig {
  const look = def.look;
  const party = PARTIES[def.party];
  const female = !!look.female;
  const bw = look.build * (female ? 0.92 : 1);
  const sw = female ? 0.88 : 1.0;
  const limb = Math.sqrt(look.build) * (female ? 0.9 : 1);
  const belly = Math.max(0, look.build - 1.02) * 1.25;
  const seed = hashId(def.id);
  const disposables: { dispose(): void }[] = [];
  const materials: THREE.MeshStandardMaterial[] = [];
  const track = <M extends THREE.MeshStandardMaterial>(m: M): M => {
    materials.push(m);
    return m;
  };

  const outfit = look.outfit;
  const style: JacketStyle = outfit === 'suit' ? 'suit' : outfit === 'open-suit' ? 'open' : outfit === 'blazer' || outfit === 'skirt' ? 'blazer' : outfit === 'shirt' ? 'shirt' : 'tshirt';
  const tie = outfit === 'suit' && look.tie !== null && look.tie !== undefined ? look.tie : null;

  // ---- skeleton (same joint layout the animator expects)
  const root = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.position.set(0, HIP_H, 0);
  root.add(pivot);
  const bone = (parent: THREE.Object3D, x: number, y: number, z: number): THREE.Bone => {
    const b = new THREE.Bone();
    b.position.set(x, y, z);
    parent.add(b);
    return b;
  };
  const shX = 0.2 * sw * (0.55 + 0.45 * bw) + 0.035;
  const hipX = 0.092 * (0.6 + 0.4 * bw) * (female ? 1.04 : 1);
  const hips = bone(pivot, 0, 0, 0);
  const spine = bone(hips, 0, 0.06, 0);
  const chest = bone(spine, 0, 0.5, 0);
  const neck = bone(chest, 0, 0.03, 0);
  const head = bone(neck, 0, 0.1, 0);
  const lSh = bone(chest, shX, -0.04, 0);
  const lEl = bone(lSh, 0, -0.3, 0);
  const lHand = bone(lEl, 0, -0.3, 0);
  const rSh = bone(chest, -shX, -0.04, 0);
  const rEl = bone(rSh, 0, -0.3, 0);
  const rHand = bone(rEl, 0, -0.3, 0);
  const lHip = bone(hips, hipX, -0.05, 0);
  const lKnee = bone(lHip, 0, -THIGH_LEN, 0);
  const lFoot = bone(lKnee, 0, -SHIN_LEN, 0);
  const rHip = bone(hips, -hipX, -0.05, 0);
  const rKnee = bone(rHip, 0, -THIGH_LEN, 0);
  const rFoot = bone(rKnee, 0, -SHIN_LEN, 0);
  const bones = [hips, spine, chest, neck, head, lSh, lEl, lHand, rSh, rEl, rHand, lHip, lKnee, lFoot, rHip, rKnee, rFoot];
  const B = { hips: 0, spine: 1, chest: 2, neck: 3, head: 4, lSh: 5, lEl: 6, lHand: 7, rSh: 8, rEl: 9, rHand: 10, lHip: 11, lKnee: 12, lFoot: 13, rHip: 14, rKnee: 15, rFoot: 16 };
  root.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bones);

  // ---- materials (with a photo face, the skin tone comes from the photo's cheeks)
  const skinColor = new THREE.Color(opts.photo ? opts.photo.skin : look.skin);
  const skin = track(new THREE.MeshPhysicalMaterial({ color: skinColor, roughness: 0.52, sheen: 0.25, sheenColor: new THREE.Color(0xffc0a0), sheenRoughness: 0.6 }));
  const fabricMat = (t: { map: THREE.Texture; normalMap: THREE.Texture }, rough = 0.8) => {
    disposables.push(t.map, t.normalMap);
    return track(new THREE.MeshPhysicalMaterial({ map: t.map, normalMap: t.normalMap, normalScale: new THREE.Vector2(0.7, 0.7), roughness: rough, sheen: 0.45, sheenRoughness: 0.55, sheenColor: new THREE.Color(0xffffff).multiplyScalar(0.25), side: THREE.DoubleSide }));
  };

  // ---- torso (jacket / shirt / t-shirt)
  const yHem = style === 'shirt' || style === 'tshirt' ? 0.9 : 0.82;
  const yTop = 1.585;
  const bust = female ? 0.035 : 0;
  const torsoSecs: Sec[] = [
    { y: yHem, rx: (female ? 0.19 : 0.185) * bw, rz: 0.13 * bw, back: 0.01 },
    { y: 0.92, rx: (female ? 0.185 : 0.175) * bw, rz: 0.125 * bw, front: belly * 0.05, back: 0.012 },
    { y: 1.05, rx: (female ? 0.15 : 0.166 + belly * 0.03) * bw, rz: 0.118 * bw, front: belly * 0.11 },
    { y: 1.18, rx: (female ? 0.16 : 0.173) * bw, rz: 0.12 * bw, front: belly * 0.07 },
    { y: 1.32, rx: 0.19 * bw * sw, rz: 0.124 * Math.sqrt(bw), front: bust },
    { y: 1.42, rx: 0.205 * sw * (0.55 + 0.45 * bw), rz: 0.12 * Math.sqrt(bw), front: bust * 0.6, n: 2.2 },
    { y: 1.49, rx: shX - 0.015, rz: 0.105 * Math.sqrt(bw), n: 2.6 },
    { y: 1.535, rx: shX - 0.055, rz: 0.09, n: 2.3 },
    { y: 1.565, rx: 0.11, rz: 0.08 },
    { y: yTop, rx: 0.068, rz: 0.066 },
  ];
  const side = (x: number, l: number, r: number) => (x >= 0 ? l : r);
  const torsoInf = (x: number, y: number): Influence => {
    const wHips = 1 - ss(0.98, 1.12, y);
    const wChest = ss(1.3, 1.44, y);
    const wSpine = Math.max(0, 1 - wHips - wChest);
    let out: Influence = [[B.hips, wHips], [B.spine, wSpine], [B.chest, wChest]];
    const ax = Math.abs(x);
    const kSh = y > 1.34 ? ss(0.12, shX, ax) * ss(1.34, 1.48, y) * 0.7 : 0;
    const kThigh = y < 0.94 ? (1 - ss(0.82, 0.94, y)) * 0.35 * ss(0.02, 0.12, ax) : 0;
    const kNeck = y > 1.56 ? ss(1.56, yTop, y) * 0.5 : 0;
    const keep = 1 - kSh - kThigh - kNeck;
    out = out.map(([b, w]) => [b, w * keep]);
    if (kSh) out.push([side(x, B.lSh, B.rSh), kSh]);
    if (kThigh) out.push([side(x, B.lHip, B.rHip), kThigh]);
    if (kNeck) out.push([B.neck, kNeck]);
    return out;
  };
  const torsoGeo = loft(torsoSecs, { rings: 44, seg: 40, influence: torsoInf });
  const jacketTex = jacketTextures({ color: look.jacket, shirt: look.shirt, tie, style, pin: party.color, female, pinstripe: seed % 5 === 0, y0: yHem, y1: yTop }, seed);
  const jacketMat = fabricMat(jacketTex, style === 'tshirt' ? 0.9 : 0.78);

  // ---- sleeves
  const shortSleeve = style === 'tshirt';
  const sleeveColor = style === 'shirt' || style === 'tshirt' ? look.shirt : look.jacket;
  const sleeveSecs = (sx: number): Sec[] => [
    { y: 0.9, rx: 0.047 * limb, rz: 0.047 * limb, cx: sx },
    { y: 0.94, rx: 0.046 * limb, rz: 0.046 * limb, cx: sx },
    { y: 1.05, rx: 0.05 * limb, rz: 0.052 * limb, cx: sx, cz: 0.004 },
    { y: 1.17, rx: 0.053 * limb, rz: 0.053 * limb, cx: sx },
    { y: 1.3, rx: 0.06 * limb, rz: 0.062 * limb, cx: sx },
    { y: 1.44, rx: 0.068 * limb, rz: 0.07 * limb, cx: sx },
    { y: 1.53, rx: 0.06 * limb, rz: 0.066 * limb, cx: sx * 0.96 },
  ];
  const armInf = (sh: number, el: number) => (_x: number, y: number): Influence => {
    const wChest = ss(1.46, 1.53, y) * 0.35;
    const wEl = 1 - ss(1.1, 1.25, y);
    return [[B.chest, wChest], [sh, Math.max(0, 1 - wChest - wEl)], [el, wEl]];
  };
  const bodyParts: THREE.SkinnedMesh[] = [];
  const skinned = (geo: THREE.BufferGeometry, mat: THREE.Material) => {
    const m = new THREE.SkinnedMesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    m.frustumCulled = false;
    root.add(m);
    m.bind(skeleton);
    bodyParts.push(m);
    disposables.push(geo);
    return m;
  };
  skinned(torsoGeo, jacketMat);
  for (const [sx, sh, el, outerU] of [[shX, B.lSh, B.lEl, 0.25], [-shX, B.rSh, B.rEl, 0.75]] as const) {
    const t = sleeveTextures(sleeveColor, style === 'tshirt' ? null : look.shirt, seed + (sx > 0 ? 1 : 2), outerU, shortSleeve ? 0.55 : null, look.skin);
    skinned(loft(sleeveSecs(sx), { rings: 30, seg: 20, influence: armInf(sh, el) }), fabricMat(t));
  }

  // ---- trousers / skirt and legs
  const skirt = outfit === 'skirt';
  const pantsTex = trouserTextures(look.pants, seed + 5, !skirt);
  const pantsMat = fabricMat(pantsTex);
  const pelvisSecs: Sec[] = [
    { y: 0.77, rx: 0.05, rz: 0.05 },
    { y: 0.8, rx: 0.13 * bw, rz: 0.095 * bw },
    { y: 0.86, rx: 0.165 * bw, rz: 0.118 * bw, back: 0.012 },
    { y: 0.94, rx: 0.17 * bw, rz: 0.122 * bw, back: 0.01, front: belly * 0.04 },
    { y: 1.02, rx: 0.165 * bw, rz: 0.118 * bw, front: belly * 0.06 },
  ];
  skinned(
    loft(pelvisSecs, {
      rings: 14,
      seg: 28,
      capBottom: true,
      influence: (x, y) => {
        const k = (1 - ss(0.78, 0.88, y)) * 0.55 * ss(0.0, 0.07, Math.abs(x));
        return [[B.hips, 1 - k], [side(x, B.lHip, B.rHip), k]];
      },
    }),
    pantsMat,
  );
  const legSecs = (lx: number, bare: boolean): Sec[] => {
    const t = bare ? 0.82 : 1;
    return [
      { y: 0.04, rx: (bare ? 0.034 : 0.058) * limb, rz: (bare ? 0.038 : 0.06) * limb, cx: lx },
      { y: 0.14, rx: 0.052 * limb * t, rz: 0.056 * limb * t, cx: lx },
      { y: 0.33, rx: 0.062 * limb * t, rz: 0.068 * limb * t, cx: lx, back: 0.008 },
      { y: 0.46, rx: 0.06 * limb * t, rz: 0.062 * limb * t, cx: lx, cz: 0.004 },
      { y: 0.62, rx: 0.075 * limb * t, rz: 0.078 * limb * t, cx: lx },
      { y: 0.8, rx: 0.09 * limb * t, rz: 0.094 * limb * t, cx: lx },
      { y: 0.95, rx: 0.098 * limb * t, rz: 0.1 * limb * t, cx: lx * 0.9 },
    ];
  };
  const legInf = (hip: number, knee: number) => (_x: number, y: number): Influence => {
    const wHips = ss(0.84, 0.97, y) * 0.55;
    const wShin = 1 - ss(0.4, 0.53, y);
    return [[B.hips, wHips], [hip, Math.max(0, 1 - wHips - wShin)], [knee, wShin]];
  };
  let legMat: THREE.Material = pantsMat;
  if (skirt) {
    legMat = track(new THREE.MeshPhysicalMaterial({ color: shade(look.skin, 0.9), roughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color(0x553322) }));
    const skirtSecs: Sec[] = [
      { y: 0.5, rx: 0.2 * bw, rz: 0.14 * bw },
      { y: 0.7, rx: 0.19 * bw, rz: 0.135 * bw, back: 0.01 },
      { y: 0.9, rx: 0.19 * bw, rz: 0.13 * bw, back: 0.015 },
      { y: 1.02, rx: 0.165 * bw, rz: 0.118 * bw },
    ];
    const skirtTex = trouserTextures(look.pants, seed + 9, false);
    skinned(
      loft(skirtSecs, {
        rings: 20,
        seg: 32,
        influence: (x, y) => {
          const k = (1 - ss(0.5, 0.88, y)) * 0.6 * ss(0.0, 0.12, Math.abs(x));
          return [[B.hips, 1 - k], [side(x, B.lHip, B.rHip), k]];
        },
      }),
      fabricMat(skirtTex),
    );
  }
  skinned(loft(legSecs(hipX, skirt), { rings: 36, seg: 18, influence: legInf(B.lHip, B.lKnee) }), legMat);
  skinned(loft(legSecs(-hipX, skirt), { rings: 36, seg: 18, influence: legInf(B.rHip, B.rKnee) }), legMat);

  // ---- neck and shirt collar
  const neckR = female ? 0.047 : 0.056 * Math.sqrt(bw);
  skinned(
    loft([
      { y: 1.55, rx: neckR * 1.05, rz: neckR * 1.02 },
      { y: 1.62, rx: neckR, rz: neckR * 0.98, cz: 0.004 },
      { y: 1.7, rx: neckR * 0.95, rz: neckR * 0.95, cz: 0.012 },
    ], {
      rings: 10,
      seg: 16,
      influence: (_x, y) => {
        const wChest = 1 - ss(1.55, 1.6, y);
        const wHead = ss(1.63, 1.7, y);
        return [[B.chest, wChest], [B.neck, Math.max(0, 1 - wChest - wHead)], [B.head, wHead]];
      },
    }),
    skin,
  );
  const shirtMat = track(new THREE.MeshStandardMaterial({ color: look.shirt, roughness: 0.6 }));
  if (style !== 'tshirt') {
    skinned(
      loft([
        { y: 1.555, rx: neckR + 0.018, rz: neckR + 0.016 },
        { y: 1.58, rx: neckR + 0.014, rz: neckR + 0.013 },
        { y: 1.61, rx: neckR + 0.01, rz: neckR + 0.01 },
      ], {
        rings: 3,
        seg: 24,
        influence: (_x, y) => [[B.chest, 1 - ss(1.56, 1.62, y) * 0.6], [B.neck, ss(1.56, 1.62, y) * 0.6]],
      }),
      shirtMat,
    );
    // Collar points.
    for (const s of [-1, 1]) {
      const pt = mesh(new THREE.ConeGeometry(0.022, 0.05, 3), shirtMat, [s * 0.028, 0.06, neckR + 0.022], [Math.PI - 0.25, 0, s * 0.5], [1, 1, 0.3]);
      chest.add(pt);
    }
    if (tie !== null) {
      const knotMat = track(new THREE.MeshStandardMaterial({ color: tie, roughness: 0.4 }));
      chest.add(mesh(new RoundedBoxGeometry(0.032, 0.03, 0.02, 2, 0.008), knotMat, [0, 0.052, neckR + 0.026], [0.25, 0, 0]));
    }
  }

  // ---- hands and shoes
  const handSize = (female ? 0.88 : 1) * (0.9 + 0.1 * look.build);
  const lHands = buildHands(skin, handSize);
  const rHands = buildHands(skin, handSize);
  for (const s of HAND_SHAPES) {
    lHand.add(lHands[s]);
    const r = rHands[s];
    r.scale.x = -1;
    rHand.add(r);
  }
  const shoeMat = track(new THREE.MeshPhysicalMaterial({ color: look.shoes ?? 0x141414, roughness: 0.28, clearcoat: 0.9, clearcoatRoughness: 0.18 }));
  const soleMat = track(new THREE.MeshStandardMaterial({ color: 0x0b0b0b, roughness: 0.7 }));
  lFoot.add(buildShoe(shoeMat, soleMat, female));
  rFoot.add(buildShoe(shoeMat, soleMat, female));

  // ---- head
  const headMount = new THREE.Group();
  headMount.position.set(0, 0.14, 0);
  head.add(headMount);
  const R = 0.13 * (look.head ?? 1);
  let faceSprite: THREE.Sprite | null = null;
  if (opts.photo) {
    buildPhotoHead(headMount, opts.photo, look, skin, track, disposables, seed);
  } else if (opts.face) {
    const mat = new THREE.SpriteMaterial({ map: opts.face, transparent: true, alphaTest: 0.06, toneMapped: false, depthWrite: true });
    faceSprite = new THREE.Sprite(mat);
    const s = look.head ?? 1;
    faceSprite.scale.set(0.44 * s, 0.55 * s, 1);
    faceSprite.position.set(0, 0.02, 0.03);
    headMount.add(faceSprite);
  } else {
    buildHead(headMount, look, R, skin, track, disposables, seed);
  }

  // Characters pick up more image-based light than the set, so they read against it (Tekken style).
  for (const m of materials) m.envMapIntensity = 1.6;
  root.scale.setScalar(look.height);
  const rig: Rig = {
    root, pivot, hips, spine, chest, neck, head,
    lSh, lEl, rSh, rEl, lHand, rHand,
    lHip, lKnee, rHip, rKnee, lFoot, rFoot,
    materials,
    headRadius: R,
    def,
    faceSprite,
    headMount,
    hands: { l: lHands, r: rHands },
    disposables,
  };
  setHandShape(rig, 'l', 'fist');
  setHandShape(rig, 'r', 'fist');
  return rig;
}

export function disposeRig(rig: Rig): void {
  rig.root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) m.geometry.dispose();
  });
  // The face texture is shared and cached, so only the sprite material is disposed.
  (rig.faceSprite?.material as THREE.SpriteMaterial | undefined)?.dispose();
  for (const m of rig.materials) m.dispose();
  for (const d of rig.disposables) d.dispose();
}
