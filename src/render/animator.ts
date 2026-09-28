// Frame-data-driven procedural animation. Every pose is derived from the fighter's engine
// state and move frame, so visuals always line up with hitboxes.

import type { Fighter } from '../game/fighter';
import type { Match } from '../game/match';
import type { AnimKey } from '../game/types';
import { HIP_H, type Rig } from './characterModel';

type V3 = [number, number, number];
const JOINTS = ['hips', 'spine', 'chest', 'neck', 'head', 'lSh', 'lEl', 'rSh', 'rEl', 'lHip', 'lKnee', 'rHip', 'rKnee'] as const;
type Joint = (typeof JOINTS)[number];
const N = JOINTS.length * 3 + 3;
const HIPY = JOINTS.length * 3;
const PIVX = HIPY + 1;
const PIVZ = HIPY + 2;

export type PoseSpec = Partial<Record<Joint, V3>> & { hipY?: number; pivotX?: number; pivotZ?: number };
export type PoseArr = Float32Array;

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

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

// ------------------------------------------------------------------ pose library

const GUARD = mk({
  hipY: -0.05,
  hips: [0, -0.3, 0],
  spine: [0.1, -0.12, 0],
  chest: [0.05, -0.08, 0],
  head: [0, 0.5, 0],
  lSh: [-1.15, 0, 0.3],
  lEl: [-1.75, 0, 0],
  rSh: [-0.75, 0, -0.35],
  rEl: [-2.1, 0, 0],
  lHip: [-0.35, 0.3, 0.05],
  lKnee: [0.45, 0, 0],
  rHip: [0.25, 0.3, -0.06],
  rKnee: [0.38, 0, 0],
});

const STAND = mk({
  hipY: 0,
  lSh: [0.05, 0, 0.12], lEl: [-0.25, 0, 0], rSh: [0.05, 0, -0.12], rEl: [-0.25, 0, 0],
  lHip: [0, 0, 0.04], rHip: [0, 0, -0.04],
});

const CROUCH = mk({
  hipY: -0.4,
  hips: [0, -0.25, 0],
  spine: [0.35, -0.1, 0],
  head: [-0.3, 0.35, 0],
  lHip: [-1.25, 0.25, 0.12],
  lKnee: [2.1, 0, 0],
  rHip: [-0.55, 0.25, -0.15],
  rKnee: [2.2, 0, 0],
}, GUARD);

