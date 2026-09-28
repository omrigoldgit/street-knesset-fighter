// Universal Tekken-style move list (1 = left punch, 2 = right punch, 3 = left kick, 4 = right kick),
// tuned per fighting style. Frame data follows Tekken conventions: "i" is the impact frame.

import type { FightStyle } from './characterTypes';
import { LAUNCHER } from './constants';
import type { AnimKey, Box, GuardType, HitDef, MoveDef } from './types';

export type NormalId =
  | 'jab' | 'jab2' | 'onetwo' | 'straight' | 'hook21' | 'lkick' | 'kick34' | 'rkick' | 'kick44'
  | 'dfJab' | 'dfJab2' | 'launcher' | 'dfKick' | 'dfKick4' | 'power' | 'knee' | 'elbow' | 'bhook'
  | 'spin4' | 'dJab' | 'dStraight' | 'lowKick' | 'shin' | 'sweep' | 'ufKnee' | 'ws2' | 'ws4'
  | 'dash2' | 'jPunch' | 'jKick';

type Btn = 'LP' | 'HP' | 'LK' | 'HK';

interface NormalSpec {
  id: NormalId;
  name: string;
  input: string;
  anim: AnimKey;
  /** Impact frame (Tekken "i" frames). */
  i: number;
  a: number;
  r: number;
  box: Box;
  dmg: number;
  hs: number;
  bs: number;
  guard: GuardType;
  push: number;
  heavy?: boolean;
  low?: boolean;
  air?: boolean;
  knockdown?: boolean;
  launch?: number;
  screw?: boolean;
  wall?: boolean;
  crumpleCH?: boolean;
  otg?: boolean;
  track?: number;
  strings?: Partial<Record<Btn, NormalId>>;
  motion?: MoveDef['motion'];
  desc?: string;
}

// Hitbox heights: highs at head height (whiff over crouchers), mids at the torso, lows at the shins.
const HIGH = (x: number, w: number, lw = 0.26): Box => ({ x, y: 1.46, w, h: 0.34, lw });
const MID = (x: number, w: number, lw = 0.26): Box => ({ x, y: 1.1, w, h: 0.56, lw });
const LOW = (x: number, w: number, lw = 0.3): Box => ({ x, y: 0.24, w, h: 0.42, lw });

