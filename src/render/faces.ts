// Photo faces: fetches each MK's freely licensed Wikipedia lead photo in the player's browser,
// detects and crops the face, and produces a masked "bobble-head" texture plus a portrait.
// Players can re-crop any face or upload their own photo; everything falls back to the
// procedural cartoon head when a photo is unavailable.

import * as THREE from 'three';
import type { CharacterDef } from '../game/characterTypes';
import { PARTIES } from '../data/parties';
import {
  WIKI_TITLES, cropFromFaceBox, fileKey, headRect, heuristicCrop, imageInfoUrl, isFreeLicense,
  pageImagesUrl, parseImageInfo, parsePageImages, portraitRect, type Crop, type ImageLicense, type PageImage,
} from '../core/wiki';
import { detectFace } from './faceDetect';
import { decodeMesh, encodeMesh, meshFace, type FaceMeshData } from './faceMesh';
import { CHEEK_POINTS } from './faceTopology';

export type FaceMode = 'photo' | 'cartoon';

/** Everything needed to build a textured 3D head from a photo. */
export interface PhotoHead {
  texture: THREE.Texture;
  mesh: FaceMeshData;
  /** Skin tone sampled from the cheeks. */
  skin: number;
}

export interface FaceSource {
  kind: 'wiki' | 'upload';
  url: string;
  file?: string;
  license?: string;
  licenseUrl?: string;
  artist?: string;
  descUrl?: string;
  pageUrl?: string;
}

export interface FaceEntry {
  id: string;
  image: HTMLCanvasElement;
  source: FaceSource;
  crop: Crop;
  auto: Crop;
  detected: boolean;
  head: HTMLCanvasElement;
  portrait: string;
  texture: THREE.CanvasTexture | null;
  /** Square crop around the face that the 3D face mesh is textured from. */
  meshCanvas: HTMLCanvasElement | null;
  mesh: FaceMeshData | null;
  meshTexture: THREE.CanvasTexture | null;
  skin: number | null;
}

const HEAD_W = 256;
const MESH_SIZE = 512;
const HEAD_H = 320;
const faces = new Map<string, FaceEntry>();
const wikiInfo = new Map<string, FaceSource>();
let mode: FaceMode = 'photo';
let version = 0;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, v: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
}

const disabled = new Set<string>(load<string[]>('skf.faceDisabled', []));
const userCrops: Record<string, Crop & { url: string }> = load('skf.faceCrops', {});
const autoCrops: Record<string, Crop & { detected: boolean }> = load('skf.faceAutoCrops', {});
/** Cached 3D face reconstructions, keyed by photo URL + crop. */
const meshCache: Record<string, string> = load('skf.faceMesh.v1', {});

// ------------------------------------------------------------------ public API

export function faceVersion(): number {
  return version;
}

export function setFaceMode(m: FaceMode): void {
  if (mode !== m) {
    mode = m;
    version++;
  }
}

export function getFaceMode(): FaceMode {
  return mode;
}

export function getFace(id: string): FaceEntry | undefined {
  if (mode !== 'photo' || disabled.has(id)) return undefined;
  return faces.get(id);
}

export function rawFace(id: string): FaceEntry | undefined {
  return faces.get(id);
}

export function faceTexture(id: string): THREE.Texture | null {
  const f = getFace(id);
  if (!f) return null;
  if (!f.texture) {
    f.texture = new THREE.CanvasTexture(f.head);
    f.texture.colorSpace = THREE.SRGBColorSpace;
    f.texture.anisotropy = 4;
  }
  return f.texture;
}

/** Textured 3D face data, when the photo could be reconstructed. */
export function photoHead(id: string): PhotoHead | null {
  const f = getFace(id);
  if (!f?.mesh || !f.meshCanvas) return null;
  if (!f.meshTexture) {
    f.meshTexture = new THREE.CanvasTexture(f.meshCanvas);
    f.meshTexture.colorSpace = THREE.SRGBColorSpace;
    f.meshTexture.anisotropy = 8;
  }
  return { texture: f.meshTexture, mesh: f.mesh, skin: f.skin ?? 0xd9a27c };
}

