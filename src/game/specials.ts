// Builds special moves and ultimates from the declarative specs in the roster.
// Each archetype has its own frame data and behaviour hooks.

import type { SpecialSpec, UltimateSpec } from './characterTypes';
import type { HitDef, MoveCtx, MoveDef } from './types';
import { ULT_COST } from './constants';

export function sHit(damage: number, o: Partial<HitDef> = {}): HitDef {
  return {
    damage,
    chip: Math.round(damage * 0.15),
    hitstun: 22,
    blockstun: 17,
    guard: 'mid',
    pushback: 0.12,
    spark: 'special',
    meterGain: 8,
    ...o,
  };
}

const strengthMul = (ctx: MoveCtx, lo: number, hi: number) => lo + (hi - lo) * ctx.strength;

const DESC: Record<SpecialSpec['type'], string> = {
  projectile: 'Fires a projectile.',
  rush: 'Charges forward with a strike.',
  rising: 'Invincible rising anti-air.',
  grab: 'Unblockable command grab.',
  counter: 'Counter stance: absorbs a strike and retaliates.',
  buff: 'Temporary power-up.',
  heal: 'Recovers health (vulnerable).',
  teleport: 'Vanishes and reappears.',
  wave: 'Ground wave: must be blocked low or jumped.',
  dive: 'Diving kick (also works in the air).',
  trap: 'Places a trap on the floor.',
  beam: 'Short-range multi-hit beam.',
  pull: 'Long reach strike that yanks the opponent in.',
  slam: 'Leaps at the opponent and slams down (overhead).',
  rain: 'Calls objects down on the opponent.',
  shield: 'Raises a barrier.',
  spin: 'Spinning multi-hit advance, passes over lows.',
  barrage: 'Rapid flurry of blows.',
};

export function specialDesc(spec: SpecialSpec): string {
  return spec.desc ?? DESC[spec.type];
}

