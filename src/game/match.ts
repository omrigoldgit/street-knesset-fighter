// Match: owns both fighters, projectiles, hit resolution and round flow.

import type { CharacterDef } from './characterTypes';
import {
  MAX_METER, MAX_SEPARATION, PUSH_WIDTH, STAGE_HALF_WIDTH, THROW_TECH_WINDOW, comboScale,
} from './constants';
import { Fighter, GRAB_EXEC, THROW_EXEC } from './fighter';
import { Projectile, type ProjectileOpts } from './projectile';
import { BTN, NO_INPUT, type Box, type GameEvent, type HitDef, type MoveDef, type PlayerInput, type PropStyle, type SparkKind } from './types';

export type DummyMode = 'stand' | 'crouch' | 'jump' | 'block' | 'cpu';

export interface TrainingOpts {
  infiniteHealth: boolean;
  infiniteMeter: boolean;
  dummy: DummyMode;
}

export interface MatchConfig {
  p1: CharacterDef;
  p2: CharacterDef;
  roundsToWin: number;
  /** Seconds per round. 0 = no timer. */
  roundTime: number;
  training?: TrainingOpts | null;
  seed?: number;
  skipIntro?: boolean;
}

export type Phase = 'intro' | 'roundStart' | 'fight' | 'ko' | 'roundEnd' | 'matchEnd';

export interface Cinematic {
  att: Fighter;
  def: Fighter;
  frame: number;
  total: number;
  hits: number;
  damage: number;
  scale: number;
  name: string;
  color: number;
  prop?: PropStyle;
}

interface HitSource {
  kind: MoveDef['kind'];
  projectile?: Projectile;
  x: number;
  y: number;
}

export type HitResult = 'miss' | 'hit' | 'block' | 'absorb' | 'counter' | 'reflect' | 'armor';

function overlaps(a: Box, b: Box): boolean {
  return Math.abs(a.x - b.x) * 2 < a.w + b.w && Math.abs(a.y - b.y) * 2 < a.h + b.h;
}

function overlapsAny(a: Box, list: Box[]): Box | null {
  for (const b of list) if (overlaps(a, b)) return b;
  return null;
}

function hitstopFor(hit: HitDef, kind: MoveDef['kind'], projectile: boolean): number {
  if (hit.hitstop !== undefined) return hit.hitstop;
  if (projectile) return kind === 'super' ? 5 : 7;
  if (kind === 'super') return 12;
  if (hit.spark === 'heavy') return 10;
  if (kind === 'special') return 11;
  return 7;
}

export class Match {
  fighters: [Fighter, Fighter];
  projectiles: Projectile[] = [];
  events: GameEvent[] = [];
  config: MatchConfig;

  /** Simulation frame (does not advance during hitstop / super freeze). */
  frame = 0;
  /** Wall clock ticks. */
  ticks = 0;
  phase: Phase = 'intro';
  phaseFrame = 0;
  round = 1;
  timer = 0;
  hitstop = 0;
  freeze = 0;
  freezeOwner: Fighter | null = null;
  slowmo = 0;
  cinematic: Cinematic | null = null;
  roundWinner: number | null = null;
  matchWinner: number | null = null;
  perfect = false;
  paused = false;

  private scheduled: { at: number; fn: () => void }[] = [];
  private seed: number;

  constructor(config: MatchConfig) {
    this.config = config;
    this.seed = config.seed ?? ((Math.random() * 2 ** 31) | 0);
    const a = new Fighter(0, config.p1);
    const b = new Fighter(1, config.p2);
    a.opponent = b;
    b.opponent = a;
    this.fighters = [a, b];
    a.victoryVariant = this.rngInt(3);
    b.victoryVariant = this.rngInt(3);
    this.placeFighters();
    this.timer = config.roundTime * 60;
    if (config.training || config.skipIntro) {
      this.startRound();
      if (config.training) {
        this.phase = 'fight';
        this.phaseFrame = 0;
      }
    } else {
      this.phase = 'intro';
      a.state = 'intro';
      b.state = 'intro';
    }
  }

  get training(): boolean {
    return !!this.config.training;
  }

  infiniteMeter(f: Fighter): boolean {
    return !!this.config.training?.infiniteMeter && f.index >= 0;
  }

  // ---------------------------------------------------------------- utilities

