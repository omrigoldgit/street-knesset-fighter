// Heads. With a reconstructed photo face, the head is the MK's real face surface (MediaPipe Face
// Mesh, textured with their photo) on a skull that tucks in behind it, with hair and headwear fitted
// to that skull. Without one, a procedural caricature head is built from the roster's look data.
// Head space: origin at the skull centre, +X is the character's left, +Z is forward.

import * as THREE from 'three';
import type { Look } from '../game/characterTypes';
import type { PhotoHead } from './faces';
import { FACE_OVAL, faceTriangles } from './faceTopology';
import { hairTextures } from './garments';
import { shade } from './materials';

export type Track = <M extends THREE.MeshStandardMaterial>(m: M) => M;
/** Hairline heights on a unit skull (y / radius) at the forehead, temples, sides (above the ears) and nape. */
export interface HairLine {
  front: number;
  temple: number;
  side: number;
  back: number;
}
type Std = (color: number, extra?: THREE.MeshStandardMaterialParameters) => THREE.MeshStandardMaterial;
type Disposables = { dispose(): void }[];

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0], scale?: [number, number, number]): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  if (scale) m.scale.set(...scale);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

const stdFactory = (track: Track): Std => (color, extra = {}) => track(new THREE.MeshStandardMaterial({ color, roughness: 0.55, ...extra }));

// ------------------------------------------------------------------ photo head

/**
 * Depth envelope of the face surface on a grid over (x, y): the front-most face z per cell,
 * extended outward with a falloff and smoothed, so the skull can be tucked in behind the face.
 */
function faceEnvelope(v: Float32Array, tris: Uint16Array): (x: number, y: number) => number | null {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (let i = 0; i < v.length; i += 3) {
    x0 = Math.min(x0, v[i]);
    x1 = Math.max(x1, v[i]);
    y0 = Math.min(y0, v[i + 1]);
    y1 = Math.max(y1, v[i + 1]);
  }
  const pad = (x1 - x0) * 0.3;
  x0 -= pad;
  x1 += pad;
  y0 -= pad;
  y1 += pad;
  const N = 72;
  const cw = (x1 - x0) / (N - 1);
  const ch = (y1 - y0) / (N - 1);
  const grid = new Float32Array(N * N).fill(NaN);
  for (let t = 0; t < tris.length; t += 3) {
    const a = tris[t] * 3;
    const b = tris[t + 1] * 3;
    const c = tris[t + 2] * 3;
    const ax = v[a], ay = v[a + 1], az = v[a + 2];
    const bx = v[b], by = v[b + 1], bz = v[b + 2];
    const cx = v[c], cy = v[c + 1], cz = v[c + 2];
    const det = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    if (Math.abs(det) < 1e-12) continue;
    const gi0 = Math.max(0, Math.floor((Math.min(ax, bx, cx) - x0) / cw));
    const gi1 = Math.min(N - 1, Math.ceil((Math.max(ax, bx, cx) - x0) / cw));
    const gj0 = Math.max(0, Math.floor((Math.min(ay, by, cy) - y0) / ch));
    const gj1 = Math.min(N - 1, Math.ceil((Math.max(ay, by, cy) - y0) / ch));
    for (let j = gj0; j <= gj1; j++) {
      const py = y0 + j * ch;
      for (let i = gi0; i <= gi1; i++) {
        const px = x0 + i * cw;
        const l1 = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / det;
        const l2 = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / det;
        const l3 = 1 - l1 - l2;
        if (l1 < -0.01 || l2 < -0.01 || l3 < -0.01) continue;
        const z = l1 * az + l2 * bz + l3 * cz;
        const k = j * N + i;
        if (Number.isNaN(grid[k]) || z > grid[k]) grid[k] = z;
      }
    }
  }
  // Extend outward: each empty cell next to known ones takes their max minus a falloff.
  const drop = Math.max(cw, ch) * 1.3;
  for (let it = 0; it < 14; it++) {
    const next = grid.slice();
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const k = j * N + i;
        if (!Number.isNaN(grid[k])) continue;
        let best = -Infinity;
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const ii = i + di;
            const jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue;
            const val = grid[jj * N + ii];
            if (!Number.isNaN(val)) best = Math.max(best, val);
          }
        }
        if (best > -Infinity) next[k] = best - drop;
      }
    }
    grid.set(next);
  }
  // Smooth.
  for (let it = 0; it < 2; it++) {
    const next = grid.slice();
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        let s = 0;
        let n = 0;
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const val = grid[(j + dj) * N + i + di];
            if (!Number.isNaN(val)) {
              s += val;
              n++;
            }
          }
        }
        if (n >= 5 && !Number.isNaN(grid[j * N + i])) next[j * N + i] = s / n;
      }
    }
    grid.set(next);
  }
  return (x, y) => {
    const fi = (x - x0) / cw;
    const fj = (y - y0) / ch;
    if (fi < 0 || fj < 0 || fi > N - 1 || fj > N - 1) return null;
    const i = Math.min(N - 2, Math.floor(fi));
    const j = Math.min(N - 2, Math.floor(fj));
    const tx = fi - i;
    const ty = fj - j;
    const q = [grid[j * N + i], grid[j * N + i + 1], grid[(j + 1) * N + i], grid[(j + 1) * N + i + 1]];
    if (q.some(Number.isNaN)) {
      const ok = q.filter((z) => !Number.isNaN(z));
      return ok.length ? Math.min(...ok) : null;
    }
    return (q[0] * (1 - tx) + q[1] * tx) * (1 - ty) + (q[2] * (1 - tx) + q[3] * tx) * ty;
  };
}

