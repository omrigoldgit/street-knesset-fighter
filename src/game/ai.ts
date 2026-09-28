// CPU opponents. The AI drives a virtual controller, so it plays by the same rules as humans:
// Tekken guard (standing blocks highs/mids, crouching blocks lows), sidesteps against linear
// attacks, punishes on block, launcher → juggle combos, tech rolls and wake-ups.

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
  punish: number;
  step: number;
  juggle: number;
}

export const DIFFICULTY_NAMES = ['Backbencher', 'Committee Member', 'Minister', 'Prime Minister', 'Supreme Court'];

const LEVELS: Level[] = [
  { reaction: 30, block: 0.12, aggression: 0.3, combo: 0.1, antiAir: 0.1, tech: 0.0, interval: 26, punish: 0.05, step: 0.05, juggle: 0.1 },
  { reaction: 20, block: 0.35, aggression: 0.45, combo: 0.35, antiAir: 0.3, tech: 0.2, interval: 18, punish: 0.25, step: 0.12, juggle: 0.35 },
  { reaction: 13, block: 0.6, aggression: 0.55, combo: 0.6, antiAir: 0.55, tech: 0.4, interval: 12, punish: 0.5, step: 0.22, juggle: 0.6 },
  { reaction: 8, block: 0.8, aggression: 0.65, combo: 0.85, antiAir: 0.8, tech: 0.6, interval: 8, punish: 0.75, step: 0.32, juggle: 0.85 },
  { reaction: 4, block: 0.93, aggression: 0.75, combo: 1.0, antiAir: 0.95, tech: 0.8, interval: 5, punish: 0.95, step: 0.42, juggle: 1.0 },
];

type Frame = PlayerInput;

