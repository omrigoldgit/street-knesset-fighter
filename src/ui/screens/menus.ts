import { ROSTER } from '../../data/roster';
import { STAGES, STAGE_BY_ID } from '../../data/stages';
import { DIFFICULTY_NAMES } from '../../game/ai';
import { QUALITIES, QUALITY_NAMES } from '../../core/settings';
import { renderPortraits } from '../../render/portraits';
import { loadFaces, loadedFaceCount } from '../../render/faces';
import type { App, Mode, Screen } from '../app';
import { MenuList, el } from '../dom';
import { CharSelectScreen } from './select';
import { ControlsScreen, MoveListScreen } from './info';
import { CreditsScreen, FaceEditorScreen } from './faces';

const MENU_MUSIC = { bpm: 108, root: 50, mode: 'dorian' as const, intensity: 0.5 };

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Renders cartoon portraits, fetches the MKs' photos, then shows the title. */
export class BootScreen implements Screen {
  private bar!: HTMLElement;
  private msg!: HTMLElement;
  private done = false;
  private photosStarted = 0;
  private ticks = 0;

  constructor(private app: App) {}

  enter(): void {
    const w = el('div', 'loading');
    w.innerHTML = `<div class="logo"><span class="l1">Iron</span><span class="l2">Knesset</span><span class="l3">Tournament</span></div>
      <div class="bar"><i style="width:0%"></i></div><div class="boot-msg" style="color:var(--muted);text-align:center">Drafting 40 members of Knesset…</div>`;
    this.app.ui.appendChild(w);
    this.bar = w.querySelector('.bar i') as HTMLElement;
    this.msg = w.querySelector('.boot-msg') as HTMLElement;
    renderPortraits(ROSTER, (d, t) => {
      this.bar.style.width = `${(d / t) * 50}%`;
    }).then(() => {
      if (this.app.settings.faces !== 'photo') {
        this.done = true;
        return;
      }
      this.photosStarted = this.ticks;
      this.msg.textContent = 'Fetching MK photos from Wikipedia…';
      loadFaces(ROSTER, (d, t) => {
        this.bar.style.width = `${50 + (d / t) * 50}%`;
        this.msg.innerHTML = `Fetching MK photos and scanning faces in 3D… ${d}/${t}<br><span style="font-size:13px">First visit only · press any button to skip</span>`;
      }).then(() => {
        this.done = true;
      });
    });
  }

  exit(): void {}

  tick(): void {
    this.ticks++;
    // Photos keep loading in the background if the player skips or the network is slow.
    const waited = this.photosStarted ? this.ticks - this.photosStarted : 0;
    const skip = this.photosStarted > 0 && waited > 60 && this.app.input.anyPressed();
    if (this.done || skip || waited > 60 * 45) this.app.go(new TitleScreen(this.app));
  }

  frame(): void {}
}

/** Plenum backdrop with two random MKs squaring off, shared by the menus. */
export function menuBackdrop(app: App, force = false): void {
  if (!force && app.renderer.showcaseCount === 2 && app.renderer.currentStage === 'plenum') return;
  app.renderer.clearFighters();
  app.renderer.setStage(STAGE_BY_ID.plenum);
  const a = pick(ROSTER);
  let b = pick(ROSTER);
  while (b.id === a.id) b = pick(ROSTER);
  app.renderer.setShowcase([
    { def: a, x: -1.3, facing: 1, pose: 'guard' },
    { def: b, x: 1.3, facing: -1, pose: 'guard' },
  ], false);
  app.audio.playMusic(MENU_MUSIC, 3);
}

export class TitleScreen implements Screen {
  private t = 0;
  constructor(private app: App) {}

  enter(): void {
    const app = this.app;
    menuBackdrop(app, true);
    app.renderer.snapCamera([0, 1.6, 6.5], [0, 1.2, 0]);
    const w = el('div', 'title-wrap');
    w.innerHTML = `<div class="logo"><span class="l1">Iron</span><span class="l2">Knesset</span><span class="l3">Tournament</span><span class="sub"><span class="he">טורניר כנסת הברזל</span> · 40 MKs · ONE PLENUM</span></div>
      <div class="press blink">PRESS ${app.mg('confirm')} / ENTER</div>
      <div class="pads-status"></div>
      <div class="disclaimer">A parody fighting game. All characters are caricatures of public figures; moves and quotes are satire, not real statements.</div>`;
    w.addEventListener('click', () => this.next());
    app.ui.appendChild(w);
    this.updatePads();
    app.input.onChange = () => this.updatePads();
  }

  private updatePads(): void {
    const s = this.app.ui.querySelector('.pads-status');
    if (!s) return;
    const pads = this.app.input.connectedPads();
    s.innerHTML = pads.length
      ? pads.map((p) => `<b>${p.kind === 'dualsense' ? 'DualSense' : p.kind === 'dualshock' ? 'DualShock' : p.kind === 'xbox' ? 'Xbox pad' : 'Gamepad'}</b> connected${p.standard ? '' : ' (raw mode)'}`).join('<br>')
      : 'No controller detected: press a button on your PS5 controller.<br>Keyboard works too.';
  }

