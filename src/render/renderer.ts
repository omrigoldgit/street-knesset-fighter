// Scene management, camera direction and syncing of engine state to 3D views.

import * as THREE from 'three';
import type { CharacterDef } from '../game/characterTypes';
import type { Fighter } from '../game/fighter';
import type { Match } from '../game/match';
import type { Projectile } from '../game/projectile';
import type { GameEvent, PropStyle } from '../game/types';
import type { StageDef } from '../data/stages';
import { PARTIES } from '../data/parties';
import { Animator } from './animator';
import { buildCharacter, disposeRig, type Rig } from './characterModel';
import { Effects } from './effects';
import { additive } from './materials';
import { buildProp } from './props';
import { buildStage, disposeStage, type BuiltStage } from './stage';

const FACE_ANGLE = Math.PI / 2 - 0.32;
const PROP_ANIMS = new Set(['cast', 'grab', 'charge', 'whip', 'beam', 'counterStance', 'place', 'uppercut', 'summon', 'stomp', 'flurry', 'slamRise']);

class FighterView {
  rig: Rig;
  anim = new Animator();
  aura: THREE.Mesh;
  shield: THREE.Mesh;
  stars: THREE.Group;
  prop: THREE.Group | null = null;
  propStyle: PropStyle | null = null;
  whip: THREE.Mesh;
  private yaw = 0;
  private auraTimer = 0;

  constructor(def: CharacterDef) {
    this.rig = buildCharacter(def);
    this.aura = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.1, 6, 16), additive(0xffffff, 0.18));
    this.aura.position.y = 0.95;
    this.aura.visible = false;
    this.rig.root.add(this.aura);
    this.shield = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 16), additive(0x9fd3ff, 0.22));
    this.shield.position.y = 0.95;
    this.shield.visible = false;
    this.rig.root.add(this.shield);
    this.stars = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const s = buildProp('star', 0xffd60a);
      s.scale.setScalar(0.35);
      this.stars.add(s);
    }
    this.stars.visible = false;
    this.rig.root.add(this.stars);
    this.whip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 6), new THREE.MeshBasicMaterial({ color: 0x3a2a1a }));
    this.whip.visible = false;
    this.rig.root.add(this.whip);
    this.yaw = FACE_ANGLE;
  }

  setProp(style: PropStyle | null, color: number): void {
    if (this.propStyle === style) return;
    if (this.prop) {
      this.rig.rHand.remove(this.prop);
      this.prop = null;
    }
    this.propStyle = style;
    if (style) {
      this.prop = buildProp(style, color);
      this.prop.scale.setScalar(0.7);
      this.prop.position.set(0, -0.12, 0.05);
      this.prop.rotation.set(Math.PI / 2, 0, Math.PI / 2);
      this.rig.rHand.add(this.prop);
    }
  }

  sync(f: Fighter, m: Match, dt: number, effects?: Effects): void {
    const root = this.rig.root;
    this.anim.update(f, m, dt);
    this.anim.apply(this.rig);
    root.visible = !this.anim.hidden;

    let x = f.x;
    if (f.flash > 0 && m.hitstop > 0) x += (Math.random() - 0.5) * 0.08;
    root.position.set(x, f.y, f.z);
    const targetYaw = f.facing > 0 ? FACE_ANGLE : -FACE_ANGLE;
    const turning = f.state === 'air' || f.state === 'juggle' ? 0.25 : 0.5;
    this.yaw += (targetYaw - this.yaw) * Math.min(1, turning * dt * 60);
    root.rotation.y = this.yaw;

    // Hit flash and buff glow.
    const flash = f.flash > 0 ? Math.min(1, f.flash / 5) * 0.7 : 0;
    const buff = f.buffs.find((b) => b.kind !== 'shield' && b.kind !== 'reflect' && b.kind !== 'slow');
    const t = m.ticks / 60;
    for (const mat of this.rig.materials) {
      if (flash > 0) {
        mat.emissive.setRGB(flash * 0.5, flash * 0.42, flash * 0.34);
      } else if (buff) {
        mat.emissive.setHex(buff.color).multiplyScalar(0.18 + 0.1 * Math.sin(t * 8));
      } else if (f.lifelineUsed && f.health <= 1) {
        mat.emissive.setRGB(0.3 + 0.2 * Math.sin(t * 10), 0, 0);
      } else {
        mat.emissive.setRGB(0, 0, 0);
      }
    }
    // Aura: rising particles instead of a solid shell.
    this.aura.visible = false;
    const auraColor = buff?.color ?? (f.state === 'attack' && f.move?.kind === 'super' ? f.move.color ?? 0xffd200 : f.meter >= 100 ? 0xffd200 : null);
    if (auraColor !== null && effects) {
      this.auraTimer += dt * 60;
      const rate = buff || f.move?.kind === 'super' ? 2 : 6;
      while (this.auraTimer >= rate) {
        this.auraTimer -= rate;
        effects.burst(f.x + (Math.random() - 0.5) * 0.7, f.y + 0.1 + Math.random() * 1.2, (Math.random() - 0.5) * 0.4, auraColor, 1, 0.01, 0.035, -0.0015, 34);
      }
    }
    const sh = f.buff('shield') ?? f.buff('reflect');
    this.shield.visible = !!sh;
    if (sh) {
      (this.shield.material as THREE.MeshBasicMaterial).color.setHex(sh.color);
      (this.shield.material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.08 * Math.sin(t * 6);
    }
    this.stars.visible = f.state === 'dizzy';
    if (this.stars.visible) {
      const hy = 1.95;
      this.stars.children.forEach((s, i) => {
        const a = t * 4 + (i * Math.PI * 2) / 3;
        s.position.set(Math.cos(a) * 0.35, hy, Math.sin(a) * 0.35);
        s.rotation.y = a;
      });
    }

    // Held prop for specials that use one.
    const mv = f.move;
    const cinematicAtt = f.state === 'cinematic' && m.cinematic?.att === f;
    if (cinematicAtt && m.cinematic?.prop) {
      this.setProp(m.cinematic.prop, m.cinematic.color);
    } else if (f.state === 'attack' && mv?.prop && PROP_ANIMS.has(mv.anim) && mv.tag !== 'projectile' && mv.tag !== 'rain') {
      this.setProp(mv.prop, mv.color ?? 0xffffff);
    } else {
      this.setProp(null, 0);
    }

    // Whip / pull visual.
    this.whip.visible = false;
    if (f.state === 'attack' && mv?.tag === 'pull') {
      const fr = f.moveFrame;
      if (fr > mv.startup - 2 && fr <= mv.startup + mv.active + 4) {
        const len = 3.0;
        this.whip.visible = true;
        this.whip.scale.set(1, len, 1);
        this.whip.position.set(0, 1.25, len / 2 + 0.4);
        this.whip.rotation.set(Math.PI / 2, 0, 0);
        (this.whip.material as THREE.MeshBasicMaterial).color.setHex(mv.color ?? 0x3a2a1a);
      }
    }
  }

  dispose(): void {
    disposeRig(this.rig);
  }
}

