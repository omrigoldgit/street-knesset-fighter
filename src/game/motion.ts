// Motion input detection (quarter circles, dragon punch, double quarter circle).
// Directions are stored relative to facing: 6 = toward the opponent, 4 = away.

import { BUFFER_FRAMES, MOTION_WINDOW } from './constants';
import { ATTACKS, BTN } from './types';

const HISTORY = 48;

export function mirrorDir(dir: number): number {
  switch (dir) {
    case 1: return 3;
    case 3: return 1;
    case 4: return 6;
    case 6: return 4;
    case 7: return 9;
    case 9: return 7;
    default: return dir;
  }
}

export function toRelative(dir: number, facing: number): number {
  return facing >= 0 ? dir : mirrorDir(dir);
}

export const isDown = (d: number) => d === 1 || d === 2 || d === 3;
export const isUp = (d: number) => d === 7 || d === 8 || d === 9;
export const isForward = (d: number) => d === 3 || d === 6 || d === 9;
export const isBack = (d: number) => d === 1 || d === 4 || d === 7;

type Matcher = (d: number) => boolean;

const eq = (n: number): Matcher => (d) => d === n;
const any = (...ns: number[]): Matcher => (d) => ns.includes(d);

/** Motion patterns. Each step is matched in order, oldest first. */
export const MOTIONS = {
  qcf: [any(2, 1), eq(3), any(6, 9)],
  qcb: [any(2, 3), eq(1), any(4, 7)],
  dp: [any(6, 9, 3), eq(2), any(3, 6)],
  dqcf: [any(2, 1), eq(3), any(6, 9), eq(2), eq(3), any(6, 9)],
  dashF: [eq(6), eq(5), eq(6)],
  dashB: [eq(4), eq(5), eq(4)],
} as const;

export type MotionName = keyof typeof MOTIONS;

export class InputHistory {
  /** Relative direction per frame, newest last. */
  dirs: number[] = [];
  /** Pressed button mask per frame, newest last. */
  presses: number[] = [];
  /** Consumed button mask per frame, parallel to presses. */
  consumed: number[] = [];

  push(relDir: number, pressed: number): void {
    this.dirs.push(relDir);
    this.presses.push(pressed);
    this.consumed.push(0);
    if (this.dirs.length > HISTORY) {
      this.dirs.shift();
      this.presses.shift();
      this.consumed.shift();
    }
  }

  clear(): void {
    this.dirs.length = 0;
    this.presses.length = 0;
    this.consumed.length = 0;
  }

  /** Buttons pressed within the buffer window that have not been consumed. */
  buffered(mask: number, window = BUFFER_FRAMES): number {
    let out = 0;
    const n = this.presses.length;
    for (let i = Math.max(0, n - window); i < n; i++) {
      out |= this.presses[i] & ~this.consumed[i] & mask;
    }
    return out;
  }

  /** Marks buffered presses as used so they don't fire twice. */
  consume(mask: number, window = BUFFER_FRAMES): void {
    const n = this.presses.length;
    for (let i = Math.max(0, n - window); i < n; i++) {
      this.consumed[i] |= this.presses[i] & mask;
    }
  }

  /** Two different buttons pressed within `window` frames of each other. */
  pressedTogether(a: number, b: number, window = 3): boolean {
    return (this.buffered(a, window) & a) !== 0 && (this.buffered(b, window) & b) !== 0;
  }

  /** True if the motion finished recently (last step within the last `tail` frames). */
  motion(name: MotionName, window = MOTION_WINDOW, tail = 8): boolean {
    const steps = MOTIONS[name];
    const dirs = this.dirs;
    const n = dirs.length;
    const w = name === 'dqcf' ? window * 2 : window;
    const start = Math.max(0, n - w);
    let idx = steps.length - 1;
    // The final step must happen within the tail.
    let i = n - 1;
    let found = false;
    for (; i >= Math.max(start, n - tail); i--) {
      if (steps[idx](dirs[i])) {
        found = true;
        break;
      }
    }
    if (!found) return false;
    idx--;
    for (i = i - 1; i >= start && idx >= 0; i--) {
      if (steps[idx](dirs[i])) idx--;
    }
    return idx < 0;
  }

  /** Dash detection: tap, release to neutral, tap again, within a short window. */
  dash(forward: boolean): boolean {
    const n = this.dirs.length;
    if (n < 3) return false;
    const target = forward ? 6 : 4;
    // Must be the first frame of the second tap.
    if (this.dirs[n - 1] !== target || this.dirs[n - 2] === target) return false;
    let sawNeutral = false;
    for (let i = n - 2; i >= Math.max(0, n - 14); i--) {
      const d = this.dirs[i];
      if (d === 5) sawNeutral = true;
      else if (d === target && sawNeutral) return true;
      else if (d !== 5) return false;
    }
    return false;
  }
}

export const ATTACK_MASK = ATTACKS;
export const PUNCH_MASK = BTN.LP | BTN.HP;
export const KICK_MASK = BTN.LK | BTN.HK;