export function facePortrait(id: string): string | undefined {
  return getFace(id)?.portrait;
}

export function isFaceDisabled(id: string): boolean {
  return disabled.has(id);
}

export function setFaceDisabled(id: string, off: boolean): void {
  if (off) disabled.add(id);
  else disabled.delete(id);
  save('skf.faceDisabled', [...disabled]);
  version++;
}

export function loadedFaceCount(): number {
  return faces.size;
}

export function faceCredits(): { id: string; source: FaceSource }[] {
  return [...faces.values()].filter((f) => f.source.kind === 'wiki').map((f) => ({ id: f.id, source: f.source }));
}

// ------------------------------------------------------------------ image helpers

function loadImage(url: string, timeoutMs = 15000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    const t = setTimeout(() => reject(new Error('timeout')), timeoutMs);
    img.onload = () => {
      clearTimeout(t);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(t);
      reject(new Error(`failed to load ${url}`));
    };
    img.src = url;
  });
}

function toCanvas(img: HTMLImageElement, max = 900): HTMLCanvasElement {
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(img.naturalWidth * k));
  c.height = Math.max(1, Math.round(img.naturalHeight * k));
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

async function fetchJson(url: string, timeoutMs = 12000): Promise<unknown> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

function edgeColor(src: HTMLCanvasElement): string {
  const ctx = src.getContext('2d')!;
  const d = ctx.getImageData(0, 0, src.width, 1).data;
  let r = 0;
  let g = 0;
  let b = 0;
  const n = d.length / 4;
  for (let i = 0; i < d.length; i += 4) {
    r += d[i];
    g += d[i + 1];
    b += d[i + 2];
  }
  return `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`;
}

/** Renders the oval, outlined head texture and the square portrait for an entry. */
function render(entry: FaceEntry, def: CharacterDef | undefined): void {
  const src = entry.image;
  const W = src.width;
  const H = src.height;
  const bg = edgeColor(src);

  const head = entry.head;
  head.width = HEAD_W;
  head.height = HEAD_H;
  const ctx = head.getContext('2d')!;
  ctx.save();
  ctx.clearRect(0, 0, HEAD_W, HEAD_H);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, HEAD_W, HEAD_H);
  const r = headRect(entry.crop, W, H);
  ctx.drawImage(src, r.x, r.y, r.w, r.h, 0, 0, HEAD_W, HEAD_H);
  // Soft oval mask.
  ctx.globalCompositeOperation = 'destination-in';
  ctx.translate(HEAD_W / 2, HEAD_H / 2);
  ctx.scale(1, HEAD_H / HEAD_W);
  const g = ctx.createRadialGradient(0, 0, HEAD_W * 0.38, 0, 0, HEAD_W * 0.5);
  g.addColorStop(0, 'rgba(0,0,0,1)');
  g.addColorStop(0.82, 'rgba(0,0,0,1)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(-HEAD_W / 2, -HEAD_W / 2, HEAD_W, HEAD_W);
  ctx.restore();
  // Comic outline to match the toon-shaded bodies.
  ctx.save();
  ctx.translate(HEAD_W / 2, HEAD_H / 2);
  ctx.beginPath();
  ctx.ellipse(0, 0, HEAD_W * 0.465, HEAD_H * 0.465, 0, 0, Math.PI * 2);
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(7,8,12,0.9)';
  ctx.stroke();
  ctx.restore();

  const P = 192;
  const pc = document.createElement('canvas');
  pc.width = P;
  pc.height = P;
  const pctx = pc.getContext('2d')!;
  pctx.fillStyle = def ? `#${PARTIES[def.party].color.toString(16).padStart(6, '0')}` : bg;
  pctx.fillRect(0, 0, P, P);
  const pr = portraitRect(entry.crop, W, H);
  pctx.drawImage(src, pr.x, pr.y, pr.s, pr.s, 0, 0, P, P);
  entry.portrait = pc.toDataURL('image/jpeg', 0.88);
  if (entry.texture) entry.texture.needsUpdate = true;
}

