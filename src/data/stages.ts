export type StageKind = 'plenum' | 'plaza' | 'committee' | 'beach' | 'market' | 'rooftop';

export interface StageDef {
  id: string;
  kind: StageKind;
  name: string;
  nameHe: string;
  desc: string;
  music: { bpm: number; root: number; mode: 'minor' | 'phrygian' | 'dorian' | 'major'; intensity: number };
}

export const STAGES: StageDef[] = [
  {
    id: 'plenum', kind: 'plenum', name: 'The Plenum', nameHe: 'מליאת הכנסת',
    desc: 'The horseshoe of power. Mind the government table.',
    music: { bpm: 138, root: 45, mode: 'minor', intensity: 1 },
  },
  {
    id: 'plaza', kind: 'plaza', name: 'Menorah Plaza', nameHe: 'רחבת המנורה',
    desc: 'Outside the Knesset, in the shadow of the great Menorah.',
    music: { bpm: 128, root: 50, mode: 'dorian', intensity: 0.8 },
  },
  {
    id: 'committee', kind: 'committee', name: 'Finance Committee', nameHe: 'ועדת הכספים',
    desc: 'Where budgets are born and coalitions are bought.',
    music: { bpm: 120, root: 43, mode: 'phrygian', intensity: 0.7 },
  },
  {
    id: 'beach', kind: 'beach', name: 'Tel Aviv Beach', nameHe: 'חוף תל אביב',
    desc: 'Sunset on Gordon Beach. Matkot players look on.',
    music: { bpm: 124, root: 48, mode: 'major', intensity: 0.8 },
  },
  {
    id: 'market', kind: 'market', name: 'Mahane Yehuda', nameHe: 'שוק מחנה יהודה',
    desc: 'The shuk after dark. Every politician campaigns here eventually.',
    music: { bpm: 132, root: 47, mode: 'phrygian', intensity: 0.9 },
  },
  {
    id: 'rooftop', kind: 'rooftop', name: 'Azrieli Rooftop', nameHe: 'גג עזריאלי',
    desc: 'High above Tel Aviv. Round, square and triangle towers.',
    music: { bpm: 146, root: 44, mode: 'minor', intensity: 1 },
  },
];

export const STAGE_BY_ID: Record<string, StageDef> = Object.fromEntries(STAGES.map((s) => [s.id, s]));
