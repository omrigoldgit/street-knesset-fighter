// CPU opponents. The AI drives a virtual controller, so it plays by the same rules as humans.

import type { Fighter } from './fighter';
import type { DummyMode, Match } from './match';
import { BTN, NO_INPUT, type PlayerInput } from './types';

interface Level {
  reaction: number;
  block: number;
  aggression: number;
  combo: number;
  antiAir: number;
  tech: number;
  interval: number;
}

export const DIFFICULTY_NAMES = ['Backbencher', 'Committee Member', 'Minister', 'Prime Minister', 'Supreme Court'];

const LEVELS: Level[] = [
  { reaction: 30, block: 0.12, aggression: 0.3, combo: 0.1, antiAir: 0.1, tech: 0.0, interval: 26 },
  { reaction: 20, block: 0.35, aggression: 0.45, combo: 0.35, antiAir: 0.3, tech: 0.2, interval: 18 },
  { reaction: 13, block: 0.6, aggression: 0.55, combo: 0.6, antiAir: 0.55, tech: 0.4, interval: 12 },
  { reaction: 8, block: 0.8, aggression: 0.65, combo: 0.85, antiAir: 0.8, tech: 0.6, interval: 8 },
  { reaction: 4, block: 0.93, aggression: 0.75, combo: 1.0, antiAir: 0.95, tech: 0.8, interval: 5 },
];

type Frame = PlayerInput;

const ZONING = new Set(['projectile', 'beam', 'wave', 'rain', 'trap']);
const APPROACH = new Set(['rush', 'dive', 'slam', 'teleport', 'spin', 'pull']);
const CLOSE = new Set(['grab', 'barrage']);
const DEFENSIVE = new Set(['rising', 'counter']);
const SELF = new Set(['buff', 'heal', 'shield']);

export class CpuController {
  private lv: Level;
  private plan: Frame[] = [];
  private seed: number;
  private threatTimer = 0;
  private decidedThreat = false;
  private lastMoveKey = '';
  private techTried = false;
  private idle = 0;

