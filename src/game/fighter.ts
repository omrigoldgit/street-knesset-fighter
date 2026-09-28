// Fighter: Tekken-style 3D state machine, input interpretation and physics for one combatant.
// Fighters live on the (x, z) ground plane, face each other with a finite turn rate, and attacks
// commit to a direction, so sidesteps make linear moves whiff.

import type { CharacterDef } from './characterTypes';
import {
  BASE_HEALTH, GETUP_FRAMES, GRAVITY, JUGGLE_GRAVITY, JUGGLE_LIMIT, JUGGLE_VY_SCALE, KNOCKDOWN_MAX, KNOCKDOWN_MIN,
  MAX_METER, RAGE_THRESHOLD, TECHROLL_FRAMES, ULT_COST,
} from './constants';
import { InputHistory, isBack, isDown, isUp, toRelative } from './motion';
import { buildNormals, buildThrow, type NormalId } from './normals';
import { buildSpecial, buildUltimate } from './specials';
import {
  ATTACKS, BTN, KICKS, NO_INPUT, PUNCHES,
  type Box, type Buff, type BuffKind, type Cyl, type GuardType, type InvulnKind, type MoveCtx, type MoveDef, type PlayerInput,
} from './types';
import { leftOf, turnToward, wrapAngle, type V2 } from './vec';
import type { Match } from './match';

export type FState =
  | 'intro' | 'idle' | 'walkF' | 'walkB' | 'crouch' | 'jumpSquat' | 'air' | 'land' | 'dash' | 'run'
  | 'backdash' | 'sidestep' | 'sidewalk' | 'attack' | 'fall' | 'hitstun' | 'juggle' | 'blockstun'
  | 'dizzy' | 'knockdown' | 'getup' | 'techroll' | 'wallsplat' | 'thrown' | 'ko' | 'victory' | 'cinematic';

export interface MoveSet {
  normals: Record<NormalId, MoveDef>;
  throw: MoveDef;
  specials: MoveDef[];
  ultimate: MoveDef;
}

export interface FighterStats {
  maxHealth: number;
  walk: number;
  back: number;
  dash: number;
  run: number;
  jumpVy: number;
  jumpVx: number;
  gravity: number;
  dmgMul: number;
  defMul: number;
  meterMul: number;
  weight: number;
}

export const THROW_EXEC: MoveDef = {
  id: 'throwExec',
  name: 'Throw',
  kind: 'throw',
  anim: 'throwExec',
  startup: 0,
  active: 0,
  recovery: 44,
};

export const GRAB_EXEC: MoveDef = { ...THROW_EXEC, id: 'grabExec', anim: 'grabExec', kind: 'special' };

const moveSetCache = new Map<string, MoveSet>();

export function getMoveSet(def: CharacterDef): MoveSet {
  const key = def.id + (def.boss ? ':boss' : '');
  let set = moveSetCache.get(key);
  if (!set) {
    set = {
      normals: buildNormals(def.style, def.stats.power ?? 1),
      throw: buildThrow(def.style, def.passive.id === 'bouncer'),
      specials: def.specials.map((s, i) => buildSpecial(s, i)),
      ultimate: buildUltimate(def.ultimate),
    };
    moveSetCache.set(key, set);
  }
  return set;
}

export function computeStats(def: CharacterDef): FighterStats {
  const s = def.stats;
  const speed = (s.speed ?? 1) * (def.passive.id === 'swift' ? 1.18 : 1) * (def.style === 'rushdown' ? 1.1 : def.style === 'grappler' ? 0.88 : 1);
  const weight = s.weight ?? 1;
  return {
    maxHealth: Math.round(BASE_HEALTH * (s.health ?? 1) * (def.style === 'grappler' ? 1.08 : 1) * (def.boss ? 1.5 : 1)),
    walk: 0.042 * speed,
    back: 0.034 * speed,
    dash: 0.15 * speed,
    run: 0.1 * speed,
    jumpVy: 0.3 * (s.jump ?? 1),
    jumpVx: 0.06 * speed,
    gravity: GRAVITY * (0.94 + 0.06 * weight),
    dmgMul: (s.power ?? 1) * (def.boss ? 1.15 : 1),
    defMul: (1 / (s.defense ?? 1)) * (def.passive.id === 'thickSkin' ? 0.86 : 1),
    meterMul: def.passive.id === 'meterBoost' ? 1.3 : 1,
    weight,
  };
}

export interface ThrowExec {
  target: Fighter;
  frame: number;
  total: number;
  damage: number;
  techable: boolean;
  back: boolean;
  move: MoveDef;
}

export class Fighter {
  index: number;
  def: CharacterDef;
  moves: MoveSet;
  stats: FighterStats;
  opponent: Fighter | null = null;

  // World position (ground plane x/z, height y) and velocity.
  x = 0;
  y = 0;
  z = 0;
  vx = 0;
  vy = 0;
  vz = 0;
  slideX = 0;
  slideZ = 0;
  /** Facing angle on the ground plane: direction (cos yaw, sin yaw). */
  yaw = 0;
  /** Screen-relative facing sign (+1 = opponent to the right on screen), used for input. */
  facing = 1;

  state: FState = 'idle';
  stateFrame = 0;

  move: MoveDef | null = null;
  moveFrame = 0;
  moveStrength = 0.5;
  moveHits = 0;
  moveLastHit = -99;
  moveConnected = false;
  moveHitConfirmed = false;
  pendingString: MoveDef | null = null;
  armorLeft = 0;
  fallMove: MoveDef | null = null;
  landLag = 0;
  throwBack = false;
  throwExec: ThrowExec | null = null;
  grabbedBy: Fighter | null = null;

