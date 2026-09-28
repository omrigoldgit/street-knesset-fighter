import { ACTIONS, ACTION_NAMES, KEYBOARD_P1, KEYBOARD_P2, keyLabel, type Action, type GlyphStyle } from '../../core/input';
import { ROSTER } from '../../data/roster';
import type { CharacterDef } from '../../game/characterTypes';
import { STYLE_INFO } from '../../game/normals';
import { specialDesc, ultimateDesc } from '../../game/specials';
import type { App, Screen } from '../app';
import { MenuList, MOTION, el, esc, partyChip, portraitHTML, readable } from '../dom';

const SLOT_INPUT = [
  { motion: MOTION.qcf, btn: 'P', dir: '' },
  { motion: MOTION.qcb, btn: 'K', dir: '→ +' },
  { motion: MOTION.dp, btn: 'P', dir: '↓ +' },
];

function pk(app: App, which: 'P' | 'K', slot: 0 | 1, style: GlyphStyle): string {
  return which === 'P'
    ? `${app.glyph('LP', slot, style)}/${app.glyph('HP', slot, style)}`
    : `${app.glyph('LK', slot, style)}/${app.glyph('HK', slot, style)}`;
}

export function moveListHTML(app: App, def: CharacterDef, slot: 0 | 1 = 0): string {
  const style = app.glyphStyle(slot) === 'kb' && app.menuStyle() !== 'kb' ? app.menuStyle() : app.glyphStyle(slot);
  const g = (a: Action) => app.glyph(a, slot, style);
  const rows: string[] = [];
  rows.push('<tr class="hdr"><td colspan="3">SPECIAL MOVES</td></tr>');
  def.specials.forEach((s, i) => {
    const si = SLOT_INPUT[i];
    rows.push(`<tr><td class="mv" style="color:${readable(s.color)}">${esc(s.name)}</td>
      <td class="in"><span class="arrow">${si.motion}</span> + ${pk(app, si.btn as 'P' | 'K', slot, style)}<br><span style="color:var(--muted)">or</span> ${si.dir} ${g('SP')}</td>
      <td class="ds">${esc(specialDesc(s))}${s.type === 'dive' ? ' Works in the air.' : ''}</td></tr>`);
  });
  rows.push('<tr class="hdr"><td colspan="3">ULTIMATE (FULL METER)</td></tr>');
  rows.push(`<tr><td class="mv" style="color:var(--gold)">${esc(def.ultimate.name)}</td>
    <td class="in"><span class="arrow">${MOTION.dqcf}</span> + ${pk(app, 'P', slot, style)}<br><span style="color:var(--muted)">or</span> ${g('UL')}</td>
    <td class="ds">${esc(ultimateDesc(def.ultimate))}</td></tr>`);
  rows.push('<tr class="hdr"><td colspan="3">PASSIVE ABILITY</td></tr>');
  rows.push(`<tr><td class="mv">${esc(def.passive.name)}</td><td class="in">Always on</td><td class="ds">${esc(def.passive.desc)}</td></tr>`);
  rows.push('<tr class="hdr"><td colspan="3">UNIVERSAL</td></tr>');
  const uni: [string, string, string][] = [
    ['Throw', `${g('TH')} <span style="color:var(--muted)">or</span> ${g('LP')}+${g('LK')}`, 'Close range. Hold ← to throw backwards. Tech by pressing throw as you are grabbed.'],
    ['Sidestep', g('SS'), 'Tekken-style step into the background (hold ↓ to step toward the camera). Dodges projectiles and most strikes.'],
    ['Overhead Chop', `→ + ${g('HP')}`, 'Slow, but must be blocked standing.'],
    ['Anti-air Uppercut', `↓ + ${g('HP')}`, 'Launches airborne opponents.'],
    ['Sweep', `↓ + ${g('HK')}`, 'Low. Knocks down.'],
    ['Dash', '→ → / ← ←', 'Quick burst of movement.'],
    ['Block', 'Hold ← (↙ for lows)', 'Block high/mid standing, lows crouching. Jump-ins and overheads must be blocked standing.'],
    ['Chains & cancels', `${g('LP')} → ${g('HP')} → Special → ${g('UL')}`, 'Light attacks chain into heavies. Normals cancel into specials; specials that hit cancel into the Ultimate.'],
  ];
  for (const [n, i, d] of uni) rows.push(`<tr><td class="mv">${n}</td><td class="in">${i}</td><td class="ds">${d}</td></tr>`);
  return `<div class="ml-head">${portraitHTML(def)}<div><div class="display" style="font-size:40px;line-height:1">${esc(def.name)}</div>
    <div style="font-size:20px"><span class="he">${esc(def.nameHe)}</span></div>${partyChip(def)}
    <div style="color:var(--muted);margin-top:4px">${esc(def.role)} · ${esc(STYLE_INFO[def.style])}</div>
    <div style="margin-top:6px;max-width:720px">${esc(def.bio)}</div></div></div>
    <table class="ml-table">${rows.join('')}</table>`;
}