/** Alpha per vertex: 0 on the face-oval boundary, fading in over two rings of neighbours. */
function edgeAlpha(tris: Uint16Array, count: number): Float32Array {
  const adj: Set<number>[] = Array.from({ length: count }, () => new Set());
  for (let t = 0; t < tris.length; t += 3) {
    const a = tris[t];
    const b = tris[t + 1];
    const c = tris[t + 2];
    adj[a].add(b).add(c);
    adj[b].add(a).add(c);
    adj[c].add(a).add(b);
  }
  const dist = new Int32Array(count).fill(99);
  let frontier = FACE_OVAL.slice();
  for (const i of frontier) dist[i] = 0;
  for (let d = 1; d <= 3; d++) {
    const next: number[] = [];
    for (const i of frontier) {
      for (const j of adj[i]) {
        if (dist[j] > d) {
          dist[j] = d;
          next.push(j);
        }
      }
    }
    frontier = next;
  }
  const alpha = new Float32Array(count);
  for (let i = 0; i < count; i++) alpha[i] = dist[i] === 0 ? 0 : dist[i] === 1 ? 0.45 : dist[i] === 2 ? 0.85 : 1;
  return alpha;
}

export function buildPhotoHead(c: THREE.Group, photo: PhotoHead, look: Look, skin: THREE.MeshStandardMaterial, track: Track, disposables: Disposables, seed: number): void {
  const P = photo.mesh.pos;
  const UV = photo.mesh.uv;
  const at = (i: number) => new THREE.Vector3(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
  const hs = look.head ?? 1;
  const left = at(234);
  const right = at(454);
  const faceW = Math.abs(right.x - left.x) || 15;
  const s = (0.2 * hs) / faceW;
  const ref = left.clone().add(right).multiplyScalar(0.5);
  const chin = at(152);
  const brow = at(10);
  const ty = -0.125 * hs - (chin.y - ref.y) * s;

  // Face surface in head space.
  const verts = new Float32Array(468 * 3);
  for (let i = 0; i < 468; i++) {
    verts[i * 3] = (P[i * 3] - ref.x) * s;
    verts[i * 3 + 1] = (P[i * 3 + 1] - ref.y) * s + ty;
    verts[i * 3 + 2] = (P[i * 3 + 2] - ref.z) * s * 1.05;
  }
  const tris = faceTriangles();
  // Make sure triangles face outward (+Z at the nose).
  let idx: Uint16Array = tris;
  {
    const t0 = 0;
    const a = new THREE.Vector3().fromArray(verts, tris[t0] * 3);
    const b = new THREE.Vector3().fromArray(verts, tris[t0 + 1] * 3);
    const d = new THREE.Vector3().fromArray(verts, tris[t0 + 2] * 3);
    const n = b.clone().sub(a).cross(d.clone().sub(a));
    let facing = 0;
    // Sum over all triangles for a robust vote.
    for (let t = 0; t < tris.length; t += 3) {
      a.fromArray(verts, tris[t] * 3);
      b.fromArray(verts, tris[t + 1] * 3);
      d.fromArray(verts, tris[t + 2] * 3);
      n.copy(b).sub(a).cross(d.clone().sub(a));
      facing += n.z;
    }
    if (facing < 0) {
      idx = new Uint16Array(tris.length);
      for (let t = 0; t < tris.length; t += 3) {
        idx[t] = tris[t];
        idx[t + 1] = tris[t + 2];
        idx[t + 2] = tris[t + 1];
      }
    }
  }
  const alpha = edgeAlpha(idx, 468);
  // Edge texture coordinates are pulled toward the nose so the fade samples skin, not background.
  const ncu = UV[1 * 2];
  const ncv = UV[1 * 2 + 1];
  const uv = new Float32Array(468 * 2);
  for (let i = 0; i < 468; i++) {
    const pull = alpha[i] === 0 ? 0.1 : alpha[i] < 0.5 ? 0.06 : alpha[i] < 0.9 ? 0.03 : 0;
    uv[i * 2] = UV[i * 2] + (ncu - UV[i * 2]) * pull;
    uv[i * 2 + 1] = 1 - (UV[i * 2 + 1] + (ncv - UV[i * 2 + 1]) * pull);
  }
  const col = new Float32Array(468 * 4);
  for (let i = 0; i < 468; i++) col.set([1, 1, 1, alpha[i]], i * 4);
  const faceGeo = new THREE.BufferGeometry();
  faceGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
  faceGeo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  faceGeo.setAttribute('color', new THREE.BufferAttribute(col, 4));
  faceGeo.setIndex(new THREE.BufferAttribute(idx, 1));
  faceGeo.computeVertexNormals();
  disposables.push(faceGeo);
  // The photo already carries its own lighting, so it gets a little self-illumination to stay readable.
  const faceMat = new THREE.MeshStandardMaterial({
    map: photo.texture,
    vertexColors: true,
    transparent: true,
    roughness: 0.62,
    emissive: 0xffffff,
    emissiveMap: photo.texture,
    emissiveIntensity: 0.24,
    envMapIntensity: 0.8,
  });
  disposables.push(faceMat);
  const face = new THREE.Mesh(faceGeo, faceMat);
  face.castShadow = true;
  face.renderOrder = 2;
  c.add(face);

  // Skull: an ellipsoid sized from the face, tucked behind the face surface.
  const W = 0.2 * hs;
  const faceH = (brow.y - chin.y) * s;
  const K = new THREE.Vector3(0, ty + 0.125 * hs * 0.16 + 0.004, -0.035 * hs);
  const rx = W * 0.52;
  const ry = Math.max(faceH * 0.7, W * 0.66);
  const rz = W * 0.62;
  const env = faceEnvelope(verts, idx);
  const skullGeo = new THREE.SphereGeometry(1, 56, 40);
  const sp = skullGeo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < sp.count; i++) {
    let x = K.x + sp.getX(i) * rx;
    let y = K.y + sp.getY(i) * ry;
    let z = K.z + sp.getZ(i) * rz;
    // Narrow the lower back of the skull into the neck/jaw.
    if (y < K.y) {
      const k = 1 - ((K.y - y) / ry) * 0.18;
      x *= k;
      z = K.z + (z - K.z) * (z < K.z ? k * 0.95 : 1);
    }
    if (z > K.z) {
      const e = env(x, y);
      if (e !== null) z = Math.min(z, e - 0.003);
    }
    sp.setXYZ(i, x, y, z);
  }
  skullGeo.computeVertexNormals();
  disposables.push(skullGeo);
  c.add(mesh(skullGeo, skin, [0, 0, 0]));

  // Ears (covered by longer hairstyles).
  const earGeo = new THREE.SphereGeometry(1, 16, 12);
  const earMat = skin;
  const earsHidden = ['long', 'wavy', 'bob', 'braids', 'curly'].includes(look.hair);
  for (const sgn of earsHidden ? [] : [1, -1]) {
    const ear = mesh(earGeo, earMat, [sgn * rx * 0.96, K.y - 0.012 * hs, K.z + 0.012 * hs], [0, sgn * 0.35, 0], [0.012 * hs, 0.032 * hs, 0.022 * hs]);
    c.add(ear);
  }

  // Hair and headwear, fitted to the skull by building them for a sphere and stretching.
  const fit = new THREE.Group();
  fit.position.copy(K);
  fit.scale.set(1, ry / rx, rz / rx);
  c.add(fit);
  // Hairline follows the photo: just over the top of the photographed forehead, down past the temples.
  const browTop = ((brow.y - ref.y) * s + ty - K.y) / ry;
  const line: HairLine = { front: browTop - 0.05, temple: browTop - 0.3, side: -0.16, back: -0.42 };
  buildHair(fit, look, rx * 0.985, track, disposables, seed, line);
  buildHeadwear(fit, look, rx, stdFactory(track));

  // Long beards hang below the photo's jawline (shorter beards are already in the photo).
  if ((look.facialHair ?? 'none') === 'long') {
    const bm = stdFactory(track)(look.facialHairColor ?? look.hairColor, { roughness: 0.85 });
    const cy = (chin.y - ref.y) * s + ty;
    const cz = (chin.z - ref.z) * s;
    c.add(mesh(new THREE.SphereGeometry(1, 20, 14), bm, [0, cy - 0.01 * hs, cz - 0.035 * hs], [0, 0, 0], [0.05 * hs, 0.035 * hs, 0.04 * hs]));
    c.add(mesh(new THREE.ConeGeometry(0.046 * hs, 0.15 * hs, 16), bm, [0, cy - 0.085 * hs, cz - 0.04 * hs], [Math.PI - 0.2, 0, 0]));
  }
}