interface Dirs {
  FWD: number;
  BACK: number;
  DBACK: number;
  DFWD: number;
  UFWD: number;
}

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
  private wakeDelay = 0;
  private punished = -1;
  private juggled = -1;
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
    this.decidedThreat = false;
  }

  next(me: Fighter, m: Match): PlayerInput {
    if (m.phase !== 'fight') {
      this.plan = [];
      me.noGuard = false;
      return NO_INPUT;
    }
    const opp = me.opponent!;
    const f = me.facing;
    const d: Dirs = {
      FWD: f > 0 ? 6 : 4,
      BACK: f > 0 ? 4 : 6,
      DBACK: f > 0 ? 1 : 3,
      DFWD: f > 0 ? 3 : 1,
      UFWD: f > 0 ? 9 : 7,
    };
    const dist = me.distTo(opp);

    // Throw break.
    if (me.state === 'thrown') {
      if (!this.techTried && me.stateFrame >= 2) {
        this.techTried = true;
        if (this.rand() < this.lv.tech) return { dir: 5, held: BTN.TH, pressed: BTN.TH };
      }
      return NO_INPUT;
    }
    // Tech roll: press a button just before hitting the floor.
    if (me.state === 'juggle') {
      this.plan = [];
      if (!this.techTried && me.vy < 0 && me.y < 0.35) {
        this.techTried = true;
        if (this.rand() < this.lv.tech) return this.press(BTN.LP, 5);
      }
      return NO_INPUT;
    }
    this.techTried = false;
    // Wake up after a variable delay (sometimes instantly, sometimes lying in wait).
    if (me.state === 'knockdown') {
      this.plan = [];
      if (me.stateFrame === 1) this.wakeDelay = Math.floor(this.rand() * 26);
      return me.stateFrame >= 16 + this.wakeDelay ? { dir: d.BACK, held: 0, pressed: 0 } : NO_INPUT;
    }

    // Hit confirm into a special or the ultimate.
    if (me.state === 'attack' && me.move && me.moveHitConfirmed) {
      const key = `${me.move.id}:${m.frame - me.moveFrame}`;
      if (key !== this.lastMoveKey) {
        this.lastMoveKey = key;
        if (me.move.kind === 'normal' && me.move.cancel && me.move.tag !== 'launcher' && this.rand() < this.lv.combo * 0.6) {
          this.plan = [];
          if (me.meter >= 100 && this.ultInRange(me, dist) && this.rand() < 0.6) return this.press(BTN.UL, 5);
          const idx = this.pickSpecial(me, dist, ['rush', 'rising', 'barrage', 'spin', 'projectile', 'beam', 'pull', 'grab']);
          if (idx >= 0) return this.press(BTN.SP, idx === 2 ? 2 : idx === 1 ? d.FWD : 5);
        }
      }
    }

    // Juggle: the opponent is airborne after our launcher.
    const canAct = me.actionable || me.state === 'blockstun' || me.state === 'dash' || me.state === 'run';
    if (opp.state === 'juggle' && opp.juggleCount <= 3 && canAct && dist < 2.6 && opp.y > 0.25 && this.juggled !== opp.juggleCount) {
      this.juggled = opp.juggleCount;
      if (this.rand() < this.lv.juggle) {
        this.plan = this.jugglePlan(dist, d);
        me.noGuard = false;
        return this.plan.shift()!;
      }
    }
    if (opp.state !== 'juggle') this.juggled = -1;

    if (this.plan.length) {
      const fr = this.plan.shift()!;
      if (me.state === 'hitstun' || me.state === 'wallsplat') this.plan = [];
      return fr;
    }

    // Punish a blocked or whiffed move that is still recovering.
    const om = opp.move;
    if (om && opp.state === 'attack' && opp.moveFrame > om.startup + om.active && this.punished !== m.frame - opp.moveFrame) {
      const left = om.startup + om.active + om.recovery - opp.moveFrame - (me.state === 'blockstun' ? me.stun : 0);
      if (left >= 10 && dist < 1.9 && (canAct || me.state === 'blockstun')) {
        this.punished = m.frame - opp.moveFrame;
        if (this.rand() < this.lv.punish) {
          me.noGuard = false;
          this.plan = left >= 16 && dist < 1.4
            ? [this.pressFrame(BTN.HP, d.DFWD), ...this.hold(5, 20)]
            : [this.pressFrame(BTN.LP, 5), ...this.hold(5, 4), this.pressFrame(BTN.HP, 5), ...this.hold(5, 14)];
          return this.plan.shift()!;
        }
      }
    }

    if (!canAct && me.state !== 'air') return NO_INPUT;

    // Defence: the Tekken guard is automatic when standing still, so the CPU "fails" to block
    // by dropping its guard until it has reacted (and wins/loses its block roll).
    const threatened = m.isThreatened(me);
    if (threatened) {
      this.threatTimer++;
      if (!this.decidedThreat) me.noGuard = true;
    } else {
      this.threatTimer = 0;
      this.decidedThreat = false;
      me.noGuard = false;
    }
    if (threatened && this.threatTimer >= this.lv.reaction && !this.decidedThreat && me.grounded) {
      this.decidedThreat = true;
      const guard = opp.move?.hit?.guard;
      const linear = !!opp.move && !opp.move.track && (opp.move.hitbox?.lw ?? 0.26) < 0.5 && !opp.move.hit?.tracking;
      const r = this.rand();
      if (linear && opp.moveFrame < (opp.move?.startup ?? 0) - 6 && r < this.lv.step) {
        me.noGuard = false;
        this.plan = [this.pressFrame(BTN.SS, this.rand() < 0.5 ? 2 : 5), ...this.hold(5, 12)];
        return this.plan.shift()!;
      }
      if (this.rand() < this.lv.block) {
        me.noGuard = false;
        // Duck highs (and punish with a rising move), crouch-guard lows, stand-guard the rest.
        if (guard === 'high' && this.rand() < 0.35) {
          this.plan = [...this.hold(2, 14), this.pressFrame(BTN.HP, 5), ...this.hold(5, 16)];
        } else {
          this.plan = this.hold(guard === 'low' ? d.DBACK : 5, 14);
        }
        return this.plan.shift()!;
      }
    }
    if (me.state === 'blockstun') {
      const guard = opp.move?.hit?.guard;
      return { dir: guard === 'low' ? d.DBACK : 5, held: 0, pressed: 0 };
    }
    if (me.state === 'air') return NO_INPUT;

    // Anti-air.
    const oppAir = !opp.grounded && (opp.state === 'air' || (opp.state === 'attack' && !!opp.move?.air));
    if (oppAir && dist < 3.0 && !this.decidedThreat && this.rand() < this.lv.antiAir * 0.2) {
      this.decidedThreat = true;
      const rising = this.findSpecial(me, DEFENSIVE);
      if (rising >= 0 && me.moves.specials[rising].tag === 'rising') return this.press(BTN.SP, rising === 2 ? 2 : rising === 1 ? d.FWD : 5);
      return this.press(BTN.HP, d.DFWD);
    }

    this.idle++;
    if (this.idle < this.lv.interval) {
      // Footsies: drift in, occasionally circle.
      if (dist > 3 && this.rand() < this.lv.aggression) return { dir: d.FWD, held: 0, pressed: 0 };
      return NO_INPUT;
    }
    this.idle = 0;
    this.decide(me, m, dist, d);
    return this.plan.shift() ?? NO_INPUT;
  }

  /** Launcher follow-up: close the gap, then a jab string and a screw/ender. */
  private jugglePlan(dist: number, d: Dirs): Frame[] {
    const out: Frame[] = [];
    if (dist > 1.4) out.push(this.pressFrame(0, d.FWD), ...this.hold(5, 1), this.pressFrame(0, d.FWD), ...this.hold(d.FWD, 3));
    const r = this.rand();
    if (r < 0.5) {
      // 1,1,2 string
      out.push(this.pressFrame(BTN.LP, 5), ...this.hold(5, 6), this.pressFrame(BTN.LP, 5), ...this.hold(5, 6), this.pressFrame(BTN.HP, 5), ...this.hold(5, 18));
    } else if (r < 0.8) {
      // 1, then 3,4 screw kick
      out.push(this.pressFrame(BTN.LP, 5), ...this.hold(5, 12), this.pressFrame(BTN.LK, 5), ...this.hold(5, 6), this.pressFrame(BTN.HK, 5), ...this.hold(5, 22));
    } else {
      // 2,1 then dash punch for the wall
      out.push(this.pressFrame(BTN.HP, 5), ...this.hold(5, 6), this.pressFrame(BTN.LP, 5), ...this.hold(5, 18));
    }
    return out;
  }

  private decide(me: Fighter, m: Match, dist: number, d: Dirs): void {
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
      if (r < 0.55) {
        // Dash in (f,f) then walk.
        this.plan = [this.pressFrame(0, d.FWD), ...this.hold(5, 1), this.pressFrame(0, d.FWD), ...this.hold(d.FWD, 16)];
        return;
      }
      if (r < 0.75) {
        // Run up with a dash punch.
        this.plan = [this.pressFrame(0, d.FWD), ...this.hold(5, 1), ...this.hold(d.FWD, 16), this.pressFrame(BTN.HP, d.FWD), ...this.hold(5, 26)];
        return;
      }
      this.plan = this.hold(d.FWD, 20);
      return;
    }

    if (dist > 2.1) {
      const approach = this.findSpecial(me, APPROACH, m);
      const zone = this.findSpecial(me, ZONING, m);
      if (approach >= 0 && r < 0.2 * (0.5 + ag)) return this.useSpecial(approach, d.FWD);
      if (zone >= 0 && r < 0.35) return this.useSpecial(zone, d.FWD);
      if (r < 0.5) {
        // Dash in and poke.
        this.plan = [this.pressFrame(0, d.FWD), ...this.hold(5, 1), this.pressFrame(0, d.FWD), ...this.hold(d.FWD, 8), this.pressFrame(BTN.LK, 5), ...this.hold(5, 16)];
        return;
      }
      if (r < 0.62) {
        // Sidewalk / sidestep to get off-axis.
        this.plan = [this.pressFrame(BTN.SS, this.rand() < 0.5 ? 2 : 5), ...this.hold(5, 14)];
        return;
      }
      if (r < 0.72 + ag * 0.1) {
        // Rising knee from range.
        this.plan = [...this.hold(d.FWD, 6), this.pressFrame(BTN.HK, d.UFWD), ...this.hold(5, 28)];
        return;
      }
      if (r < 0.88) {
        this.plan = this.hold(d.FWD, 14);
        return;
      }
      // Korean backdash to bait.
      this.plan = [this.pressFrame(0, d.BACK), ...this.hold(5, 1), this.pressFrame(0, d.BACK), ...this.hold(5, 12)];
      return;
    }

    // Close range: mix highs, mids, lows and throws.
    const close = this.findSpecial(me, CLOSE, m);
    if (close >= 0 && dist < 1.3 && r < 0.12) return this.useSpecial(close, d.FWD);
    if (dist < 1.05 && r < 0.18) {
      this.plan = [this.pressFrame(BTN.TH, 5), ...this.hold(5, 10)];
      return;
    }
    const pick = this.rand();
    if (pick < 0.18) {
      // 1,1,2
      this.plan = [this.pressFrame(BTN.LP, 5), ...this.hold(5, 5), this.pressFrame(BTN.LP, 5), ...this.hold(5, 5), this.pressFrame(BTN.HP, 5), ...this.hold(5, 10)];
    } else if (pick < 0.3) {
      // d/f+1 mid poke
      this.plan = [this.pressFrame(BTN.LP, d.DFWD), ...this.hold(5, 18)];
    } else if (pick < 0.4) {
      // 3,4
      this.plan = [this.pressFrame(BTN.LK, 5), ...this.hold(5, 6), this.pressFrame(BTN.HK, 5), ...this.hold(5, 22)];
    } else if (pick < 0.5) {
      // Low: shin kick or sweep
      this.plan = this.rand() < 0.6 ? [this.pressFrame(BTN.HK, 2), ...this.hold(2, 4), ...this.hold(5, 14)] : [this.pressFrame(BTN.HK, d.DBACK), ...this.hold(5, 32)];
    } else if (pick < 0.58) {
      // Launcher attempt
      this.plan = [this.pressFrame(BTN.HP, d.DFWD), ...this.hold(5, 28)];
    } else if (pick < 0.66) {
      // f+2 power straight
      this.plan = [this.pressFrame(BTN.HP, d.FWD), ...this.hold(5, 26)];
    } else if (pick < 0.74) {
      // Backdash out
      this.plan = [this.pressFrame(0, d.BACK), ...this.hold(5, 1), this.pressFrame(0, d.BACK), ...this.hold(5, 14)];
    } else if (pick < 0.82) {
      // Sidestep
      this.plan = [this.pressFrame(BTN.SS, this.rand() < 0.5 ? 2 : 5), ...this.hold(5, 10)];
    } else if (pick < 0.9) {
      // Stand and guard
      this.plan = this.hold(5, 12);
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

/** Training dummy behaviours. Only the 'block' dummy (and the CPU) use the automatic guard. */
export function dummyInput(mode: DummyMode, me: Fighter, m: Match, cpu: CpuController | null): PlayerInput {
  const f = me.facing;
  if (mode !== 'cpu') me.noGuard = mode !== 'block';
  switch (mode) {
    case 'stand':
      return NO_INPUT;
    case 'crouch':
      return { dir: 2, held: 0, pressed: 0 };
    case 'jump':
      return { dir: 8, held: 0, pressed: 0 };
    case 'block': {
      const opp = me.opponent!;
      const low = opp.move?.hit?.guard === 'low';
      return { dir: low ? (f > 0 ? 1 : 3) : 5, held: 0, pressed: 0 };
    }
    case 'cpu':
      return cpu ? cpu.next(me, m) : NO_INPUT;
  }
}
