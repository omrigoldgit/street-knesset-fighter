import { describe, expect, it } from 'vitest';
import { ROSTER, ROSTER_BY_ID, bossVariant } from '../src/data/roster';
import { CpuController } from '../src/game/ai';
import { Match, type MatchConfig } from '../src/game/match';
import { InputHistory } from '../src/game/motion';
import { BTN, NO_INPUT, type PlayerInput } from '../src/game/types';
import type { Fighter } from '../src/game/fighter';

function cfg(p1: string, p2: string, extra: Partial<MatchConfig> = {}): MatchConfig {
  return { p1: ROSTER_BY_ID[p1], p2: ROSTER_BY_ID[p2], roundsToWin: 2, roundTime: 99, skipIntro: true, seed: 7, ...extra };
}

function runUntilFight(m: Match): void {
  for (let i = 0; i < 400 && m.phase !== 'fight'; i++) m.tick([NO_INPUT, NO_INPUT]);
}

function checkSane(f: Fighter): void {
  expect(Number.isFinite(f.x)).toBe(true);
  expect(Number.isFinite(f.y)).toBe(true);
  expect(f.y).toBeGreaterThanOrEqual(0);
  expect(f.health).toBeGreaterThanOrEqual(0);
  expect(f.health).toBeLessThanOrEqual(f.stats.maxHealth);
  expect(f.meter).toBeGreaterThanOrEqual(0);
  expect(f.meter).toBeLessThanOrEqual(100);
  expect(Math.abs(f.x)).toBeLessThan(11);
}

const press = (btn: number, dir = 5): PlayerInput => ({ dir, held: btn, pressed: btn });
const hold = (dir: number): PlayerInput => ({ dir, held: 0, pressed: 0 });

describe('roster', () => {
  it('has exactly 40 unique characters with complete kits', () => {
    expect(ROSTER.length).toBe(40);
    const ids = new Set(ROSTER.map((c) => c.id));
    expect(ids.size).toBe(40);
    for (const c of ROSTER) {
      expect(c.specials.length).toBe(3);
      expect(c.ultimate.name.length).toBeGreaterThan(0);
      expect(c.passive.name.length).toBeGreaterThan(0);
      expect(c.nameHe.length).toBeGreaterThan(0);
    }
  });

  it('gives every character a unique set of special move names', () => {
    const kits = new Set(ROSTER.map((c) => [...c.specials.map((s) => s.name), c.ultimate.name].join('|')));
    expect(kits.size).toBe(40);
  });
});

describe('motion input', () => {
  it('detects quarter circle forward', () => {
    const h = new InputHistory();
    for (const d of [5, 2, 2, 3, 6]) h.push(d, 0);
    expect(h.motion('qcf')).toBe(true);
    expect(h.motion('qcb')).toBe(false);
  });

  it('detects dragon punch motion', () => {
    const h = new InputHistory();
    for (const d of [6, 5, 2, 3]) h.push(d, 0);
    expect(h.motion('dp')).toBe(true);
  });

  it('detects double quarter circle', () => {
    const h = new InputHistory();
    for (const d of [2, 3, 6, 2, 3, 6]) h.push(d, 0);
    expect(h.motion('dqcf')).toBe(true);
  });

  it('detects dash', () => {
    const h = new InputHistory();
    for (const d of [5, 6, 5, 6]) h.push(d, 0);
    expect(h.dash(true)).toBe(true);
  });
});

describe('combat basics', () => {
  it('a jab hits an idle opponent for its listed damage', () => {
    const m = new Match(cfg('lapid', 'gantz', { seed: 1 }));
    runUntilFight(m);
    const [a, b] = m.fighters;
    a.x = 0;
    b.x = 0.8;
    const before = b.health;
    m.tick([press(BTN.LP), NO_INPUT]);
    for (let i = 0; i < 12; i++) m.tick([NO_INPUT, NO_INPUT]);
    expect(b.health).toBeLessThan(before);
    expect(before - b.health).toBeGreaterThan(15);
  });

  it('blocking by holding back prevents damage from a normal', () => {
    const m = new Match(cfg('lapid', 'gantz', { seed: 1 }));
    runUntilFight(m);
    const [a, b] = m.fighters;
    a.x = 0;
    b.x = 0.8;
    const before = b.health;
    m.tick([press(BTN.HP), hold(6)]);
    for (let i = 0; i < 20; i++) m.tick([NO_INPUT, hold(6)]);
    expect(b.health).toBe(before);
    expect(b.state === 'blockstun' || b.state === 'idle' || b.state === 'walkB').toBe(true);
  });

  it('a throw connects at close range', () => {
    const m = new Match(cfg('lieberman', 'lapid', { seed: 1 }));
    runUntilFight(m);
    const [a, b] = m.fighters;
    a.x = 0;
    b.x = 0.7;
    const before = b.health;
    m.tick([press(BTN.TH), NO_INPUT]);
    for (let i = 0; i < 60; i++) m.tick([NO_INPUT, NO_INPUT]);
    expect(b.health).toBeLessThan(before - 100);
  });

  it('lifeline passive saves Netanyahu once', () => {
    const m = new Match(cfg('lapid', 'netanyahu', { seed: 1 }));
    runUntilFight(m);
    const b = m.fighters[1];
    const saved = b.takeDamage(99999, m);
    expect(saved).toBe(true);
    expect(b.health).toBe(1);
    const saved2 = b.takeDamage(99999, m);
    expect(saved2).toBe(false);
    expect(b.health).toBe(0);
  });
});

