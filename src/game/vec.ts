// Minimal 2D vector helpers for the ground plane (x, z). Height (y) is handled separately.

export interface V2 {
  x: number;
  z: number;
}

export const v2 = (x = 0, z = 0): V2 => ({ x, z });

export function len(x: number, z: number): number {
  return Math.hypot(x, z);
}

export function norm(x: number, z: number, fallback: V2 = { x: 1, z: 0 }): V2 {
  const l = Math.hypot(x, z);
  return l > 1e-6 ? { x: x / l, z: z / l } : { ...fallback };
}

/** Character's left for a forward direction (model faces +Z with its left on +X). */
export function leftOf(d: V2): V2 {
  return { x: d.z, z: -d.x };
}

export function angleOf(x: number, z: number): number {
  return Math.atan2(z, x);
}

export function wrapAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

/** Turns angle `from` toward `to` by at most `rate` radians. */
export function turnToward(from: number, to: number, rate: number): number {
  const d = wrapAngle(to - from);
  if (Math.abs(d) <= rate) return to;
  return from + Math.sign(d) * rate;
}