  jumpDir = 0;
  airJumps = 0;
  airAttackUsed = false;
  dashDir = 0;
  /** Lateral direction of the current sidestep in world space. */
  sideX = 0;
  sideZ = 0;
  /** +1 toward the camera, -1 into the background (for animation). */
  sidestepDir = -1;
  /** Frames left in the "while standing" window after leaving a crouch. */
  wsFrames = 0;
  private crouchEnteredFromStand = false;

  health: number;
  recoverable = 0;
  lastHurtFrame = -999;
  meter = 0;
  stun = 0;
  juggleCount = 0;
  juggleInvuln = false;
  screwed = false;
  comboHits = 0;
  comboDamage = 0;
  invuln = 0;
  lifelineUsed = false;
  rageArtUsed = false;
  rageAnnounced = false;
  koed = false;
  pendingDizzy = 0;
  buffs: Buff[] = [];
  cooldowns = new Map<string, number>();

  history = new InputHistory();
  input: PlayerInput = NO_INPUT;
  relDir = 5;
  roundsWon = 0;
  /**
   * Suppresses the automatic Tekken guard (standing still blocks highs and mids). Set by the CPU
   * when it fails its reaction roll and by training dummies that should take hits.
   */
  noGuard = false;

  // Presentation helpers read by the renderer.
  flash = 0;
  guarding = false;
  hitHigh = true;
  lastHitHeavy = false;
  crumpled = false;
  knockdownFrames = KNOCKDOWN_MAX;
  victoryVariant = 0;
  /** Accumulated spin for screw / spin-out animations. */
  spin = 0;

  constructor(index: number, def: CharacterDef) {
    this.index = index;
    this.def = def;
    this.moves = getMoveSet(def);
    this.stats = computeStats(def);
    this.health = this.stats.maxHealth;
  }

  // ---------------------------------------------------------------- geometry

  get dirX(): number {
    return Math.cos(this.yaw);
  }

  get dirZ(): number {
    return Math.sin(this.yaw);
  }

  get dir(): V2 {
    return { x: Math.cos(this.yaw), z: Math.sin(this.yaw) };
  }

  /** Point `d` units in front of the fighter. */
  ahead(d: number): V2 {
    return { x: this.x + Math.cos(this.yaw) * d, z: this.z + Math.sin(this.yaw) * d };
  }

  setForward(speed: number): void {
    this.vx = Math.cos(this.yaw) * speed;
    this.vz = Math.sin(this.yaw) * speed;
  }

  /** Position of a world point in this fighter's frame: f = forward, l = left. */
  localOf(px: number, pz: number): { f: number; l: number } {
    const dx = px - this.x;
    const dz = pz - this.z;
    const d = this.dir;
    const L = leftOf(d);
    return { f: dx * d.x + dz * d.z, l: dx * L.x + dz * L.z };
  }

  distTo(o: Fighter): number {
    return Math.hypot(o.x - this.x, o.z - this.z);
  }

  yawToward(px: number, pz: number): number {
    return Math.atan2(pz - this.z, px - this.x);
  }

  turnToOpponent(rate: number): void {
    const o = this.opponent;
    if (!o) return;
    if (Math.hypot(o.x - this.x, o.z - this.z) < 0.05) return;
    this.yaw = turnToward(this.yaw, this.yawToward(o.x, o.z), rate);
  }

  faceToward(x: number, z = this.z): void {
    if (Math.hypot(x - this.x, z - this.z) > 0.02) this.yaw = this.yawToward(x, z);
  }

  faceOpponent(): void {
    if (this.opponent) this.faceToward(this.opponent.x, this.opponent.z);
  }

  /** How far this fighter is facing away from the opponent (radians). */
  offAxis(): number {
    const o = this.opponent;
    if (!o) return 0;
    return Math.abs(wrapAngle(this.yawToward(o.x, o.z) - this.yaw));
  }

  get grounded(): boolean {
    return this.y <= 0 && this.vy <= 0;
  }

  get passive() {
    return this.def.passive.id;
  }

  get inRage(): boolean {
    return this.health > 0 && this.health < this.stats.maxHealth * RAGE_THRESHOLD;
  }

  get isCrouching(): boolean {
    if (this.state === 'crouch') return true;
    if ((this.state === 'blockstun' || this.state === 'hitstun') && isDown(this.relDir) && this.grounded) return true;
    if (this.state === 'attack' && this.move?.lowProfile) return true;
    return false;
  }

  get actionable(): boolean {
    return this.state === 'idle' || this.state === 'walkF' || this.state === 'walkB' || this.state === 'crouch';
  }

  resetForRound(x: number, z: number, yaw: number): void {
    this.x = x;
    this.z = z;
    this.y = 0;
    this.vx = this.vy = this.vz = this.slideX = this.slideZ = 0;
    this.yaw = yaw;
    this.state = 'idle';
    this.stateFrame = 0;
    this.move = null;
    this.pendingString = null;
    this.fallMove = null;
    this.throwExec = null;
    this.grabbedBy = null;
    this.health = this.stats.maxHealth;
    this.recoverable = 0;
    this.stun = 0;
    this.juggleCount = 0;
    this.juggleInvuln = false;
    this.screwed = false;
    this.comboHits = 0;
    this.comboDamage = 0;
    this.invuln = 0;
    this.rageArtUsed = false;
    this.rageAnnounced = false;
    this.crumpled = false;
    this.buffs = [];
    this.pendingDizzy = 0;
    this.wsFrames = 0;
    this.spin = 0;
    this.cooldowns.clear();
    this.history.clear();
    this.flash = 0;
    this.guarding = false;
    this.noGuard = false;
    if (this.passive === 'deepPockets') this.meter = Math.max(this.meter, 50);
  }

  setState(s: FState): void {
    if (this.state !== s) {
      this.state = s;
      this.stateFrame = 0;
    }
  }

  ctx(m: Match): MoveCtx {
    return { fighter: this, opponent: this.opponent!, match: m, move: this.move!, strength: this.moveStrength };
  }

