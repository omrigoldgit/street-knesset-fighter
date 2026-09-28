// Frame-data-driven procedural animation with spring dynamics and planted-foot leg IK.
// Every target pose is derived from the fighter's engine state and move frame, so visuals line
// up with hitboxes. Joints chase their targets through damped springs (weight, snap and
// follow-through), and a two-bone IK keeps the feet planted while the body twists and steps.

import * as THREE from 'three';
import { GETUP_FRAMES, TECHROLL_FRAMES } from '../game/constants';
import type { Fighter } from '../game/fighter';
import type { Match } from '../game/match';
import type { AnimKey } from '../game/types';
import { ANKLE_H, HIP_H, SHIN_LEN, THIGH_LEN, type Rig } from './characterModel';

type V3 = [number, number, number];
const JOINTS = ['hips', 'spine', 'chest', 'neck', 'head', 'lSh', 'lEl', 'rSh', 'rEl', 'lHip', 'lKnee', 'rHip', 'rKnee'] as const;
type Joint = (typeof JOINTS)[number];
const N = JOINTS.length * 3 + 3;
const HIPY = JOINTS.length * 3;
const PIVX = HIPY + 1;
const PIVZ = HIPY + 2;
/** Channel index of each joint's X rotation (Y and Z follow). */
const I = Object.fromEntries(JOINTS.map((j, i) => [j, i * 3])) as Record<Joint, number>;
const Y = 1;
const Z = 2;
const TAU = Math.PI * 2;

type PoseSpec = Partial<Record<Joint, V3>> & { hipY?: number; pivotX?: number; pivotZ?: number };
type PoseArr = Float32Array;

function mk(spec: PoseSpec, base?: PoseArr): PoseArr {
  const out = base ? new Float32Array(base) : new Float32Array(N);
  JOINTS.forEach((j, i) => {
    const v = spec[j];
    if (v) {
      out[i * 3] = v[0];
      out[i * 3 + 1] = v[1];
      out[i * 3 + 2] = v[2];
    }
  });
  if (spec.hipY !== undefined) out[HIPY] = spec.hipY;
  if (spec.pivotX !== undefined) out[PIVX] = spec.pivotX;
  if (spec.pivotZ !== undefined) out[PIVZ] = spec.pivotZ;
  return out;
}

function lerpInto(out: PoseArr, a: PoseArr, b: PoseArr, t: number): PoseArr {
  for (let i = 0; i < N; i++) out[i] = a[i] + (b[i] - a[i]) * t;
  return out;
}

const clamp01 = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t);
const ease = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};
const easeOut = (t: number) => 1 - (1 - clamp01(t)) ** 3;

// ------------------------------------------------------------------ pose library
// Head yaw is filled in automatically (gaze stays on the opponent), so poses leave it at 0.

/** Tekken fighting stance: bladed, knees bent, lead (left) hand up. */
const GUARD = mk({
  hipY: -0.08,
  hips: [0, -0.4, 0],
  spine: [0.12, -0.08, 0],
  chest: [0.06, -0.04, 0],
  lSh: [-1.2, 0, 0.28], lEl: [-1.9, 0, 0],
  rSh: [-0.85, 0, -0.32], rEl: [-2.2, 0, 0],
  lHip: [-0.35, 0.3, 0.05], lKnee: [0.5, 0, 0],
  rHip: [0.25, 0.3, -0.06], rKnee: [0.42, 0, 0],
});

const STAND = mk({
  lSh: [0.05, 0, 0.12], lEl: [-0.25, 0, 0], rSh: [0.05, 0, -0.12], rEl: [-0.25, 0, 0],
  lHip: [0, 0, 0.04], rHip: [0, 0, -0.04],
});

const CROUCH = mk({
  hipY: -0.42,
  hips: [0, -0.3, 0],
  spine: [0.42, -0.08, 0],
  head: [-0.35, 0, 0],
  lSh: [-1.0, 0, 0.3], rSh: [-0.75, 0, -0.3],
  lHip: [-1.25, 0.25, 0.12], lKnee: [2.1, 0, 0],
  rHip: [-0.55, 0.25, -0.15], rKnee: [2.2, 0, 0],
}, GUARD);

const RUN = mk({
  hipY: -0.06,
  hips: [0, 0, 0],
  spine: [0.5, 0, 0],
  chest: [0.1, 0, 0],
  head: [-0.45, 0, 0],
  lSh: [-0.6, 0, 0.15], lEl: [-1.6, 0, 0],
  rSh: [-0.6, 0, -0.15], rEl: [-1.6, 0, 0],
}, GUARD);

const AIR = mk({
  hipY: 0,
  hips: [0, 0, 0],
  spine: [0.25, 0, 0],
  head: [-0.2, 0, 0],
  lSh: [-1.4, 0, 0.45], lEl: [-1.3, 0, 0],
  rSh: [-1.0, 0, -0.45], rEl: [-1.6, 0, 0],
  lHip: [-1.35, 0, 0.1], lKnee: [2.0, 0, 0],
  rHip: [-0.75, 0, -0.1], rKnee: [1.7, 0, 0],
}, GUARD);

const AIR_RISE = mk({
  hipY: 0,
  spine: [0.05, 0, 0],
  lSh: [-2.2, 0, 0.3], lEl: [-0.8, 0, 0],
  rSh: [-0.4, 0, -0.5], rEl: [-1.0, 0, 0],
  lHip: [-0.3, 0, 0.05], lKnee: [0.6, 0, 0],
  rHip: [0.1, 0, -0.05], rKnee: [0.4, 0, 0],
}, GUARD);

/** Tekken high/mid guard: forearms stacked in front of the face. */
const BLOCK = mk({
  hipY: -0.12,
  spine: [0.22, -0.05, 0],
  head: [0.25, 0, 0],
  lSh: [-1.4, 0, 0.08], lEl: [-2.3, 0, 0],
  rSh: [-1.3, 0, -0.08], rEl: [-2.35, 0, 0],
}, GUARD);

const CROUCH_BLOCK = mk({
  lSh: [-1.3, 0, 0.05], lEl: [-2.3, 0, 0],
  rSh: [-1.2, 0, -0.05], rEl: [-2.35, 0, 0],
  head: [0.2, 0, 0],
}, CROUCH);

/** Head snapped back (high hits). */
const HIT_HIGH = mk({
  hipY: -0.06,
  spine: [-0.38, 0.25, 0.1],
  chest: [-0.22, 0, 0],
  head: [-0.6, 0, 0.15],
  lSh: [-0.45, 0, 0.85], lEl: [-0.8, 0, 0],
  rSh: [-0.3, 0, -0.75], rEl: [-0.7, 0, 0],
}, GUARD);

/** Doubled over (mid hits to the body). */
const HIT_BODY = mk({
  hipY: -0.16,
  hips: [0, -0.15, 0],
  spine: [0.7, 0, 0],
  chest: [0.25, 0, 0],
  head: [0.25, 0, 0],
  lSh: [-0.55, 0, 0.1], lEl: [-1.9, 0, 0],
  rSh: [-0.45, 0, -0.1], rEl: [-1.9, 0, 0],
}, GUARD);

