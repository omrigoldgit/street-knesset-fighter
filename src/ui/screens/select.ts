import { ROSTER, bossVariant } from '../../data/roster';
import { PARTIES } from '../../data/parties';
import { STAGES, type StageDef } from '../../data/stages';
import type { CharacterDef } from '../../game/characterTypes';
import { computeStats } from '../../game/fighter';
import { STYLE_INFO } from '../../game/normals';
import type { App, FightSetup, Mode, Screen } from '../app';
import { MenuList, el, esc, hex, partyChip, portraitHTML } from '../dom';
import { FightScreen } from './fight';
import { MainMenuScreen } from './menus';
import { ArcadeLadderScreen } from './results';

const COLS = 10;

function statBars(def: CharacterDef): string {
  const s = computeStats(def);
  const vals: [string, number][] = [
    ['Power', (s.dmgMul - 0.85) / 0.4],
    ['Speed', (s.walk / 0.052 - 0.75) / 0.6],
    ['Health', (s.maxHealth / 1000 - 0.85) / 0.4],
    ['Defense', (1 / s.defMul - 0.8) / 0.45],
  ];
  return vals.map(([n, v]) => `<span>${n}</span><div class="bar"><i style="width:${Math.round(Math.max(0.08, Math.min(1, v)) * 100)}%"></i></div>`).join('');
}

function infoHTML(def: CharacterDef, who: string, locked: boolean, right: boolean): string {
  const stats = `<div class="stats">${right ? statBars(def).replace(/<span>(\w+)<\/span>(<div class="bar">.*?<\/div>)/g, '$2<span>$1</span>') : statBars(def)}</div>`;
  return `<div class="who">${esc(who)}</div>
    <div class="name display">${esc(def.name)}${def.nick ? ` <span style="color:var(--gold)">“${esc(def.nick)}”</span>` : ''}</div>
    <div class="he">${esc(def.nameHe)}</div>
    ${partyChip(def)}
    <div class="role">${esc(def.role)} · ${esc(STYLE_INFO[def.style])}</div>
    <div class="passive"><b>${esc(def.passive.name)}:</b> ${esc(def.passive.desc)}</div>
    ${stats}
    ${locked ? '<div class="locked">✔ LOCKED IN</div>' : ''}`;
}

export class CharSelectScreen implements Screen {
  private cursor: [number, number] = [0, 9];
  private locked: [boolean, boolean] = [false, false];
  /** For single-player picking of both slots (training / watch). */
  private pickingSlot: 0 | 1 = 0;
  private cells: HTMLElement[] = [];
  private info: HTMLElement[] = [];
  private shown: [string, string] = ['', ''];
  private t = 0;
  private leaveIn = -1;

  constructor(private app: App, private mode: Mode) {}

  private get dual(): boolean {
    return this.mode === 'versus';
  }

  private get needsP2(): boolean {
    return this.mode !== 'arcade';
  }

  enter(): void {
    const app = this.app;
    app.renderer.clearFighters();
    app.renderer.clearStage();
    app.renderer.setShowcase([], false);
    app.renderer.snapCamera([0, 1.35, 8.8], [0, 1.1, 0]);
    const last = app.lastSetup;
    if (last) {
      this.cursor[0] = Math.max(0, ROSTER.findIndex((c) => c.id === last.p1.id));
      if (this.needsP2) this.cursor[1] = Math.max(0, ROSTER.findIndex((c) => c.id === last.p2.id));
    }
    const title = { arcade: 'Arcade · Choose your candidate', versus: 'Versus · Choose your candidates', training: 'Training · Choose your fighter', watch: 'CPU vs CPU · Choose both fighters' }[this.mode];
    const w = el('div', 'screen');
    w.innerHTML = `<div class="cs-title display">${esc(title)}</div>`;
    const grid = el('div', 'cs-grid');
    this.cells = ROSTER.map((def, i) => {
      const c = el('div', 'cs-cell');
      c.innerHTML = `${portraitHTML(def)}<div class="nm">${esc(def.name.split(' ').slice(-1)[0])}</div>`;
      c.addEventListener('mouseenter', () => {
        const slot = this.dual ? 0 : this.pickingSlot;
        if (!this.locked[slot]) {
          this.cursor[slot] = i;
          this.refresh();
        }
      });
      c.addEventListener('click', () => {
        const slot = this.dual ? 0 : this.pickingSlot;
        this.cursor[slot] = i;
        this.lock(slot);
      });
      grid.appendChild(c);
      return c;
    });
    w.appendChild(grid);
    this.info[0] = el('div', 'cs-info left panel');
    this.info[1] = el('div', 'cs-info right panel');
    w.append(this.info[0]);
    if (this.needsP2) w.append(this.info[1]);
    const hint = el('div', 'hint', `${app.mg('confirm')} Select ${app.mg('back')} Back ${app.mg('extra')} Random`);
    w.appendChild(hint);
    app.ui.appendChild(w);
    this.refresh();
  }

