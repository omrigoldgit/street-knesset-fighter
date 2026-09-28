// 3D face reconstruction via MediaPipe Face Mesh (loaded lazily from the jsDelivr CDN). For a
// cropped photo it returns the metric, frontalised face surface (468 points, centimetres) and each
// point's position in the photo, which becomes the texture coordinate. Returns null if the CDN is
// unreachable or no face is found; callers fall back to the photo card or cartoon head.

const FM_VERSION = '0.4.1633559619';
const FM_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${FM_VERSION}/`;

export interface FaceMeshData {
  /** Metric face surface, 468 × (x, y, z) in cm: +x = subject's left, +y up, +z out of the face. */
  pos: Float32Array;
  /** 468 × (u, v) in the input image, normalised, v measured from the top. */
  uv: Float32Array;
}

interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface MpGeometry {
  getMesh(): { getVertexBufferList(): Float32Array };
}

interface MpResults {
  multiFaceLandmarks?: Landmark[][];
  multiFaceGeometry?: MpGeometry[];
}

interface MpFaceMesh {
  setOptions(o: Record<string, unknown>): void;
  onResults(cb: (r: MpResults) => void): void;
  initialize(): Promise<void>;
  send(i: { image: HTMLCanvasElement }): Promise<void>;
}

type MpCtor = new (cfg: { locateFile: (f: string) => string }) => MpFaceMesh;

let meshPromise: Promise<MpFaceMesh | null> | null = null;
let pending: ((r: MpResults) => void) | null = null;
let queue: Promise<unknown> = Promise.resolve();

function loadScript(src: string, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    const t = setTimeout(() => reject(new Error('timeout')), timeoutMs);
    s.onload = () => {
      clearTimeout(t);
      resolve();
    };
    s.onerror = () => {
      clearTimeout(t);
      reject(new Error('load failed'));
    };
    document.head.appendChild(s);
  });
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

async function getMesher(): Promise<MpFaceMesh | null> {
  if (!meshPromise) {
    meshPromise = (async () => {
      try {
        const g = window as unknown as { FaceMesh?: MpCtor };
        if (!g.FaceMesh) await loadScript(`${FM_BASE}face_mesh.js`, 15000);
        if (!g.FaceMesh) return null;
        const fm = new g.FaceMesh({ locateFile: (f) => `${FM_BASE}${f}` });
        fm.onResults((r) => {
          const cb = pending;
          pending = null;
          cb?.(r);
        });
        fm.setOptions({ maxNumFaces: 1, refineLandmarks: false, enableFaceGeometry: true, minDetectionConfidence: 0.3, selfieMode: false });
        await withTimeout(fm.initialize(), 30000);
        return fm;
      } catch (e) {
        console.warn('Face mesh unavailable; photo faces stay flat.', e);
        return null;
      }
    })();
  }
  return meshPromise;
}

/** Reconstructs the face in `image` (ideally a crop with the face filling ~60% of it). */
export function meshFace(image: HTMLCanvasElement): Promise<FaceMeshData | null> {
  const job = queue.then(async () => {
    const fm = await getMesher();
    if (!fm) return null;
    try {
      const res = await withTimeout(
        new Promise<MpResults>((resolve) => {
          pending = resolve;
          fm.send({ image }).catch(() => resolve({}));
        }),
        10000,
      );
      const lm = res.multiFaceLandmarks?.[0];
      const vb = res.multiFaceGeometry?.[0]?.getMesh().getVertexBufferList();
      if (!lm || lm.length < 468 || !vb || vb.length < 468 * 5) return null;
      const pos = new Float32Array(468 * 3);
      const uv = new Float32Array(468 * 2);
      for (let i = 0; i < 468; i++) {
        pos[i * 3] = vb[i * 5];
        pos[i * 3 + 1] = vb[i * 5 + 1];
        pos[i * 3 + 2] = vb[i * 5 + 2];
        uv[i * 2] = lm[i].x;
        uv[i * 2 + 1] = lm[i].y;
      }
      return { pos, uv };
    } catch {
      return null;
    }
  });
  queue = job.catch(() => null);
  return job;
}

// ------------------------------------------------------------------ compact storage

/** Encodes mesh data as base64 Int16 (0.01 cm / 1/30000 precision) for localStorage caching. */
export function encodeMesh(d: FaceMeshData): string {
  const a = new Int16Array(468 * 5);
  for (let i = 0; i < 468 * 3; i++) a[i] = Math.round(Math.max(-327, Math.min(327, d.pos[i])) * 100);
  for (let i = 0; i < 468 * 2; i++) a[468 * 3 + i] = Math.round(Math.max(-1, Math.min(1.09, d.uv[i])) * 30000);
  const bytes = new Uint8Array(a.buffer);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export function decodeMesh(s: string): FaceMeshData | null {
  try {
    const bin = atob(s);
    if (bin.length !== 468 * 5 * 2) return null;
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const a = new Int16Array(bytes.buffer);
    const pos = new Float32Array(468 * 3);
    const uv = new Float32Array(468 * 2);
    for (let i = 0; i < 468 * 3; i++) pos[i] = a[i] / 100;
    for (let i = 0; i < 468 * 2; i++) uv[i] = a[468 * 3 + i] / 30000;
    return { pos, uv };
  } catch {
    return null;
  }
}
