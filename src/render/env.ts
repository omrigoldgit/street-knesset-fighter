// Image-based lighting: prefiltered environment maps built from tiny procedural scenes, so PBR
// materials get believable reflections and ambient light without downloading HDR files.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface EnvSpec {
  top: number;
  horizon: number;
  bottom: number;
  /** Bright emitters baked into the environment (sun, windows, ceiling lights). */
  lights?: { dir: [number, number, number]; color: number; intensity: number; size: number }[];
}

const SKY_VERT = 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const SKY_FRAG = `uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; varying vec3 vP;
  void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.5)) : mix(horizon, bottom, pow(-h, 0.35));
  gl_FragColor = vec4(c, 1.0); }`;

export class EnvBuilder {
  private pmrem: THREE.PMREMGenerator;
  private cache = new Map<string, THREE.Texture>();

  constructor(renderer: THREE.WebGLRenderer) {
    this.pmrem = new THREE.PMREMGenerator(renderer);
  }

  /** Neutral studio lighting for menus. */
  studio(): THREE.Texture {
    let t = this.cache.get('studio');
    if (!t) {
      const room = new RoomEnvironment();
      t = this.pmrem.fromScene(room, 0.04).texture;
      room.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        (m.material as THREE.Material | undefined)?.dispose();
      });
      this.cache.set('studio', t);
    }
    return t;
  }

  fromSpec(key: string, spec: EnvSpec): THREE.Texture {
    const hit = this.cache.get(key);
    if (hit) return hit;
    const scene = new THREE.Scene();
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: { top: { value: new THREE.Color(spec.top) }, horizon: { value: new THREE.Color(spec.horizon) }, bottom: { value: new THREE.Color(spec.bottom) } },
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
      }),
    );
    scene.add(sky);
    for (const l of spec.lights ?? []) {
      const d = new THREE.Vector3(...l.dir).normalize();
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(l.size, l.size), new THREE.MeshBasicMaterial({ color: new THREE.Color(l.color).multiplyScalar(l.intensity), side: THREE.DoubleSide }));
      panel.position.copy(d.multiplyScalar(40));
      panel.lookAt(0, 0, 0);
      scene.add(panel);
    }
    const t = this.pmrem.fromScene(scene, 0.03).texture;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      (m.material as THREE.Material | undefined)?.dispose();
    });
    this.cache.set(key, t);
    return t;
  }
}
