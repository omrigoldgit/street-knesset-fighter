// Procedural stages. Fighters stand on the X axis at Z = 0; the camera looks from +Z.

import * as THREE from 'three';
import type { StageDef } from '../data/stages';
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
}

type P3 = [number, number, number];

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

function floor(g: THREE.Group, tex: THREE.Texture, color = 0xffffff, size: [number, number] = [60, 40]): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), new THREE.MeshStandardMaterial({ map: tex, color, roughness: 0.85, metalness: 0.02 }));
  m.rotation.x = -Math.PI / 2;
  m.position.z = -size[1] / 2 + 12;
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
function crowd(g: THREE.Group, spots: P3[], colors: number[], scale = 1): (t: number) => void {
  const n = spots.length;
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
      d.rotation.set(0, 0, 0);
      d.scale.setScalar(1);
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

/** The seven-branched Knesset Menorah, stylised. */
function menorah(g: THREE.Group, pos: P3, scale: number, color: number): THREE.Group {
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
  m.scale.setScalar(scale);
  g.add(m);
  return m;
}

function palm(g: THREE.Group, pos: P3, h: number): void {
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
  }, [14, 10]);
  floor(g, carpet);

  // Back wall: Jerusalem stone
  const stone = canvasTex(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#d8c7a3';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(120,100,70,0.35)';
    for (let r = 0; r < 8; r++) {
      const off = (r % 2) * 32;
      for (let c = -1; c < 9; c++) ctx.strokeRect(c * 64 + off, r * 32, 64, 32);
    }
    noise(ctx, w, h, 4000, 0.1);
  }, [6, 3]);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 18), new THREE.MeshStandardMaterial({ map: stone, roughness: 0.95 }));
  wall.position.set(0, 9, -13);
  wall.receiveShadow = true;
  g.add(wall);

  // Speaker's dais with the emblem above.
  box(g, [9, 1.2, 1.6], 0x6b4a2e, [0, 0.6, -8.5]);
  box(g, [7, 0.9, 1.2], 0x7c5634, [0, 1.65, -9.4]);
  box(g, [0.9, 1.4, 0.6], 0x5a3d25, [0, 1.3, -7.6]);
  menorah(g, [0, 2.3, -12.6], 0.8, 0xd4a852);
  // Tapestry panels
  const tapestryColors = [0x3b6fd8, 0xd9a441, 0x2f8a6a];
  for (let i = 0; i < 3; i++) {
    const p = box(g, [5, 5.5, 0.1], toon(tapestryColors[i]), [-12 + i * 12, 5.5, -12.8], [0, 0, 0], false);
    if (i === 1) p.visible = false;
  }

  // Tiered horseshoe of desks and blue chairs.
  const deskMat = toon(0x7c5634);
  const chairMat = toon(0x2c5fb8);
  const desks: THREE.Matrix4[] = [];
  const chairs: THREE.Matrix4[] = [];
  const spots: P3[] = [];
  const d = new THREE.Object3D();
  for (let row = 0; row < 4; row++) {
    const r = 9 + row * 1.6;
    const y = row * 0.55;
    const count = 16 + row * 3;
    for (let i = 0; i < count; i++) {
      const a = Math.PI * 1.08 + (i / (count - 1)) * Math.PI * 0.84;
      const x = Math.cos(a) * r * 1.35;
      const z = 3 + Math.sin(a) * r;
      if (z > -2.5) continue;
      d.position.set(x, y + 0.45, z);
      d.rotation.set(0, -a - Math.PI / 2, 0);
      d.updateMatrix();
      desks.push(d.matrix.clone());
      d.position.set(x + Math.cos(a) * 0.7, y + 0.35, z + Math.sin(a) * 0.7);
      d.updateMatrix();
      chairs.push(d.matrix.clone());
      if ((i + row) % 3 !== 0) spots.push([x + Math.cos(a) * 0.7, y + 0.1, z + Math.sin(a) * 0.7]);
    }
  }
  const deskInst = new THREE.InstancedMesh(new THREE.BoxGeometry(1.1, 0.9, 0.55), deskMat, desks.length);
  desks.forEach((m, i) => deskInst.setMatrixAt(i, m));
  deskInst.receiveShadow = true;
  const chairInst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.6, 1.0, 0.5), chairMat, chairs.length);
  chairs.forEach((m, i) => chairInst.setMatrixAt(i, m));
  g.add(deskInst, chairInst);
  const upd = crowd(g, spots, [0x1b2a4a, 0x2d2f36, 0x111216, 0x3a4a5e, 0xf2f2f2, 0x5a3d25]);

  // Ceiling light bars
  for (let i = -2; i <= 2; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(8, 0.1, 0.4), new THREE.MeshBasicMaterial({ color: 0xfff4d6 }));
    bar.position.set(i * 9, 12, -4);
    g.add(bar);
  }

  return {
    group: g,
    update: (t) => upd(t),
    lighting: {
      background: 0x1a1410, fog: [0x1a1410, 22, 60],
      hemiSky: 0xfff0d8, hemiGround: 0x2a2a44, hemiIntensity: 1.1,
      key: 0xfff1d6, keyIntensity: 2.6, keyPos: [4, 12, 8],
      rim: 0x6f9bff, rimIntensity: 1.4,
    },
  };
}

