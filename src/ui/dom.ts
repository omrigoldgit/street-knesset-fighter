import type { AudioEngine } from '../core/audio';
import type { MenuState } from '../core/input';
import type { CharacterDef } from '../game/characterTypes';
import { PARTIES } from '../data/parties';
import { getPortrait } from '../render/portraits';

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

export function hex(c: number): string {
  return '#' + c.toString(16).padStart(6, '0');
}

/** Lightens dark colours so text stays legible on dark backgrounds. */
export function readable(c: number): string {
  let r = (c >> 16) & 255;
  let g = (c >> 8) & 255;
  let b = c & 255;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum < 140) {
    const k = (140 - lum) / (255 - lum + 1);
    r = Math.round(r + (255 - r) * k * 1.4);
    g = Math.round(g + (255 - g) * k * 1.4);
    b = Math.round(b + (255 - b) * k * 1.4);
  }
  const cl = (v: number) => Math.max(0, Math.min(255, v));
  return `rgb(${cl(r)},${cl(g)},${cl(b)})`;
}

export function portraitHTML(def: CharacterDef, cls = ''): string {
  const src = getPortrait(def.id);
  if (src) return `<img class="${cls}" src="${src}" alt="${esc(def.name)}" draggable="false">`;
  const initials = def.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return `<div class="${cls} init" style="background:${hex(PARTIES[def.party].color)}">${esc(initials)}</div>`;
}

export function partyChip(def: CharacterDef): string {
  const p = PARTIES[def.party];
  return `<span class="chip" style="background:${hex(p.color)};color:#fff">${esc(p.name)} · <span class="he">${esc(p.nameHe)}</span></span>`;
}

export interface MenuItem {
  label: string;
  desc?: string;
  value?: () => string;
  onSelect?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  disabled?: boolean;
}

export class MenuList {
  el: HTMLElement;
  index = 0;
  private descEl: HTMLElement | null = null;
  private itemEls: HTMLElement[] = [];

  constructor(public items: MenuItem[], private audio: AudioEngine, opts: { desc?: boolean } = {}) {
    this.el = el('div', 'menu');
    if (opts.desc) this.descEl = el('div', 'desc');
    this.build();
  }

  setItems(items: MenuItem[]): void {
    this.items = items;
    this.index = Math.min(this.index, items.length - 1);
    this.build();
  }

  private build(): void {
    this.el.innerHTML = '';
    this.itemEls = this.items.map((it, i) => {
      const e = el('div', 'item');
      e.addEventListener('mouseenter', () => {
        if (this.index !== i) {
          this.index = i;
          this.render();
        }
      });
      e.addEventListener('click', () => {
        this.index = i;
        this.activate();
      });
      this.el.appendChild(e);
      return e;
    });
    if (this.descEl) this.el.appendChild(this.descEl);
    this.render();
  }

  render(): void {
    this.items.forEach((it, i) => {
      const e = this.itemEls[i];
      const val = it.value ? `<span class="val">◀ ${esc(it.value())} ▶</span>` : '';
      e.innerHTML = `<span>${esc(it.label)}</span>${val}`;
      e.classList.toggle('sel', i === this.index);
      e.classList.toggle('disabled', !!it.disabled);
    });
    if (this.descEl) this.descEl.textContent = this.items[this.index]?.desc ?? '';
  }

  private activate(): void {
    const it = this.items[this.index];
    if (!it || it.disabled) return;
    if (it.onSelect) {
      this.audio.sfx('menuConfirm');
      it.onSelect();
    } else if (it.onRight) {
      this.audio.sfx('menuMove');
      it.onRight();
      this.render();
    }
  }

  handle(ms: MenuState): void {
    const n = this.items.length;
    if (ms.up) {
      this.index = (this.index - 1 + n) % n;
      this.audio.sfx('menuMove');
      this.render();
    } else if (ms.down) {
      this.index = (this.index + 1) % n;
      this.audio.sfx('menuMove');
      this.render();
    } else if (ms.left && this.items[this.index]?.onLeft) {
      this.items[this.index].onLeft!();
      this.audio.sfx('menuMove');
      this.render();
    } else if (ms.right && this.items[this.index]?.onRight) {
      this.items[this.index].onRight!();
      this.audio.sfx('menuMove');
      this.render();
    } else if (ms.confirm) {
      this.activate();
    }
  }
}

export const MOTION = {
  qcf: '↓↘→',
  qcb: '↓↙←',
  dp: '→↓↘',
  dqcf: '↓↘→↓↘→',
};
