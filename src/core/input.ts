// Keyboard + gamepad input. PS5 DualSense controllers are read through the browser Gamepad API
// ("standard" mapping in Chrome/Edge/Electron; a raw DirectInput fallback covers other browsers).

import { BTN, type PlayerInput } from '../game/types';

export type Action = 'LP' | 'HP' | 'LK' | 'HK' | 'SP' | 'UL' | 'SS' | 'TH' | 'START' | 'SELECT';
export const ACTIONS: Action[] = ['LP', 'HP', 'LK', 'HK', 'SP', 'UL', 'TH', 'SS', 'START', 'SELECT'];
export const ACTION_NAMES: Record<Action, string> = {
  LP: 'Light Punch', HP: 'Heavy Punch', LK: 'Light Kick', HK: 'Heavy Kick',
  SP: 'Special', UL: 'Heat Smash', SS: 'Sidestep', TH: 'Throw', START: 'Pause', SELECT: 'Reset (training)',
};

export type PadBinding = Record<Action, number>;

/** Standard mapping: 0 Cross, 1 Circle, 2 Square, 3 Triangle, 4 L1, 5 R1, 6 L2, 7 R2, 8 Create, 9 Options. */
export const DEFAULT_PAD: PadBinding = { LP: 2, HP: 3, LK: 0, HK: 1, SP: 5, UL: 7, SS: 4, TH: 6, START: 9, SELECT: 8 };
/** Raw DirectInput DualSense/DualShock: 0 Square, 1 Cross, 2 Circle, 3 Triangle. */
export const SONY_RAW_PAD: PadBinding = { LP: 0, HP: 3, LK: 1, HK: 2, SP: 5, UL: 7, SS: 4, TH: 6, START: 9, SELECT: 8 };

type KeyMap = Record<Action | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT', string[]>;

export const KEYBOARD_P1: KeyMap = {
  UP: ['KeyW'], DOWN: ['KeyS'], LEFT: ['KeyA'], RIGHT: ['KeyD'],
  LP: ['KeyU'], HP: ['KeyI'], LK: ['KeyJ'], HK: ['KeyK'],
  SP: ['KeyO'], UL: ['KeyL'], TH: ['KeyH'], SS: ['Space'],
  START: ['Escape', 'Enter'], SELECT: ['Backspace'],
};

export const KEYBOARD_P2: KeyMap = {
  UP: ['ArrowUp'], DOWN: ['ArrowDown'], LEFT: ['ArrowLeft'], RIGHT: ['ArrowRight'],
  LP: ['Numpad4', 'Insert'], HP: ['Numpad5', 'Home'], LK: ['Numpad1', 'Delete'], HK: ['Numpad2', 'End'],
  SP: ['Numpad6', 'PageUp'], UL: ['Numpad3', 'PageDown'], TH: ['Numpad0'], SS: ['NumpadDecimal', 'ShiftRight'],
  START: ['NumpadEnter'], SELECT: ['NumpadSubtract'],
};

export interface MenuState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  confirm: boolean;
  back: boolean;
  extra: boolean;
  extra2: boolean;
  start: boolean;
  l1: boolean;
  r1: boolean;
  any: boolean;
}

const EMPTY_MENU: MenuState = { up: false, down: false, left: false, right: false, confirm: false, back: false, extra: false, extra2: false, start: false, l1: false, r1: false, any: false };

interface PadState {
  index: number;
  id: string;
  kind: 'dualsense' | 'dualshock' | 'xbox' | 'generic';
  standard: boolean;
  buttons: boolean[];
  prevButtons: boolean[];
  dir: number;
  prevDir: number;
  repeat: number;
  menuDir: number;
}

interface KbState {
  dir: number;
  prevDir: number;
  repeat: number;
  menuDir: number;
}

const ACTION_BTN: Record<Action, number> = {
  LP: BTN.LP, HP: BTN.HP, LK: BTN.LK, HK: BTN.HK, SP: BTN.SP, UL: BTN.UL, SS: BTN.SS, TH: BTN.TH, START: BTN.START, SELECT: BTN.SELECT,
};

