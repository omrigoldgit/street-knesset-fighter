import type { PartyId, PartyInfo } from '../game/characterTypes';

export const PARTIES: Record<PartyId, PartyInfo> = {
  likud: { id: 'likud', name: 'Likud', nameHe: 'הליכוד', color: 0x1f5fbf, accent: 0x9cc3ff },
  yeshatid: { id: 'yeshatid', name: 'Yesh Atid', nameHe: 'יש עתיד', color: 0x00a3e0, accent: 0xb5ecff },
  nationalunity: { id: 'nationalunity', name: 'National Unity', nameHe: 'המחנה הממלכתי', color: 0x2745a8, accent: 0x9fb4ff },
  yashar: { id: 'yashar', name: 'Yashar!', nameHe: 'ישר!', color: 0x3a7d44, accent: 0xb8e0c0 },
  shas: { id: 'shas', name: 'Shas', nameHe: 'ש"ס', color: 0x0b2e6b, accent: 0xf2c14e },
  utj: { id: 'utj', name: 'United Torah Judaism', nameHe: 'יהדות התורה', color: 0x2a2a2e, accent: 0xd8d8d8 },
  rzp: { id: 'rzp', name: 'Religious Zionism', nameHe: 'הציונות הדתית', color: 0xd35400, accent: 0xffc38a },
  otzma: { id: 'otzma', name: 'Otzma Yehudit', nameHe: 'עוצמה יהודית', color: 0xe0a100, accent: 0xfff0a8 },
  noam: { id: 'noam', name: 'Noam', nameHe: 'נעם', color: 0x7d3c98, accent: 0xdcb8ea },
  yb: { id: 'yb', name: 'Yisrael Beiteinu', nameHe: 'ישראל ביתנו', color: 0x2874a6, accent: 0xa9d3f0 },
  raam: { id: 'raam', name: "Ra'am", nameHe: 'רע"ם', color: 0x1e9e5a, accent: 0xa6ecc4 },
  hadash: { id: 'hadash', name: "Hadash–Ta'al", nameHe: 'חד"ש-תע"ל', color: 0xc0392b, accent: 0xffb3aa },
  democrats: { id: 'democrats', name: 'The Democrats', nameHe: 'הדמוקרטים', color: 0xd62839, accent: 0xffb3bd },
};