  constructor(level: number, seed = 1234) {
    this.lv = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, level))];
    this.seed = seed;
  }

  private rand(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  reset(): void {
    this.plan = [];
    this.threatTimer = 0;
  }

  next(me: Fighter, m: Match): PlayerInput {
    if (m.phase !== 'fight') {
      this.plan = [];
      return NO_INPUT;
    }
    const opp = me.opponent!;
    const f = me.facing;
    const FWD = f > 0 ? 6 : 4;
    const BACK = f > 0 ? 4 : 6;
    const DBACK = f > 0 ? 1 : 3;
    const UFWD = f > 0 ? 9 : 7;
    const dist = Math.abs(opp.x - me.x);

    // Throw tech.
    if (me.state === 'thrown') {
      if (!this.techTried && me.stateFrame >= 2) {
        this.techTried = true;
        if (this.rand() < this.lv.tech) return { dir: 5, held: BTN.TH, pressed: BTN.TH };
      }
      return NO_INPUT;
    }
    this.techTried = false;

    // Hit confirm into a special or ultimate.
    if (me.state === 'attack' && me.move && me.moveConnected) {
      const key = `${me.move.id}:${m.frame - me.moveFrame}`;
      if (key !== this.lastMoveKey) {
        this.lastMoveKey = key;
        if (me.move.kind === 'normal' && me.move.cancel && this.rand() < this.lv.combo) {
          this.plan = [];
          if (me.meter >= 100 && this.ultInRange(me, dist) && this.rand() < 0.6) return this.press(BTN.UL, 5);
          const idx = this.pickSpecial(me, dist, ['rush', 'rising', 'barrage', 'spin', 'projectile', 'beam', 'pull', 'grab']);
          if (idx >= 0) return this.press(BTN.SP, idx === 2 ? 2 : idx === 1 ? FWD : 5);
        }
      }
    }

    if (this.plan.length) {
      const fr = this.plan.shift()!;
      // Abort offensive plans if we got hit.
      if (me.state === 'hitstun' || me.state === 'juggle' || me.state === 'knockdown') this.plan = [];
      return fr;
    }

    const canAct = me.actionable || me.state === 'blockstun';
    if (!canAct && me.state !== 'air') return NO_INPUT;

    // Defence.
    const threatened = m.isThreatened(me);
    if (threatened) this.threatTimer++;
    else {
      this.threatTimer = 0;
      this.decidedThreat = false;
    }
    if (threatened && this.threatTimer >= this.lv.reaction && !this.decidedThreat && me.grounded) {
      this.decidedThreat = true;
      if (this.rand() < this.lv.block) {
        const guard = opp.move?.hit?.guard;
        const low = guard === 'low' || (opp.isCrouching && guard !== 'overhead');
        this.plan = this.hold(low ? DBACK : BACK, 14);
        return this.plan.shift()!;
      }
      if (this.rand() < 0.25) {
        // Tekken-style sidestep.
        return this.press(BTN.SS, 5);
      }
    }
    if (me.state === 'blockstun') {
      const guard = opp.move?.hit?.guard;
      return { dir: guard === 'low' ? DBACK : BACK, held: 0, pressed: 0 };
    }
    if (me.state === 'air') return NO_INPUT;

    // Anti-air.
    const oppAir = !opp.grounded && (opp.state === 'air' || (opp.state === 'attack' && !!opp.move?.air));
    if (oppAir && dist < 3.0 && Math.sign(opp.vx || 0) !== Math.sign(me.x - opp.x) * -1) {
      if (!this.decidedThreat && this.rand() < this.lv.antiAir * 0.2) {
        this.decidedThreat = true;
        const rising = this.findSpecial(me, DEFENSIVE);
        if (rising >= 0 && me.moves.specials[rising].tag === 'rising') return this.press(BTN.SP, rising === 2 ? 2 : rising === 1 ? FWD : 5);
        return this.press(BTN.HP, 2);
      }
    }

    this.idle++;
    if (this.idle < this.lv.interval) {
      return { dir: dist > 3 && this.rand() < this.lv.aggression ? FWD : 5, held: 0, pressed: 0 };
    }
    this.idle = 0;
    this.decide(me, m, dist, { FWD, BACK, DBACK, UFWD });
    return this.plan.shift() ?? NO_INPUT;
  }

  private decide(me: Fighter, m: Match, dist: number, d: { FWD: number; BACK: number; DBACK: number; UFWD: number }): void {
    const r = this.rand();
    const ag = this.lv.aggression;

    if (me.meter >= 100 && this.ultInRange(me, dist) && r < 0.35) {
      this.plan = [this.pressFrame(BTN.UL, 5)];
      return;
    }

    if (dist > 4.2) {
      const zone = this.findSpecial(me, ZONING, m);
      const self = this.findSpecial(me, SELF, m);
      if (zone >= 0 && r < 0.35) return this.useSpecial(zone, d.FWD);
      if (self >= 0 && r < 0.45) return this.useSpecial(self, d.FWD);
      if (r < 0.8) {
        this.plan = this.hold(d.FWD, 20);
        return;
      }
      this.plan = [...this.hold(d.FWD, 1), ...this.hold(5, 2), ...this.hold(d.FWD, 1), ...this.hold(5, 14)];
      return;
    }

    if (dist > 2.1) {
      const approach = this.findSpecial(me, APPROACH, m);
      const zone = this.findSpecial(me, ZONING, m);
      if (approach >= 0 && r < 0.2 * (0.5 + ag)) return this.useSpecial(approach, d.FWD);
      if (zone >= 0 && r < 0.4) return this.useSpecial(zone, d.FWD);
      if (r < 0.4 + ag * 0.2) {
        // Jump in with a heavy kick.
        this.plan = [...this.hold(d.UFWD, 4), ...this.hold(5, 14), this.pressFrame(BTN.HK, 5), ...this.hold(5, 18)];
        return;
      }
      if (r < 0.85) {
        this.plan = this.hold(d.FWD, 14);
        return;
      }
      this.plan = this.hold(d.BACK, 10);
      return;
    }

    // Close range.
    const close = this.findSpecial(me, CLOSE, m);
    if (close >= 0 && dist < 1.3 && r < 0.12) return this.useSpecial(close, d.FWD);
    if (dist < 1.05 && r < 0.2) {
      this.plan = [this.pressFrame(BTN.TH, 5), ...this.hold(5, 10)];
      return;
    }
    const pick = this.rand();
    if (pick < 0.22) {
      this.plan = [this.pressFrame(BTN.LP, 5), ...this.hold(5, 5), this.pressFrame(BTN.LP, 5), ...this.hold(5, 5), this.pressFrame(BTN.HP, 5), ...this.hold(5, 8)];
    } else if (pick < 0.38) {
      this.plan = [this.pressFrame(BTN.LK, 2), ...this.hold(2, 6), this.pressFrame(BTN.HK, 2), ...this.hold(5, 20)];
    } else if (pick < 0.5) {
      this.plan = [this.pressFrame(BTN.HP, 5), ...this.hold(5, 14)];
    } else if (pick < 0.6) {
      this.plan = [this.pressFrame(BTN.HK, 5), ...this.hold(5, 18)];
    } else if (pick < 0.66) {
      this.plan = [this.pressFrame(BTN.HP, d.FWD), ...this.hold(5, 30)];
    } else if (pick < 0.78) {
      this.plan = this.hold(d.BACK, 16);
    } else if (pick < 0.88) {
      this.plan = this.hold(d.DBACK, 12);
    } else {
      const def = this.findSpecial(me, DEFENSIVE, m);
      if (def >= 0) return this.useSpecial(def, d.FWD);
      this.plan = [this.pressFrame(BTN.LK, 2), ...this.hold(2, 8)];
    }
  }

  private ultInRange(me: Fighter, dist: number): boolean {
    switch (me.moves.ultimate.tag) {
      case 'cinematic': return dist < 3.2;
      case 'megagrab': return dist < 1.6;
      default: return true;
    }
  }

  private findSpecial(me: Fighter, set: Set<string>, m?: Match): number {
    const idxs: number[] = [];
    me.moves.specials.forEach((s, i) => {
      if (set.has(s.tag ?? '') && (!m || me.canUse(s, m))) idxs.push(i);
    });
    if (!idxs.length) return -1;
    return idxs[Math.floor(this.rand() * idxs.length)];
  }

  private pickSpecial(me: Fighter, dist: number, prefer: string[]): number {
    for (const tag of prefer) {
      const i = me.moves.specials.findIndex((s) => s.tag === tag);
      if (i >= 0) {
        if ((tag === 'grab' || tag === 'barrage') && dist > 1.4) continue;
        return i;
      }
    }
    return -1;
  }

  private useSpecial(idx: number, fwd: number): void {
    const dir = idx === 2 ? 2 : idx === 1 ? fwd : 5;
    this.plan = [this.pressFrame(BTN.SP, dir), ...this.hold(5, 12)];
  }

  private press(btn: number, dir: number): PlayerInput {
    return this.pressFrame(btn, dir);
  }

  private pressFrame(btn: number, dir: number): Frame {
    return { dir, held: btn, pressed: btn };
  }

  private hold(dir: number, frames: number): Frame[] {
    const out: Frame[] = [];
    for (let i = 0; i < frames; i++) out.push({ dir, held: 0, pressed: 0 });
    return out;
  }
}

/** Training dummy behaviours. */
export function dummyInput(mode: DummyMode, me: Fighter, m: Match, cpu: CpuController | null): PlayerInput {
  const f = me.facing;
  switch (mode) {
    case 'stand':
      return NO_INPUT;
    case 'crouch':
      return { dir: 2, held: 0, pressed: 0 };
    case 'jump':
      return { dir: 8, held: 0, pressed: 0 };
    case 'block': {
      const opp = me.opponent!;
      const low = opp.move?.hit?.guard === 'low' || (opp.isCrouching && opp.move?.hit?.guard !== 'overhead');
      const back = f > 0 ? 4 : 6;
      const dback = f > 0 ? 1 : 3;
      return { dir: low ? dback : back, held: 0, pressed: 0 };
    }
    case 'cpu':
      return cpu ? cpu.next(me, m) : NO_INPUT;
  }
}
