export const FPS = 60;
export const DT = 1 / FPS;

export const GRAVITY = 0.017;
export const STAGE_HALF_WIDTH = 10.5;
export const MAX_SEPARATION = 7.6;
export const PUSH_WIDTH = 0.62;

export const BASE_HEALTH = 1000;
export const MAX_METER = 100;
export const ULT_COST = 100;

export const ROUND_TIME_DEFAULT = 99;
export const ROUNDS_TO_WIN_DEFAULT = 2;

export const KNOCKDOWN_FRAMES = 42;
export const GETUP_FRAMES = 22;
export const JUGGLE_LIMIT = 5;
export const THROW_TECH_WINDOW = 8;
export const BUFFER_FRAMES = 6;
export const MOTION_WINDOW = 18;

/** Combo damage scaling per hit already landed in the combo. */
export function comboScale(hitIndex: number): number {
  if (hitIndex <= 1) return 1;
  return Math.max(0.3, 1 - (hitIndex - 1) * 0.12);
}