const AIR = mk({
  hipY: 0,
  hips: [0, 0, 0],
  spine: [0.25, 0, 0],
  head: [-0.2, 0.2, 0],
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

const BLOCK = mk({
  hipY: -0.1,
  spine: [0.2, -0.05, 0],
  head: [0.25, 0.3, 0],
  lSh: [-1.35, 0, 0.05], lEl: [-2.2, 0, 0],
  rSh: [-1.25, 0, -0.05], rEl: [-2.25, 0, 0],
}, GUARD);

const CROUCH_BLOCK = mk({
  lSh: [-1.3, 0, 0.05], lEl: [-2.25, 0, 0],
  rSh: [-1.2, 0, -0.05], rEl: [-2.3, 0, 0],
  head: [0.2, 0.3, 0],
}, CROUCH);

const HIT_HIGH = mk({
  hipY: -0.06,
  spine: [-0.35, 0.25, 0.08],
  chest: [-0.2, 0, 0],
  head: [-0.55, 0.3, 0.12],
  lSh: [-0.4, 0, 0.8], lEl: [-0.8, 0, 0],
  rSh: [-0.3, 0, -0.7], rEl: [-0.7, 0, 0],
}, GUARD);

const HIT_LOW = mk({
  hipY: -0.12,
  spine: [0.6, 0, 0],
  chest: [0.2, 0, 0],
  head: [0.35, 0.2, 0],
  lSh: [-0.6, 0, 0.2], lEl: [-1.9, 0, 0],
  rSh: [-0.5, 0, -0.2], rEl: [-1.9, 0, 0],
  lHip: [-0.5, 0.3, 0.05], lKnee: [0.7, 0, 0],
}, GUARD);

const LYING = mk({
  hipY: -0.8,
  pivotX: -Math.PI / 2,
  hips: [0, 0, 0],
  spine: [0, 0, 0],
  chest: [0, 0, 0],
  head: [0.25, 0.3, 0],
  lSh: [-0.2, 0, 1.3], lEl: [-0.4, 0, 0],
  rSh: [-0.3, 0, -1.2], rEl: [-0.6, 0, 0],
  lHip: [-0.35, 0, 0.12], lKnee: [0.6, 0, 0],
  rHip: [-0.1, 0, -0.1], rKnee: [0.2, 0, 0],
});

const JUGGLE = mk({
  hipY: 0,
  pivotX: -0.9,
  spine: [-0.2, 0, 0],
  head: [-0.4, 0, 0],
  lSh: [-2.0, 0, 1.0], lEl: [-0.5, 0, 0],
  rSh: [-1.8, 0, -1.0], rEl: [-0.5, 0, 0],
  lHip: [-0.9, 0, 0.1], lKnee: [1.2, 0, 0],
  rHip: [-0.4, 0, -0.1], rKnee: [0.8, 0, 0],
});

const VICTORY = [
  mk({ hipY: 0, head: [-0.35, 0, 0], spine: [-0.1, 0, 0], lSh: [-2.9, 0, 0.35], lEl: [-0.2, 0, 0], rSh: [-2.9, 0, -0.35], rEl: [-0.2, 0, 0], lHip: [0, 0, 0.12], rHip: [0, 0, -0.12], lKnee: [0, 0, 0], rKnee: [0, 0, 0] }, STAND),
  mk({ hipY: 0, head: [-0.2, 0, 0], rSh: [-2.8, 0, -0.1], rEl: [-0.5, 0, 0], lSh: [0.35, 0, 0.55], lEl: [-2.0, 0, 0], lHip: [0, 0, 0.1], rHip: [0, 0, -0.1] }, STAND),
  mk({ hipY: 0, spine: [-0.15, 0, 0], head: [-0.2, 0, 0], lSh: [0.35, 0, 0.6], lEl: [-2.0, 0, 0], rSh: [0.35, 0, -0.6], rEl: [-2.0, 0, 0], lHip: [0, 0, 0.14], rHip: [0, 0, -0.14] }, STAND),
];

const INTRO = mk({
  hipY: 0,
  rSh: [-1.55, 0, -0.1], rEl: [-0.05, 0, 0],
  lSh: [0.35, 0, 0.6], lEl: [-2.0, 0, 0],
  head: [0, 0, 0],
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

interface AttackAnim {
  base?: PoseArr;
  windup: PoseArr;
  strike: PoseArr;
}

const A = (base: PoseArr, windup: PoseSpec, strike: PoseSpec): AttackAnim => ({ base, windup: mk(windup, base), strike: mk(strike, base) });

const jabStrike: PoseSpec = { spine: [0.15, -0.5, 0], lSh: [-1.57, 0, 0.05], lEl: [-0.05, 0, 0], rSh: [-0.8, 0, -0.3], rEl: [-2.1, 0, 0], lHip: [-0.5, 0.3, 0.05] };
const crossStrike: PoseSpec = { hips: [0, 0.25, 0], spine: [0.22, 0.45, 0], rSh: [-1.6, 0, -0.05], rEl: [-0.05, 0, 0], lSh: [-0.9, 0, 0.4], lEl: [-2.0, 0, 0], rHip: [0.45, 0.3, -0.05], rKnee: [0.2, 0, 0] };
const uppercutStrike: PoseSpec = { hipY: -0.02, spine: [-0.25, 0.5, 0], rSh: [-3.0, 0, -0.15], rEl: [-0.15, 0, 0], lSh: [-0.3, 0, 0.5], lEl: [-1.2, 0, 0], lHip: [-1.3, 0, 0.1], lKnee: [1.5, 0, 0], rHip: [0.15, 0, 0], rKnee: [0.2, 0, 0] };
const castStrike: PoseSpec = { hipY: -0.1, hips: [0, 0.1, 0], spine: [0.12, 0.25, 0], lSh: [-1.55, -0.2, -0.1], lEl: [-0.1, 0, 0], rSh: [-1.55, 0.2, 0.1], rEl: [-0.1, 0, 0], lHip: [-0.6, 0.2, 0.05], lKnee: [0.6, 0, 0] };
const roundhouseStrike: PoseSpec = { hips: [0, 0.9, 0], spine: [-0.35, 0.3, 0.4], rHip: [-1.6, 0, -0.75], rKnee: [0.1, 0, 0], lHip: [0.1, 0.4, 0], lKnee: [0.25, 0, 0], lSh: [-0.5, 0, 0.9], rSh: [-0.3, 0, -0.6] };

const ANIMS: Record<AnimKey, AttackAnim> = {
  jab: A(GUARD, { lSh: [-1.0, 0, 0.35], lEl: [-2.0, 0, 0] }, jabStrike),
  strong: A(GUARD, { spine: [0.05, -0.4, 0], rSh: [-0.6, 0, -0.45], rEl: [-2.2, 0, 0] }, crossStrike),
  short: A(GUARD, { lHip: [-0.9, 0.3, 0.05], lKnee: [1.6, 0, 0] }, { lHip: [-1.15, 0.3, 0.05], lKnee: [0.1, 0, 0], spine: [-0.15, -0.1, 0] }),
  roundhouse: A(GUARD, { rHip: [-0.8, 0, -0.3], rKnee: [1.8, 0, 0], hips: [0, 0.5, 0], spine: [-0.1, 0.2, 0] }, roundhouseStrike),
  cJab: A(CROUCH, { lSh: [-1.0, 0, 0.35], lEl: [-2.0, 0, 0] }, { lSh: [-1.5, 0, 0.05], lEl: [-0.05, 0, 0], spine: [0.3, -0.4, 0] }),
  cStrong: A(CROUCH, { rSh: [-0.3, 0, -0.2], rEl: [-1.8, 0, 0] }, { ...uppercutStrike, hipY: -0.12 }),
  cShort: A(CROUCH, { lHip: [-1.2, 0.25, 0.1], lKnee: [1.8, 0, 0] }, { hipY: -0.46, lHip: [-1.45, 0.25, 0.1], lKnee: [0.1, 0, 0] }),
  sweep: A(CROUCH, { hipY: -0.45, lHip: [-1.0, 0, 0.3], lKnee: [1.6, 0, 0] }, { hipY: -0.52, spine: [0.5, 0, 0], hips: [0, 0.5, 0], lHip: [-1.5, 0, 0.6], lKnee: [0.05, 0, 0], rHip: [-1.2, 0, -0.2], rKnee: [2.3, 0, 0], lSh: [-0.2, 0, 1.0], rSh: [-0.4, 0, -1.2] }),
  jJab: A(AIR, { lSh: [-1.0, 0, 0.35], lEl: [-2.0, 0, 0] }, { lSh: [-1.35, 0, 0.1], lEl: [-0.1, 0, 0] }),
  jStrong: A(AIR, { rSh: [-3.0, 0, -0.2], rEl: [-0.5, 0, 0], spine: [-0.2, 0, 0] }, { rSh: [-1.1, 0, -0.1], rEl: [-0.1, 0, 0], spine: [0.45, 0, 0] }),
  jShort: A(AIR, { lHip: [-1.2, 0, 0], lKnee: [2.0, 0, 0] }, { lHip: [-1.7, 0, 0], lKnee: [2.3, 0, 0], rHip: [-0.3, 0, 0], rKnee: [0.6, 0, 0] }),
  jRoundhouse: A(AIR, { lHip: [-1.3, 0, 0.1], lKnee: [1.8, 0, 0] }, { lHip: [-1.3, 0, 0.1], lKnee: [0.05, 0, 0], rHip: [0.2, 0, 0], rKnee: [1.2, 0, 0], spine: [-0.3, 0, 0] }),
  overhead: A(GUARD, { spine: [-0.3, 0, 0], rSh: [-3.0, 0, -0.2], lSh: [-3.0, 0, 0.2], rEl: [-0.6, 0, 0], lEl: [-0.6, 0, 0] }, { hipY: -0.14, spine: [0.55, 0, 0], rSh: [-1.3, 0, -0.1], lSh: [-1.3, 0, 0.1], rEl: [-0.2, 0, 0], lEl: [-0.2, 0, 0] }),
  throw: A(GUARD, { lSh: [-1.35, 0, 0.4], rSh: [-1.35, 0, -0.4], lEl: [-0.4, 0, 0], rEl: [-0.4, 0, 0] }, { spine: [0.2, 0, 0], lSh: [-1.5, 0, 0.12], rSh: [-1.5, 0, -0.12], lEl: [-0.6, 0, 0], rEl: [-0.6, 0, 0] }),
  throwExec: A(GUARD, { lSh: [-1.5, 0, 0.12], rSh: [-1.5, 0, -0.12], lEl: [-0.6, 0, 0], rEl: [-0.6, 0, 0] }, { hips: [0, -1.1, 0], spine: [0.3, -0.5, 0], lSh: [-1.8, 0, 0.6], rSh: [-1.2, 0, -0.9], lEl: [-0.2, 0, 0], rEl: [-0.3, 0, 0] }),
  grab: A(GUARD, { spine: [0.1, 0, 0], lSh: [-1.2, 0, 0.7], rSh: [-1.2, 0, -0.7], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0] }, { spine: [0.4, 0, 0], lSh: [-1.55, 0, 0.1], rSh: [-1.55, 0, -0.1], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0], hipY: -0.12 }),
  grabExec: A(GUARD, { lSh: [-2.8, 0, 0.4], rSh: [-2.8, 0, -0.4], lEl: [-0.4, 0, 0], rEl: [-0.4, 0, 0], spine: [-0.25, 0, 0] }, { hipY: -0.25, spine: [0.6, 0, 0], lSh: [-1.2, 0, 0.3], rSh: [-1.2, 0, -0.3], lEl: [-0.2, 0, 0], rEl: [-0.2, 0, 0] }),
  cast: A(GUARD, { hipY: -0.12, hips: [0, -0.7, 0], spine: [0, -0.3, 0], rSh: [0.4, 0, -0.3], rEl: [-1.6, 0, 0], lSh: [0.3, 0, 0.1], lEl: [-1.7, 0, 0] }, castStrike),
  charge: A(GUARD, { hipY: -0.2, spine: [0.3, 0, 0] }, { hipY: -0.12, spine: [0.65, -0.35, 0], lSh: [-1.2, 0, 0.1], lEl: [-1.9, 0, 0], rSh: [-0.3, 0, -0.3], rEl: [-1.2, 0, 0], lHip: [-0.95, 0.3, 0.05], lKnee: [0.8, 0, 0], rHip: [0.55, 0.3, 0], rKnee: [0.3, 0, 0] }),
  uppercut: A(GUARD, { hipY: -0.3, rSh: [0.2, 0, -0.2], rEl: [-1.6, 0, 0], spine: [0.3, 0, 0] }, uppercutStrike),
  counterStance: A(GUARD, { hipY: -0.1 }, { hipY: -0.12, spine: [-0.15, 0.25, 0], lSh: [-1.5, 0, 0.7], lEl: [-1.3, 0, 0], rSh: [-0.2, 0, -0.9], rEl: [-1.0, 0, 0] }),
  counterStrike: A(GUARD, { hipY: -0.15, spine: [-0.1, -0.4, 0] }, { ...castStrike, spine: [0.35, 0.3, 0] }),
  powerup: A(GUARD, { hipY: -0.2, spine: [0.4, 0, 0], lSh: [-0.5, 0, 0.1], rSh: [-0.5, 0, -0.1], lEl: [-2.2, 0, 0], rEl: [-2.2, 0, 0] }, { hipY: 0, spine: [-0.3, 0, 0], head: [-0.4, 0, 0], lSh: [-0.4, 0, 1.4], rSh: [-0.4, 0, -1.4], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0], lHip: [0, 0, 0.12], lKnee: [0, 0, 0], rHip: [0, 0, -0.12], rKnee: [0, 0, 0] }),
  vanish: A(CROUCH, { lSh: [-1.6, 0.6, 0.2], rSh: [-1.6, -0.6, -0.2], lEl: [-1.4, 0, 0], rEl: [-1.4, 0, 0] }, { hipY: -0.1, lSh: [-2.6, 0, 0.6], rSh: [-2.6, 0, -0.6], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0] }),
  stomp: A(GUARD, { hipY: 0, lHip: [-1.6, 0, 0], lKnee: [1.9, 0, 0], lSh: [-2.4, 0, 0.5], rSh: [-2.4, 0, -0.5] }, { hipY: -0.32, spine: [0.55, 0, 0], lHip: [-0.8, 0, 0], lKnee: [0.8, 0, 0], rSh: [-0.9, 0, -0.3], rEl: [-0.1, 0, 0], lSh: [-0.9, 0, 0.3], lEl: [-0.1, 0, 0] }),
  diveKick: A(AIR, { lHip: [-1.2, 0, 0.1], lKnee: [1.9, 0, 0] }, { spine: [-0.2, 0, 0], lHip: [-0.9, 0, 0.1], lKnee: [0.05, 0, 0], rHip: [-0.8, 0, 0], rKnee: [1.8, 0, 0], lSh: [0.6, 0, 0.5], rSh: [0.6, 0, -0.5], lEl: [-0.4, 0, 0], rEl: [-0.4, 0, 0] }),
  place: A(CROUCH, { rSh: [-0.6, 0, -0.2], rEl: [-1.4, 0, 0] }, { spine: [0.55, 0, 0], rSh: [-0.95, 0, -0.1], rEl: [-0.25, 0, 0] }),
  beam: A(GUARD, { hipY: -0.12, hips: [0, -0.6, 0], rSh: [0.4, 0, -0.3], rEl: [-1.6, 0, 0], lSh: [0.3, 0, 0.1], lEl: [-1.7, 0, 0] }, { ...castStrike, spine: [0.05, 0.1, 0] }),
  whip: A(GUARD, { spine: [-0.2, -0.45, 0], rSh: [-2.6, 0, -0.9], rEl: [-0.6, 0, 0] }, { spine: [0.3, 0.45, 0], rSh: [-1.55, 0, -0.1], rEl: [0, 0, 0] }),
  slamRise: A(AIR, { lSh: [-2.8, 0, 0.4], rSh: [-2.8, 0, -0.4], lEl: [-0.3, 0, 0], rEl: [-0.3, 0, 0] }, { spine: [0.5, 0, 0], lSh: [-1.3, 0, 0.2], rSh: [-1.3, 0, -0.2], lEl: [-0.2, 0, 0], rEl: [-0.2, 0, 0], lHip: [-1.0, 0, 0.1], lKnee: [1.1, 0, 0] }),
  summon: A(GUARD, { hipY: -0.15, lSh: [-0.6, 0, 0.3], rSh: [-0.6, 0, -0.3], lEl: [-1.8, 0, 0], rEl: [-1.8, 0, 0] }, { hipY: 0, spine: [-0.25, 0, 0], head: [-0.55, 0, 0], lSh: [-2.8, 0, 0.6], rSh: [-2.8, 0, -0.6], lEl: [-0.2, 0, 0], rEl: [-0.2, 0, 0], lHip: [0, 0, 0.1], lKnee: [0.05, 0, 0], rHip: [0, 0, -0.1], rKnee: [0.05, 0, 0] }),
  guardUp: A(GUARD, { hipY: -0.1 }, { hipY: -0.14, spine: [0.1, 0, 0], lSh: [-1.5, 0, -0.25], lEl: [-1.0, 0, 0], rSh: [-1.45, 0, 0.25], rEl: [-1.0, 0, 0] }),
  spinKick: A(AIR, { rHip: [-1.2, 0, -0.5], rKnee: [1.5, 0, 0] }, { spine: [-0.1, 0, 0], rHip: [-1.55, 0, -0.95], rKnee: [0.1, 0, 0], lHip: [-0.4, 0, 0], lKnee: [1.2, 0, 0], lSh: [-0.4, 0, 1.3], rSh: [-0.4, 0, -1.3], lEl: [-0.2, 0, 0], rEl: [-0.2, 0, 0] }),
  flurry: A(GUARD, { lSh: [-1.0, 0, 0.35], lEl: [-2.0, 0, 0] }, jabStrike),
  ultCombo: A(GUARD, { spine: [0.05, -0.4, 0], rSh: [-0.6, 0, -0.45], rEl: [-2.2, 0, 0] }, crossStrike),
  taunt: A(GUARD, {}, {}),
};