/** Knee buckles (low hits). */
const HIT_LOW = mk({
  hipY: -0.24,
  spine: [0.35, 0, 0.18],
  chest: [0.15, 0, 0],
  head: [0.25, 0, 0],
  lSh: [-0.7, 0, 0.3], lEl: [-1.6, 0, 0],
  rSh: [-0.6, 0, -0.35], rEl: [-1.5, 0, 0],
}, GUARD);

/** Flat on the back, head away from the facing direction. */
const LYING = mk({
  hipY: -0.8,
  pivotX: -Math.PI / 2,
  hips: [0, 0, 0],
  spine: [0, 0, 0],
  chest: [0, 0, 0],
  head: [0.25, 0, 0],
  lSh: [-0.2, 0, 1.3], lEl: [-0.4, 0, 0],
  rSh: [-0.3, 0, -1.2], rEl: [-0.6, 0, 0],
  lHip: [-0.35, 0, 0.12], lKnee: [0.6, 0, 0],
  rHip: [-0.1, 0, -0.1], rKnee: [0.2, 0, 0],
});

const JUGGLE = mk({
  hipY: 0,
  pivotX: -0.9,
  spine: [-0.25, 0, 0],
  head: [-0.45, 0, 0],
  lSh: [-2.1, 0, 1.1], lEl: [-0.4, 0, 0],
  rSh: [-1.9, 0, -1.1], rEl: [-0.5, 0, 0],
  lHip: [-0.9, 0, 0.12], lKnee: [1.3, 0, 0],
  rHip: [-0.35, 0, -0.12], rKnee: [0.7, 0, 0],
});

/** Pinned against the wall, arms splayed. */
const WALLSPLAT = mk({
  hipY: 0,
  pivotX: -0.12,
  spine: [-0.2, 0, 0.1],
  chest: [-0.1, 0, 0],
  head: [0.35, 0, -0.2],
  lSh: [-0.35, 0, 1.45], lEl: [-0.35, 0, 0],
  rSh: [-0.25, 0, -1.35], rEl: [-0.45, 0, 0],
  lHip: [-0.35, 0, 0.18], lKnee: [0.55, 0, 0],
  rHip: [-0.15, 0, -0.14], rKnee: [0.3, 0, 0],
});

/** Crumple stun: collapsing onto the knees. */
const CRUMPLE = mk({
  hipY: -0.5,
  hips: [0, 0, 0],
  spine: [0.55, 0, 0.2],
  chest: [0.2, 0, 0],
  head: [0.55, 0, 0.3],
  lSh: [0.25, 0, 0.18], lEl: [-0.3, 0, 0],
  rSh: [0.3, 0, -0.14], rEl: [-0.25, 0, 0],
  lHip: [-1.45, 0, 0.12], lKnee: [1.45, 0, 0],
  rHip: [0.05, 0, -0.1], rKnee: [1.6, 0, 0],
});

const VICTORY = [
  mk({ head: [-0.35, 0, 0], spine: [-0.1, 0, 0], lSh: [-2.9, 0, 0.35], lEl: [-0.2, 0, 0], rSh: [-2.9, 0, -0.35], rEl: [-0.2, 0, 0], lHip: [0, 0, 0.12], rHip: [0, 0, -0.12], lKnee: [0, 0, 0], rKnee: [0, 0, 0] }, STAND),
  mk({ head: [-0.2, 0, 0], rSh: [-2.8, 0, -0.1], rEl: [-0.5, 0, 0], lSh: [0.35, 0, 0.55], lEl: [-2.0, 0, 0], lHip: [0, 0, 0.1], rHip: [0, 0, -0.1] }, STAND),
  mk({ spine: [-0.15, 0, 0], head: [-0.2, 0, 0], lSh: [0.35, 0, 0.6], lEl: [-2.0, 0, 0], rSh: [0.35, 0, -0.6], rEl: [-2.0, 0, 0], lHip: [0, 0, 0.14], rHip: [0, 0, -0.14] }, STAND),
];

const INTRO = mk({
  rSh: [-1.55, 0, -0.1], rEl: [-0.05, 0, 0],
  lSh: [0.35, 0, 0.6], lEl: [-2.0, 0, 0],
  spine: [0, 0.2, 0],
}, STAND);

const DIZZY = mk({
  hipY: -0.1,
  spine: [0.15, 0, 0],
  lSh: [0.1, 0, 0.3], lEl: [-0.4, 0, 0],
  rSh: [0.1, 0, -0.3], rEl: [-0.4, 0, 0],
}, GUARD);

const THROWN = mk({
  hipY: 0,
  pivotX: -0.45,
  head: [-0.4, 0, 0],
  lSh: [-2.4, 0, 0.8], lEl: [-0.6, 0, 0],
  rSh: [-2.2, 0, -0.8], rEl: [-0.6, 0, 0],
  lHip: [-0.8, 0, 0.1], lKnee: [1.0, 0, 0],
  rHip: [-0.2, 0, 0], rKnee: [0.6, 0, 0],
}, GUARD);

// ------------------------------------------------------------------ attacks

interface AttackAnim {
  base: PoseArr;
  windup: PoseArr;
  strike: PoseArr;
  /** Legs driven by the pose (kicks, jumps) instead of the planted-foot IK. */
  fk?: 'l' | 'r' | 'both';
  /** Lead (left) / rear foot step-in at full extension, model units. */
  step?: number;
  rear?: number;
  /** Whole-body turn during the strike (spinning kicks), radians. */
  spin?: number;
}

type AnimMeta = Pick<AttackAnim, 'fk' | 'step' | 'rear' | 'spin'>;
const A = (base: PoseArr, windup: PoseSpec, strike: PoseSpec, meta: AnimMeta = {}): AttackAnim => ({ base, windup: mk(windup, base), strike: mk(strike, base), ...meta });

const jabStrike: PoseSpec = { spine: [0.16, -0.55, 0], chest: [0.05, -0.12, 0], lSh: [-1.57, 0, 0.05], lEl: [-0.05, 0, 0], rSh: [-0.85, 0, -0.32], rEl: [-2.2, 0, 0] };
const crossStrike: PoseSpec = { hips: [0, 0.2, 0], spine: [0.22, 0.5, 0], chest: [0.05, 0.12, 0], rSh: [-1.6, 0, -0.05], rEl: [-0.05, 0, 0], lSh: [-0.95, 0, 0.35], lEl: [-2.1, 0, 0] };
const uppercutStrike: PoseSpec = { hipY: 0, hips: [0, 0.35, 0], spine: [-0.25, 0.4, 0], rSh: [-3.0, 0, -0.15], rEl: [-0.25, 0, 0], lSh: [-0.4, 0, 0.5], lEl: [-1.3, 0, 0] };
const castStrike: PoseSpec = { hipY: -0.1, hips: [0, 0.1, 0], spine: [0.12, 0.25, 0], lSh: [-1.55, -0.2, -0.1], lEl: [-0.1, 0, 0], rSh: [-1.55, 0.2, 0.1], rEl: [-0.1, 0, 0] };
const roundhouseStrike: PoseSpec = { hips: [0, 1.0, 0], spine: [-0.35, 0.2, 0.45], rHip: [-1.7, 0, -0.8], rKnee: [0.08, 0, 0], lHip: [0.05, 0.4, 0], lKnee: [0.2, 0, 0], lSh: [-0.5, 0, 0.9], rSh: [-0.3, 0, -0.6] };

