import * as THREE from 'three';

let gradient: THREE.DataTexture | null = null;

/** Three-step toon ramp shared by all characters. */
export function toonGradient(): THREE.DataTexture {
  if (!gradient) {
    const data = new Uint8Array([
      70, 70, 70, 255,
      150, 150, 150, 255,
      215, 215, 215, 255,
      255, 255, 255, 255,
    ]);
    gradient = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
    gradient.minFilter = THREE.NearestFilter;
    gradient.magFilter = THREE.NearestFilter;
    gradient.generateMipmaps = false;
    gradient.needsUpdate = true;
  }
  return gradient;
}

export function toon(color: number, opts: Partial<THREE.MeshToonMaterialParameters> = {}): THREE.MeshToonMaterial {
  return new THREE.MeshToonMaterial({ color, gradientMap: toonGradient(), ...opts });
}

export const OUTLINE_MAT = new THREE.MeshBasicMaterial({ color: 0x07080c, side: THREE.BackSide });

/** Returns a copy of the geometry pushed out along its normals, for inverted-hull outlines. */
export function inflate(geo: THREE.BufferGeometry, amount: number): THREE.BufferGeometry {
  const g = geo.clone();
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  let nrm = g.getAttribute('normal') as THREE.BufferAttribute | undefined;
  if (!nrm) {
    g.computeVertexNormals();
    nrm = g.getAttribute('normal') as THREE.BufferAttribute;
  }
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      pos.getX(i) + nrm.getX(i) * amount,
      pos.getY(i) + nrm.getY(i) * amount,
      pos.getZ(i) + nrm.getZ(i) * amount,
    );
  }
  pos.needsUpdate = true;
  return g;
}

export function shade(color: number, f: number): number {
  const c = new THREE.Color(color);
  c.multiplyScalar(f);
  return c.getHex();
}

export function additive(color: number, opacity = 1): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
