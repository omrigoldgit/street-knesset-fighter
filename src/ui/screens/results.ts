import type { App, FightSetup, Screen } from '../app';
import { MenuList, el, esc, portraitHTML } from '../dom';
import { FightScreen } from './fight';
import { MainMenuScreen, menuBackdrop } from './menus';
import { CharSelectScreen, StageSelectScreen, VsScreen } from './select';

export class ResultsScreen implements Screen {
  private menu!: MenuList;
  private t = 0;

  constructor(private app: App, private setup: FightSetup, private winner: number) {}

  enter(): void {
    const app = this.app;
    const { p1, p2 } = this.setup;
    const w = this.winner === 0 ? p1 : this.winner === 1 ? p2 : null;
    if (w) app.renderer.setShowcase([{ def: w, x: 0, facing: 1, pose: 'victory', variant: 0 }], false);
    this.menu = new MenuList([
      { label: 'Rematch', onSelect: () => app.go(new VsScreen(app, this.setup)) },
      { label: 'Change Stage', onSelect: () => app.go(new StageSelectScreen(app, this.setup.mode, p1, p2)) },
      { label: 'Character Select', onSelect: () => app.go(new CharSelectScreen(app, this.setup.mode)) },
      { label: 'Main Menu', onSelect: () => app.go(new MainMenuScreen(app)) },
    ], app.audio);
    const wrap = el('div', 'results');
    const col = el('div', 'col');
    col.innerHTML = w
      ? `${portraitHTML(w)}<div class="winner display">${esc(w.name)} wins</div><div class="he" style="font-size:24px">${esc(w.nameHe)}</div><div class="quote">“${esc(w.quotes.win)}”</div>`
      : `<div class="winner display">Draw game</div><div class="quote">A hung parliament. Again.</div>`;
    col.appendChild(this.menu.el);
    wrap.appendChild(col);
    app.ui.append(wrap, el('div', 'hint', `${app.mg('confirm')} Select`));
  }

  exit(): void {}

  tick(): void {
    this.menu.handle(this.app.input.menu('any'));
  }

  frame(dt: number): void {
    this.t += dt;
    this.app.renderer.syncShowcase(dt, { pos: [1.6 + Math.sin(this.t * 0.3) * 0.5, 1.4, 4.2], look: [-0.6, 1.2, 0] });
  }
}

export class ArcadeLadderScreen implements Screen {
  private left = 170;
  constructor(private app: App) {}

  enter(): void {
    const app = this.app;
    const ar = app.arcade!;
    const opp = ar.ladder[ar.index];
    app.renderer.setStage(ar.stages[ar.index]);
    app.renderer.clearFighters();
    app.renderer.setShowcase([{ def: opp, x: 0, facing: -1, pose: 'intro' }], false);
    const rungs = ar.ladder.map((c, i) => `<div class="rung ${i < ar.index ? 'done' : ''} ${i === ar.index ? 'cur' : ''} ${c.boss ? 'boss' : ''}">${portraitHTML(c)}${esc(c.name.split(' ').slice(-1)[0])}</div>`).join('');
    const wrap = el('div', 'results');
    wrap.innerHTML = `<div class="col">
      <div class="display" style="font-size:28px;color:var(--muted)">Arcade · Stage ${ar.index + 1} / ${ar.ladder.length}</div>
      <div class="winner display">${opp.boss ? 'Final boss' : 'Next opponent'}</div>
      <div class="display" style="font-size:44px;color:var(--gold)">${esc(opp.name)}</div>
      <div class="he" style="font-size:22px">${esc(opp.nameHe)}</div>
      <div style="color:var(--muted)">${esc(opp.role)}</div>
      <div class="ladder">${rungs}</div>
    </div>`;
    app.ui.append(wrap, el('div', 'hint', `${app.mg('confirm')} Fight ${app.mg('back')} Quit`));
    app.audio.say(opp.boss ? `Final boss. ${opp.name}` : `Next: ${opp.name}`);
  }