async function autoCrop(canvas: HTMLCanvasElement, url: string): Promise<{ crop: Crop; detected: boolean }> {
  const cached = autoCrops[url];
  if (cached) return { crop: { cx: cached.cx, cy: cached.cy, h: cached.h }, detected: cached.detected };
  const box = await detectFace(canvas);
  const result = box ? { crop: cropFromFaceBox(box, canvas.width, canvas.height), detected: true } : { crop: heuristicCrop(canvas.width, canvas.height), detected: false };
  if (box) {
    autoCrops[url] = { ...result.crop, detected: true };
    save('skf.faceAutoCrops', autoCrops);
  }
  return result;
}

/** Square crop around the face for the face mesh (the head fills most of it). */
function meshCropCanvas(src: HTMLCanvasElement, c: Crop): HTMLCanvasElement {
  const W = src.width;
  const H = src.height;
  const side = c.h * H * 1.15;
  const cx = c.cx * W;
  const cy = c.cy * H + c.h * H * 0.08;
  const out = document.createElement('canvas');
  out.width = MESH_SIZE;
  out.height = MESH_SIZE;
  const g = out.getContext('2d', { willReadFrequently: true })!;
  g.fillStyle = edgeColor(src);
  g.fillRect(0, 0, MESH_SIZE, MESH_SIZE);
  g.drawImage(src, cx - side / 2, cy - side / 2, side, side, 0, 0, MESH_SIZE, MESH_SIZE);
  return out;
}

/** Average cheek colour: the skin tone for the neck, hands and skull around the photo face. */
function sampleSkin(c: HTMLCanvasElement, m: FaceMeshData): number {
  const g = c.getContext('2d', { willReadFrequently: true })!;
  let r = 0;
  let gr = 0;
  let b = 0;
  let n = 0;
  for (const i of CHEEK_POINTS) {
    const x = Math.round(m.uv[i * 2] * c.width);
    const y = Math.round(m.uv[i * 2 + 1] * c.height);
    const d = g.getImageData(Math.max(0, x - 3), Math.max(0, y - 3), 7, 7).data;
    for (let k = 0; k < d.length; k += 4) {
      r += d[k];
      gr += d[k + 1];
      b += d[k + 2];
      n++;
    }
  }
  if (!n) return 0xd9a27c;
  return (Math.round(r / n) << 16) | (Math.round(gr / n) << 8) | Math.round(b / n);
}

/** Reconstructs the 3D face for an entry (cached per photo and crop). */
async function attachMesh(entry: FaceEntry): Promise<void> {
  const canvas = meshCropCanvas(entry.image, entry.crop);
  const c = entry.crop;
  const key = `${entry.source.url}|${c.cx.toFixed(3)},${c.cy.toFixed(3)},${c.h.toFixed(3)}`;
  const cacheable = entry.source.kind === 'wiki';
  let data = cacheable && meshCache[key] ? decodeMesh(meshCache[key]) : null;
  if (!data) {
    data = await meshFace(canvas);
    if (data && cacheable) {
      meshCache[key] = encodeMesh(data);
      save('skf.faceMesh.v1', meshCache);
    }
  }
  entry.meshCanvas = canvas;
  entry.mesh = data;
  entry.skin = data ? sampleSkin(canvas, data) : null;
  if (entry.meshTexture) {
    entry.meshTexture.image = canvas;
    entry.meshTexture.needsUpdate = true;
  }
}

