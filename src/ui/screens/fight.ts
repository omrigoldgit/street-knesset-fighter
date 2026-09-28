import { CpuController, dummyInput } from '../../game/ai';
import { Match, type DummyMode } from '../../game/match';
import { BTN, NO_INPUT, type GameEvent, type PlayerInput } from '../../game/types';
import type { App, FightSetup, Screen } from '../app';
import { Hud } from '../hud';
import { MenuList, el, type MenuItem } from '../dom';
import { moveListHTML } from './info';
import { MainMenuScreen } from './menus';
import { ArcadeContinueScreen, ArcadeLadderScreen, EndingScreen, ResultsScreen } from './results';
import { CharSelectScreen } from './select';

const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const DUMMY_MODES: DummyMode[] = ['stand', 'crouch', 'jump', 'block', 'cpu'];

export class FightScreen implements Screen {
  match!: Match;
  private hud!: Hud;
  private cpu: [CpuController | null, CpuController | null] = [null, null];
  private dummyCpu: CpuController | null = null;
  private paused = false;
  private pauseEl: HTMLElement | null = null;
  private pauseMenu: MenuList | null = null;
  private pauseSub: 'menu' | 'moves' = 'menu';
  private movesSlot: 0 | 1 = 0;
  private endTimer = 0;
  private inputs: [PlayerInput, PlayerInput] = [NO_INPUT, NO_INPUT];
  private finished = false;

  constructor(private app: App, private setup: FightSetup) {}

  private get training(): boolean {
    return this.setup.mode === 'training';
  }

  enter(): void {
    const app = this.app;
    const s = app.settings;
    const { p1, p2, stage } = this.setup;
    this.match = new Match({
      p1,
      p2,
      roundsToWin: this.training ? 1 : s.roundsToWin,
      roundTime: this.training ? 0 : s.roundTime,
      training: this.training ? { infiniteHealth: true, infiniteMeter: true, dummy: 'stand' } : null,
    });
    app.renderer.clearShowcase();
    app.renderer.setStage(stage);
    app.renderer.setFighters([p1, p2]);
    app.renderer.snapCamera([0, 1.8, 7.5], [0, 1.1, 0]);
    let level = s.difficulty;
    if (this.setup.mode === 'arcade' && app.arcade) {
      if (app.arcade.index >= 4) level++;
      if (p2.boss) level++;
    }
    level = Math.max(0, Math.min(4, level));
    this.cpu = [
      this.setup.cpu[0] ? new CpuController(this.setup.mode === 'watch' ? s.difficulty : level, 101) : null,
      this.setup.cpu[1] ? new CpuController(level, 202) : null,
    ];
    this.dummyCpu = new CpuController(s.difficulty, 303);
    this.hud = new Hud(app, this.match, { training: this.training, inputDisplay: s.inputDisplay });
    app.ui.appendChild(this.hud.root);
    app.audio.playMusic(stage.music, stage.id.length + p1.id.length);
  }

  exit(): void {
    this.hud?.destroy();
  }

  private humanSlots(): (0 | 1)[] {
    const out: (0 | 1)[] = [];
    if (!this.setup.cpu[0]) out.push(0);
    if (!this.setup.cpu[1] && !this.training) out.push(1);
    return out;
  }

  // ---------------------------------------------------------------- pause

  private openPause(): void {
    this.paused = true;
    this.match.paused = true;
    this.pauseSub = 'menu';
    this.app.audio.sfx('menuConfirm');
    this.buildPause();
  }

  private closePause(): void {
    this.paused = false;
    this.match.paused = false;
    this.pauseEl?.remove();
    this.pauseEl = null;
    this.pauseMenu = null;
  }

