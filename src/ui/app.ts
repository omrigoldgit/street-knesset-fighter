import { AudioEngine } from '../core/audio';
import { InputManager, glyphClass, glyphFor, type Action, type GlyphStyle } from '../core/input';
import { loadSettings, saveSettings, type Settings } from '../core/settings';
import type { CharacterDef } from '../game/characterTypes';
import type { StageDef } from '../data/stages';
import { FPS } from '../game/constants';
import { GameRenderer } from '../render/renderer';
import { setFaceMode } from '../render/faces';

export interface Screen {
  enter(): void;
  exit(): void;
  /** 60 Hz logic. */
  tick(): void;
  /** Once per rendered frame. */
  frame(dt: number): void;
}

export type Mode = 'arcade' | 'versus' | 'training' | 'watch';

export interface FightSetup {
  mode: Mode;
  p1: CharacterDef;
  p2: CharacterDef;
  stage: StageDef;
  cpu: [boolean, boolean];
}

export interface ArcadeState {
  player: CharacterDef;
  ladder: CharacterDef[];
  stages: StageDef[];
  index: number;
  continues: number;
}

interface DesktopBridge {
  quit: () => void;
  toggleFullscreen: () => void;
}

export class App {
  canvas: HTMLCanvasElement;
  ui: HTMLElement;
  renderer: GameRenderer;
  input = new InputManager();
  audio = new AudioEngine();
  settings: Settings = loadSettings();
  screen: Screen | null = null;
  arcade: ArcadeState | null = null;
  lastSetup: FightSetup | null = null;
  desktop: DesktopBridge | null = (window as unknown as { skfDesktop?: DesktopBridge }).skfDesktop ?? null;
  private quality: Settings['quality'] | null = null;
  private acc = 0;
  private last = 0;
  fps = 0;

  constructor() {
    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    this.ui = document.getElementById('ui') as HTMLElement;
    this.renderer = new GameRenderer(this.canvas);
    this.applySettings();
    window.addEventListener('resize', () => this.renderer.resize());
    const unlock = () => this.audio.unlock();
    window.addEventListener('keydown', unlock);
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'F11' && !this.desktop) {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });
  }

  applySettings(): void {
    const s = this.settings;
    this.audio.volumes = { master: s.masterVolume, music: s.musicVolume, sfx: s.sfxVolume };
    this.audio.announcer = s.announcer;
    this.audio.applyVolumes();
    this.input.rumbleEnabled = s.rumble;
    this.renderer.showHitboxes = s.showHitboxes;
    setFaceMode(s.faces);
    if (this.quality !== s.quality) {
      this.quality = s.quality;
      this.renderer.setQuality(s.quality);
    }
    saveSettings(s);
  }

  toggleFullscreen(): void {
    if (this.desktop) {
      this.desktop.toggleFullscreen();
      return;
    }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else document.documentElement.requestFullscreen().catch(() => undefined);
  }

  go(s: Screen): void {
    this.screen?.exit();
    this.ui.innerHTML = '';
    this.screen = s;
    s.enter();
  }

  start(): void {
    const loop = (now: number) => {
      const dt = this.last ? Math.min(0.1, (now - this.last) / 1000) : 1 / FPS;
      this.last = now;
      this.fps = this.fps * 0.95 + (1 / Math.max(dt, 0.001)) * 0.05;
      this.acc += dt;
      let steps = 0;
      while (this.acc >= 1 / FPS && steps < 5) {
        this.input.poll();
        if (this.input.anyPressed()) this.audio.unlock();
        this.screen?.tick();
        this.acc -= 1 / FPS;
        steps++;
      }
      if (steps === 5) this.acc = 0;
      this.screen?.frame(dt);
      this.renderer.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  glyphStyle(slot: 0 | 1): GlyphStyle {
    const info = this.input.padInfo(slot);
    if (!info || this.input.lastDevice[slot] !== 'pad') return 'kb';
    return info.kind === 'xbox' ? 'xbox' : 'ps';
  }

  /** Glyph style for menus: follows whichever device was used last. */
  menuStyle(): GlyphStyle {
    const pads = this.input.connectedPads();
    if (!pads.length) return 'kb';
    if (this.input.lastDevice[0] !== 'pad' && this.input.lastDevice[1] !== 'pad') return 'kb';
    const slot = this.input.lastDevice[0] === 'pad' ? 0 : 1;
    const info = this.input.padInfo(slot) ?? pads[0];
    return info.kind === 'xbox' ? 'xbox' : 'ps';
  }

  glyph(action: Action, slot: 0 | 1 = 0, style?: GlyphStyle): string {
    const st = style ?? this.glyphStyle(slot);
    return `<span class="g ${glyphClass(action, st)}">${glyphFor(action, st, slot)}</span>`;
  }

  /** Menu glyphs: confirm / back / extra. */
  mg(kind: 'confirm' | 'back' | 'extra' | 'extra2' | 'start'): string {
    const st = this.menuStyle();
    if (st === 'ps') {
      const m = { confirm: ['g-cross', '✕'], back: ['g-circle', '○'], extra: ['g-triangle', '△'], extra2: ['g-square', '□'], start: ['g-shoulder', 'OPTIONS'] }[kind];
      return `<span class="g ${m[0]}">${m[1]}</span>`;
    }
    if (st === 'xbox') {
      const m = { confirm: 'A', back: 'B', extra: 'Y', extra2: 'X', start: 'MENU' }[kind];
      return `<span class="g g-key">${m}</span>`;
    }
    const m = { confirm: 'Enter', back: 'Esc', extra: 'I', extra2: 'O', start: 'Esc' }[kind];
    return `<span class="g g-key">${m}</span>`;
  }
}