  private next(): void {
    this.app.audio.unlock();
    this.app.audio.sfx('menuConfirm');
    this.app.go(new MainMenuScreen(this.app));
  }

  exit(): void {
    this.app.input.onChange = null;
  }

  tick(): void {
    const ms = this.app.input.menu('any');
    if (ms.confirm || ms.start) this.next();
  }

  frame(dt: number): void {
    this.t += dt;
    const a = this.t * 0.15;
    this.app.renderer.syncShowcase(dt, { pos: [Math.sin(a) * 6.2, 1.6 + Math.sin(this.t * 0.4) * 0.2, Math.cos(a) * 6.2], look: [0, 1.15, 0] });
  }
}

export class MainMenuScreen implements Screen {
  private static lastIndex = 0;
  private menu!: MenuList;
  private t = 0;
  constructor(private app: App) {}

  enter(): void {
    const app = this.app;
    const start = (mode: Mode) => () => app.go(new CharSelectScreen(app, mode));
    const items = [
      { label: 'Arcade', desc: 'Fight through 7 MKs and the final boss to form a government.', onSelect: start('arcade') },
      { label: 'Versus', desc: 'Two players, one plenum. Local multiplayer.', onSelect: start('versus') },
      { label: 'Training', desc: 'Practice combos against a dummy. Infinite health and meter.', onSelect: start('training') },
      { label: 'CPU vs CPU', desc: 'Sit back and watch two CPUs debate.', onSelect: start('watch') },
      { label: 'Move Lists', desc: 'Every special move, Heat Smash and passive for all 40 fighters.', onSelect: () => app.go(new MoveListScreen(app, 0, () => app.go(new MainMenuScreen(app)))) },
      { label: 'Controls', desc: 'PS5 DualSense and keyboard layouts, controller assignment and remapping.', onSelect: () => app.go(new ControlsScreen(app, () => app.go(new MainMenuScreen(app)))) },
      { label: 'Faces', desc: 'Adjust any MK’s photo crop, or upload your own photo.', onSelect: () => app.go(new FaceEditorScreen(app, () => app.go(new MainMenuScreen(app)))) },
      { label: 'Credits', desc: 'Photo credits and licences.', onSelect: () => app.go(new CreditsScreen(app, () => app.go(new MainMenuScreen(app)))) },
      { label: 'Options', desc: 'Difficulty, rounds, timer, audio and more.', onSelect: () => app.go(new OptionsScreen(app, () => app.go(new MainMenuScreen(app)))) },
    ];
    if (app.desktop) items.push({ label: 'Quit', desc: 'Exit to desktop.', onSelect: () => app.desktop!.quit() });
    this.menu = new MenuList(items, app.audio, { desc: true });
    this.menu.index = Math.min(MainMenuScreen.lastIndex, items.length - 1);
    this.menu.render();
    const w = el('div', 'mainmenu');
    w.innerHTML = `<div class="logo"><span class="l1">Iron</span><span class="l2">Knesset</span><span class="l3">Tournament</span></div>`;
    w.appendChild(this.menu.el);
    const hint = el('div', 'hint', `${app.mg('confirm')} Select ${app.mg('back')} Back`);
    app.ui.append(w, hint);
    menuBackdrop(app);
  }

  exit(): void {
    MainMenuScreen.lastIndex = this.menu.index;
  }

  tick(): void {
    const ms = this.app.input.menu('any');
    if (ms.back) {
      this.app.audio.sfx('menuBack');
      this.app.go(new TitleScreen(this.app));
      return;
    }
    this.menu.handle(ms);
  }

  frame(dt: number): void {
    this.t += dt;
    const a = 0.5 + Math.sin(this.t * 0.1) * 0.3;
    this.app.renderer.syncShowcase(dt, { pos: [Math.sin(a) * 6 + 1.5, 1.5, Math.cos(a) * 6], look: [1.2, 1.1, 0] });
  }
}

export class OptionsScreen implements Screen {
  private menu!: MenuList;
  constructor(private app: App, private back: () => void) {}

  private toggleFaces(): void {
    const s = this.app.settings;
    s.faces = s.faces === 'photo' ? 'cartoon' : 'photo';
    this.app.applySettings();
    if (s.faces === 'photo' && loadedFaceCount() === 0) void loadFaces(ROSTER);
  }

