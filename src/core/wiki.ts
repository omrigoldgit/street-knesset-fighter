// Wikipedia / Wikimedia helpers for fetching each MK's freely licensed lead photo.
// Pure functions (no DOM) so they can be unit tested.

/** English Wikipedia article titles. Hebrew Wikipedia (nameHe) is used as a fallback. */
export const WIKI_TITLES: Record<string, string> = {
  netanyahu: 'Benjamin Netanyahu',
  levin: 'Yariv Levin',
  'israel-katz': 'Israel Katz',
  ohana: 'Amir Ohana',
  regev: 'Miri Regev',
  amsalem: 'David Amsalem',
  barkat: 'Nir Barkat',
  gotliv: 'Tally Gotliv',
  karhi: 'Shlomo Karhi',
  'may-golan': 'May Golan',
  edelstein: 'Yuli Edelstein',
  saar: "Gideon Sa'ar",
  dichter: 'Avi Dichter',
  silman: 'Idit Silman',
  'ofir-katz': 'Ofir Katz',
  kisch: 'Yoav Kisch',
  lapid: 'Yair Lapid',
  'ben-ari': 'Meirav Ben-Ari',
  gantz: 'Benny Gantz',
  eisenkot: 'Gadi Eisenkot',
  tropper: 'Hili Tropper',
  'tamano-shata': 'Pnina Tamano-Shata',
  deri: 'Aryeh Deri',
  malchieli: 'Michael Malchieli',
  gafni: 'Moshe Gafni',
  goldknopf: 'Yitzhak Goldknopf',
  smotrich: 'Bezalel Smotrich',
  rothman: 'Simcha Rothman',
  strook: 'Orit Strook',
  'ben-gvir': 'Itamar Ben-Gvir',
  fogel: 'Zvika Fogel',
  maoz: 'Avi Maoz',
  lieberman: 'Avigdor Lieberman',
  forer: 'Oded Forer',
  'mansour-abbas': 'Mansour Abbas',
  odeh: 'Ayman Odeh',
  tibi: 'Ahmad Tibi',
  'touma-sliman': 'Aida Touma-Suleiman',
  kariv: 'Gilad Kariv',
  lazimi: 'Naama Lazimi',
};

export interface PageImage {
  file: string;
  thumb: string;
  width: number;
  height: number;
  pageTitle: string;
}

export interface ImageLicense {
  license: string;
  licenseUrl: string;
  artist: string;
  descUrl: string;
}

const API = (host: string) => `https://${host}/w/api.php`;

export function pageImagesUrl(host: string, titles: string[], size = 640): string {
  const p = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    prop: 'pageimages',
    piprop: 'thumbnail|name',
    pithumbsize: String(size),
    pilicense: 'free',
    redirects: '1',
    titles: titles.join('|'),
  });
  return `${API(host)}?${p}`;
}

interface PageImagesJson {
  query?: {
    normalized?: { from: string; to: string }[];
    redirects?: { from: string; to: string }[];
    pages?: { title: string; missing?: boolean; pageimage?: string; thumbnail?: { source: string; width: number; height: number } }[];
  };
}

/** Maps each requested title to its page image, following normalisation and redirects. */
export function parsePageImages(json: PageImagesJson, requested: string[]): Record<string, PageImage> {
  const q = json.query ?? {};
  const norm = new Map((q.normalized ?? []).map((n) => [n.from, n.to]));
  const redir = new Map((q.redirects ?? []).map((r) => [r.from, r.to]));
  const byTitle = new Map((q.pages ?? []).map((p) => [p.title, p]));
  const out: Record<string, PageImage> = {};
  for (const t of requested) {
    let title = norm.get(t) ?? t;
    for (let i = 0; i < 3 && redir.has(title); i++) title = redir.get(title)!;
    const page = byTitle.get(title);
    if (page && !page.missing && page.pageimage && page.thumbnail?.source) {
      out[t] = { file: page.pageimage, thumb: page.thumbnail.source, width: page.thumbnail.width, height: page.thumbnail.height, pageTitle: page.title };
    }
  }
  return out;
}