const FLURRY_ALT = mk(crossStrike, GUARD);
const ULT_SEQ: AnimKey[] = ['strong', 'roundhouse', 'jab', 'uppercut', 'strong', 'short', 'roundhouse', 'uppercut'];

// ------------------------------------------------------------------ evaluation

const scratchA = new Float32Array(N);
const scratchB = new Float32Array(N);

function attackPose(out: PoseArr, anim: AttackAnim, f: number, s: number, a: number, r: number): PoseArr {
  const base = anim.base ?? GUARD;
  if (f <= s) {
    const p = s > 0 ? f / s : 1;
    if (p < 0.6) return lerpInto(out, base, anim.windup, ease(p / 0.6));
    return lerpInto(out, anim.windup, anim.strike, ease((p - 0.6) / 0.4));
  }
  if (f <= s + a) return lerpInto(out, anim.strike, anim.strike, 0);
  const t = r > 0 ? (f - s - a) / r : 1;
  return lerpInto(out, anim.strike, base, ease(t));
}

export class Animator {
  cur = new Float32Array(GUARD);
  target = new Float32Array(N);
  private spin = 0;
  hidden = false;

  reset(): void {
    this.cur.set(GUARD);
    this.spin = 0;
  }

  update(f: Fighter, m: Match, dt: number): void {
    const t = this.target;
    const time = m.ticks / 60;
    let rate = 18;
    this.hidden = false;
    let spinTarget = 0;

    switch (f.state) {
      case 'intro':
        lerpInto(t, INTRO, INTRO, 0);
        t[HIPY] += Math.sin(time * 2) * 0.01;
        break;
      case 'idle': case 'jumpSquat': case 'land': {
        const breathe = Math.sin(time * 2.6 + f.index) * 0.5 + 0.5;
        lerpInto(t, GUARD, GUARD, 0);
        t[HIPY] += -breathe * 0.02;
        t[3] += breathe * 0.05;
        if (f.state === 'jumpSquat' || f.state === 'land') lerpInto(t, t, CROUCH, 0.45);
        break;
      }
      case 'walkF': case 'walkB': {
        if (f.guarding) {
          lerpInto(t, BLOCK, BLOCK, 0);
          break;
        }
        lerpInto(t, GUARD, GUARD, 0);
        const ph = f.stateFrame * 0.2 * (f.state === 'walkB' ? -1 : 1);
        const s = Math.sin(ph);
        const c = Math.cos(ph);
        t[27] += s * 0.4; // lHip x
        t[33] -= s * 0.4; // rHip x
        t[30] += Math.max(0, c) * 0.55; // lKnee
        t[36] += Math.max(0, -c) * 0.55; // rKnee
        t[HIPY] += Math.abs(s) * 0.025 - 0.02;
        break;
      }
      case 'crouch':
        lerpInto(t, f.guarding ? CROUCH_BLOCK : CROUCH, CROUCH, 0);
        break;
      case 'dash': {
        lerpInto(t, GUARD, GUARD, 0);
        t[3] += f.dashDir > 0 ? 0.3 : -0.25;
        const ph = f.stateFrame * 0.35;
        t[27] += Math.sin(ph) * 0.5;
        t[33] -= Math.sin(ph) * 0.5;
        break;
      }
      case 'sidestep':
        lerpInto(t, GUARD, CROUCH, 0.35);
        t[5] += f.sidestepDir * 0.2;
        break;
      case 'air': case 'fall': {
        const rising = f.vy > 0.12;
        lerpInto(t, rising ? AIR_RISE : AIR, AIR, rising ? 0.15 : 0);
        if (f.state === 'fall') {
          t[3] += 0.2;
          t[15] -= 0.5;
          t[21] -= 0.5;
        }
        break;
      }
      case 'attack': {
        const mv = f.move;
        if (!mv) {
          lerpInto(t, GUARD, GUARD, 0);
          break;
        }
        rate = 32;
        const anim = ANIMS[mv.anim] ?? ANIMS.jab;
        const fr = f.moveFrame;
        if (mv.anim === 'flurry' && fr > mv.startup && fr <= mv.startup + mv.active) {
          const alt = Math.floor((fr - mv.startup) / 4) % 2 === 1;
          const w = ((fr - mv.startup) % 4) / 4;
          lerpInto(t, anim.windup, alt ? FLURRY_ALT : anim.strike, ease(w * 2));
        } else if (mv.anim === 'slamRise') {
          lerpInto(t, f.vy > 0 ? anim.windup : anim.strike, anim.strike, 0);
        } else if (mv.anim === 'spinKick') {
          attackPose(t, anim, fr, mv.startup, mv.active, mv.recovery);
          if (fr > mv.startup && fr <= mv.startup + mv.active) spinTarget = (fr - mv.startup) * 0.7;
        } else if (mv.anim === 'charge' && mv.kind === 'super') {
          attackPose(t, anim, fr, mv.startup, mv.active, mv.recovery);
        } else if (mv.anim === 'throwExec' || mv.anim === 'grabExec') {
          const p = clamp01(fr / 26);
          lerpInto(t, anim.windup, anim.strike, ease(p));
          if (fr > 30) lerpInto(t, anim.strike, GUARD, ease((fr - 30) / 14));
        } else if (mv.anim === 'vanish') {
          attackPose(t, anim, fr, mv.startup, mv.active, mv.recovery);
          if (fr >= 5 && fr <= 11) this.hidden = true;
        } else {
          attackPose(t, anim, fr, mv.startup, mv.active, mv.recovery);
        }
        break;
      }
      case 'hitstun': {
        const src = f.hitHigh ? HIT_HIGH : HIT_LOW;
        const p = clamp01(f.stateFrame / 6);
        lerpInto(t, GUARD, src, p < 1 ? ease(p) : 1);
        rate = 40;
        break;
      }
      case 'blockstun':
        lerpInto(t, f.relDir === 1 ? CROUCH_BLOCK : BLOCK, BLOCK, 0);
        rate = 40;
        break;
      case 'juggle': case 'thrown': {
        const src = f.state === 'thrown' ? THROWN : JUGGLE;
        lerpInto(t, src, src, 0);
        if (f.state === 'juggle') {
          const tilt = Math.min(1.3, 0.9 + f.stateFrame * 0.02);
          t[PIVX] = -tilt;
          if (f.vy < 0 && f.y < 0.8) lerpInto(t, t, LYING, clamp01((0.8 - f.y) / 0.8) * 0.7);
        }
        rate = 22;
        break;
      }
      case 'knockdown': case 'ko':
        lerpInto(t, LYING, LYING, 0);
        rate = 14;
        break;
      case 'getup': {
        const p = clamp01(f.stateFrame / 20);
        if (p < 0.5) lerpInto(t, LYING, CROUCH, ease(p * 2));
        else lerpInto(t, CROUCH, GUARD, ease((p - 0.5) * 2));
        rate = 30;
        break;
      }
      case 'dizzy':
        lerpInto(t, DIZZY, DIZZY, 0);
        t[12] += Math.sin(time * 7) * 0.35; // head x
        t[14] += Math.sin(time * 5) * 0.35; // head z
        t[5] += Math.sin(time * 3.5) * 0.18; // spine z
        break;
      case 'victory': {
        const v = VICTORY[f.victoryVariant % VICTORY.length];
        lerpInto(t, v, v, 0);
        if (f.victoryVariant % 3 === 1) t[21] += Math.sin(time * 9) * 0.25;
        if (f.victoryVariant % 3 === 2) t[12] += Math.sin(time * 4) * 0.12;
        t[HIPY] += Math.abs(Math.sin(time * 3)) * 0.02;
        rate = 10;
        break;
      }
      case 'cinematic': {
        const c = m.cinematic;
        if (c && c.att === f) {
          const k = Math.floor(f.stateFrame / 11) % ULT_SEQ.length;
          const anim = ANIMS[ULT_SEQ[k]];
          const within = f.stateFrame % 11;
          attackPose(t, anim, within, 6, 2, 3);
          rate = 40;
        } else {
          const high = Math.floor(f.stateFrame / 11) % 2 === 0;
          lerpInto(t, high ? HIT_HIGH : HIT_LOW, HIT_HIGH, 0);
          rate = 30;
        }
        break;
      }
    }

    this.spin = spinTarget > 0 ? spinTarget : this.spin * 0.8;
    const k = 1 - Math.exp(-dt * rate);
    lerpInto(this.cur, this.cur, t, k);
  }

