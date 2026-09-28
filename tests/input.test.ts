// Verifies PS5 DualSense button mapping through a fake Gamepad API.
import { beforeEach, describe, expect, it } from 'vitest';
import { BTN } from '../src/game/types';

type Listener = (e: unknown) => void;

interface FakePad {
  index: number;
  id: string;
  mapping: string;
  connected: boolean;
  buttons: { pressed: boolean; value: number }[];
  axes: number[];
}

let pads: FakePad[] = [];
const listeners: Record<string, Listener[]> = {};

function makePad(mapping: 'standard' | '', index = 0): FakePad {
  return {
    index,
    id: 'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)',
    mapping,
    connected: true,
    buttons: Array.from({ length: 18 }, () => ({ pressed: false, value: 0 })),
    axes: mapping === 'standard' ? [0, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 1.2857],
  };
}

function setButton(p: FakePad, i: number, down: boolean): void {
  p.buttons[i] = { pressed: down, value: down ? 1 : 0 };
}

beforeEach(() => {
  pads = [];
  for (const k of Object.keys(listeners)) delete listeners[k];
  const store = new Map<string, string>();
  (globalThis as Record<string, unknown>).window = {
    addEventListener: (t: string, fn: Listener) => {
      (listeners[t] ??= []).push(fn);
    },
  };
  Object.defineProperty(globalThis, 'navigator', { value: { getGamepads: () => pads }, configurable: true, writable: true });
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
  };
});

async function manager() {
  const { InputManager } = await import('../src/core/input');
  return new InputManager();
}

describe('DualSense (standard mapping, Chrome / Edge / Electron)', () => {
  it('maps face buttons, shoulders and d-pad to fighting actions', async () => {
    const pad = makePad('standard');
    pads = [pad];
    const im = await manager();
    im.poll();
    expect(im.slotPad[0]).toBe(0);

    setButton(pad, 2, true); // Square
    setButton(pad, 5, true); // R1
    setButton(pad, 15, true); // D-pad right
    im.poll();
    const inp = im.player(0);
    expect(inp.pressed & BTN.LP).toBeTruthy();
    expect(inp.pressed & BTN.SP).toBeTruthy();
    expect(inp.dir).toBe(6);

    im.poll();
    expect(im.player(0).pressed).toBe(0);
    expect(im.player(0).held & BTN.LP).toBeTruthy();

    setButton(pad, 2, false);
    setButton(pad, 5, false);
    setButton(pad, 15, false);
    setButton(pad, 3, true); // Triangle
    setButton(pad, 0, true); // Cross
    setButton(pad, 1, true); // Circle
    setButton(pad, 7, true); // R2
    setButton(pad, 6, true); // L2
    setButton(pad, 4, true); // L1
    im.poll();
    const p2 = im.player(0);
    for (const b of [BTN.HP, BTN.LK, BTN.HK, BTN.UL, BTN.TH, BTN.SS]) expect(p2.pressed & b).toBeTruthy();
  });

  it('reads the left stick as 8-way directions', async () => {
    const pad = makePad('standard');
    pads = [pad];
    const im = await manager();
    pad.axes = [-0.9, 0.9, 0, 0];
    im.poll();
    expect(im.player(0).dir).toBe(1);
    pad.axes = [0.8, -0.8, 0, 0];
    im.poll();
    expect(im.player(0).dir).toBe(9);
    pad.axes = [0.2, 0.1, 0, 0];
    im.poll();
    expect(im.player(0).dir).toBe(5);
  });

  it('uses Cross to confirm and Circle to go back in menus', async () => {
    const pad = makePad('standard');
    pads = [pad];
    const im = await manager();
    im.poll();
    setButton(pad, 0, true);
    im.poll();
    expect(im.menu('any').confirm).toBe(true);
    setButton(pad, 0, false);
    setButton(pad, 1, true);
    im.poll();
    expect(im.menu('any').back).toBe(true);
  });

  it('assigns a second controller to player 2', async () => {
    const a = makePad('standard', 0);
    const b = makePad('standard', 1);
    pads = [a, b];
    const im = await manager();
    im.poll();
    expect(im.slotPad).toEqual([0, 1]);
    setButton(b, 3, true);
    im.poll();
    expect(im.player(1).pressed & BTN.HP).toBeTruthy();
    expect(im.player(0).pressed).toBe(0);
    im.swapSlots();
    expect(im.slotPad).toEqual([1, 0]);
  });
});

describe('DualSense (raw DirectInput mapping, e.g. Firefox)', () => {
  it('maps the Sony raw layout and the hat-switch d-pad', async () => {
    const pad = makePad('');
    pads = [pad];
    const im = await manager();
    im.poll();
    setButton(pad, 0, true); // Square in raw layout
    setButton(pad, 1, true); // Cross in raw layout
    pad.axes[9] = -1; // hat up
    im.poll();
    const inp = im.player(0);
    expect(inp.pressed & BTN.LP).toBeTruthy();
    expect(inp.pressed & BTN.LK).toBeTruthy();
    expect(inp.dir).toBe(8);
    pad.axes[9] = 1.2857; // hat neutral
    im.poll();
    expect(im.player(0).dir).toBe(5);
  });
});

describe('custom remapping', () => {
  it('persists a per-controller binding', async () => {
    const pad = makePad('standard');
    pads = [pad];
    const im = await manager();
    im.poll();
    const b = { ...im.bindingFor(0), LP: 3, HP: 2 };
    im.setBinding(0, b);
    setButton(pad, 3, true);
    im.poll();
    expect(im.player(0).pressed & BTN.LP).toBeTruthy();
    const im2 = await manager();
    im2.poll();
    expect(im2.bindingFor(0).LP).toBe(3);
  });
});
