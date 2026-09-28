// Face detection via MediaPipe (loaded lazily from the jsDelivr CDN). Falls back gracefully if
// the CDN is unreachable: callers then use a heuristic crop.

const MP_VERSION = '0.4.1646425229';
const MP_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${MP_VERSION}/`;

export interface FaceBox {
  xCenter: number;
  yCenter: number;
  width: number;
  height: number;
  score: number;
}

interface MpDetection {
  boundingBox: { xCenter: number; yCenter: number; width: number; height: number };
}

interface MpResults {
  detections: MpDetection[];
}

interface MpFaceDetection {
  setOptions(o: { model?: string; minDetectionConfidence?: number; selfieMode?: boolean }): void;
  onResults(cb: (r: MpResults) => void): void;
  initialize(): Promise<void>;
  send(i: { image: HTMLCanvasElement | HTMLImageElement }): Promise<void>;
  close(): Promise<void>;
}

type MpCtor = new (cfg: { locateFile: (f: string) => string }) => MpFaceDetection;

let detectorPromise: Promise<MpFaceDetection | null> | null = null;
let pending: ((r: MpResults) => void) | null = null;
let currentModel = '';
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

async function getDetector(): Promise<MpFaceDetection | null> {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      try {
        const g = window as unknown as { FaceDetection?: MpCtor };
        if (!g.FaceDetection) await loadScript(`${MP_BASE}face_detection.js`, 15000);
        if (!g.FaceDetection) return null;
        const fd = new g.FaceDetection({ locateFile: (f) => `${MP_BASE}${f}` });
        fd.onResults((r) => {
          const cb = pending;
          pending = null;
          cb?.(r);
        });
        // Full-range model: handles both close-up portraits and small faces in wider shots.
        fd.setOptions({ model: 'full', minDetectionConfidence: 0.4 });
        currentModel = 'full';
        await withTimeout(fd.initialize(), 25000);
        return fd;
      } catch (e) {
        console.warn('Face detector unavailable, using heuristic crops.', e);
        return null;
      }
    })();
  }
  return detectorPromise;
}

async function runOnce(fd: MpFaceDetection, image: HTMLCanvasElement, model: string): Promise<MpDetection[]> {
  if (currentModel !== model) {
    fd.setOptions({ model, minDetectionConfidence: 0.45 });
    currentModel = model;
  }
  const res = await withTimeout(
    new Promise<MpResults>((resolve) => {
      pending = resolve;
      fd.send({ image }).catch(() => resolve({ detections: [] }));
    }),
    8000,
  );
  return res.detections ?? [];
}

/** The legacy bundle is minified, so the confidence lives in an obfuscated field: find it generically. */
function scoreOf(d: MpDetection, rank: number): number {
  for (const [k, v] of Object.entries(d)) {
    if (k === 'boundingBox' || k === 'landmarks' || !Array.isArray(v) || !v.length) continue;
    for (const [kk, x] of Object.entries(v[0] as Record<string, unknown>)) {
      if (kk !== 'index' && typeof x === 'number' && x > 0 && x <= 1) return x;
    }
  }
  // Detections come back sorted by confidence; fall back to that order.
  return 1 - rank * 0.01;
}

/** Most confident face (false positives on patterns such as badges usually score lower). */
function pickBest(dets: MpDetection[]): FaceBox | null {
  let best: FaceBox | null = null;
  dets.forEach((d, i) => {
    const b = d.boundingBox;
    const score = scoreOf(d, i);
    if (!best || score > best.score) best = { xCenter: b.xCenter, yCenter: b.yCenter, width: b.width, height: b.height, score };
  });
  return best;
}

/** Detects the most prominent face. Returns a normalised box, or null if none / detector unavailable. */
export function detectFace(image: HTMLCanvasElement): Promise<FaceBox | null> {
  const job = queue.then(async () => {
    const fd = await getDetector();
    if (!fd) return null;
    try {
      return pickBest(await runOnce(fd, image, 'full'));
    } catch {
      return null;
    }
  });
  queue = job.catch(() => null);
  return job;
}

export function detectorReady(): Promise<boolean> {
  return getDetector().then((d) => !!d);
}
