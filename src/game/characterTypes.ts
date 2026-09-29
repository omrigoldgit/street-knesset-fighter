import type { BuffKind, HitEffect, PropStyle } from './types';

export type PartyId =
  | 'likud' | 'yeshatid' | 'nationalunity' | 'yashar' | 'shas' | 'utj' | 'rzp'
  | 'otzma' | 'noam' | 'yb' | 'raam' | 'hadash' | 'democrats';

export type FightStyle = 'balanced' | 'rushdown' | 'brawler' | 'grappler' | 'zoner' | 'technician';

export type HairStyle =
  | 'bald' | 'short' | 'side' | 'receding' | 'horseshoe' | 'buzz' | 'long' | 'bob'
  | 'bun' | 'curly' | 'wavy' | 'ponytail' | 'swept' | 'spiky' | 'braids';

export type FacialHair = 'none' | 'stubble' | 'short' | 'long' | 'goatee' | 'mustache' | 'full';
export type Glasses = 'none' | 'round' | 'rect' | 'thick';
export type Headwear = 'none' | 'kippah' | 'kippah-knit' | 'black-hat' | 'hat' | 'beret' | 'scarf' | 'hardhat';
export type Outfit = 'suit' | 'open-suit' | 'blazer' | 'skirt' | 'shirt' | 'tshirt' | 'dress';

export interface Look {
  skin: number;
  /** Height multiplier around 1.0 */
  height: number;
  /** Girth multiplier around 1.0 */
  build: number;
  head?: number;
  hair: HairStyle;
  hairColor: number;
  facialHair?: FacialHair;
  facialHairColor?: number;
  glasses?: Glasses;
  headwear?: Headwear;
  headwearColor?: number;
  outfit: Outfit;
  jacket: number;
  shirt: number;
  tie?: number | null;
  pants: number;
  shoes?: number;
  female?: boolean;
  brows?: number;
}

export type SpecialSpec =
  | { type: 'projectile'; name: string; prop: PropStyle; color: number; speed?: number; damage?: number; arc?: boolean; size?: number; hits?: number; count?: number; effect?: HitEffect; homing?: boolean; desc?: string }
  | { type: 'rush'; name: string; color: number; distance?: number; damage?: number; hits?: number; armor?: boolean; launch?: boolean; prop?: PropStyle; desc?: string }
  | { type: 'rising'; name: string; color: number; damage?: number; height?: number; hits?: number; prop?: PropStyle; desc?: string }
  | { type: 'grab'; name: string; color: number; damage?: number; range?: number; effect?: HitEffect; prop?: PropStyle; desc?: string }
  | { type: 'counter'; name: string; color: number; damage?: number; window?: number; prop?: PropStyle; desc?: string }
  | { type: 'buff'; name: string; color: number; buff: BuffKind; value?: number; duration?: number; desc?: string }
  | { type: 'heal'; name: string; color: number; amount?: number; desc?: string }
  | { type: 'teleport'; name: string; color: number; mode: 'behind' | 'front' | 'retreat'; attack?: boolean; desc?: string }
  | { type: 'wave'; name: string; color: number; prop?: PropStyle; damage?: number; speed?: number; desc?: string }
  | { type: 'dive'; name: string; color: number; damage?: number; desc?: string }
  | { type: 'trap'; name: string; color: number; prop: PropStyle; damage?: number; effect?: HitEffect; desc?: string }
  | { type: 'beam'; name: string; color: number; length?: number; damage?: number; hits?: number; prop?: PropStyle; effect?: HitEffect; desc?: string }
  | { type: 'pull'; name: string; color: number; prop?: PropStyle; damage?: number; desc?: string }
  | { type: 'slam'; name: string; color: number; damage?: number; prop?: PropStyle; desc?: string }
  | { type: 'rain'; name: string; color: number; prop: PropStyle; count?: number; damage?: number; desc?: string }
  | { type: 'shield'; name: string; color: number; hits?: number; reflect?: boolean; desc?: string }
  | { type: 'spin'; name: string; color: number; damage?: number; hits?: number; distance?: number; desc?: string }
  | { type: 'barrage'; name: string; color: number; damage?: number; hits?: number; prop?: PropStyle; desc?: string };

export type UltimateSpec =
  | { type: 'cinematic'; name: string; color: number; prop?: PropStyle; damage?: number; desc?: string }
  | { type: 'megabeam'; name: string; color: number; prop?: PropStyle; damage?: number; desc?: string }
  | { type: 'megarain'; name: string; color: number; prop: PropStyle; damage?: number; desc?: string }
  | { type: 'megagrab'; name: string; color: number; prop?: PropStyle; damage?: number; desc?: string }
  | { type: 'megaprojectile'; name: string; color: number; prop: PropStyle; damage?: number; desc?: string };

export type PassiveId =
  | 'lifeline'      // survive one lethal hit per match
  | 'thickSkin'     // take less damage
  | 'meterBoost'    // build meter faster
  | 'heavyArmor'    // heavy normals absorb one hit
  | 'swift'         // faster movement
  | 'doubleJump'    // can jump again in the air
  | 'regen'         // slowly regenerate health
  | 'comboMaster'   // less combo damage scaling
  | 'chipMaster'    // big chip damage
  | 'counterPunch'  // counter-hits deal more damage
  | 'rage'          // more damage at low health
  | 'deepPockets'   // start rounds with meter
  | 'vampire'       // heal on hit
  | 'ironWill'      // shorter hitstun
  | 'bouncer'       // stronger, longer throws
  | 'projectileProof' // take half damage from projectiles
  | 'drainer'       // hits drain opponent meter
  | 'quickRecovery' // faster getup and invulnerable backdash
  | 'powerSurge'    // specials deal more damage
  | 'mimic';        // copies the opponent's specials and Heat Smash every round

export interface PassiveSpec {
  id: PassiveId;
  name: string;
  desc: string;
}

export interface CharacterStats {
  health?: number;
  power?: number;
  speed?: number;
  defense?: number;
  jump?: number;
  weight?: number;
}

export interface CharacterDef {
  id: string;
  name: string;
  nameHe: string;
  nick?: string;
  party: PartyId;
  role: string;
  bio: string;
  style: FightStyle;
  stats: CharacterStats;
  look: Look;
  specials: [SpecialSpec, SpecialSpec, SpecialSpec];
  ultimate: UltimateSpec;
  passive: PassiveSpec;
  quotes: { intro: string; win: string };
  /** Hidden boss variant flag. */
  boss?: boolean;
}

export interface PartyInfo {
  id: PartyId;
  name: string;
  nameHe: string;
  color: number;
  accent: number;
}