const SPECS: NormalSpec[] = [
  { id: 'jab', name: 'Jab', input: '1', anim: 'jab', i: 10, a: 2, r: 16, box: HIGH(0.62, 0.62), dmg: 30, hs: 24, bs: 17, guard: 'high', push: 0.05, strings: { LP: 'jab2', HP: 'onetwo' }, desc: 'Fastest move. Beats almost everything up close.' },
  { id: 'jab2', name: 'Double Jab', input: '1,1', anim: 'jab2', i: 10, a: 2, r: 17, box: HIGH(0.62, 0.62), dmg: 30, hs: 24, bs: 17, guard: 'high', push: 0.06, strings: { HP: 'onetwo' } },
  { id: 'onetwo', name: 'One-Two', input: '1,2', anim: 'straight', i: 10, a: 3, r: 20, box: HIGH(0.7, 0.7), dmg: 45, hs: 26, bs: 18, guard: 'high', push: 0.1, heavy: true, desc: 'Classic natural combo.' },
  { id: 'straight', name: 'Right Straight', input: '2', anim: 'straight', i: 12, a: 3, r: 20, box: HIGH(0.72, 0.7), dmg: 45, hs: 25, bs: 17, guard: 'high', push: 0.08, strings: { LP: 'hook21' } },
  { id: 'hook21', name: 'Straight-Hook', input: '2,1', anim: 'hook', i: 13, a: 3, r: 24, box: HIGH(0.66, 0.7, 0.4), dmg: 55, hs: 28, bs: 16, guard: 'high', push: 0.16, heavy: true },
  { id: 'lkick', name: 'Left Mid Kick', input: '3', anim: 'midKick', i: 13, a: 3, r: 20, box: MID(0.8, 0.8), dmg: 40, hs: 24, bs: 16, guard: 'mid', push: 0.08, strings: { HK: 'kick34' }, desc: 'Fast mid: forces the opponent to stand.' },
  { id: 'kick34', name: 'Kick Combo', input: '3,4', anim: 'highKick', i: 14, a: 3, r: 26, box: HIGH(0.86, 0.9, 0.45), dmg: 60, hs: 26, bs: 14, guard: 'high', push: 0.14, heavy: true, knockdown: true, screw: true },
  { id: 'rkick', name: 'Right High Kick', input: '4', anim: 'highKick', i: 12, a: 3, r: 22, box: HIGH(0.86, 0.9, 0.42), dmg: 55, hs: 26, bs: 16, guard: 'high', push: 0.1, heavy: true, track: 0.03, strings: { HK: 'kick44' } },
  { id: 'kick44', name: 'Double Kick', input: '4,4', anim: 'kick2', i: 15, a: 3, r: 26, box: MID(0.9, 0.9), dmg: 60, hs: 28, bs: 14, guard: 'mid', push: 0.2, heavy: true, wall: true },
  { id: 'dfJab', name: 'Body Jab', input: 'd/f+1', anim: 'dfJab', i: 13, a: 2, r: 18, box: MID(0.66, 0.64), dmg: 35, hs: 24, bs: 17, guard: 'mid', push: 0.06, strings: { HP: 'dfJab2' }, desc: 'Safe mid poke.' },
  { id: 'dfJab2', name: 'Body Jab-Straight', input: 'd/f+1,2', anim: 'straight', i: 14, a: 3, r: 22, box: HIGH(0.72, 0.7), dmg: 45, hs: 26, bs: 16, guard: 'high', push: 0.12, heavy: true },
  { id: 'launcher', name: 'Launcher Uppercut', input: 'd/f+2', anim: 'launcher', i: 15, a: 3, r: 28, box: { x: 0.52, y: 1.2, w: 0.7, h: 0.9, lw: 0.28 }, dmg: 50, hs: 30, bs: 14, guard: 'mid', push: 0.04, heavy: true, launch: 0.17, desc: 'Launches on hit: follow up with a juggle combo. Punishable on block.' },
  { id: 'dfKick', name: 'Front Kick', input: 'd/f+3', anim: 'frontKick', i: 14, a: 3, r: 22, box: MID(0.84, 0.8), dmg: 45, hs: 24, bs: 16, guard: 'mid', push: 0.1 },
  { id: 'dfKick4', name: 'Side Kick', input: 'd/f+4', anim: 'kick2', i: 14, a: 3, r: 22, box: MID(0.9, 0.84), dmg: 50, hs: 24, bs: 16, guard: 'mid', push: 0.14 },
  { id: 'power', name: 'Power Straight', input: 'f+2', anim: 'power', i: 15, a: 3, r: 24, box: MID(0.8, 0.8), dmg: 60, hs: 28, bs: 16, guard: 'mid', push: 0.24, heavy: true, wall: true, crumpleCH: true, motion: [{ from: 4, to: 14, vx: 0.04 }], desc: 'Big knockback; crumples on counter hit; wall splats.' },
  { id: 'knee', name: 'Step-in Knee', input: 'f+4', anim: 'knee', i: 16, a: 3, r: 24, box: MID(0.62, 0.66), dmg: 60, hs: 28, bs: 15, guard: 'mid', push: 0.12, heavy: true, motion: [{ from: 3, to: 15, vx: 0.05 }] },
  { id: 'elbow', name: 'Elbow', input: 'b+1', anim: 'elbow', i: 13, a: 3, r: 20, box: MID(0.56, 0.6), dmg: 45, hs: 25, bs: 16, guard: 'mid', push: 0.1 },
  { id: 'bhook', name: 'Heavy Hook', input: 'b+2', anim: 'bHook', i: 15, a: 3, r: 24, box: HIGH(0.64, 0.72, 0.5), dmg: 60, hs: 28, bs: 15, guard: 'high', push: 0.18, heavy: true, track: 0.04 },
  { id: 'spin4', name: 'Spinning Heel', input: 'b+4', anim: 'spinBack', i: 18, a: 4, r: 26, box: HIGH(0.9, 1.0, 0.9), dmg: 75, hs: 30, bs: 14, guard: 'high', push: 0.18, heavy: true, knockdown: true, screw: true, track: 0.08, desc: 'Homing: catches sidesteps. Screws juggles.' },
  { id: 'dJab', name: 'Crouch Jab', input: 'd+1', anim: 'dJab', i: 10, a: 2, r: 16, box: { x: 0.6, y: 0.82, w: 0.6, h: 0.3, lw: 0.26 }, dmg: 20, hs: 22, bs: 16, guard: 'mid', push: 0.05, low: true },
  { id: 'dStraight', name: 'Crouch Straight', input: 'd+2', anim: 'dStraight', i: 12, a: 3, r: 20, box: { x: 0.68, y: 0.85, w: 0.7, h: 0.34, lw: 0.26 }, dmg: 30, hs: 24, bs: 16, guard: 'mid', push: 0.08, low: true },
  { id: 'lowKick', name: 'Low Kick', input: 'd+3', anim: 'lowKick', i: 16, a: 3, r: 24, box: LOW(0.82, 0.8), dmg: 30, hs: 22, bs: 13, guard: 'low', push: 0.06, low: true, otg: true },
  { id: 'shin', name: 'Shin Kick', input: 'd+4', anim: 'shin', i: 12, a: 2, r: 20, box: LOW(0.78, 0.74), dmg: 20, hs: 20, bs: 13, guard: 'low', push: 0.05, low: true, otg: true, desc: 'Fast low. Hits grounded opponents.' },
  { id: 'sweep', name: 'Sweep', input: 'd/b+4', anim: 'sweep', i: 20, a: 4, r: 30, box: LOW(0.96, 1.0, 0.6), dmg: 60, hs: 24, bs: 12, guard: 'low', push: 0.1, heavy: true, low: true, knockdown: true, launch: 0.1, otg: true, track: 0.04, desc: 'Low knockdown. Very punishable on block.' },
  { id: 'ufKnee', name: 'Rising Knee', input: 'u/f+4', anim: 'ufKnee', i: 15, a: 4, r: 28, box: { x: 0.5, y: 1.15, w: 0.7, h: 0.8, lw: 0.28 }, dmg: 50, hs: 30, bs: 14, guard: 'mid', push: 0.04, heavy: true, launch: 0.165, motion: [{ from: 2, to: 16, vx: 0.04 }], desc: 'Launcher that hops over lows.' },
  { id: 'ws2', name: 'Rising Uppercut', input: 'WS 2', anim: 'wsUpper', i: 14, a: 3, r: 26, box: { x: 0.52, y: 1.2, w: 0.7, h: 1.0, lw: 0.28 }, dmg: 50, hs: 30, bs: 14, guard: 'mid', push: 0.04, heavy: true, launch: 0.175, desc: 'While standing up from a crouch: launcher.' },
  { id: 'ws4', name: 'Rising Kick', input: 'WS 4', anim: 'wsKick', i: 12, a: 3, r: 22, box: MID(0.84, 0.84), dmg: 45, hs: 26, bs: 15, guard: 'mid', push: 0.14, heavy: true },
  { id: 'dash2', name: 'Dash Punch', input: 'f,f+2', anim: 'dashPunch', i: 16, a: 3, r: 26, box: MID(0.82, 0.8), dmg: 70, hs: 30, bs: 14, guard: 'mid', push: 0.3, heavy: true, wall: true, motion: [{ from: 1, to: 14, vx: 0.09 }], desc: 'Dashing blow: huge knockback, wall splats.' },
  { id: 'jPunch', name: 'Jumping Punch', input: 'jump 1/2', anim: 'jPunch', i: 8, a: 6, r: 6, box: { x: 0.56, y: 0.8, w: 0.62, h: 0.44, lw: 0.28 }, dmg: 40, hs: 22, bs: 15, guard: 'high', push: 0.06, air: true },
  { id: 'jKick', name: 'Jumping Kick', input: 'jump 3/4', anim: 'jKick', i: 9, a: 6, r: 6, box: { x: 0.7, y: 0.45, w: 0.8, h: 0.5, lw: 0.3 }, dmg: 55, hs: 24, bs: 15, guard: 'mid', push: 0.08, heavy: true, air: true },
];