async function makeEntry(def: CharacterDef, source: FaceSource, imgUrl: string): Promise<FaceEntry> {
  const img = await loadImage(imgUrl);
  const canvas = toCanvas(img);
  // Throws if the image is cross-origin tainted, so we never keep an unusable face.
  canvas.getContext('2d')!.getImageData(0, 0, 1, 1);
  const { crop: auto, detected } = await autoCrop(canvas, source.url);
  const user = userCrops[def.id];
  const crop = user && user.url === source.url ? { cx: user.cx, cy: user.cy, h: user.h } : auto;
  const entry: FaceEntry = {
    id: def.id, image: canvas, source, crop, auto, detected, head: document.createElement('canvas'), portrait: '', texture: null,
    meshCanvas: null, mesh: null, meshTexture: null, skin: null,
  };
  render(entry, def);
  await attachMesh(entry);
  return entry;
}

// ------------------------------------------------------------------ uploads (IndexedDB)

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('skf-faces', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('uploads');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbAll(): Promise<Record<string, Blob>> {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const out: Record<string, Blob> = {};
    const tx = db.transaction('uploads', 'readonly');
    const cur = tx.objectStore('uploads').openCursor();
    cur.onsuccess = () => {
      const c = cur.result;
      if (c) {
        out[String(c.key)] = c.value as Blob;
        c.continue();
      } else resolve(out);
    };
    cur.onerror = () => reject(cur.error);
  });
}