describe('every special move and ultimate', () => {
  for (const c of ROSTER) {
    it(`${c.name}: all specials and the ultimate execute cleanly`, () => {
      const oppId = c.id === 'gantz' ? 'lapid' : 'gantz';
      const inputs: [number, number][] = [[BTN.SP, 5], [BTN.SP, 6], [BTN.SP, 2], [BTN.UL, 5]];
      for (const [btn, dir] of inputs) {
        for (const dist of [1.0, 3.0]) {
          const m = new Match(cfg(c.id, oppId, { seed: 3 }));
          runUntilFight(m);
          const [a, b] = m.fighters;
          a.x = -dist / 2;
          b.x = dist / 2;
          a.meter = 100;
          m.tick([press(btn, dir), NO_INPUT]);
          const started = a.state === 'attack' || m.freeze > 0 || a.move !== null;
          expect(started, `${c.id} move ${btn}/${dir} did not start`).toBe(true);
          for (let i = 0; i < 260; i++) {
            m.tick([NO_INPUT, NO_INPUT]);
            checkSane(a);
            checkSane(b);
          }
        }
      }
    });
  }
});

describe('CPU vs CPU full matches', () => {
  it('every character completes a match against a CPU without errors', () => {
    for (let i = 0; i < ROSTER.length; i++) {
      const c = ROSTER[i];
      const o = ROSTER[(i * 7 + 3) % ROSTER.length];
      const m = new Match({ p1: c, p2: o.id === c.id ? ROSTER[(i + 1) % 40] : o, roundsToWin: 2, roundTime: 60, skipIntro: true, seed: i + 1 });
      const ai1 = new CpuController(3, i * 31 + 1);
      const ai2 = new CpuController(2, i * 17 + 5);
      let ticks = 0;
      while (m.phase !== 'matchEnd' && ticks < 60 * 60 * 4) {
        m.tick([ai1.next(m.fighters[0], m), ai2.next(m.fighters[1], m)]);
        m.drainEvents();
        ticks++;
        if (ticks % 30 === 0) {
          checkSane(m.fighters[0]);
          checkSane(m.fighters[1]);
        }
      }
      expect(m.phase, `${c.id} vs ${o.id} never finished`).toBe('matchEnd');
    }
  });

  it('CPUs actually deal damage and land specials', () => {
    const m = new Match({ p1: ROSTER_BY_ID.netanyahu, p2: ROSTER_BY_ID.lapid, roundsToWin: 1, roundTime: 99, skipIntro: true, seed: 42 });
    const ai1 = new CpuController(4, 11);
    const ai2 = new CpuController(4, 12);
    let specials = 0;
    let hits = 0;
    for (let t = 0; t < 60 * 99 + 300 && m.phase !== 'matchEnd'; t++) {
      m.tick([ai1.next(m.fighters[0], m), ai2.next(m.fighters[1], m)]);
      for (const e of m.drainEvents()) {
        if (e.t === 'special' || e.t === 'superFlash') specials++;
        if (e.t === 'hit' && !e.blocked) hits++;
      }
    }
    expect(hits).toBeGreaterThan(5);
    expect(specials).toBeGreaterThan(2);
  });

  it('boss variant has boosted health', () => {
    const boss = bossVariant(ROSTER_BY_ID.netanyahu);
    const m = new Match({ p1: ROSTER_BY_ID.lapid, p2: boss, roundsToWin: 1, roundTime: 99, skipIntro: true });
    expect(m.fighters[1].stats.maxHealth).toBeGreaterThan(m.fighters[0].stats.maxHealth * 1.4);
  });
});

describe('training mode', () => {
  it('never ends and refills health', () => {
    const m = new Match({ ...cfg('lapid', 'gantz'), training: { infiniteHealth: true, infiniteMeter: true, dummy: 'stand' } });
    expect(m.phase).toBe('fight');
    const [a, b] = m.fighters;
    a.x = 0;
    b.x = 0.8;
    for (let i = 0; i < 20; i++) {
      m.tick([press(BTN.UL), NO_INPUT]);
      for (let j = 0; j < 150; j++) m.tick([NO_INPUT, NO_INPUT]);
    }
    expect(m.phase).toBe('fight');
    for (let j = 0; j < 200; j++) m.tick([NO_INPUT, NO_INPUT]);
    expect(b.health).toBe(b.stats.maxHealth);
  });
});
