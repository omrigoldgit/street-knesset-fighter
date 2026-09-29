// What makes each MK recognisable at a glance, Tekken style: height and body type, a fighting-style
// name, and for many a signature outfit, accessories, a weapon they never put down, a companion
// or a trick (Kisch's jet wings, Barkat's Jerusalem lion, Sa'ar copying his opponent's moves).
//
// Heights and builds are rough caricatures of public appearance, exaggerated a little for
// readability. Every item is a playful nod to a public role (a pilot's wings, a lawyer's gown, a
// finance minister's briefcase), not a claim about anyone. Edit freely.

export type Frame = 'slim' | 'lean' | 'athletic' | 'average' | 'stocky' | 'heavy' | 'big';
export type CoatId = 'frock' | 'gown' | 'labcoat';
export type GearId =
  | 'aviators' | 'shades' | 'earpiece' | 'hardhat' | 'hivis' | 'stethoscope' | 'binoculars'
  | 'watch' | 'goldwatch' | 'earrings' | 'pearls' | 'backpack' | 'sneakers' | 'tzitzit';
export type HeldId = 'gavel' | 'mic' | 'whip' | 'tome' | 'megaphone' | 'phone' | 'briefcase' | 'map';
export type CompanionId = 'wings' | 'drones' | 'lion';

export interface Signature {
  /** Height in cm and body type. */
  cm: number;
  frame: Frame;
  /** 0 = upright, 1-2 = an older, more stooped posture. */
  age?: number;
  /** Tekken-style fighting style shown on the select screen. */
  styleName: string;
  coat?: CoatId;
  dress?: 'jerusalem';
  gear?: GearId[];
  held?: { id: HeldId; hand: 'l' | 'r' };
  companion?: CompanionId;
  /** Mokujin-style: takes the opponent's specials and Heat Smash every round. */
  mimic?: boolean;
  /** One line explaining the gimmick (select screen / move list). */
  trait?: string;
}

const G = (cm: number, frame: Frame, styleName: string, extra: Partial<Signature> = {}): Signature => ({ cm, frame, styleName, ...extra });

export const SIGNATURES: Record<string, Signature> = {
  netanyahu: G(184, 'stocky', 'Survivor-Style Statecraft', { age: 1, companion: 'drones', gear: ['watch'], trait: 'Iron Dome drones hover at his shoulders and intercept attacks when his shield is up.' }),
  levin: G(170, 'heavy', 'Gavel-jutsu', { held: { id: 'gavel', hand: 'r' }, trait: 'Never puts down his judge’s gavel.' }),
  'israel-katz': G(181, 'big', 'Heavy Infrastructure Wrestling', { gear: ['hardhat', 'hivis'], trait: 'Fights in a hard hat and hi-vis vest, straight off the construction site.' }),
  ohana: G(178, 'athletic', "Speaker's Chair Karate", { gear: ['watch'] }),
  regev: G(160, 'slim', 'Culture-War Kickboxing', { dress: 'jerusalem', gear: ['earrings'], trait: 'Wears her famous Jerusalem skyline dress.' }),
  amsalem: G(174, 'heavy', 'Full-Volume Street Brawling', { held: { id: 'megaphone', hand: 'l' }, trait: 'Brings a megaphone, just in case anyone could not hear him.' }),
  barkat: G(181, 'lean', 'Jerusalem Lion Kung Fu', { companion: 'lion', gear: ['goldwatch', 'sneakers'], trait: 'The Lion of Jerusalem, his old city’s emblem, fights at his side.' }),
  gotliv: G(166, 'slim', 'Courtroom Kickboxing', { coat: 'gown', gear: ['earrings'], trait: 'Argues every round in her lawyer’s gown.' }),
  karhi: G(173, 'lean', 'Frequency Jiu-Jitsu', { held: { id: 'phone', hand: 'l' }, trait: 'Always on the phone. Always.' }),
  'may-golan': G(164, 'slim', 'Fast-Track Muay Thai', { gear: ['earrings', 'shades'] }),
  edelstein: G(170, 'average', 'Refusenik Sambo', { age: 1 }),
  saar: G(184, 'lean', 'Party-Switch Mimicry', { mimic: true, trait: 'Party Switcher: every round he joins the other side and copies their special moves and Heat Smash.' }),
  dichter: G(176, 'athletic', 'Shin Bet Krav Maga', { age: 1, gear: ['shades', 'earpiece'], trait: 'Dark glasses, earpiece, and a security detail’s calm.' }),
  silman: G(162, 'average', 'Green Wing Chun', { gear: ['earrings', 'pearls'] }),
  'ofir-katz': G(177, 'stocky', 'Coalition Whip Arts', { held: { id: 'whip', hand: 'r' }, trait: 'The coalition whip, taken literally.' }),
  kisch: G(187, 'athletic', 'Top Gun Aerial Combat', { companion: 'wings', gear: ['aviators'], trait: 'Former fighter pilot: jet wings unfold whenever he takes to the air.' }),
  lapid: G(186, 'athletic', 'Prime-Time Boxing', { held: { id: 'mic', hand: 'r' }, trait: 'Former news anchor: the microphone never leaves his hand.' }),
  'ben-ari': G(166, 'slim', 'Follow-up Capoeira', { gear: ['earrings'] }),
  gantz: G(194, 'athletic', 'Chief-of-Staff Krav Maga', { gear: ['binoculars'], trait: 'The tallest fighter in the Knesset, binoculars always ready.' }),
  eisenkot: G(169, 'lean', 'Doctrine Strategy Karate', { age: 1, held: { id: 'map', hand: 'l' }, trait: 'Keeps the battle plan rolled up in his fist.' }),
  tropper: G(183, 'lean', 'Team-Player Judo'),
  'tamano-shata': G(166, 'slim', 'Trailblazer Taekwondo', { gear: ['earrings', 'pearls'] }),
  deri: G(171, 'stocky', 'Comeback Kid Boxing', { age: 1, gear: ['watch'] }),
  malchieli: G(176, 'heavy', 'Steady-Hand Sumo', { gear: ['watch'] }),
  gafni: G(167, 'heavy', 'Finance Committee Grappling', { age: 2, coat: 'frock', gear: ['tzitzit'], trait: 'A veteran in a long black frock coat.' }),
  goldknopf: G(177, 'big', 'Cornerstone Wrestling', { coat: 'frock', gear: ['tzitzit'], trait: 'Built like the buildings he promises: big, and in a long frock coat.' }),
  smotrich: G(186, 'slim', 'Budget-Line Kendo', { held: { id: 'briefcase', hand: 'l' }, trait: 'Swings the treasury briefcase.' }),
  rothman: G(176, 'lean', 'Basic-Law Bojutsu', { held: { id: 'tome', hand: 'l' }, trait: 'Carries the Basic Laws in one heavy volume.' }),
  strook: G(159, 'average', 'Hardline Hapkido', { age: 1 }),
  'ben-gvir': G(179, 'heavy', 'Law-and-Order Brawling', { gear: ['watch'] }),
  fogel: G(174, 'stocky', 'Old General Krav Maga', { age: 1, gear: ['binoculars'] }),
  maoz: G(171, 'average', 'Lone-Seat Aikido', { age: 1 }),
  lieberman: G(184, 'big', 'Bouncer Sambo', { age: 1, gear: ['earpiece'], trait: 'A bouncer’s build, and he knows it.' }),
  forer: G(178, 'average', 'Loyal Lieutenant Boxing', { gear: ['watch'] }),
  'mansour-abbas': G(172, 'stocky', 'Kingmaker Dentistry', { coat: 'labcoat', trait: 'A dentist by trade: fights in his white coat.' }),
  odeh: G(183, 'average', "Orator's Karate", { gear: ['watch'] }),
  tibi: G(175, 'stocky', 'Sharp-Wit Kung Fu', { gear: ['stethoscope'], trait: 'A physician by training, stethoscope at the ready.' }),
  'touma-sliman': G(161, 'average', 'Activist Aikido', { age: 1, gear: ['earrings'] }),
  kariv: G(179, 'average', 'Legislative Judo', { gear: ['watch'] }),
  lazimi: G(163, 'slim', 'Grassroots Capoeira', { gear: ['backpack', 'sneakers', 'earrings'], trait: 'Comes straight from the protest, backpack and sneakers on.' }),
};

