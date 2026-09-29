// Match: owns both fighters, projectiles, 3D hit resolution and round flow.

import type { CharacterDef } from './characterTypes';
import {
  ARENA_RADIUS, JUGGLE_VY_SCALE, LAUNCHER, MAX_METER, PUSH_RADIUS, THROW_TECH_WINDOW, WALLSPLAT_FRAMES, comboScale,
} from './constants';
import { Fighter, GRAB_EXEC, THROW_EXEC, getMoveSet } from './fighter';
import { Projectile, type ProjectileOpts } from './projectile';
import { BTN, NO_INPUT, type Box, type Cyl, type GameEvent, type HitDef, type MoveDef, type PlayerInput, type PropStyle, type SparkKind } from './types';
import { leftOf, type V2 } from './vec';

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
  z: number;
}

export type HitResult = 'miss' | 'hit' | 'block' | 'absorb' | 'counter' | 'reflect' | 'armor';

/** Does an attack box (in the attacker's local frame) overlap a world-space cylinder? */
export function boxHitsCyl(att: Fighter, b: Box, c: Cyl): boolean {
  const d = att.dir;
  const L = leftOf(d);
  const rx = c.x - att.x;
  const rz = c.z - att.z;
  const f = rx * d.x + rz * d.z;
  const l = rx * L.x + rz * L.z;
  if (Math.abs(f - b.x) > b.w / 2 + c.r) return false;
  if (Math.abs(l) > (b.lw ?? 0.26) + c.r) return false;
  return Math.abs(att.y + b.y - c.y) * 2 < b.h + c.h;
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
  /** Unit vector (ground plane) from the fight toward the camera; perpendicular to the fight axis. */
  camN: V2 = { x: 0, z: 1 };

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

  /** Clamps a ground-plane point inside the arena. */
  clampPos(p: V2, margin = 0.35): V2 {
    const lim = ARENA_RADIUS - margin;
    const r = Math.hypot(p.x, p.z);
    if (r <= lim) return { x: p.x, z: p.z };
    return { x: (p.x / r) * lim, z: (p.z / r) * lim };
  }

  atWall(f: Fighter, margin = 0.45): boolean {
    return Math.hypot(f.x, f.z) >= ARENA_RADIUS - margin;
  }

  /** Screen-right vector for the current camera side. */
  get screenRight(): V2 {
    return { x: this.camN.z, z: -this.camN.x };
  }

  spawnProjectile(owner: Fighter, opts: Omit<ProjectileOpts, 'z'> & { z?: number }): Projectile {
    const p = new Projectile(owner, { z: owner.z, ...opts } as ProjectileOpts);
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
    const dist = f.distTo(o);
    if (o.state === 'attack' && o.move && dist < 3.4 && o.moveFrame <= o.move.startup + o.move.active) return true;
    for (const p of this.projectiles) {
      if (p.owner !== o || p.dead) continue;
      const dx = f.x - p.x;
      const dz = f.z - p.z;
      const d = Math.hypot(dx, dz);
      if (p.kind === 'rain' && d < 1.5) return true;
      if (d < 3.8 && (p.attach || dx * p.vx + dz * p.vz > 0)) return true;
    }
    return false;
  }

  // ---------------------------------------------------------------- flow

  private placeFighters(): void {
    const [a, b] = this.fighters;
    a.resetForRound(-2.0, 0, 0);
    b.resetForRound(2.0, 0, Math.PI);
    this.camN = { x: 0, z: 1 };
    this.updateAxis(1);
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
    // Party Switcher (Mokujin style): take the opponent's specials and Heat Smash for this round.
    for (const f of this.fighters) {
      if (f.passive !== 'mimic') continue;
      const opp = this.fighters[1 - f.index];
      const own = getMoveSet(f.def);
      const theirs = getMoveSet(opp.def);
      f.moves = { ...own, specials: theirs.specials, ultimate: theirs.ultimate };
      this.emit({ t: 'mimic', fighter: f.index, from: opp.index });
      this.emit({ t: 'special', fighter: f.index, name: `Party Switch: ${opp.def.nick ?? opp.def.name.split(' ').slice(-1)[0]}'s moves`, color: 0xc8a165 });
    }
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

  /**
   * Keeps the camera perpendicular to the fight axis (continuous as fighters circle each other)
   * and derives each fighter's screen-relative facing for input.
   */
  private updateAxis(rate = 0.12): void {
    const [a, b] = this.fighters;
    const ax = b.x - a.x;
    const az = b.z - a.z;
    const l = Math.hypot(ax, az);
    if (l > 0.05) {
      let nx = -az / l;
      let nz = ax / l;
      if (nx * this.camN.x + nz * this.camN.z < 0) {
        nx = -nx;
        nz = -nz;
      }
      const mx = this.camN.x + (nx - this.camN.x) * rate;
      const mz = this.camN.z + (nz - this.camN.z) * rate;
      const ml = Math.hypot(mx, mz) || 1;
      this.camN = { x: mx / ml, z: mz / ml };
    }
    const R = this.screenRight;
    for (const f of this.fighters) {
      const o = f.opponent!;
      const s = (o.x - f.x) * R.x + (o.z - f.z) * R.z;
      if (Math.abs(s) > 0.05) f.facing = s > 0 ? 1 : -1;
    }
  }

  tick(inputs: [PlayerInput, PlayerInput]): void {
    this.ticks++;
    if (this.paused) return;
    const live = this.phase === 'fight';
    this.updateAxis();
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
    this.checkWalls();
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
        if (this.phaseFrame >= 110) {
          for (const f of this.fighters) {
            if (!f.koed && this.roundWinner === f.index && f.state !== 'victory' && f.grounded && (f.actionable || this.phaseFrame === 110)) {
              f.move = null;
              f.throwExec = null;
              f.faceOpponent();
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
      if (d.state !== 'juggle') d.enterJuggle(0.17, -d.dirX * 0.07, -d.dirZ * 0.07);
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
      if (f.state === 'attack' || f.state === 'dash' || f.state === 'run' || f.state === 'walkF' || f.state === 'walkB') {
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
    for (const f of this.fighters) {
      const p = this.clampPos(f);
      f.x = p.x;
      f.z = p.z;
    }
    const skip = (f: Fighter) => f.state === 'thrown' || f.state === 'cinematic' || (f.koed && f.state === 'ko');
    if (skip(a) || skip(b)) return;
    const topA = a.y + (a.isCrouching ? 1.1 : 1.7);
    const topB = b.y + (b.isCrouching ? 1.1 : 1.7);
    if (a.y >= topB - 0.25 || b.y >= topA - 0.25) return;
    let dx = b.x - a.x;
    let dz = b.z - a.z;
    let d = Math.hypot(dx, dz);
    const min = PUSH_RADIUS * 2;
    if (d >= min) return;
    if (d < 1e-4) {
      dx = a.dirX;
      dz = a.dirZ;
      d = 1;
    } else {
      dx /= d;
      dz /= d;
    }
    const overlap = min - Math.min(d, min);
    // If one fighter is against the wall, the other absorbs the whole push.
    const aWall = this.atWall(a, 0.4);
    const bWall = this.atWall(b, 0.4);
    const pa = aWall && !bWall ? 0 : bWall && !aWall ? overlap : overlap / 2;
    const pb = overlap - pa;
    a.x -= dx * pa;
    a.z -= dz * pa;
    b.x += dx * pb;
    b.z += dz * pb;
    for (const f of this.fighters) {
      const p = this.clampPos(f);
      f.x = p.x;
      f.z = p.z;
    }
  }

  /** Fighters knocked into the arena edge get wall-splatted. */
  private checkWalls(): void {
    for (const f of this.fighters) {
      if (!this.atWall(f, 0.4) || f.koed) continue;
      const sp = Math.hypot(f.vx + f.slideX, f.vz + f.slideZ);
      const outward = (f.x * (f.vx + f.slideX) + f.z * (f.vz + f.slideZ)) > 0;
      if (!outward) continue;
      if ((f.state === 'juggle' && sp > 0.03 && f.y < 1.6) || (f.state === 'hitstun' && sp > 0.12)) {
        f.enterWallsplat(WALLSPLAT_FRAMES, this);
        this.hitstop = Math.max(this.hitstop, 8);
        this.emit({ t: 'shake', amount: 0.18 });
      }
    }
  }

  // ---------------------------------------------------------------- throws

  tryGrab(att: Fighter, mv: MoveDef): void {
    const def = att.opponent!;
    if (!def.grounded || def.y > 0.05) return;
    if (def.isInvuln('throw')) return;
    switch (def.state) {
      case 'hitstun': case 'blockstun': case 'juggle': case 'knockdown': case 'getup': case 'thrown': case 'jumpSquat': case 'techroll': case 'wallsplat':
        return;
    }
    const loc = att.localOf(def.x, def.z);
    if (loc.f < -0.2 || loc.f > (mv.throwRange ?? 1) || Math.abs(loc.l) > 0.55) return;

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
      const p = this.clampPos(att.ahead(0.72));
      def.x = p.x;
      def.z = p.z;
      def.y = 0.12 + Math.sin(Math.min(1, te.frame / 26) * Math.PI) * 0.35;
      def.vx = def.vy = def.vz = 0;
      def.yaw = att.yaw + Math.PI;

      if (te.techable && te.frame <= THROW_TECH_WINDOW) {
        const h = def.history;
        if (h.buffered(BTN.TH | BTN.LP | BTN.HP, THROW_TECH_WINDOW)) {
          h.consume(BTN.TH | BTN.LP | BTN.HP, THROW_TECH_WINDOW);
          att.throwExec = null;
          att.move = null;
          def.grabbedBy = null;
          def.y = 0;
          att.enterBlockstun(14);
          def.enterBlockstun(14);
          att.slideX = -att.dirX * 0.16;
          att.slideZ = -att.dirZ * 0.16;
          def.slideX = att.dirX * 0.16;
          def.slideZ = att.dirZ * 0.16;
          this.emit({ t: 'tech', x: (att.x + def.x) / 2, y: 1.2, z: (att.z + def.z) / 2 });
          this.emit({ t: 'announce', text: 'THROW BREAK!', frames: 30 });
          continue;
        }
      }

      if (te.frame === 26) {
        let kx = att.dirX;
        let kz = att.dirZ;
        if (te.back) {
          const q = this.clampPos(att.ahead(-0.8));
          def.x = q.x;
          def.z = q.z;
          kx = -kx;
          kz = -kz;
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
        def.enterJuggle(0.2, kx * 0.11, kz * 0.11);
        if (eff?.stun && def.health > 0) def.pendingDizzy = eff.stun;
        att.gainMeter(12);
        def.gainMeter(6);
        this.hitstop = Math.max(this.hitstop, 10);
        def.flash = 10;
        this.emit({ t: 'hit', x: def.x, y: 1.0, z: def.z, spark: 'heavy', blocked: false, counter: false, attacker: att.index, defender: def.index, damage: Math.round(dmg), color: te.move.color });
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
    att.vx = att.vy = att.vz = att.slideX = att.slideZ = 0;
    att.y = 0;
    att.setState('cinematic');
    def.move = null;
    def.throwExec = null;
    def.grabbedBy = null;
    def.vx = def.vy = def.vz = def.slideX = def.slideZ = 0;
    def.y = 0;
    def.setState('cinematic');
    const p = this.clampPos(att.ahead(0.95));
    def.x = p.x;
    def.z = p.z;
    def.yaw = att.yaw + Math.PI;
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
      const hp = def.ahead(0.2);
      this.emit({
        t: 'hit', x: hp.x, y: 0.9 + ((i * 37) % 7) / 10, z: hp.z, spark: last ? 'super' : 'heavy', blocked: false, counter: false,
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
      def.enterJuggle(0.3, att.dirX * 0.1, att.dirZ * 0.1);
      def.juggleInvuln = true;
    }
  }

  // ---------------------------------------------------------------- hits

  private detectHits(): void {
    const [a, b] = this.fighters;
    const ha = a.activeHitbox();
    const hb = b.activeHitbox();
    const hurtA = a.hurtboxes();
    const hurtB = b.hurtboxes();
    const aHit = ha ? hurtB.find((c) => boxHitsCyl(a, ha, c)) : undefined;
    const bHit = hb ? hurtA.find((c) => boxHitsCyl(b, hb, c)) : undefined;
    if (aHit && ha) this.strike(a, b, ha, aHit);
    if (bHit && hb) this.strike(b, a, hb, bHit);
  }

  private strike(att: Fighter, def: Fighter, hb: Box, hurt: Cyl): void {
    const mv = att.move;
    if (!mv?.hit) return;
    let hit = mv.hit;
    const multi = (mv.maxHits ?? 1) > 1;
    if (multi && mv.finalHit && att.moveHits + 1 >= (mv.maxHits ?? 1)) hit = { ...hit, ...mv.finalHit };
    // Spark between the fist and the target's surface.
    const reach = Math.max(0.2, Math.min(hb.x + hb.w / 2, att.distTo(def) - hurt.r * 0.6));
    const sp = att.ahead(reach);
    const y = Math.max(Math.min(att.y + hb.y, hurt.y + hurt.h / 2 - 0.1), hurt.y - hurt.h / 2 + 0.1);
    const res = this.resolveHit(att, def, hit, { kind: mv.kind, x: sp.x, y, z: sp.z });
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
    this.emit({ t: 'hit', x: (att.x + def.x) / 2, y: 1.3, z: (att.z + def.z) / 2, spark: 'special', blocked: true, counter: true, attacker: def.index, defender: att.index, damage: 0, color: strike.color });
  }

  resolveHit(att: Fighter, def: Fighter, hit: HitDef, src: HitSource): HitResult {
    const proj = src.projectile;
    const isProj = !!proj;
    if (def.isInvuln(isProj ? 'projectile' : 'strike')) return 'miss';
    // Grounded opponents can only be hit by moves that reach the floor.
    if (def.state === 'knockdown' && !hit.otg) return 'miss';

    if (def.inCounterWindow() && def.move?.counterMove) {
      if (!isProj) {
        this.triggerCounter(def, att);
        return 'counter';
      }
      this.emit({ t: 'clash', x: src.x, y: src.y, z: src.z });
      return 'absorb';
    }
    if (isProj && def.buff('reflect') && proj.kind !== 'mega' && proj.kind !== 'beam') {
      proj.owner = def;
      proj.vx = -proj.vx;
      proj.vz = -proj.vz;
      proj.dirX = -proj.dirX;
      proj.dirZ = -proj.dirZ;
      proj.reflected = true;
      proj.age = 0;
      proj.lastHitAge = -999;
      this.emit({ t: 'clash', x: src.x, y: src.y, z: src.z });
      this.emit({ t: 'sfx', name: 'reflect' });
      return 'reflect';
    }
    const shield = def.buff('shield');
    if (shield) {
      shield.value--;
      if (shield.value <= 0) shield.frames = 0;
      this.hitstop = Math.max(this.hitstop, 6);
      this.emit({ t: 'hit', x: src.x, y: src.y, z: src.z, spark: 'light', blocked: true, counter: false, attacker: att.index, defender: def.index, damage: 0, color: shield.color });
      this.emit({ t: 'sfx', name: 'shield' });
      return 'absorb';
    }

    // Knockback direction on the ground plane.
    let kx: number;
    let kz: number;
    if (isProj) {
      const l = Math.hypot(proj.vx, proj.vz);
      kx = l > 0 ? proj.vx / l : proj.dirX;
      kz = l > 0 ? proj.vz / l : proj.dirZ;
    } else {
      const dx = def.x - att.x;
      const dz = def.z - att.z;
      const l = Math.hypot(dx, dz);
      kx = l > 0.01 ? dx / l : att.dirX;
      kz = l > 0.01 ? dz / l : att.dirZ;
    }
    const kindForDmg: MoveDef['kind'] | 'projectile' = isProj ? (proj.kind === 'mega' ? 'super' : 'projectile') : src.kind;
    const heavy = hit.spark === 'heavy' || hit.spark === 'super' || hit.spark === 'special';

    // Block
    if (def.canBlock() && def.blockOK(hit.guard)) {
      let chip = hit.chip ?? 0;
      if (att.passive === 'chipMaster') chip = Math.max(chip * 3, hit.damage * 0.12);
      if (chip > 0) def.takeDamage(chip * att.outgoingMul(kindForDmg === 'projectile' ? 'projectile' : src.kind) * def.incomingMul(isProj), this);
      def.enterBlockstun(hit.blockstun);
      def.slideX = kx * hit.pushback * 1.15;
      def.slideZ = kz * hit.pushback * 1.15;
      if (!isProj && this.atWall(def)) {
        att.slideX = -kx * hit.pushback * 0.9;
        att.slideZ = -kz * hit.pushback * 0.9;
      }
      att.gainMeter(3);
      def.gainMeter(3);
      this.hitstop = Math.max(this.hitstop, Math.max(4, hitstopFor(hit, src.kind, isProj) - 3));
      this.emit({ t: 'hit', x: src.x, y: src.y, z: src.z, spark: 'light', blocked: true, counter: false, attacker: att.index, defender: def.index, damage: 0 });
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
    if (def.state === 'knockdown') scale *= 0.5;
    dmg = Math.max(1, Math.round(dmg * scale * def.incomingMul(isProj)));

    // Armor absorbs the hitstun but not the damage.
    if (def.hasArmor()) {
      def.consumeArmor();
      def.takeDamage(dmg, this);
      def.comboHits = Math.max(0, def.comboHits - 1);
      def.flash = 8;
      this.hitstop = Math.max(this.hitstop, 8);
      this.emit({ t: 'hit', x: src.x, y: src.y, z: src.z, spark: 'heavy', blocked: false, counter: false, attacker: att.index, defender: def.index, damage: dmg, color: 0xffaa33 });
      this.emit({ t: 'sfx', name: 'armor' });
      return 'armor';
    }

    // Being hit out of a throw releases the victim.
    if (def.throwExec) {
      const t = def.throwExec.target;
      def.throwExec = null;
      t.grabbedBy = null;
      t.enterJuggle(0.1, -t.dirX * 0.05, -t.dirZ * 0.05);
    }

    def.comboDamage += dmg;
    const saved = def.takeDamage(dmg, this);

    const eff = hit.effect;
    if (eff?.drain) {
      const d = Math.min(def.meter, eff.drain);
      def.meter -= d;
      att.gainMeter(d);
    }
    if (att.passive === 'drainer') def.meter -= Math.min(def.meter, 4);
    if (eff?.lifesteal) att.heal(eff.lifesteal);
    if (att.passive === 'vampire') att.heal(dmg * 0.12);
    if (eff?.slow) def.addBuff('slow', 0.6, eff.slow, 0x6688ff, this);

    const airborne = !def.grounded || def.state === 'juggle' || def.state === 'air' || def.state === 'fall';
    const launches = !!hit.launch && (hit.launch >= LAUNCHER || src.kind !== 'normal' || airborne);
    const w = Math.sqrt(def.stats.weight);
    const lv = hit.launchVx ?? 0.03;
    if (saved) {
      def.enterJuggle(0.2, kx * 0.08, kz * 0.08);
    } else if (def.health <= 0) {
      def.enterJuggle(Math.max(0.2, hit.launch ?? 0), kx * 0.08, kz * 0.08);
    } else if (def.state === 'knockdown') {
      // Ground hit: stays down a little longer.
      def.stateFrame = Math.max(0, def.stateFrame - 12);
    } else if (def.state === 'wallsplat') {
      def.stun = Math.min(def.stun + 14, 30);
      def.y = Math.min(1.1, def.y + 0.08);
    } else if (airborne) {
      // Juggle hit: small pop that decays as the combo grows. Screws spin the body for one extension.
      const curVy = def.state === 'juggle' ? def.vy / JUGGLE_VY_SCALE : def.vy;
      let vy = Math.max(curVy, (launches ? hit.launch! * 0.75 : 0.11) - def.juggleCount * 0.008);
      if (hit.screw && !def.screwed) {
        def.screwed = true;
        vy = Math.max(vy, 0.15);
        this.emit({ t: 'announce', text: 'SCREW!', frames: 24 });
      }
      def.enterJuggle(vy / w, kx * (lv + hit.pushback * 0.25), kz * (lv + hit.pushback * 0.25));
    } else if (launches) {
      def.enterJuggle(hit.launch! / w, kx * lv, kz * lv);
      if (hit.launch! >= LAUNCHER) this.emit({ t: 'announce', text: 'LAUNCH!', frames: 22 });
    } else if (hit.knockdown) {
      def.enterJuggle(0.12, kx * 0.045, kz * 0.045);
    } else if (eff?.stun) {
      def.enterDizzy(eff.stun);
      def.slideX = kx * hit.pushback;
      def.slideZ = kz * hit.pushback;
    } else if (counter && hit.crumpleCH) {
      def.enterDizzy(52, true);
      this.emit({ t: 'announce', text: 'CRUMPLE!', frames: 30 });
    } else {
      // Head-snap reaction for highs; mids and lows fold the body instead.
      const high = hit.guard === 'high' || src.y > 1.35;
      def.enterHitstun(hit.hitstun + (counter ? 6 : 0), high, heavy);
      const push = hit.pushback * (hit.wall ? 1.3 : 1);
      def.slideX = (kx * push) / w;
      def.slideZ = (kz * push) / w;
      if (!isProj && this.atWall(def)) {
        if (hit.wall) {
          def.enterWallsplat(WALLSPLAT_FRAMES, this);
        } else {
          att.slideX = -kx * hit.pushback * 0.9;
          att.slideZ = -kz * hit.pushback * 0.9;
        }
      }
    }

    att.gainMeter((hit.meterGain ?? 5) + dmg * 0.03);
    def.gainMeter(dmg * 0.05);
    this.hitstop = Math.max(this.hitstop, hitstopFor(hit, src.kind, isProj) + (counter ? 3 : 0));
    def.flash = 5;
    const spark: SparkKind = hit.spark ?? 'light';
    this.emit({ t: 'hit', x: src.x, y: src.y, z: src.z, spark, blocked: false, counter, attacker: att.index, defender: def.index, damage: dmg, color: proj?.color });
    if (counter) {
      this.emit({ t: 'counterHit', fighter: att.index });
      this.emit({ t: 'announce', text: 'COUNTER HIT', frames: 30 });
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

    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (!p.active || p.kind === 'trap') continue;
      for (let j = i + 1; j < ps.length; j++) {
        const q = ps[j];
        if (!q.active || q.kind === 'trap' || q.owner === p.owner) continue;
        if (!p.touches(q)) continue;
        const pd = p.durability;
        p.durability -= Math.max(1, Math.min(q.durability, 3));
        q.durability -= Math.max(1, Math.min(pd, 3));
        if (p.durability <= 0) p.dead = true;
        if (q.durability <= 0) q.dead = true;
        this.emit({ t: 'clash', x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, z: (p.z + q.z) / 2 });
      }
    }

    if (this.phase === 'fight') {
      for (const p of ps) {
        if (!p.active) continue;
        const target = p.owner.opponent!;
        if (p.kind === 'trap' && !target.grounded) continue;
        if (p.age - p.lastHitAge < p.rehit) continue;
        const hurt = target.hurtboxes().find((c) => p.overlaps(c));
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
          z: (p.z + target.z) / 2,
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
