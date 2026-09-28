export const FPS = 60;
export const DT = 1 / FPS;

// Tekken-style grounded physics: short hops, heavy fall.
export const GRAVITY = 0.02;
/**
 * Juggles are the same arcs played in slow motion (Tekken float): launch velocities are scaled
 * by JUGGLE_VY_SCALE and gravity by its square, so heights stay put and airtime grows ~1.7x,
 * leaving time to land follow-up hits.
 */
export const JUGGLE_VY_SCALE = 0.6;
export const JUGGLE_GRAVITY = 0.0125 * JUGGLE_VY_SCALE * JUGGLE_VY_SCALE;
/** A normal whose launch is at least this is a launcher: juggles from the ground, fast recovery on hit. */
export const LAUNCHER = 0.15;

/** Circular arena; its edge acts as a wall (wall splats). */
export const ARENA_RADIUS = 9;
export const PUSH_RADIUS = 0.3;
/** Kept for camera framing; fighters can drift further apart in 3D. */
export const MAX_SEPARATION = 9;

export const BASE_HEALTH = 1000;
export const MAX_METER = 100;
export const ULT_COST = 100;
/** Health fraction below which a fighter enters Rage (Tekken). */
export const RAGE_THRESHOLD = 0.25;

export const ROUND_TIME_DEFAULT = 60;
export const ROUNDS_TO_WIN_DEFAULT = 2;

export const KNOCKDOWN_MIN = 16;
export const KNOCKDOWN_MAX = 70;
export const GETUP_FRAMES = 20;
export const TECHROLL_FRAMES = 18;
export const WALLSPLAT_FRAMES = 38;
export const JUGGLE_LIMIT = 9;
export const THROW_TECH_WINDOW = 14;
export const BUFFER_FRAMES = 8;
export const MOTION_WINDOW = 18;

/** Combo damage scaling per hit already landed in the combo. */
export function comboScale(hitIndex: number): number {
  if (hitIndex <= 1) return 1;
  return Math.max(0.3, 1 - (hitIndex - 1) * 0.1);
}

/** Legacy alias used by older code paths (half-width of the arena along an axis). */
export const STAGE_HALF_WIDTH = ARENA_RADIUS;