  private buildPause(): void {
    const app = this.app;
    this.pauseEl?.remove();
    const wrap = el('div', 'pause');
    const box = el('div', 'box panel');
    wrap.appendChild(box);
    if (this.pauseSub === 'moves') {
      const f = this.match.fighters[this.movesSlot];
      box.style.maxHeight = '86vh';
      box.style.overflow = 'auto';
      box.style.width = 'min(1000px, 92vw)';
      box.innerHTML = moveListHTML(app, f.def, this.movesSlot) + `<div class="hint" style="position:static;margin-top:14px">◀ ▶ Switch fighter ${app.mg('back')} Back</div>`;
      this.pauseMenu = null;
    } else {
      box.innerHTML = '<h2 class="display">Paused</h2>';
      const t = this.match.config.training;
      const items: MenuItem[] = [
        { label: 'Resume', onSelect: () => this.closePause() },
        { label: 'Move List', onSelect: () => { this.pauseSub = 'moves'; this.movesSlot = 0; this.buildPause(); } },
      ];
      if (t) {
        items.push(
          { label: 'Dummy', value: () => t.dummy.toUpperCase(), onLeft: () => { t.dummy = DUMMY_MODES[(DUMMY_MODES.indexOf(t.dummy) + DUMMY_MODES.length - 1) % DUMMY_MODES.length]; }, onRight: () => { t.dummy = DUMMY_MODES[(DUMMY_MODES.indexOf(t.dummy) + 1) % DUMMY_MODES.length]; } },
          { label: 'Infinite Meter', value: () => (t.infiniteMeter ? 'On' : 'Off'), onLeft: () => { t.infiniteMeter = !t.infiniteMeter; }, onRight: () => { t.infiniteMeter = !t.infiniteMeter; } },
          { label: 'Show Hitboxes', value: () => (app.renderer.showHitboxes ? 'On' : 'Off'), onLeft: () => { app.renderer.showHitboxes = !app.renderer.showHitboxes; }, onRight: () => { app.renderer.showHitboxes = !app.renderer.showHitboxes; } },
          { label: 'Reset Positions', onSelect: () => { this.match.resetPositions(); this.closePause(); } },
        );
      }
      items.push(
        { label: 'Restart Match', onSelect: () => app.go(new FightScreen(app, this.setup)) },
        { label: 'Character Select', onSelect: () => app.go(new CharSelectScreen(app, this.setup.mode)) },
        { label: 'Main Menu', onSelect: () => app.go(new MainMenuScreen(app)) },
      );
      this.pauseMenu = new MenuList(items, app.audio);
      box.appendChild(this.pauseMenu.el);
    }
    this.pauseEl = wrap;
    app.ui.appendChild(wrap);
  }

  private tickPause(): void {
    const ms = this.app.input.menu('any');
    if (this.pauseSub === 'moves') {
      if (ms.back || ms.start) {
        this.pauseSub = 'menu';
        this.app.audio.sfx('menuBack');
        this.buildPause();
      } else if (ms.left || ms.right || ms.l1 || ms.r1) {
        this.movesSlot = this.movesSlot === 0 ? 1 : 0;
        this.app.audio.sfx('menuMove');
        this.buildPause();
      }
      return;
    }
    if (ms.back || ms.start) {
      this.closePause();
      return;
    }
    this.pauseMenu?.handle(ms);
  }

  // ---------------------------------------------------------------- loop

  tick(): void {
    if (this.paused) {
      this.tickPause();
      return;
    }
    const m = this.match;
    const app = this.app;
    const humans = this.humanSlots();
    const inputs: [PlayerInput, PlayerInput] = [NO_INPUT, NO_INPUT];
    for (const slot of [0, 1] as const) {
      if (this.cpu[slot]) inputs[slot] = this.cpu[slot]!.next(m.fighters[slot], m);
      else if (this.training && slot === 1) inputs[1] = dummyInput(m.config.training!.dummy, m.fighters[1], m, this.dummyCpu);
      else inputs[slot] = app.input.player(slot);
    }
    // In watch mode anyone can pause.
    const pauseSlots: (0 | 1)[] = humans.length ? humans : [0, 1];
    for (const slot of pauseSlots) {
      const raw = this.cpu[slot] ? app.input.player(slot) : inputs[slot];
      if (raw.pressed & BTN.START && m.phase !== 'matchEnd') {
        this.openPause();
        return;
      }
    }
    if (this.training && inputs[0].pressed & BTN.SELECT) m.resetPositions();
    if (m.phase === 'intro') {
      const any = app.input.menu('any');
      if (any.confirm) m.skipIntro();
      this.hud.showQuote(0, m.fighters[0].def.quotes.intro, m.phaseFrame > 10 && m.phaseFrame < 100);
      this.hud.showQuote(1, m.fighters[1].def.quotes.intro, m.phaseFrame >= 100 && m.phaseFrame < 195);
    } else {
      this.hud.showQuote(0, '', false);
      this.hud.showQuote(1, '', false);
    }
    this.inputs = inputs;
    m.tick(inputs);
    for (const ev of m.drainEvents()) this.onEvent(ev);

    if (m.phase === 'matchEnd') {
      this.endTimer++;
      const w = m.matchWinner;
      if (this.endTimer === 60 && w !== null && w >= 0) this.hud.showQuote(w, m.fighters[w].def.quotes.win, true);
      const skip = this.endTimer > 90 && app.input.menu('any').confirm;
      if ((this.endTimer >= 260 || skip) && !this.finished) {
        this.finished = true;
        this.finish(w);
      }
    }
  }

