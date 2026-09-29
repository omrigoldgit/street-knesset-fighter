// Scene management, the Tekken-style orbiting camera and syncing of engine state to 3D views.

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
import { faceTexture, photoHead } from './faces';
import { EnvBuilder } from './env';
import { PostFX } from './post';
import type { Quality } from '../core/settings';
import { personaFor, type GestureId } from '../data/personas';

const NEXT_LOWER: Record<Quality, Quality | null> = { ultra: 'high', high: 'low', low: null };

/** Menu showcase turn toward the camera. */
const FACE_ANGLE = Math.PI / 2 - 0.32;
const PROP_ANIMS = new Set(['cast', 'grab', 'charge', 'whip', 'beam', 'counterStance', 'place', 'uppercut', 'summon', 'stomp', 'flurry', 'slamRise']);
const RAGE_COLOR = 0xff2a1a;
const DUST = 0xc8b89a;

/** Engine yaw (direction (cos, sin) on x/z) → model rotation (models face local +Z). */
const modelYaw = (yaw: number) => Math.PI / 2 - yaw;

class FighterView {
  rig: Rig;
  anim = new Animator();
  shield: THREE.Mesh;
  stars: THREE.Group;
  prop: THREE.Group | null = null;
  propStyle: PropStyle | null = null;
  whip: THREE.Mesh;
  private auraTimer = 0;
  private prevState = '';

  constructor(def: CharacterDef) {
    // Best available head: 3D photo face, else the flat photo card, else the caricature.
    const photo = photoHead(def.id);
    this.rig = buildCharacter(def, { photo, face: photo ? null : faceTexture(def.id) });
    this.anim.setPersona(personaFor(def.id, def.style));
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
  }

