// Procedural 360° stages. Fighters move freely inside a circular arena (ARENA_RADIUS) ringed
// by a wall; the Tekken camera orbits around them, so every stage is dressed on all sides.
// Anything that can end up between the camera and the fighters is registered as an occluder
// and hidden by the renderer while it is in the way.

import * as THREE from 'three';
import type { StageDef } from '../data/stages';
import { ARENA_RADIUS } from '../game/constants';
import { additive, toon } from './materials';

export interface StageLighting {
  background: number;
  fog: [number, number, number];
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  key: number;
  keyIntensity: number;
  keyPos: [number, number, number];
  rim: number;
  rimIntensity: number;
}

export interface BuiltStage {
  group: THREE.Group;
  lighting: StageLighting;
  update: (t: number) => void;
  /** Objects (positioned at their centre, `userData.radius` = extent) hidden when in the camera's way. */
  occluders: THREE.Object3D[];
}

type P3 = [number, number, number];
const TAU = Math.PI * 2;
const WALL_R = ARENA_RADIUS + 0.3;

function box(g: THREE.Object3D, size: P3, color: number | THREE.Material, pos: P3, rot: P3 = [0, 0, 0], shadow = true): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...size), typeof color === 'number' ? toon(color) : color);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.castShadow = shadow;
  m.receiveShadow = true;
  g.add(m);
  return m;
}

function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, repeat: [number, number] = [1, 1]): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  return t;
}

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, alpha = 0.08): void {
  for (let i = 0; i < amount; i++) {
    const v = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha * Math.random()})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}

function floor(g: THREE.Group, tex: THREE.Texture, color = 0xffffff, size = 90): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ map: tex, color, roughness: 0.85, metalness: 0.02 }));
  m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true;
  g.add(m);
  return m;
}

/** Arena marking on the floor: a subtle tinted disc and a boundary line. */
function arenaMarks(g: THREE.Group, tint: number, line: number, tintOpacity = 0.12): void {
  const disc = new THREE.Mesh(new THREE.CircleGeometry(ARENA_RADIUS, 72), new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity: tintOpacity, depthWrite: false }));
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.004;
  const ring = new THREE.Mesh(new THREE.RingGeometry(ARENA_RADIUS - 0.12, ARENA_RADIUS, 96), new THREE.MeshBasicMaterial({ color: line, transparent: true, opacity: 0.8, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.006;
  g.add(disc, ring);
}

/**
 * The arena wall: a ring of segments just outside ARENA_RADIUS (fighters wall-splat on it).
 * Each segment is an occluder so the camera can see through the side nearest to it.
 */
function wallRing(
  g: THREE.Group,
  occ: THREE.Object3D[],
  opts: { h: number; color: number | THREE.Material; top?: number; thick?: number; segs?: number; posts?: number; glass?: boolean },
): void {
  const segs = opts.segs ?? 28;
  const thick = opts.thick ?? 0.3;
  const chord = 2 * WALL_R * Math.sin(Math.PI / segs) + 0.02;
  const mat = typeof opts.color === 'number' ? toon(opts.color) : opts.color;
  const topMat = opts.top !== undefined ? toon(opts.top) : null;
  const postMat = opts.posts !== undefined ? toon(opts.posts) : null;
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * TAU;
    const seg = new THREE.Group();
    seg.position.set(Math.cos(a) * WALL_R, 0, Math.sin(a) * WALL_R);
    seg.rotation.y = Math.PI / 2 - a;
    seg.userData.radius = chord / 2 + 0.3;
    box(seg, [chord, opts.h, thick], mat, [0, opts.h / 2, 0], [0, 0, 0], !opts.glass);
    if (topMat) box(seg, [chord + 0.02, 0.08, thick + 0.12], topMat, [0, opts.h + 0.04, 0]);
    if (postMat) box(seg, [0.12, opts.h + 0.2, 0.12], postMat, [chord / 2, (opts.h + 0.2) / 2, 0]);
    g.add(seg);
    occ.push(seg);
  }
}

/** Inward-facing cylindrical wall: invisible from outside, so it never blocks the camera. */
function enclosure(g: THREE.Group, r: number, h: number, mat: THREE.MeshStandardMaterial | THREE.MeshToonMaterial, y = 0): THREE.Mesh {
  mat.side = THREE.BackSide;
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64, 1, true), mat);
  m.position.y = y + h / 2;
  m.receiveShadow = true;
  g.add(m);
  return m;
}