export const NORMAL_LIST = SPECS.map((s) => ({ id: s.id, name: s.name, input: s.input, desc: s.desc, guard: s.guard }));

export interface StyleMods {
  startup: number;
  heavyStartup: number;
  recovery: number;
  damage: number;
  reach: number;
  hitstun: number;
}

export const STYLE_MODS: Record<FightStyle, StyleMods> = {
  balanced: { startup: 0, heavyStartup: 0, recovery: 0, damage: 1, reach: 0, hitstun: 0 },
  rushdown: { startup: -1, heavyStartup: -1, recovery: 0, damage: 0.94, reach: -0.03, hitstun: 0 },
  brawler: { startup: 0, heavyStartup: 1, recovery: 1, damage: 1.12, reach: 0, hitstun: 1 },
  grappler: { startup: 0, heavyStartup: 1, recovery: 0, damage: 1.05, reach: 0, hitstun: 0 },
  zoner: { startup: 0, heavyStartup: 0, recovery: 0, damage: 0.95, reach: 0.1, hitstun: 0 },
  technician: { startup: 0, heavyStartup: 0, recovery: -1, damage: 1, reach: 0.04, hitstun: 1 },
};

export const STYLE_INFO: Record<FightStyle, string> = {
  balanced: 'All-rounder',
  rushdown: 'Rushdown: fast pokes, fast feet',
  brawler: 'Brawler: slower, hits harder',
  grappler: 'Grappler: huge throws, sturdy',
  zoner: 'Zoner: long reach, keeps you out',
  technician: 'Technician: tight frames, big combos',
};