class ProjectileView {
  obj: THREE.Group;
  glow: THREE.Mesh | null = null;
  beam: THREE.Mesh | null = null;
  core: THREE.Mesh | null = null;

  constructor(p: Projectile) {
    this.obj = new THREE.Group();
    if (p.kind === 'beam' || (p.kind === 'mega' && p.attach)) {
      const r = p.h / 2;
      this.beam = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 20, 1, true), additive(p.color, 0.55));
      this.beam.rotation.z = Math.PI / 2;
      this.core = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.45, r * 0.45, 1, 12, 1, true), additive(0xffffff, 0.9));
      this.core.rotation.z = Math.PI / 2;
      this.obj.add(this.beam, this.core);
      if (p.prop && p.prop !== 'wave' && p.prop !== 'sound') {
        const src = buildProp(p.prop, p.color);
        src.scale.setScalar(1.2);
        src.userData.src = true;
        this.obj.add(src);
      }
    } else {
      const prop = buildProp(p.prop, p.color);
      prop.scale.setScalar(p.scale * (p.kind === 'wave' ? 1.3 : p.kind === 'trap' ? 1.3 : 1.2));
      prop.userData.spin = true;
      this.obj.add(prop);
      this.glow = new THREE.Mesh(new THREE.SphereGeometry(0.32 * p.scale, 14, 10), additive(p.color, 0.25));
      this.obj.add(this.glow);
    }
  }

  sync(p: Projectile, t: number): void {
    this.obj.position.set(p.x, p.y, 0.05);
    const dir = p.attach ? p.facing : Math.sign(p.vx) || p.facing;
    if (this.beam && this.core) {
      const len = p.w;
      const pulse = 1 + 0.12 * Math.sin(t * 40);
      this.beam.scale.set(pulse, len, pulse);
      this.core.scale.set(1, len, 1);
      this.obj.children.forEach((c) => {
        if (c.userData.src) c.position.set(-dir * (len / 2 - 0.1), 0, 0);
      });
      return;
    }
    this.obj.visible = p.age >= p.delay || Math.floor(p.age / 4) % 2 === 0;
    const prop = this.obj.children[0];
    prop.scale.x = Math.abs(prop.scale.x) * (dir < 0 ? -1 : 1);
    if (p.kind === 'normal' || p.kind === 'rain' || p.kind === 'mega') {
      prop.rotation.z = p.prop === 'plane' || p.prop === 'jet' || p.prop === 'train' || p.prop === 'tank' || p.prop === 'fire' || p.prop === 'syringe' || p.prop === 'envelope' ? 0 : -dir * p.age * p.spin;
      if (p.prop === 'coin' || p.prop === 'shekel') prop.rotation.y = p.age * 0.3;
    } else if (p.kind === 'trap') {
      prop.position.y = -0.25 + Math.sin(t * 3) * 0.03;
    }
    if (this.glow) {
      const s = 1 + 0.15 * Math.sin(t * 20);
      this.glow.scale.setScalar(s);
    }
  }
}