  exit(): void {}

  private slotLabel(slot: 0 | 1): string {
    if (this.mode === 'watch') return slot === 0 ? 'CPU 1' : 'CPU 2';
    if (this.mode === 'training') return slot === 0 ? 'PLAYER 1' : 'DUMMY';
    if (this.mode === 'arcade') return 'PLAYER 1';
    return slot === 0 ? 'PLAYER 1' : 'PLAYER 2';
  }

  private refresh(): void {
    this.cells.forEach((c, i) => {
      const a = this.cursor[0] === i;
      const b = this.needsP2 && this.cursor[1] === i && (this.dual || this.pickingSlot === 1 || this.locked[1]);
      c.classList.toggle('p1', a);
      c.classList.toggle('p2', b);
      c.querySelectorAll('.tag').forEach((t) => t.remove());
      if (a) c.insertAdjacentHTML('beforeend', `<div class="tag t1">${this.mode === 'watch' ? 'C1' : '1P'}</div>`);
      if (b) c.insertAdjacentHTML('beforeend', `<div class="tag t2">${this.mode === 'training' ? 'DUM' : this.mode === 'watch' ? 'C2' : '2P'}</div>`);
    });
    for (const slot of [0, 1] as const) {
      if (slot === 1 && !this.needsP2) continue;
      const visible = slot === 0 || this.dual || this.pickingSlot === 1 || this.locked[1];
      this.info[slot].style.visibility = visible ? 'visible' : 'hidden';
      const def = ROSTER[this.cursor[slot]];
      this.info[slot].innerHTML = infoHTML(def, this.slotLabel(slot), this.locked[slot], slot === 1);
      const key = `${def.id}:${this.locked[slot]}:${visible}`;
      if (this.shown[slot] !== key) {
        this.shown[slot] = key;
        this.app.renderer.updateShowcaseSlot(slot, visible ? { def, x: slot === 0 ? -3.7 : 3.7, facing: slot === 0 ? 1 : -1, pose: this.locked[slot] ? 'victory' : 'guard', variant: slot } : null);
      }
    }
  }

  private lock(slot: 0 | 1): void {
    if (this.locked[slot]) return;
    this.locked[slot] = true;
    this.app.audio.sfx('select');
    if (!this.dual && slot === 0 && this.needsP2) {
      this.pickingSlot = 1;
      if (this.cursor[1] === this.cursor[0]) this.cursor[1] = (this.cursor[0] + 1) % ROSTER.length;
    }
    this.refresh();
    if (this.locked[0] && (!this.needsP2 || this.locked[1])) this.leaveIn = 40;
  }

  private move(slot: 0 | 1, dx: number, dy: number): void {
    const n = ROSTER.length;
    const rows = Math.ceil(n / COLS);
    let c = this.cursor[slot] % COLS;
    let r = Math.floor(this.cursor[slot] / COLS);
    c = (c + dx + COLS) % COLS;
    r = (r + dy + rows) % rows;
    this.cursor[slot] = Math.min(n - 1, r * COLS + c);
    this.app.audio.sfx('menuMove');
    this.refresh();
  }