function plaza(): BuiltStage {
  const g = new THREE.Group();
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
  }, [16, 12]);
  floor(g, paving, 0xffffff, [120, 80]);

  // Lawns
  const grass = toon(0x5d9b3a);
  for (const x of [-16, 16]) box(g, [14, 0.1, 10], grass, [x, 0.05, -10], [0, 0, 0], false);

  // Knesset building: long block with square columns.
  const bld = new THREE.Group();
  const stoneMat = toon(0xe7dcc2);
  box(bld, [34, 1.2, 8], stoneMat, [0, 7.4, 0]);
  box(bld, [32, 6.8, 6], toon(0x3a3a3a), [0, 3.4, -0.5]);
  for (let i = 0; i < 15; i++) box(bld, [1.0, 6.8, 1.0], stoneMat, [-14 + i * 2, 3.4, 3.2]);
  box(bld, [36, 0.6, 9], toon(0xcfc3a8), [0, 0.3, 0]);
  bld.position.set(0, 0, -26);
  g.add(bld);

  menorah(g, [8, 0, -12], 0.9, 0x6e5230);
  // Flags
  for (const x of [-10, -7, 10.5, 13.5]) {
    box(g, [0.08, 7, 0.08], 0xdddddd, [x, 3.5, -16]);
    const flag = new THREE.Group();
    box(flag, [1.6, 1.1, 0.03], 0xffffff, [0.8, 0, 0], [0, 0, 0], false);
    box(flag, [1.6, 0.16, 0.035], 0x1f4fbf, [0.8, 0.38, 0], [0, 0, 0], false);
    box(flag, [1.6, 0.16, 0.035], 0x1f4fbf, [0.8, -0.38, 0], [0, 0, 0], false);
    flag.position.set(x, 6.3, -16);
    g.add(flag);
  }
  // Olive trees
  for (const [x, z] of [[-13, -7], [-17, -12], [15, -7], [18, -13], [-6, -18], [5, -19]] as [number, number][]) {
    box(g, [0.3, 2.2, 0.3], 0x6a5236, [x, 1.1, z]);
    const c = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 8), toon(0x7f9a5a));
    c.scale.set(1.2, 0.8, 1.1);
    c.position.set(x, 2.8, z);
    c.castShadow = true;
    g.add(c);
  }
  const spots: P3[] = [];
  for (let i = 0; i < 40; i++) spots.push([-18 + (i % 20) * 1.9 + (i > 19 ? 0.9 : 0), 0, -8.5 - (i > 19 ? 1.4 : 0)]);
  const upd = crowd(g, spots, [0x1f4fbf, 0xffffff, 0xd62839, 0x2d2f36, 0xf2c14e, 0x3a7d44]);
  return {
    group: g,
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
  const carpet = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#6a2c2c';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,210,150,0.08)';
    for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) if ((i + j) % 2 === 0) ctx.fillRect(i * 16, j * 16, 16, 16);
    noise(ctx, w, h, 2500, 0.12);
  }, [16, 10]);
  floor(g, carpet);
  const wood = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#6b4a2e';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = `rgba(40,20,10,${0.08 + Math.random() * 0.12})`;
      ctx.fillRect(i * 16, 0, 2, h);
    }
    noise(ctx, w, h, 2000, 0.1);
  }, [10, 2]);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 12), new THREE.MeshStandardMaterial({ map: wood, roughness: 0.8 }));
  wall.position.set(0, 6, -11);
  g.add(wall);
  // U table
  const tableMat = toon(0x4a2f1c);
  box(g, [16, 0.9, 1.6], tableMat, [0, 0.45, -7]);
  box(g, [1.6, 0.9, 6], tableMat, [-9, 0.45, -4.5]);
  box(g, [1.6, 0.9, 6], tableMat, [9, 0.45, -4.5]);
  const chairMat = toon(0x1a1a1a);
  const spots: P3[] = [];
  for (let i = 0; i < 12; i++) {
    const x = -7.2 + i * 1.3;
    box(g, [0.7, 1.3, 0.6], chairMat, [x, 0.65, -8.3]);
    spots.push([x, 0.2, -8.2]);
    box(g, [0.25, 0.3, 0.02], 0xf4f4f4, [x, 1.05, -6.2], [-0.4, 0, 0], false);
    box(g, [0.08, 0.26, 0.08], new THREE.MeshStandardMaterial({ color: 0x9fd3ff, transparent: true, opacity: 0.6 }), [x + 0.35, 1.03, -6.6]);
  }
  const upd = crowd(g, spots, [0x1b2a4a, 0x2d2f36, 0x111216, 0x5a3d25]);
  // Big screens with budget graphs
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
  for (const x of [-8, 8]) {
    box(g, [5.4, 3.2, 0.2], 0x111111, [x, 5, -10.8]);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.8), new THREE.MeshBasicMaterial({ map: graph }));
    s.position.set(x, 5, -10.69);
    g.add(s);
  }
  menorah(g, [0, 4.2, -10.9], 0.55, 0xd4a852);
  return {
    group: g,
    update: (t) => upd(t),
    lighting: {
      background: 0x140c08, fog: [0x140c08, 18, 50],
      hemiSky: 0xffe2c0, hemiGround: 0x2a1a14, hemiIntensity: 1.0,
      key: 0xffe6c4, keyIntensity: 2.5, keyPos: [3, 11, 7],
      rim: 0xffb070, rimIntensity: 1.2,
    },
  };
}