  // ---------------------------------------------------------------- input

  recordInput(input: PlayerInput): void {
    this.input = input;
    this.relDir = toRelative(input.dir, this.facing);
    this.history.push(this.relDir, input.pressed);
  }

  // ---------------------------------------------------------------- buffs & damage

  addBuff(kind: BuffKind, value: number, frames: number, color: number, m?: Match): void {
    this.buffs = this.buffs.filter((b) => b.kind !== kind);
    this.buffs.push({ kind, value, frames, color });
    m?.emit({ t: 'buff', fighter: this.index, kind, color });
  }

  buff(kind: BuffKind): Buff | undefined {
    return this.buffs.find((b) => b.kind === kind);
  }

  speedMul(): number {
    let mul = 1;
    const sp = this.buff('speed');
    if (sp) mul *= sp.value;
    const sl = this.buff('slow');
    if (sl) mul *= sl.value;
    return mul;
  }

  outgoingMul(kind: MoveDef['kind'] | 'projectile'): number {
    let mul = this.stats.dmgMul;
    const d = this.buff('damage');
    if (d) mul *= d.value;
    if (this.inRage) mul *= 1.1;
    if (this.passive === 'rage' && this.health < this.stats.maxHealth * 0.3) mul *= 1.25;
    if (this.passive === 'powerSurge' && (kind === 'special' || kind === 'projectile')) mul *= 1.2;
    return mul;
  }

  incomingMul(projectile: boolean): number {
    let mul = this.stats.defMul;
    const d = this.buff('defense');
    if (d) mul *= d.value;
    if (projectile && this.passive === 'projectileProof') mul *= 0.5;
    return mul;
  }

  heal(amount: number): void {
    this.health = Math.min(this.stats.maxHealth, this.health + amount);
    this.recoverable = Math.max(0, this.recoverable - amount);
  }

  gainMeter(n: number): void {
    this.meter = Math.max(0, Math.min(MAX_METER, this.meter + n * this.stats.meterMul));
  }

  /** Applies damage. Returns true if the lifeline passive saved the fighter. */
  takeDamage(amount: number, m: Match, canLifeline = true): boolean {
    const dmg = Math.max(0, Math.round(amount));
    if (this.health - dmg <= 0 && canLifeline && this.passive === 'lifeline' && !this.lifelineUsed && !m.training) {
      this.lifelineUsed = true;
      this.health = 1;
      this.invuln = 50;
      m.emit({ t: 'lifeline', fighter: this.index, name: this.def.passive.name });
      return true;
    }
    this.health = Math.max(0, this.health - dmg);
    if (this.passive === 'regen') this.recoverable = Math.min(this.stats.maxHealth * 0.4, this.recoverable + dmg * 0.4);
    this.lastHurtFrame = m.frame;
    if (this.inRage && !this.rageAnnounced) {
      this.rageAnnounced = true;
      m.emit({ t: 'rage', fighter: this.index });
    }
    return false;
  }

  // ---------------------------------------------------------------- queries

  isInvuln(kind: InvulnKind): boolean {
    if (this.invuln > 0) return true;
    if (this.throwExec) return true;
    switch (this.state) {
      case 'getup': case 'techroll': case 'ko': case 'cinematic': case 'thrown': case 'intro': case 'victory':
        return true;
      case 'knockdown':
        return kind !== 'strike';
    }
    if (this.juggleInvuln) return true;
    if (this.state === 'backdash' && this.passive === 'quickRecovery' && this.stateFrame < 10) return true;
    const mv = this.move;
    if (this.state === 'attack' && mv?.invuln) {
      for (const r of mv.invuln) {
        if (this.moveFrame >= r.from && this.moveFrame <= r.to && (r.kind === 'full' || r.kind === kind)) return true;
      }
    }
    return false;
  }

  canBlock(): boolean {
    if (!this.grounded || this.noGuard) return false;
    switch (this.state) {
      case 'idle': case 'walkB': case 'crouch': case 'blockstun': case 'backdash':
        return true;
      case 'land':
        return this.stateFrame > 1;
    }
    return false;
  }

  /** Tekken guard: standing (neutral or back) blocks highs and mids; crouching blocks lows. */
  blockOK(guard: GuardType): boolean {
    if (guard === 'unblockable') return false;
    const d = this.relDir;
    const crouching = this.state === 'crouch' || d === 1 || d === 2;
    if (guard === 'low') return crouching && (d === 1 || d === 2);
    if (crouching) return false;
    return d === 5 || isBack(d);
  }

  isCounterable(): boolean {
    const mv = this.move;
    return this.state === 'attack' && !!mv && this.moveFrame <= mv.startup + mv.active && mv.kind !== 'throw';
  }

  inCounterWindow(): boolean {
    const w = this.move?.counterWindow;
    return this.state === 'attack' && !!w && this.moveFrame >= w.from && this.moveFrame <= w.to;
  }

  hasArmor(): boolean {
    if (this.buff('armor')) return true;
    const mv = this.move;
    if (this.state !== 'attack' || !mv || this.armorLeft <= 0) return false;
    if (mv.armor && this.moveFrame >= mv.armor.from && this.moveFrame <= mv.armor.to) return true;
    if (this.passive === 'heavyArmor' && mv.tag === 'heavy' && this.moveFrame <= mv.startup + 1) return true;
    return false;
  }

  consumeArmor(): void {
    const b = this.buff('armor');
    if (b) {
      b.value -= 1;
      if (b.value <= 0) b.frames = 0;
      return;
    }
    this.armorLeft--;
  }

  get radius(): number {
    return 0.28 * Math.min(1.3, this.def.look.build);
  }

