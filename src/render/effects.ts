// Particle sparks, speed streaks, shock rings, flares and flashes. Colours go above 1.0 (HDR)
// so the bloom pass makes impacts glow. Particles and streaks are single instanced meshes.

import * as THREE from 'three';
import type { SparkKind } from '../game/types';
import { additive } from './materials';

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; max: number;
  size: number;
  color: THREE.Color;
  grav: number;
  drag: number;
  glow: number;
}

interface Streak {
  x: number; y: number; z: number;
  dx: number; dy: number; dz: number;
  speed: number;
  len: number;
  life: number; max: number;
  color: THREE.Color;
}

interface Ring {
  mesh: THREE.Mesh | THREE.Sprite;
  life: number;
  max: number;
  from: number;
  to: number;
  active: boolean;
  flat: boolean;
}

const MAX_PARTICLES = 900;
const MAX_STREAKS = 160;
const dummy = new THREE.Object3D();
const tmpColor = new THREE.Color();
const Z = new THREE.Vector3(0, 0, 1);
const dir = new THREE.Vector3();

function flareTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.18, 'rgba(255,255,255,0.85)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.25)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  // Four-point star glint.
  g.globalCompositeOperation = 'lighter';
  for (const [w, h] of [[128, 6], [6, 128]]) {
    const lg = g.createLinearGradient(64 - w / 2, 64 - h / 2, 64 + w / 2, 64 + h / 2);
    lg.addColorStop(0, 'rgba(255,255,255,0)');
    lg.addColorStop(0.5, 'rgba(255,255,255,0.8)');
    lg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = lg;
    g.fillRect(64 - w / 2, 64 - h / 2, w, h);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Effects {
  group = new THREE.Group();
  private inst: THREE.InstancedMesh;
  private streakInst: THREE.InstancedMesh;
  private particles: Particle[] = [];
  private streaks: Streak[] = [];
  private rings: Ring[] = [];
  private flashes: Ring[] = [];
  private flares: Ring[] = [];

  constructor() {
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    this.inst = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), mat, MAX_PARTICLES);
    this.inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.inst.frustumCulled = false;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      this.inst.setMatrixAt(i, dummy.matrix);
      this.inst.setColorAt(i, tmpColor.set(0xffffff));
    }
    const streakGeo = new THREE.BoxGeometry(1, 1, 1);
    streakGeo.translate(0, 0, 0.5);
    this.streakInst = new THREE.InstancedMesh(streakGeo, mat.clone(), MAX_STREAKS);
    this.streakInst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.streakInst.frustumCulled = false;
    for (let i = 0; i < MAX_STREAKS; i++) {
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      this.streakInst.setMatrixAt(i, dummy.matrix);
      this.streakInst.setColorAt(i, tmpColor.set(0xffffff));
    }
    this.group.add(this.inst, this.streakInst);
    for (let i = 0; i < 24; i++) {
      const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 48), additive(0xffffff, 1));
      const rm = m.material as THREE.MeshBasicMaterial;
      rm.side = THREE.DoubleSide;
      rm.toneMapped = false;
      m.visible = false;
      this.group.add(m);
      this.rings.push({ mesh: m, life: 0, max: 1, from: 0, to: 1, active: false, flat: false });
    }
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), additive(0xffffff, 1));
      (m.material as THREE.MeshBasicMaterial).toneMapped = false;
      m.visible = false;
      this.group.add(m);
      this.flashes.push({ mesh: m, life: 0, max: 1, from: 0, to: 1, active: false, flat: true });
    }
    const flareTex = flareTexture();
    for (let i = 0; i < 12; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex, color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
      s.visible = false;
      this.group.add(s);
      this.flares.push({ mesh: s, life: 0, max: 1, from: 0, to: 1, active: false, flat: true });
    }
  }

  clear(): void {
    this.particles.length = 0;
    this.streaks.length = 0;
    for (const r of [...this.rings, ...this.flashes, ...this.flares]) {
      r.active = false;
      r.mesh.visible = false;
    }
  }

  burst(x: number, y: number, z: number, color: number, count: number, speed: number, size = 0.05, grav = 0.004, life = 30, glow = 1): void {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= MAX_PARTICLES) this.particles.shift();
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const s = speed * (0.4 + Math.random() * 0.8);
      this.particles.push({
        x, y, z,
        vx: Math.sin(ph) * Math.cos(th) * s,
        vy: Math.cos(ph) * s + speed * 0.3,
        vz: Math.sin(ph) * Math.sin(th) * s,
        life: life * (0.6 + Math.random() * 0.6),
        max: life,
        size: size * (0.6 + Math.random() * 0.8),
        color: new THREE.Color(color),
        grav,
        drag: 0.92,
        glow,
      });
    }
  }

  /** Radiating speed lines (Tekken impact streaks). */
  streakBurst(x: number, y: number, z: number, color: number, count: number, speed: number, len: number, life = 10): void {
    for (let i = 0; i < count; i++) {
      if (this.streaks.length >= MAX_STREAKS) this.streaks.shift();
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      this.streaks.push({
        x, y, z,
        dx: Math.sin(ph) * Math.cos(th), dy: Math.cos(ph), dz: Math.sin(ph) * Math.sin(th),
        speed: speed * (0.6 + Math.random() * 0.8),
        len: len * (0.5 + Math.random()),
        life: life * (0.7 + Math.random() * 0.5),
        max: life,
        color: new THREE.Color(color).multiplyScalar(2.2),
      });
    }
  }

  private take(pool: Ring[]): Ring {
    return pool.find((q) => !q.active) ?? pool[0];
  }

  ring(x: number, y: number, z: number, color: number, from: number, to: number, life: number, flat = false, glow = 1): void {
    const r = this.take(this.rings);
    r.active = true;
    r.life = life;
    r.max = life;
    r.from = from;
    r.to = to;
    r.mesh.visible = true;
    r.mesh.position.set(x, y, z);
    r.flat = flat;
    r.mesh.rotation.set(flat ? -Math.PI / 2 : 0, 0, 0);
    ((r.mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).color.set(color).multiplyScalar(glow);
  }

  flash(x: number, y: number, z: number, color: number, size: number, life = 8, glow = 1): void {
    const r = this.take(this.flashes);
    r.active = true;
    r.life = life;
    r.max = life;
    r.from = size * 0.4;
    r.to = size;
    r.mesh.visible = true;
    r.mesh.position.set(x, y, z);
    ((r.mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).color.set(color).multiplyScalar(glow);
  }

  /** Soft glowing star sprite. */
  flare(x: number, y: number, z: number, color: number, size: number, life = 10, glow = 2): void {
    const r = this.take(this.flares);
    r.active = true;
    r.life = life;
    r.max = life;
    r.from = size * 0.5;
    r.to = size;
    r.mesh.visible = true;
    r.mesh.position.set(x, y, z);
    const m = r.mesh.material as THREE.SpriteMaterial;
    m.color.set(color).multiplyScalar(glow);
    m.rotation = Math.random() * Math.PI;
  }

  hitSpark(x: number, y: number, z: number, kind: SparkKind, blocked: boolean, color?: number): void {
    if (blocked) {
      this.burst(x, y, z, 0x88ccff, 10, 0.06, 0.04, 0.001, 16, 1.8);
      this.ring(x, y, z, 0x9fd8ff, 0.1, 0.7, 12, false, 1.6);
      this.flare(x, y, z, 0x9fd8ff, 0.7, 8, 1.4);
      return;
    }
    const base = color ?? (kind === 'super' ? 0xffd200 : kind === 'special' ? 0xff8a00 : kind === 'heavy' ? 0xffb347 : 0xfff1a8);
    const n = kind === 'light' ? 12 : kind === 'heavy' ? 22 : kind === 'special' ? 26 : 40;
    const sp = kind === 'light' ? 0.07 : kind === 'heavy' ? 0.1 : 0.12;
    this.burst(x, y, z, base, n, sp, kind === 'light' ? 0.045 : 0.06, 0.003, 22, 2.4);
    this.burst(x, y, z, 0xffffff, Math.round(n / 3), sp * 1.3, 0.035, 0.001, 12, 3);
    this.streakBurst(x, y, z, base, kind === 'light' ? 6 : kind === 'heavy' ? 12 : 18, kind === 'light' ? 0.12 : 0.2, kind === 'light' ? 0.25 : 0.5, kind === 'light' ? 7 : 11);
    this.flash(x, y, z, 0xffffff, kind === 'light' ? 0.28 : 0.45, 6, 2);
    this.flare(x, y, z, base, kind === 'light' ? 1.0 : kind === 'super' ? 2.6 : 1.8, kind === 'light' ? 8 : 12, 2.5);
    this.ring(x, y, z, base, 0.1, kind === 'light' ? 0.6 : kind === 'super' ? 1.8 : 1.1, kind === 'light' ? 10 : 16, false, 2);
  }

  update(dt: number, camera?: THREE.Camera): void {
    const k = Math.min(3, dt * 60);
    const ps = this.particles;
    for (let p = ps.length - 1; p >= 0; p--) {
      const q = ps[p];
      q.life -= k;
      if (q.life <= 0) {
        ps.splice(p, 1);
        continue;
      }
      q.vy -= q.grav * k;
      const d = Math.pow(q.drag, k);
      q.vx *= d;
      q.vy *= d;
      q.vz *= d;
      q.x += q.vx * k;
      q.y += q.vy * k;
      q.z += q.vz * k;
      if (q.y < 0.02) {
        q.y = 0.02;
        q.vy *= -0.3;
      }
    }
    let i = 0;
    for (const q of ps) {
      const f = q.life / q.max;
      dummy.position.set(q.x, q.y, q.z);
      dummy.rotation.set(q.life * 0.3, q.life * 0.2, 0);
      dummy.scale.setScalar(q.size * (0.3 + f * 0.9));
      dummy.updateMatrix();
      this.inst.setMatrixAt(i, dummy.matrix);
      tmpColor.copy(q.color).multiplyScalar((0.4 + f) * q.glow);
      this.inst.setColorAt(i, tmpColor);
      i++;
    }
    for (; i < MAX_PARTICLES; i++) {
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      this.inst.setMatrixAt(i, dummy.matrix);
    }
    this.inst.instanceMatrix.needsUpdate = true;
    if (this.inst.instanceColor) this.inst.instanceColor.needsUpdate = true;

    const ss = this.streaks;
    for (let s = ss.length - 1; s >= 0; s--) {
      const q = ss[s];
      q.life -= k;
      if (q.life <= 0) {
        ss.splice(s, 1);
        continue;
      }
      q.x += q.dx * q.speed * k;
      q.y += q.dy * q.speed * k;
      q.z += q.dz * q.speed * k;
      q.speed *= Math.pow(0.85, k);
    }
    let j = 0;
    for (const q of ss) {
      const f = q.life / q.max;
      dummy.position.set(q.x, q.y, q.z);
      dir.set(q.dx, q.dy, q.dz);
      dummy.quaternion.setFromUnitVectors(Z, dir);
      dummy.scale.set(0.012 + 0.01 * f, 0.012 + 0.01 * f, q.len * (0.3 + f));
      dummy.updateMatrix();
      this.streakInst.setMatrixAt(j, dummy.matrix);
      tmpColor.copy(q.color).multiplyScalar(f);
      this.streakInst.setColorAt(j, tmpColor);
      j++;
    }
    for (; j < MAX_STREAKS; j++) {
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      this.streakInst.setMatrixAt(j, dummy.matrix);
    }
    this.streakInst.instanceMatrix.needsUpdate = true;
    if (this.streakInst.instanceColor) this.streakInst.instanceColor.needsUpdate = true;

    for (const r of [...this.rings, ...this.flashes, ...this.flares]) {
      if (!r.active) continue;
      r.life -= k;
      if (r.life <= 0) {
        r.active = false;
        r.mesh.visible = false;
        continue;
      }
      const t = 1 - r.life / r.max;
      if (!r.flat && camera) r.mesh.quaternion.copy(camera.quaternion);
      r.mesh.scale.setScalar(r.from + (r.to - r.from) * (1 - (1 - t) * (1 - t)));
      (r.mesh.material as THREE.MeshBasicMaterial | THREE.SpriteMaterial).opacity = 1 - t;
    }
  }
}
