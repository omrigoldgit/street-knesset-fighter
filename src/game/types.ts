// Core engine types. The engine is pure TypeScript with no rendering
// dependencies so it can be simulated headlessly in tests.

export const BTN = {
  LP: 1 << 0, // Light Punch   (Square)
  HP: 1 << 1, // Heavy Punch   (Triangle)
  LK: 1 << 2, // Light Kick    (Cross)
  HK: 1 << 3, // Heavy Kick    (Circle)
  SP: 1 << 4, // Special       (R1)
  UL: 1 << 5, // Ultimate      (R2)
  SS: 1 << 6, // Sidestep      (L1)
  TH: 1 << 7, // Throw         (L2)
  START: 1 << 8, // Pause      (Options)
  SELECT: 1 << 9, // Reset     (Create)
} as const;

export const PUNCHES = BTN.LP | BTN.HP;
export const KICKS = BTN.LK | BTN.HK;
export const ATTACKS = PUNCHES | KICKS;

/** One frame of player input. `dir` uses numpad notation in absolute screen space (6 = right). */
export interface PlayerInput {
  dir: number;
  held: number;
  pressed: number;
}

export const NO_INPUT: PlayerInput = Object.freeze({ dir: 5, held: 0, pressed: 0 });

export type GuardType = 'mid' | 'high' | 'low' | 'overhead' | 'unblockable';
export type SparkKind = 'light' | 'heavy' | 'special' | 'super';

/** Axis aligned box. For move definitions x is forward from the fighter's origin, y is up from the feet. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HitEffect {
  /** Dizzy the target for N frames. */
  stun?: number;
  /** Slow the target's movement for N frames. */
  slow?: number;
  /** Drain this much meter from the target and give it to the attacker. */
  drain?: number;
  /** Pull the target toward the attacker by this velocity. */
  pull?: number;
  /** Heal the attacker by this much on hit. */
  lifesteal?: number;
}

export interface HitDef {
  damage: number;
  chip?: number;
  hitstun: number;
  blockstun: number;
  guard: GuardType;
  /** Initial slide velocity applied to the defender (units / frame). */
  pushback: number;
  /** Launch the defender into the air with this vertical velocity. */
  launch?: number;
  launchVx?: number;
  knockdown?: boolean;
  hitstop?: number;
  meterGain?: number;
  spark?: SparkKind;
  /** Hits a sidestepping opponent. */
  tracking?: boolean;
  effect?: HitEffect;
}

export interface MotionSeg {
  from: number;
  to: number;
  vx?: number;
  vy?: number;
}

export interface FrameRange {
  from: number;
  to: number;
}

export type InvulnKind = 'full' | 'strike' | 'projectile' | 'throw';

export type AnimKey =
  | 'jab' | 'strong' | 'short' | 'roundhouse'
  | 'cJab' | 'cStrong' | 'cShort' | 'sweep'
  | 'jJab' | 'jStrong' | 'jShort' | 'jRoundhouse'
  | 'overhead' | 'throw' | 'throwExec'
  | 'cast' | 'charge' | 'uppercut' | 'grab' | 'grabExec' | 'counterStance' | 'counterStrike'
  | 'powerup' | 'vanish' | 'stomp' | 'diveKick' | 'place' | 'beam' | 'whip' | 'slamRise'
  | 'summon' | 'guardUp' | 'spinKick' | 'flurry' | 'ultCombo' | 'taunt';

export type MoveKind = 'normal' | 'special' | 'super' | 'throw';

/** Visual prop styles. The renderer knows how to build a mesh for each one. */
export type PropStyle =
  | 'orb' | 'ballot' | 'gavel' | 'book' | 'paper' | 'coin' | 'mic' | 'tv' | 'envelope'
  | 'phone' | 'bomb' | 'plane' | 'tomato' | 'brick' | 'bin' | 'cone' | 'train' | 'tank'
  | 'syringe' | 'sign' | 'megaphone' | 'watermelon' | 'chalk' | 'scissors' | 'tooth'
  | 'drill' | 'star' | 'flag' | 'wave' | 'sound' | 'dish' | 'shekel' | 'briefcase'
  | 'siren' | 'tower' | 'jet' | 'ball' | 'whistle' | 'fire' | 'snowflake' | 'leaf'
  | 'heart' | 'shield' | 'crane' | 'map' | 'clock' | 'chair' | 'laptop';