// ------------------------------------------------------------------ procedural head

export function buildHead(c: THREE.Group, look: Look, R: number, skin: THREE.Material, track: Track, disposables: Disposables, seed: number): void {
  const std = stdFactory(track);
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number], opts: { rot?: [number, number, number]; scale?: [number, number, number] } = {}) => {
    const me = mesh(geo, m, pos, opts.rot, opts.scale);
    c.add(me);
    return me;
  };
  const skinDark = std(shade(look.skin, 0.84), { roughness: 0.6 });
  add(new THREE.SphereGeometry(R, 32, 24), skin, [0, 0, 0], { scale: [0.9, 1.08, 1.0] });
  const jawW = look.female ? 0.82 : 0.93;
  add(new THREE.SphereGeometry(R * 0.8, 24, 16), skin, [0, -R * 0.36, R * 0.1], { scale: [jawW, 0.85, 0.95] });
  for (const s of [1, -1]) add(new THREE.SphereGeometry(R * 0.22, 12, 10), skinDark, [s * R * 0.87, -R * 0.02, -R * 0.02], { scale: [0.45, 1, 0.8] });
  const white = std(0xf4f4f0, { roughness: 0.2 });
  const iris = std(0x2b1d14, { roughness: 0.15 });
  for (const s of [1, -1]) {
    add(new THREE.SphereGeometry(R * 0.12, 14, 12), white, [s * R * 0.32, R * 0.1, R * 0.83]);
    add(new THREE.SphereGeometry(R * 0.064, 12, 10), iris, [s * R * 0.31, R * 0.09, R * 0.935]);
  }
  const browM = std(shade(look.facialHairColor ?? look.hairColor, look.hairColor > 0xa00000 ? 0.7 : 1), { roughness: 0.8 });
  const browT = look.brows ?? 1;
  for (const s of [1, -1]) add(new THREE.BoxGeometry(R * 0.36, R * 0.06 * browT, R * 0.08), browM, [s * R * 0.32, R * 0.3, R * 0.9], { rot: [0, s * 0.25, s * 0.16] });
  add(new THREE.SphereGeometry(R * 0.16, 14, 12), skinDark, [0, -R * 0.03, R * 0.98], { scale: [0.78, 1.1, 1.05] });
  add(new THREE.BoxGeometry(R * 0.36, R * 0.045, R * 0.05), std(0x7a3a36, { roughness: 0.4 }), [0, -R * 0.4, R * 0.9]);
  buildHair(c, look, R, track, disposables, seed);
  buildFacialHair(c, look, R, std);
  buildGlasses(c, look, R, std);
  buildHeadwear(c, look, R, std);
}