  /**
   * Photo heads always face the camera, so roll them to follow the body (knockdowns, hit tilts).
   * `side` is how much the fighter faces screen-right (+1) or screen-left (-1).
   */
  syncFace(flash: number, side: number, wobble: number): void {
    const s = this.rig.faceSprite;
    if (!s) return;
    const mat = s.material as THREE.SpriteMaterial;
    mat.rotation = -this.anim.pivotX * side + this.anim.headRoll * 0.6 * side + wobble;
    mat.color.setRGB(1, 1 - flash * 0.45, 1 - flash * 0.5);
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
    let z = f.z;
    if (f.flash > 0 && m.hitstop > 0) {
      x += (Math.random() - 0.5) * 0.08;
      z += (Math.random() - 0.5) * 0.08;
    }
    root.position.set(x, f.y, z);
    root.rotation.y = modelYaw(f.yaw);

    // Hit flash and buff glow.
    const flash = f.flash > 0 ? Math.min(1, f.flash / 5) * 0.7 : 0;
    const buff = f.buffs.find((b) => b.kind !== 'shield' && b.kind !== 'reflect' && b.kind !== 'slow');
    const t = m.ticks / 60;
    for (const mat of this.rig.materials) {
      if (flash > 0) {
        mat.emissive.setRGB(flash * 0.5, flash * 0.42, flash * 0.34);
      } else if (buff) {
        mat.emissive.setHex(buff.color).multiplyScalar(0.18 + 0.1 * Math.sin(t * 8));
      } else if (f.inRage) {
        mat.emissive.setRGB(0.16 + 0.08 * Math.sin(t * 7), 0.01, 0);
      } else if (f.lifelineUsed && f.health <= 1) {
        mat.emissive.setRGB(0.3 + 0.2 * Math.sin(t * 10), 0, 0);
      } else {
        mat.emissive.setRGB(0, 0, 0);
      }
    }
    const R = m.screenRight;
    const side = f.dirX * R.x + f.dirZ * R.z;
    this.syncFace(flash, side, f.state === 'hitstun' || f.state === 'cinematic' ? Math.sin(t * 40) * 0.15 : 0);

    if (effects) {
      // Aura: rising particles (buffs, meter, Rage).
      const auraColor = buff?.color ?? (f.state === 'attack' && f.move?.kind === 'super' ? f.move.color ?? 0xffd200 : f.inRage ? RAGE_COLOR : f.meter >= 100 ? 0xffd200 : null);
      if (auraColor !== null) {
        this.auraTimer += dt * 60;
        const rate = buff || f.move?.kind === 'super' ? 2 : f.inRage ? 3 : 6;
        while (this.auraTimer >= rate) {
          this.auraTimer -= rate;
          effects.burst(f.x + (Math.random() - 0.5) * 0.7, f.y + 0.1 + Math.random() * 1.2, f.z + (Math.random() - 0.5) * 0.7, auraColor, 1, 0.01, 0.035, -0.0015, 34);
        }
      }
      // Footwork dust: dashes, backdashes, sidesteps, runs.
      if (f.state !== this.prevState && f.grounded) {
        if (f.state === 'dash' || f.state === 'backdash' || f.state === 'sidestep' || f.state === 'techroll') {
          effects.burst(f.x, 0.06, f.z, DUST, 8, 0.035, 0.05, 0.001, 22);
        }
      }
      if (f.state === 'run' && f.stateFrame % 8 === 0) effects.burst(f.x, 0.05, f.z, DUST, 3, 0.025, 0.045, 0.001, 18);
    }
    this.prevState = f.state;

    const sh = f.buff('shield') ?? f.buff('reflect');
    this.shield.visible = !!sh;
    if (sh) {
      (this.shield.material as THREE.MeshBasicMaterial).color.setHex(sh.color);
      (this.shield.material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.08 * Math.sin(t * 6);
    }
    this.stars.visible = f.state === 'dizzy';
    if (this.stars.visible) {
      const hy = f.crumpled ? 1.35 : 1.95;
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

    // Whip / pull visual (local +Z is straight ahead).
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

const NO_SPIN_PROPS = new Set(['plane', 'jet', 'train', 'tank', 'fire', 'syringe', 'envelope']);

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
      this.obj.add(prop);
      this.glow = new THREE.Mesh(new THREE.SphereGeometry(0.32 * p.scale, 14, 10), additive(p.color, 0.25));
      this.obj.add(this.glow);
    }
  }

  sync(p: Projectile, t: number): void {
    // Props are modelled travelling along +X; turn that onto the projectile's heading.
    this.obj.position.set(p.x, p.y, p.z);
    this.obj.rotation.y = -Math.atan2(p.dirZ, p.dirX);
    if (this.beam && this.core) {
      const len = p.w;
      const pulse = 1 + 0.12 * Math.sin(t * 40);
      this.beam.scale.set(pulse, len, pulse);
      this.core.scale.set(1, len, 1);
      this.obj.children.forEach((c) => {
        if (c.userData.src) c.position.set(-(len / 2 - 0.1), 0, 0);
      });
      return;
    }
    this.obj.visible = p.age >= p.delay || Math.floor(p.age / 4) % 2 === 0;
    const prop = this.obj.children[0];
    if (p.kind === 'normal' || p.kind === 'rain' || p.kind === 'mega') {
      prop.rotation.z = NO_SPIN_PROPS.has(p.prop) ? 0 : -p.age * p.spin;
      if (p.prop === 'coin' || p.prop === 'shekel') prop.rotation.y = p.age * 0.3;
    } else if (p.kind === 'trap') {
      prop.position.y = -0.25 + Math.sin(t * 3) * 0.03;
    }
    if (this.glow) this.glow.scale.setScalar(1 + 0.15 * Math.sin(t * 20));
  }
}

export interface ShowcaseSlot {
  def: CharacterDef;
  x: number;
  facing: number;
  pose: 'guard' | 'victory' | 'intro';
  variant?: number;
  /** Force a specific gesture instead of the fighter's own intro / victory. */
  gesture?: GestureId;
}

type ShowcaseEntry = { view: FighterView; slot: ShowcaseSlot; since: number };

const clamp =(v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

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
  private showcase: (ShowcaseEntry | undefined)[] = [];
  private camPos = new THREE.Vector3(0, 1.8, 8);
  private camLook = new THREE.Vector3(0, 1.1, 0);
  private shake = 0;
  private superFocus: { fighter: number; frames: number } | null = null;
  private time = 0;
  showHitboxes = false;
  private hitboxGroup = new THREE.Group();
  private platform: THREE.Mesh;
  private env: EnvBuilder;
  private post: PostFX;
  private quality: Quality = 'ultra';
  private keyOffset = new THREE.Vector3(4, 12, 8);
  private lastRender = 0;
  /** Adaptive quality: drops a level if fights run below ~42 fps for a few seconds. */
  autoQuality = true;
  private perf = { time: 0, frames: 0, fightUntil: 0 };
  /** Called when auto-quality steps down, so the UI can tell the player. */
  onQualityDrop: ((q: Quality) => void) | null = null;

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
    sc.left = -8;
    sc.right = 8;
    sc.top = 8;
    sc.bottom = -8;
    sc.near = 1;
    sc.far = 60;
    this.key.shadow.bias = -0.0004;
    this.key.shadow.normalBias = 0.025;
    this.key.shadow.radius = 3;
    this.scene.add(this.hemi, this.key, this.key.target, this.rim, this.rim.target, this.effects.group, this.hitboxGroup);
    this.platform = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.2, 40), new THREE.MeshStandardMaterial({ color: 0x1b2340, metalness: 0.6, roughness: 0.3 }));
    this.platform.visible = false;
    this.scene.add(this.platform);
    this.env = new EnvBuilder(this.renderer);
    this.scene.environment = this.env.studio();
    this.scene.environmentIntensity = 0.6;
    this.post = new PostFX(this.renderer, this.scene, this.camera);
    this.resize();
  }

  get currentQuality(): Quality {
    return this.quality;
  }

  setQuality(q: Quality): void {
    this.quality = q;
    const low = q === 'low';
    this.renderer.shadowMap.enabled = !low;
    this.key.castShadow = !low;
    this.post.setQuality(q);
    this.perf = { time: 0, frames: 0, fightUntil: 0 };
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) m.needsUpdate = true;
    });
    this.resize();
  }

  private pixelRatio(): number {
    const dpr = window.devicePixelRatio || 1;
    return this.quality === 'ultra' ? Math.min(dpr, 1.5) : this.quality === 'high' ? Math.min(dpr, 1.25) : 1;
  }

  resize(): void {
    const c = this.renderer.domElement;
    const w = c.clientWidth || window.innerWidth;
    const h = c.clientHeight || window.innerHeight;
    const pr = this.pixelRatio();
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.post.setSize(w, h, pr);
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
    // The environment map carries most of the ambient light now.
    this.hemi.intensity = L.hemiIntensity * 0.45;
    this.key.color.setHex(L.key);
    this.key.intensity = L.keyIntensity * 1.1;
    this.keyOffset.set(...L.keyPos);
    this.key.position.copy(this.keyOffset);
    this.key.target.position.set(0, 0, 0);
    this.rim.color.setHex(L.rim);
    this.rim.intensity = L.rimIntensity * 1.3;
    this.rim.position.set(-4, 6, -10);
    this.scene.environment = this.env.fromSpec(def.id, L.env);
    this.scene.environmentIntensity = L.envIntensity;
    this.renderer.toneMappingExposure = L.exposure ?? 1;
    this.post.setLook(L.look ?? {});
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
    this.rim.intensity = 2.8;
    this.rim.position.set(-4, 5, -6);
    this.key.target.position.set(0, 0, 0);
    this.scene.environment = this.env.studio();
    this.scene.environmentIntensity = 0.6;
    this.renderer.toneMappingExposure = 1;
    this.post.setLook({ bloom: 0.5, vignette: 0.45 });
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
        fx.hitSpark(ev.x, ev.y, ev.z, ev.spark, ev.blocked, ev.color);
        if (!ev.blocked && (ev.spark === 'heavy' || ev.spark === 'super' || ev.counter)) this.shake = Math.max(this.shake, ev.spark === 'super' ? 0.18 : 0.08);
        if (!ev.blocked) {
          if (ev.counter) this.post.pulse(0.05, 0.1, 0xfff0c0);
          else if (ev.spark === 'super') this.post.pulse(0.06, 0.16, 0xffe08a);
          else if (ev.spark === 'heavy' || ev.spark === 'special') this.post.pulse(0.025);
        }
        break;
      case 'superFlash': {
        const f = m.fighters[ev.fighter];
        this.superFocus = { fighter: ev.fighter, frames: 48 };
        this.post.pulse(0.03, 0.22, ev.color);
        fx.ring(f.x, 1.1, f.z, ev.color, 0.3, 3.5, 30);
        fx.burst(f.x, 1.2, f.z, ev.color, 50, 0.14, 0.07, 0.001, 40);
        break;
      }
      case 'special': {
        const f = m.fighters[ev.fighter];
        fx.burst(f.x, 1.0, f.z, ev.color, 10, 0.05, 0.04, 0.001, 18);
        break;
      }
      case 'teleport':
        fx.burst(ev.fromX, 1.0, ev.fromZ, ev.color, 30, 0.09, 0.06, 0, 26);
        fx.burst(ev.toX, 1.0, ev.toZ, ev.color, 30, 0.09, 0.06, 0, 26);
        fx.ring(ev.toX, 1.0, ev.toZ, ev.color, 0.2, 1.6, 16);
        break;
      case 'buff': {
        const f = m.fighters[ev.fighter];
        fx.ring(f.x, 0.05, f.z, ev.color, 0.3, 2.2, 24, true);
        fx.burst(f.x, 0.8, f.z, ev.color, 26, 0.07, 0.05, -0.002, 36);
        break;
      }
      case 'clash':
        fx.burst(ev.x, ev.y, ev.z, 0xffffff, 24, 0.1, 0.05, 0.002, 20);
        fx.ring(ev.x, ev.y, ev.z, 0xffffff, 0.2, 1.2, 14);
        break;
      case 'tech':
        fx.ring(ev.x, ev.y, ev.z, 0xffffff, 0.2, 1.4, 14);
        fx.burst(ev.x, ev.y, ev.z, 0xaad4ff, 20, 0.09, 0.05, 0.001, 16);
        break;
      case 'wallsplat': {
        const f = m.fighters[ev.fighter];
        const r = Math.hypot(f.x, f.z) || 1;
        const wx = (f.x / r) * (r + 0.35);
        const wz = (f.z / r) * (r + 0.35);
        fx.burst(wx, 1.1, wz, 0xe8dcc4, 34, 0.1, 0.07, 0.004, 34);
        fx.flash(wx, 1.1, wz, 0xffffff, 0.8, 8);
        this.shake = Math.max(this.shake, 0.16);
        break;
      }
      case 'techroll': {
        const f = m.fighters[ev.fighter];
        fx.burst(f.x, 0.08, f.z, DUST, 12, 0.05, 0.05, 0.001, 22);
        break;
      }
      case 'rage': {
        const f = m.fighters[ev.fighter];
        fx.ring(f.x, 0.05, f.z, RAGE_COLOR, 0.3, 2.6, 30, true);
        fx.burst(f.x, 1.0, f.z, RAGE_COLOR, 40, 0.1, 0.06, -0.001, 40);
        break;
      }
      case 'lifeline': {
        const f = m.fighters[ev.fighter];
        fx.flash(f.x, 1.0, f.z, 0xffd200, 2.5, 20);
        fx.burst(f.x, 1.0, f.z, 0xffd200, 60, 0.15, 0.07, 0.002, 40);
        this.shake = 0.2;
        break;
      }
      case 'land':
        if (ev.hard) {
          const f = m.fighters[ev.fighter];
          fx.burst(f.x, 0.1, f.z, DUST, 16, 0.05, 0.06, 0.002, 26);
        }
        break;
      case 'shake':
        this.shake = Math.max(this.shake, ev.amount);
        break;
      case 'ko': {
        if (ev.loser >= 0) {
          const f = m.fighters[ev.loser];
          fx.flash(f.x, 1.0, f.z, 0xffffff, 3, 16);
        }
        this.post.pulse(0.08, 0.35);
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
    this.updateFightCamera(m, dt);
    this.effects.update(dt, this.camera);
    this.hideOccluders();
    this.drawHitboxes(m);
    // Keep the shadow map centred on the action for crisp shadows anywhere in the arena.
    const [a, b] = m.fighters;
    const mx = (a.x + b.x) / 2;
    const mz = (a.z + b.z) / 2;
    this.key.target.position.set(mx, 0, mz);
    this.key.position.set(mx + this.keyOffset.x, this.keyOffset.y, mz + this.keyOffset.z);
    // Rim light stays behind the fighters as the camera orbits, outlining them against the set.
    this.rim.position.set(mx - m.camN.x * 8, 5.5, mz - m.camN.z * 8);
    this.rim.target.position.set(mx, 1, mz);
    this.perf.fightUntil = this.time + 0.5;
  }

  /**
   * Tekken camera: always perpendicular to the fight axis (match.camN), orbiting as the
   * fighters sidestep around each other, pulling back as they separate.
   */
  private updateFightCamera(m: Match, dt: number): void {
    const [a, b] = m.fighters;
    const n = m.camN;
    const pos = new THREE.Vector3();
    const look = new THREE.Vector3();
    const mx = (a.x + b.x) / 2;
    const mz = (a.z + b.z) / 2;
    const sep = Math.hypot(a.x - b.x, a.z - b.z);
    const topY = Math.max(a.y, b.y);
    const baseAng = Math.atan2(n.z, n.x);

    if (m.freeze > 0 && this.superFocus) {
      const f = m.fighters[this.superFocus.fighter];
      pos.set(f.x + n.x * 2.5 + f.dirX * 0.7, 1.45, f.z + n.z * 2.5 + f.dirZ * 0.7);
      look.set(f.x + f.dirX * 0.25, 1.35, f.z + f.dirZ * 0.25);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 12));
    } else if (m.cinematic) {
      const c = m.cinematic;
      const cx = (c.att.x + c.def.x) / 2;
      const cz = (c.att.z + c.def.z) / 2;
      const ang = baseAng + c.frame * 0.02 - 0.6;
      pos.set(cx + Math.cos(ang) * 4.2, 1.5 + Math.sin(c.frame * 0.05) * 0.3, cz + Math.sin(ang) * 4.2);
      look.set(cx, 1.1, cz);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 5));
    } else if (m.phase === 'intro') {
      // Face-on close-ups of each fighter in turn.
      const f = m.phaseFrame < 100 ? a : b;
      pos.set(f.x + f.dirX * 2.3 + n.x * 1.1, 1.55, f.z + f.dirZ * 2.3 + n.z * 1.1);
      look.set(f.x, 1.3, f.z);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 3));
    } else if (m.phase === 'ko' && m.phaseFrame < 100 && m.roundWinner !== null) {
      const loser = m.fighters.find((f) => f.koed) ?? a;
      const lx = mx + (loser.x - mx) * 0.5;
      const lz = mz + (loser.z - mz) * 0.5;
      pos.set(lx + n.x * 5.2, 1.5, lz + n.z * 5.2);
      look.set(loser.x * 0.6 + mx * 0.4, 0.9, loser.z * 0.6 + mz * 0.4);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 2.5));
    } else if (m.phase === 'matchEnd' && m.matchWinner !== null && m.matchWinner >= 0) {
      const w = m.fighters[m.matchWinner];
      const ang = Math.atan2(w.dirZ, w.dirX) + Math.sin(this.time * 0.3) * 0.3;
      pos.set(w.x + Math.cos(ang) * 3.6, 1.55, w.z + Math.sin(ang) * 3.6);
      look.set(w.x, 1.2, w.z);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 2));
    } else {
      const dist = clamp(3.4 + sep * 0.72, 4.6, 9.5);
      pos.set(mx + n.x * dist, 1.5 + topY * 0.35 + dist * 0.05, mz + n.z * dist);
      look.set(mx, 1.05 + topY * 0.3, mz);
      this.lerpCam(pos, look, 1 - Math.exp(-dt * 7));
    }
    if (this.superFocus) {
      this.superFocus.frames--;
      if (this.superFocus.frames <= 0 && m.freeze <= 0) this.superFocus = null;
    }
    this.applyCamera(dt);
  }

  /** Hides stage pieces standing between the camera and the fighters (Tekken-style wall cut-away). */
  private hideOccluders(): void {
    const occ = this.stage?.occluders;
    if (!occ) return;
    const ax = this.camPos.x;
    const az = this.camPos.z;
    const bx = this.camLook.x;
    const bz = this.camLook.z;
    const dx = bx - ax;
    const dz = bz - az;
    const len2 = dx * dx + dz * dz || 1;
    for (const o of occ) {
      const ox = o.position.x;
      const oz = o.position.z;
      const t = clamp(((ox - ax) * dx + (oz - az) * dz) / len2, 0, 1);
      const px = ax + dx * t - ox;
      const pz = az + dz * t - oz;
      const r = (o.userData.radius as number | undefined) ?? 1.5;
      o.visible = t >= 1 || px * px + pz * pz > (r + 0.6) * (r + 0.6);
    }
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
      this.camera.position.z += (Math.random() - 0.5) * this.shake;
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
      (c.material as THREE.Material).dispose();
    }
    const mat = (color: number) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3, depthTest: false, depthWrite: false });
    const add = (geo: THREE.BufferGeometry, color: number, x: number, y: number, z: number, rotY = 0) => {
      const mesh = new THREE.Mesh(geo, mat(color));
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotY;
      mesh.renderOrder = 999;
      this.hitboxGroup.add(mesh);
    };
    for (const f of m.fighters) {
      for (const c of f.hurtboxes()) add(new THREE.CylinderGeometry(c.r, c.r, c.h, 16, 1, true), 0x33ff66, c.x, c.y, c.z);
      const hb = f.activeHitbox();
      if (hb) {
        const p = f.ahead(hb.x);
        add(new THREE.BoxGeometry((hb.lw ?? 0.26) * 2, hb.h, hb.w), 0xff2244, p.x, f.y + hb.y, p.z, modelYaw(f.yaw));
      }
    }
    for (const p of m.projectiles) {
      if (!p.active) continue;
      if (p.attach) add(new THREE.BoxGeometry(p.h, p.h, p.w), 0xff9922, p.x, p.y, p.z, modelYaw(Math.atan2(p.dirZ, p.dirX)));
      else add(new THREE.SphereGeometry(p.w / 2, 12, 8), 0xff9922, p.x, p.y, p.z);
    }
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
      return { view, slot, since: this.time };
    });
    this.platform.visible = withPlatform && slots.length > 0;
    this.views.forEach((v) => (v.rig.root.visible = false));
  }

  updateShowcaseSlot(i: number, slot: ShowcaseSlot | null): void {
    const cur = this.showcase[i];
    if (cur && slot && cur.slot.def.id === slot.def.id) {
      // Restart the gesture when the pose changes (e.g. a fighter gets picked).
      if (cur.slot.pose !== slot.pose || cur.slot.gesture !== slot.gesture) cur.since = this.time;
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
    this.showcase[i] = { view, slot, since: this.time };
  }

  syncShowcase(dt: number, cam: { pos: [number, number, number]; look: [number, number, number] }): void {
    this.time += dt;
    const count = this.showcaseCount;
    this.showcase.forEach((entry, i) => {
      if (!entry) return;
      const { view, slot } = entry;
      view.anim.showcase(dt, this.time, slot.pose, slot.variant ?? 0, i * 1.7, slot.gesture, entry.since);
      view.anim.apply(view.rig);
      const root = view.rig.root;
      root.visible = true;
      root.position.set(slot.x, this.platform.visible && count === 1 ? 0.1 : 0, 0);
      root.rotation.y = slot.facing > 0 ? FACE_ANGLE - 0.5 : -FACE_ANGLE + 0.5;
      for (const m of view.rig.materials) m.emissive.setRGB(0, 0, 0);
      view.shield.visible = false;
      view.stars.visible = false;
    });
    this.stage?.update(this.time);
    const k = 1 - Math.exp(-dt * 4);
    this.lerpCam(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.look), k);
    this.applyCamera(dt);
    this.effects.update(dt, this.camera);
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
    const now = performance.now();
    const dt = this.lastRender ? Math.min(0.1, (now - this.lastRender) / 1000) : 1 / 60;
    this.lastRender = now;
    if (this.quality === 'low') this.renderer.render(this.scene, this.camera);
    else this.post.render(dt);
    this.trackPerformance(dt);
  }

  /** Steps quality down when fights run slowly (never back up; the Options menu can). */
  private trackPerformance(dt: number): void {
    if (!this.autoQuality || this.time > this.perf.fightUntil) return;
    this.perf.time += dt;
    this.perf.frames++;
    if (this.perf.time < 4) return;
    const fps = this.perf.frames / this.perf.time;
    this.perf.time = 0;
    this.perf.frames = 0;
    const next = NEXT_LOWER[this.quality];
    if (fps < 42 && next) {
      this.setQuality(next);
      this.onQualityDrop?.(next);
    }
  }
}

export function partyColor(def: CharacterDef): number {
  return PARTIES[def.party].color;
}
