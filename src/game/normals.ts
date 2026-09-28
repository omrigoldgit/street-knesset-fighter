// Universal normal moves, tuned per fighting style.

import type { FightStyle } from './characterTypes';
import type { AnimKey, Box, GuardType, HitDef, MoveDef } from './types';

export type NormalId =
  | 'jab' | 'strong' | 'short' | 'roundhouse'
  | 'cJab' | 'cStrong' | 'cShort' | 'sweep'
  | 'jJab' | 'jStrong' | 'jShort' | 'jRoundhouse'
  | 'overhead';

interface NormalSpec {
  id: NormalId;
  name: string;
  anim: AnimKey;
  s: number;
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
  chain?: NormalId[];
  cancel?: boolean;
  knockdown?: boolean;
  launch?: number;
  motion?: MoveDef['motion'];
}

const SPECS: NormalSpec[] = [
  { id: 'jab', name: 'Jab', anim: 'jab', s: 4, a: 2, r: 7, box: { x: 0.62, y: 1.42, w: 0.6, h: 0.3 }, dmg: 30, hs: 14, bs: 10, guard: 'mid', push: 0.07, chain: ['jab', 'strong', 'short', 'roundhouse'], cancel: true },
  { id: 'strong', name: 'Straight', anim: 'strong', s: 8, a: 3, r: 16, box: { x: 0.74, y: 1.38, w: 0.72, h: 0.36 }, dmg: 70, hs: 19, bs: 15, guard: 'mid', push: 0.11, heavy: true, cancel: true, motion: [{ from: 4, to: 9, vx: 0.03 }] },
  { id: 'short', name: 'Low Kick', anim: 'short', s: 5, a: 3, r: 9, box: { x: 0.68, y: 0.62, w: 0.64, h: 0.34 }, dmg: 35, hs: 14, bs: 10, guard: 'mid', push: 0.08, chain: ['strong', 'roundhouse'], cancel: true },
  { id: 'roundhouse', name: 'Roundhouse', anim: 'roundhouse', s: 10, a: 3, r: 18, box: { x: 0.84, y: 1.25, w: 0.84, h: 0.44 }, dmg: 82, hs: 20, bs: 15, guard: 'mid', push: 0.14, heavy: true, cancel: true },
  { id: 'cJab', name: 'Crouch Jab', anim: 'cJab', s: 4, a: 2, r: 7, box: { x: 0.62, y: 0.82, w: 0.58, h: 0.28 }, dmg: 25, hs: 13, bs: 9, guard: 'mid', push: 0.07, low: true, chain: ['cJab', 'cShort', 'cStrong', 'sweep', 'strong'], cancel: true },
  { id: 'cStrong', name: 'Uppercut', anim: 'cStrong', s: 7, a: 4, r: 18, box: { x: 0.48, y: 1.5, w: 0.66, h: 1.05 }, dmg: 70, hs: 19, bs: 14, guard: 'mid', push: 0.09, heavy: true, low: true, cancel: true, launch: 0.22 },
  { id: 'cShort', name: 'Shin Kick', anim: 'cShort', s: 5, a: 2, r: 9, box: { x: 0.74, y: 0.16, w: 0.74, h: 0.26 }, dmg: 25, hs: 13, bs: 9, guard: 'low', push: 0.07, low: true, chain: ['cJab', 'cStrong', 'sweep'], cancel: true },
  { id: 'sweep', name: 'Sweep', anim: 'sweep', s: 9, a: 4, r: 22, box: { x: 0.94, y: 0.16, w: 1.0, h: 0.28 }, dmg: 70, hs: 20, bs: 14, guard: 'low', push: 0.1, heavy: true, low: true, knockdown: true },
  { id: 'jJab', name: 'Air Jab', anim: 'jJab', s: 4, a: 8, r: 3, box: { x: 0.52, y: 0.78, w: 0.58, h: 0.4 }, dmg: 35, hs: 14, bs: 10, guard: 'overhead', push: 0.06, air: true },
  { id: 'jStrong', name: 'Air Hammer', anim: 'jStrong', s: 7, a: 5, r: 5, box: { x: 0.62, y: 0.62, w: 0.74, h: 0.5 }, dmg: 70, hs: 18, bs: 14, guard: 'overhead', push: 0.08, heavy: true, air: true },
  { id: 'jShort', name: 'Air Knee', anim: 'jShort', s: 5, a: 9, r: 3, box: { x: 0.56, y: 0.38, w: 0.62, h: 0.44 }, dmg: 40, hs: 15, bs: 11, guard: 'overhead', push: 0.06, air: true },
  { id: 'jRoundhouse', name: 'Flying Kick', anim: 'jRoundhouse', s: 8, a: 5, r: 5, box: { x: 0.74, y: 0.4, w: 0.84, h: 0.5 }, dmg: 82, hs: 18, bs: 14, guard: 'overhead', push: 0.09, heavy: true, air: true },
  { id: 'overhead', name: 'Overhead Chop', anim: 'overhead', s: 18, a: 3, r: 14, box: { x: 0.72, y: 1.3, w: 0.74, h: 0.66 }, dmg: 60, hs: 17, bs: 12, guard: 'overhead', push: 0.09, heavy: true, motion: [{ from: 3, to: 16, vx: 0.035 }] },
];

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
  zoner: { startup: 0, heavyStartup: 0, recovery: 0, damage: 0.95, reach: 0.12, hitstun: 0 },
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
    const startup = Math.max(3, s.s + mods.startup + (s.heavy ? mods.heavyStartup : 0));
    const recovery = Math.max(3, s.r + mods.recovery);
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
      launch: s.knockdown ? 0.12 : s.launch,
      meterGain: s.heavy ? 6 : 3,
    };
    out[s.id] = {
      id: s.id,
      name: s.name,
      kind: 'normal',
      anim: s.anim,
      startup,
      active: s.a,
      recovery,
      hitbox: { x: s.box.x + reach / 2, y: s.box.y, w: s.box.w + reach, h: s.box.h },
      hit,
      air: s.air,
      lowProfile: s.low,
      chain: s.chain,
      cancel: s.cancel ? ['special', 'super'] : undefined,
      motion: s.motion,
      tag: s.heavy ? 'heavy' : 'light',
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
    startup: 5,
    active: 3,
    recovery: 22,
    throwRange: 0.98 + (grappler ? 0.25 : 0) + (bouncer ? 0.3 : 0),
    throwDamage: Math.round(120 * (grappler ? 1.4 : 1) * (bouncer ? 1.6 : 1)),
    techable: true,
    tag: 'throw',
  };
}