async function idbPut(id: string, blob: Blob | null): Promise<void> {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('uploads', 'readwrite');
    const store = tx.objectStore('uploads');
    if (blob) store.put(blob, id);
    else store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ------------------------------------------------------------------ loading

async function lookupWiki(defs: CharacterDef[]): Promise<void> {
  const found = new Map<string, PageImage & { host: string }>();
  // English Wikipedia first, then Hebrew Wikipedia for anyone still missing a photo.
  const passes: { host: string; title: (d: CharacterDef) => string }[] = [
    { host: 'en.wikipedia.org', title: (d) => WIKI_TITLES[d.id] ?? d.name },
    { host: 'he.wikipedia.org', title: (d) => d.nameHe },
  ];
  for (const { host, title } of passes) {
    const list = defs.filter((d) => !found.has(d.id));
    if (!list.length) continue;
    for (let i = 0; i < list.length; i += 45) {
      const chunk = list.slice(i, i + 45);
      const titles = chunk.map(title);
      try {
        const parsed = parsePageImages((await fetchJson(pageImagesUrl(host, titles))) as never, titles);
        chunk.forEach((d, k) => {
          const p = parsed[titles[k]];
          if (p) found.set(d.id, { ...p, host });
        });
      } catch (e) {
        console.warn(`Wikipedia lookup failed on ${host}`, e);
      }
    }
  }
  // Licence metadata, grouped by host.
  const licenses = new Map<string, ImageLicense>();
  for (const host of ['en.wikipedia.org', 'he.wikipedia.org']) {
    const files = [...new Set([...found.values()].filter((f) => f.host === host).map((f) => f.file))];
    for (let i = 0; i < files.length; i += 45) {
      try {
        const info = parseImageInfo((await fetchJson(imageInfoUrl(host, files.slice(i, i + 45)))) as never);
        for (const [k, v] of Object.entries(info)) licenses.set(`${host}:${k}`, v);
      } catch (e) {
        console.warn('Licence lookup failed', e);
      }
    }
  }
  for (const d of defs) {
    const p = found.get(d.id);
    if (!p) continue;
    const lic = licenses.get(`${p.host}:${fileKey(p.file)}`);
    // pageimages is already restricted to free images; the licence check is a second guard.
    if (lic && lic.license && !isFreeLicense(lic.license)) continue;
    wikiInfo.set(d.id, {
      kind: 'wiki',
      url: p.thumb,
      file: p.file,
      license: lic?.license || 'Free licence (see file page)',
      licenseUrl: lic?.licenseUrl,
      artist: lic?.artist || 'Wikimedia Commons contributor',
      descUrl: lic?.descUrl || `https://${p.host}/wiki/File:${encodeURIComponent(fileKey(p.file))}`,
      pageUrl: `https://${p.host}/wiki/${encodeURIComponent(p.pageTitle.replace(/ /g, '_'))}`,
    });
  }
}

/** Fetches and prepares all faces. Safe to call once at boot; never throws. */
export async function loadFaces(defs: CharacterDef[], onProgress?: (done: number, total: number) => void): Promise<number> {
  const total = defs.length;
  let done = 0;
  let uploads: Record<string, Blob> = {};
  try {
    uploads = await idbAll();
  } catch {
    /* no IndexedDB */
  }
  try {
    await lookupWiki(defs);
  } catch (e) {
    console.warn('Photo lookup failed; using cartoon faces.', e);
  }
  const queue = [...defs];
  const worker = async () => {
    for (;;) {
      const def = queue.shift();
      if (!def) return;
      try {
        const up = uploads[def.id];
        if (up) {
          const url = URL.createObjectURL(up);
          faces.set(def.id, await makeEntry(def, { kind: 'upload', url: `upload:${def.id}` }, url));
        } else {
          const w = wikiInfo.get(def.id);
          if (w) faces.set(def.id, await makeEntry(def, w, w.url));
        }
      } catch (e) {
        console.warn(`No photo face for ${def.id}`, e);
      }
      done++;
      onProgress?.(done, total);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  version++;
  return faces.size;
}

// ------------------------------------------------------------------ editing

export function setCrop(def: CharacterDef, crop: Crop): void {
  const e = faces.get(def.id);
  if (!e) return;
  e.crop = { cx: crop.cx, cy: crop.cy, h: Math.max(0.05, Math.min(3, crop.h)) };
  userCrops[def.id] = { ...e.crop, url: e.source.url };
  save('skf.faceCrops', userCrops);
  render(e, def);
  version++;
  scheduleMesh(e);
}

/** Re-runs the 3D reconstruction after a crop edit, debounced while the player drags. */
const meshTimers = new Map<string, ReturnType<typeof setTimeout>>();
function scheduleMesh(e: FaceEntry): void {
  clearTimeout(meshTimers.get(e.id));
  meshTimers.set(e.id, setTimeout(() => {
    attachMesh(e).then(() => version++).catch(() => undefined);
  }, 400));
}

export function resetCrop(def: CharacterDef): void {
  const e = faces.get(def.id);
  if (!e) return;
  delete userCrops[def.id];
  save('skf.faceCrops', userCrops);
  e.crop = { ...e.auto };
  render(e, def);
  version++;
  scheduleMesh(e);
}

export async function uploadFace(def: CharacterDef, file: Blob): Promise<boolean> {
  try {
    await idbPut(def.id, file).catch(() => undefined);
    const url = URL.createObjectURL(file);
    delete userCrops[def.id];
    save('skf.faceCrops', userCrops);
    const entry = await makeEntry(def, { kind: 'upload', url: `upload:${def.id}:${Date.now()}` }, url);
    const old = faces.get(def.id);
    if (old?.texture) {
      entry.texture = old.texture;
      entry.texture.image = entry.head;
      entry.texture.needsUpdate = true;
    }
    faces.set(def.id, entry);
    setFaceDisabled(def.id, false);
    version++;
    return true;
  } catch (e) {
    console.warn('Upload failed', e);
    return false;
  }
}

export async function removeUpload(def: CharacterDef): Promise<void> {
  await idbPut(def.id, null).catch(() => undefined);
  delete userCrops[def.id];
  save('skf.faceCrops', userCrops);
  const w = wikiInfo.get(def.id);
  const old = faces.get(def.id);
  faces.delete(def.id);
  if (w) {
    try {
      const entry = await makeEntry(def, w, w.url);
      if (old?.texture) {
        entry.texture = old.texture;
        entry.texture.image = entry.head;
        entry.texture.needsUpdate = true;
      }
      faces.set(def.id, entry);
    } catch {
      /* stays cartoon */
    }
  }
  version++;
}