const ANIMS: Record<AnimKey, AttackAnim> = {
  // --- Tekken normals (1 = left punch, 2 = right punch, 3 = left kick, 4 = right kick)
  jab: A(GUARD, { spine: [0.12, -0.15, 0], lSh: [-1.05, 0, 0.35], lEl: [-2.0, 0, 0] }, jabStrike, { step: 0.06 }),
  jab2: A(GUARD, { lSh: [-1.1, 0, 0.3], lEl: [-1.6, 0, 0] }, { ...jabStrike, hipY: -0.1, spine: [0.22, -0.5, 0] }, { step: 0.1 }),
  straight: A(GUARD, { spine: [0.1, -0.35, 0], rSh: [-0.7, 0, -0.4], rEl: [-2.2, 0, 0] }, crossStrike, { step: 0.1, rear: 0.05 }),
  hook: A(GUARD, { spine: [0.1, 0.35, 0], lSh: [-1.1, 0, 1.0], lEl: [-1.5, 0, 0] }, { hips: [0, -0.6, 0], spine: [0.15, -0.6, 0], lSh: [-1.55, 0, 0.55], lEl: [-1.35, 0, 0], rSh: [-0.8, 0, -0.3], rEl: [-2.2, 0, 0] }, { step: 0.05 }),
  midKick: A(GUARD, { hipY: -0.02, spine: [-0.05, -0.2, 0], lHip: [-1.3, 0, 0.1], lKnee: [1.9, 0, 0] }, { hips: [0, -0.15, 0], spine: [-0.25, -0.1, 0], lHip: [-1.55, 0, 0.05], lKnee: [0.08, 0, 0], rHip: [0.1, 0.2, 0], rKnee: [0.2, 0, 0], lSh: [-0.9, 0, 0.5], rSh: [-0.9, 0, -0.4] }, { fk: 'l' }),
  highKick: A(GUARD, { hips: [0, 0.4, 0], spine: [-0.1, 0.1, 0], rHip: [-0.9, 0, -0.35], rKnee: [1.9, 0, 0] }, roundhouseStrike, { fk: 'r' }),
  kick2: A(GUARD, { hips: [0, 0.8, 0], rHip: [-1.1, 0, -0.3], rKnee: [2.1, 0, 0] }, { hips: [0, 1.3, 0], spine: [-0.2, 0.2, 0.55], rHip: [-1.4, 0, -0.9], rKnee: [0.05, 0, 0], lHip: [0.1, 0.3, 0.05], lKnee: [0.25, 0, 0], lSh: [-0.6, 0, 0.6], rSh: [-0.5, 0, -0.3] }, { fk: 'r' }),
  dfJab: A(GUARD, { hipY: -0.12, lSh: [-1.0, 0, 0.3], lEl: [-1.9, 0, 0] }, { hipY: -0.2, spine: [0.4, -0.45, 0], lSh: [-1.3, 0, 0.05], lEl: [-0.05, 0, 0] }, { step: 0.12 }),
  launcher: A(GUARD, { hipY: -0.3, spine: [0.45, 0.05, 0], rSh: [0.25, 0, -0.2], rEl: [-1.7, 0, 0], lSh: [-1.2, 0, 0.3] }, uppercutStrike, { step: 0.12, rear: 0.06 }),
  frontKick: A(GUARD, { spine: [-0.1, 0, 0], lHip: [-1.4, 0, 0], lKnee: [2.0, 0, 0] }, { spine: [-0.3, 0, 0], lHip: [-1.6, 0, 0], lKnee: [0.05, 0, 0], lSh: [-0.8, 0, 0.5], rSh: [-0.8, 0, -0.5] }, { fk: 'l' }),
  power: A(GUARD, { hipY: -0.12, hips: [0, -0.5, 0], spine: [0.2, -0.4, 0], rSh: [-0.5, 0, -0.4], rEl: [-2.2, 0, 0] }, { hipY: -0.16, hips: [0, 0.45, 0], spine: [0.35, 0.55, 0], chest: [0.1, 0.1, 0], rSh: [-1.6, 0, 0], rEl: [-0.02, 0, 0], lSh: [-0.7, 0, 0.5], lEl: [-2.0, 0, 0] }, { step: 0.3, rear: 0.12 }),
  knee: A(GUARD, { lSh: [-1.6, 0, 0.2], rSh: [-1.6, 0, -0.2], lEl: [-0.8, 0, 0], rEl: [-0.8, 0, 0] }, { spine: [0.15, 0, 0], rHip: [-2.0, 0, 0], rKnee: [2.4, 0, 0], lHip: [0.1, 0, 0], lKnee: [0.2, 0, 0], lSh: [-1.0, 0, 0.25], rSh: [-1.0, 0, -0.25], lEl: [-1.4, 0, 0], rEl: [-1.4, 0, 0] }, { fk: 'r' }),
  elbow: A(GUARD, { spine: [0.1, 0.3, 0], lSh: [-1.3, 0, 0.9], lEl: [-2.4, 0, 0] }, { hips: [0, -0.6, 0], spine: [0.2, -0.5, 0], lSh: [-1.55, 0, 0.6], lEl: [-2.5, 0, 0] }, { step: 0.12 }),
  bHook: A(GUARD, { spine: [0.1, -0.6, 0], rSh: [-1.0, 0, -1.1], rEl: [-1.4, 0, 0] }, { hips: [0, 0.55, 0], spine: [0.2, 0.65, 0], rSh: [-1.55, 0, -0.5], rEl: [-1.4, 0, 0], lSh: [-0.9, 0, 0.3], lEl: [-2.1, 0, 0] }, { step: 0.1, rear: 0.06 }),
  spinBack: A(GUARD, { hips: [0, -0.8, 0], spine: [0.1, -0.3, 0], rHip: [-0.6, 0, -0.4], rKnee: [1.6, 0, 0] }, { spine: [-0.3, 0, 0.4], rHip: [-1.6, 0, -1.0], rKnee: [0.05, 0, 0], lHip: [0, 0, 0.05], lKnee: [0.15, 0, 0], lSh: [-0.4, 0, 1.2], rSh: [-0.3, 0, -1.0] }, { fk: 'r', spin: -TAU }),
  dJab: A(CROUCH, { lSh: [-1.0, 0, 0.35], lEl: [-2.0, 0, 0] }, { spine: [0.35, -0.45, 0], lSh: [-1.5, 0, 0.05], lEl: [-0.05, 0, 0] }),
  dStraight: A(CROUCH, { spine: [0.35, -0.3, 0], rSh: [-0.8, 0, -0.3], rEl: [-2.1, 0, 0] }, { hips: [0, 0.1, 0], spine: [0.35, 0.45, 0], rSh: [-1.5, 0, -0.05], rEl: [-0.05, 0, 0] }),
  lowKick: A(CROUCH, { lHip: [-1.0, 0, 0.3], lKnee: [1.8, 0, 0] }, { hipY: -0.38, spine: [0.1, -0.2, 0], lHip: [-1.1, 0, 0.35], lKnee: [0.1, 0, 0] }, { fk: 'l' }),
  shin: A(GUARD, { hips: [0, 0.4, 0], rHip: [-0.4, 0, -0.2], rKnee: [1.2, 0, 0] }, { hips: [0, 0.8, 0], spine: [-0.15, 0.1, 0.2], rHip: [-0.75, 0, -0.55], rKnee: [0.1, 0, 0] }, { fk: 'r' }),
  sweep: A(CROUCH, { hipY: -0.5, hips: [0, -0.6, 0], lHip: [-1.0, 0, 0.3], lKnee: [1.6, 0, 0] }, { hipY: -0.55, spine: [0.55, 0, 0], hips: [0, 0.4, 0], lHip: [-1.45, 0, 0.7], lKnee: [0.05, 0, 0], rHip: [-1.3, 0, -0.2], rKnee: [2.4, 0, 0], lSh: [-0.2, 0, 1.0], rSh: [-0.4, 0, -1.2] }, { fk: 'both', spin: -TAU }),
  ufKnee: A(GUARD, { hipY: -0.2, spine: [0.2, 0, 0], lSh: [-1.6, 0, 0.3], rSh: [-1.6, 0, -0.3] }, { hipY: 0.1, spine: [-0.2, 0, 0], rHip: [-2.1, 0, 0], rKnee: [2.5, 0, 0], lHip: [-0.3, 0, 0.1], lKnee: [1.4, 0, 0], lSh: [-2.6, 0, 0.5], rSh: [-2.4, 0, -0.5], lEl: [-0.8, 0, 0], rEl: [-0.8, 0, 0] }, { fk: 'both' }),
  wsUpper: A(CROUCH, { hipY: -0.35, rSh: [0.2, 0, -0.2], rEl: [-1.6, 0, 0] }, uppercutStrike, { step: 0.08 }),
  wsKick: A(CROUCH, { rHip: [-1.3, 0, -0.1], rKnee: [2.2, 0, 0] }, { hipY: -0.02, spine: [-0.25, 0, 0], rHip: [-1.7, 0, -0.15], rKnee: [0.08, 0, 0], lSh: [-0.7, 0, 0.6], rSh: [-0.6, 0, -0.6] }, { fk: 'r' }),
  dashPunch: A(GUARD, { hipY: -0.15, spine: [0.45, -0.4, 0], rSh: [-0.4, 0, -0.4], rEl: [-2.2, 0, 0] }, { hipY: -0.18, hips: [0, 0.45, 0], spine: [0.45, 0.55, 0], rSh: [-1.65, 0, 0], rEl: [-0.02, 0, 0], lSh: [-0.5, 0, 0.6], lEl: [-1.9, 0, 0] }, { step: 0.35, rear: 0.2 }),
  jPunch: A(AIR, { spine: [-0.2, 0, 0], rSh: [-2.8, 0, -0.2], rEl: [-0.6, 0, 0] }, { spine: [0.45, 0.3, 0], rSh: [-1.2, 0, -0.1], rEl: [-0.1, 0, 0] }, { fk: 'both' }),
  jKick: A(AIR, { lHip: [-1.3, 0, 0.1], lKnee: [1.8, 0, 0] }, { spine: [-0.3, 0, 0], lHip: [-1.3, 0, 0.1], lKnee: [0.05, 0, 0], rHip: [0.2, 0, 0], rKnee: [1.2, 0, 0] }, { fk: 'both' }),
  throw: A(GUARD, { lSh: [-1.35, 0, 0.45], rSh: [-1.35, 0, -0.45], lEl: [-0.4, 0, 0], rEl: [-0.4, 0, 0] }, { spine: [0.25, 0, 0], lSh: [-1.55, 0, 0.12], rSh: [-1.55, 0, -0.12], lEl: [-0.5, 0, 0], rEl: [-0.5, 0, 0] }, { step: 0.15 }),
  throwExec: A(GUARD, { lSh: [-1.5, 0, 0.12], rSh: [-1.5, 0, -0.12], lEl: [-0.6, 0, 0], rEl: [-0.6, 0, 0] }, { hips: [0, -1.1, 0], spine: [0.3, -0.5, 0], lSh: [-1.8, 0, 0.6], rSh: [-1.2, 0, -0.9], lEl: [-0.2, 0, 0], rEl: [-0.3, 0, 0] }),
  // --- specials
  grab: A(GUARD, { spine: [0.1, 0, 0], lSh: [-1.2, 0, 0.7], rSh: [-1.2, 0, -0.7], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0] }, { hipY: -0.12, spine: [0.4, 0, 0], lSh: [-1.55, 0, 0.1], rSh: [-1.55, 0, -0.1], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0] }, { step: 0.2 }),
  grabExec: A(GUARD, { spine: [-0.25, 0, 0], lSh: [-2.8, 0, 0.4], rSh: [-2.8, 0, -0.4], lEl: [-0.4, 0, 0], rEl: [-0.4, 0, 0] }, { hipY: -0.25, spine: [0.6, 0, 0], lSh: [-1.2, 0, 0.3], rSh: [-1.2, 0, -0.3], lEl: [-0.2, 0, 0], rEl: [-0.2, 0, 0] }),
  cast: A(GUARD, { hipY: -0.12, hips: [0, -0.7, 0], spine: [0, -0.3, 0], rSh: [0.4, 0, -0.3], rEl: [-1.6, 0, 0], lSh: [0.3, 0, 0.1], lEl: [-1.7, 0, 0] }, castStrike, { step: 0.12 }),
  charge: A(GUARD, { hipY: -0.2, spine: [0.3, 0, 0] }, { hipY: -0.12, spine: [0.65, -0.35, 0], lSh: [-1.2, 0, 0.1], lEl: [-1.9, 0, 0], rSh: [-0.3, 0, -0.3], rEl: [-1.2, 0, 0] }, { step: 0.2, rear: 0.1 }),
  uppercut: A(GUARD, { hipY: -0.3, spine: [0.3, 0, 0], rSh: [0.2, 0, -0.2], rEl: [-1.6, 0, 0] }, uppercutStrike, { step: 0.1 }),
  counterStance: A(GUARD, { hipY: -0.1 }, { hipY: -0.12, spine: [-0.15, 0.25, 0], lSh: [-1.5, 0, 0.7], lEl: [-1.3, 0, 0], rSh: [-0.2, 0, -0.9], rEl: [-1.0, 0, 0] }),
  counterStrike: A(GUARD, { hipY: -0.15, spine: [-0.1, -0.4, 0] }, { ...castStrike, spine: [0.35, 0.3, 0] }, { step: 0.15 }),
  powerup: A(GUARD, { hipY: -0.2, spine: [0.4, 0, 0], lSh: [-0.5, 0, 0.1], rSh: [-0.5, 0, -0.1], lEl: [-2.2, 0, 0], rEl: [-2.2, 0, 0] }, { hipY: 0, spine: [-0.3, 0, 0], head: [-0.4, 0, 0], lSh: [-0.4, 0, 1.4], rSh: [-0.4, 0, -1.4], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0] }),
  vanish: A(CROUCH, { lSh: [-1.6, 0.6, 0.2], rSh: [-1.6, -0.6, -0.2], lEl: [-1.4, 0, 0], rEl: [-1.4, 0, 0] }, { hipY: -0.1, lSh: [-2.6, 0, 0.6], rSh: [-2.6, 0, -0.6], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0] }),
  stomp: A(GUARD, { hipY: 0, lHip: [-1.6, 0, 0], lKnee: [1.9, 0, 0], lSh: [-2.4, 0, 0.5], rSh: [-2.4, 0, -0.5] }, { hipY: -0.32, spine: [0.55, 0, 0], lHip: [-0.8, 0, 0], lKnee: [0.8, 0, 0], rSh: [-0.9, 0, -0.3], rEl: [-0.1, 0, 0], lSh: [-0.9, 0, 0.3], lEl: [-0.1, 0, 0] }, { fk: 'l' }),
  diveKick: A(AIR, { lHip: [-1.2, 0, 0.1], lKnee: [1.9, 0, 0] }, { spine: [-0.2, 0, 0], lHip: [-0.9, 0, 0.1], lKnee: [0.05, 0, 0], rHip: [-0.8, 0, 0], rKnee: [1.8, 0, 0], lSh: [0.6, 0, 0.5], rSh: [0.6, 0, -0.5], lEl: [-0.4, 0, 0], rEl: [-0.4, 0, 0] }, { fk: 'both' }),
  place: A(CROUCH, { rSh: [-0.6, 0, -0.2], rEl: [-1.4, 0, 0] }, { spine: [0.55, 0, 0], rSh: [-0.95, 0, -0.1], rEl: [-0.25, 0, 0] }),
  beam: A(GUARD, { hipY: -0.12, hips: [0, -0.6, 0], rSh: [0.4, 0, -0.3], rEl: [-1.6, 0, 0], lSh: [0.3, 0, 0.1], lEl: [-1.7, 0, 0] }, { ...castStrike, spine: [0.05, 0.1, 0] }, { step: 0.1 }),
  whip: A(GUARD, { spine: [-0.2, -0.45, 0], rSh: [-2.6, 0, -0.9], rEl: [-0.6, 0, 0] }, { spine: [0.3, 0.45, 0], rSh: [-1.55, 0, -0.1], rEl: [0, 0, 0] }, { step: 0.1 }),
  slamRise: A(AIR, { lSh: [-2.8, 0, 0.4], rSh: [-2.8, 0, -0.4], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0] }, { spine: [0.5, 0, 0], lSh: [-1.3, 0, 0.2], rSh: [-1.3, 0, -0.2], lEl: [-0.2, 0, 0], rEl: [-0.2, 0, 0], lHip: [-1.0, 0, 0.1], lKnee: [1.1, 0, 0] }, { fk: 'both' }),
  summon: A(GUARD, { hipY: -0.15, lSh: [-0.6, 0, 0.3], rSh: [-0.6, 0, -0.3], lEl: [-1.8, 0, 0], rEl: [-1.8, 0, 0] }, { hipY: 0, spine: [-0.25, 0, 0], head: [-0.55, 0, 0], lSh: [-2.8, 0, 0.6], rSh: [-2.8, 0, -0.6], lEl: [-0.2, 0, 0], rEl: [-0.2, 0, 0] }),
  guardUp: A(GUARD, { hipY: -0.1 }, { hipY: -0.14, spine: [0.1, 0, 0], lSh: [-1.5, 0, -0.25], lEl: [-1.0, 0, 0], rSh: [-1.45, 0, 0.25], rEl: [-1.0, 0, 0] }),
  spinKick: A(AIR, { rHip: [-1.2, 0, -0.5], rKnee: [1.5, 0, 0] }, { spine: [-0.1, 0, 0], rHip: [-1.55, 0, -0.95], rKnee: [0.1, 0, 0], lHip: [-0.4, 0, 0], lKnee: [1.2, 0, 0], lSh: [-0.4, 0, 1.3], rSh: [-0.4, 0, -1.3], lEl: [-0.2, 0, 0], rEl: [-0.2, 0, 0] }, { fk: 'both' }),
  flurry: A(GUARD, { lSh: [-1.0, 0, 0.35], lEl: [-2.0, 0, 0] }, jabStrike, { step: 0.08 }),
  ultCombo: A(GUARD, { spine: [0.05, -0.4, 0], rSh: [-0.6, 0, -0.45], rEl: [-2.2, 0, 0] }, crossStrike, { step: 0.12 }),
  taunt: A(GUARD, {}, {}),
};