function hairMaterial(color: number, track: Track, disposables: Disposables, seed: number): THREE.MeshStandardMaterial {
  const t = hairTextures(color, seed);
  t.map.repeat.set(3, 2);
  t.normalMap.repeat.set(3, 2);
  disposables.push(t.map, t.normalMap);
  return track(new THREE.MeshPhysicalMaterial({ map: t.map, normalMap: t.normalMap, roughness: 0.5, sheen: 0.6, sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.4), sheenRoughness: 0.35, side: THREE.DoubleSide }));
}

/**
 * Hair shells: a cap over a skull sphere of radius R, cut by a hairline, plus pieces per style.
 * `lower` moves the front hairline down (photo heads: overlap the photo's forehead edge).
 */
export function buildHair(c: THREE.Group, look: Look, R: number, track: Track, disposables: Disposables, seed: number, line?: HairLine): void {
  if (look.hair === 'bald') return;
  const m = hairMaterial(look.hairColor, track, disposables, seed);
  const add = (geo: THREE.BufferGeometry, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0], scale: [number, number, number] = [1, 1, 1]) => {
    // Photo skulls are true ellipsoids (the caller stretches this group), so caps sit just outside them.
    const fitted = line && geo.userData.cap;
    const me = mesh(geo, m, fitted ? [0, 0, 0] : pos, fitted ? [0, 0, 0] : rot, fitted ? [1.01, 1.0, 1.01] : scale);
    c.add(me);
    return me;
  };
  /**
   * Cap shell: `front` / `back` / `sides` set where the hairline sits (heights as fractions of the
   * radius). Built column by column from the crown down to the hairline, so the edge is a clean curve;
   * the last rows thin out slightly to suggest the hair lying flat at the hairline.
   */
  const cap = (radius: number, front: number, back: number, sides: number) => {
    const receding = look.hair === 'receding' ? 0.25 : 0;
    const photoLimit = (az: number) => {
      // Hairline height (fraction of the radius) by angle from the front: forehead, temple, side, nape.
      const a = Math.acos(Math.cos(az));
      const L = line!;
      const pts: [number, number][] = [[0, L.front + receding], [0.75, L.temple + receding * 0.8], [Math.PI / 2, L.side], [Math.PI, L.back]];
      for (let k = 0; k < pts.length - 1; k++) {
        const [a0, v0] = pts[k];
        const [a1, v1] = pts[k + 1];
        if (a <= a1) {
          const t = (a - a0) / (a1 - a0);
          return v0 + (v1 - v0) * t * t * (3 - 2 * t);
        }
      }
      return L.back;
    };
    const cols = 56;
    const rows = 16;
    const pos: number[] = [];
    const uvs: number[] = [];
    const idx: number[] = [];
    for (let j = 0; j <= rows; j++) {
      for (let i = 0; i <= cols; i++) {
        const az = (i / cols) * Math.PI * 2; // 0 = front (+Z)
        const f = (Math.cos(az) + 1) / 2;
        const sideness = Math.abs(Math.sin(az));
        const limit = line ? radius * photoLimit(az) : radius * (f * front + (1 - f) * back) * (1 - sideness * 0.3) + sideness * radius * sides * 0.3;
        const thMax = Math.acos(Math.max(-0.97, Math.min(0.97, limit / radius)));
        const t = j / rows;
        const th = thMax * t;
        const rr = radius * (1 - 0.035 * t * t * t);
        pos.push(Math.sin(th) * Math.sin(az) * rr, Math.cos(th) * rr, Math.sin(th) * Math.cos(az) * rr);
        uvs.push(i / cols, 1 - t);
      }
    }
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const a = j * (cols + 1) + i;
        const b = a + 1;
        const c2 = a + cols + 1;
        const d = c2 + 1;
        idx.push(a, c2, b, b, c2, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    geo.userData.cap = true;
    return geo;
  };
  const r = R * 1.04;
  switch (look.hair) {
    case 'short':
      add(cap(r, 0.42, -0.2, -0.1), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.93, 1.06, 1.02]);
      break;
    case 'buzz':
      add(cap(R * 1.015, 0.45, -0.25, -0.15), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.92, 1.06, 1.01]);
      break;
    case 'side':
      add(cap(r * 1.02, 0.4, -0.2, -0.1), [0, R * 0.03, -R * 0.02], [0, 0, -0.06], [0.95, 1.07, 1.03]);
      add(new THREE.SphereGeometry(R * 0.6, 16, 10), [R * 0.2, R * 0.72, R * 0.22], [-0.2, 0, -0.25], [1.3, 0.45, 1.1]);
      break;
    case 'swept':
      add(cap(r * 1.03, 0.45, -0.2, -0.1), [0, R * 0.03, -R * 0.02], [0, 0, 0], [0.95, 1.08, 1.04]);
      add(new THREE.SphereGeometry(R * 0.68, 16, 10), [0, R * 0.76, R * 0.2], [-0.35, 0, 0], [1.25, 0.45, 1.2]);
      break;
    case 'receding':
      add(cap(r, 0.75, -0.15, -0.05), [0, R * 0.02, -R * 0.03], [0, 0, 0], [0.94, 1.05, 1.02]);
      break;
    case 'horseshoe': {
      const t = add(new THREE.TorusGeometry(R * 0.9, R * 0.16, 10, 28, Math.PI * 1.15), [0, R * 0.02, -R * 0.03]);
      t.rotation.set(-Math.PI / 2, 0, -Math.PI * 0.075);
      t.scale.set(1, 1.08, 0.8);
      break;
    }
    case 'long': case 'wavy': {
      add(cap(R * 1.06, 0.35, -0.3, -0.3), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.95, 1.06, 1.03]);
      add(new THREE.CylinderGeometry(R * 1.0, R * 1.18, R * 2.2, 28, 1, true, Math.PI * 0.32, Math.PI * 1.36), [0, -R * 0.62, -R * 0.03], [0, 0, 0], [0.95, 1, 1]);
      if (look.hair === 'wavy') {
        for (let i = 0; i < 6; i++) {
          const a = Math.PI * (0.55 + i * 0.18);
          add(new THREE.SphereGeometry(R * 0.3, 12, 8), [Math.sin(a) * R * 1.02, -R * (1.25 + (i % 2) * 0.22), Math.cos(a) * R * 0.98]);
        }
      }
      break;
    }
    case 'bob':
      add(cap(R * 1.07, 0.3, -0.35, -0.4), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.96, 1.06, 1.03]);
      add(new THREE.CylinderGeometry(R * 1.04, R * 1.12, R * 1.3, 28, 1, true, Math.PI * 0.3, Math.PI * 1.4), [0, -R * 0.3, -R * 0.03], [0, 0, 0], [0.95, 1, 1]);
      break;
    case 'bun':
      add(cap(R * 1.05, 0.35, -0.2, -0.2), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.95, 1.06, 1.03]);
      add(new THREE.SphereGeometry(R * 0.42, 16, 12), [0, R * 0.55, -R * 0.88]);
      break;
    case 'ponytail':
      add(cap(R * 1.05, 0.35, -0.2, -0.2), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.95, 1.06, 1.03]);
      add(new THREE.CapsuleGeometry(R * 0.2, R * 1.1, 6, 10), [0, -R * 0.2, -R * 1.18], [0.5, 0, 0]);
      break;
    case 'curly': {
      add(cap(R * 1.1, 0.3, -0.25, -0.2), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.97, 1.06, 1.04]);
      for (let i = 0; i < 22; i++) {
        const a = (i / 22) * Math.PI * 2;
        const y = R * (0.25 + (i % 3) * 0.26);
        const rr = R * (1.0 + (i % 2) * 0.1);
        if (Math.cos(a) > 0.65 && y < R * 0.6) continue;
        add(new THREE.SphereGeometry(R * 0.32, 12, 8), [Math.sin(a) * rr, y, Math.cos(a) * rr - R * 0.05]);
      }
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (0.6 + i * 0.09);
        add(new THREE.SphereGeometry(R * 0.33, 12, 8), [Math.sin(a) * R * 1.04, -R * (0.2 + (i % 3) * 0.3), Math.cos(a) * R * 0.98]);
      }
      break;
    }
    case 'spiky':
      add(cap(r, 0.42, -0.2, -0.1), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.93, 1.06, 1.02]);
      for (let i = 0; i < 7; i++) {
        const a = -0.9 + i * 0.3;
        add(new THREE.ConeGeometry(R * 0.16, R * 0.45, 6), [Math.sin(a) * R * 0.5, R * 0.95, Math.cos(a) * R * 0.2], [0, 0, -a * 0.6]);
      }
      break;
    case 'braids': {
      add(cap(R * 1.06, 0.33, -0.25, -0.3), [0, R * 0.02, -R * 0.02], [0, 0, 0], [0.95, 1.06, 1.03]);
      for (let i = 0; i < 11; i++) {
        const a = Math.PI * (0.6 + i * 0.08);
        add(new THREE.CapsuleGeometry(R * 0.09, R * 1.9, 4, 8), [Math.sin(a) * R * 0.98, -R * 0.75, Math.cos(a) * R * 0.96]);
      }
      break;
    }
  }
}