  /** World-space cylinder hurtboxes. */
  hurtboxes(): Cyl[] {
    switch (this.state) {
      case 'getup': case 'techroll': case 'ko': case 'intro': case 'victory':
        return [];
      case 'knockdown':
        return [{ x: this.x, z: this.z, y: 0.2, h: 0.4, r: 0.5 }];
    }
    const hs = this.def.look.height;
    const r = this.radius;
    const out: Cyl[] = [];
    if (this.state === 'wallsplat') {
      out.push({ x: this.x, z: this.z, y: this.y + 0.9, h: 1.8, r });
    } else if (!this.grounded || this.state === 'air' || this.state === 'juggle' || this.state === 'fall') {
      out.push({ x: this.x, z: this.z, y: this.y + 0.95 * hs, h: 1.3 * hs, r });
    } else if (this.isCrouching) {
      out.push({ x: this.x, z: this.z, y: 0.55 * hs, h: 1.1 * hs, r: r + 0.04 });
    } else {
      out.push({ x: this.x, z: this.z, y: 0.9 * hs, h: 1.8 * hs, r });
    }
    const mv = this.move;
    if (this.state === 'attack' && mv?.hitbox && mv.kind === 'normal' && this.moveFrame > mv.startup) {
      const p = this.ahead(mv.hitbox.x * 0.85);
      out.push({ x: p.x, z: p.z, y: this.y + mv.hitbox.y, h: mv.hitbox.h * 0.8, r: 0.16 });
    }
    return out;
  }

  /** Active attack box (local frame) this frame, if any. */
  activeHitbox(): Box | null {
    const mv = this.move;
    if (this.state !== 'attack' || !mv?.hitbox || !mv.hit) return null;
    const f = this.moveFrame;
    if (f <= mv.startup || f > mv.startup + mv.active) return null;
    if (mv.maxHits !== undefined && this.moveHits >= mv.maxHits) return null;
    if (this.moveHits > 0) {
      if (!mv.rehit) return null;
      if (f - this.moveLastHit < mv.rehit) return null;
    }
    return mv.hitbox;
  }

  canUse(mv: MoveDef, m: Match): boolean {
    if (mv.meterCost && this.meter < mv.meterCost && !m.infiniteMeter(this) && !(mv.kind === 'super' && this.inRage && !this.rageArtUsed)) return false;
    if ((this.cooldowns.get(mv.id) ?? 0) > 0) return false;
    if (mv.canStart && !mv.canStart(this, m)) return false;
    return true;
  }

  // ---------------------------------------------------------------- update

  update(m: Match): void {
    this.stateFrame++;
    if (this.invuln > 0) this.invuln--;
    if (this.flash > 0) this.flash--;
    if (this.wsFrames > 0) this.wsFrames--;
    this.tickBuffs(m);

    switch (this.state) {
      case 'intro': case 'victory': case 'ko': case 'cinematic': case 'thrown':
        return;
      case 'idle': case 'walkF': case 'walkB': case 'crouch':
        this.neutral(m);
        return;
      case 'jumpSquat':
        this.jumpSquat(m);
        return;
      case 'air':
        this.airUpdate(m);
        return;
      case 'land':
        if (this.stateFrame >= this.landLag) this.toNeutral();
        return;
      case 'dash': case 'run': case 'backdash':
        this.dashUpdate(m);
        return;
      case 'sidestep': case 'sidewalk':
        this.sidestepUpdate(m);
        return;
      case 'attack':
        this.attackUpdate(m);
        return;
      case 'hitstun': case 'blockstun': case 'dizzy':
        this.stun--;
        if (this.stun <= 0) {
          this.crumpled = false;
          this.toNeutral();
        }
        return;
      case 'wallsplat':
        this.stun--;
        if (this.stun <= 0) this.enterJuggle(0.02, -this.dirX * 0.01, -this.dirZ * 0.01);
        return;
      case 'knockdown': {
        const acted = this.input.dir !== 5 || (this.input.pressed & ATTACKS) !== 0;
        if ((this.stateFrame >= KNOCKDOWN_MIN && acted) || this.stateFrame >= this.knockdownFrames) {
          this.setState('getup');
        }
        return;
      }
      case 'getup':
        if (this.stateFrame >= GETUP_FRAMES) {
          this.faceOpponent();
          this.toNeutral();
        }
        return;
      case 'techroll': {
        const t = this.stateFrame / TECHROLL_FRAMES;
        const sp = 0.075 * Math.sin(Math.PI * Math.min(1, t));
        this.vx = this.sideX * sp;
        this.vz = this.sideZ * sp;
        if (this.stateFrame >= TECHROLL_FRAMES) {
          this.vx = this.vz = 0;
          this.faceOpponent();
          this.toNeutral();
        }
        return;
      }
      case 'fall': case 'juggle':
        return;
    }
  }

  private tickBuffs(m: Match): void {
    if (this.buffs.length) {
      for (const b of this.buffs) {
        b.frames--;
        if (b.kind === 'regen') this.heal(b.value);
        if (b.kind === 'meter') this.gainMeter(b.value);
      }
      this.buffs = this.buffs.filter((b) => b.frames > 0);
    }
    if (this.cooldowns.size) {
      for (const [k, v] of this.cooldowns) {
        if (v <= 1) this.cooldowns.delete(k);
        else this.cooldowns.set(k, v - 1);
      }
    }
    if (this.passive === 'regen' && this.recoverable > 0 && m.frame - this.lastHurtFrame > 90 && this.health > 0) {
      const amt = Math.min(this.recoverable, 0.35);
      this.health = Math.min(this.stats.maxHealth, this.health + amt);
      this.recoverable -= amt;
    }
  }

  toNeutral(): void {
    this.move = null;
    this.pendingString = null;
    this.fallMove = null;
    this.throwExec = null;
    this.comboHits = 0;
    this.comboDamage = 0;
    this.juggleCount = 0;
    this.juggleInvuln = false;
    this.screwed = false;
    this.airAttackUsed = false;
    this.airJumps = 0;
    this.stun = 0;
    this.spin = 0;
    if (this.grounded) {
      this.vx = this.vz = 0;
      this.setState(isDown(this.relDir) ? 'crouch' : 'idle');
    } else {
      this.setState('air');
    }
  }