  /** Menu showcase animation (no engine fighter needed). */
  showcase(dt: number, time: number, kind: 'guard' | 'victory' | 'intro', variant = 0, phase = 0): void {
    const t = this.target;
    if (kind === 'victory') {
      const v = VICTORY[variant % VICTORY.length];
      lerpInto(t, v, v, 0);
      if (variant % 3 === 1) t[21] += Math.sin(time * 9 + phase) * 0.25;
      t[HIPY] += Math.abs(Math.sin(time * 3 + phase)) * 0.02;
    } else if (kind === 'intro') {
      lerpInto(t, INTRO, INTRO, 0);
    } else {
      const breathe = Math.sin(time * 2.6 + phase) * 0.5 + 0.5;
      lerpInto(t, GUARD, GUARD, 0);
      t[HIPY] += -breathe * 0.02;
      t[3] += breathe * 0.05;
    }
    this.hidden = false;
    this.spin *= 0.8;
    lerpInto(this.cur, this.cur, t, 1 - Math.exp(-dt * 10));
  }

  apply(rig: Rig): void {
    const c = this.cur;
    const js = [rig.hips, rig.spine, rig.chest, rig.neck, rig.head, rig.lSh, rig.lEl, rig.rSh, rig.rEl, rig.lHip, rig.lKnee, rig.rHip, rig.rKnee];
    for (let i = 0; i < js.length; i++) js[i].rotation.set(c[i * 3], c[i * 3 + 1], c[i * 3 + 2]);
    rig.hips.rotation.y += this.spin;
    rig.pivot.position.y = HIP_H + c[HIPY];
    rig.pivot.rotation.x = c[PIVX];
    rig.pivot.rotation.z = c[PIVZ];
  }
}

/** Static pose for menus / portraits. */
export function applyStaticPose(rig: Rig, kind: 'guard' | 'stand' | 'victory' | 'intro', variant = 0): void {
  const src = kind === 'guard' ? GUARD : kind === 'stand' ? STAND : kind === 'intro' ? INTRO : VICTORY[variant % VICTORY.length];
  const a = new Animator();
  a.cur.set(src);
  a.apply(rig);
}

export { scratchA, scratchB };