export class MoveListScreen implements Screen {
  private page!: HTMLElement;
  constructor(private app: App, private index: number, private back: () => void) {}

  enter(): void {
    this.page = el('div', 'page');
    this.app.ui.append(this.page, el('div', 'hint', `◀ ▶ Change fighter (${this.index + 1}/40) ${this.app.mg('back')} Back`));
    this.render();
  }

  private render(): void {
    this.page.innerHTML = moveListHTML(this.app, ROSTER[this.index], 0);
    const hint = this.app.ui.querySelector('.hint');
    if (hint) hint.innerHTML = `◀ ▶ Change fighter (${this.index + 1}/40) ${this.app.mg('back')} Back`;
  }

  exit(): void {}

  tick(): void {
    const ms = this.app.input.menu('any');
    if (ms.back) {
      this.app.audio.sfx('menuBack');
      this.back();
    } else if (ms.left || ms.l1) {
      this.index = (this.index + ROSTER.length - 1) % ROSTER.length;
      this.app.audio.sfx('menuMove');
      this.render();
    } else if (ms.right || ms.r1) {
      this.index = (this.index + 1) % ROSTER.length;
      this.app.audio.sfx('menuMove');
      this.render();
    } else if (ms.down) {
      this.page.scrollTop += 80;
    } else if (ms.up) {
      this.page.scrollTop -= 80;
    }
  }

  frame(dt: number): void {
    this.app.renderer.syncShowcase(dt, { pos: [2, 1.5, 6], look: [0, 1.1, 0] });
  }
}

const PAD_LABELS: { a: Action | 'MOVE'; x: number; y: number; ps: string; cls: string }[] = [
  { a: 'TH', x: 16, y: 5, ps: 'L2', cls: 'g-shoulder' },
  { a: 'SS', x: 16, y: 15, ps: 'L1', cls: 'g-shoulder' },
  { a: 'UL', x: 84, y: 5, ps: 'R2', cls: 'g-shoulder' },
  { a: 'SP', x: 84, y: 15, ps: 'R1', cls: 'g-shoulder' },
  { a: 'MOVE', x: 20, y: 44, ps: '✚', cls: 'g-shoulder' },
  { a: 'HP', x: 80, y: 30, ps: '△', cls: 'g-triangle' },
  { a: 'HK', x: 92, y: 45, ps: '○', cls: 'g-circle' },
  { a: 'LK', x: 80, y: 60, ps: '✕', cls: 'g-cross' },
  { a: 'LP', x: 67, y: 45, ps: '□', cls: 'g-square' },
  { a: 'SELECT', x: 34, y: 27, ps: 'CREATE', cls: 'g-shoulder' },
  { a: 'START', x: 66, y: 27, ps: 'OPTIONS', cls: 'g-shoulder' },
];

export class ControlsScreen implements Screen {
  private menu!: MenuList;
  private status!: HTMLElement;
  private remap: { slot: 0 | 1; step: number; binding: Record<Action, number> } | null = null;
  private readonly remapOrder: Action[] = ['LP', 'HP', 'LK', 'HK', 'SP', 'UL', 'TH', 'SS'];

  constructor(private app: App, private back: () => void) {}