  private startSidestep(towardCamera: boolean, m: Match): void {
    const n = m.camN;
    const s = towardCamera ? 1 : -1;
    this.sideX = n.x * s;
    this.sideZ = n.z * s;
    this.sidestepDir = s;
    this.setState('sidestep');
  }

  private neutral(m: Match): void {
    this.turnToOpponent(0.4);
    this.relDir = toRelative(this.input.dir, this.facing);
    const d = this.relDir;
    const h = this.history;

    // Leaving a crouch opens the "while standing" window; a quick down-tap is a sidestep.
    if (this.state === 'crouch' && !isDown(d)) {
      this.wsFrames = 12;
      if (d === 5 && this.stateFrame <= 5 && this.crouchEnteredFromStand && !h.buffered(ATTACKS, 3)) {
        this.startSidestep(true, m);
        return;
      }
    }
    if (this.tryAttack(m, false)) return;

    if (h.buffered(BTN.SS, 3)) {
      h.consume(BTN.SS, 3);
      this.startSidestep(isDown(d), m);
      return;
    }
    if (h.dash(true)) {
      this.dashDir = 1;
      this.setState('dash');
      return;
    }
    if (h.dash(false)) {
      this.dashDir = -1;
      this.setState('backdash');
      return;
    }
    if (isUp(d)) {
      this.jumpDir = d === 9 ? 1 : d === 7 ? -1 : 0;
      this.setState('jumpSquat');
      return;
    }
    if (isDown(d)) {
      if (this.state !== 'crouch') this.crouchEnteredFromStand = this.state === 'idle' || this.state === 'walkF' || this.state === 'walkB';
      this.setState('crouch');
      this.guarding = !this.noGuard && (d === 1 || d === 2) && m.isThreatened(this);
      return;
    }
    if (d === 6) {
      this.setState('walkF');
      this.guarding = false;
      return;
    }
    if (d === 4) {
      this.setState('walkB');
      this.guarding = !this.noGuard && m.isThreatened(this);
      return;
    }
    this.guarding = !this.noGuard && m.isThreatened(this);
    this.setState('idle');
  }

  /** Tekken: tapping up sidesteps into the background, holding up jumps. */
  private jumpSquat(m: Match): void {
    this.relDir = toRelative(this.input.dir, this.facing);
    if (this.stateFrame <= 5 && this.tryAttack(m, false)) return;
    if (!isUp(this.relDir) && this.stateFrame <= 5) {
      this.startSidestep(false, m);
      return;
    }
    if (this.stateFrame >= 6) this.takeoff(m);
  }

  private takeoff(m: Match): void {
    this.vy = this.stats.jumpVy;
    this.y = 0.001;
    this.setForward(this.jumpDir * this.stats.jumpVx * this.speedMul());
    this.airAttackUsed = false;
    this.airJumps = 0;
    this.setState('air');
    m.emit({ t: 'jump', fighter: this.index });
  }

  private airUpdate(m: Match): void {
    if (!this.airAttackUsed && this.tryAttack(m, true)) {
      this.airAttackUsed = true;
      return;
    }
    if (this.passive === 'doubleJump' && this.airJumps < 1 && this.stateFrame > 6) {
      const dirs = this.history.dirs;
      const n = dirs.length;
      if (n >= 2 && isUp(dirs[n - 1]) && !isUp(dirs[n - 2])) {
        this.airJumps++;
        const jd = dirs[n - 1] === 9 ? 1 : dirs[n - 1] === 7 ? -1 : 0;
        this.vy = this.stats.jumpVy * 0.85;
        this.setForward(jd * this.stats.jumpVx);
        m.emit({ t: 'jump', fighter: this.index });
      }
    }
  }

  private dashUpdate(m: Match): void {
    const spd = this.speedMul();
    if (this.state === 'dash') {
      this.turnToOpponent(0.2);
      if (this.tryAttack(m, false)) return;
      const len = 14;
      const t = this.stateFrame / len;
      this.setForward(this.stats.dash * spd * Math.sin(Math.PI * Math.min(1, t * 0.85 + 0.15)));
      if (this.stateFrame >= len) {
        if (this.relDir === 6 || this.relDir === 9 || this.relDir === 3) this.setState('run');
        else {
          this.vx = this.vz = 0;
          this.toNeutral();
        }
      }
    } else if (this.state === 'run') {
      this.turnToOpponent(0.1);
      if (this.tryAttack(m, false)) return;
      const run = this.stats.run * spd * Math.min(1.35, 1 + this.stateFrame / 40);
      this.setForward(run);
      const o = this.opponent!;
      if (this.relDir !== 6 && this.relDir !== 9 && this.relDir !== 3) {
        this.vx = this.vz = 0;
        this.toNeutral();
      } else if (this.distTo(o) < 0.75) {
        this.vx = this.vz = 0;
        this.toNeutral();
      }
    } else {
      // Backdash: cancellable into another backdash (Korean backdash).
      const len = 20;
      if (this.stateFrame > 9 && this.history.dash(false)) this.stateFrame = 0;
      const t = this.stateFrame / len;
      this.setForward(-this.stats.dash * 0.85 * spd * Math.max(0, 1 - t) ** 1.4);
      if (this.stateFrame >= 8 && this.tryAttack(m, false)) return;
      if (this.stateFrame >= len) {
        this.vx = this.vz = 0;
        this.toNeutral();
      }
    }
  }