  private handleSlot(slot: 0 | 1, ms: ReturnType<App['input']['menu']>): void {
    if (ms.back) {
      if (this.locked[slot]) {
        this.locked[slot] = false;
        this.leaveIn = -1;
        this.app.audio.sfx('menuBack');
        this.refresh();
        return;
      }
      if (!this.dual && slot === 1) {
        this.pickingSlot = 0;
        this.locked[0] = false;
        this.app.audio.sfx('menuBack');
        this.refresh();
        return;
      }
      this.app.audio.sfx('menuBack');
      this.app.go(new MainMenuScreen(this.app));
      return;
    }
    if (this.locked[slot]) return;
    if (ms.left) this.move(slot, -1, 0);
    else if (ms.right) this.move(slot, 1, 0);
    else if (ms.up) this.move(slot, 0, -1);
    else if (ms.down) this.move(slot, 0, 1);
    if (ms.extra) {
      this.cursor[slot] = Math.floor(Math.random() * ROSTER.length);
      this.lock(slot);
    } else if (ms.confirm) this.lock(slot);
  }

  tick(): void {
    if (this.leaveIn > 0) {
      if (--this.leaveIn === 0) this.finish();
      const ms0 = this.app.input.menu(this.dual ? 0 : 'any');
      if (ms0.back) this.handleSlot(this.dual ? 0 : this.pickingSlot, ms0);
      if (this.dual) {
        const ms1 = this.app.input.menu(1);
        if (ms1.back) this.handleSlot(1, ms1);
      }
      return;
    }
    if (this.dual) {
      this.handleSlot(0, this.app.input.menu(0));
      this.handleSlot(1, this.app.input.menu(1));
    } else {
      this.handleSlot(this.pickingSlot, this.app.input.menu('any'));
    }
  }

  private finish(): void {
    const app = this.app;
    const p1 = ROSTER[this.cursor[0]];
    if (this.mode === 'arcade') {
      const pool = ROSTER.filter((c) => c.id !== p1.id).sort(() => Math.random() - 0.5);
      const bossBase = p1.id === 'netanyahu' ? ROSTER.find((c) => c.id === 'lapid')! : ROSTER.find((c) => c.id === 'netanyahu')!;
      const ladder = pool.filter((c) => c.id !== bossBase.id).slice(0, 7);
      ladder.push(bossVariant(bossBase));
      const stages = ladder.map((_, i) => (i === ladder.length - 1 ? STAGES[0] : STAGES[Math.floor(Math.random() * STAGES.length)]));
      app.arcade = { player: p1, ladder, stages, index: 0, continues: 0 };
      app.go(new ArcadeLadderScreen(app));
      return;
    }
    const p2 = ROSTER[this.cursor[1]];
    app.go(new StageSelectScreen(app, this.mode, p1, p2));
  }

  frame(dt: number): void {
    this.t += dt;
    this.app.renderer.syncShowcase(dt, { pos: [0, 1.35, 8.8], look: [0, 1.1, 0] });
  }
}

export class StageSelectScreen implements Screen {
  private menu!: MenuList;
  private descEl!: HTMLElement;
  private t = 0;
  private current = -1;

  constructor(private app: App, private mode: Mode, private p1: CharacterDef, private p2: CharacterDef) {}

  enter(): void {
    const app = this.app;
    const items = [
      ...STAGES.map((s, i) => ({ label: s.name, onSelect: () => this.go(STAGES[i]) })),
      { label: 'Random', onSelect: () => this.go(STAGES[Math.floor(Math.random() * STAGES.length)]) },
    ];
    this.menu = new MenuList(items, app.audio);
    const w = el('div', 'screen');
    w.innerHTML = `<div class="cs-title display">Choose the arena</div>`;
    const list = el('div', 'ss-list');
    list.appendChild(this.menu.el);
    this.descEl = el('div', 'ss-desc panel');
    w.append(list, this.descEl, el('div', 'hint', `${app.mg('confirm')} Select ${app.mg('back')} Back`));
    app.ui.appendChild(w);
    const last = app.lastSetup?.stage;
    if (last) this.menu.index = Math.max(0, STAGES.findIndex((s) => s.id === last.id));
    this.menu.render();
    app.renderer.setShowcase([
      { def: this.p1, x: -1.6, facing: 1, pose: 'guard' },
      { def: this.p2, x: 1.6, facing: -1, pose: 'guard', variant: 1 },
    ], false);
    this.preview();
  }