function beach(): BuiltStage {
  const g = new THREE.Group();
  skyDome(g, 0x3a3f8f, 0x3a2a4a, 0xff9a5a);
  const sand = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#e6c894';
    ctx.fillRect(0, 0, w, h);
    noise(ctx, w, h, 6000, 0.15);
  }, [20, 12]);
  floor(g, sand, 0xffffff, [120, 60]);
  // Sea
  const seaGeo = new THREE.PlaneGeometry(200, 80, 60, 20);
  const sea = new THREE.Mesh(seaGeo, new THREE.MeshStandardMaterial({ color: 0x2a6f9e, roughness: 0.25, metalness: 0.3, flatShading: true }));
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(0, 0.05, -52);
  g.add(sea);
  // Sun
  const sun = new THREE.Mesh(new THREE.CircleGeometry(6, 32), new THREE.MeshBasicMaterial({ color: 0xffb35a, fog: false }));
  sun.position.set(-18, 7, -110);
  g.add(sun);
  // Skyline far away (to the side)
  for (let i = 0; i < 16; i++) {
    const h = 4 + Math.random() * 14;
    box(g, [2.5 + Math.random() * 2, h, 2.5], toon(0x4a4a6a), [28 + (i % 4) * 4, h / 2, -8 - Math.floor(i / 4) * 5], [0, 0, 0], false);
    box(g, [2.5 + Math.random() * 2, h, 2.5], toon(0x4a4a6a), [-30 - (i % 4) * 4, h / 2, -8 - Math.floor(i / 4) * 5], [0, 0, 0], false);
  }
  for (const [x, z] of [[-12, -6], [-15, -3], [13, -7], [16, -4], [-8, -12], [9, -13]] as [number, number][]) palm(g, [x, 0, z], 6 + Math.random() * 2);
  // Lifeguard tower
  const tower = new THREE.Group();
  for (const x of [-1, 1]) for (const z of [-1, 1]) box(tower, [0.15, 3, 0.15], 0xdddddd, [x, 1.5, z]);
  box(tower, [2.6, 0.2, 2.6], 0xf2f2f2, [0, 3.1, 0]);
  box(tower, [2.4, 1.6, 2.4], 0xd62828, [0, 4, 0]);
  box(tower, [2.8, 0.2, 2.8], 0xffffff, [0, 4.9, 0]);
  tower.position.set(-5, 0, -14);
  g.add(tower);
  // Umbrellas
  for (const [x, z, c] of [[7, -9, 0xff4d6d], [11, -11, 0x3a86ff], [-10, -10, 0xffd60a]] as [number, number, number][]) {
    box(g, [0.08, 2.4, 0.08], 0xeeeeee, [x, 1.2, z]);
    const u = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.6, 12), toon(c));
    u.position.set(x, 2.5, z);
    u.castShadow = true;
    g.add(u);
  }
  const spots: P3[] = [];
  for (let i = 0; i < 24; i++) spots.push([-16 + i * 1.4 + (i % 2) * 0.3, 0, -7 - (i % 3) * 1.3]);
  const upd = crowd(g, spots, [0xff4d6d, 0x3a86ff, 0xffd60a, 0x06d6a0, 0xf4f4f4, 0x8338ec]);
  const pos = seaGeo.getAttribute('position') as THREE.BufferAttribute;
  const base = Float32Array.from(pos.array as Float32Array);
  return {
    group: g,
    update: (t) => {
      upd(t);
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        pos.setZ(i, Math.sin(x * 0.2 + t * 1.2) * 0.25 + Math.cos(y * 0.3 + t) * 0.2);
      }
      pos.needsUpdate = true;
    },
    lighting: {
      background: 0xff9a5a, fog: [0xd98a6a, 40, 140],
      hemiSky: 0xffc59a, hemiGround: 0x6a4a6a, hemiIntensity: 1.2,
      key: 0xffb070, keyIntensity: 3.0, keyPos: [-10, 8, 6],
      rim: 0xff5ea8, rimIntensity: 1.2,
    },
  };
}

