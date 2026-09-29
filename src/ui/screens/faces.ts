import { headRect, type Crop } from '../../core/wiki';
import { ROSTER } from '../../data/roster';
import type { CharacterDef } from '../../game/characterTypes';
import {
  faceCredits, getFaceMode, isFaceDisabled, rawFace, removeUpload, resetCrop, setCrop, setFaceDisabled, uploadFace,
} from '../../render/faces';
import type { App, Screen } from '../app';
import { el, esc, portraitHTML } from '../dom';

const COLS = 8;
const VIEW = 440;

/** Adjust each MK's photo crop, upload a replacement photo, or switch a single MK back to cartoon. */
export class FaceEditorScreen implements Screen {
  private index = 0;
  private focus: 'grid' | 'edit' = 'grid';
  private grid!: HTMLElement;
  private cells: HTMLElement[] = [];
  private panel!: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private preview!: HTMLElement;
  private info!: HTMLElement;
  private fileInput!: HTMLInputElement;
  private drag: { x: number; y: number; crop: Crop } | null = null;
  private busy = false;

  constructor(private app: App, private back: () => void) {}

  private get def(): CharacterDef {
    return ROSTER[this.index];
  }

  enter(): void {
    const app = this.app;
    const page = el('div', 'page');
    page.innerHTML = `<h1 class="display">Faces</h1>
      <div class="sub">Photos come from each MK's Wikipedia article (free licences only). Drag to move, scroll to zoom, or upload your own photo.
      ${getFaceMode() === 'cartoon' ? '<br><b style="color:var(--gold)">Faces are set to Cartoon in Options: switch to Photos to see them in game.</b>' : ''}</div>
      <div class="fe-wrap"><div class="fe-grid"></div><div class="fe-panel panel"></div></div>`;
    this.grid = page.querySelector('.fe-grid') as HTMLElement;
    this.panel = page.querySelector('.fe-panel') as HTMLElement;
    this.cells = ROSTER.map((def, i) => {
      const c = el('div', 'cs-cell');
      c.addEventListener('click', () => {
        this.index = i;
        this.focus = 'edit';
        this.refreshAll();
      });
      this.grid.appendChild(c);
      return c;
    });
    this.panel.innerHTML = `<div class="fe-title display"></div><div class="fe-info"></div>
      <div class="fe-row"><canvas width="${VIEW}" height="${VIEW}" class="fe-canvas"></canvas><div class="fe-preview"></div></div>
      <div class="fe-buttons">
        <button data-a="upload">Upload photo…</button><button data-a="auto">Auto crop</button>
        <button data-a="toggle"></button><button data-a="remove">Remove upload</button>
      </div>
      <div class="fe-keys"></div>`;
    this.canvas = this.panel.querySelector('canvas') as HTMLCanvasElement;
    this.preview = this.panel.querySelector('.fe-preview') as HTMLElement;
    this.info = this.panel.querySelector('.fe-info') as HTMLElement;
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', () => {
      const f = this.fileInput.files?.[0];
      if (f) void this.upload(f);
      this.fileInput.value = '';
    });
    page.appendChild(this.fileInput);
    this.panel.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => this.action((b as HTMLElement).dataset.a!)));
    this.canvas.addEventListener('pointerdown', (e) => {
      const f = rawFace(this.def.id);
      if (!f) return;
      this.drag = { x: e.clientX, y: e.clientY, crop: { ...f.crop } };
      this.canvas.setPointerCapture(e.pointerId);
    });
    this.canvas.addEventListener('pointermove', (e) => {
      const f = rawFace(this.def.id);
      if (!this.drag || !f) return;
      const k = this.fit(f.image).k;
      const rect = this.canvas.getBoundingClientRect();
      const scale = VIEW / rect.width;
      setCrop(this.def, {
        cx: this.drag.crop.cx - ((e.clientX - this.drag.x) * scale) / (k * f.image.width),
        cy: this.drag.crop.cy - ((e.clientY - this.drag.y) * scale) / (k * f.image.height),
        h: this.drag.crop.h,
      });
      this.refreshEditor();
    });
    this.canvas.addEventListener('pointerup', () => {
      this.drag = null;
      this.refreshCell(this.index);
    });
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoom(e.deltaY > 0 ? 1.06 : 1 / 1.06);
    }, { passive: false });
    page.addEventListener('dragover', (e) => e.preventDefault());
    page.addEventListener('drop', (e) => {
      e.preventDefault();
      const f = e.dataTransfer?.files?.[0];
      if (f && f.type.startsWith('image/')) void this.upload(f);
    });
    app.ui.append(page, el('div', 'hint', `${app.mg('confirm')} Edit ${app.mg('back')} Back`));
    this.refreshAll();
  }

  private fit(img: HTMLCanvasElement): { k: number; ox: number; oy: number } {
    const k = Math.min(VIEW / img.width, VIEW / img.height);
    return { k, ox: (VIEW - img.width * k) / 2, oy: (VIEW - img.height * k) / 2 };
  }

  private refreshCell(i: number): void {
    const def = ROSTER[i];
    const c = this.cells[i];
    const off = isFaceDisabled(def.id);
    c.innerHTML = `${portraitHTML(def)}<div class="nm">${esc(def.name.split(' ').slice(-1)[0])}${off ? ' · 🎨' : ''}</div>`;
    c.classList.toggle('p1', i === this.index);
  }

  private refreshAll(): void {
    this.cells.forEach((_, i) => this.refreshCell(i));
    this.refreshEditor();
  }

  private refreshEditor(): void {
    const def = this.def;
    const f = rawFace(def.id);
    (this.panel.querySelector('.fe-title') as HTMLElement).textContent = def.name;
    const off = isFaceDisabled(def.id);
    (this.panel.querySelector('[data-a="toggle"]') as HTMLElement).textContent = off ? 'Use photo' : 'Use cartoon';
    (this.panel.querySelector('[data-a="remove"]') as HTMLElement).style.display = f?.source.kind === 'upload' ? '' : 'none';
    this.panel.classList.toggle('focused', this.focus === 'edit');
    const s = f?.source;
    this.info.innerHTML = !f
      ? 'No free-licensed photo found (or you are offline). Upload one to use it in game.'
      : s?.kind === 'upload'
        ? 'Your uploaded photo (stored only in this browser).'
        : `Photo: ${esc(s?.artist ?? '')} · ${esc(s?.license ?? '')} · <a href="${esc(s?.descUrl ?? '#')}" target="_blank" rel="noopener">source</a>${f.detected ? '' : ' · <span style="color:var(--gold)">face not auto-detected: check the crop</span>'}`;
    const ctx = this.canvas.getContext('2d')!;
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, VIEW, VIEW);
    this.preview.innerHTML = '';
    if (!f) {
      ctx.fillStyle = '#9aa6c4';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No photo yet: click Upload or drop an image here', VIEW / 2, VIEW / 2);
    } else {
      const { k, ox, oy } = this.fit(f.image);
      ctx.drawImage(f.image, ox, oy, f.image.width * k, f.image.height * k);
      const r = headRect(f.crop, f.image.width, f.image.height);
      const cx = ox + (r.x + r.w / 2) * k;
      const cy = oy + (r.y + r.h / 2) * k;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, VIEW, VIEW);
      ctx.ellipse(cx, cy, (r.w * k * 0.465), (r.h * k * 0.465), 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fill('evenodd');
      ctx.beginPath();
      ctx.ellipse(cx, cy, (r.w * k * 0.465), (r.h * k * 0.465), 0, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffcc33';
      ctx.stroke();
      ctx.restore();
      const head = f.head.cloneNode() as HTMLCanvasElement;
      head.getContext('2d')!.drawImage(f.head, 0, 0);
      head.className = 'fe-head';
      this.preview.appendChild(head);
      this.preview.insertAdjacentHTML('beforeend', `<img class="fe-portrait" src="${f.portrait}" alt="">`);
    }
    const st = this.app.menuStyle();
    const zoomKeys = st === 'kb' ? '<span class="g g-key">H</span>/<span class="g g-key">L</span>' : `${this.app.glyph('TH', 0, st)}/${this.app.glyph('UL', 0, st)}`;
    (this.panel.querySelector('.fe-keys') as HTMLElement).innerHTML = this.focus === 'edit'
      ? `Arrows / stick: move · ${zoomKeys} zoom · ${this.app.mg('extra')} photo/cartoon · ${this.app.mg('extra2')} auto crop · ${this.app.mg('back')} done`
      : `Pick an MK, then ${this.app.mg('confirm')} to edit`;
  }

  private zoom(f: number): void {
    const face = rawFace(this.def.id);
    if (!face) return;
    setCrop(this.def, { ...face.crop, h: face.crop.h * f });
    this.refreshEditor();
    this.refreshCell(this.index);
  }

  private nudge(dx: number, dy: number): void {
    const face = rawFace(this.def.id);
    if (!face) return;
    setCrop(this.def, { cx: face.crop.cx + dx * face.crop.h * 0.05, cy: face.crop.cy + dy * face.crop.h * 0.05, h: face.crop.h });
    this.refreshEditor();
    this.refreshCell(this.index);
  }

  private async upload(file: Blob): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.info.textContent = 'Processing photo…';
    const ok = await uploadFace(this.def, file);
    this.busy = false;
    if (!ok) this.info.textContent = 'Could not read that image.';
    this.refreshAll();
  }

  private action(a: string): void {
    const def = this.def;
    this.app.audio.sfx('menuConfirm');
    if (a === 'upload') this.fileInput.click();
    else if (a === 'auto') resetCrop(def);
    else if (a === 'toggle') setFaceDisabled(def.id, !isFaceDisabled(def.id));
    else if (a === 'remove') void removeUpload(def).then(() => this.refreshAll());
    this.refreshAll();
  }

  exit(): void {}

  tick(): void {
    if (this.busy) return;
    const ms = this.app.input.menu('any');
    if (this.focus === 'grid') {
      if (ms.back) {
        this.app.audio.sfx('menuBack');
        this.back();
        return;
      }
      const n = ROSTER.length;
      let moved = false;
      if (ms.left) (this.index = (this.index + n - 1) % n), (moved = true);
      else if (ms.right) (this.index = (this.index + 1) % n), (moved = true);
      else if (ms.up) (this.index = (this.index + n - COLS) % n), (moved = true);
      else if (ms.down) (this.index = (this.index + COLS) % n), (moved = true);
      if (moved) {
        this.app.audio.sfx('menuMove');
        this.refreshAll();
      }
      if (ms.confirm) {
        this.focus = 'edit';
        this.app.audio.sfx('menuConfirm');
        this.refreshEditor();
      }
      return;
    }
    if (ms.back) {
      this.focus = 'grid';
      this.app.audio.sfx('menuBack');
      this.refreshAll();
      return;
    }
    if (ms.left) this.nudge(-1, 0);
    if (ms.right) this.nudge(1, 0);
    if (ms.up) this.nudge(0, -1);
    if (ms.down) this.nudge(0, 1);
    if (ms.l1) this.zoom(1.06);
    if (ms.r1) this.zoom(1 / 1.06);
    if (ms.extra) this.action('toggle');
    if (ms.extra2) this.action('auto');
  }

  frame(dt: number): void {
    this.app.renderer.syncShowcase(dt, { pos: [2, 1.5, 6], look: [0, 1.1, 0] });
  }
}

