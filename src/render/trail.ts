// Strike trails: a fading additive ribbon behind the fist, foot or weapon that is striking, like the
// swooshes on Tekken attacks. The ribbon lives in world space and follows the fastest-moving limb
// while an attack is active.

import * as THREE from 'three';
import type { Rig } from './characterModel';

const SAMPLES = 12;

interface Limb {
  tip: THREE.Object3D;
  tipOff: THREE.Vector3;
  base: THREE.Object3D;
  prev: THREE.Vector3;
  primed: boolean;
}

export class SwooshTrail {
  readonly mesh: THREE.Mesh;
  private geo = new THREE.BufferGeometry();
  private pos = new Float32Array(SAMPLES * 2 * 3);
  private col = new Float32Array(SAMPLES * 2 * 4);
  private tips: THREE.Vector3[] = [];
  private bases: THREE.Vector3[] = [];
  private limbs: Limb[];
  private color = new THREE.Color(1, 1, 1);
  private cur: Limb | null = null;

  constructor(rig: Rig) {
    const idx: number[] = [];
    for (let i = 0; i < SAMPLES - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    this.geo.setIndex(idx);
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('color', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    this.mesh = new THREE.Mesh(this.geo, mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
    const L = (tip: THREE.Object3D, off: [number, number, number], base: THREE.Object3D): Limb => ({ tip, tipOff: new THREE.Vector3(...off), base, prev: new THREE.Vector3(), primed: false });
    this.limbs = [
      L(rig.lHand, [0, -0.1, 0], rig.lEl),
      L(rig.rHand, [0, -0.1, 0], rig.rEl),
      L(rig.lFoot, [0, -0.02, 0.14], rig.lKnee),
      L(rig.rFoot, [0, -0.02, 0.14], rig.rKnee),
    ];
    // A held weapon extends the hand's reach.
    if (rig.sig.held) {
      const hand = rig.sig.held.hand === 'l' ? 0 : 1;
      this.limbs[hand].tipOff.set(0, -0.32, -0.12);
    }
  }

  /** `active`: an attack's strike window; `color`: the move's colour. */
  update(dt: number, active: boolean, color: number): void {
    const w = new THREE.Vector3();
    // Track limb speeds and pick the fastest one to trail.
    let best: Limb | null = null;
    let bestSpeed = 0;
    for (const l of this.limbs) {
      l.tip.localToWorld(w.copy(l.tipOff));
      const sp = l.primed ? w.distanceTo(l.prev) / Math.max(dt, 1 / 240) : 0;
      l.prev.copy(w);
      l.primed = true;
      if (sp > bestSpeed) {
        bestSpeed = sp;
        best = l;
      }
    }
    if (active && (this.cur || bestSpeed > 1.6)) {
      if (!this.cur) {
        this.cur = best;
        this.tips.length = 0;
        this.bases.length = 0;
        this.color.setHex(color).lerp(new THREE.Color(1, 1, 1), 0.4).multiplyScalar(2.2);
      }
      const l = this.cur!;
      const tip = l.tip.localToWorld(l.tipOff.clone());
      const base = l.base.getWorldPosition(new THREE.Vector3()).lerp(tip, 0.4);
      this.tips.unshift(tip);
      this.bases.unshift(base);
      if (this.tips.length > SAMPLES) {
        this.tips.pop();
        this.bases.pop();
      }
    } else {
      this.cur = null;
      // Let the ribbon shrink away from its tail.
      if (this.tips.length) {
        this.tips.pop();
        this.bases.pop();
      }
    }
    this.rebuild();
  }

  private rebuild(): void {
    const n = this.tips.length;
    this.mesh.visible = n >= 2;
    if (!this.mesh.visible) return;
    for (let i = 0; i < SAMPLES; i++) {
      const k = Math.min(i, n - 1);
      const t = this.tips[k];
      const b = this.bases[k];
      this.pos.set([t.x, t.y, t.z, b.x, b.y, b.z], i * 6);
      const a = i < n ? (1 - i / n) ** 1.6 : 0;
      const c = this.color;
      this.col.set([c.r, c.g, c.b, a, c.r, c.g, c.b, a * 0.12], i * 8);
    }
    (this.geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (this.geo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
  }

  dispose(): void {
    this.geo.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