export function buildSpecial(spec: SpecialSpec, idx: number): MoveDef {
  const id = `sp${idx}`;
  const base = {
    id,
    name: spec.name,
    kind: 'special' as const,
    color: spec.color,
    tag: spec.type,
    desc: specialDesc(spec),
    cancel: ['super' as const],
  };

  switch (spec.type) {
    case 'projectile': {
      const count = spec.count ?? 1;
      const dmg = spec.damage ?? (count > 1 ? 45 : 80);
      const size = spec.size ?? 1;
      const tag = `${id}`;
      const fireAt = 13;
      const gap = 7;
      return {
        ...base,
        anim: 'cast',
        prop: spec.prop,
        startup: fireAt,
        active: 1 + (count - 1) * gap,
        recovery: 26,
        canStart: (f, m) => !m.hasProjectile(f, tag),
        onFrame: (ctx, fr) => {
          const i = (fr - fireAt) / gap;
          if (fr < fireAt || i !== Math.floor(i) || i >= count) return;
          const f = ctx.fighter;
          const sp = (spec.speed ?? 0.16) * strengthMul(ctx, 0.85, 1.15) * (spec.arc ? 0.62 : 1);
          const spread = count > 1 && !spec.arc ? (i - (count - 1) / 2) * 0.012 : 0;
          ctx.match.spawnProjectile(f, {
            x: f.x + f.facing * 0.8,
            y: spec.arc ? 1.7 : 1.25,
            vx: f.facing * sp,
            vy: spec.arc ? 0.14 + 0.03 * ctx.strength : spread,
            gravity: spec.arc ? 0.0085 : 0,
            w: 0.5 * size,
            h: 0.45 * size,
            hit: sHit(dmg, { effect: spec.effect, knockdown: dmg >= 100, launch: dmg >= 100 ? 0.15 : undefined }),
            prop: spec.prop,
            color: spec.color,
            hits: spec.hits ?? 1,
            rehit: 7,
            life: 200,
            homing: spec.homing ? 1 : 0,
            tag,
            scale: size,
          });
        },
      };
    }

    case 'rush': {
      const hits = spec.hits ?? 1;
      const total = spec.damage ?? 110;
      const per = Math.round(total / hits);
      const startup = 10;
      const active = 18;
      return {
        ...base,
        anim: 'charge',
        prop: spec.prop,
        startup,
        active,
        recovery: 20,
        hitbox: { x: 0.62, y: 1.1, w: 0.9, h: 1.1 },
        hit: sHit(per, { pushback: hits > 1 ? 0.03 : 0.16, hitstun: hits > 1 ? 18 : 24, knockdown: hits === 1 && !!spec.launch, launch: hits === 1 && spec.launch ? 0.24 : undefined }),
        finalHit: hits > 1 ? { pushback: 0.18, knockdown: true, launch: spec.launch ? 0.24 : 0.12 } : undefined,
        rehit: hits > 1 ? 5 : undefined,
        maxHits: hits,
        armor: spec.armor ? { from: 1, to: startup + active, hits: 1 } : undefined,
        onFrame: (ctx, fr) => {
          const f = ctx.fighter;
          if (fr >= startup - 2 && fr <= startup + active) {
            const speed = ((spec.distance ?? 3.4) * strengthMul(ctx, 0.8, 1.2)) / (active + 2);
            f.vx = f.moveConnected ? f.facing * 0.01 : f.facing * speed;
          } else if (fr > startup + active) {
            f.vx = 0;
          }
        },
      };
    }

    case 'rising': {
      const hits = spec.hits ?? 1;
      const total = spec.damage ?? 120;
      const per = Math.round(total / hits);
      return {
        ...base,
        anim: 'uppercut',
        prop: spec.prop,
        startup: 4,
        active: 14,
        recovery: 16,
        airborne: true,
        invuln: [{ from: 1, to: 9, kind: 'full' }],
        hitbox: { x: 0.45, y: 1.45, w: 0.8, h: 1.4 },
        hit: sHit(per, { launch: hits > 1 ? 0.16 : 0.26, launchVx: 0.03, knockdown: true, hitstun: 20 }),
        finalHit: { launch: 0.26 },
        rehit: hits > 1 ? 4 : undefined,
        maxHits: hits,
        onFrame: (ctx, fr) => {
          if (fr === 4) {
            const f = ctx.fighter;
            f.vy = 0.3 * (spec.height ?? 1) * strengthMul(ctx, 0.88, 1.12);
            f.vx = f.facing * 0.04;
          }
        },
      };
    }

    case 'grab': {
      return {
        ...base,
        anim: 'grab',
        prop: spec.prop,
        startup: 6,
        active: 3,
        recovery: 30,
        throwRange: spec.range ?? 1.25,
        throwDamage: spec.damage ?? 170,
        techable: false,
        hit: sHit(spec.damage ?? 170, { guard: 'unblockable', knockdown: true, effect: spec.effect }),
      };
    }

    case 'counter': {
      const window = spec.window ?? 24;
      const strike: MoveDef = {
        id: `${id}c`,
        name: spec.name,
        kind: 'special',
        anim: 'counterStrike',
        color: spec.color,
        startup: 3,
        active: 6,
        recovery: 18,
        hitbox: { x: 0.8, y: 1.1, w: 1.8, h: 1.8 },
        hit: sHit(spec.damage ?? 140, { knockdown: true, launch: 0.2, guard: 'mid', spark: 'heavy' }),
        invuln: [{ from: 1, to: 10, kind: 'full' }],
        cancel: ['super'],
      };
      return {
        ...base,
        anim: 'counterStance',
        prop: spec.prop,
        startup: 3,
        active: window,
        recovery: 22,
        counterWindow: { from: 3, to: 3 + window },
        counterMove: strike,
      };
    }

    case 'buff': {
      const values: Record<string, number> = { damage: 1.3, speed: 1.35, defense: 0.6, armor: 2, regen: 0.45, meter: 0.35, shield: 2, reflect: 1, slow: 0.6 };
      return {
        ...base,
        anim: 'powerup',
        startup: 18,
        active: 1,
        recovery: 16,
        cooldown: 480,
        onFrame: (ctx, fr) => {
          if (fr !== 18) return;
          const dur = spec.duration ?? (spec.buff === 'armor' ? 480 : 360);
          ctx.fighter.addBuff(spec.buff, spec.value ?? values[spec.buff] ?? 1, dur, spec.color, ctx.match);
        },
      };
    }

    case 'heal': {
      return {
        ...base,
        anim: 'powerup',
        startup: 28,
        active: 1,
        recovery: 18,
        cooldown: 600,
        onFrame: (ctx, fr) => {
          if (fr !== 28) return;
          const amount = (spec.amount ?? 80) * strengthMul(ctx, 0.8, 1.2);
          ctx.fighter.heal(amount);
          ctx.match.emit({ t: 'buff', fighter: ctx.fighter.index, kind: 'regen', color: spec.color });
        },
      };
    }

    case 'teleport': {
      const attack = !!spec.attack;
      const vanishAt = 10;
      return {
        ...base,
        anim: 'vanish',
        startup: attack ? 18 : 12,
        active: attack ? 5 : 1,
        recovery: attack ? 16 : 12,
        invuln: [{ from: 1, to: vanishAt + 4, kind: 'full' }],
        hitbox: attack ? { x: 0.7, y: 1.2, w: 0.9, h: 1.0 } : undefined,
        hit: attack ? sHit(80, { knockdown: true, launch: 0.14 }) : undefined,
        cooldown: 90,
        onFrame: (ctx, fr) => {
          if (fr !== vanishAt) return;
          const f = ctx.fighter;
          const o = ctx.opponent;
          const side = Math.sign(f.x - o.x) || -f.facing;
          let to: number;
          if (spec.mode === 'behind') to = o.x - side * 1.1;
          else if (spec.mode === 'front') to = o.x + side * 1.1;
          else to = f.x - f.facing * 3.5;
          to = ctx.match.clampX(to, f);
          ctx.match.emit({ t: 'teleport', fighter: f.index, fromX: f.x, toX: to, color: spec.color });
          f.x = to;
          f.faceToward(o.x);
        },
      };
    }

    case 'wave': {
      const tag = id;
      return {
        ...base,
        anim: 'stomp',
        prop: spec.prop ?? 'wave',
        startup: 14,
        active: 2,
        recovery: 26,
        canStart: (f, m) => !m.hasProjectile(f, tag),
        onFrame: (ctx, fr) => {
          if (fr !== 14) return;
          const f = ctx.fighter;
          ctx.match.spawnProjectile(f, {
            x: f.x + f.facing * 0.8,
            y: 0.22,
            vx: f.facing * (spec.speed ?? 0.13) * strengthMul(ctx, 0.85, 1.15),
            w: 0.75,
            h: 0.42,
            hit: sHit(spec.damage ?? 75, { guard: 'low', knockdown: true, launch: 0.1 }),
            prop: spec.prop ?? 'wave',
            color: spec.color,
            kind: 'wave',
            life: 150,
            tag,
          });
        },
      };
    }

    case 'dive': {
      const startup = 10;
      return {
        ...base,
        anim: 'diveKick',
        startup,
        active: 42,
        recovery: 10,
        airborne: true,
        airOK: true,
        hitbox: { x: 0.45, y: 0.25, w: 0.75, h: 0.65 },
        hit: sHit(spec.damage ?? 90, { guard: 'overhead', hitstun: 20 }),
        onStart: (ctx) => {
          const f = ctx.fighter;
          if (f.grounded) {
            f.vy = 0.27;
            f.vx = f.facing * 0.05;
            f.y = 0.01;
          } else {
            f.vy = Math.max(f.vy, 0.04);
          }
        },
        onFrame: (ctx, fr) => {
          const f = ctx.fighter;
          if (fr >= startup && !f.moveConnected) {
            f.vx = f.facing * 0.2 * strengthMul(ctx, 0.85, 1.15);
            f.vy = -0.24;
          }
        },
        onHit: (ctx) => {
          ctx.fighter.bounceOff();
        },
      };
    }

    case 'trap': {
      const tag = id;
      return {
        ...base,
        anim: 'place',
        prop: spec.prop,
        startup: 12,
        active: 1,
        recovery: 18,
        cooldown: 240,
        onFrame: (ctx, fr) => {
          if (fr !== 12) return;
          const f = ctx.fighter;
          ctx.match.removeProjectiles(f, tag);
          ctx.match.spawnProjectile(f, {
            x: ctx.match.clampX(f.x + f.facing * strengthMul(ctx, 1.4, 2.6), f),
            y: 0.3,
            w: 0.8,
            h: 0.6,
            hit: sHit(spec.damage ?? 60, { guard: 'low', effect: spec.effect ?? { stun: 50 }, hitstun: 26, pushback: 0.02 }),
            prop: spec.prop,
            color: spec.color,
            kind: 'trap',
            life: 600,
            durability: 99,
            tag,
            spin: 0,
          });
        },
      };
    }

    case 'beam': {
      const hits = spec.hits ?? 4;
      const len = spec.length ?? 4.2;
      const per = Math.round((spec.damage ?? 110) / hits);
      return {
        ...base,
        anim: 'beam',
        prop: spec.prop,
        startup: 16,
        active: 26,
        recovery: 22,
        onFrame: (ctx, fr) => {
          if (fr !== 16) return;
          const f = ctx.fighter;
          ctx.match.spawnProjectile(f, {
            x: f.x + f.facing * (0.7 + len / 2),
            y: 1.3,
            w: len,
            h: 0.6,
            hit: sHit(per, { hitstun: 16, blockstun: 12, pushback: 0.05, effect: spec.effect }),
            prop: spec.prop ?? 'sound',
            color: spec.color,
            kind: 'beam',
            attach: true,
            offsetX: 0.7 + len / 2,
            life: 26,
            hits,
            rehit: 6,
            durability: 99,
          });
        },
      };
    }

    case 'pull': {
      return {
        ...base,
        anim: 'whip',
        prop: spec.prop,
        startup: 12,
        active: 6,
        recovery: 22,
        hitbox: { x: 2.0, y: 1.2, w: 2.8, h: 0.5 },
        hit: sHit(spec.damage ?? 50, { hitstun: 36, pushback: 0, spark: 'special' }),
        onHit: (ctx, blocked) => {
          if (blocked) return;
          const f = ctx.fighter;
          const o = ctx.opponent;
          o.x = ctx.match.clampX(f.x + f.facing * 0.95, o);
          o.slideVx = 0;
        },
      };
    }

    case 'slam': {
      return {
        ...base,
        anim: 'slamRise',
        prop: spec.prop,
        startup: 20,
        active: 50,
        recovery: 18,
        airborne: true,
        hitbox: { x: 0.2, y: 0.3, w: 1.3, h: 0.9 },
        hit: sHit(spec.damage ?? 120, { guard: 'overhead', knockdown: true, launch: 0.14 }),
        onStart: (ctx) => {
          const f = ctx.fighter;
          f.vy = 0.36;
          f.y = 0.01;
          const dx = ctx.opponent.x - f.x;
          f.vx = Math.max(-0.17, Math.min(0.17, dx / 42));
        },
        onLand: (ctx) => {
          const f = ctx.fighter;
          ctx.match.emit({ t: 'shake', amount: 0.25 });
          for (const dir of [-1, 1]) {
            ctx.match.spawnProjectile(f, {
              x: f.x + dir * 0.6,
              y: 0.18,
              vx: dir * 0.12,
              w: 0.6,
              h: 0.35,
              hit: sHit(35, { guard: 'low', hitstun: 16 }),
              prop: 'wave',
              color: spec.color,
              kind: 'wave',
              life: 24,
            });
          }
        },
      };
    }

    case 'rain': {
      const count = spec.count ?? 4;
      return {
        ...base,
        anim: 'summon',
        prop: spec.prop,
        startup: 18,
        active: 1,
        recovery: 28,
        cooldown: 200,
        onFrame: (ctx, fr) => {
          if (fr !== 18) return;
          const f = ctx.fighter;
          for (let i = 0; i < count; i++) {
            ctx.match.schedule(i * 9, () => {
              const o = f.opponent;
              if (!o) return;
              const x = o.x + (ctx.match.rng() - 0.5) * 1.8;
              ctx.match.spawnProjectile(f, {
                x,
                y: 7.5,
                vy: -0.2,
                gravity: 0.004,
                w: 0.6,
                h: 0.6,
                hit: sHit(spec.damage ?? 32, { guard: 'overhead', hitstun: 18, tracking: true }),
                prop: spec.prop,
                color: spec.color,
                kind: 'rain',
                life: 120,
              });
            });
          }
        },
      };
    }

    case 'shield': {
      return {
        ...base,
        anim: 'guardUp',
        startup: 8,
        active: 1,
        recovery: 14,
        cooldown: 480,
        onFrame: (ctx, fr) => {
          if (fr !== 8) return;
          if (spec.reflect) ctx.fighter.addBuff('reflect', 1, 240, spec.color, ctx.match);
          else ctx.fighter.addBuff('shield', spec.hits ?? 2, 300, spec.color, ctx.match);
        },
      };
    }

    case 'spin': {
      const hits = spec.hits ?? 4;
      const per = Math.round((spec.damage ?? 100) / hits);
      const startup = 8;
      const active = 30;
      return {
        ...base,
        anim: 'spinKick',
        startup,
        active,
        recovery: 14,
        airborne: true,
        hover: { from: 8, to: startup + active },
        hitbox: { x: 0.25, y: 1.15, w: 1.5, h: 0.75 },
        hit: sHit(per, { hitstun: 18, pushback: 0.03 }),
        finalHit: { knockdown: true, launch: 0.16, pushback: 0.15 },
        rehit: 7,
        maxHits: hits,
        onFrame: (ctx, fr) => {
          const f = ctx.fighter;
          if (fr === 3) {
            f.vy = 0.13;
            f.y = 0.01;
          }
          if (fr >= startup && fr <= startup + active) {
            f.vx = (f.facing * (spec.distance ?? 3.0) * strengthMul(ctx, 0.8, 1.2)) / active;
          }
        },
      };
    }

    case 'barrage': {
      const hits = spec.hits ?? 6;
      const per = Math.round((spec.damage ?? 110) / hits);
      return {
        ...base,
        anim: 'flurry',
        prop: spec.prop,
        startup: 6,
        active: 26,
        recovery: 18,
        hitbox: { x: 0.72, y: 1.3, w: 0.9, h: 0.8 },
        hit: sHit(per, { hitstun: 16, blockstun: 10, pushback: 0.02 }),
        finalHit: { pushback: 0.2, knockdown: true, launch: 0.14 },
        rehit: 4,
        maxHits: hits,
        motion: [{ from: 6, to: 32, vx: 0.025 }],
      };
    }
  }
}