function dirFrom(x: number, y: number): number {
  // x: -1 left, 1 right. y: -1 up, 1 down.
  if (y < 0) return x < 0 ? 7 : x > 0 ? 9 : 8;
  if (y > 0) return x < 0 ? 1 : x > 0 ? 3 : 2;
  return x < 0 ? 4 : x > 0 ? 6 : 5;
}

function padKind(id: string): PadState['kind'] {
  const s = id.toLowerCase();
  if (s.includes('dualsense') || s.includes('0ce6') || s.includes('0df2')) return 'dualsense';
  if (s.includes('054c') || s.includes('dualshock') || s.includes('wireless controller') || s.includes('playstation')) return 'dualshock';
  if (s.includes('xbox') || s.includes('xinput') || s.includes('045e')) return 'xbox';
  return 'generic';
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, v: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
}

export class InputManager {
  private keys = new Set<string>();
  /** Keys pressed since the last poll (so quick taps between polls are never lost). */
  private tapped = new Set<string>();
  private prevKeys = new Set<string>();
  private pads = new Map<number, PadState>();
  /** Gamepad index assigned to each player slot. */
  slotPad: [number | null, number | null] = [null, null];
  private kb: [KbState, KbState] = [{ dir: 5, prevDir: 5, repeat: 0, menuDir: 5 }, { dir: 5, prevDir: 5, repeat: 0, menuDir: 5 }];
  private bindings: Record<string, PadBinding> = loadJSON('skf.bindings', {});
  rumbleEnabled = true;
  /** Whether each slot last used a gamepad (drives button glyphs). */
  lastDevice: ['kb' | 'pad', 'kb' | 'pad'] = ['kb', 'kb'];
  onChange: (() => void) | null = null;
  private captureCb: ((index: number, button: number) => void) | null = null;

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab' || e.code === 'Space' || e.code.startsWith('Arrow') || e.code === 'Backspace') e.preventDefault();
      this.keys.add(e.code);
      this.tapped.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.tapped.clear();
    });
    window.addEventListener('gamepadconnected', (e) => {
      this.refreshPads();
      this.autoAssign((e as GamepadEvent).gamepad.index);
      this.onChange?.();
    });
    window.addEventListener('gamepaddisconnected', (e) => {
      const idx = (e as GamepadEvent).gamepad.index;
      this.pads.delete(idx);
      this.slotPad = this.slotPad.map((s) => (s === idx ? null : s)) as [number | null, number | null];
      this.onChange?.();
    });
  }

  // ---------------------------------------------------------------- pads

  private refreshPads(): void {
    const list = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of list) {
      if (!gp || !gp.connected) continue;
      if (!this.pads.has(gp.index)) {
        this.pads.set(gp.index, {
          index: gp.index,
          id: gp.id,
          kind: padKind(gp.id),
          standard: gp.mapping === 'standard',
          buttons: [],
          prevButtons: [],
          dir: 5,
          prevDir: 5,
          repeat: 0,
          menuDir: 5,
        });
        this.autoAssign(gp.index);
        this.onChange?.();
      }
    }
  }

  private autoAssign(index: number): void {
    if (this.slotPad.includes(index)) return;
    if (this.slotPad[0] === null) {
      this.slotPad[0] = index;
      this.lastDevice[0] = 'pad';
    } else if (this.slotPad[1] === null) {
      this.slotPad[1] = index;
      this.lastDevice[1] = 'pad';
    }
  }

  swapSlots(): void {
    this.slotPad = [this.slotPad[1], this.slotPad[0]];
    this.onChange?.();
  }

  assignPad(slot: 0 | 1, index: number | null): void {
    const other = slot === 0 ? 1 : 0;
    if (index !== null && this.slotPad[other] === index) this.slotPad[other] = this.slotPad[slot];
    this.slotPad[slot] = index;
    this.onChange?.();
  }

  connectedPads(): { index: number; id: string; kind: PadState['kind']; standard: boolean }[] {
    return [...this.pads.values()].map((p) => ({ index: p.index, id: p.id, kind: p.kind, standard: p.standard }));
  }

  padInfo(slot: 0 | 1): { index: number; id: string; kind: PadState['kind'] } | null {
    const idx = this.slotPad[slot];
    if (idx === null) return null;
    const p = this.pads.get(idx);
    return p ? { index: p.index, id: p.id, kind: p.kind } : null;
  }

  bindingFor(index: number): PadBinding {
    const p = this.pads.get(index);
    if (!p) return DEFAULT_PAD;
    const saved = this.bindings[p.id];
    if (saved) return saved;
    return p.standard ? DEFAULT_PAD : p.kind === 'dualsense' || p.kind === 'dualshock' ? SONY_RAW_PAD : DEFAULT_PAD;
  }

  setBinding(index: number, b: PadBinding): void {
    const p = this.pads.get(index);
    if (!p) return;
    this.bindings[p.id] = b;
    saveJSON('skf.bindings', this.bindings);
  }

  resetBinding(index: number): void {
    const p = this.pads.get(index);
    if (!p) return;
    delete this.bindings[p.id];
    saveJSON('skf.bindings', this.bindings);
  }

  /** Next raw button press on any pad goes to the callback (for remapping). */
  captureNextButton(cb: ((index: number, button: number) => void) | null): void {
    this.captureCb = cb;
  }

  private readPadDir(gp: Gamepad, standard: boolean): number {
    let x = 0;
    let y = 0;
    const ax = gp.axes[0] ?? 0;
    const ay = gp.axes[1] ?? 0;
    if (ax < -0.45) x = -1;
    else if (ax > 0.45) x = 1;
    if (ay < -0.5) y = -1;
    else if (ay > 0.5) y = 1;
    if (standard) {
      const b = gp.buttons;
      if (b[12]?.pressed) y = -1;
      if (b[13]?.pressed) y = 1;
      if (b[14]?.pressed) x = -1;
      if (b[15]?.pressed) x = 1;
    } else if (gp.axes.length > 9) {
      // DirectInput hat switch on axis 9.
      const v = gp.axes[9];
      if (v >= -1.05 && v <= 1.05) {
        const i = Math.round((v + 1) * 3.5) % 8;
        const hx = [0, 1, 1, 1, 0, -1, -1, -1][i];
        const hy = [-1, -1, 0, 1, 1, 1, 0, -1][i];
        if (hx) x = hx;
        if (hy) y = hy;
      }
    }
    return dirFrom(x, y);
  }

  // ---------------------------------------------------------------- polling

  /** Call once per 60 Hz tick. */
  poll(): void {
    this.prevKeys = new Set(this.keysSnapshot);
    this.keysSnapshot = new Set(this.keys);
    for (const k of this.tapped) {
      this.keysSnapshot.add(k);
      // A key tapped again before the previous tap was seen still counts as a fresh press.
      if (this.prevKeys.has(k) && !this.keys.has(k)) this.prevKeys.delete(k);
    }
    this.tapped.clear();
    for (let s = 0; s < 2; s++) {
      const map = s === 0 ? KEYBOARD_P1 : KEYBOARD_P2;
      const k = this.kb[s];
      k.prevDir = k.dir;
      const x = (this.anyKey(map.RIGHT) ? 1 : 0) - (this.anyKey(map.LEFT) ? 1 : 0);
      const y = (this.anyKey(map.DOWN) ? 1 : 0) - (this.anyKey(map.UP) ? 1 : 0);
      k.dir = dirFrom(x, y);
      k.menuDir = this.dirRepeat(k);
      if (this.keysSnapshot.size > this.prevKeys.size) {
        for (const code of this.keysSnapshot) {
          if (!this.prevKeys.has(code) && Object.values(map).some((arr) => arr.includes(code))) this.lastDevice[s] = 'kb';
        }
      }
    }

    this.refreshPads();
    const list = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of list) {
      if (!gp) continue;
      const p = this.pads.get(gp.index);
      if (!p) continue;
      p.prevButtons = p.buttons;
      p.buttons = gp.buttons.map((b) => b.pressed || b.value > 0.5);
      p.prevDir = p.dir;
      p.dir = this.readPadDir(gp, p.standard);
      p.menuDir = this.dirRepeat(p);
      const slot = this.slotPad.indexOf(gp.index);
      if (slot >= 0 && (p.buttons.some((b, i) => b && !p.prevButtons[i]) || (p.dir !== 5 && p.prevDir === 5))) this.lastDevice[slot] = 'pad';
      if (this.captureCb) {
        for (let i = 0; i < p.buttons.length; i++) {
          if (p.buttons[i] && !p.prevButtons[i]) {
            const cb = this.captureCb;
            this.captureCb = null;
            cb(gp.index, i);
            break;
          }
        }
      }
    }
  }

  private keysSnapshot = new Set<string>();

  private anyKey(codes: string[]): boolean {
    return codes.some((c) => this.keysSnapshot.has(c));
  }

  private anyKeyPressed(codes: string[]): boolean {
    return codes.some((c) => this.keysSnapshot.has(c) && !this.prevKeys.has(c));
  }

  keyPressed(code: string): boolean {
    return this.keysSnapshot.has(code) && !this.prevKeys.has(code);
  }

  // ---------------------------------------------------------------- game input

  player(slot: 0 | 1): PlayerInput {
    const map = slot === 0 ? KEYBOARD_P1 : KEYBOARD_P2;
    let held = 0;
    let pressed = 0;
    for (const a of ACTIONS) {
      if (this.anyKey(map[a])) held |= ACTION_BTN[a];
      if (this.anyKeyPressed(map[a])) pressed |= ACTION_BTN[a];
    }
    let dir = this.kb[slot].dir;
    const idx = this.slotPad[slot];
    if (idx !== null) {
      const p = this.pads.get(idx);
      if (p) {
        const b = this.bindingFor(idx);
        for (const a of ACTIONS) {
          const bi = b[a];
          if (p.buttons[bi]) held |= ACTION_BTN[a];
          if (p.buttons[bi] && !p.prevButtons[bi]) pressed |= ACTION_BTN[a];
        }
        if (p.dir !== 5) dir = p.dir;
      }
    }
    return { dir, held, pressed };
  }

  // ---------------------------------------------------------------- menus

  private dirRepeat(state: { dir: number; prevDir: number; repeat: number }): number {
    if (state.dir === 5) {
      state.repeat = 0;
      return 5;
    }
    if (state.dir !== state.prevDir) {
      state.repeat = 0;
      return state.dir;
    }
    state.repeat++;
    if (state.repeat > 22 && state.repeat % 5 === 0) return state.dir;
    return 5;
  }

  /** Menu input for a slot (keyboard layout of that slot + its gamepad). 'any' merges everything. */
  menu(slot: 0 | 1 | 'any'): MenuState {
    const out: MenuState = { ...EMPTY_MENU };
    const slots: (0 | 1)[] = slot === 'any' ? [0, 1] : [slot];
    const applyDir = (d: number) => {
      if (d === 5) return;
      if (d === 8 || d === 7 || d === 9) out.up = true;
      if (d === 2 || d === 1 || d === 3) out.down = true;
      if (d === 4 || d === 7 || d === 1) out.left = true;
      if (d === 6 || d === 9 || d === 3) out.right = true;
    };
    for (const s of slots) {
      const map = s === 0 ? KEYBOARD_P1 : KEYBOARD_P2;
      applyDir(this.kb[s].menuDir);
      const kp = (codes: string[]) => this.anyKeyPressed(codes);
      if (kp(map.LK) || kp(map.LP) || (s === 0 && (this.keyPressed('Enter') || this.keyPressed('Space')))) out.confirm = true;
      if (s === 1 && (this.keyPressed('NumpadEnter') || this.keyPressed('Numpad1'))) out.confirm = true;
      if (kp(map.HK) || (s === 0 && (this.keyPressed('Escape') || this.keyPressed('Backspace')))) out.back = true;
      if (kp(map.HP)) out.extra = true;
      if (kp(map.SP)) out.extra2 = true;
      if (kp(map.START)) out.start = true;
      if (kp(map.TH)) out.l1 = true;
      if (kp(map.UL)) out.r1 = true;
    }
    if (slot === 'any' && this.keyPressed('Enter')) out.confirm = true;
    const padIdxs = slot === 'any' ? [...this.pads.keys()] : this.slotPad[slot] !== null ? [this.slotPad[slot]!] : [];
    for (const idx of padIdxs) {
      const p = this.pads.get(idx);
      if (!p) continue;
      applyDir(p.menuDir);
      const pr = (i: number) => !!p.buttons[i] && !p.prevButtons[i];
      if (p.standard) {
        if (pr(0)) out.confirm = true;
        if (pr(1)) out.back = true;
        if (pr(3)) out.extra = true;
        if (pr(2)) out.extra2 = true;
        if (pr(9)) out.start = true;
        if (pr(4)) out.l1 = true;
        if (pr(5)) out.r1 = true;
      } else {
        const sony = p.kind === 'dualsense' || p.kind === 'dualshock';
        if (pr(sony ? 1 : 0)) out.confirm = true;
        if (pr(sony ? 2 : 1)) out.back = true;
        if (pr(3)) out.extra = true;
        if (pr(sony ? 0 : 2)) out.extra2 = true;
        if (pr(9)) out.start = true;
        if (pr(4)) out.l1 = true;
        if (pr(5)) out.r1 = true;
      }
    }
    out.any = out.confirm || out.start || out.back || out.up || out.down || out.left || out.right || out.extra || out.extra2;
    return out;
  }

  /** True if any key or pad button was pressed this tick. */
  anyPressed(): boolean {
    for (const c of this.keysSnapshot) if (!this.prevKeys.has(c)) return true;
    for (const p of this.pads.values()) if (p.buttons.some((b, i) => b && !p.prevButtons[i])) return true;
    return false;
  }

  // ---------------------------------------------------------------- rumble

  rumble(slot: 0 | 1, strong: number, weak: number, ms: number): void {
    if (!this.rumbleEnabled) return;
    const idx = this.slotPad[slot];
    if (idx === null) return;
    const gp = navigator.getGamepads?.()[idx];
    const act = (gp as unknown as { vibrationActuator?: { playEffect: (t: string, o: object) => Promise<unknown> } })?.vibrationActuator;
    if (!act) return;
    try {
      act.playEffect('dual-rumble', { startDelay: 0, duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) }).catch(() => undefined);
    } catch {
      /* not supported */
    }
  }
}