  private sidestepUpdate(m: Match): void {
    if (this.state === 'sidestep') {
      const len = 18;
      const t = this.stateFrame / len;
      const sp = 0.1 * Math.sin(Math.PI * Math.min(1, t)) * this.speedMul();
      this.vx = this.sideX * sp;
      this.vz = this.sideZ * sp;
      if (this.stateFrame >= 8 && this.tryAttack(m, false)) return;
      if (this.stateFrame >= len) {
        if (this.input.held & BTN.SS) this.setState('sidewalk');
        else {
          this.vx = this.vz = 0;
          this.toNeutral();
        }
      }
    } else {
      // Sidewalk: circle the opponent while L1 is held.
      const o = this.opponent!;
      const ox = this.x - o.x;
      const oz = this.z - o.z;
      const r = Math.hypot(ox, oz) || 1;
      const tx = -oz / r;
      const tz = ox / r;
      const s = Math.sign(tx * this.sideX + tz * this.sideZ) || 1;
      const sp = 0.045 * this.speedMul();
      // Tangential steps alone spiral outward; pull in by the chord error to keep the radius.
      const inward = (sp * sp) / (2 * r);
      this.vx = tx * s * sp - (ox / r) * inward;
      this.vz = tz * s * sp - (oz / r) * inward;
      this.sideX = tx * s;
      this.sideZ = tz * s;
      this.turnToOpponent(0.08);
      if (this.tryAttack(m, false)) return;
      if (!(this.input.held & BTN.SS)) {
        this.vx = this.vz = 0;
        this.toNeutral();
      }
    }
  }

  // ---------------------------------------------------------------- attacks

  private pickSpecial(air: boolean): [MoveDef, number] | null {
    const h = this.history;
    const d = this.relDir;
    let idx = -1;
    let str = 0.5;
    if (h.buffered(BTN.SP)) {
      idx = isDown(d) ? 2 : d === 6 || d === 9 ? 1 : 0;
    } else {
      const p = h.buffered(PUNCHES);
      const k = h.buffered(KICKS);
      if (p && h.motion('dp')) {
        idx = 2;
        str = p & BTN.HP ? 1 : 0;
      } else if (p && h.motion('qcf')) {
        idx = 0;
        str = p & BTN.HP ? 1 : 0;
      } else if (k && h.motion('qcb')) {
        idx = 1;
        str = k & BTN.HK ? 1 : 0;
      }
    }
    if (idx < 0) return null;
    const mv = this.moves.specials[idx];
    if (air && !mv.airOK) return null;
    return [mv, str];
  }

  /** Tekken input → move. 1 = LP, 2 = HP, 3 = LK, 4 = HK; directions are relative to facing. */
  private pickNormal(air: boolean): NormalId | null {
    const b = this.history.buffered(ATTACKS);
    if (!b) return null;
    const one = (b & BTN.LP) !== 0;
    const two = (b & BTN.HP) !== 0;
    const three = (b & BTN.LK) !== 0;
    const four = (b & BTN.HK) !== 0;
    if (air) return three || four ? 'jKick' : 'jPunch';
    const d = this.relDir;
    if ((this.state === 'dash' || this.state === 'run') && two) return 'dash2';
    if (this.wsFrames > 0 && !isDown(d)) {
      if (two) return 'ws2';
      if (four) return 'ws4';
    }
    switch (d) {
      case 3:
        return four ? 'dfKick4' : two ? 'launcher' : three ? 'dfKick' : 'dfJab';
      case 2:
        return four ? 'shin' : two ? 'dStraight' : three ? 'lowKick' : 'dJab';
      case 1:
        return four ? 'sweep' : two ? 'dStraight' : three ? 'lowKick' : 'dJab';
      case 6:
        return four ? 'knee' : two ? 'power' : three ? 'lkick' : 'jab';
      case 4:
        return four ? 'spin4' : two ? 'bhook' : three ? 'lkick' : 'elbow';
      case 9:
        if (four) return 'ufKnee';
        break;
    }
    return four ? 'rkick' : two ? 'straight' : three ? 'lkick' : one ? 'jab' : null;
  }

  private wantsThrow(): boolean {
    const h = this.history;
    return h.buffered(BTN.TH) !== 0 || h.pressedTogether(BTN.LP, BTN.LK) || h.pressedTogether(BTN.HP, BTN.HK);
  }

  private tryUltimate(m: Match): boolean {
    const h = this.history;
    const ult = this.moves.ultimate;
    const rageArt = this.inRage && !this.rageArtUsed;
    if (this.meter < ULT_COST && !m.infiniteMeter(this) && !rageArt) return false;
    if (h.buffered(BTN.UL) || (h.buffered(PUNCHES) && h.motion('dqcf'))) {
      if (this.canUse(ult, m)) {
        h.consume(BTN.UL | ATTACKS | BTN.SP);
        if (this.meter < ULT_COST && !m.infiniteMeter(this)) {
          this.rageArtUsed = true;
          this.startMove({ ...ult, meterCost: 0 }, 1, m);
        } else {
          this.startMove(ult, 1, m);
        }
        return true;
      }
    }
    return false;
  }

  private trySpecial(m: Match, air: boolean): boolean {
    const sp = this.pickSpecial(air);
    if (!sp) return false;
    const [mv, str] = sp;
    if (!this.canUse(mv, m)) return false;
    this.history.consume(ATTACKS | BTN.SP);
    this.startMove(mv, str, m);
    return true;
  }

  tryAttack(m: Match, air: boolean): boolean {
    if (!air && this.tryUltimate(m)) return true;
    if (this.trySpecial(m, air)) return true;
    if (!air && this.wantsThrow()) {
      this.history.consume(BTN.TH | ATTACKS);
      this.throwBack = isBack(this.relDir);
      this.startMove(this.moves.throw, 0.5, m);
      return true;
    }
    const n = this.pickNormal(air);
    if (n) {
      this.history.consume(ATTACKS);
      this.startMove(this.moves.normals[n], 0.5, m);
      return true;
    }
    return false;
  }