export function signatureFor(id: string): Signature {
  return SIGNATURES[id] ?? { cm: 176, frame: 'average', styleName: 'Freestyle' };
}

/** Body proportions derived from height and frame. */
export interface BodyShape {
  /** Uniform scale of the whole model (height). */
  scale: number;
  /** Waist / hip width. */
  girth: number;
  /** Forward belly bulge, 0 = flat. */
  belly: number;
  /** Shoulder breadth. */
  shoulders: number;
  /** Extra chest depth (athletes). */
  chest: number;
  /** Arm and leg thickness. */
  limbs: number;
  neck: number;
  /** 0..1: how heavy the body moves (slower tempo, more jiggle). */
  heavy: number;
  /** Forward stoop, radians-ish. */
  hunch: number;
  /** Head scale compensation so short fighters' faces stay readable. */
  head: number;
}

const FRAMES: Record<Frame, Omit<BodyShape, 'scale' | 'hunch' | 'head'>> = {
  slim: { girth: 0.86, belly: 0, shoulders: 0.93, chest: 0, limbs: 0.84, neck: 0.9, heavy: 0 },
  lean: { girth: 0.92, belly: 0, shoulders: 0.98, chest: 0.005, limbs: 0.9, neck: 0.95, heavy: 0.1 },
  athletic: { girth: 0.95, belly: 0, shoulders: 1.12, chest: 0.022, limbs: 1.04, neck: 1.06, heavy: 0.15 },
  average: { girth: 1.0, belly: 0.25, shoulders: 1.0, chest: 0.005, limbs: 1.0, neck: 1.0, heavy: 0.3 },
  stocky: { girth: 1.1, belly: 0.55, shoulders: 1.07, chest: 0.01, limbs: 1.1, neck: 1.12, heavy: 0.5 },
  heavy: { girth: 1.22, belly: 1.0, shoulders: 1.08, chest: 0.005, limbs: 1.18, neck: 1.2, heavy: 0.75 },
  big: { girth: 1.34, belly: 1.3, shoulders: 1.15, chest: 0.01, limbs: 1.28, neck: 1.3, heavy: 1 },
};

export function bodyShape(sig: Signature, female: boolean): BodyShape {
  const f = FRAMES[sig.frame];
  // Height differences are exaggerated by 30% so tall and short fighters read instantly.
  const scale = 1 + ((sig.cm - 176) / 176) * 1.3;
  const fem = female ? { girth: 0.94, belly: 0.5, shoulders: 0.9, limbs: 0.9, neck: 0.85 } : { girth: 1, belly: 1, shoulders: 1, limbs: 1, neck: 1 };
  return {
    scale,
    girth: f.girth * fem.girth,
    belly: f.belly * fem.belly,
    shoulders: f.shoulders * fem.shoulders,
    chest: female ? 0 : f.chest,
    limbs: f.limbs * fem.limbs,
    neck: f.neck * fem.neck,
    heavy: f.heavy,
    hunch: (sig.age ?? 0) * 0.07,
    head: Math.pow(1 / scale, 0.55),
  };
}