function market(): BuiltStage {
  const g = new THREE.Group();
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
  }, [16, 10]);
  floor(g, cobble);
  // Stalls
  const produce = [0xe63946, 0xf77f00, 0xffd60a, 0x55a630, 0x9d4edd, 0xff8fab];
  for (let i = 0; i < 9; i++) {
    const x = -16 + i * 4;
    const z = -7 - (i % 2) * 0.6;
    box(g, [3.4, 1.0, 1.6], 0x6b4a2e, [x, 0.5, z]);
    box(g, [0.1, 3.2, 0.1], 0x3a2a1a, [x - 1.6, 1.6, z + 0.7]);
    box(g, [0.1, 3.2, 0.1], 0x3a2a1a, [x + 1.6, 1.6, z + 0.7]);
    const awn = box(g, [3.8, 0.08, 2.2], toon(i % 2 ? 0xd62828 : 0xf4f4f4), [x, 3.1, z + 0.3], [0.25, 0, 0]);
    awn.castShadow = false;
    for (let k = 0; k < 14; k++) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), toon(produce[(i + k) % produce.length]));
      f.position.set(x - 1.4 + (k % 7) * 0.45, 1.1 + Math.floor(k / 7) * 0.18, z - 0.3 + Math.floor(k / 7) * 0.35);
      g.add(f);
    }
  }
  // Stone arcade wall behind
  box(g, [60, 8, 1], 0x8a7a64, [0, 4, -12]);
  const bulbs = [
    ...stringLights(g, [-18, 5, -5], [0, 5, -5], 22, [0xffe08a, 0xff9f5a, 0xfff1c0]),
    ...stringLights(g, [0, 5, -5], [18, 5, -5], 22, [0xffe08a, 0xff9f5a, 0xfff1c0]),
  ];
  const warm = new THREE.PointLight(0xffb060, 30, 18, 1.6);
  warm.position.set(-6, 4.5, -3);
  const warm2 = new THREE.PointLight(0xffb060, 30, 18, 1.6);
  warm2.position.set(6, 4.5, -3);
  g.add(warm, warm2);
  const spots: P3[] = [];
  for (let i = 0; i < 30; i++) spots.push([-17 + i * 1.2, 0, -9.3 + (i % 2) * 0.5]);
  const upd = crowd(g, spots, [0x2d2f36, 0x6a4c93, 0x1982c4, 0x8ac926, 0xff595e, 0xffca3a]);
  return {
    group: g,
    update: (t) => {
      upd(t);
      bulbs.forEach((b, i) => ((b.material as THREE.MeshBasicMaterial).color.setHSL(0.1, 1, 0.55 + 0.15 * Math.sin(t * 3 + i))));
    },
    lighting: {
      background: 0x0a0c20, fog: [0x0e0e1a, 18, 55],
      hemiSky: 0x5a6aa0, hemiGround: 0x2a1a10, hemiIntensity: 0.8,
      key: 0xffd4a0, keyIntensity: 2.2, keyPos: [5, 10, 8],
      rim: 0x7a8cff, rimIntensity: 1.5,
    },
  };
}