const FLURRY_ALT = mk(crossStrike, GUARD);
/** Cinematic Rage Art / ultimate: a rapid Tekken-style string. */
const ULT_SEQ: AnimKey[] = ['straight', 'highKick', 'jab', 'uppercut', 'power', 'midKick', 'bHook', 'launcher'];

/** Poses an attack; returns how extended it is (0 = base, 1 = full strike) for footwork. */
function attackPose(out: PoseArr, anim: AttackAnim, f: number, s: number, a: number, r: number): number {
  if (f <= s) {
    const p = s > 0 ? f / s : 1;
    if (p < 0.55) {
      lerpInto(out, anim.base, anim.windup, ease(p / 0.55));
      return 0;
    }
    const q = easeOut((p - 0.55) / 0.45);
    lerpInto(out, anim.windup, anim.strike, q);
    return q;
  }
  if (f <= s + a) {
    out.set(anim.strike);
    return 1;
  }
  // Hold the extension briefly, then retract into stance (Tekken recovery).
  const t = r > 0 ? (f - s - a) / r : 1;
  const q = ease((t - 0.12) / 0.88);
  lerpInto(out, anim.strike, anim.base, q);
  return 1 - q;
}

// ------------------------------------------------------------------ leg IK

const L1 = THIGH_LEN;
const L2 = SHIN_LEN;
const _body = new THREE.Matrix4();
const _inv = new THREE.Matrix4();
const _bodyQ = new THREE.Quaternion();
const _q = new THREE.Quaternion();
const _toe = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _t = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const IDENT = new THREE.Quaternion();