  rng(): number {
    // mulberry32
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  rngInt(n: number): number {
    return Math.floor(this.rng() * n);
  }

  emit(ev: GameEvent): void {
    this.events.push(ev);
    if (this.events.length > 400) this.events.splice(0, this.events.length - 400);
  }

  drainEvents(): GameEvent[] {
    const e = this.events;
    this.events = [];
    return e;
  }

  schedule(delay: number, fn: () => void): void {
    this.scheduled.push({ at: this.frame + delay, fn });
  }

  clampX(x: number, _f?: Fighter): number {
    const lim = STAGE_HALF_WIDTH - 0.35;
    return Math.max(-lim, Math.min(lim, x));
  }

  spawnProjectile(owner: Fighter, opts: ProjectileOpts): Projectile {
    const p = new Projectile(owner, opts);
    this.projectiles.push(p);
    this.emit({ t: 'projectile', id: p.id, owner: owner.index });
    return p;
  }

  hasProjectile(owner: Fighter, tag: string): boolean {
    return this.projectiles.some((p) => p.owner === owner && p.tag === tag && !p.dead);
  }

  removeProjectiles(owner: Fighter, tag: string): void {
    for (const p of this.projectiles) if (p.owner === owner && p.tag === tag) p.dead = true;
  }

  superFlash(f: Fighter, mv: MoveDef): void {
    this.freeze = mv.superFreeze ?? 40;
    this.freezeOwner = f;
    this.emit({ t: 'superFlash', fighter: f.index, name: mv.name, color: mv.color ?? 0xffcc00 });
    this.emit({ t: 'rumble', fighter: f.index, strong: 0.4, weak: 0.8, ms: 400 });
  }

  isThreatened(f: Fighter): boolean {
    const o = f.opponent!;
    const dist = Math.abs(o.x - f.x);
    if (o.state === 'attack' && o.move && dist < 3.4 && o.moveFrame <= o.move.startup + o.move.active) return true;
    for (const p of this.projectiles) {
      if (p.owner === o && !p.dead && Math.abs(p.x - f.x) < 3.8 && Math.sign(f.x - p.x) === Math.sign(p.vx || p.facing)) return true;
      if (p.owner === o && p.kind === 'rain' && Math.abs(p.x - f.x) < 1.5) return true;
    }
    return false;
  }

  // ---------------------------------------------------------------- flow

  private placeFighters(): void {
    const [a, b] = this.fighters;
    a.resetForRound(-2.1, 1);
    b.resetForRound(2.1, -1);
  }

  skipIntro(): void {
    if (this.phase === 'intro') this.startRound();
  }

  startRound(): void {
    this.phase = 'roundStart';
    this.phaseFrame = 0;
    this.timer = this.config.roundTime * 60;
    this.projectiles = [];
    this.scheduled = [];
    this.cinematic = null;
    this.hitstop = 0;
    this.freeze = 0;
    this.slowmo = 0;
    this.roundWinner = null;
    this.perfect = false;
    this.placeFighters();
    for (const f of this.fighters) f.koed = false;
  }

  /** Training mode: put both fighters back at the start. */
  resetPositions(): void {
    this.placeFighters();
    this.projectiles = [];
    this.scheduled = [];
    this.cinematic = null;
    for (const f of this.fighters) {
      f.koed = false;
      if (this.config.training?.infiniteMeter) f.meter = MAX_METER;
    }
  }

  tick(inputs: [PlayerInput, PlayerInput]): void {
    this.ticks++;
    if (this.paused) return;
    const live = this.phase === 'fight';
    this.fighters[0].recordInput(live ? inputs[0] : NO_INPUT);
    this.fighters[1].recordInput(live ? inputs[1] : NO_INPUT);

    if (this.hitstop > 0) {
      this.hitstop--;
      return;
    }
    if (this.freeze > 0) {
      this.freeze--;
      if (this.freeze === 0) this.freezeOwner = null;
      return;
    }
    if (this.slowmo > 0) {
      this.slowmo--;
      if (this.slowmo % 2 === 1) return;
    }
    this.phaseFrame++;
    this.simulate();
    this.phaseLogic();
  }

  private simulate(): void {
    this.frame++;
    if (this.scheduled.length) {
      const due = this.scheduled.filter((s) => s.at <= this.frame);
      this.scheduled = this.scheduled.filter((s) => s.at > this.frame);
      for (const s of due) s.fn();
    }
    if (this.cinematic) this.updateCinematic();
    for (const f of this.fighters) f.update(this);
    this.updateThrows();
    for (const f of this.fighters) f.physics(this);
    this.resolvePush();
    this.updateProjectiles();
    if (this.phase === 'fight') this.detectHits();
    if (this.config.training) this.trainingUpkeep();
  }

  private phaseLogic(): void {
    const [a, b] = this.fighters;
    switch (this.phase) {
      case 'intro':
        if (this.phaseFrame >= 200) this.startRound();
        break;
      case 'roundStart': {
        if (this.phaseFrame === 1) {
          const final = a.roundsWon === this.config.roundsToWin - 1 && b.roundsWon === this.config.roundsToWin - 1;
          this.emit({ t: 'round', n: this.round });
          this.emit({ t: 'announce', text: final ? 'FINAL ROUND' : `ROUND ${this.round}`, big: true, frames: 60 });
        }
        if (this.phaseFrame === 66) {
          this.emit({ t: 'fight' });
          this.emit({ t: 'announce', text: 'FIGHT!', big: true, frames: 45 });
        }
        if (this.phaseFrame >= 76) {
          this.phase = 'fight';
          this.phaseFrame = 0;
        }
        break;
      }
      case 'fight': {
        if (this.config.roundTime > 0 && !this.training && !this.cinematic) {
          this.timer--;
          if (this.timer <= 0) {
            this.timeout();
            break;
          }
        }
        if (this.cinematic) break;
        const dead = this.fighters.filter((f) => f.health <= 0);
        if (dead.length) this.ko(dead);
        break;
      }
      case 'ko': {
        if (this.phaseFrame === 110) {
          for (const f of this.fighters) {
            if (!f.koed && (this.roundWinner === f.index)) {
              f.move = null;
              f.throwExec = null;
              f.faceOpponent();
              if (f.grounded) f.setState('victory');
            }
          }
        }
        if (this.phaseFrame > 110) {
          for (const f of this.fighters) {
            if (!f.koed && this.roundWinner === f.index && f.state !== 'victory' && f.grounded && f.actionable) {
              f.setState('victory');
            }
          }
        }
        if (this.phaseFrame >= 200) this.endRound();
        break;
      }
      case 'roundEnd':
        if (this.phaseFrame >= 30) {
          this.round++;
          this.startRound();
        }
        break;
      case 'matchEnd':
        break;
    }
  }

  private ko(dead: Fighter[]): void {
    this.phase = 'ko';
    this.phaseFrame = 0;
    this.slowmo = 70;
    for (const d of dead) {
      d.koed = true;
      if (d.state !== 'juggle') d.enterJuggle(0.17, -d.facing * 0.07);
    }
    this.roundWinner = dead.length === 2 ? -1 : 1 - dead[0].index;
    const w = this.roundWinner >= 0 ? this.fighters[this.roundWinner] : null;
    this.perfect = !!w && w.health >= w.stats.maxHealth;
    this.emit({ t: 'ko', loser: dead.length === 2 ? -1 : dead[0].index, perfect: this.perfect });
    this.emit({ t: 'announce', text: dead.length === 2 ? 'DOUBLE K.O.' : 'K.O.', big: true, frames: 100 });
    this.emit({ t: 'shake', amount: 0.35 });
    for (const f of this.fighters) this.emit({ t: 'rumble', fighter: f.index, strong: 1, weak: 1, ms: 600 });
  }

  private timeout(): void {
    this.phase = 'ko';
    this.phaseFrame = 0;
    const [a, b] = this.fighters;
    const ra = a.health / a.stats.maxHealth;
    const rb = b.health / b.stats.maxHealth;
    this.roundWinner = Math.abs(ra - rb) < 1e-6 ? -1 : ra > rb ? 0 : 1;
    this.perfect = false;
    for (const f of this.fighters) {
      if (f.state === 'attack' || f.state === 'dash' || f.state === 'walkF' || f.state === 'walkB') {
        f.move = null;
        if (f.grounded) f.setState('idle');
      }
    }
    this.emit({ t: 'timeout' });
    this.emit({ t: 'announce', text: 'TIME', big: true, frames: 100 });
  }

  private endRound(): void {
    const [a, b] = this.fighters;
    if (this.roundWinner === -1) {
      a.roundsWon++;
      b.roundsWon++;
    } else if (this.roundWinner !== null) {
      this.fighters[this.roundWinner].roundsWon++;
    }
    const need = this.config.roundsToWin;
    const aw = a.roundsWon >= need;
    const bw = b.roundsWon >= need;
    if (aw || bw) {
      this.matchWinner = aw && bw ? -1 : aw ? 0 : 1;
      this.phase = 'matchEnd';
      this.phaseFrame = 0;
      const w = this.matchWinner >= 0 ? this.fighters[this.matchWinner] : null;
      this.emit({ t: 'announce', text: w ? `${w.def.name.toUpperCase()} WINS` : 'DRAW GAME', big: true, frames: 150 });
      if (w) {
        w.move = null;
        w.faceOpponent();
        if (w.grounded) w.setState('victory');
      }
    } else {
      this.phase = 'roundEnd';
      this.phaseFrame = 0;
    }
  }

  private trainingUpkeep(): void {
    const t = this.config.training!;
    for (const f of this.fighters) {
      if (t.infiniteMeter) f.meter = MAX_METER;
      if (t.infiniteHealth) {
        if (f.health <= 0) f.health = 1;
        if (f.actionable && f.stateFrame > 40 && f.health < f.stats.maxHealth) f.health = f.stats.maxHealth;
      }
      if (f.koed) f.koed = false;
    }
  }

  // ---------------------------------------------------------------- physics

  private resolvePush(): void {
    const [a, b] = this.fighters;
    const lim = STAGE_HALF_WIDTH - 0.35;
    for (const f of this.fighters) f.x = Math.max(-lim, Math.min(lim, f.x));

    // Keep both fighters on screen.
    const sep = b.x - a.x;
    if (Math.abs(sep) > MAX_SEPARATION) {
      const excess = Math.abs(sep) - MAX_SEPARATION;
      const dir = Math.sign(sep);
      const aAway = Math.sign(a.vx + a.slideVx) === -dir;
      const bAway = Math.sign(b.vx + b.slideVx) === dir;
      if (aAway && !bAway) a.x += dir * excess;
      else if (bAway && !aAway) b.x -= dir * excess;
      else {
        a.x += (dir * excess) / 2;
        b.x -= (dir * excess) / 2;
      }
    }

    const skip = (f: Fighter) => f.state === 'thrown' || f.state === 'cinematic' || f.koed && f.state === 'ko';
    if (skip(a) || skip(b)) return;
    const topA = a.y + (a.isCrouching ? 1.1 : 1.7);
    const topB = b.y + (b.isCrouching ? 1.1 : 1.7);
    if (a.y >= topB - 0.25 || b.y >= topA - 0.25) return;
    const dx = b.x - a.x;
    const overlap = PUSH_WIDTH - Math.abs(dx);
    if (overlap <= 0) return;
    let dir = Math.sign(dx);
    if (dir === 0) dir = a.facing;
    let pa = overlap / 2;
    let pb = overlap / 2;
    if (a.x - dir * pa < -lim || a.x - dir * pa > lim) {
      pb = overlap;
      pa = 0;
    } else if (b.x + dir * pb < -lim || b.x + dir * pb > lim) {
      pa = overlap;
      pb = 0;
    }
    a.x -= dir * pa;
    b.x += dir * pb;
    a.x = Math.max(-lim, Math.min(lim, a.x));
    b.x = Math.max(-lim, Math.min(lim, b.x));
  }

  private atWall(f: Fighter): boolean {
    return Math.abs(f.x) >= STAGE_HALF_WIDTH - 0.4;
  }

  // ---------------------------------------------------------------- throws

  tryGrab(att: Fighter, mv: MoveDef): void {
    const def = att.opponent!;
    if (!def.grounded || def.y > 0.05) return;
    if (def.isInvuln('throw')) return;
    switch (def.state) {
      case 'hitstun': case 'blockstun': case 'juggle': case 'knockdown': case 'getup': case 'thrown': case 'jumpSquat':
        return;
    }
    if (def.isEvading()) return;
    const dist = Math.abs(def.x - att.x);
    if (dist > (mv.throwRange ?? 1)) return;
    if (dist > 0.3 && Math.sign(def.x - att.x) !== att.facing) return;

    if (mv.grabCinematic) {
      this.startCinematic(att, def, mv.grabCinematic.damage, mv.grabCinematic.name, mv.color ?? 0xffcc00, mv.prop);
      return;
    }
    att.throwExec = {
      target: def,
      frame: 0,
      total: 44,
      damage: (mv.throwDamage ?? 120) * att.outgoingMul(mv.kind),
      techable: !!mv.techable,
      back: mv.kind === 'throw' && att.throwBack,
      move: mv,
    };
    att.move = mv.kind === 'throw' ? THROW_EXEC : GRAB_EXEC;
    att.moveFrame = 0;
    att.stateFrame = 0;
    def.move = null;
    def.throwExec = null;
    def.setState('thrown');
    def.grabbedBy = att;
    def.guarding = false;
    this.emit({ t: 'sfx', name: 'grab' });
    if (mv.kind !== 'throw') this.emit({ t: 'special', fighter: att.index, name: mv.name, color: mv.color ?? 0xffffff });
  }

  private updateThrows(): void {
    for (const att of this.fighters) {
      const te = att.throwExec;
      if (!te) continue;
      const def = te.target;
      if (def.state !== 'thrown') {
        att.throwExec = null;
        continue;
      }
      te.frame++;
      def.x = this.clampX(att.x + att.facing * 0.72);
      def.y = 0.12 + Math.sin(Math.min(1, te.frame / 26) * Math.PI) * 0.35;
      def.vx = def.vy = 0;
      def.facing = -att.facing;

      if (te.techable && te.frame <= THROW_TECH_WINDOW) {
        const h = def.history;
        if (h.buffered(BTN.TH, THROW_TECH_WINDOW) || h.pressedTogether(BTN.LP, BTN.LK, THROW_TECH_WINDOW)) {
          h.consume(BTN.TH | BTN.LP | BTN.LK, THROW_TECH_WINDOW);
          att.throwExec = null;
          att.move = null;
          def.grabbedBy = null;
          def.y = 0;
          att.enterBlockstun(14);
          def.enterBlockstun(14);
          att.slideVx = -att.facing * 0.16;
          def.slideVx = att.facing * 0.16;
          this.emit({ t: 'tech', x: (att.x + def.x) / 2, y: 1.2 });
          this.emit({ t: 'announce', text: 'TECH!', frames: 30 });
          continue;
        }
      }

      if (te.frame === 26) {
        let dir = att.facing;
        if (te.back) {
          def.x = this.clampX(att.x - att.facing * 0.8);
          dir = -att.facing;
        }
        const dmg = te.damage * def.incomingMul(false);
        def.grabbedBy = null;
        def.y = 0.3;
        def.state = 'juggle';
        def.takeDamage(dmg, this);
        def.comboHits++;
        const eff = te.move.hit?.effect;
        if (eff?.drain) {
          const d = Math.min(def.meter, eff.drain);
          def.meter -= d;
          att.gainMeter(d);
        }
        if (eff?.lifesteal) att.heal(eff.lifesteal);
        def.enterJuggle(0.2, dir * 0.11);
        if (eff?.stun && def.health > 0) {
          // Command grabs with stun leave the victim dizzy on landing.
          def.pendingDizzy = eff.stun;
        }
        att.gainMeter(12);
        def.gainMeter(6);
        this.hitstop = Math.max(this.hitstop, 10);
        def.flash = 10;
        this.emit({ t: 'hit', x: def.x, y: 1.0, spark: 'heavy', blocked: false, counter: false, attacker: att.index, defender: def.index, damage: Math.round(dmg), color: te.move.color });
        this.emit({ t: 'shake', amount: 0.2 });
        this.emit({ t: 'rumble', fighter: def.index, strong: 0.9, weak: 0.5, ms: 250 });
        att.throwExec = null;
      }
    }
  }

  // ---------------------------------------------------------------- cinematic supers

  startCinematic(att: Fighter, def: Fighter, damage: number, name: string, color: number, prop?: PropStyle): void {
    for (const p of this.projectiles) if (p.owner === def) p.dead = true;
    att.move = null;
    att.throwExec = null;
    att.fallMove = null;
    att.vx = att.vy = att.slideVx = 0;
    att.y = 0;
    att.setState('cinematic');
    def.move = null;
    def.throwExec = null;
    def.grabbedBy = null;
    def.vx = def.vy = def.slideVx = 0;
    def.y = 0;
    def.setState('cinematic');
    def.x = this.clampX(att.x + att.facing * 0.95);
    if (Math.abs(def.x - att.x) < 0.9) att.x = this.clampX(def.x - att.facing * 0.95);
    def.facing = -att.facing;
    this.cinematic = {
      att, def, frame: 0, total: 104, hits: 8, damage, name, color, prop,
      scale: Math.max(0.5, comboScale(def.comboHits + 1)),
    };
    this.emit({ t: 'sfx', name: 'cinematic' });
  }

  private updateCinematic(): void {
    const c = this.cinematic!;
    c.frame++;
    const { att, def } = c;
    att.stateFrame = c.frame;
    def.stateFrame = c.frame;
    const interval = 11;
    if (c.frame % interval === 0 && c.frame / interval <= c.hits) {
      const i = c.frame / interval;
      const last = i === c.hits;
      const per = (c.damage / c.hits) * att.outgoingMul('super') * def.incomingMul(false) * c.scale * (last ? 1.4 : 0.943);
      def.comboHits++;
      def.takeDamage(per, this, last);
      def.flash = 8;
      this.emit({
        t: 'hit', x: def.x - def.facing * 0.2, y: 0.9 + ((i * 37) % 7) / 10, spark: last ? 'super' : 'heavy', blocked: false, counter: false,
        attacker: att.index, defender: def.index, damage: Math.round(per), color: c.color,
      });
      this.emit({ t: 'shake', amount: last ? 0.3 : 0.08 });
      this.emit({ t: 'rumble', fighter: def.index, strong: last ? 1 : 0.5, weak: 0.4, ms: last ? 400 : 90 });
      if (last) this.hitstop = 14;
    }
    if (c.frame >= c.total) {
      this.cinematic = null;
      att.state = 'idle';
      att.toNeutral();
      def.state = 'idle';
      def.enterJuggle(0.3, att.facing * 0.1);
      def.juggleInvuln = true;
      att.gainMeter(0);
    }
  }

  // ---------------------------------------------------------------- hits

  private detectHits(): void {
    const [a, b] = this.fighters;
    const ha = a.activeHitbox();
    const hb = b.activeHitbox();
    const hurtA = a.hurtboxes();
    const hurtB = b.hurtboxes();
    const aHits = ha ? overlapsAny(ha, hurtB) : null;
    const bHits = hb ? overlapsAny(hb, hurtA) : null;
    if (aHits && ha) this.strike(a, b, ha, aHits);
    if (bHits && hb) this.strike(b, a, hb, bHits);
  }

  private strike(att: Fighter, def: Fighter, hb: Box, hurt: Box): void {
    const mv = att.move;
    if (!mv?.hit) return;
    let hit = mv.hit;
    const multi = (mv.maxHits ?? 1) > 1;
    if (multi && mv.finalHit && att.moveHits + 1 >= (mv.maxHits ?? 1)) hit = { ...hit, ...mv.finalHit };
    const x = (Math.max(hb.x - hb.w / 2, hurt.x - hurt.w / 2) + Math.min(hb.x + hb.w / 2, hurt.x + hurt.w / 2)) / 2;
    const y = Math.max(Math.min(hb.y, hurt.y + hurt.h / 2 - 0.1), hurt.y - hurt.h / 2 + 0.1);
    const res = this.resolveHit(att, def, hit, { kind: mv.kind, x, y });
    if (res === 'miss') return;
    att.moveHits++;
    att.moveLastHit = att.moveFrame;
    if (res === 'counter') return;
    att.moveConnected = true;
    if (res === 'hit' || res === 'armor') att.moveHitConfirmed = true;
    if (att.move === mv) mv.onHit?.(att.ctx(this), res === 'block' || res === 'absorb');
  }

  private triggerCounter(def: Fighter, att: Fighter): void {
    const strike = def.move!.counterMove!;
    att.move = null;
    att.enterHitstun(34, true, true);
    att.flash = 6;
    def.faceOpponent();
    def.startMove(strike, 0.5, this);
    this.hitstop = Math.max(this.hitstop, 12);
    this.emit({ t: 'counterHit', fighter: def.index });
    this.emit({ t: 'announce', text: 'COUNTER!', frames: 40 });
    this.emit({ t: 'hit', x: (att.x + def.x) / 2, y: 1.3, spark: 'special', blocked: true, counter: true, attacker: def.index, defender: att.index, damage: 0, color: strike.color });
  }

  resolveHit(att: Fighter, def: Fighter, hit: HitDef, src: HitSource): HitResult {
    const proj = src.projectile;
    const isProj = !!proj;
    if (def.isInvuln(isProj ? 'projectile' : 'strike')) return 'miss';
    if (def.isEvading() && !hit.tracking) return 'miss';

    if (def.inCounterWindow() && def.move?.counterMove) {
      if (!isProj) {
        this.triggerCounter(def, att);
        return 'counter';
      }
      this.emit({ t: 'clash', x: src.x, y: src.y });
      return 'absorb';
    }
    if (isProj && def.buff('reflect') && proj.kind !== 'mega' && proj.kind !== 'beam') {
      proj.owner = def;
      proj.vx = -proj.vx;
      proj.facing = -proj.facing;
      proj.reflected = true;
      proj.age = 0;
      proj.lastHitAge = -999;
      this.emit({ t: 'clash', x: src.x, y: src.y });
      this.emit({ t: 'sfx', name: 'reflect' });
      return 'reflect';
    }
    const shield = def.buff('shield');
    if (shield) {
      shield.value--;
      if (shield.value <= 0) shield.frames = 0;
      this.hitstop = Math.max(this.hitstop, 6);
      this.emit({ t: 'hit', x: src.x, y: src.y, spark: 'light', blocked: true, counter: false, attacker: att.index, defender: def.index, damage: 0, color: shield.color });
      this.emit({ t: 'sfx', name: 'shield' });
      return 'absorb';
    }

    const dir = isProj ? Math.sign(proj.vx) || proj.facing : Math.sign(def.x - att.x) || att.facing;
    const kindForDmg: MoveDef['kind'] | 'projectile' = isProj ? (proj.kind === 'mega' ? 'super' : 'projectile') : src.kind;
    const heavy = hit.spark === 'heavy' || hit.spark === 'super' || hit.spark === 'special';

    // Block
    if (def.canBlock() && def.blockOK(hit.guard)) {
      let chip = hit.chip ?? 0;
      if (att.passive === 'chipMaster') chip = Math.max(chip * 3, hit.damage * 0.12);
      if (chip > 0) def.takeDamage(chip * att.outgoingMul(kindForDmg === 'projectile' ? 'projectile' : src.kind) * def.incomingMul(isProj), this);
      def.enterBlockstun(hit.blockstun);
      def.slideVx = dir * hit.pushback * 1.15;
      if (!isProj && this.atWall(def)) att.slideVx = -dir * hit.pushback * 0.9;
      att.gainMeter(3);
      def.gainMeter(3);
      this.hitstop = Math.max(this.hitstop, Math.max(4, hitstopFor(hit, src.kind, isProj) - 3));
      this.emit({ t: 'hit', x: src.x, y: src.y, spark: 'light', blocked: true, counter: false, attacker: att.index, defender: def.index, damage: 0 });
      this.emit({ t: 'rumble', fighter: def.index, strong: 0.15, weak: 0.3, ms: 80 });
      return 'block';
    }

    // Damage
    const counter = !isProj && def.isCounterable();
    let dmg = hit.damage * att.outgoingMul(kindForDmg);
    if (counter) dmg *= att.passive === 'counterPunch' ? 1.5 : 1.2;
    def.comboHits++;
    let scale = comboScale(def.comboHits);
    if (att.passive === 'comboMaster') scale = Math.max(0.4, 1 - (def.comboHits - 1) * 0.07);
    if (src.kind === 'super' || kindForDmg === 'super') scale = Math.max(scale, 0.5);
    dmg = Math.max(1, Math.round(dmg * scale * def.incomingMul(isProj)));

    // Armor absorbs the hitstun but not the damage.
    if (def.hasArmor()) {
      def.consumeArmor();
      def.takeDamage(dmg, this);
      def.comboHits = Math.max(0, def.comboHits - 1);
      def.flash = 8;
      this.hitstop = Math.max(this.hitstop, 8);
      this.emit({ t: 'hit', x: src.x, y: src.y, spark: 'heavy', blocked: false, counter: false, attacker: att.index, defender: def.index, damage: dmg, color: 0xffaa33 });
      this.emit({ t: 'sfx', name: 'armor' });
      return 'armor';
    }

    // Being hit out of a throw releases the victim.
    if (def.throwExec) {
      const t = def.throwExec.target;
      def.throwExec = null;
      t.grabbedBy = null;
      t.enterJuggle(0.1, -t.facing * 0.05);
    }

    def.comboDamage += dmg;
    const saved = def.takeDamage(dmg, this);

    const eff = hit.effect;
    if (eff?.drain) {
      const d = Math.min(def.meter, eff.drain);
      def.meter -= d;
      att.gainMeter(d);
    }
    if (att.passive === 'drainer') {
      const d = Math.min(def.meter, 4);
      def.meter -= d;
    }
    if (eff?.lifesteal) att.heal(eff.lifesteal);
    if (att.passive === 'vampire') att.heal(dmg * 0.12);
    if (eff?.slow) def.addBuff('slow', 0.6, eff.slow, 0x6688ff, this);

    const airborne = !def.grounded || def.state === 'juggle' || def.state === 'air' || def.state === 'fall';
    const launches = !!hit.launch && (src.kind !== 'normal' || airborne);
    const w = Math.sqrt(def.stats.weight);
    if (saved) {
      def.enterJuggle(0.2, dir * 0.08);
    } else if (def.health <= 0) {
      def.enterJuggle(Math.max(0.2, hit.launch ?? 0), dir * 0.08);
    } else if (launches) {
      def.enterJuggle((hit.launch ?? 0.2) / w, dir * (hit.launchVx ?? 0.05));
    } else if (airborne) {
      def.enterJuggle(0.13, dir * 0.05);
    } else if (hit.knockdown) {
      def.enterJuggle(0.12, dir * 0.045);
    } else if (eff?.stun) {
      def.enterDizzy(eff.stun);
      def.slideVx = dir * hit.pushback;
    } else {
      const high = src.y > 1.0;
      def.enterHitstun(hit.hitstun + (counter ? 4 : 0), high, heavy);
      def.slideVx = (dir * hit.pushback) / w;
      if (!isProj && this.atWall(def)) att.slideVx = -dir * hit.pushback * 0.9;
    }

    att.gainMeter((hit.meterGain ?? 5) + dmg * 0.03);
    def.gainMeter(dmg * 0.05);
    this.hitstop = Math.max(this.hitstop, hitstopFor(hit, src.kind, isProj) + (counter ? 3 : 0));
    def.flash = 5;
    const spark: SparkKind = hit.spark ?? 'light';
    this.emit({ t: 'hit', x: src.x, y: src.y, spark, blocked: false, counter, attacker: att.index, defender: def.index, damage: dmg, color: proj?.color });
    if (counter) {
      this.emit({ t: 'counterHit', fighter: att.index });
      this.emit({ t: 'announce', text: 'COUNTER', frames: 30 });
    }
    const strong = spark === 'super' ? 1 : heavy ? 0.7 : 0.35;
    this.emit({ t: 'rumble', fighter: def.index, strong, weak: strong * 0.6, ms: heavy ? 200 : 110 });
    this.emit({ t: 'rumble', fighter: att.index, strong: strong * 0.3, weak: strong * 0.5, ms: 80 });
    if (heavy || counter) this.emit({ t: 'shake', amount: spark === 'super' ? 0.22 : counter ? 0.14 : 0.08 });
    return 'hit';
  }

  // ---------------------------------------------------------------- projectiles

  private updateProjectiles(): void {
    const ps = this.projectiles;
    for (const p of ps) p.update(p.owner.opponent!);

    // Projectile clashes.
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (!p.active || p.kind === 'trap') continue;
      for (let j = i + 1; j < ps.length; j++) {
        const q = ps[j];
        if (!q.active || q.kind === 'trap' || q.owner === p.owner) continue;
        if (!overlaps(p.box(), q.box())) continue;
        const pd = p.durability;
        p.durability -= Math.max(1, Math.min(q.durability, 3));
        q.durability -= Math.max(1, Math.min(pd, 3));
        if (p.durability <= 0) p.dead = true;
        if (q.durability <= 0) q.dead = true;
        this.emit({ t: 'clash', x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
      }
    }

    if (this.phase === 'fight') {
      for (const p of ps) {
        if (!p.active) continue;
        const target = p.owner.opponent!;
        if (p.kind === 'trap' && !target.grounded) continue;
        if (p.age - p.lastHitAge < p.rehit) continue;
        const hurt = overlapsAny(p.box(), target.hurtboxes());
        if (!hurt) continue;
        let hit = p.hit;
        if (p.hitsLeft === 1 && (p.kind === 'mega' || p.durability > 1) && p.hit.damage > 0) {
          hit = { ...hit, knockdown: true, launch: hit.launch ?? 0.18 };
        }
        const res = this.resolveHit(p.owner, target, hit, {
          kind: p.kind === 'mega' ? 'super' : 'special',
          projectile: p,
          x: (p.x + target.x) / 2,
          y: Math.max(0.3, Math.min(p.y, target.y + 1.6)),
        });
        if (res === 'miss' || res === 'reflect') continue;
        p.hitsLeft--;
        p.lastHitAge = p.age;
        p.onHit?.(target, res === 'block');
        if (p.hitsLeft <= 0 || res === 'absorb') p.dead = true;
      }
    }
    if (ps.some((p) => p.dead)) this.projectiles = ps.filter((p) => !p.dead);
  }
}

export { NO_INPUT };