  startMove(mv: MoveDef, strength: number, m: Match): void {
    this.move = mv;
    this.moveFrame = 0;
    this.moveStrength = strength;
    this.moveHits = 0;
    this.moveLastHit = -99;
    this.moveConnected = false;
    this.moveHitConfirmed = false;
    this.pendingString = null;
    this.fallMove = null;
    this.armorLeft = mv.armor?.hits ?? (this.passive === 'heavyArmor' && mv.tag === 'heavy' ? 1 : 0);
    this.guarding = false;
    this.setState('attack');
    this.stateFrame = 0;
    if (mv.meterCost && !m.infiniteMeter(this)) this.meter = Math.max(0, this.meter - mv.meterCost);
    if (mv.cooldown) this.cooldowns.set(mv.id, mv.cooldown);
    if (this.grounded && !mv.air) this.vx = this.vz = 0;
    // Attacks commit to facing the opponent at startup (unless off-axis after a sidestep).
    if (this.grounded && this.offAxis() < 0.9) this.turnToOpponent(0.5);
    if (mv.superFreeze) {
      this.faceOpponent();
      m.superFlash(this, mv);
    } else if (mv.kind === 'special') {
      m.emit({ t: 'special', fighter: this.index, name: mv.name, color: mv.color ?? 0xffffff });
      this.gainMeter(2);
    } else if (mv.kind === 'normal' || mv.kind === 'throw') {
      m.emit({ t: 'whiff', fighter: this.index, heavy: mv.tag === 'heavy' || mv.tag === 'launcher' });
    }
    mv.onStart?.(this.ctx(m));
  }

  private attackUpdate(m: Match): void {
    const mv = this.move;
    if (!mv) {
      this.toNeutral();
      return;
    }
    this.moveFrame++;
    const f = this.moveFrame;

    if (mv.track && f <= mv.startup) this.turnToOpponent(mv.track);
    if (!mv.airborne && !mv.air && this.grounded) this.vx = this.vz = 0;
    if (mv.motion) {
      for (const seg of mv.motion) {
        if (f >= seg.from && f <= seg.to) {
          if (seg.vx !== undefined) this.setForward(seg.vx);
          if (seg.vy !== undefined) this.vy = seg.vy;
        }
      }
    }
    mv.onFrame?.(this.ctx(m), f);
    if (this.move !== mv) return;

    if (mv.throwRange && !this.throwExec && f > mv.startup && f <= mv.startup + mv.active) {
      m.tryGrab(this, mv);
      if (this.move !== mv) return;
    }

    // Tekken strings: buffered follow-ups come out once the active frames end.
    if (mv.strings && !this.pendingString) {
      const h = this.history;
      for (const b of ['LP', 'HP', 'LK', 'HK'] as const) {
        const next = mv.strings[b];
        if (next && h.buffered(BTN[b], 10)) {
          h.consume(BTN[b], 10);
          this.pendingString = this.moves.normals[next as NormalId] ?? null;
          break;
        }
      }
    }
    if (this.pendingString && f >= mv.startup + mv.active) {
      const next = this.pendingString;
      this.pendingString = null;
      this.startMove(next, 0.5, m);
      return;
    }

    if (this.moveConnected && f >= mv.startup && this.tryCancel(m, mv)) return;

    const recovery = this.moveHitConfirmed && mv.hitRecovery !== undefined ? mv.hitRecovery : mv.recovery;
    const total = mv.startup + mv.active + recovery;
    if (mv.airborne) {
      if (f >= mv.startup + mv.active && !this.grounded) {
        this.fallMove = mv;
        this.landLag = mv.recovery;
        this.move = null;
        this.setState('fall');
      } else if (f >= total) {
        this.endMove(m);
      }
      return;
    }
    if (f >= total) this.endMove(m);
  }

  private tryCancel(m: Match, mv: MoveDef): boolean {
    if (mv.kind === 'normal') {
      if (mv.cancel?.includes('super') && this.tryUltimate(m)) return true;
      if (mv.cancel?.includes('special') && this.trySpecial(m, !!mv.air)) return true;
    } else if (mv.kind === 'special' && this.moveHitConfirmed && mv.cancel?.includes('super')) {
      if (this.tryUltimate(m)) return true;
    }
    return false;
  }

  endMove(m: Match): void {
    const mv = this.move;
    if (mv?.onEnd) mv.onEnd(this.ctx(m));
    this.move = null;
    this.throwExec = null;
    if (this.grounded) {
      this.toNeutral();
    } else {
      this.setState(mv?.air ? 'air' : 'fall');
      if (mv?.air) this.airAttackUsed = true;
      this.landLag = 4;
    }
  }

  /** Dive kicks bounce off on hit. */
  bounceOff(): void {
    if (this.move) {
      this.fallMove = null;
      this.landLag = 6;
      this.move = null;
    }
    this.setForward(-0.07);
    this.vy = 0.16;
    this.setState('fall');
  }

  // ---------------------------------------------------------------- reactions

  enterHitstun(frames: number, high: boolean, heavy: boolean): void {
    this.move = null;
    this.pendingString = null;
    this.fallMove = null;
    this.throwExec = null;
    this.stun = Math.max(1, Math.round(frames * (this.passive === 'ironWill' ? 0.85 : 1)));
    this.hitHigh = high;
    this.lastHitHeavy = heavy;
    this.guarding = false;
    this.crumpled = false;
    this.state = 'hitstun';
    this.stateFrame = 0;
  }

  enterBlockstun(frames: number): void {
    this.move = null;
    this.pendingString = null;
    this.stun = frames;
    this.guarding = true;
    this.state = 'blockstun';
    this.stateFrame = 0;
  }

