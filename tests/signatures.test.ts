import { describe, expect, it } from 'vitest';
import { ROSTER, ROSTER_BY_ID } from '../src/data/roster';
import { PERSONAS } from '../src/data/personas';
import { SIGNATURES, bodyShape, signatureFor } from '../src/data/signatures';
import { getMoveSet } from '../src/game/fighter';
import { Match, type MatchConfig } from '../src/game/match';
import { NO_INPUT } from '../src/game/types';

function cfg(p1: string, p2: string): MatchConfig {
  return { p1: ROSTER_BY_ID[p1], p2: ROSTER_BY_ID[p2], roundsToWin: 2, roundTime: 99, skipIntro: true, seed: 3 };
}

describe('signatures', () => {
  it('gives every MK a height, build, fighting style and persona', () => {
    for (const c of ROSTER) {
      const sig = SIGNATURES[c.id];
      expect(sig, c.id).toBeDefined();
      expect(sig.cm).toBeGreaterThan(150);
      expect(sig.cm).toBeLessThan(200);
      expect(sig.styleName.length).toBeGreaterThan(3);
      expect(PERSONAS[c.id], c.id).toBeDefined();
    }
    expect(Object.keys(SIGNATURES).length).toBe(ROSTER.length);
  });

  it('makes tall MKs taller and heavy MKs wider than short, slim ones', () => {
    const gantz = bodyShape(signatureFor('gantz'), false);
    const regev = bodyShape(signatureFor('regev'), true);
    const katz = bodyShape(signatureFor('israel-katz'), false);
    const smotrich = bodyShape(signatureFor('smotrich'), false);
    expect(gantz.scale).toBeGreaterThan(1.08);
    expect(regev.scale).toBeLessThan(0.92);
    expect(katz.girth).toBeGreaterThan(smotrich.girth + 0.3);
    expect(katz.belly).toBeGreaterThan(1);
    expect(smotrich.belly).toBe(0);
    // Short fighters get a slightly larger head so their faces stay readable.
    expect(regev.head).toBeGreaterThan(1);
  });
});

describe("Sa'ar's Party Switch", () => {
  it("copies the opponent's specials and Heat Smash every round", () => {
    const m = new Match(cfg('saar', 'lapid'));
    for (let i = 0; i < 400 && m.phase !== 'fight'; i++) m.tick([NO_INPUT, NO_INPUT]);
    const [saar, lapid] = m.fighters;
    expect(saar.moves.specials.map((s) => s.name)).toEqual(lapid.moves.specials.map((s) => s.name));
    expect(saar.moves.ultimate.name).toBe(lapid.moves.ultimate.name);
    // His own normals and throw are untouched.
    expect(saar.moves.normals).toBe(getMoveSet(saar.def).normals);
    // The opponent keeps their own kit.
    expect(lapid.moves).toBe(getMoveSet(lapid.def));
  });

  it('copies the original kit in a mirror match', () => {
    const m = new Match(cfg('saar', 'saar'));
    for (let i = 0; i < 400 && m.phase !== 'fight'; i++) m.tick([NO_INPUT, NO_INPUT]);
    const own = getMoveSet(ROSTER_BY_ID.saar).specials.map((s) => s.name);
    for (const f of m.fighters) expect(f.moves.specials.map((s) => s.name)).toEqual(own);
  });
});