function wrap(a: number): number {
  while (a > Math.PI) a -= TAU;
  while (a < -Math.PI) a += TAU;
  return a;
}

/**
 * Two-bone IK: rotates hip (x, z) and knee (x) so the ankle reaches `target` (root space),
 * blended with the FK pose by `w`, then turns the foot flat on the floor.
 */
function solveLeg(hip: THREE.Object3D, knee: THREE.Object3D, foot: THREE.Object3D, target: THREE.Vector3, w: number, toeYaw: number): void {
  if (w <= 0.001) {
    foot.quaternion.identity();
    return;
  }
  _v.copy(target).applyMatrix4(_inv).sub(hip.position);
  let d = _v.length();
  const maxD = L1 + L2 - 0.002;
  if (d > maxD) {
    _v.multiplyScalar(maxD / d);
    d = maxD;
  } else if (d < 0.2) {
    _v.multiplyScalar(0.2 / Math.max(1e-4, d));
    d = 0.2;
  }
  const ck = Math.max(-1, Math.min(1, (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2)));
  const kk = Math.acos(ck);
  const q = Math.max(0.05, L1 + L2 * ck);
  const cz = Math.asin(Math.max(-1, Math.min(1, _v.x / q)));
  const yy = -q * Math.cos(cz);
  const zz = -L2 * Math.sin(kk);
  const ax = wrap(Math.atan2(_v.z, _v.y) - Math.atan2(zz, yy));
  const r = hip.rotation;
  hip.rotation.set(r.x + wrap(ax - r.x) * w, r.y * (1 - w), r.z + (cz - r.z) * w);
  knee.rotation.set(knee.rotation.x + (kk - knee.rotation.x) * w, 0, 0);
  // Flat foot: undo the accumulated body + leg rotation, then toe out a little.
  _q.copy(_bodyQ).multiply(hip.quaternion).multiply(knee.quaternion).invert();
  _toe.setFromAxisAngle(UP, toeYaw);
  _q.multiply(_toe);
  foot.quaternion.copy(IDENT).slerp(_q, w);
}

