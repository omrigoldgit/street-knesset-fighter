import type { Cyl, HitDef, PropStyle } from './types';
import type { Fighter } from './fighter';

export type ProjectileKind = 'normal' | 'beam' | 'trap' | 'wave' | 'rain' | 'mega';

export interface ProjectileOpts {
  x: number;
  y: number;
  z: number;
  /** Horizontal travel direction (normalised); defaults to the owner's facing. */
  dirX?: number;
  dirZ?: number;
  speed?: number;
  vy?: number;
  /** Diameter for regular projectiles; length for beams. */
  w: number;
  h: number;
  hit: HitDef;
  prop: PropStyle;
  color: number;
  kind?: ProjectileKind;
  hits?: number;
  rehit?: number;
  durability?: number;
  life?: number;
  gravity?: number;
  /** Beams: stay attached in front of the owner, `offsetX` ahead. */
  attach?: boolean;
  offsetX?: number;
  homing?: number;
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
  z: number;
  vx: number;
  vy: number;
  vz: number;
  dirX: number;
  dirZ: number;
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
  lastHitAge = -999;
  dead = false;
  reflected = false;
  onHit?: (target: Fighter, blocked: boolean) => void;

  constructor(owner: Fighter, o: ProjectileOpts) {
    this.owner = owner;
    this.x = o.x;
    this.y = o.y;
    this.z = o.z;
    this.dirX = o.dirX ?? owner.dirX;
    this.dirZ = o.dirZ ?? owner.dirZ;
    const sp = o.speed ?? 0;
    this.vx = this.dirX * sp;
    this.vz = this.dirZ * sp;
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
    this.onHit = o.onHit;
  }

  get active(): boolean {
    return !this.dead && this.age >= this.delay;
  }

  /** Legacy screen-facing sign, used by effects. */
  get facing(): number {
    return this.owner.facing;
  }

  update(target: Fighter): void {
    this.age++;
    if (this.age < this.delay) return;
    if (this.attach) {
      // Beams stay locked in front of the caster; they end early if the caster is hit.
      const o = this.owner;
      this.dirX = o.dirX;
      this.dirZ = o.dirZ;
      this.x = o.x + this.dirX * this.offsetX;
      this.z = o.z + this.dirZ * this.offsetX;
      if (o.state === 'hitstun' || o.state === 'juggle' || o.state === 'knockdown' || o.state === 'thrown') this.dead = true;
    } else {
      if (this.homing > 0 && target) {
        // Gentle steering toward the target on both axes.
        const ty = target.y + 1.0;
        this.vy += Math.sign(ty - this.y) * this.homing * 0.01;
        this.vy = Math.max(-0.08, Math.min(0.08, this.vy));
        const sp = Math.hypot(this.vx, this.vz);
        if (sp > 0) {
          const want = Math.atan2(target.z - this.z, target.x - this.x);
          const cur = Math.atan2(this.vz, this.vx);
          let dA = want - cur;
          while (dA > Math.PI) dA -= Math.PI * 2;
          while (dA < -Math.PI) dA += Math.PI * 2;
          const a = cur + Math.max(-0.02, Math.min(0.02, dA)) * this.homing;
          this.vx = Math.cos(a) * sp;
          this.vz = Math.sin(a) * sp;
          this.dirX = Math.cos(a);
          this.dirZ = Math.sin(a);
        }
      }
      this.vy -= this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;
      if (this.kind === 'rain' && this.y < 0.2) this.dead = true;
      if (this.gravity > 0 && this.y < 0.15 && this.kind !== 'rain') this.dead = true;
    }
    if (this.age >= this.life + this.delay) this.dead = true;
    if (Math.hypot(this.x, this.z) > 30) this.dead = true;
  }

  /** Does this projectile overlap a hurtbox cylinder? */
  overlaps(c: Cyl): boolean {
    if (Math.abs(this.y - c.y) * 2 >= this.h + c.h) return false;
    if (this.attach) {
      const o = this.owner;
      const dx = c.x - o.x;
      const dz = c.z - o.z;
      const f = dx * this.dirX + dz * this.dirZ;
      const l = dx * this.dirZ - dz * this.dirX;
      return Math.abs(f - this.offsetX) <= this.w / 2 + c.r && Math.abs(l) <= this.h / 2 + c.r;
    }
    return Math.hypot(c.x - this.x, c.z - this.z) <= this.w / 2 + c.r;
  }

  /** Approximate overlap test between two projectiles. */
  touches(q: Projectile): boolean {
    if (Math.abs(this.y - q.y) * 2 >= this.h + q.h) return false;
    if (this.attach) return this.overlaps({ x: q.x, z: q.z, y: q.y, h: q.h, r: q.w / 2 });
    if (q.attach) return q.overlaps({ x: this.x, z: this.z, y: this.y, h: this.h, r: this.w / 2 });
    return Math.hypot(q.x - this.x, q.z - this.z) <= (this.w + q.w) / 2;
  }
}
