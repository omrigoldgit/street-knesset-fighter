// Procedurally painted clothing textures: suit jackets with lapels, ties, buttons and pockets;
// trousers with creases; sleeves with shirt cuffs; hair strands. Each garment gets a colour map
// and a normal map derived from a painted height map, so lapels and seams catch the light.
//
// UV layout of every body tube: u runs around the body (0 = back centre, 0.25 = the fighter's
// left side, 0.5 = front centre, 0.75 = right side), v runs bottom (0) to top (1).

import * as THREE from 'three';

export type JacketStyle = 'suit' | 'open' | 'blazer' | 'shirt' | 'tshirt';

export interface JacketSpec {
  color: number;
  shirt: number;
  tie: number | null;
  style: JacketStyle;
  pin: number;
  female: boolean;
  pinstripe: boolean;
  /** Torso height range covered by the texture, to place details at real heights. */
  y0: number;
  y1: number;
}

export interface GarmentTex {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
}

const css = (c: number, a = 1) => {
  const col = new THREE.Color(c);
  return `rgba(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)},${a})`;
};

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d', { willReadFrequently: true })!];
}

function tex(c: HTMLCanvasElement, srgb: boolean): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** Deterministic pseudo-random for stable textures. */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Fine fabric grain: faint twill noise over the base colour. */
function fabric(g: CanvasRenderingContext2D, w: number, h: number, color: number, seed: number, amount = 0.05): void {
  g.fillStyle = css(color);
  g.fillRect(0, 0, w, h);
  const r = rng(seed);
  const img = g.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      // Diagonal twill + grain.
      const tw = ((x + y) % 4 < 2 ? 1 : -1) * amount * 0.4;
      const n = (r() - 0.5) * amount + tw;
      d[i] = Math.max(0, Math.min(255, d[i] * (1 + n)));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] * (1 + n)));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] * (1 + n)));
    }
  }
  g.putImageData(img, 0, 0);
}

/** Height map (grey) → tangent-space normal map. */
function heightToNormal(src: HTMLCanvasElement, strength: number): HTMLCanvasElement {
  const w = src.width;
  const h = src.height;
  const sd = src.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, w, h).data;
  const [out, g] = canvas(w, h);
  const img = g.createImageData(w, h);
  const d = img.data;
  const H = (x: number, y: number) => sd[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (H(x + 1, y) - H(x - 1, y)) * strength;
      const dy = (H(x, y + 1) - H(x, y - 1)) * strength;
      let nx = -dx;
      let ny = dy;
      let nz = 1;
      const l = Math.hypot(nx, ny, nz);
      nx /= l;
      ny /= l;
      nz /= l;
      const i = (y * w + x) * 4;
      d[i] = (nx * 0.5 + 0.5) * 255;
      d[i + 1] = (ny * 0.5 + 0.5) * 255;
      d[i + 2] = (nz * 0.5 + 0.5) * 255;
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return out;
}

/** Grain for the height map (weave). */
function weave(g: CanvasRenderingContext2D, w: number, h: number, seed: number, amp = 10): void {
  const r = rng(seed);
  const img = g.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const v = d[i] + ((x + y) % 3 === 0 ? amp * 0.5 : 0) + (r() - 0.5) * amp;
      d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, v));
    }
  }
  g.putImageData(img, 0, 0);
}