// ------------------------------------------------------------------ animator

type SpringParams = [k: number, zeta: number];

export class Animator {
  cur = new Float32Array(GUARD);
  vel = new Float32Array(N);
  target = new Float32Array(N);
  hidden = false;
  /** Leg IK weights (1 = planted feet). */
  ikL = 1;
  ikR = 1;
  private spin = 0;
  /** Roll around the body's long axis (tech rolls, screws). */
  private roll = 0;
  private gaitPhase = 0;
  private gaitW = 0;
  private gaitOff = new Float32Array(6);
  private stepOff = new Float32Array(2);
  private prevState = '';
  private prevFrame = 0;
  private lastHurt = Number.NaN;

  reset(): void {
    this.cur.set(GUARD);
    this.vel.fill(0);
    this.spin = 0;
    this.roll = 0;
    this.gaitW = 0;
    this.ikL = this.ikR = 1;
  }

  /** Current body lean (used to roll camera-facing photo heads when lying down). */
  get pivotX(): number {
    return this.cur[PIVX];
  }

  /** Current sideways head tilt plus spine tilt. */
  get headRoll(): number {
    return this.cur[I.head + Z] + this.cur[I.spine + Z];
  }

  update(f: Fighter, m: Match, dt: number): void {
    const t = this.target;
    const v = this.vel;
    const time = m.ticks / 60;
    let spring: SpringParams = [280, 0.85];
    let ikL = 1;
    let ikR = 1;
    let upright = true;
    let spinTarget = 0;
    let roll: number | null = 0;
    let stride = 0;
    let lift = 0;
    let stepL = 0;
    let stepR = 0;
    this.hidden = false;

    const fresh = f.state !== this.prevState || f.stateFrame < this.prevFrame;

    // Hit impulses: the springs turn these into a snappy, weighty reaction.
    if (Number.isNaN(this.lastHurt)) this.lastHurt = f.lastHurtFrame;
    if (f.lastHurtFrame !== this.lastHurt && f.state !== 'blockstun') {
      this.lastHurt = f.lastHurtFrame;
      const s = f.lastHitHeavy ? 1.6 : 1;
      const side = Math.random() < 0.5 ? -1 : 1;
      if (f.state === 'hitstun' && !f.hitHigh) {
        v[I.spine] += 9 * s;
        v[I.head] += 7 * s;
        v[HIPY] -= 1.2 * s;
      } else {
        v[I.spine] -= 8 * s;
        v[I.chest] -= 4 * s;
        v[I.head] -= 14 * s;
        v[I.spine + Z] += side * 3 * s;
        v[I.head + Z] += side * 5 * s;
      }
    }
    if (f.state === 'blockstun' && fresh) {
      v[I.spine] -= 3;
      v[I.lSh] -= 2;
      v[I.rSh] -= 2;
      v[HIPY] -= 0.5;
    }

    switch (f.state) {
      case 'intro':
        t.set(INTRO);
        t[HIPY] += Math.sin(time * 2) * 0.01;
        spring = [200, 0.9];
        break;
      case 'idle': case 'jumpSquat': case 'land': {
        // Tekken stance bounce.
        const br = Math.sin(time * 3.4 + f.index * 1.3) * 0.5 + 0.5;
        t.set(f.guarding ? BLOCK : GUARD);
        t[HIPY] -= br * 0.024;
        t[I.spine] += br * 0.04;
        t[I.lSh] += br * 0.05;
        t[I.rSh] -= br * 0.03;
        if (f.state !== 'idle') {
          lerpInto(t, t, CROUCH, 0.4);
          spring = [700, 0.8];
        }
        break;
      }
      case 'walkF': case 'walkB':
        t.set(f.guarding ? BLOCK : GUARD);
        stride = 0.26;
        lift = 0.07;
        t[HIPY] -= 0.018 * (0.5 - 0.5 * Math.cos(this.gaitPhase * TAU * 2));
        spring = [320, 0.85];
        break;
      case 'crouch':
        t.set(f.guarding ? CROUCH_BLOCK : CROUCH);
        spring = [520, 0.8];
        break;
      case 'dash':
        t.set(GUARD);
        t[I.spine] += 0.28;
        t[HIPY] -= 0.05;
        stride = 0.42;
        lift = 0.12;
        spring = [520, 0.8];
        break;
      case 'run': {
        t.set(RUN);
        const s = Math.sin(this.gaitPhase * TAU);
        t[I.lSh] += s * 0.7;
        t[I.rSh] -= s * 0.7;
        t[I.hips + Y] += s * 0.15;
        t[HIPY] -= 0.03 * Math.abs(Math.cos(this.gaitPhase * TAU));
        stride = 0.62;
        lift = 0.2;
        spring = [520, 0.8];
        break;
      }
      case 'backdash':
        t.set(GUARD);
        t[I.spine] -= 0.12;
        t[HIPY] -= 0.04;
        stride = 0.4;
        lift = 0.12;
        spring = [520, 0.8];
        break;
      case 'sidestep': case 'sidewalk': {
        lerpInto(t, GUARD, CROUCH, 0.18);
        // Lean into the step (model +X is the fighter's left).
        const lat = f.sideX * Math.sin(f.yaw) - f.sideZ * Math.cos(f.yaw);
        t[I.spine + Z] -= lat * 0.22;
        stride = f.state === 'sidestep' ? 0.38 : 0.3;
        lift = 0.09;
        spring = [520, 0.8];
        break;
      }
      case 'air': case 'fall': {
        const rising = f.vy > 0.12;
        lerpInto(t, rising ? AIR_RISE : AIR, AIR, rising ? 0.15 : 0);
        if (f.state === 'fall') {
          t[I.spine] += 0.2;
          t[I.lSh] -= 0.5;
          t[I.rSh] -= 0.5;
        }
        ikL = ikR = 0;
        spring = [400, 0.8];
        break;
      }
      case 'attack': {
        const mv = f.move;
        if (!mv) {
          t.set(GUARD);
          break;
        }
        spring = [2200, 0.72];
        const anim = ANIMS[mv.anim] ?? ANIMS.jab;
        // Evaluate one frame ahead so the springs land the strike on the impact frame.
        const fr = f.moveFrame + 1;
        const s = mv.startup;
        let w = 0;
        if (mv.anim === 'flurry' && fr > s && fr <= s + mv.active) {
          const alt = Math.floor((fr - s) / 4) % 2 === 1;
          const k = ((fr - s) % 4) / 4;
          lerpInto(t, anim.windup, alt ? FLURRY_ALT : anim.strike, ease(k * 2));
          w = 1;
        } else if (mv.anim === 'slamRise') {
          t.set(f.vy > 0 ? anim.windup : anim.strike);
        } else if (mv.anim === 'throwExec' || mv.anim === 'grabExec') {
          lerpInto(t, anim.windup, anim.strike, ease(fr / 26));
          if (fr > 30) lerpInto(t, anim.strike, GUARD, ease((fr - 30) / 14));
        } else {
          w = attackPose(t, anim, fr, s, mv.active, mv.recovery);
        }
        if (mv.anim === 'spinKick' && fr > s && fr <= s + mv.active) spinTarget = (fr - s) * 0.7;
        if (anim.spin && fr <= s + mv.active) spinTarget = anim.spin * easeOut((fr - 0.35 * s) / (0.65 * s + 1));
        if (mv.anim === 'vanish' && fr >= 5 && fr <= 11) this.hidden = true;
        if (anim.fk === 'l' || anim.fk === 'both') ikL = 0;
        if (anim.fk === 'r' || anim.fk === 'both') ikR = 0;
        stepL = (anim.step ?? 0) * w;
        stepR = (anim.rear ?? 0) * w;
        // Step-in moves travel: keep the feet stepping instead of sliding.
        stride = 0.34;
        lift = 0.05;
        break;
      }
      case 'hitstun': {
        const react = f.hitHigh ? HIT_HIGH : f.isCrouching ? HIT_LOW : HIT_BODY;
        lerpInto(t, react, GUARD, ease(1 - f.stun / 8));
        spring = [700, 0.5];
        break;
      }
      case 'blockstun':
        t.set(f.isCrouching ? CROUCH_BLOCK : BLOCK);
        spring = [900, 0.55];
        break;
      case 'juggle': {
        t.set(JUGGLE);
        // Tip further back as the body falls; flatten out just before landing.
        t[PIVX] = -(0.7 + clamp01((0.1 - f.vy) / 0.2) * 0.8);
        if (f.vy < 0 && f.y < 0.7) lerpInto(t, t, LYING, clamp01((0.7 - f.y) / 0.7) * 0.6);
        ikL = ikR = 0;
        upright = false;
        roll = null;
        spring = [260, 0.7];
        break;
      }
      case 'thrown':
        t.set(THROWN);
        ikL = ikR = 0;
        upright = false;
        spring = [400, 0.8];
        break;
      case 'knockdown': case 'ko':
        t.set(LYING);
        t[I.spine] += Math.sin(time * 2.2) * 0.02;
        ikL = ikR = 0;
        upright = false;
        spring = [220, 0.55];
        break;
      case 'getup': {
        const p = clamp01(f.stateFrame / GETUP_FRAMES);
        if (p < 0.5) lerpInto(t, LYING, CROUCH, ease(p * 2));
        else lerpInto(t, CROUCH, GUARD, ease((p - 0.5) * 2));
        ikL = ikR = clamp01((p - 0.45) * 2);
        upright = p > 0.4;
        spring = [900, 0.85];
        break;
      }
      case 'techroll': {
        const p = clamp01(f.stateFrame / TECHROLL_FRAMES);
        const lat = f.sideX * Math.sin(f.yaw) - f.sideZ * Math.cos(f.yaw);
        const dir = lat >= 0 ? 1 : -1;
        if (p < 0.7) t.set(LYING);
        else lerpInto(t, LYING, CROUCH, ease((p - 0.7) / 0.3));
        roll = dir * TAU * easeOut(p / 0.7);
        ikL = ikR = p > 0.8 ? 1 : 0;
        upright = false;
        spring = [700, 0.8];
        break;
      }
      case 'wallsplat':
        t.set(WALLSPLAT);
        t[I.head + Z] += Math.sin(time * 6) * 0.1;
        ikL = ikR = 0;
        upright = false;
        spring = [420, 0.6];
        break;
      case 'dizzy':
        if (f.crumpled) {
          t.set(CRUMPLE);
          ikL = ikR = 0;
          spring = [160, 0.7];
        } else {
          t.set(DIZZY);
          t[I.head] += Math.sin(time * 7) * 0.35;
          t[I.head + Z] += Math.sin(time * 5) * 0.35;
          t[I.spine + Z] += Math.sin(time * 3.5) * 0.18;
        }
        break;
      case 'victory': {
        const vp = VICTORY[f.victoryVariant % VICTORY.length];
        t.set(vp);
        if (f.victoryVariant % 3 === 1) t[I.rSh] += Math.sin(time * 9) * 0.25;
        if (f.victoryVariant % 3 === 2) t[I.head] += Math.sin(time * 4) * 0.12;
        t[HIPY] += Math.abs(Math.sin(time * 3)) * 0.02;
        ikL = ikR = 0;
        spring = [150, 0.9];
        break;
      }
      case 'cinematic': {
        const c = m.cinematic;
        if (c && c.att === f) {
          const k = Math.floor(f.stateFrame / 11) % ULT_SEQ.length;
          const anim = ANIMS[ULT_SEQ[k]];
          const w = attackPose(t, anim, (f.stateFrame % 11) + 1, 6, 2, 3);
          if (anim.fk === 'l' || anim.fk === 'both') ikL = 0;
          if (anim.fk === 'r' || anim.fk === 'both') ikR = 0;
          stepL = (anim.step ?? 0) * w;
          stepR = (anim.rear ?? 0) * w;
          spring = [2000, 0.7];
        } else {
          const high = Math.floor(f.stateFrame / 11) % 2 === 0;
          t.set(high ? HIT_HIGH : HIT_BODY);
          if (f.stateFrame % 11 === 7) v[I.head] += high ? -12 : 10;
          spring = [800, 0.5];
        }
        break;
      }
    }

    // Keep the gaze on the opponent whatever the torso is doing.
    if (upright) t[I.head + Y] = -(t[I.hips + Y] + t[I.spine + Y] + t[I.chest + Y]) * 0.9;

    // Spin: accumulated whole-body turn for spinning moves (not sprung).
    this.spin = spinTarget !== 0 ? spinTarget : this.spin * 0.8;
    if (roll === null) {
      this.roll = f.spin;
    } else if (roll !== 0) {
      this.roll = roll;
    } else {
      const near = Math.round(this.roll / TAU) * TAU;
      this.roll = near + (this.roll - near) * Math.exp(-dt * 10);
      if (Math.abs(this.roll - near) < 0.01) this.roll = 0;
    }

    // Footwork: planted-foot gait driven by actual ground speed, plus step-ins.
    if (!f.grounded) ikL = ikR = 0;
    const moving = stride > 0 && f.grounded && this.gait(f, dt, stride, lift);
    this.gaitW += ((moving ? 1 : 0) - this.gaitW) * (1 - Math.exp(-dt * 14));
    const kb = 1 - Math.exp(-dt * 22);
    this.stepOff[0] += (stepL - this.stepOff[0]) * kb;
    this.stepOff[1] += (stepR - this.stepOff[1]) * kb;
    const ki = 1 - Math.exp(-dt * 18);
    this.ikL += (ikL - this.ikL) * ki;
    this.ikR += (ikR - this.ikR) * ki;

    // Springs freeze during hitstop (and for everyone but the caster during a super flash).
    const frozen = m.hitstop > 0 || (m.freeze > 0 && m.freezeOwner !== f);
    if (!frozen) this.integrate(dt, spring[0], spring[1]);
    this.prevState = f.state;
    this.prevFrame = f.stateFrame;
  }