  private start(): void {
    const app = this.app;
    const ar = app.arcade!;
    const setup: FightSetup = { mode: 'arcade', p1: ar.player, p2: ar.ladder[ar.index], stage: ar.stages[ar.index], cpu: [false, true] };
    app.lastSetup = setup;
    app.go(new VsScreen(app, setup, () => app.go(new FightScreen(app, setup))));
  }

  exit(): void {}

  tick(): void {
    const ms = this.app.input.menu('any');
    if (ms.back) {
      this.app.go(new MainMenuScreen(this.app));
      return;
    }
    if (--this.left <= 0 || ms.confirm) this.start();
  }

  frame(dt: number): void {
    this.app.renderer.syncShowcase(dt, { pos: [-1.8, 1.4, 4.4], look: [0.6, 1.2, 0] });
  }
}

export class ArcadeContinueScreen implements Screen {
  private left = 60 * 10;
  private el!: HTMLElement;
  constructor(private app: App) {}

  enter(): void {
    const app = this.app;
    const ar = app.arcade!;
    const opp = ar.ladder[ar.index];
    app.renderer.setShowcase([{ def: opp, x: 0, facing: -1, pose: 'victory', variant: 2 }], false);
    const wrap = el('div', 'results');
    wrap.innerHTML = `<div class="col"><div class="winner display">Continue?</div>
      <div class="quote">${esc(opp.name)}: “${esc(opp.quotes.win)}”</div>
      <div class="display" style="font-size:120px;color:var(--gold)" id="cd">10</div>
      <div>${app.mg('confirm')} Continue &nbsp; ${app.mg('back')} Give up</div></div>`;
    app.ui.appendChild(wrap);
    this.el = wrap.querySelector('#cd') as HTMLElement;
  }

  exit(): void {}

  tick(): void {
    const app = this.app;
    const ms = app.input.menu('any');
    this.left--;
    this.el.textContent = String(Math.ceil(this.left / 60));
    if (ms.confirm) {
      app.arcade!.continues++;
      app.go(new ArcadeLadderScreen(app));
    } else if (ms.back || this.left <= 0) {
      app.go(new MainMenuScreen(app));
    } else if (ms.extra || ms.extra2) {
      this.left = Math.max(1, this.left - 60);
    }
  }

  frame(dt: number): void {
    this.app.renderer.syncShowcase(dt, { pos: [-1.8, 1.4, 4.4], look: [0.6, 1.2, 0] });
  }
}

export class EndingScreen implements Screen {
  private t = 0;
  constructor(private app: App) {}

  enter(): void {
    const app = this.app;
    const ar = app.arcade!;
    const p = ar.player;
    app.renderer.setShowcase([{ def: p, x: 0, facing: 1, pose: 'victory', variant: 0 }], false);
    app.audio.say(`Congratulations, Prime Minister ${p.name}!`);
    const wrap = el('div', 'ending');
    wrap.innerHTML = `<h1 class="display">Coalition formed!</h1>
      <p>Against all odds, <b>${esc(p.name)}</b> has survived the plenum, outlasted ${ar.ladder.length} rivals and assembled a 61-seat majority${ar.continues ? ` (after ${ar.continues} emergency election${ar.continues > 1 ? 's' : ''})` : ''}.<br>
      The President has asked ${esc(p.name.split(' ')[0])} to form the next government. It will last at least… until the next arcade run.</p>
      <div class="defeated">${ar.ladder.map((c) => portraitHTML(c)).join('')}</div>
      <p style="color:var(--muted);font-size:14px">Iron Knesset · a parody. Thanks for playing!</p>
      <div>${app.mg('confirm')} Main Menu</div>`;
    app.ui.appendChild(wrap);
  }

  exit(): void {}

  tick(): void {
    const ms = this.app.input.menu('any');
    if (this.t > 1.5 && (ms.confirm || ms.start)) {
      this.app.arcade = null;
      menuBackdrop(this.app, true);
      this.app.go(new MainMenuScreen(this.app));
    }
  }

  frame(dt: number): void {
    this.t += dt;
    const a = this.t * 0.25;
    this.app.renderer.syncShowcase(dt, { pos: [Math.sin(a) * 4, 1.5, Math.cos(a) * 4], look: [0, 1.2, 0] });
  }
}
