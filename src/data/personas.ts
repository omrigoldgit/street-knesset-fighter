// Body language per MK: a fighting-stance archetype plus signature intro and victory gestures.
// These are affectionate caricatures of well-known public mannerisms (speeches, salutes of
// former generals, a TV host's wave), not statements about anyone.

import type { FightStyle } from '../game/characterTypes';

export type StanceId = 'boxer' | 'karate' | 'wrestler' | 'brawler' | 'longguard' | 'mma' | 'statesman';

export type GestureId =
  | 'point' | 'podium' | 'wave' | 'salute' | 'armsCrossed' | 'thumbsUp' | 'fistPump' | 'adjustTie'
  | 'clap' | 'shrug' | 'handsOnHips' | 'victoryV' | 'bothArmsUp' | 'phone' | 'checkWatch' | 'heart'
  | 'crowdWave' | 'bow';

export interface Persona {
  stance: StanceId;
  intro: GestureId;
  win: GestureId[];
}

export const STYLE_STANCE: Record<FightStyle, StanceId> = {
  rushdown: 'boxer',
  technician: 'karate',
  grappler: 'wrestler',
  brawler: 'brawler',
  zoner: 'longguard',
  balanced: 'mma',
};

const P = (stance: StanceId, intro: GestureId, ...win: GestureId[]): Persona => ({ stance, intro, win });

export const PERSONAS: Record<string, Persona> = {
  netanyahu: P('statesman', 'podium', 'point', 'victoryV'),
  levin: P('longguard', 'adjustTie', 'armsCrossed'),
  'israel-katz': P('brawler', 'fistPump', 'bothArmsUp'),
  ohana: P('karate', 'podium', 'clap'),
  regev: P('boxer', 'point', 'crowdWave', 'fistPump'),
  amsalem: P('brawler', 'shrug', 'handsOnHips'),
  barkat: P('mma', 'phone', 'thumbsUp'),
  gotliv: P('boxer', 'point', 'armsCrossed'),
  karhi: P('longguard', 'phone', 'shrug'),
  'may-golan': P('boxer', 'wave', 'victoryV'),
  edelstein: P('karate', 'bow', 'heart'),
  saar: P('longguard', 'adjustTie', 'armsCrossed'),
  dichter: P('karate', 'checkWatch', 'thumbsUp'),
  silman: P('mma', 'wave', 'clap'),
  'ofir-katz': P('boxer', 'clap', 'fistPump'),
  kisch: P('boxer', 'salute', 'thumbsUp'),
  lapid: P('boxer', 'wave', 'victoryV', 'point'),
  'ben-ari': P('karate', 'point', 'clap'),
  gantz: P('mma', 'salute', 'thumbsUp', 'salute'),
  eisenkot: P('karate', 'salute', 'handsOnHips'),
  tropper: P('mma', 'wave', 'heart'),
  'tamano-shata': P('boxer', 'wave', 'victoryV'),
  deri: P('karate', 'podium', 'heart'),
  malchieli: P('wrestler', 'bow', 'clap'),
  gafni: P('longguard', 'point', 'armsCrossed'),
  goldknopf: P('wrestler', 'handsOnHips', 'bothArmsUp'),
  smotrich: P('longguard', 'checkWatch', 'armsCrossed'),
  rothman: P('longguard', 'podium', 'point'),
  strook: P('karate', 'armsCrossed', 'point'),
  'ben-gvir': P('brawler', 'fistPump', 'bothArmsUp', 'point'),
  fogel: P('brawler', 'salute', 'handsOnHips'),
  maoz: P('longguard', 'bow', 'heart'),
  lieberman: P('wrestler', 'armsCrossed', 'shrug'),
  forer: P('mma', 'adjustTie', 'thumbsUp'),
  'mansour-abbas': P('karate', 'heart', 'wave'),
  odeh: P('longguard', 'wave', 'victoryV'),
  tibi: P('karate', 'point', 'shrug'),
  'touma-sliman': P('mma', 'podium', 'fistPump'),
  kariv: P('karate', 'podium', 'clap'),
  lazimi: P('boxer', 'fistPump', 'victoryV'),
};

export function personaFor(id: string, style: FightStyle): Persona {
  return PERSONAS[id] ?? { stance: STYLE_STANCE[style], intro: 'wave', win: ['victoryV'] };
}