  /** Advances the gait phase from ground speed; returns false when standing still. */
  private gait(f: Fighter, dt: number, stride: number, lift: number): boolean {
    const dx = Math.cos(f.yaw);
    const dz = Math.sin(f.yaw);
    const fwd = f.vx * dx + f.vz * dz;
    const lat = f.vx * dz - f.vz * dx;
    const sp = Math.hypot(fwd, lat);
    if (sp < 0.003) return false;
    this.gaitPhase = (this.gaitPhase + (sp * dt * 60) / (2 * stride)) % 1;
    const mx = lat / sp;
    const mz = fwd / sp;
    for (let leg = 0; leg < 2; leg++) {
      const u = (this.gaitPhase + leg * 0.5) % 1;
      let p: number;
      let y = 0;
      if (u < 0.5) {
        // Stance: the foot stays on the ground while the body passes over it.
        p = 0.5 - u * 2;
      } else {
        const s = (u - 0.5) * 2;
        p = -0.5 + ease(s);
        y = Math.sin(Math.PI * s) * lift;
      }
      this.gaitOff[leg * 3] = mx * p * stride;
      this.gaitOff[leg * 3 + 1] = y;
      this.gaitOff[leg * 3 + 2] = mz * p * stride;
    }
    return true;
  }

  private integrate(dt: number, k: number, zeta: number): void {
    const c = 2 * zeta * Math.sqrt(k);
    const cur = this.cur;
    const vel = this.vel;
    const tgt = this.target;
    let rem = Math.min(dt, 0.05);
    while (rem > 1e-6) {
      const h = Math.min(rem, 1 / 120);
      rem -= h;
      for (let i = 0; i < N; i++) {
        vel[i] += (k * (tgt[i] - cur[i]) - c * vel[i]) * h;
        cur[i] += vel[i] * h;
      }
    }
  }

