// Secondary motion: spring-driven bones that lag behind the body, so coat tails swing through
// spins and kicks, jacket hems flutter, and bellies bounce on landings.
//
// A 'swing' bone hangs a point mass off its tip: the mass is pulled toward where the tip would be
// if the bone were rigid, falls under gravity, stays at the bone's length, and the bone is turned
// to point at it. A 'shift' bone translates instead (a belly), chasing its rest position.

import * as THREE from 'three';

export interface JiggleSpec {
  bone: THREE.Bone;
  mode: 'swing' | 'shift';
  /** Swing: rest tip in bone space (the pendulum arm). */
  tip?: THREE.Vector3;
  /** Spring stiffness (1/s²) and damping ratio. */
  stiffness: number;
  damping: number;
  /** Gravity pull on the tip, in model units/s². */
  gravity?: number;
  /** Max swing angle (rad) or max shift (model units). */
  limit: number;
}

interface State {
  spec: JiggleSpec;
  restQ: THREE.Quaternion;
  restP: THREE.Vector3;
  tipDir: THREE.Vector3;
  p: THREE.Vector3;
  v: THREE.Vector3;
  primed: boolean;
}

const _m = new THREE.Matrix4();
const _o = new THREE.Vector3();
const _t = new THREE.Vector3();
const _d = new THREE.Vector3();
const _a = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _pq = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _one = new THREE.Vector3(1, 1, 1);
const _id = new THREE.Quaternion();

export class Jiggle {
  private items: State[];

  constructor(specs: JiggleSpec[]) {
    this.items = specs.map((spec) => ({
      spec,
      restQ: spec.bone.quaternion.clone(),
      restP: spec.bone.position.clone(),
      tipDir: (spec.tip ?? new THREE.Vector3(0, -1, 0)).clone().normalize(),
      p: new THREE.Vector3(),
      v: new THREE.Vector3(),
      primed: false,
    }));
  }

  get count(): number {
    return this.items.length;
  }

  /** Snap everything back to rest (new round, teleports). */
  reset(): void {
    for (const it of this.items) {
      it.primed = false;
      it.spec.bone.quaternion.copy(it.restQ);
      it.spec.bone.position.copy(it.restP);
    }
  }

  /** Call after the body pose is applied and world matrices are current. */
  update(dt: number): void {
    const h = Math.min(dt, 0.05);
    for (const it of this.items) {
      const { spec } = it;
      const bone = spec.bone;
      const parent = bone.parent;
      if (!parent) continue;
      // Rest frame of the bone in world space.
      _m.compose(it.restP, it.restQ, _one).premultiply(parent.matrixWorld);
      _m.decompose(_o, _pq, _s);
      const ws = _s.x;
      if (spec.mode === 'swing') {
        const len = spec.tip!.length() * ws;
        _t.copy(spec.tip!).applyMatrix4(_m);
        if (!it.primed || it.p.distanceToSquared(_t) > 1) {
          it.p.copy(_t);
          it.v.set(0, 0, 0);
          it.primed = true;
        }
        this.integrate(it, _t, h, spec.gravity ?? 0);
        // Keep the arm length and clamp the swing angle.
        _d.copy(it.p).sub(_o);
        if (_d.lengthSq() < 1e-10) _d.copy(_t).sub(_o);
        _d.normalize();
        _a.copy(_t).sub(_o).normalize();
        const ang = Math.acos(Math.max(-1, Math.min(1, _d.dot(_a))));
        if (ang > spec.limit) {
          _q.setFromUnitVectors(_a, _d);
          _q.slerpQuaternions(_id, _q, spec.limit / ang);
          _d.copy(_a).applyQuaternion(_q);
        }
        it.p.copy(_o).addScaledVector(_d, len);
        // Direction in the bone's rest frame → rotation from the rest tip direction.
        _d.applyQuaternion(_pq.invert()).normalize();
        _q.setFromUnitVectors(it.tipDir, _d);
        bone.quaternion.copy(it.restQ).multiply(_q);
      } else {
        if (!it.primed || it.p.distanceToSquared(_o) > 1) {
          it.p.copy(_o);
          it.v.set(0, 0, 0);
          it.primed = true;
        }
        this.integrate(it, _o, h, spec.gravity ?? 0);
        _d.copy(it.p).sub(_o);
        const lim = spec.limit * ws;
        if (_d.length() > lim) {
          _d.setLength(lim);
          it.p.copy(_o).add(_d);
        }
        // World offset → parent space.
        parent.matrixWorld.decompose(_t, _q, _s);
        _d.applyQuaternion(_q.invert()).divideScalar(_s.x || 1);
        bone.position.copy(it.restP).add(_d);
      }
    }
  }

  private integrate(it: State, target: THREE.Vector3, dt: number, gravity: number): void {
    const k = it.spec.stiffness;
    const c = 2 * it.spec.damping * Math.sqrt(k);
    let rem = dt;
    while (rem > 1e-6) {
      const h = Math.min(rem, 1 / 120);
      rem -= h;
      _a.copy(target).sub(it.p).multiplyScalar(k).addScaledVector(it.v, -c);
      _a.y -= gravity;
      it.v.addScaledVector(_a, h);
      it.p.addScaledVector(it.v, h);
    }
  }
}
