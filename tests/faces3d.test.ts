import { describe, expect, it } from 'vitest';
import { decodeMesh, encodeMesh } from '../src/render/faceMesh';
import { CHEEK_POINTS, FACE_OVAL, FACE_POINTS, faceTriangles } from '../src/render/faceTopology';

describe('3D face data', () => {
  it('embeds the canonical face-mesh triangulation', () => {
    const t = faceTriangles();
    expect(t.length).toBe(898 * 3);
    expect(Math.max(...t)).toBe(FACE_POINTS - 1);
    // Every vertex is used by at least one triangle.
    expect(new Set(t).size).toBe(FACE_POINTS);
  });

  it('has a closed face-oval loop made of mesh edges', () => {
    const t = faceTriangles();
    const edges = new Set<string>();
    for (let i = 0; i < t.length; i += 3) {
      for (const [a, b] of [[t[i], t[i + 1]], [t[i + 1], t[i + 2]], [t[i + 2], t[i]]]) edges.add(`${Math.min(a, b)}-${Math.max(a, b)}`);
    }
    for (let i = 0; i < FACE_OVAL.length; i++) {
      const a = FACE_OVAL[i];
      const b = FACE_OVAL[(i + 1) % FACE_OVAL.length];
      expect(edges.has(`${Math.min(a, b)}-${Math.max(a, b)}`)).toBe(true);
    }
    for (const p of CHEEK_POINTS) expect(p).toBeLessThan(FACE_POINTS);
  });

  it('round-trips reconstructions through the compact cache encoding', () => {
    const pos = new Float32Array(468 * 3).map((_, i) => Math.sin(i) * 9.5);
    const uv = new Float32Array(468 * 2).map((_, i) => (i % 97) / 97);
    const back = decodeMesh(encodeMesh({ pos, uv }))!;
    expect(back).not.toBeNull();
    for (let i = 0; i < pos.length; i++) expect(back.pos[i]).toBeCloseTo(pos[i], 2);
    for (let i = 0; i < uv.length; i++) expect(Math.abs(back.uv[i] - uv[i])).toBeLessThan(1e-4);
    expect(decodeMesh('not-base64!')).toBeNull();
  });
});