function skyDome(g: THREE.Group, top: number, bottom: number, horizon?: number): void {
  const geo = new THREE.SphereGeometry(120, 32, 16);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color(top) },
      bottom: { value: new THREE.Color(bottom) },
      horizon: { value: new THREE.Color(horizon ?? bottom) },
    },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 horizon; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.6)) : mix(horizon, bottom, pow(-h, 0.5));
      gl_FragColor = vec4(c, 1.0); }`,
  });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = -10;
  g.add(m);
}

/** Instanced crowd of simple spectators that bob up and down. */
function crowd(g: THREE.Object3D, spots: P3[], colors: number[], scale = 1): (t: number) => void {
  const n = spots.length;
  if (!n) return () => {};
  const bodyGeo = new THREE.CapsuleGeometry(0.22 * scale, 0.45 * scale, 4, 8);
  const headGeo = new THREE.SphereGeometry(0.16 * scale, 10, 8);
  const bodies = new THREE.InstancedMesh(bodyGeo, toon(0xffffff), n);
  const heads = new THREE.InstancedMesh(headGeo, toon(0xffffff), n);
  const skins = [0xf1c7a5, 0xe8b894, 0xd9a27c, 0xc68e63, 0x8d5a3b];
  const c = new THREE.Color();
  const phase: number[] = [];
  for (let i = 0; i < n; i++) {
    bodies.setColorAt(i, c.set(colors[i % colors.length]));
    heads.setColorAt(i, c.set(skins[(i * 7) % skins.length]));
    phase.push(Math.random() * Math.PI * 2);
  }
  bodies.castShadow = false;
  heads.castShadow = false;
  g.add(bodies, heads);
  const d = new THREE.Object3D();
  const update = (t: number) => {
    for (let i = 0; i < n; i++) {
      const [x, y, z] = spots[i];
      const bob = Math.max(0, Math.sin(t * 5 + phase[i])) * 0.08 * scale;
      d.position.set(x, y + 0.45 * scale + bob, z);
      d.updateMatrix();
      bodies.setMatrixAt(i, d.matrix);
      d.position.set(x, y + 0.98 * scale + bob, z);
      d.updateMatrix();
      heads.setMatrixAt(i, d.matrix);
    }
    bodies.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
  };
  update(0);
  return update;
}

/**
 * Angular sectors around the arena. Scenery built in world coordinates is moved into the sector
 * it falls in, so each sector can be hidden as a unit when the camera is behind it.
 */
class Sectors {
  groups: THREE.Group[] = [];

  constructor(g: THREE.Group, occ: THREE.Object3D[], private n = 16, r = 13) {
    for (let i = 0; i < n; i++) {
      const a = ((i + 0.5) / n) * TAU;
      const grp = new THREE.Group();
      grp.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      grp.userData.radius = 0;
      g.add(grp);
      occ.push(grp);
      this.groups.push(grp);
    }
  }

  private at(x: number, z: number): THREE.Group {
    let a = Math.atan2(z, x);
    if (a < 0) a += TAU;
    return this.groups[Math.floor((a / TAU) * this.n) % this.n];
  }

  private grow(grp: THREE.Group, lx: number, lz: number, size: number): void {
    grp.userData.radius = Math.max(grp.userData.radius as number, Math.hypot(lx, lz) + size);
  }

  /** Moves every child of `src` (built in world coordinates) into its sector. */
  adopt(src: THREE.Group, size = 1): void {
    for (const c of [...src.children]) {
      const grp = this.at(c.position.x, c.position.z);
      c.position.x -= grp.position.x;
      c.position.z -= grp.position.z;
      grp.add(c);
      this.grow(grp, c.position.x, c.position.z, size);
    }
  }

  /** One instanced mesh per sector from world-space instance matrices. */
  instanced(geo: THREE.BufferGeometry, mat: THREE.Material, matrices: THREE.Matrix4[], shadow = false): void {
    const buckets = new Map<THREE.Group, THREE.Matrix4[]>();
    const p = new THREE.Vector3();
    for (const m of matrices) {
      p.setFromMatrixPosition(m);
      const grp = this.at(p.x, p.z);
      const local = m.clone();
      local.elements[12] -= grp.position.x;
      local.elements[14] -= grp.position.z;
      this.grow(grp, local.elements[12], local.elements[14], 0.8);
      const list = buckets.get(grp) ?? [];
      list.push(local);
      buckets.set(grp, list);
    }
    for (const [grp, list] of buckets) {
      const inst = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((m, i) => inst.setMatrixAt(i, m));
      inst.castShadow = shadow;
      inst.receiveShadow = true;
      grp.add(inst);
    }
  }

  crowd(spots: P3[], colors: number[], scale = 1): (t: number) => void {
    const buckets = new Map<THREE.Group, P3[]>();
    for (const [x, y, z] of spots) {
      const grp = this.at(x, z);
      const lx = x - grp.position.x;
      const lz = z - grp.position.z;
      this.grow(grp, lx, lz, 0.6);
      const list = buckets.get(grp) ?? [];
      list.push([lx, y, lz]);
      buckets.set(grp, list);
    }
    const ups = [...buckets].map(([grp, list]) => crowd(grp, list, colors, scale));
    return (t) => ups.forEach((u) => u(t));
  }
}

/** Points on a circle, optionally skipping an angular gap (radians, centred on `gapAt`). */
function around(count: number, r: number, fn: (x: number, z: number, a: number, i: number) => void, gapAt = 0, gap = 0): void {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    let d = Math.abs(a - gapAt) % TAU;
    if (d > Math.PI) d = TAU - d;
    if (gap > 0 && d < gap / 2) continue;
    fn(Math.cos(a) * r, Math.sin(a) * r, a, i);
  }
}

/** The seven-branched Knesset Menorah, stylised. */
function menorah(g: THREE.Object3D, pos: P3, scale: number, color: number, rotY = 0): THREE.Group {
  const m = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.35 });
  const add = (geo: THREE.BufferGeometry, p: P3, r: P3 = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...p);
    mesh.rotation.set(...r);
    mesh.castShadow = true;
    m.add(mesh);
  };
  add(new THREE.BoxGeometry(1.4, 0.3, 0.8), [0, 0.15, 0]);
  add(new THREE.CylinderGeometry(0.12, 0.16, 3.2, 10), [0, 1.9, 0]);
  for (let i = 1; i <= 3; i++) {
    const r = i * 0.55;
    add(new THREE.TorusGeometry(r, 0.09, 8, 24, Math.PI), [0, 3.4, 0], [0, 0, Math.PI]);
    for (const s of [-1, 1]) add(new THREE.CylinderGeometry(0.09, 0.09, 1.1 + 0.05 * i, 8), [s * r, 3.4 + 0.55, 0]);
  }
  add(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 8), [0, 4.0, 0]);
  for (let i = -3; i <= 3; i++) add(new THREE.CylinderGeometry(0.13, 0.08, 0.14, 8), [i * 0.55, 4.6, 0]);
  m.position.set(...pos);
  m.rotation.y = rotY;
  m.scale.setScalar(scale);
  g.add(m);
  return m;
}

function palm(g: THREE.Object3D, pos: P3, h: number): void {
  const p = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.13 - i * 0.008, 0.15 - i * 0.008, h / 8, 8), toon(0x8a6a44));
    seg.position.set(Math.sin(i * 0.25) * 0.15, (i + 0.5) * (h / 8), 0);
    seg.castShadow = true;
    p.add(seg);
  }
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6), toon(0x2f7d32));
    leaf.scale.set(1.3, 0.12, 0.35);
    const a = (i / 7) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 0.8 + 0.3, h + 0.05, Math.sin(a) * 0.8);
    leaf.rotation.set(0, -a, -0.35);
    leaf.castShadow = true;
    p.add(leaf);
  }
  p.position.set(...pos);
  g.add(p);
}

function stringLights(g: THREE.Group, from: P3, to: P3, count: number, colors: number[]): THREE.Mesh[] {
  const out: THREE.Mesh[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = from[0] + (to[0] - from[0]) * t;
    const z = from[2] + (to[2] - from[2]) * t;
    const y = from[1] + (to[1] - from[1]) * t - Math.sin(t * Math.PI) * 0.8;
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color: colors[i % colors.length] }));
    b.position.set(x, y, z);
    g.add(b);
    out.push(b);
  }
  return out;
}

function windowsTex(cols: number, rows: number, lit: string, dark: string, frame: string): THREE.CanvasTexture {
  return canvasTex(256, 512, (ctx, w, h) => {
    ctx.fillStyle = frame;
    ctx.fillRect(0, 0, w, h);
    const cw = w / cols;
    const rh = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = Math.random() < 0.55 ? lit : dark;
        ctx.fillRect(c * cw + 3, r * rh + 3, cw - 6, rh - 6);
      }
    }
  });
}

/** Faces an object toward the arena centre from (x, z). */
const faceIn = (x: number, z: number) => Math.atan2(-x, -z);

// ------------------------------------------------------------------ stages

export function buildStage(def: StageDef): BuiltStage {
  switch (def.kind) {
    case 'plenum': return plenum();
    case 'plaza': return plaza();
    case 'committee': return committee();
    case 'beach': return beach();
    case 'market': return market();
    case 'rooftop': return rooftop();
  }
}

function plenum(): BuiltStage {
  const g = new THREE.Group();
  const occ: THREE.Object3D[] = [];
  const carpet = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#23407a';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(160,190,255,0.18)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 32 + 16);
      ctx.lineTo(w, i * 32 + 16);
      ctx.stroke();
    }
    noise(ctx, w, h, 3000, 0.12);
  }, [20, 20]);
  floor(g, carpet);
  arenaMarks(g, 0x9fb8ff, 0xd4a852, 0.08);
  // Arena wall: the wooden front of the lowest row of desks.
  wallRing(g, occ, { h: 1.0, color: 0x6b4a2e, top: 0x8a6a44 });

  // Jerusalem-stone chamber wall all around.
  const stone = canvasTex(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#d8c7a3';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(120,100,70,0.35)';
    for (let r = 0; r < 8; r++) {
      const off = (r % 2) * 32;
      for (let c = -1; c < 9; c++) ctx.strokeRect(c * 64 + off, r * 32, 64, 32);
    }
    noise(ctx, w, h, 4000, 0.1);
  }, [14, 3]);
  enclosure(g, 20, 16, new THREE.MeshStandardMaterial({ map: stone, roughness: 0.95 }));

  // Tiered circle of desks and blue chairs, with a gap for the Speaker's dais (north).
  const sectors = new Sectors(g, occ, 16, 13.5);
  const desks: THREE.Matrix4[] = [];
  const chairs: THREE.Matrix4[] = [];
  const spots: P3[] = [];
  const d = new THREE.Object3D();
  for (let row = 0; row < 4; row++) {
    const r = 11 + row * 1.6;
    const y = row * 0.5;
    around(Math.round((TAU * r) / 1.35), r, (x, z, a, i) => {
      d.position.set(x, y + 0.45, z);
      d.rotation.set(0, Math.PI / 2 - a, 0);
      d.updateMatrix();
      desks.push(d.matrix.clone());
      d.position.set(x + Math.cos(a) * 0.7, y + 0.35, z + Math.sin(a) * 0.7);
      d.updateMatrix();
      chairs.push(d.matrix.clone());
      if ((i + row) % 3 !== 0) spots.push([x + Math.cos(a) * 0.7, y + 0.1, z + Math.sin(a) * 0.7]);
    }, -Math.PI / 2, 0.7);
  }
  sectors.instanced(new THREE.BoxGeometry(1.1, 0.9, 0.55), toon(0x7c5634), desks);
  sectors.instanced(new THREE.BoxGeometry(0.6, 1.0, 0.5), toon(0x2c5fb8), chairs);
  const upd = sectors.crowd(spots, [0x1b2a4a, 0x2d2f36, 0x111216, 0x3a4a5e, 0xf2f2f2, 0x5a3d25]);
  // Tier risers as inward-facing rings (never block the camera from outside).
  for (let row = 1; row < 4; row++) {
    const r = 11 + row * 1.6 - 0.8;
    const riser = new THREE.Mesh(new THREE.CylinderGeometry(r, r, row * 0.5, 72, 1, true), toon(0x3b2a1c));
    (riser.material as THREE.Material).side = THREE.BackSide;
    riser.position.y = (row * 0.5) / 2;
    g.add(riser);
    const top = new THREE.Mesh(new THREE.RingGeometry(r, r + 1.6, 72), toon(0x2a3f6e));
    top.rotation.x = -Math.PI / 2;
    top.position.y = row * 0.5 + 0.005;
    g.add(top);
  }

  // Speaker's dais and the emblem on the north wall.
  const dais = new THREE.Group();
  box(dais, [7, 1.2, 1.6], 0x6b4a2e, [0, 0.6, -12.5]);
  box(dais, [5.5, 0.9, 1.2], 0x7c5634, [0, 1.65, -13.6]);
  box(dais, [0.9, 1.4, 0.6], 0x5a3d25, [0, 1.3, -11.6]);
  sectors.adopt(dais, 2);
  menorah(g, [0, 3.0, -19.3], 0.9, 0xd4a852);
  const tapestryColors = [0x3b6fd8, 0xd9a441, 0x2f8a6a, 0x3b6fd8, 0xd9a441, 0x2f8a6a];
  around(6, 19.6, (x, z, a, i) => {
    const p = box(g, [5, 5.5, 0.1], toon(tapestryColors[i]), [x, 6, z], [0, faceIn(x, z), 0], false);
    p.castShadow = false;
  }, -Math.PI / 2, 1.2);

  // Ceiling light ring
  around(10, 12, (x, z, a) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 0.4), new THREE.MeshBasicMaterial({ color: 0xfff4d6 }));
    bar.position.set(x, 12, z);
    bar.rotation.y = Math.PI / 2 - a;
    g.add(bar);
  });

  return {
    group: g,
    occluders: occ,
    update: (t) => upd(t),
    lighting: {
      background: 0x1a1410, fog: [0x1a1410, 24, 60],
      hemiSky: 0xfff0d8, hemiGround: 0x2a2a44, hemiIntensity: 1.1,
      key: 0xfff1d6, keyIntensity: 2.6, keyPos: [4, 14, 8],
      rim: 0x6f9bff, rimIntensity: 1.4,
    },
  };
}

function plaza(): BuiltStage {
  const g = new THREE.Group();
  const occ: THREE.Object3D[] = [];
  skyDome(g, 0x2f7fd9, 0xcfe4f7, 0xe8f2fb);
  const paving = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#d9cdb4';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(110,95,70,0.35)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(i * 64, 0); ctx.lineTo(i * 64, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * 64); ctx.lineTo(w, i * 64); ctx.stroke();
    }
    noise(ctx, w, h, 3000, 0.1);
  }, [30, 30]);
  floor(g, paving, 0xffffff, 160);
  arenaMarks(g, 0xffffff, 0x8a7a5a, 0.1);
  wallRing(g, occ, { h: 0.85, color: 0xcfc3a8, top: 0xe7dcc2, segs: 24 });

  // Lawns in the four diagonals.
  const grass = toon(0x5d9b3a);
  around(4, 17, (x, z) => box(g, [9, 0.1, 9], grass, [x, 0.05, z], [0, 0, 0], false), Math.PI / 4 + 0.001);

  // The Knesset building to the north, with square columns.
  const bld = new THREE.Group();
  const stoneMat = toon(0xe7dcc2);
  box(bld, [34, 1.2, 8], stoneMat, [0, 7.4, 0]);
  box(bld, [32, 6.8, 6], toon(0x3a3a3a), [0, 3.4, -0.5]);
  for (let i = 0; i < 15; i++) box(bld, [1.0, 6.8, 1.0], stoneMat, [-14 + i * 2, 3.4, 3.2]);
  box(bld, [36, 0.6, 9], toon(0xcfc3a8), [0, 0.3, 0]);
  bld.position.set(0, 0, -32);
  g.add(bld);
  // Jerusalem stone skyline on the other sides.
  around(18, 38, (x, z, a) => {
    const h = 6 + ((Math.sin(a * 7) + 1) / 2) * 9;
    box(g, [7, h, 7], toon(0xd8ccb0), [x, h / 2, z], [0, faceIn(x, z), 0], false);
  }, -Math.PI / 2, 1.3);

  const scenery = new THREE.Group();
  const sectors = new Sectors(g, occ, 16, 14);
  menorah(scenery, [13, 0, -8], 0.9, 0x6e5230, faceIn(13, -8));
  // Flags around the plaza.
  around(8, 12.5, (x, z, a) => {
    const pole = new THREE.Group();
    box(pole, [0.08, 7, 0.08], 0xdddddd, [0, 3.5, 0]);
    const flag = new THREE.Group();
    box(flag, [1.6, 1.1, 0.03], 0xffffff, [0.8, 0, 0], [0, 0, 0], false);
    box(flag, [1.6, 0.16, 0.035], 0x1f4fbf, [0.8, 0.38, 0], [0, 0, 0], false);
    box(flag, [1.6, 0.16, 0.035], 0x1f4fbf, [0.8, -0.38, 0], [0, 0, 0], false);
    flag.position.y = 6.3;
    pole.add(flag);
    pole.position.set(x, 0, z);
    pole.rotation.y = Math.PI / 2 - a;
    scenery.add(pole);
  }, 0.2);
  // Olive trees
  around(9, 16, (x, z) => {
    const tree = new THREE.Group();
    box(tree, [0.3, 2.2, 0.3], 0x6a5236, [0, 1.1, 0]);
    const c = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 8), toon(0x7f9a5a));
    c.scale.set(1.2, 0.8, 1.1);
    c.position.set(0, 2.8, 0);
    c.castShadow = true;
    tree.add(c);
    tree.position.set(x, 0, z);
    scenery.add(tree);
  }, 0.35);
  sectors.adopt(scenery, 2);
  const spots: P3[] = [];
  around(56, 10.6, (x, z, a, i) => spots.push([x + Math.cos(a) * (i % 2) * 0.8, 0, z + Math.sin(a) * (i % 2) * 0.8]));
  const upd = sectors.crowd(spots, [0x1f4fbf, 0xffffff, 0xd62839, 0x2d2f36, 0xf2c14e, 0x3a7d44]);
  return {
    group: g,
    occluders: occ,
    update: (t) => upd(t),
    lighting: {
      background: 0xcfe4f7, fog: [0xdbe9f6, 35, 110],
      hemiSky: 0xcfe8ff, hemiGround: 0x8a7a5a, hemiIntensity: 1.3,
      key: 0xfff5e0, keyIntensity: 3.0, keyPos: [-8, 16, 10],
      rim: 0xffffff, rimIntensity: 0.6,
    },
  };
}

function committee(): BuiltStage {
  const g = new THREE.Group();
  const occ: THREE.Object3D[] = [];
  const carpet = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#6a2c2c';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,210,150,0.08)';
    for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) if ((i + j) % 2 === 0) ctx.fillRect(i * 16, j * 16, 16, 16);
    noise(ctx, w, h, 2500, 0.12);
  }, [20, 20]);
  floor(g, carpet);
  arenaMarks(g, 0xffd0a0, 0xd4a852, 0.06);
  // The committee table itself rings the arena.
  wallRing(g, occ, { h: 0.9, color: 0x4a2f1c, top: 0x5e3d25, thick: 0.9, segs: 28 });
  const wood = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#6b4a2e';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = `rgba(40,20,10,${0.08 + Math.random() * 0.12})`;
      ctx.fillRect(i * 16, 0, 2, h);
    }
    noise(ctx, w, h, 2000, 0.1);
  }, [24, 2]);
  enclosure(g, 17, 12, new THREE.MeshStandardMaterial({ map: wood, roughness: 0.8 }));

  // Committee members behind the table, with papers and water glasses on it.
  const sectors = new Sectors(g, occ, 16, 11);
  const seats = new THREE.Group();
  const spots: P3[] = [];
  const chairMat = toon(0x1a1a1a);
  const paperMat = toon(0xf4f4f4);
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x9fd3ff, transparent: true, opacity: 0.6 });
  around(26, 10.6, (x, z, a) => {
    box(seats, [0.7, 1.3, 0.6], chairMat, [x, 0.65, z], [0, Math.PI / 2 - a, 0]);
    spots.push([x, 0.2, z]);
    const tx = Math.cos(a) * (WALL_R - 0.1);
    const tz = Math.sin(a) * (WALL_R - 0.1);
    box(seats, [0.25, 0.02, 0.3], paperMat, [tx, 0.95, tz], [0, Math.PI / 2 - a, 0], false);
    box(seats, [0.08, 0.2, 0.08], glassMat, [tx + Math.sin(a) * 0.3, 1.0, tz - Math.cos(a) * 0.3], [0, 0, 0], false);
  });
  sectors.adopt(seats, 1);
  const upd = sectors.crowd(spots, [0x1b2a4a, 0x2d2f36, 0x111216, 0x5a3d25]);

  // Big screens with budget graphs around the room.
  const graph = canvasTex(512, 288, (ctx, w, h) => {
    ctx.fillStyle = '#0b1a2e';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#9fd3ff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('STATE BUDGET 2026', 24, 44);
    const colors = ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#f78c6b'];
    for (let i = 0; i < 10; i++) {
      const bh = 40 + Math.random() * 170;
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(30 + i * 46, h - 20 - bh, 32, bh);
    }
  });
  around(5, 16.7, (x, z) => {
    const rot = faceIn(x, z);
    box(g, [5.4, 3.2, 0.2], 0x111111, [x, 5, z], [0, rot, 0], false);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.8), new THREE.MeshBasicMaterial({ map: graph }));
    s.position.set(x * 0.992, 5, z * 0.992);
    s.rotation.y = rot;
    g.add(s);
  }, -Math.PI / 2, 1.0);
  menorah(g, [0, 4.2, -16.7], 0.55, 0xd4a852);
  return {
    group: g,
    occluders: occ,
    update: (t) => upd(t),
    lighting: {
      background: 0x140c08, fog: [0x140c08, 20, 50],
      hemiSky: 0xffe2c0, hemiGround: 0x2a1a14, hemiIntensity: 1.0,
      key: 0xffe6c4, keyIntensity: 2.5, keyPos: [3, 12, 7],
      rim: 0xffb070, rimIntensity: 1.2,
    },
  };
}

function beach(): BuiltStage {
  const g = new THREE.Group();
  const occ: THREE.Object3D[] = [];
  skyDome(g, 0x3a3f8f, 0x3a2a4a, 0xff9a5a);
  const sand = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#e6c894';
    ctx.fillRect(0, 0, w, h);
    noise(ctx, w, h, 6000, 0.15);
  }, [30, 30]);
  floor(g, sand, 0xffffff, 160);
  arenaMarks(g, 0xffffff, 0xb08850, 0.08);
  // Wooden beach fence with rope.
  wallRing(g, occ, { h: 0.9, color: 0xa07850, top: 0xcaa070, thick: 0.18, segs: 28, posts: 0x6b4a2e });
  // Sea to the west, sun setting over it.
  const seaGeo = new THREE.PlaneGeometry(90, 200, 30, 60);
  const sea = new THREE.Mesh(seaGeo, new THREE.MeshStandardMaterial({ color: 0x2a6f9e, roughness: 0.25, metalness: 0.3, flatShading: true }));
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(-63, 0.05, 0);
  g.add(sea);
  const sun = new THREE.Mesh(new THREE.CircleGeometry(6, 32), new THREE.MeshBasicMaterial({ color: 0xffb35a, fog: false }));
  sun.position.set(-110, 7, -10);
  sun.rotation.y = Math.PI / 2;
  g.add(sun);
  // Tel Aviv skyline inland (east), hotels along the promenade.
  for (let i = 0; i < 22; i++) {
    const h = 5 + Math.random() * 16;
    const z = -40 + i * 4;
    box(g, [3 + Math.random() * 2, h, 3], toon(0x4a4a6a), [34 + (i % 3) * 5, h / 2, z], [0, 0, 0], false);
  }

  const sectors = new Sectors(g, occ, 16, 14);
  const scenery = new THREE.Group();
  around(8, 14.5, (x, z) => palm(scenery, [x, 0, z], 6 + Math.random() * 2), Math.PI, 1.2);
  // Lifeguard tower facing the sea.
  const tower = new THREE.Group();
  for (const x of [-1, 1]) for (const z of [-1, 1]) box(tower, [0.15, 3, 0.15], 0xdddddd, [x, 1.5, z]);
  box(tower, [2.6, 0.2, 2.6], 0xf2f2f2, [0, 3.1, 0]);
  box(tower, [2.4, 1.6, 2.4], 0xd62828, [0, 4, 0]);
  box(tower, [2.8, 0.2, 2.8], 0xffffff, [0, 4.9, 0]);
  tower.position.set(-13, 0, -6);
  scenery.add(tower);
  // Umbrellas
  around(6, 12, (x, z, a, i) => {
    const u = new THREE.Group();
    box(u, [0.08, 2.4, 0.08], 0xeeeeee, [0, 1.2, 0]);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.6, 12), toon([0xff4d6d, 0x3a86ff, 0xffd60a][i % 3]));
    cone.position.set(0, 2.5, 0);
    cone.castShadow = true;
    u.add(cone);
    u.position.set(x, 0, z);
    scenery.add(u);
  }, 0.5);
  sectors.adopt(scenery, 2.5);
  const spots: P3[] = [];
  around(40, 11, (x, z, a, i) => spots.push([x + Math.cos(a) * (i % 3) * 0.7, 0, z + Math.sin(a) * (i % 3) * 0.7]), Math.PI, 1.0);
  const upd = sectors.crowd(spots, [0xff4d6d, 0x3a86ff, 0xffd60a, 0x06d6a0, 0xf4f4f4, 0x8338ec]);
  const pos = seaGeo.getAttribute('position') as THREE.BufferAttribute;
  const base = Float32Array.from(pos.array as Float32Array);
  return {
    group: g,
    occluders: occ,
    update: (t) => {
      upd(t);
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        pos.setZ(i, Math.sin(y * 0.2 + t * 1.2) * 0.25 + Math.cos(x * 0.3 + t) * 0.2);
      }
      pos.needsUpdate = true;
    },
    lighting: {
      background: 0xff9a5a, fog: [0xd98a6a, 40, 140],
      hemiSky: 0xffc59a, hemiGround: 0x6a4a6a, hemiIntensity: 1.2,
      key: 0xffb070, keyIntensity: 3.0, keyPos: [-10, 9, 6],
      rim: 0xff5ea8, rimIntensity: 1.2,
    },
  };
}

function market(): BuiltStage {
  const g = new THREE.Group();
  const occ: THREE.Object3D[] = [];
  skyDome(g, 0x0a0c20, 0x0a0a0a, 0x1a1a3a);
  const cobble = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#6b6258';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = `rgba(${150 + Math.random() * 40},${140 + Math.random() * 30},${120 + Math.random() * 30},0.9)`;
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, 8 + Math.random() * 6, 6 + Math.random() * 4, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [22, 22]);
  floor(g, cobble);
  arenaMarks(g, 0xffd08a, 0xffb060, 0.07);
  // Stall counters form the arena wall, piled with produce.
  wallRing(g, occ, { h: 1.0, color: 0x6b4a2e, top: 0x8a6a44, thick: 0.8, segs: 24 });
  const produce = [0xe63946, 0xf77f00, 0xffd60a, 0x55a630, 0x9d4edd, 0xff8fab];
  const sectors = new Sectors(g, occ, 16, 11.5);
  const stalls = new THREE.Group();
  around(24, WALL_R, (x, z, a, i) => {
    const heap = new THREE.Group();
    for (let k = 0; k < 8; k++) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), toon(produce[(i + k) % produce.length]));
      f.position.set(-0.6 + (k % 4) * 0.4, 1.12 + Math.floor(k / 4) * 0.16, (Math.floor(k / 4) - 0.5) * 0.3);
      heap.add(f);
    }
    heap.position.set(x, 0, z);
    heap.rotation.y = Math.PI / 2 - a;
    stalls.add(heap);
  });
  // Awnings on posts behind the counters.
  around(12, 11.2, (x, z, a, i) => {
    const s = new THREE.Group();
    box(s, [0.1, 3.2, 0.1], 0x3a2a1a, [-1.6, 1.6, 0]);
    box(s, [0.1, 3.2, 0.1], 0x3a2a1a, [1.6, 1.6, 0]);
    const awn = box(s, [3.8, 0.08, 2.2], toon(i % 2 ? 0xd62828 : 0xf4f4f4), [0, 3.1, -0.3], [-0.25, 0, 0]);
    awn.castShadow = false;
    s.position.set(x, 0, z);
    s.rotation.y = faceIn(x, z);
    stalls.add(s);
  });
  sectors.adopt(stalls, 2.5);
  // Stone arcade wall all around.
  const arcade = canvasTex(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#8a7a64';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a2018';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 128 + 24, h);
      ctx.lineTo(i * 128 + 24, h * 0.45);
      ctx.arc(i * 128 + 64, h * 0.45, 40, Math.PI, 0);
      ctx.lineTo(i * 128 + 104, h);
      ctx.fill();
    }
    noise(ctx, w, h, 3000, 0.1);
  }, [10, 1]);
  enclosure(g, 17, 8, new THREE.MeshStandardMaterial({ map: arcade, roughness: 0.95 }));
  const bulbs: THREE.Mesh[] = [];
  around(6, 14, (x, z) => bulbs.push(...stringLights(g, [x, 5.6, z], [-x * 0.2, 6.2, -z * 0.2], 18, [0xffe08a, 0xff9f5a, 0xfff1c0])));
  const warm = new THREE.PointLight(0xffb060, 30, 18, 1.6);
  warm.position.set(-5, 5, -3);
  const warm2 = new THREE.PointLight(0xffb060, 30, 18, 1.6);
  warm2.position.set(5, 5, 3);
  g.add(warm, warm2);
  const spots: P3[] = [];
  around(40, 12.3, (x, z, a, i) => spots.push([x + Math.cos(a) * (i % 2) * 0.6, 0, z + Math.sin(a) * (i % 2) * 0.6]));
  const upd = sectors.crowd(spots, [0x2d2f36, 0x6a4c93, 0x1982c4, 0x8ac926, 0xff595e, 0xffca3a]);
  return {
    group: g,
    occluders: occ,
    update: (t) => {
      upd(t);
      bulbs.forEach((b, i) => ((b.material as THREE.MeshBasicMaterial).color.setHSL(0.1, 1, 0.55 + 0.15 * Math.sin(t * 3 + i))));
    },
    lighting: {
      background: 0x0a0c20, fog: [0x0e0e1a, 20, 55],
      hemiSky: 0x5a6aa0, hemiGround: 0x2a1a10, hemiIntensity: 0.8,
      key: 0xffd4a0, keyIntensity: 2.2, keyPos: [5, 12, 8],
      rim: 0x7a8cff, rimIntensity: 1.5,
    },
  };
}

function rooftop(): BuiltStage {
  const g = new THREE.Group();
  const occ: THREE.Object3D[] = [];
  skyDome(g, 0x05060f, 0x05060f, 0x1d1540);
  const concrete = canvasTex(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#50535a';
    ctx.fillRect(0, 0, w, h);
    noise(ctx, w, h, 16000, 0.12);
    ctx.strokeStyle = 'rgba(255,215,0,0.9)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 250, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', w / 2, h / 2 + 14);
  });
  const roof = new THREE.Mesh(new THREE.CircleGeometry(12, 72), new THREE.MeshStandardMaterial({ map: concrete, roughness: 0.9 }));
  roof.rotation.x = -Math.PI / 2;
  roof.receiveShadow = true;
  g.add(roof);
  // Roof edge
  const edge = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 1.2, 72, 1, true), toon(0x3a3d44));
  edge.position.y = -0.6;
  g.add(edge);
  // Glass-and-steel safety railing is the arena wall.
  const glass = new THREE.MeshStandardMaterial({ color: 0x9fc8ff, transparent: true, opacity: 0.22, roughness: 0.1, metalness: 0.2 });
  wallRing(g, occ, { h: 1.1, color: glass, top: 0xbbbbbb, thick: 0.06, segs: 28, posts: 0x999999, glass: true });
  // Azrieli towers: round, triangle, square, and more of the skyline around.
  const winTex = windowsTex(8, 40, '#ffe7a8', '#1b2340', '#2b3450');
  const winMat = new THREE.MeshStandardMaterial({ map: winTex, emissive: 0xffffff, emissiveMap: winTex, emissiveIntensity: 0.6, roughness: 0.4 });
  const round = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 40, 32), winMat);
  round.position.set(-18, -8, -28);
  const tri = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 36, 3), winMat);
  tri.position.set(20, -10, -24);
  const sq = new THREE.Mesh(new THREE.BoxGeometry(7, 34, 7), winMat);
  sq.position.set(2, -12, -40);
  g.add(round, tri, sq);
  around(14, 46, (x, z, a) => {
    const h = 20 + ((Math.sin(a * 5) + 1) / 2) * 24;
    const b = new THREE.Mesh(new THREE.BoxGeometry(6, h, 6), winMat);
    b.position.set(x, -30 + h / 2, z);
    b.rotation.y = a;
    g.add(b);
  }, -Math.PI / 2, 1.4);
  // City lights below, all around.
  const n = 2000;
  const geo = new THREE.BufferGeometry();
  const pts = new Float32Array(n * 3);
  const cols = new Float32Array(n * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    const r = 25 + Math.random() * 110;
    pts[i * 3] = Math.cos(a) * r;
    pts[i * 3 + 1] = -28 - Math.random() * 3;
    pts[i * 3 + 2] = Math.sin(a) * r;
    c.setHSL(0.08 + Math.random() * 0.1, 0.9, 0.5 + Math.random() * 0.3);
    cols.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  g.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.5, vertexColors: true, fog: false })));
  // Stars
  const sgeo = new THREE.BufferGeometry();
  const spts = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.random() * Math.PI * 0.45;
    spts.set([Math.cos(th) * Math.sin(ph) * 110, Math.cos(ph) * 110, Math.sin(th) * Math.sin(ph) * 110], i * 3);
  }
  sgeo.setAttribute('position', new THREE.BufferAttribute(spts, 3));
  g.add(new THREE.Points(sgeo, new THREE.PointsMaterial({ size: 0.35, color: 0xffffff, fog: false })));
  // AC units & antenna just outside the railing.
  const sectors = new Sectors(g, occ, 12, 10.8);
  const kit = new THREE.Group();
  box(kit, [2, 1.2, 1.4], 0x8a8f99, [-7.6, 0.6, -7.6], [0, Math.PI / 4, 0]);
  box(kit, [2, 1.2, 1.4], 0x8a8f99, [8.0, 0.6, 7.2], [0, -Math.PI / 4, 0]);
  box(kit, [0.15, 6, 0.15], 0x777777, [7.8, 3, -7.8]);
  sectors.adopt(kit, 1.5);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), additive(0xff2244, 1));
  beacon.position.set(7.8, 6.1, -7.8);
  g.add(beacon);
  return {
    group: g,
    occluders: occ,
    update: (t) => {
      beacon.visible = Math.sin(t * 4) > 0;
    },
    lighting: {
      background: 0x05060f, fog: [0x0b0b1e, 40, 160],
      hemiSky: 0x6070c0, hemiGround: 0x201830, hemiIntensity: 0.9,
      key: 0xc8d4ff, keyIntensity: 2.4, keyPos: [6, 14, 9],
      rim: 0xff4fa3, rimIntensity: 2.0,
    },
  };
}

export function disposeStage(s: BuiltStage): void {
  s.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else if (mat) {
      const anyMat = mat as THREE.MeshStandardMaterial;
      anyMat.map?.dispose();
      mat.dispose();
    }
  });
}
