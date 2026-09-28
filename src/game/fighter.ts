// Fighter: state machine, input interpretation and physics for one combatant.

import type { CharacterDef } from './characterTypes';
import {
  BASE_HEALTH, GETUP_FRAMES, GRAVITY, KNOCKDOWN_FRAMES, MAX_METER, ULT_COST,
} from './constants';
import { InputHistory, isBack, isDown, isForward, isUp, toRelative } from './motion';
import { buildNormals, buildThrow, type NormalId } from './normals';
import { buildSpecial, buildUltimate } from './specials';
import {
  ATTACKS, BTN, KICKS, NO_INPUT, PUNCHES,
  type Box, type Buff, type BuffKind, type GuardType, type InvulnKind, type MoveCtx, type MoveDef, type PlayerInput,
} from './types';
import type { Match } from './match';

export type FState =
  | 'intro' | 'idle' | 'walkF' | 'walkB' | 'crouch' | 'jumpSquat' | 'air' | 'land' | 'dash'
  | 'attack' | 'fall' | 'hitstun' | 'juggle' | 'blockstun' | 'dizzy' | 'knockdown' | 'getup'
  | 'thrown' | 'sidestep' | 'ko' | 'victory' | 'cinematic';

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
    walk: 0.052 * speed,
    back: 0.042 * speed,
    dash: 0.16 * speed,
    jumpVy: 0.3 * (s.jump ?? 1),
    jumpVx: 0.07 * speed,
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

  x = 0;
  y = 0;
  z = 0;
  vx = 0;
  vy = 0;
  slideVx = 0;
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
  sidestepDir = -1;

  health: number;
  recoverable = 0;
  lastHurtFrame = -999;
  meter = 0;
  stun = 0;
  juggleCount = 0;
  juggleInvuln = false;
  comboHits = 0;
  comboDamage = 0;
  invuln = 0;
  lifelineUsed = false;
  koed = false;
  pendingDizzy = 0;
  buffs: Buff[] = [];
  cooldowns = new Map<string, number>();

  history = new InputHistory();
  input: PlayerInput = NO_INPUT;
  relDir = 5;
  roundsWon = 0;

  // Presentation helpers read by the renderer.
  flash = 0;
  guarding = false;
  hitHigh = true;
  lastHitHeavy = false;
  knockdownFrames = KNOCKDOWN_FRAMES;
  victoryVariant = 0;

  constructor(index: number, def: CharacterDef) {
    this.index = index;
    this.def = def;
    this.moves = getMoveSet(def);
    this.stats = computeStats(def);
    this.health = this.stats.maxHealth;
  }

  get grounded(): boolean {
    return this.y <= 0 && this.vy <= 0;
  }

  get passive() {
    return this.def.passive.id;
  }

  get isCrouching(): boolean {
    if (this.state === 'crouch') return true;
    if ((this.state === 'blockstun' || this.state === 'hitstun') && this.relDir === 1 && this.grounded) return true;
    if (this.state === 'attack' && this.move?.lowProfile) return true;
    return false;
  }

  get actionable(): boolean {
    return this.state === 'idle' || this.state === 'walkF' || this.state === 'walkB' || this.state === 'crouch';
  }

  resetForRound(x: number, facing: number): void {
    this.x = x;
    this.y = 0;
    this.z = 0;
    this.vx = this.vy = this.slideVx = 0;
    this.facing = facing;
    this.state = 'idle';
    this.stateFrame = 0;
    this.move = null;
    this.fallMove = null;
    this.throwExec = null;
    this.grabbedBy = null;
    this.health = this.stats.maxHealth;
    this.recoverable = 0;
    this.stun = 0;
    this.juggleCount = 0;
    this.juggleInvuln = false;
    this.comboHits = 0;
    this.comboDamage = 0;
    this.invuln = 0;
    this.buffs = [];
    this.pendingDizzy = 0;
    this.cooldowns.clear();
    this.history.clear();
    this.flash = 0;
    this.guarding = false;
    if (this.passive === 'deepPockets') this.meter = Math.max(this.meter, 50);
  }

  setState(s: FState): void {
    if (this.state !== s) {
      this.state = s;
      this.stateFrame = 0;
    }
  }

  faceToward(x: number): void {
    if (Math.abs(x - this.x) > 0.02) this.facing = x > this.x ? 1 : -1;
  }

  faceOpponent(): void {
    if (this.opponent) this.faceToward(this.opponent.x);
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

  // ---------------------------------------------------------------- buffs

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
    return false;
  }

  // ---------------------------------------------------------------- queries

  isInvuln(kind: InvulnKind): boolean {
    if (this.invuln > 0) return true;
    if (this.throwExec) return true;
    switch (this.state) {
      case 'knockdown': case 'getup': case 'ko': case 'cinematic': case 'thrown': case 'intro': case 'victory':
        return true;
    }
    if (this.juggleInvuln) return true;
    if (this.state === 'dash' && this.dashDir < 0 && this.passive === 'quickRecovery' && this.stateFrame < 10) return true;
    const mv = this.move;
    if (this.state === 'attack' && mv?.invuln) {
      for (const r of mv.invuln) {
        if (this.moveFrame >= r.from && this.moveFrame <= r.to && (r.kind === 'full' || r.kind === kind)) return true;
      }
    }
    return false;
  }

  isEvading(): boolean {
    return this.state === 'sidestep' && this.stateFrame >= 2 && this.stateFrame <= 15;
  }

  canBlock(): boolean {
    if (!this.grounded) return false;
    switch (this.state) {
      case 'idle': case 'walkF': case 'walkB': case 'crouch': case 'blockstun':
        return true;
    }
    return false;
  }

  blockOK(guard: GuardType): boolean {
    if (guard === 'unblockable') return false;
    if (!isBack(this.relDir)) return false;
    const crouching = this.relDir === 1;
    if (guard === 'low') return crouching;
    if (guard === 'overhead' || guard === 'high') return !crouching;
    return true;
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

  /** World-space hurtboxes. */
  hurtboxes(): Box[] {
    switch (this.state) {
      case 'knockdown': case 'getup': case 'ko': case 'intro': case 'victory':
        return [];
    }
    const hs = this.def.look.height;
    const bw = 0.58 * Math.min(1.3, this.def.look.build);
    const out: Box[] = [];
    if (!this.grounded || this.state === 'air' || this.state === 'juggle' || this.state === 'fall') {
      out.push({ x: this.x, y: this.y + 0.95 * hs, w: bw, h: 1.3 * hs });
    } else if (this.isCrouching) {
      out.push({ x: this.x, y: 0.55 * hs, w: bw + 0.08, h: 1.1 * hs });
    } else {
      out.push({ x: this.x, y: 0.9 * hs, w: bw, h: 1.8 * hs });
    }
    const mv = this.move;
    if (this.state === 'attack' && mv?.hitbox && mv.kind === 'normal' && this.moveFrame > mv.startup) {
      const hb = this.worldBox(mv.hitbox);
      out.push({ x: hb.x - this.facing * hb.w * 0.1, y: hb.y, w: hb.w * 0.7, h: hb.h * 0.8 });
    }
    return out;
  }

  worldBox(b: Box): Box {
    return { x: this.x + this.facing * b.x, y: this.y + b.y, w: b.w, h: b.h };
  }

  /** Active hitbox this frame, if any. */
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
    return this.worldBox(mv.hitbox);
  }

  canUse(mv: MoveDef, m: Match): boolean {
    if (mv.meterCost && this.meter < mv.meterCost && !m.infiniteMeter(this)) return false;
    if ((this.cooldowns.get(mv.id) ?? 0) > 0) return false;
    if (mv.canStart && !mv.canStart(this, m)) return false;
    return true;
  }

  // ---------------------------------------------------------------- update

  update(m: Match): void {
    this.stateFrame++;
    if (this.invuln > 0) this.invuln--;
    if (this.flash > 0) this.flash--;
    this.tickBuffs(m);

    switch (this.state) {
      case 'intro': case 'victory': case 'ko': case 'cinematic': case 'thrown':
        return;
      case 'idle': case 'walkF': case 'walkB': case 'crouch':
        this.neutral(m);
        return;
      case 'jumpSquat':
        if (this.stateFrame >= 4) this.takeoff(m);
        return;
      case 'air':
        this.airUpdate(m);
        return;
      case 'land':
        if (this.stateFrame >= this.landLag) this.toNeutral();
        return;
      case 'dash':
        this.dashUpdate();
        return;
      case 'sidestep': {
        const t = this.stateFrame / 20;
        this.z = this.sidestepDir * Math.sin(Math.PI * Math.min(1, t)) * 0.9;
        if (this.stateFrame >= 20) {
          this.z = 0;
          this.toNeutral();
        }
        return;
      }
      case 'attack':
        this.attackUpdate(m);
        return;
      case 'hitstun': case 'blockstun': case 'dizzy':
        this.stun--;
        if (this.stun <= 0) this.toNeutral();
        return;
      case 'knockdown':
        if (this.stateFrame >= this.knockdownFrames) {
          this.setState('getup');
        }
        return;
      case 'getup':
        if (this.stateFrame >= GETUP_FRAMES) {
          this.faceOpponent();
          this.toNeutral();
        }
        return;
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
    this.fallMove = null;
    this.throwExec = null;
    this.comboHits = 0;
    this.comboDamage = 0;
    this.juggleCount = 0;
    this.juggleInvuln = false;
    this.airAttackUsed = false;
    this.airJumps = 0;
    this.stun = 0;
    this.z = 0;
    if (this.grounded) {
      this.vx = 0;
      this.setState(isDown(this.relDir) ? 'crouch' : 'idle');
    } else {
      this.setState('air');
    }
  }

  private neutral(m: Match): void {
    this.faceOpponent();
    this.relDir = toRelative(this.input.dir, this.facing);
    if (this.tryAttack(m, false)) return;
    const d = this.relDir;
    const h = this.history;

    if (h.buffered(BTN.SS, 3)) {
      h.consume(BTN.SS, 3);
      this.sidestepDir = isDown(d) ? 1 : -1;
      this.setState('sidestep');
      return;
    }
    if (h.dash(true)) {
      this.dashDir = 1;
      this.setState('dash');
      return;
    }
    if (h.dash(false)) {
      this.dashDir = -1;
      this.setState('dash');
      return;
    }
    if (isUp(d)) {
      this.jumpDir = d === 9 ? 1 : d === 7 ? -1 : 0;
      this.setState('jumpSquat');
      return;
    }
    if (isDown(d)) {
      this.setState('crouch');
      this.guarding = false;
      return;
    }
    if (d === 6) {
      this.setState('walkF');
      this.guarding = false;
      return;
    }
    if (d === 4) {
      this.setState('walkB');
      this.guarding = m.isThreatened(this);
      return;
    }
    this.guarding = false;
    this.setState('idle');
  }

  private takeoff(m: Match): void {
    this.vy = this.stats.jumpVy;
    this.y = 0.001;
    this.vx = this.jumpDir * this.stats.jumpVx * this.facing * this.speedMul();
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
        this.vx = jd * this.stats.jumpVx * this.facing;
        m.emit({ t: 'jump', fighter: this.index });
      }
    }
  }

  private dashUpdate(): void {
    const len = this.dashDir > 0 ? 16 : 20;
    const t = this.stateFrame / len;
    this.vx = this.facing * this.dashDir * this.stats.dash * this.speedMul() * Math.sin(Math.PI * Math.min(1, t)) * (this.dashDir > 0 ? 1 : 0.8);
    if (this.stateFrame >= len) {
      this.vx = 0;
      this.toNeutral();
    }
  }

  // ---------------------------------------------------------------- attacks

  private pickSpecial(air: boolean): [MoveDef, number] | null {
    const h = this.history;
    const d = this.relDir;
    let idx = -1;
    let str = 0.5;
    if (h.buffered(BTN.SP)) {
      idx = isDown(d) ? 2 : isForward(d) ? 1 : 0;
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

  private pickNormal(air: boolean): NormalId | null {
    const b = this.history.buffered(ATTACKS);
    if (!b) return null;
    const d = this.relDir;
    if (air) return b & BTN.HK ? 'jRoundhouse' : b & BTN.HP ? 'jStrong' : b & BTN.LK ? 'jShort' : 'jJab';
    if (isDown(d)) return b & BTN.HK ? 'sweep' : b & BTN.HP ? 'cStrong' : b & BTN.LK ? 'cShort' : 'cJab';
    if (d === 6 && b & BTN.HP) return 'overhead';
    return b & BTN.HK ? 'roundhouse' : b & BTN.HP ? 'strong' : b & BTN.LK ? 'short' : 'jab';
  }

  private wantsThrow(): boolean {
    const h = this.history;
    return h.buffered(BTN.TH) !== 0 || h.pressedTogether(BTN.LP, BTN.LK);
  }

  private tryUltimate(m: Match): boolean {
    const h = this.history;
    const ult = this.moves.ultimate;
    if (this.meter < ULT_COST && !m.infiniteMeter(this)) return false;
    if (h.buffered(BTN.UL) || (h.buffered(PUNCHES) && h.motion('dqcf'))) {
      if (this.canUse(ult, m)) {
        h.consume(BTN.UL | ATTACKS | BTN.SP);
        this.startMove(ult, 1, m);
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
      this.history.consume(BTN.TH | BTN.LP | BTN.LK);
      this.throwBack = this.relDir === 4 || this.relDir === 1 || this.relDir === 7;
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
    this.fallMove = null;
    this.armorLeft = mv.armor?.hits ?? (this.passive === 'heavyArmor' && mv.tag === 'heavy' ? 1 : 0);
    this.guarding = false;
    this.setState('attack');
    this.stateFrame = 0;
    if (mv.meterCost && !m.infiniteMeter(this)) this.meter -= mv.meterCost;
    if (mv.cooldown) this.cooldowns.set(mv.id, mv.cooldown);
    if (this.grounded && !mv.air) this.vx = 0;
    if (mv.superFreeze) {
      m.superFlash(this, mv);
    } else if (mv.kind === 'special') {
      m.emit({ t: 'special', fighter: this.index, name: mv.name, color: mv.color ?? 0xffffff });
      this.gainMeter(2);
    } else if (mv.kind === 'normal' || mv.kind === 'throw') {
      m.emit({ t: 'whiff', fighter: this.index, heavy: mv.tag === 'heavy' });
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

    if (!mv.airborne && !mv.air && this.grounded) this.vx = 0;
    if (mv.motion) {
      for (const seg of mv.motion) {
        if (f >= seg.from && f <= seg.to) {
          if (seg.vx !== undefined) this.vx = this.facing * seg.vx;
          if (seg.vy !== undefined) this.vy = seg.vy;
        }
      }
    }
    mv.onFrame?.(this.ctx(m), f);
    if (this.move !== mv) return; // hook changed the state

    // Kara-throw: a jab or short that turns into a throw on the next frames.
    if (f <= 2 && (mv.id === 'jab' || mv.id === 'short') && this.history.pressedTogether(BTN.LP, BTN.LK)) {
      this.history.consume(BTN.LP | BTN.LK);
      this.throwBack = this.relDir === 4;
      this.startMove(this.moves.throw, 0.5, m);
      return;
    }

    if (mv.throwRange && !this.throwExec && f > mv.startup && f <= mv.startup + mv.active) {
      m.tryGrab(this, mv);
      if (this.move !== mv) return;
    }

    if (this.moveConnected && f >= mv.startup && this.tryCancel(m, mv)) return;

    const total = mv.startup + mv.active + mv.recovery;
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
      if (mv.chain) {
        const n = this.pickNormal(!!mv.air);
        if (n && mv.chain.includes(n)) {
          this.history.consume(ATTACKS);
          this.startMove(this.moves.normals[n], 0.5, m);
          return true;
        }
      }
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
    this.vx = -this.facing * 0.07;
    this.vy = 0.16;
    this.setState('fall');
  }

  // ---------------------------------------------------------------- reactions

  enterHitstun(frames: number, high: boolean, heavy: boolean): void {
    this.move = null;
    this.fallMove = null;
    this.throwExec = null;
    this.stun = Math.max(1, Math.round(frames * (this.passive === 'ironWill' ? 0.85 : 1)));
    this.hitHigh = high;
    this.lastHitHeavy = heavy;
    this.guarding = false;
    this.state = 'hitstun';
    this.stateFrame = 0;
  }

  enterBlockstun(frames: number): void {
    this.stun = frames;
    this.guarding = true;
    this.state = 'blockstun';
    this.stateFrame = 0;
  }

  enterJuggle(vy: number, vx: number): void {
    this.move = null;
    this.fallMove = null;
    this.throwExec = null;
    this.juggleCount++;
    if (this.juggleCount > 5) this.juggleInvuln = true;
    this.vy = vy;
    this.vx = vx;
    this.slideVx = 0;
    if (this.y <= 0) this.y = 0.01;
    this.state = 'juggle';
    this.stateFrame = 0;
  }

  enterDizzy(frames: number): void {
    this.move = null;
    this.stun = frames;
    this.state = 'dizzy';
    this.stateFrame = 0;
  }

  // ---------------------------------------------------------------- physics

  physics(m: Match): void {
    if (this.state === 'thrown' || this.state === 'cinematic') return;
    const spd = this.speedMul();
    switch (this.state) {
      case 'walkF':
        this.vx = this.facing * this.stats.walk * spd;
        break;
      case 'walkB':
        this.vx = this.guarding ? 0 : -this.facing * this.stats.back * spd;
        break;
      case 'idle': case 'crouch': case 'land': case 'blockstun': case 'hitstun': case 'dizzy':
      case 'knockdown': case 'getup': case 'jumpSquat': case 'sidestep': case 'intro': case 'victory':
        if (this.grounded) this.vx = 0;
        break;
    }
    this.x += this.vx + this.slideVx;
    if (this.grounded) {
      this.slideVx *= 0.82;
      if (Math.abs(this.slideVx) < 0.002) this.slideVx = 0;
    } else {
      this.slideVx *= 0.95;
    }

    if (this.y > 0 || this.vy > 0) {
      const mv = this.move;
      const hovering = mv?.hover && this.state === 'attack' && this.moveFrame >= mv.hover.from && this.moveFrame <= mv.hover.to;
      if (hovering) this.vy = 0;
      else this.vy -= this.stats.gravity;
      this.y += this.vy;
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
        this.vx = 0;
        this.landLag = 3;
        this.faceOpponent();
        this.setState('land');
        m.emit({ t: 'land', fighter: this.index, hard: false });
        break;
      case 'attack': {
        const mv = this.move;
        this.vx = 0;
        if (mv?.airborne) {
          if (this.moveFrame <= 2) break;
          mv.onLand?.(this.ctx(m));
          this.landLag = mv.recovery;
        } else {
          this.landLag = mv?.air ? 4 : 2;
        }
        this.move = null;
        this.faceOpponent();
        this.setState('land');
        m.emit({ t: 'land', fighter: this.index, hard: false });
        break;
      }
      case 'fall': {
        this.vx = 0;
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
        this.vx = 0;
        this.slideVx = -this.facing * 0.03;
        if (this.koed) {
          this.setState('ko');
        } else if (this.pendingDizzy > 0) {
          this.enterDizzy(this.pendingDizzy);
          this.pendingDizzy = 0;
        } else {
          this.knockdownFrames = this.passive === 'quickRecovery' ? Math.round(KNOCKDOWN_FRAMES / 2) : KNOCKDOWN_FRAMES;
          this.setState('knockdown');
        }
        m.emit({ t: 'land', fighter: this.index, hard: true });
        m.emit({ t: 'shake', amount: Math.min(0.2, Math.abs(wasVy) * 0.5) });
        break;
      case 'ko':
        this.vx = 0;
        m.emit({ t: 'land', fighter: this.index, hard: true });
        break;
      default:
        this.vx = 0;
    }
  }
}