  /** Menu showcase animation (no engine fighter needed). */
  showcase(dt: number, time: number, kind: 'guard' | 'victory' | 'intro', variant = 0, phase = 0): void {
    const t = this.target;
    if (kind === 'victory') {
      t.set(VICTORY[variant % VICTORY.length]);
      if (variant % 3 === 1) t[I.rSh] += Math.sin(time * 9 + phase) * 0.25;
      t[HIPY] += Math.abs(Math.sin(time * 3 + phase)) * 0.02;
      this.ikL = this.ikR = 0;
    } else if (kind === 'intro') {
      t.set(INTRO);
      this.ikL = this.ikR = 1;
    } else {
      const br = Math.sin(time * 3.4 + phase) * 0.5 + 0.5;
      t.set(GUARD);
      t[HIPY] -= br * 0.024;
      t[I.spine] += br * 0.04;
      this.ikL = this.ikR = 1;
    }
    t[I.head + Y] = -(t[I.hips + Y] + t[I.spine + Y] + t[I.chest + Y]) * 0.9;
    this.hidden = false;
    this.spin *= 0.8;
    this.roll = 0;
    this.gaitW = 0;
    this.stepOff.fill(0);
    this.integrate(dt, 200, 0.9);
  }

  apply(rig: Rig): void {
    const c = this.cur;
    const js = [rig.hips, rig.spine, rig.chest, rig.neck, rig.head, rig.lSh, rig.lEl, rig.rSh, rig.rEl, rig.lHip, rig.lKnee, rig.rHip, rig.rKnee];
    for (let i = 0; i < js.length; i++) js[i].rotation.set(c[i * 3], c[i * 3 + 1], c[i * 3 + 2]);
    rig.hips.rotation.y += this.spin;
    rig.pivot.position.y = HIP_H + c[HIPY];
    rig.pivot.rotation.set(c[PIVX], this.roll, c[PIVZ]);

    if (this.ikL <= 0.001 && this.ikR <= 0.001) {
      rig.lFoot.quaternion.identity();
      rig.rFoot.quaternion.identity();
      return;
    }
    rig.pivot.updateMatrix();
    rig.hips.updateMatrix();
    _body.multiplyMatrices(rig.pivot.matrix, rig.hips.matrix);
    _inv.copy(_body).invert();
    _bodyQ.copy(rig.pivot.quaternion).multiply(rig.hips.quaternion);
    const sx = Math.abs(rig.lHip.position.x) + 0.035;
    const g = this.gaitW;
    const o = this.gaitOff;
    _t.set(sx + o[0] * g, ANKLE_H + o[1] * g, 0.19 + o[2] * g + this.stepOff[0]);
    solveLeg(rig.lHip, rig.lKnee, rig.lFoot, _t, this.ikL, 0.1);
    _t.set(-sx + o[3] * g, ANKLE_H + o[4] * g, -0.2 + o[5] * g + this.stepOff[1]);
    solveLeg(rig.rHip, rig.rKnee, rig.rFoot, _t, this.ikR, -0.45);
  }
}

/** Static pose for menus / portraits. */
export function applyStaticPose(rig: Rig, kind: 'guard' | 'stand' | 'victory' | 'intro', variant = 0): void {
  const src = kind === 'guard' ? GUARD : kind === 'stand' ? STAND : kind === 'intro' ? INTRO : VICTORY[variant % VICTORY.length];
  const a = new Animator();
  a.cur.set(src);
  a.ikL = a.ikR = kind === 'guard' ? 1 : 0;
  a.apply(rig);
}