export function buildNormals(style: FightStyle, power: number): Record<NormalId, MoveDef> {
  const mods = STYLE_MODS[style];
  const out = {} as Record<NormalId, MoveDef>;
  for (const s of SPECS) {
    const startup = Math.max(6, s.i - 1 + mods.startup + (s.heavy ? mods.heavyStartup : 0));
    const recovery = Math.max(4, s.r + mods.recovery);
    const reach = s.heavy ? mods.reach : mods.reach * 0.5;
    const hit: HitDef = {
      damage: Math.round(s.dmg * mods.damage * power),
      chip: 0,
      hitstun: s.hs + mods.hitstun,
      blockstun: s.bs,
      guard: s.guard,
      pushback: s.push,
      spark: s.heavy ? 'heavy' : 'light',
      knockdown: s.knockdown,
      launch: s.launch ?? (s.knockdown ? 0.12 : undefined),
      // Launchers pop almost straight up so the follow-up stays in range.
      launchVx: (s.launch ?? 0) >= LAUNCHER ? 0.012 : undefined,
      meterGain: s.heavy ? 6 : 3,
      screw: s.screw,
      wall: s.wall,
      crumpleCH: s.crumpleCH,
      otg: s.otg,
      tracking: (s.box.lw ?? 0) >= 0.8,
    };
    out[s.id] = {
      id: s.id,
      name: s.name,
      kind: 'normal',
      anim: s.anim,
      startup,
      active: s.a,
      recovery,
      hitbox: { ...s.box, x: s.box.x + reach / 2, w: s.box.w + reach },
      hit,
      air: s.air,
      lowProfile: s.low,
      strings: s.strings,
      track: s.track,
      hitRecovery: (s.launch ?? 0) >= LAUNCHER ? 8 : undefined,
      cancel: ['special', 'super'],
      motion: s.motion,
      tag: s.launch && !s.knockdown ? 'launcher' : s.heavy ? 'heavy' : 'light',
      desc: s.desc,
    };
  }
  return out;
}

export function buildThrow(style: FightStyle, bouncer: boolean): MoveDef {
  const grappler = style === 'grappler';
  return {
    id: 'throw',
    name: 'Throw',
    kind: 'throw',
    anim: 'throw',
    startup: 11,
    active: 2,
    recovery: 28,
    throwRange: 1.0 + (grappler ? 0.2 : 0) + (bouncer ? 0.25 : 0),
    throwDamage: Math.round(120 * (grappler ? 1.4 : 1) * (bouncer ? 1.6 : 1)),
    techable: true,
    tag: 'throw',
  };
}