export interface ShowcaseSlot {
  def: CharacterDef;
  x: number;
  facing: number;
  pose: 'guard' | 'victory' | 'intro';
  variant?: number;
}

export class GameRenderer {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 400);
  effects = new Effects();
  private hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  private key = new THREE.DirectionalLight(0xffffff, 2.5);
  private rim = new THREE.DirectionalLight(0x88aaff, 1.2);
  private stage: BuiltStage | null = null;
  private stageId = '';
  private views: FighterView[] = [];
  private projViews = new Map<number, ProjectileView>();
  private showcase: ({ view: FighterView; slot: ShowcaseSlot } | undefined)[] = [];
  private camPos = new THREE.Vector3(0, 1.8, 8);
  private camLook = new THREE.Vector3(0, 1.1, 0);
  private shake = 0;
  private superFocus: { fighter: number; frames: number } | null = null;
  private time = 0;
  showHitboxes = false;
  private hitboxGroup = new THREE.Group();
  private platform: THREE.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.key.castShadow = true;
    this.key.shadow.mapSize.set(2048, 2048);
    const sc = this.key.shadow.camera;
    sc.left = -14;
    sc.right = 14;
    sc.top = 10;
    sc.bottom = -6;
    sc.near = 1;
    sc.far = 60;
    this.key.shadow.bias = -0.0005;
    this.key.shadow.normalBias = 0.02;
    this.scene.add(this.hemi, this.key, this.key.target, this.rim, this.effects.group, this.hitboxGroup);
    this.platform = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.2, 40), new THREE.MeshStandardMaterial({ color: 0x1b2340, metalness: 0.4, roughness: 0.4 }));
    this.platform.visible = false;
    this.scene.add(this.platform);
    this.resize();
  }

  setQuality(q: 'high' | 'low'): void {
    const low = q === 'low';
    this.renderer.setPixelRatio(low ? 1 : Math.min(2, window.devicePixelRatio || 1));
    this.renderer.shadowMap.enabled = !low;
    this.key.castShadow = !low;
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) m.needsUpdate = true;
    });
    this.resize();
  }

  resize(): void {
    const c = this.renderer.domElement;
    const w = c.clientWidth || window.innerWidth;
    const h = c.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  setStage(def: StageDef): void {
    if (this.stageId === def.id && this.stage) return;
    if (this.stage) {
      this.scene.remove(this.stage.group);
      disposeStage(this.stage);
    }
    this.stage = buildStage(def);
    this.stageId = def.id;
    this.scene.add(this.stage.group);
    const L = this.stage.lighting;
    this.scene.background = new THREE.Color(L.background);
    this.scene.fog = new THREE.Fog(L.fog[0], L.fog[1], L.fog[2]);
    this.hemi.color.setHex(L.hemiSky);
    this.hemi.groundColor.setHex(L.hemiGround);
    this.hemi.intensity = L.hemiIntensity;
    this.key.color.setHex(L.key);
    this.key.intensity = L.keyIntensity;
    this.key.position.set(...L.keyPos);
    this.rim.color.setHex(L.rim);
    this.rim.intensity = L.rimIntensity;
    this.rim.position.set(-4, 6, -10);
  }

  clearStage(): void {
    if (this.stage) {
      this.scene.remove(this.stage.group);
      disposeStage(this.stage);
      this.stage = null;
      this.stageId = '';
    }
    this.scene.background = new THREE.Color(0x05070d);
    this.scene.fog = null;
    this.hemi.color.setHex(0xdde6ff);
    this.hemi.groundColor.setHex(0x222233);
    this.hemi.intensity = 1.2;
    this.key.color.setHex(0xffffff);
    this.key.intensity = 2.8;
    this.key.position.set(3, 8, 8);
    this.rim.color.setHex(0x6f8bff);
    this.rim.intensity = 2.2;
    this.rim.position.set(-4, 5, -6);
  }

  // ---------------------------------------------------------------- fight

  setFighters(defs: CharacterDef[]): void {
    for (const v of this.views) {
      this.scene.remove(v.rig.root);
      v.dispose();
    }
    this.views = defs.map((d) => {
      const v = new FighterView(d);
      this.scene.add(v.rig.root);
      return v;
    });
    for (const pv of this.projViews.values()) this.scene.remove(pv.obj);
    this.projViews.clear();
    this.effects.clear();
    this.superFocus = null;
  }

  clearFighters(): void {
    this.setFighters([]);
  }

  handleEvent(ev: GameEvent, m: Match): void {
    const fx = this.effects;
    switch (ev.t) {
      case 'hit':
        fx.hitSpark(ev.x, ev.y, 0.35, ev.spark, ev.blocked, ev.color);
        if (!ev.blocked && (ev.spark === 'heavy' || ev.spark === 'super' || ev.counter)) this.shake = Math.max(this.shake, ev.spark === 'super' ? 0.18 : 0.08);
        break;
      case 'superFlash': {
        const f = m.fighters[ev.fighter];
        this.superFocus = { fighter: ev.fighter, frames: 48 };
        fx.ring(f.x, 1.1, 0.4, ev.color, 0.3, 3.5, 30);
        fx.burst(f.x, 1.2, 0.3, ev.color, 50, 0.14, 0.07, 0.001, 40);
        break;
      }
      case 'special': {
        const f = m.fighters[ev.fighter];
        fx.burst(f.x, 1.0, 0.3, ev.color, 10, 0.05, 0.04, 0.001, 18);
        break;
      }
      case 'teleport':
        fx.burst(ev.fromX, 1.0, 0.2, ev.color, 30, 0.09, 0.06, 0, 26);
        fx.burst(ev.toX, 1.0, 0.2, ev.color, 30, 0.09, 0.06, 0, 26);
        fx.ring(ev.toX, 1.0, 0.3, ev.color, 0.2, 1.6, 16);
        break;
      case 'buff': {
        const f = m.fighters[ev.fighter];
        fx.ring(f.x, 0.05, 0, ev.color, 0.3, 2.2, 24, true);
        fx.burst(f.x, 0.8, 0.2, ev.color, 26, 0.07, 0.05, -0.002, 36);
        break;
      }
      case 'clash':
        fx.burst(ev.x, ev.y, 0.2, 0xffffff, 24, 0.1, 0.05, 0.002, 20);
        fx.ring(ev.x, ev.y, 0.3, 0xffffff, 0.2, 1.2, 14);
        break;
      case 'tech':
        fx.ring(ev.x, ev.y, 0.3, 0xffffff, 0.2, 1.4, 14);
        fx.burst(ev.x, ev.y, 0.2, 0xaad4ff, 20, 0.09, 0.05, 0.001, 16);
        break;
      case 'lifeline': {
        const f = m.fighters[ev.fighter];
        fx.flash(f.x, 1.0, 0.2, 0xffd200, 2.5, 20);
        fx.burst(f.x, 1.0, 0.2, 0xffd200, 60, 0.15, 0.07, 0.002, 40);
        this.shake = 0.2;
        break;
      }
      case 'land':
        if (ev.hard) {
          const f = m.fighters[ev.fighter];
          fx.burst(f.x, 0.1, 0.1, 0xb8a888, 16, 0.05, 0.06, 0.002, 26);
        }
        break;
      case 'shake':
        this.shake = Math.max(this.shake, ev.amount);
        break;
      case 'ko': {
        if (ev.loser >= 0) {
          const f = m.fighters[ev.loser];
          fx.flash(f.x, 1.0, 0.2, 0xffffff, 3, 16);
        }
        break;
      }
    }
  }

  syncFight(m: Match, dt: number): void {
    this.time += dt;
    this.platform.visible = false;
    this.views.forEach((v, i) => v.sync(m.fighters[i], m, dt, this.effects));

    // Projectiles
    const alive = new Set<number>();
    for (const p of m.projectiles) {
      alive.add(p.id);
      let pv = this.projViews.get(p.id);
      if (!pv) {
        pv = new ProjectileView(p);
        this.projViews.set(p.id, pv);
        this.scene.add(pv.obj);
      }
      pv.sync(p, this.time);
    }
    for (const [id, pv] of this.projViews) {
      if (!alive.has(id)) {
        const pos = pv.obj.position;
        this.effects.burst(pos.x, pos.y, pos.z, 0xffffff, 8, 0.05, 0.035, 0.002, 14);
        this.scene.remove(pv.obj);
        this.projViews.delete(id);
      }
    }
    this.stage?.update(this.time);
    this.effects.update(dt);
    this.updateFightCamera(m, dt);
    this.drawHitboxes(m);
  }

  private updateFightCamera(m: Match, dt: number): void {
    const [a, b] = m.fighters;
    const k = 1 - Math.exp(-dt * 6);
    const pos = new THREE.Vector3();
    const look = new THREE.Vector3();
    const mid = (a.x + b.x) / 2;
    const sep = Math.abs(a.x - b.x);
    const topY = Math.max(a.y, b.y);

    if (m.freeze > 0 && this.superFocus) {
      const f = m.fighters[this.superFocus.fighter];
      pos.set(f.x - f.facing * 0.5, 1.45, 2.7);
      look.set(f.x + f.facing * 0.25, 1.35, 0);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 12));
    } else if (m.cinematic) {
      const c = m.cinematic;
      const cx = (c.att.x + c.def.x) / 2;
      const ang = c.frame * 0.02 - 0.6;
      pos.set(cx + Math.sin(ang) * 4.2, 1.5 + Math.sin(c.frame * 0.05) * 0.3, Math.cos(ang) * 4.2);
      look.set(cx, 1.1, 0);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 5));
    } else if (m.phase === 'intro') {
      const first = m.phaseFrame < 100;
      const f = first ? a : b;
      pos.set(f.x - f.facing * -1.2 + (first ? 1.2 : -1.2), 1.6, 3.4);
      look.set(f.x, 1.3, 0);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 3));
    } else if (m.phase === 'ko' && m.phaseFrame < 100 && m.roundWinner !== null) {
      const loser = m.fighters.find((f) => f.koed) ?? a;
      pos.set(mid + (loser.x - mid) * 0.5, 1.5, 5.2);
      look.set(loser.x * 0.6 + mid * 0.4, 0.9, 0);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 2.5));
    } else if (m.phase === 'matchEnd' && m.matchWinner !== null && m.matchWinner >= 0) {
      const w = m.fighters[m.matchWinner];
      const ang = Math.sin(this.time * 0.3) * 0.3;
      pos.set(w.x + Math.sin(ang) * 3.6, 1.55, Math.cos(ang) * 3.6);
      look.set(w.x, 1.2, 0);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 2));
    } else {
      const dist = Math.max(5.8, Math.min(10, 5.0 + sep * 0.62));
      const lim = 10.5 - dist * 0.45;
      const cx = Math.max(-lim, Math.min(lim, mid));
      pos.set(cx, 1.75 + topY * 0.35, dist);
      look.set(cx, 1.12 + topY * 0.3, 0);
      this.lerpCam(pos, look, k);
    }
    if (this.superFocus) {
      this.superFocus.frames--;
      if (this.superFocus.frames <= 0 && m.freeze <= 0) this.superFocus = null;
    }
    this.applyCamera(dt);
  }

  private lerpCam(pos: THREE.Vector3, look: THREE.Vector3, k: number): void {
    this.camPos.lerp(pos, k);
    this.camLook.lerp(look, k);
  }

  private applyCamera(dt: number): void {
    this.camera.position.copy(this.camPos);
    if (this.shake > 0.001) {
      this.camera.position.x += (Math.random() - 0.5) * this.shake;
      this.camera.position.y += (Math.random() - 0.5) * this.shake;
      this.shake *= Math.pow(0.86, dt * 60);
    }
    this.camera.lookAt(this.camLook);
  }

  private drawHitboxes(m: Match): void {
    this.hitboxGroup.visible = this.showHitboxes;
    if (!this.showHitboxes) return;
    while (this.hitboxGroup.children.length) {
      const c = this.hitboxGroup.children.pop() as THREE.Mesh;
      c.geometry.dispose();
    }
    const addBox = (x: number, y: number, w: number, h: number, color: number) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, depthTest: false }));
      mesh.position.set(x, y, 0.8);
      mesh.renderOrder = 999;
      this.hitboxGroup.add(mesh);
    };
    for (const f of m.fighters) {
      for (const h of f.hurtboxes()) addBox(h.x, h.y, h.w, h.h, 0x33ff66);
      const hb = f.activeHitbox();
      if (hb) addBox(hb.x, hb.y, hb.w, hb.h, 0xff2244);
    }
    for (const p of m.projectiles) if (p.active) addBox(p.x, p.y, p.w, p.h, 0xff9922);
  }

  // ---------------------------------------------------------------- menus

  setShowcase(slots: ShowcaseSlot[], withPlatform = true): void {
    for (const s of this.showcase) {
      if (!s) continue;
      this.scene.remove(s.view.rig.root);
      s.view.dispose();
    }
    this.showcase = slots.map((slot) => {
      const view = new FighterView(slot.def);
      view.rig.root.position.set(slot.x, 0, 0);
      this.scene.add(view.rig.root);
      return { view, slot };
    });
    this.platform.visible = withPlatform && slots.length > 0;
    this.views.forEach((v) => (v.rig.root.visible = false));
  }

  updateShowcaseSlot(i: number, slot: ShowcaseSlot | null): void {
    const cur = this.showcase[i];
    if (cur && slot && cur.slot.def.id === slot.def.id) {
      cur.slot = slot;
      return;
    }
    if (cur) {
      this.scene.remove(cur.view.rig.root);
      cur.view.dispose();
    }
    if (!slot) {
      this.showcase[i] = undefined;
      return;
    }
    const view = new FighterView(slot.def);
    this.scene.add(view.rig.root);
    this.showcase[i] = { view, slot };
  }

  syncShowcase(dt: number, cam: { pos: [number, number, number]; look: [number, number, number] }): void {
    this.time += dt;
    const count = this.showcaseCount;
    this.showcase.forEach((entry, i) => {
      if (!entry) return;
      const { view, slot } = entry;
      view.anim.showcase(dt, this.time, slot.pose, slot.variant ?? 0, i * 1.7);
      view.anim.apply(view.rig);
      const root = view.rig.root;
      root.visible = true;
      root.position.set(slot.x, this.platform.visible && count === 1 ? 0.1 : 0, 0);
      root.rotation.y = slot.facing > 0 ? FACE_ANGLE - 0.5 : -FACE_ANGLE + 0.5;
      for (const m of view.rig.materials) m.emissive.setRGB(0, 0, 0);
      view.aura.visible = false;
      view.shield.visible = false;
      view.stars.visible = false;
    });
    this.stage?.update(this.time);
    this.effects.update(dt);
    const k = 1 - Math.exp(-dt * 4);
    this.lerpCam(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.look), k);
    this.applyCamera(dt);
  }

  get showcaseCount(): number {
    return this.showcase.filter(Boolean).length;
  }

  get currentStage(): string {
    return this.stageId;
  }

  clearShowcase(): void {
    this.setShowcase([], false);
  }

  snapCamera(pos: [number, number, number], look: [number, number, number]): void {
    this.camPos.set(...pos);
    this.camLook.set(...look);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}

export function partyColor(def: CharacterDef): number {
  return PARTIES[def.party].color;
}