function rooftop(): BuiltStage {
  const g = new THREE.Group();
  skyDome(g, 0x05060f, 0x05060f, 0x1d1540);
  const concrete = canvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#50535a';
    ctx.fillRect(0, 0, w, h);
    noise(ctx, w, h, 8000, 0.12);
    ctx.strokeStyle = 'rgba(255,215,0,0.9)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 220px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', w / 2, h / 2 + 10);
  });
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), new THREE.MeshStandardMaterial({ map: concrete, roughness: 0.9 }));
  roof.rotation.x = -Math.PI / 2;
  roof.position.set(0, 0, -2);
  roof.receiveShadow = true;
  g.add(roof);
  // Railings
  for (let i = 0; i < 27; i++) box(g, [0.06, 1.1, 0.06], 0x999999, [-13 + i, 0.55, -11]);
  box(g, [26, 0.06, 0.06], 0xbbbbbb, [0, 1.1, -11]);
  // Azrieli towers: round, triangle, square.
  const winTex = windowsTex(8, 40, '#ffe7a8', '#1b2340', '#2b3450');
  const winMat = new THREE.MeshStandardMaterial({ map: winTex, emissive: 0xffffff, emissiveMap: winTex, emissiveIntensity: 0.6, roughness: 0.4 });
  const round = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 40, 32), winMat);
  round.position.set(-16, -8, -30);
  const tri = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 36, 3), winMat);
  tri.position.set(16, -10, -26);
  const sq = new THREE.Mesh(new THREE.BoxGeometry(7, 34, 7), winMat);
  sq.position.set(2, -12, -44);
  g.add(round, tri, sq);
  // City lights below
  const n = 1500;
  const geo = new THREE.BufferGeometry();
  const pts = new Float32Array(n * 3);
  const cols = new Float32Array(n * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    pts[i * 3] = (Math.random() - 0.5) * 220;
    pts[i * 3 + 1] = -28 - Math.random() * 3;
    pts[i * 3 + 2] = -20 - Math.random() * 120;
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
    spts.set([Math.cos(th) * Math.sin(ph) * 110, Math.cos(ph) * 110, Math.sin(th) * Math.sin(ph) * 110 - 20], i * 3);
  }
  sgeo.setAttribute('position', new THREE.BufferAttribute(spts, 3));
  g.add(new THREE.Points(sgeo, new THREE.PointsMaterial({ size: 0.35, color: 0xffffff, fog: false })));
  // AC units & antenna
  box(g, [2, 1.2, 1.4], 0x8a8f99, [-10, 0.6, -8]);
  box(g, [2, 1.2, 1.4], 0x8a8f99, [10, 0.6, -8.5]);
  box(g, [0.15, 6, 0.15], 0x777777, [7, 3, -9.5]);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), additive(0xff2244, 1));
  beacon.position.set(7, 6.1, -9.5);
  g.add(beacon);
  return {
    group: g,
    update: (t) => {
      beacon.visible = Math.sin(t * 4) > 0;
    },
    lighting: {
      background: 0x05060f, fog: [0x0b0b1e, 40, 160],
      hemiSky: 0x6070c0, hemiGround: 0x201830, hemiIntensity: 0.9,
      key: 0xc8d4ff, keyIntensity: 2.4, keyPos: [6, 12, 9],
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