const ULT_DESC: Record<UltimateSpec['type'], string> = {
  cinematic: 'Invincible rush. On hit, a devastating combo.',
  megabeam: 'Invincible full-screen beam.',
  megarain: 'Rains destruction across the arena.',
  megagrab: 'Invincible unblockable super grab.',
  megaprojectile: 'Giant unstoppable projectile.',
};

export function ultimateDesc(spec: UltimateSpec): string {
  return spec.desc ?? ULT_DESC[spec.type];
}

export function buildUltimate(spec: UltimateSpec): MoveDef {
  const base = {
    id: 'ult',
    name: spec.name,
    kind: 'super' as const,
    color: spec.color,
    meterCost: ULT_COST,
    superFreeze: 48,
    tag: spec.type,
    desc: ultimateDesc(spec),
    prop: spec.prop,
  };
  switch (spec.type) {
    case 'cinematic':
      return {
        ...base,
        anim: 'charge',
        startup: 6,
        active: 16,
        recovery: 28,
        invuln: [{ from: 1, to: 14, kind: 'full' }],
        hitbox: { x: 0.7, y: 1.1, w: 1.1, h: 1.5 },
        hit: sHit(40, { chip: 60, blockstun: 22, pushback: 0.2, spark: 'super' }),
        onFrame: (ctx, fr) => {
          const f = ctx.fighter;
          if (fr >= 4 && fr <= 22) f.vx = f.moveConnected ? 0 : f.facing * 0.25;
          else f.vx = 0;
        },
        onHit: (ctx, blocked) => {
          if (!blocked) ctx.match.startCinematic(ctx.fighter, ctx.opponent, spec.damage ?? 380, spec.name, spec.color, spec.prop);
        },
      };
    case 'megabeam': {
      const len = 11;
      return {
        ...base,
        anim: 'beam',
        startup: 12,
        active: 60,
        recovery: 30,
        invuln: [{ from: 1, to: 14, kind: 'full' }],
        onFrame: (ctx, fr) => {
          if (fr !== 12) return;
          const f = ctx.fighter;
          const hits = 10;
          ctx.match.spawnProjectile(f, {
            x: f.x + f.facing * (0.7 + len / 2),
            y: 1.25,
            w: len,
            h: 1.1,
            hit: sHit(Math.round((spec.damage ?? 330) / hits), { hitstun: 16, blockstun: 12, chip: 8, pushback: 0.03, spark: 'super', tracking: true }),
            prop: spec.prop ?? 'wave',
            color: spec.color,
            kind: 'mega',
            attach: true,
            offsetX: 0.7 + len / 2,
            life: 60,
            hits,
            rehit: 6,
            durability: 999,
          });
        },
      };
    }
    case 'megarain':
      return {
        ...base,
        anim: 'summon',
        startup: 10,
        active: 1,
        recovery: 36,
        invuln: [{ from: 1, to: 14, kind: 'full' }],
        onFrame: (ctx, fr) => {
          if (fr !== 10) return;
          const f = ctx.fighter;
          for (let i = 0; i < 14; i++) {
            ctx.match.schedule(i * 5, () => {
              const o = f.opponent;
              if (!o) return;
              ctx.match.spawnProjectile(f, {
                x: o.x + (ctx.match.rng() - 0.5) * 2.4,
                y: 8,
                vy: -0.26,
                gravity: 0.004,
                w: 0.85,
                h: 0.85,
                hit: sHit(Math.round((spec.damage ?? 380) / 14), { guard: 'overhead', hitstun: 20, chip: 6, spark: 'super', tracking: true }),
                prop: spec.prop,
                color: spec.color,
                kind: 'rain',
                life: 120,
                scale: 1.6,
              });
            });
          }
        },
      };
    case 'megagrab':
      return {
        ...base,
        anim: 'grab',
        startup: 3,
        active: 5,
        recovery: 36,
        invuln: [{ from: 1, to: 9, kind: 'full' }],
        throwRange: 1.75,
        throwDamage: spec.damage ?? 400,
        techable: false,
        grabCinematic: { damage: spec.damage ?? 400, name: spec.name },
      };
    case 'megaprojectile':
      return {
        ...base,
        anim: 'cast',
        startup: 14,
        active: 1,
        recovery: 30,
        invuln: [{ from: 1, to: 16, kind: 'full' }],
        onFrame: (ctx, fr) => {
          if (fr !== 14) return;
          const f = ctx.fighter;
          const hits = 5;
          ctx.match.spawnProjectile(f, {
            x: f.x + f.facing * 1.1,
            y: 1.2,
            vx: f.facing * 0.15,
            w: 1.5,
            h: 1.5,
            hit: sHit(Math.round((spec.damage ?? 340) / hits), { hitstun: 18, chip: 10, pushback: 0.04, spark: 'super', tracking: true }),
            prop: spec.prop,
            color: spec.color,
            kind: 'mega',
            hits,
            rehit: 7,
            durability: 999,
            life: 160,
            scale: 3.2,
          });
        },
      };
  }
}
