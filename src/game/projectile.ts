import type { HitDef, PropStyle } from './types';
import type { Fighter } from './fighter';

export type ProjectileKind = 'normal' | 'beam' | 'trap' | 'wave' | 'rain' | 'mega';

export interface ProjectileOpts {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  w: number;
  h: number;
  hit: HitDef;
  prop: PropStyle;
  color: number;
  kind?: ProjectileKind;
  /** Number of hits it can deal before disappearing. */
  hits?: number;
  /** Frames between hits for multi-hit projectiles. */
  rehit?: number;
  /** Clash durability against other projectiles. */
  durability?: number;
  life?: number;
  gravity?: number;
  /** Follow the owner (beams). Offset measured forward from owner. */
  attach?: boolean;
  offsetX?: number;
  homing?: number;
  /** Frames before the projectile becomes dangerous. */
  delay?: number;
  scale?: number;
  spin?: number;
  tag?: string;
  onHit?: (target: Fighter, blocked: boolean) => void;
}

let nextId = 1;

export class Projectile {
  id = nextId++;
  owner: Fighter;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hit: HitDef;
  prop: PropStyle;
  color: number;
  kind: ProjectileKind;
  hitsLeft: number;
  rehit: number;
  durability: number;
  life: number;
  age = 0;
  gravity: number;
  attach: boolean;
  offsetX: number;
  homing: number;
  delay: number;
  scale: number;
  spin: number;
  tag?: string;
  facing: number;
  lastHitAge = -999;
  dead = false;
  reflected = false;
  onHit?: (target: Fighter, blocked: boolean) => void;

  constructor(owner: Fighter, o: ProjectileOpts) {
    this.owner = owner;
    this.x = o.x;
    this.y = o.y;
    this.vx = o.vx ?? 0;
    this.vy = o.vy ?? 0;
    this.w = o.w;
    this.h = o.h;
    this.hit = o.hit;
    this.prop = o.prop;
    this.color = o.color;
    this.kind = o.kind ?? 'normal';
    this.hitsLeft = o.hits ?? 1;
    this.rehit = o.rehit ?? 8;
    this.durability = o.durability ?? this.hitsLeft;
    this.life = o.life ?? 240;
    this.gravity = o.gravity ?? 0;
    this.attach = !!o.attach;
    this.offsetX = o.offsetX ?? 0;
    this.homing = o.homing ?? 0;
    this.delay = o.delay ?? 0;
    this.scale = o.scale ?? 1;
    this.spin = o.spin ?? 0.2;
    this.tag = o.tag;
    this.facing = owner.facing;
    this.onHit = o.onHit;
  }

  get active(): boolean {
    return !this.dead && this.age >= this.delay;
  }

  update(target: Fighter): void {
    this.age++;
    if (this.age < this.delay) return;
    if (this.attach) {
      // Beams stay locked to the caster; they end early if the caster is hit.
      const o = this.owner;
      this.x = o.x + o.facing * this.offsetX;
      this.facing = o.facing;
      if (o.state === 'hitstun' || o.state === 'juggle' || o.state === 'knockdown' || o.state === 'thrown') {
        this.dead = true;
      }
    } else {
      if (this.homing > 0 && target) {
        const ty = target.y + 1.0;
        this.vy += Math.sign(ty - this.y) * this.homing * 0.01;
        this.vy = Math.max(-0.08, Math.min(0.08, this.vy));
      }
      this.vy -= this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      if (this.kind === 'rain' && this.y < 0.2) {
        this.dead = true;
      }
      if (this.gravity > 0 && this.y < 0.15 && this.kind !== 'rain') {
        // Lobbed projectiles burst on the floor.
        this.dead = true;
      }
    }
    if (this.age >= this.life + this.delay) this.dead = true;
    if (Math.abs(this.x) > 16) this.dead = true;
  }

  box() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}