export function imageInfoUrl(host: string, files: string[]): string {
  const p = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    prop: 'imageinfo',
    iiprop: 'extmetadata|url',
    iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit',
    titles: files.map((f) => `File:${f}`).join('|'),
  });
  return `${API(host)}?${p}`;
}

interface ImageInfoJson {
  query?: {
    normalized?: { from: string; to: string }[];
    pages?: {
      title: string;
      imageinfo?: { descriptionurl?: string; extmetadata?: Record<string, { value?: string } | undefined> }[];
    }[];
  };
}

export function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Returns license info keyed by file name (without the "File:" prefix, spaces as underscores). */
export function parseImageInfo(json: ImageInfoJson): Record<string, ImageLicense> {
  const out: Record<string, ImageLicense> = {};
  for (const p of json.query?.pages ?? []) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    const m = info.extmetadata ?? {};
    const file = p.title.replace(/^File:/, '').replace(/ /g, '_');
    out[file] = {
      license: stripHtml(m.LicenseShortName?.value ?? ''),
      licenseUrl: stripHtml(m.LicenseUrl?.value ?? ''),
      artist: stripHtml(m.Artist?.value ?? m.Credit?.value ?? 'Unknown'),
      descUrl: info.descriptionurl ?? '',
    };
  }
  return out;
}

export function fileKey(file: string): string {
  return file.replace(/^File:/, '').replace(/ /g, '_');
}

/** Licenses we accept for game assets: CC0, public domain, CC BY, CC BY-SA and similar free licenses. */
export function isFreeLicense(name: string): boolean {
  const n = name.toLowerCase();
  if (!n) return false;
  if (n.includes('nc') || n.includes('nd') || n.includes('fair use') || n.includes('non-free')) return false;
  return n.includes('cc0') || n.includes('public domain') || n.startsWith('pd') || n.includes('cc by') || n.includes('cc-by') || n.includes('attribution') || n.includes('gfdl');
}

// ------------------------------------------------------------------ crop geometry

/** Face crop in normalised image coordinates: centre (cx, cy) and head height h (fraction of image height). */
export interface Crop {
  cx: number;
  cy: number;
  h: number;
}

/** Head crop from a face-detector box (normalised). Expands the box to include hair and chin. */
export function cropFromFaceBox(box: { xCenter: number; yCenter: number; width: number; height: number }, imgW: number, imgH: number): Crop {
  // BlazeFace boxes span roughly brows to chin; heads are ~2x taller including hair.
  const faceHpx = Math.max(box.height * imgH, box.width * imgW * 1.1);
  const h = (faceHpx * 1.95) / imgH;
  return { cx: box.xCenter, cy: box.yCenter - (faceHpx * 0.2) / imgH, h };
}

/** Best guess when no detector is available: politicians' lead photos are usually head-and-shoulders portraits. */
export function heuristicCrop(imgW: number, imgH: number): Crop {
  const aspect = imgW / imgH;
  if (aspect < 0.95) return { cx: 0.5, cy: 0.32, h: Math.min(0.62, 0.55 / aspect * 0.8) };
  if (aspect > 1.3) return { cx: 0.5, cy: 0.36, h: 0.62 };
  return { cx: 0.5, cy: 0.36, h: 0.64 };
}

/** Pixel rectangle for the head texture (4:5 aspect), clamped to stay mostly inside the image. */
export function headRect(c: Crop, imgW: number, imgH: number): { x: number; y: number; w: number; h: number } {
  const h = c.h * imgH;
  const w = h * 0.8;
  return { x: c.cx * imgW - w / 2, y: c.cy * imgH - h / 2, w, h };
}

/** Square head-and-shoulders rectangle for portraits. */
export function portraitRect(c: Crop, imgW: number, imgH: number): { x: number; y: number; s: number } {
  const s = c.h * imgH * 1.35;
  return { x: c.cx * imgW - s / 2, y: c.cy * imgH - s * 0.42, s };
}