  private preview(): void {
    const i = this.menu.index;
    if (i === this.current) return;
    this.current = i;
    const s = STAGES[i];
    if (s) {
      this.app.renderer.setStage(s);
      this.app.audio.playMusic(s.music, i + 1);
      this.descEl.innerHTML = `<div class="name display">${esc(s.name)}</div><div class="he" style="font-size:22px">${esc(s.nameHe)}</div><div style="color:var(--muted);margin-top:6px">${esc(s.desc)}</div>`;
    } else {
      this.descEl.innerHTML = `<div class="name display">Random</div><div style="color:var(--muted)">Let the coalition decide.</div>`;
    }
  }

  private go(stage: StageDef): void {
    const setup: FightSetup = {
      mode: this.mode,
      p1: this.p1,
      p2: this.p2,
      stage,
      cpu: this.mode === 'versus' ? [false, false] : this.mode === 'watch' ? [true, true] : [false, this.mode !== 'training'],
    };
    this.app.lastSetup = setup;
    this.app.go(new VsScreen(this.app, setup));
  }

  exit(): void {}

  tick(): void {
    const ms = this.app.input.menu('any');
    if (ms.back) {
      this.app.audio.sfx('menuBack');
      this.app.go(new CharSelectScreen(this.app, this.mode));
      return;
    }
    this.menu.handle(ms);
    this.preview();
  }

  frame(dt: number): void {
    this.t += dt;
    const a = this.t * 0.12;
    this.app.renderer.syncShowcase(dt, { pos: [Math.sin(a) * 8, 2.6, Math.cos(a) * 8 + 1], look: [0, 1.2, -1] });
  }
}

export class VsScreen implements Screen {
  private left = 200;
  private t = 0;

  constructor(private app: App, private setup: FightSetup, private onDone?: () => void) {}

  enter(): void {
    const app = this.app;
    const { p1, p2, stage } = this.setup;
    app.renderer.setStage(stage);
    app.renderer.setShowcase([
      { def: p1, x: -1.4, facing: 1, pose: 'intro' },
      { def: p2, x: 1.4, facing: -1, pose: 'intro' },
    ], false);
    app.audio.sfx('superFlash');
    app.audio.say(`${p1.name}. Versus. ${p2.name}.`);
    const c1 = hex(PARTIES[p1.party].color);
    const c2 = hex(PARTIES[p2.party].color);
    const w = el('div', 'vs');
    w.innerHTML = `<div class="band l" style="background:linear-gradient(90deg, ${c1}, transparent)"></div>
      <div class="band r" style="background:linear-gradient(270deg, ${c2}, transparent)"></div>
      <div class="stagename display">${esc(stage.name)} · <span class="he">${esc(stage.nameHe)}</span></div>
      <div class="side l">${portraitHTML(p1, 'portrait')}<div class="name display">${esc(p1.name)}</div><div class="he" style="font-size:22px">${esc(p1.nameHe)}</div><div class="quote">“${esc(p1.quotes.intro)}”</div></div>
      <div class="side r">${portraitHTML(p2, 'portrait')}<div class="name display">${esc(p2.boss ? 'BOSS · ' + p2.name : p2.name)}</div><div class="he" style="font-size:22px">${esc(p2.nameHe)}</div><div class="quote">“${esc(p2.quotes.intro)}”</div></div>
      <div class="big display">VS</div>`;
    app.ui.appendChild(w);
  }

  exit(): void {}

  tick(): void {
    this.left--;
    const ms = this.app.input.menu('any');
    if (this.left <= 0 || (this.left < 170 && (ms.confirm || ms.start))) {
      if (this.onDone) this.onDone();
      else this.app.go(new FightScreen(this.app, this.setup));
    }
  }

  frame(dt: number): void {
    this.t += dt;
    this.app.renderer.syncShowcase(dt, { pos: [Math.sin(this.t * 0.2) * 2, 1.4, 5.2 - this.t * 0.2], look: [0, 1.25, 0] });
  }
}