export function buildFacialHair(c: THREE.Group, look: Look, R: number, std: Std): void {
  const fh = look.facialHair ?? 'none';
  if (fh === 'none') return;
  const color = look.facialHairColor ?? look.hairColor;
  const solid = std(color, { roughness: 0.85 });
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0], scale?: [number, number, number]) => c.add(mesh(geo, m, pos, rot, scale));
  const band = (radius: number, t0: number, t1: number, m: THREE.Material) =>
    add(new THREE.SphereGeometry(radius, 26, 14, -0.15, Math.PI + 0.3, Math.PI * t0, Math.PI * (t1 - t0)), m, [0, 0, R * 0.02], [0, 0, 0], [0.91, 1.07, 1.02]);
  const mustache = () => add(new THREE.CapsuleGeometry(R * 0.07, R * 0.32, 4, 8), solid, [0, -R * 0.26, R * 0.96], [0, 0, Math.PI / 2]);
  switch (fh) {
    case 'stubble':
      band(R * 1.012, 0.58, 0.92, std(color, { transparent: true, opacity: 0.4, roughness: 0.9 }));
      break;
    case 'short':
      band(R * 1.03, 0.6, 0.94, solid);
      mustache();
      break;
    case 'full':
      band(R * 1.06, 0.56, 0.97, solid);
      add(new THREE.SphereGeometry(R * 0.46, 16, 12), solid, [0, -R * 0.82, R * 0.4], [0, 0, 0], [1.1, 0.9, 0.9]);
      mustache();
      break;
    case 'long':
      band(R * 1.06, 0.56, 0.97, solid);
      add(new THREE.SphereGeometry(R * 0.48, 16, 12), solid, [0, -R * 0.8, R * 0.4], [0, 0, 0], [1.1, 0.9, 0.9]);
      add(new THREE.ConeGeometry(R * 0.5, R * 1.5, 16), solid, [0, -R * 1.45, R * 0.45], [Math.PI - 0.2, 0, 0]);
      mustache();
      break;
    case 'goatee':
      add(new THREE.SphereGeometry(R * 0.28, 12, 10), solid, [0, -R * 0.75, R * 0.62]);
      mustache();
      break;
    case 'mustache':
      mustache();
      break;
  }
}