  enter(): void {
    const app = this.app;
    const page = el('div', 'page');
    const padLabels = PAD_LABELS.map((l) => `<div class="pad-lbl" style="left:${l.x}%;top:${l.y}%"><span class="g ${l.cls}">${l.ps}</span>${l.a === 'MOVE' ? 'Move' : ACTION_NAMES[l.a as Action]}</div>`).join('');
    const kbRows = (map: typeof KEYBOARD_P1) =>
      `<span class="g g-key">${keyLabel(map.UP[0])}${keyLabel(map.LEFT[0])}${keyLabel(map.DOWN[0])}${keyLabel(map.RIGHT[0])}</span><span>Move</span>` +
      ACTIONS.map((a) => `<span>${map[a].map((k) => `<span class="g g-key">${keyLabel(k)}</span>`).join(' ')}</span><span>${ACTION_NAMES[a]}</span>`).join('');
    page.innerHTML = `<h1 class="display">Controls</h1>
      <div class="sub">Plug in a PS5 DualSense (USB or Bluetooth) and press any button. Chrome, Edge and the desktop app read it natively.</div>
      <div class="ctrl-grid">
        <div class="panel"><h3>PS5 DualSense</h3><div class="pad-diagram"><div class="pad-body"></div>${padLabels}<div class="pad-lbl" style="left:36%;top:70%">Left stick: Move</div></div>
          <div class="status"></div></div>
        <div class="panel"><h3>Controller setup</h3><div id="menu-slot"></div></div>
        <div class="panel"><h3>Keyboard · Player 1</h3><div class="kv">${kbRows(KEYBOARD_P1)}</div></div>
        <div class="panel"><h3>Keyboard · Player 2</h3><div class="kv">${kbRows(KEYBOARD_P2)}</div></div>
      </div>`;
    this.status = page.querySelector('.status') as HTMLElement;
    this.menu = new MenuList([
      { label: 'Swap P1 / P2 controllers', onSelect: () => { app.input.swapSlots(); this.refresh(); } },
      { label: 'Remap P1 buttons', onSelect: () => this.startRemap(0) },
      { label: 'Remap P2 buttons', onSelect: () => this.startRemap(1) },
      { label: 'Reset P1 mapping', onSelect: () => { const i = app.input.slotPad[0]; if (i !== null) app.input.resetBinding(i); this.refresh(); } },
      { label: 'Reset P2 mapping', onSelect: () => { const i = app.input.slotPad[1]; if (i !== null) app.input.resetBinding(i); this.refresh(); } },
      { label: 'Test rumble', onSelect: () => { app.input.rumble(0, 1, 1, 400); app.input.rumble(1, 1, 1, 400); } },
      { label: 'Back', onSelect: () => this.back() },
    ], app.audio);
    (page.querySelector('#menu-slot') as HTMLElement).appendChild(this.menu.el);
    app.ui.append(page, el('div', 'hint', `${app.mg('confirm')} Select ${app.mg('back')} Back`));
    app.input.onChange = () => this.refresh();
    this.refresh();
  }

  private refresh(): void {
    const inp = this.app.input;
    const pads = inp.connectedPads();
    const slotLine = (slot: 0 | 1) => {
      const info = inp.padInfo(slot);
      if (!info) return `<div class="status-line">P${slot + 1}: <b>keyboard only</b></div>`;
      const b = inp.bindingFor(info.index);
      const map = this.remapOrder.map((a) => `${a}=${b[a]}`).join(' ');
      return `<div class="status-line">P${slot + 1}: <b>${esc(info.kind === 'dualsense' ? 'DualSense' : info.kind === 'dualshock' ? 'DualShock 4' : info.kind === 'xbox' ? 'Xbox controller' : 'Gamepad')}</b> <span style="color:var(--muted);font-size:12px">#${info.index} · ${esc(map)}</span></div>`;
    };
    let html = `<div class="status-line">Controllers connected: <b>${pads.length}</b></div>${slotLine(0)}${slotLine(1)}`;
    if (pads.some((p) => !p.standard)) html += `<div class="status-line" style="color:#ffb3aa">A controller is in raw mode (non-Chrome browser). If buttons feel wrong, use Remap or play in Chrome / Edge / the desktop app.</div>`;
    if (this.remap) {
      const a = this.remapOrder[this.remap.step];
      html += `<div class="status-line" style="font-size:20px;margin-top:10px">Press the button for <b>${ACTION_NAMES[a]}</b> on P${this.remap.slot + 1}'s controller… <span style="color:var(--muted);font-size:13px">(Esc to cancel)</span></div>`;
    }
    this.status.innerHTML = html;
  }

  private startRemap(slot: 0 | 1): void {
    const idx = this.app.input.slotPad[slot];
    if (idx === null) {
      this.status.insertAdjacentHTML('beforeend', `<div class="status-line" style="color:#ffb3aa">No controller assigned to P${slot + 1}.</div>`);
      return;
    }
    this.remap = { slot, step: 0, binding: { ...this.app.input.bindingFor(idx) } };
    this.refresh();
    this.captureNext();
  }

  private captureNext(): void {
    this.app.input.captureNextButton((index, button) => {
      const r = this.remap;
      if (!r) return;
      if (index !== this.app.input.slotPad[r.slot]) {
        this.captureNext();
        return;
      }
      r.binding[this.remapOrder[r.step]] = button;
      r.step++;
      this.app.audio.sfx('menuConfirm');
      if (r.step >= this.remapOrder.length) {
        this.app.input.setBinding(index, r.binding);
        this.remap = null;
        this.suppress = 20;
      } else {
        this.captureNext();
      }
      this.refresh();
    });
  }

  private suppress = 0;

  exit(): void {
    this.app.input.captureNextButton(null);
    this.app.input.onChange = null;
  }

  tick(): void {
    if (this.remap) {
      if (this.app.input.keyPressed('Escape')) {
        this.remap = null;
        this.app.input.captureNextButton(null);
        this.refresh();
      }
      return;
    }
    if (this.suppress > 0) {
      this.suppress--;
      return;
    }
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