export function jacketTextures(spec: JacketSpec, seed: number): GarmentTex {
  const W = 512;
  const Hh = 512;
  const [c, g] = canvas(W, Hh);
  const [hc, hg] = canvas(W, Hh);
  hg.fillStyle = 'rgb(128,128,128)';
  hg.fillRect(0, 0, W, Hh);
  const X = (u: number) => u * W;
  const V = (y: number) => (1 - (y - spec.y0) / (spec.y1 - spec.y0)) * Hh;
  const base = spec.style === 'shirt' || spec.style === 'tshirt' ? spec.shirt : spec.color;
  fabric(g, W, Hh, base, seed, spec.style === 'tshirt' ? 0.04 : 0.06);

  if (spec.pinstripe && spec.style !== 'shirt' && spec.style !== 'tshirt') {
    g.strokeStyle = css(0xffffff, 0.09);
    g.lineWidth = 1;
    for (let x = 0; x < W; x += 9) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, Hh);
      g.stroke();
    }
  }

  // Seams: back, sides, shoulders.
  const seam = (x0: number, y0: number, x1: number, y1: number) => {
    g.strokeStyle = 'rgba(0,0,0,0.22)';
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
    hg.strokeStyle = 'rgb(100,100,100)';
    hg.lineWidth = 2;
    hg.beginPath();
    hg.moveTo(x0, y0);
    hg.lineTo(x1, y1);
    hg.stroke();
  };
  for (const u of [0.002, 0.25, 0.75, 0.998]) seam(X(u), 0, X(u), Hh);

  const cx = X(0.5);
  const neckY = V(spec.y1 - 0.005);
  const style = spec.style;

  if (style === 'tshirt') {
    // Crew neck rib.
    g.fillStyle = css(new THREE.Color(spec.shirt).multiplyScalar(0.85).getHex());
    g.fillRect(0, 0, W, Hh * 0.035);
  } else if (style === 'shirt') {
    // Button placket and buttons.
    g.fillStyle = 'rgba(0,0,0,0.08)';
    g.fillRect(cx - 7, neckY, 14, Hh);
    hg.fillStyle = 'rgb(150,150,150)';
    hg.fillRect(cx - 7, neckY, 14, Hh);
    for (let y = V(spec.y1 - 0.08); y < Hh - 10; y += Hh * 0.11) {
      g.fillStyle = 'rgba(240,240,240,0.9)';
      g.beginPath();
      g.arc(cx, y, 3.2, 0, Math.PI * 2);
      g.fill();
    }
  } else {
    // Jacket front: V opening showing shirt (and tie), lapels, buttons, pockets.
    const open = style === 'open';
    const vBottomY = style === 'blazer' ? spec.y0 + (spec.y1 - spec.y0) * 0.44 : spec.y0 + (spec.y1 - spec.y0) * 0.5;
    const vb = V(vBottomY);
    const topHalf = X(open ? 0.085 : 0.075) - X(0);
    const gapBottom = open ? X(0.035) - X(0) : X(0.012) - X(0);
    // Shirt inside the V (and the parted front below the button).
    g.fillStyle = css(spec.shirt);
    g.beginPath();
    g.moveTo(cx - topHalf, 0);
    g.lineTo(cx + topHalf, 0);
    if (open) {
      g.lineTo(cx + gapBottom, vb);
      g.lineTo(cx + gapBottom * 0.8, Hh);
      g.lineTo(cx - gapBottom * 0.8, Hh);
      g.lineTo(cx - gapBottom, vb);
    } else {
      g.lineTo(cx, vb);
    }
    g.closePath();
    g.fill();
    if (!open) {
      // Cutaway below the button.
      g.fillStyle = 'rgba(10,10,14,0.55)';
      g.beginPath();
      g.moveTo(cx, vb + 6);
      g.lineTo(cx + gapBottom * 1.6, Hh);
      g.lineTo(cx - gapBottom * 1.6, Hh);
      g.closePath();
      g.fill();
    } else {
      // Shirt buttons down the open front.
      for (let y = Hh * 0.12; y < Hh - 10; y += Hh * 0.13) {
        g.fillStyle = 'rgba(235,235,235,0.9)';
        g.beginPath();
        g.arc(cx, y, 2.6, 0, Math.PI * 2);
        g.fill();
      }
      // Open collar: a little skin at the throat.
      g.fillStyle = 'rgba(214,170,140,0.95)';
      g.beginPath();
      g.moveTo(cx - topHalf * 0.45, 0);
      g.lineTo(cx + topHalf * 0.45, 0);
      g.lineTo(cx, Hh * 0.07);
      g.closePath();
      g.fill();
    }
    // Tie.
    if (spec.tie !== null && style === 'suit') {
      const tieTop = Hh * 0.02;
      const tieBot = vb + (Hh - vb) * 0.05;
      const tw0 = W * 0.018;
      const tw1 = W * 0.03;
      g.save();
      g.beginPath();
      g.moveTo(cx - tw0, tieTop);
      g.lineTo(cx + tw0, tieTop);
      g.lineTo(cx + tw1, tieBot - tw1);
      g.lineTo(cx, tieBot);
      g.lineTo(cx - tw1, tieBot - tw1);
      g.closePath();
      g.clip();
      g.fillStyle = css(spec.tie);
      g.fillRect(0, 0, W, Hh);
      g.strokeStyle = css(new THREE.Color(spec.tie).lerp(new THREE.Color(0xffffff), 0.35).getHex(), 0.7);
      g.lineWidth = 3;
      for (let k = -Hh; k < Hh; k += 12) {
        g.beginPath();
        g.moveTo(cx - 40, k);
        g.lineTo(cx + 40, k + 40);
        g.stroke();
      }
      g.restore();
      hg.fillStyle = 'rgb(150,150,150)';
      hg.fillRect(cx - tw1, tieTop, tw1 * 2, tieBot - tieTop);
    }
    // Lapels: raised bands along both V edges with a notch near the top.
    const lapelW = W * (spec.female ? 0.026 : 0.034);
    const jacketDark = css(new THREE.Color(spec.color).multiplyScalar(0.72).getHex());
    for (const s of [-1, 1]) {
      const x0 = cx + s * topHalf;
      const xb = open ? cx + s * gapBottom : cx;
      const lap = new Path2D();
      lap.moveTo(x0, 0);
      lap.lineTo(x0 + s * lapelW * 1.25, Hh * 0.07);
      lap.lineTo(x0 + s * lapelW * 0.7, Hh * 0.09);
      lap.lineTo(xb + s * lapelW, vb - Hh * 0.02);
      lap.lineTo(xb, vb);
      lap.closePath();
      g.fillStyle = 'rgba(255,255,255,0.05)';
      g.fill(lap);
      g.strokeStyle = jacketDark;
      g.lineWidth = 2;
      g.stroke(lap);
      hg.fillStyle = 'rgb(175,175,175)';
      hg.fill(lap);
      hg.strokeStyle = 'rgb(95,95,95)';
      hg.lineWidth = 2;
      hg.stroke(lap);
      // Shadow the jacket just outside the lapel.
      g.strokeStyle = 'rgba(0,0,0,0.18)';
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(x0 + s * lapelW * 1.35, Hh * 0.07);
      g.lineTo(xb + s * lapelW * 1.1, vb - Hh * 0.02);
      g.stroke();
    }
    // Party pin on the left lapel (fighter's left = u < 0.5).
    g.fillStyle = css(spec.pin);
    g.beginPath();
    g.arc(cx - topHalf - lapelW * 0.4, Hh * 0.2, 4.5, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,0.7)';
    g.beginPath();
    g.arc(cx - topHalf - lapelW * 0.4 - 1.2, Hh * 0.2 - 1.2, 1.5, 0, Math.PI * 2);
    g.fill();
    // Buttons.
    if (!open) {
      const btn = (y: number) => {
        g.fillStyle = 'rgba(15,15,18,0.95)';
        g.beginPath();
        g.arc(cx, y, 5, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = 'rgba(255,255,255,0.25)';
        g.beginPath();
        g.arc(cx - 1.5, y - 1.5, 1.6, 0, Math.PI * 2);
        g.fill();
        hg.fillStyle = 'rgb(200,200,200)';
        hg.beginPath();
        hg.arc(cx, y, 5, 0, Math.PI * 2);
        hg.fill();
      };
      btn(vb + 8);
      if (!spec.female) btn(vb + Hh * 0.16);
    }
    // Hip pocket flaps and a breast pocket with a party-colour pocket square.
    for (const s of [-1, 1]) {
      const px = cx + s * X(0.1);
      const py = Hh * 0.8;
      g.fillStyle = 'rgba(0,0,0,0.12)';
      g.fillRect(px - W * 0.035, py, W * 0.07, 3);
      g.strokeStyle = jacketDark;
      g.lineWidth = 1.5;
      g.strokeRect(px - W * 0.035, py, W * 0.07, Hh * 0.035);
      hg.fillStyle = 'rgb(150,150,150)';
      hg.fillRect(px - W * 0.035, py, W * 0.07, Hh * 0.035);
    }
    if (!spec.female) {
      const bx = cx - X(0.095);
      const by = Hh * 0.32;
      g.strokeStyle = jacketDark;
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(bx - W * 0.025, by);
      g.lineTo(bx + W * 0.022, by - 2);
      g.stroke();
      g.fillStyle = css(spec.pin, 0.9);
      g.beginPath();
      g.moveTo(bx - W * 0.018, by);
      g.lineTo(bx - W * 0.008, by - 9);
      g.lineTo(bx + W * 0.004, by - 4);
      g.lineTo(bx + W * 0.014, by - 8);
      g.lineTo(bx + W * 0.016, by);
      g.closePath();
      g.fill();
    }
  }
  // Soft ambient occlusion under the arms and at the hem.
  const ao = g.createLinearGradient(0, Hh * 0.85, 0, Hh);
  ao.addColorStop(0, 'rgba(0,0,0,0)');
  ao.addColorStop(1, 'rgba(0,0,0,0.25)');
  g.fillStyle = ao;
  g.fillRect(0, 0, W, Hh);
  for (const u of [0.25, 0.75]) {
    const sg = g.createLinearGradient(X(u) - 30, 0, X(u) + 30, 0);
    sg.addColorStop(0, 'rgba(0,0,0,0)');
    sg.addColorStop(0.5, 'rgba(0,0,0,0.12)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sg;
    g.fillRect(X(u) - 30, Hh * 0.15, 60, Hh * 0.55);
  }
  weave(hg, W, Hh, seed + 7, style === 'tshirt' ? 6 : 12);
  return { map: tex(c, true), normalMap: tex(heightToNormal(hc, 2.2), false) };
}

/** Trousers (or a pencil skirt): creases down the front of each leg, side seams, belt at the top. */
export function trouserTextures(color: number, seed: number, crease = true): GarmentTex {
  const W = 256;
  const H = 512;
  const [c, g] = canvas(W, H);
  const [hc, hg] = canvas(W, H);
  fabric(g, W, H, color, seed, 0.06);
  hg.fillStyle = 'rgb(128,128,128)';
  hg.fillRect(0, 0, W, H);
  if (crease) {
    g.fillStyle = 'rgba(255,255,255,0.07)';
    g.fillRect(W * 0.5 - 1, 0, 2, H);
    g.fillStyle = 'rgba(0,0,0,0.08)';
    g.fillRect(W * 0.5 + 1, 0, 2, H);
    hg.fillStyle = 'rgb(165,165,165)';
    hg.fillRect(W * 0.5 - 1.5, 0, 3, H);
  }
  for (const u of [0.25, 0.75]) {
    g.fillStyle = 'rgba(0,0,0,0.15)';
    g.fillRect(W * u - 1, 0, 2, H);
    hg.fillStyle = 'rgb(105,105,105)';
    hg.fillRect(W * u - 1, 0, 2, H);
  }
  // Hem shadow.
  const ao = g.createLinearGradient(0, H * 0.94, 0, H);
  ao.addColorStop(0, 'rgba(0,0,0,0)');
  ao.addColorStop(1, 'rgba(0,0,0,0.3)');
  g.fillStyle = ao;
  g.fillRect(0, 0, W, H);
  weave(hg, W, H, seed + 3, 12);
  return { map: tex(c, true), normalMap: tex(heightToNormal(hc, 2.0), false) };
}

/** Sleeve: fabric with a shirt cuff at the wrist and cuff buttons on the outer side; or a short sleeve over bare forearm. */
export function sleeveTextures(color: number, cuff: number | null, seed: number, outerU: number, shortSleeve: number | null, skin: number): GarmentTex {
  const W = 256;
  const H = 512;
  const [c, g] = canvas(W, H);
  const [hc, hg] = canvas(W, H);
  fabric(g, W, H, color, seed, 0.06);
  hg.fillStyle = 'rgb(128,128,128)';
  hg.fillRect(0, 0, W, H);
  if (shortSleeve !== null) {
    // Bare forearm below the short sleeve.
    const y = (1 - shortSleeve) * H;
    g.fillStyle = css(skin);
    g.fillRect(0, y, W, H - y);
    g.fillStyle = 'rgba(0,0,0,0.12)';
    g.fillRect(0, y, W, 4);
    hg.fillStyle = 'rgb(160,160,160)';
    hg.fillRect(0, y - 4, W, 4);
  } else {
    if (cuff !== null) {
      g.fillStyle = css(cuff);
      g.fillRect(0, H * 0.965, W, H * 0.035);
    }
    for (let k = 0; k < 3; k++) {
      g.fillStyle = 'rgba(10,10,12,0.9)';
      g.beginPath();
      g.arc(W * outerU + (k - 1) * 7, H * 0.93, 2.6, 0, Math.PI * 2);
      g.fill();
    }
    // Elbow creases.
    g.strokeStyle = 'rgba(0,0,0,0.1)';
    g.lineWidth = 2;
    const inner = W * ((outerU + 0.5) % 1);
    for (let k = 0; k < 3; k++) {
      g.beginPath();
      g.moveTo(inner - 30, H * (0.5 + k * 0.025));
      g.quadraticCurveTo(inner, H * (0.51 + k * 0.025), inner + 30, H * (0.5 + k * 0.025));
      g.stroke();
    }
  }
  weave(hg, W, H, seed + 11, 12);
  return { map: tex(c, true), normalMap: tex(heightToNormal(hc, 2.0), false) };
}

/** Hair: strand streaks along v, used on hair shells. */
export function hairTextures(color: number, seed: number): GarmentTex {
  const W = 256;
  const H = 256;
  const [c, g] = canvas(W, H);
  const [hc, hg] = canvas(W, H);
  const r = rng(seed);
  g.fillStyle = css(color);
  g.fillRect(0, 0, W, H);
  hg.fillStyle = 'rgb(128,128,128)';
  hg.fillRect(0, 0, W, H);
  const base = new THREE.Color(color);
  for (let i = 0; i < 1400; i++) {
    const x = r() * W;
    const y = r() * H;
    const len = 10 + r() * 40;
    const bright = (r() - 0.5) * 0.5;
    const col = base.clone().multiplyScalar(1 + bright);
    g.strokeStyle = `rgba(${Math.round(Math.min(1, col.r) * 255)},${Math.round(Math.min(1, col.g) * 255)},${Math.round(Math.min(1, col.b) * 255)},0.5)`;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (r() - 0.5) * 6, y + len);
    g.stroke();
    const hv = 128 + bright * 200;
    hg.strokeStyle = `rgb(${hv},${hv},${hv})`;
    hg.beginPath();
    hg.moveTo(x, y);
    hg.lineTo(x + (r() - 0.5) * 6, y + len);
    hg.stroke();
  }
  const t = tex(c, true);
  t.wrapT = THREE.RepeatWrapping;
  const n = tex(heightToNormal(hc, 3), false);
  n.wrapT = THREE.RepeatWrapping;
  return { map: t, normalMap: n };
}
