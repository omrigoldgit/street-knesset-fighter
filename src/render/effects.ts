// Particle sparks, shock rings and flashes. Uses a single instanced mesh for particles.

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
}

interface Ring {
  mesh: THREE.Mesh;
  life: number;
  max: number;
  from: number;
  to: number;
  active: boolean;
  flat: boolean;
}

const MAX_PARTICLES = 900;
const dummy = new THREE.Object3D();
const tmpColor = new THREE.Color();

export class Effects {
  group = new THREE.Group();
  private inst: THREE.InstancedMesh;
  private particles: Particle[] = [];
  private rings: Ring[] = [];
  private flashes: Ring[] = [];

  constructor() {
    const geo = new THREE.OctahedronGeometry(1, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.inst = new THREE.InstancedMesh(geo, mat, MAX_PARTICLES);
    this.inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.inst.frustumCulled = false;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      this.inst.setMatrixAt(i, dummy.matrix);
      this.inst.setColorAt(i, tmpColor.set(0xffffff));
    }
    this.group.add(this.inst);
    for (let i = 0; i < 24; i++) {
      const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 40), additive(0xffffff, 1));
      (m.material as THREE.MeshBasicMaterial).side = THREE.DoubleSide;
      m.visible = false;
      this.group.add(m);
      this.rings.push({ mesh: m, life: 0, max: 1, from: 0, to: 1, active: false, flat: false });
    }
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), additive(0xffffff, 1));
      m.visible = false;
      this.group.add(m);
      this.flashes.push({ mesh: m, life: 0, max: 1, from: 0, to: 1, active: false, flat: true });
    }
  }

  clear(): void {
    this.particles.length = 0;
    for (const r of [...this.rings, ...this.flashes]) {
      r.active = false;
      r.mesh.visible = false;
    }
  }

  burst(x: number, y: number, z: number, color: number, count: number, speed: number, size = 0.05, grav = 0.004, life = 30): void {
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
      });
    }
  }

  ring(x: number, y: number, z: number, color: number, from: number, to: number, life: number, flat = false): void {
    const r = this.rings.find((q) => !q.active) ?? this.rings[0];
    r.active = true;
    r.life = life;
    r.max = life;
    r.from = from;
    r.to = to;
    r.mesh.visible = true;
    r.mesh.position.set(x, y, z);
    r.flat = flat;
    r.mesh.rotation.set(flat ? -Math.PI / 2 : 0, 0, 0);
    (r.mesh.material as THREE.MeshBasicMaterial).color.set(color);
  }

  flash(x: number, y: number, z: number, color: number, size: number, life = 8): void {
    const r = this.flashes.find((q) => !q.active) ?? this.flashes[0];
    r.active = true;
    r.life = life;
    r.max = life;
    r.from = size * 0.4;
    r.to = size;
    r.mesh.visible = true;
    r.mesh.position.set(x, y, z);
    (r.mesh.material as THREE.MeshBasicMaterial).color.set(color);
  }

  hitSpark(x: number, y: number, z: number, kind: SparkKind, blocked: boolean, color?: number): void {
    if (blocked) {
      this.burst(x, y, z, 0x88ccff, 10, 0.06, 0.04, 0.001, 16);
      this.ring(x, y, z, 0x9fd8ff, 0.1, 0.6, 12);
      return;
    }
    const base = color ?? (kind === 'super' ? 0xffd200 : kind === 'special' ? 0xff8a00 : kind === 'heavy' ? 0xffb347 : 0xfff1a8);
    const n = kind === 'light' ? 12 : kind === 'heavy' ? 22 : kind === 'special' ? 26 : 40;
    const sp = kind === 'light' ? 0.07 : kind === 'heavy' ? 0.1 : 0.12;
    this.burst(x, y, z, base, n, sp, kind === 'light' ? 0.045 : 0.06, 0.003, 22);
    this.burst(x, y, z, 0xffffff, Math.round(n / 3), sp * 1.3, 0.035, 0.001, 12);
    this.flash(x, y, z, 0xffffff, kind === 'light' ? 0.28 : 0.45, 6);
    this.ring(x, y, z, base, 0.1, kind === 'light' ? 0.6 : kind === 'super' ? 1.8 : 1.1, kind === 'light' ? 10 : 16);
  }

  /** Advances particles; upright shock rings turn to face the camera. */
  update(dt: number, camera?: THREE.Camera): void {
    const k = Math.min(3, dt * 60);
    let i = 0;
    const ps = this.particles;
    for (let p = ps.length - 1; p >= 0; p--) {
      const q = ps[p];
      q.life -= k;
      if (q.life <= 0) {
        ps.splice(p, 1);
        continue;
      }
      q.vy -= q.grav * k;
      q.vx *= Math.pow(q.drag, k);
      q.vy *= Math.pow(q.drag, k);
      q.vz *= Math.pow(q.drag, k);
      q.x += q.vx * k;
      q.y += q.vy * k;
      q.z += q.vz * k;
      if (q.y < 0.02) {
        q.y = 0.02;
        q.vy *= -0.3;
      }
    }
    for (const q of ps) {
      const f = q.life / q.max;
      dummy.position.set(q.x, q.y, q.z);
      dummy.rotation.set(q.life * 0.3, q.life * 0.2, 0);
      dummy.scale.setScalar(q.size * (0.3 + f * 0.9));
      dummy.updateMatrix();
      this.inst.setMatrixAt(i, dummy.matrix);
      tmpColor.copy(q.color).multiplyScalar(0.4 + f);
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

    for (const r of [...this.rings, ...this.flashes]) {
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
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - t;
    }
  }
}