  private onEvent(ev: GameEvent): void {
    const app = this.app;
    const m = this.match;
    app.renderer.handleEvent(ev, m);
    this.hud.event(ev, m);
    const a = app.audio;
    switch (ev.t) {
      case 'hit':
        if (ev.blocked) a.sfx(ev.counter ? 'counter' : 'block');
        else a.sfx(ev.spark === 'super' ? 'hitSuper' : ev.spark === 'light' ? 'hitLight' : 'hitHeavy', 0.9 + Math.random() * 0.2);
        break;
      case 'whiff':
        a.sfx(ev.heavy ? 'whooshHeavy' : 'whoosh', 0.9 + Math.random() * 0.2);
        break;
      case 'special':
        a.sfx('special', 0.8 + (ev.color % 7) / 14);
        break;
      case 'projectile':
        a.sfx('projectile', 0.9 + Math.random() * 0.2);
        break;
      case 'superFlash':
        a.sfx('superFlash');
        break;
      case 'ko':
        a.sfx('ko');
        a.say(ev.perfect ? 'K.O. Perfect!' : 'K.O.');
        break;
      case 'announce': {
        const t = ev.text;
        if (t.startsWith('ROUND')) a.say(`Round ${NUM_WORDS[m.round] ?? m.round}`);
        else if (t === 'FINAL ROUND') a.say('Final round');
        else if (t === 'FIGHT!') a.say('Fight!');
        else if (t === 'TIME') a.say('Time!');
        else if (t.endsWith('WINS')) {
          const w = m.matchWinner !== null && m.matchWinner >= 0 ? m.fighters[m.matchWinner].def.name : '';
          a.say(`${w} wins!`);
        } else if (t === 'DRAW GAME') a.say('Draw game');
        if (t === 'FIGHT!' || t.startsWith('ROUND') || t === 'FINAL ROUND') a.sfx('round');
        break;
      }
      case 'jump':
        a.sfx('jump');
        break;
      case 'land':
        a.sfx(ev.hard ? 'landHard' : 'land');
        break;
      case 'tech':
        a.sfx('tech');
        break;
      case 'buff':
        a.sfx('buff');
        break;
      case 'teleport':
        a.sfx('teleport');
        break;
      case 'lifeline':
        a.sfx('lifeline');
        a.say(ev.name);
        break;
      case 'clash':
        a.sfx('clash');
        break;
      case 'wallsplat':
        a.sfx('landHard', 0.8);
        a.sfx('crowd');
        break;
      case 'techroll':
        a.sfx('whoosh', 0.8);
        break;
      case 'rage':
        a.sfx('buff', 0.7);
        a.say('Rage!');
        break;
      case 'counterHit':
        a.sfx('counter');
        break;
      case 'sfx':
        a.sfx(ev.name === 'cinematic' ? 'superFlash' : ev.name);
        break;
      case 'rumble':
        if (!this.setup.cpu[ev.fighter]) app.input.rumble(ev.fighter as 0 | 1, ev.strong, ev.weak, ev.ms);
        break;
    }
  }

  private finish(winner: number | null): void {
    const app = this.app;
    if (this.setup.mode === 'arcade' && app.arcade) {
      const ar = app.arcade;
      if (winner === 0) {
        ar.index++;
        if (ar.index >= ar.ladder.length) app.go(new EndingScreen(app));
        else app.go(new ArcadeLadderScreen(app));
      } else {
        app.go(new ArcadeContinueScreen(app));
      }
      return;
    }
    app.go(new ResultsScreen(app, this.setup, winner ?? -1));
  }

  frame(dt: number): void {
    this.app.renderer.syncFight(this.match, this.paused ? 0 : dt);
    this.hud.update(this.match, this.inputs);
  }
}