export function buildGlasses(c: THREE.Group, look: Look, R: number, std: Std): void {
  const g = look.glasses ?? 'none';
  if (g === 'none') return;
  const frame = std(g === 'thick' ? 0x1a1a1a : 0x2a2a2a, { metalness: 0.6, roughness: 0.3 });
  const tube = g === 'thick' ? R * 0.045 : R * 0.024;
  const lensM = new THREE.MeshPhysicalMaterial({ color: 0xdff2ff, transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0, depthWrite: false });
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0], scale?: [number, number, number]) => c.add(mesh(geo, m, pos, rot, scale));
  for (const s of [1, -1]) {
    const pos: [number, number, number] = [s * R * 0.33, R * 0.1, R * 1.02];
    if (g === 'round') add(new THREE.TorusGeometry(R * 0.21, tube, 8, 24), frame, pos);
    else add(new THREE.TorusGeometry(R * 0.22, tube, 6, 4), frame, pos, [0, 0, Math.PI / 4], [1.25, 0.85, 1]);
    add(new THREE.CircleGeometry(R * 0.19, 20), lensM, [pos[0], pos[1], pos[2] + 0.001]);
    add(new THREE.BoxGeometry(tube * 1.2, tube * 1.2, R * 0.95), frame, [s * R * 0.6, R * 0.13, R * 0.55]);
  }
  add(new THREE.BoxGeometry(R * 0.2, tube * 1.2, tube * 1.2), frame, [0, R * 0.15, R * 1.04]);
}