// ---------------------------------------------------------------- glyphs

export type GlyphStyle = 'ps' | 'xbox' | 'kb';

export const PS_GLYPH: Record<Action, string> = {
  LP: '□', HP: '△', LK: '✕', HK: '○', SP: 'R1', UL: 'R2', SS: 'L1', TH: 'L2', START: 'OPTIONS', SELECT: 'CREATE',
};
export const XBOX_GLYPH: Record<Action, string> = {
  LP: 'X', HP: 'Y', LK: 'A', HK: 'B', SP: 'RB', UL: 'RT', SS: 'LB', TH: 'LT', START: 'MENU', SELECT: 'VIEW',
};

export function keyLabel(code: string): string {
  return code.replace('Key', '').replace('Numpad', 'Num ').replace('Arrow', '').replace('Space', 'Space');
}

export function glyphFor(action: Action, style: GlyphStyle, slot: 0 | 1 = 0): string {
  if (style === 'ps') return PS_GLYPH[action];
  if (style === 'xbox') return XBOX_GLYPH[action];
  const map = slot === 0 ? KEYBOARD_P1 : KEYBOARD_P2;
  return keyLabel(map[action][0]);
}

export function glyphClass(action: Action, style: GlyphStyle): string {
  if (style !== 'ps') return 'g-key';
  switch (action) {
    case 'LP': return 'g-square';
    case 'HP': return 'g-triangle';
    case 'LK': return 'g-cross';
    case 'HK': return 'g-circle';
    default: return 'g-shoulder';
  }
}