export class CreditsScreen implements Screen {
  constructor(private app: App, private back: () => void) {}

  enter(): void {
    const credits = faceCredits();
    const rows = credits
      .map(({ id, source }) => {
        const def = ROSTER.find((d) => d.id === id)!;
        return `<tr><td>${portraitHTML(def, 'cr-img')}</td><td><b>${esc(def.name)}</b></td>
          <td>${esc(source.artist ?? '')}</td><td>${esc(source.license ?? '')}${source.licenseUrl ? ` · <a href="${esc(source.licenseUrl)}" target="_blank" rel="noopener">licence</a>` : ''}</td>
          <td><a href="${esc(source.descUrl ?? '#')}" target="_blank" rel="noopener">${esc(source.file ?? 'file')}</a></td></tr>`;
      })
      .join('');
    const page = el('div', 'page');
    page.innerHTML = `<h1 class="display">Credits</h1>
      <div class="sub">Iron Knesset is a parody. MK photos are loaded live from Wikipedia / Wikimedia Commons under the free licences listed below,
      cropped and used as caricature heads. Photos remain the work of their authors. Photos you upload stay in your browser only.</div>
      ${credits.length ? `<table class="ml-table cr-table"><tr class="hdr"><td></td><td>MK</td><td>Photographer / author</td><td>Licence</td><td>Source file</td></tr>${rows}</table>` : '<p>No photos loaded (offline, blocked, or Faces set to Cartoon).</p>'}
      <p class="sub" style="margin-top:24px">Code: TypeScript + three.js. Face detection: MediaPipe (Apache 2.0). Music, sound and 3D models are generated procedurally.</p>`;
    this.app.ui.append(page, el('div', 'hint', `${this.app.mg('back')} Back`));
  }

  exit(): void {}

  tick(): void {
    const ms = this.app.input.menu('any');
    if (ms.back || ms.confirm) {
      this.app.audio.sfx('menuBack');
      this.back();
    }
  }

  frame(dt: number): void {
    this.app.renderer.syncShowcase(dt, { pos: [2, 1.5, 6], look: [0, 1.1, 0] });
  }
}