export function buildHeadwear(c: THREE.Group, look: Look, R: number, std: Std): void {
  const hw = look.headwear ?? 'none';
  if (hw === 'none') return;
  const color = look.headwearColor ?? (hw === 'black-hat' ? 0x0b0b0b : 0x111111);
  const m = std(color, { roughness: hw === 'black-hat' ? 0.55 : 0.85 });
  const grp = (pos: [number, number, number], rx: number) => {
    const g = new THREE.Group();
    g.position.set(...pos);
    g.rotation.x = rx;
    c.add(g);
    return g;
  };
  switch (hw) {
    case 'kippah':
    case 'kippah-knit': {
      const g = grp([0, R * 0.92, -R * 0.3], -0.45);
      g.add(mesh(new THREE.SphereGeometry(R * 0.55, 20, 8, 0, Math.PI * 2, 0, Math.PI * 0.22), m, [0, -R * 0.42, 0], [0, 0, 0], [1, 0.9, 1]));
      if (hw === 'kippah-knit') g.add(mesh(new THREE.TorusGeometry(R * 0.28, R * 0.03, 6, 24), std(0xffffff), [0, R * 0.08, 0], [Math.PI / 2, 0, 0]));
      break;
    }
    case 'black-hat': {
      const g = grp([0, R * 0.78, -R * 0.05], -0.12);
      g.add(mesh(new THREE.CylinderGeometry(R * 1.6, R * 1.6, R * 0.07, 32), m, [0, 0, 0]));
      g.add(mesh(new THREE.CylinderGeometry(R * 0.88, R * 1.0, R * 0.95, 28), m, [0, R * 0.48, 0]));
      g.add(mesh(new THREE.CylinderGeometry(R * 1.01, R * 1.01, R * 0.18, 28), std(0x2a2a2a, { roughness: 0.4 }), [0, R * 0.12, 0]));
      break;
    }
    case 'hat': {
      const g = grp([0, R * 0.72, 0], -0.1);
      g.add(mesh(new THREE.CylinderGeometry(R * 1.45, R * 1.45, R * 0.06, 32), m, [0, 0, 0]));
      g.add(mesh(new THREE.SphereGeometry(R * 0.98, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m, [0, 0, 0], [0, 0, 0], [1, 0.75, 1]));
      break;
    }
    case 'beret':
      c.add(mesh(new THREE.SphereGeometry(R * 1.1, 24, 12), m, [R * 0.1, R * 0.78, -R * 0.05], [0, 0, -0.2], [1.1, 0.35, 1.1]));
      break;
    case 'scarf':
      c.add(mesh(new THREE.SphereGeometry(R * 1.1, 26, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), m, [0, 0, -R * 0.05], [0, 0, 0], [0.96, 1.05, 1.02]));
      c.add(mesh(new THREE.CylinderGeometry(R * 1.02, R * 1.15, R * 1.3, 24, 1, true, Math.PI * 0.35, Math.PI * 1.3), m, [0, -R * 0.55, -R * 0.03]));
      break;
  }
}
