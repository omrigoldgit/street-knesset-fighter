import * as THREE from 'three';

/**
 * Standard PBR material used by stages and props (the name is historical: everything used to be
 * cel-shaded). Rough, non-metallic by default.
 */
export function toon(color: number, opts: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0, ...opts });
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