  /**
   * Airborne hit reaction; kx/kz is the horizontal knockback velocity in world space. Velocities
   * are given at normal speed and slowed by JUGGLE_VY_SCALE (the Tekken float).
   */
  enterJuggle(vy: number, kx: number, kz: number): void {
    this.move = null;
    this.pendingString = null;
    this.fallMove = null;
    this.throwExec = null;
    this.juggleCount++;
    if (this.juggleCount > JUGGLE_LIMIT) this.juggleInvuln = true;
    this.vy = vy * JUGGLE_VY_SCALE;
    this.vx = kx * JUGGLE_VY_SCALE;
    this.vz = kz * JUGGLE_VY_SCALE;
    this.slideX = this.slideZ = 0;
    if (this.y <= 0) this.y = 0.01;
    this.state = 'juggle';
    this.stateFrame = 0;
  }

  enterDizzy(frames: number, crumple = false): void {
    this.move = null;
    this.pendingString = null;
    this.stun = frames;
    this.crumpled = crumple;
    this.state = 'dizzy';
    this.stateFrame = 0;
  }

  enterWallsplat(frames: number, m: Match): void {
    this.move = null;
    this.vx = this.vz = this.slideX = this.slideZ = 0;
    this.vy = 0;
    this.y = Math.min(Math.max(this.y, 0.15), 1.1);
    this.stun = frames;
    this.state = 'wallsplat';
    this.stateFrame = 0;
    m.emit({ t: 'wallsplat', fighter: this.index });
  }

  // ---------------------------------------------------------------- physics

  physics(m: Match): void {
    if (this.state === 'thrown' || this.state === 'cinematic') return;
    const spd = this.speedMul();
    switch (this.state) {
      case 'walkF':
        this.setForward(this.stats.walk * spd);
        break;
      case 'walkB':
        this.setForward(-this.stats.back * spd);
        break;
      case 'idle': case 'crouch': case 'land': case 'blockstun': case 'hitstun': case 'dizzy':
      case 'knockdown': case 'getup': case 'jumpSquat': case 'intro': case 'victory': case 'wallsplat':
        if (this.grounded) this.vx = this.vz = 0;
        break;
    }
    this.x += this.vx + this.slideX;
    this.z += this.vz + this.slideZ;
    const decay = this.grounded ? 0.84 : 0.95;
    this.slideX *= decay;
    this.slideZ *= decay;
    if (Math.abs(this.slideX) + Math.abs(this.slideZ) < 0.002) this.slideX = this.slideZ = 0;

    if (this.state === 'wallsplat') {
      // Pinned to the wall, sliding down slowly.
      this.y = Math.max(0.1, this.y - 0.006);
      return;
    }
    if (this.y > 0 || this.vy > 0) {
      const mv = this.move;
      const hovering = mv?.hover && this.state === 'attack' && this.moveFrame >= mv.hover.from && this.moveFrame <= mv.hover.to;
      if (hovering) this.vy = 0;
      else if (this.state === 'juggle') this.vy -= JUGGLE_GRAVITY * (1 + 0.08 * this.juggleCount);
      else this.vy -= this.stats.gravity;
      this.y += this.vy;
      if (this.state === 'juggle') this.spin += this.screwed ? 0.35 : 0;
      if (this.y <= 0) {
        this.y = 0;
        this.land(m);
      }
    }
  }

  private land(m: Match): void {
    const wasVy = this.vy;
    this.vy = 0;
    this.y = 0;
    switch (this.state) {
      case 'air':
        this.vx = this.vz = 0;
        this.landLag = 4;
        this.faceOpponent();
        this.setState('land');
        m.emit({ t: 'land', fighter: this.index, hard: false });
        break;
      case 'attack': {
        const mv = this.move;
        this.vx = this.vz = 0;
        if (mv?.airborne) {
          if (this.moveFrame <= 2) break;
          mv.onLand?.(this.ctx(m));
          this.landLag = mv.recovery;
        } else {
          this.landLag = mv?.air ? 5 : 2;
        }
        this.move = null;
        this.faceOpponent();
        this.setState('land');
        m.emit({ t: 'land', fighter: this.index, hard: false });
        break;
      }
      case 'fall': {
        this.vx = this.vz = 0;
        const fm = this.fallMove;
        if (fm?.onLand) {
          this.move = fm;
          fm.onLand(this.ctx(m));
          this.move = null;
        }
        this.fallMove = null;
        this.faceOpponent();
        this.setState('land');
        m.emit({ t: 'land', fighter: this.index, hard: false });
        break;
      }
      case 'juggle':
        this.vx = this.vz = 0;
        this.spin = 0;
        this.slideX = -this.dirX * 0.02;
        this.slideZ = -this.dirZ * 0.02;
        if (this.koed) {
          this.setState('ko');
        } else if (this.pendingDizzy > 0) {
          this.enterDizzy(this.pendingDizzy);
          this.pendingDizzy = 0;
        } else if (this.history.buffered(ATTACKS, 8) && !this.juggleInvuln) {
          // Tech roll: press a button as you hit the ground.
          this.history.consume(ATTACKS, 8);
          const n = m.camN;
          const s = this.index === 0 ? 1 : -1;
          this.sideX = n.x * s;
          this.sideZ = n.z * s;
          this.setState('techroll');
          m.emit({ t: 'techroll', fighter: this.index });
        } else {
          this.knockdownFrames = this.passive === 'quickRecovery' ? Math.round(KNOCKDOWN_MAX / 2) : KNOCKDOWN_MAX;
          this.setState('knockdown');
        }
        m.emit({ t: 'land', fighter: this.index, hard: true });
        m.emit({ t: 'shake', amount: Math.min(0.2, Math.abs(wasVy) * 0.6) });
        break;
      case 'ko':
        this.vx = this.vz = 0;
        m.emit({ t: 'land', fighter: this.index, hard: true });
        break;
      default:
        this.vx = this.vz = 0;
    }
  }
}