  enter(): void {
    const app = this.app;
    const s = app.settings;
    const step = (k: 'masterVolume' | 'musicVolume' | 'sfxVolume', d: number) => {
      s[k] = Math.round(Math.max(0, Math.min(1, s[k] + d)) * 10) / 10;
      app.applySettings();
    };
    const times = [30, 60, 99, 0];
    const cycleQuality = (d: number) => {
      s.quality = QUALITIES[(QUALITIES.indexOf(s.quality) + d + QUALITIES.length) % QUALITIES.length];
      app.applySettings();
    };
    const items = [
      { label: 'CPU Difficulty', value: () => DIFFICULTY_NAMES[s.difficulty], onLeft: () => { s.difficulty = Math.max(0, s.difficulty - 1); app.applySettings(); }, onRight: () => { s.difficulty = Math.min(4, s.difficulty + 1); app.applySettings(); }, desc: 'How tough the CPU opponents are.' },
      { label: 'Rounds to Win', value: () => String(s.roundsToWin), onLeft: () => { s.roundsToWin = Math.max(1, s.roundsToWin - 1); app.applySettings(); }, onRight: () => { s.roundsToWin = Math.min(5, s.roundsToWin + 1); app.applySettings(); } },
      { label: 'Round Time', value: () => (s.roundTime === 0 ? '∞' : `${s.roundTime}s`), onLeft: () => { s.roundTime = times[(times.indexOf(s.roundTime) + times.length - 1) % times.length]; app.applySettings(); }, onRight: () => { s.roundTime = times[(times.indexOf(s.roundTime) + 1) % times.length]; app.applySettings(); } },
      { label: 'Master Volume', value: () => `${Math.round(s.masterVolume * 100)}%`, onLeft: () => step('masterVolume', -0.1), onRight: () => step('masterVolume', 0.1) },
      { label: 'Music Volume', value: () => `${Math.round(s.musicVolume * 100)}%`, onLeft: () => step('musicVolume', -0.1), onRight: () => step('musicVolume', 0.1) },
      { label: 'SFX Volume', value: () => `${Math.round(s.sfxVolume * 100)}%`, onLeft: () => step('sfxVolume', -0.1), onRight: () => step('sfxVolume', 0.1) },
      { label: 'Announcer Voice', value: () => (s.announcer ? 'On' : 'Off'), onLeft: () => { s.announcer = !s.announcer; app.applySettings(); }, onRight: () => { s.announcer = !s.announcer; app.applySettings(); }, desc: 'Uses your system text-to-speech voice.' },
      { label: 'Controller Rumble', value: () => (s.rumble ? 'On' : 'Off'), onLeft: () => { s.rumble = !s.rumble; app.applySettings(); }, onRight: () => { s.rumble = !s.rumble; app.applySettings(); }, desc: 'DualSense vibration on hits (Chrome / Edge / desktop app).' },
      { label: 'Show Hitboxes', value: () => (s.showHitboxes ? 'On' : 'Off'), onLeft: () => { s.showHitboxes = !s.showHitboxes; app.applySettings(); }, onRight: () => { s.showHitboxes = !s.showHitboxes; app.applySettings(); } },
      { label: 'Input Display', value: () => (s.inputDisplay ? 'On' : 'Off'), onLeft: () => { s.inputDisplay = !s.inputDisplay; app.applySettings(); }, onRight: () => { s.inputDisplay = !s.inputDisplay; app.applySettings(); } },
      { label: 'Faces', value: () => (s.faces === 'photo' ? 'Photos' : 'Cartoon'), onLeft: () => this.toggleFaces(), onRight: () => this.toggleFaces(), desc: 'Photos: real MK faces from Wikipedia (free-licensed). Cartoon: procedural caricatures.' },
      { label: 'Graphics Quality', value: () => QUALITY_NAMES[s.quality], onLeft: () => cycleQuality(-1), onRight: () => cycleQuality(1), desc: 'Ultra: ambient occlusion, bloom and anti-aliasing. High: no ambient occlusion. Low: for integrated graphics. Drops automatically if the frame rate suffers.' },
      { label: 'Toggle Fullscreen', onSelect: () => app.toggleFullscreen(), desc: 'Or press F11.' },
      { label: 'Back', onSelect: () => this.back() },
    ];
    this.menu = new MenuList(items, app.audio, { desc: true });
    const page = el('div', 'page');
    page.innerHTML = `<div class="options"><h1 class="display">Options</h1><div class="sub">Settings are saved automatically.</div></div>`;
    page.querySelector('.options')!.appendChild(this.menu.el);
    app.ui.append(page, el('div', 'hint', `◀ ▶ Change ${app.mg('confirm')} Select ${app.mg('back')} Back`));
  }

  exit(): void {}

  tick(): void {
    const ms = this.app.input.menu('any');
    if (ms.back) {
      this.app.audio.sfx('menuBack');
      this.back();
      return;
    }
    this.menu.handle(ms);
  }

  frame(dt: number): void {
    this.app.renderer.syncShowcase(dt, { pos: [2, 1.5, 6], look: [0, 1.1, 0] });
  }
}

export { STAGES };