export interface MoveDef {
  id: string;
  name: string;
  kind: MoveKind;
  anim: AnimKey;
  startup: number;
  active: number;
  recovery: number;
  hitbox?: Box;
  hit?: HitDef;
  /** Frames between hits for multi-hit moves. */
  rehit?: number;
  maxHits?: number;
  motion?: MotionSeg[];
  invuln?: (FrameRange & { kind: InvulnKind })[];
  armor?: FrameRange & { hits: number };
  /** Move is performed in the air (keeps gravity). */
  air?: boolean;
  /** Fighter goes airborne during this move (e.g. rising uppercut). */
  airborne?: boolean;
  /** Uses the crouching hurtbox. */
  lowProfile?: boolean;
  /** Normals this move can chain into on hit or block. */
  chain?: string[];
  cancel?: ('special' | 'super')[];
  meterCost?: number;
  color?: number;
  prop?: PropStyle;
  /** Throw / command grab range. */
  throwRange?: number;
  throwDamage?: number;
  techable?: boolean;
  /** Global freeze frames for supers. */
  superFreeze?: number;
  /** Counter stance window (move frames). */
  counterWindow?: FrameRange;
  /** Overrides applied to the final hit of a multi-hit move. */
  finalHit?: Partial<HitDef>;
  /** Frames during which gravity is ignored and vertical velocity is zero. */
  hover?: FrameRange;
  /** Can be performed while airborne. */
  airOK?: boolean;
  /** Frames before this move can be used again. */
  cooldown?: number;
  /** For counter stances: the automatic follow-up strike. */
  counterMove?: MoveDef;
  /** Grab moves: connect into a cinematic instead of a normal throw. */
  grabCinematic?: { damage: number; name: string };
  /** Metadata for the AI and move list. */
  tag?: string;
  /** Short description for the move list. */
  desc?: string;
  canStart?: (fighter: import('./fighter').Fighter, match: import('./match').Match) => boolean;
  onStart?: (ctx: MoveCtx) => void;
  onFrame?: (ctx: MoveCtx, frame: number) => void;
  onHit?: (ctx: MoveCtx, blocked: boolean) => void;
  onLand?: (ctx: MoveCtx) => void;
  onEnd?: (ctx: MoveCtx) => void;
}

export interface MoveCtx {
  fighter: import('./fighter').Fighter;
  opponent: import('./fighter').Fighter;
  match: import('./match').Match;
  move: MoveDef;
  /** 0 = light version, 0.5 = shortcut, 1 = heavy version. */
  strength: number;
}

export type BuffKind = 'damage' | 'speed' | 'defense' | 'armor' | 'regen' | 'slow' | 'shield' | 'reflect' | 'meter';

export interface Buff {
  kind: BuffKind;
  value: number;
  frames: number;
  color: number;
}

export type GameEvent =
  | { t: 'hit'; x: number; y: number; spark: SparkKind; blocked: boolean; counter: boolean; attacker: number; defender: number; damage: number; color?: number }
  | { t: 'whiff'; fighter: number; heavy: boolean }
  | { t: 'special'; fighter: number; name: string; color: number }
  | { t: 'superFlash'; fighter: number; name: string; color: number }
  | { t: 'ko'; loser: number; perfect: boolean }
  | { t: 'announce'; text: string; sub?: string; big?: boolean; frames?: number }
  | { t: 'jump'; fighter: number }
  | { t: 'land'; fighter: number; hard: boolean }
  | { t: 'tech'; x: number; y: number }
  | { t: 'buff'; fighter: number; kind: BuffKind; color: number }
  | { t: 'teleport'; fighter: number; fromX: number; toX: number; color: number }
  | { t: 'lifeline'; fighter: number; name: string }
  | { t: 'rumble'; fighter: number; strong: number; weak: number; ms: number }
  | { t: 'shake'; amount: number }
  | { t: 'projectile'; id: number; owner: number }
  | { t: 'clash'; x: number; y: number }
  | { t: 'counterHit'; fighter: number }
  | { t: 'round'; n: number }
  | { t: 'fight' }
  | { t: 'timeout' }
  | { t: 'sfx'; name: string };
