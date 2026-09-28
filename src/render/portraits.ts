// Renders head-and-shoulders portraits for the character select grid.

import * as THREE from 'three';
import type { CharacterDef } from '../game/characterTypes';
import { PARTIES } from '../data/parties';
import { applyStaticPose } from './animator';
import { buildCharacter, disposeRig } from './characterModel';

const cache = new Map<string, string>();

export function getPortrait(id: string): string | undefined {
  return cache.get(id);
}

export async function renderPortraits(defs: CharacterDef[], onProgress?: (done: number, total: number) => void): Promise<void> {
  const size = 192;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch {
    return;
  }
  renderer.setSize(size, size, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x445066, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(1.5, 2.5, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xaaccff, 1.6);
  rim.position.set(-2, 1.5, -2);
  scene.add(rim);
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 20);

  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    if (cache.has(def.id)) continue;
    const rig = buildCharacter(def);
    applyStaticPose(rig, 'stand');
    rig.root.rotation.y = 0.35;
    scene.add(rig.root);
    rig.root.updateMatrixWorld(true);
    const headPos = new THREE.Vector3();
    rig.head.getWorldPosition(headPos);
    headPos.y += 0.1 * def.look.height;
    camera.position.set(headPos.x + 0.25, headPos.y + 0.05, headPos.z + 1.35);
    camera.lookAt(headPos.x, headPos.y - 0.08, headPos.z);
    const party = PARTIES[def.party];
    renderer.setClearColor(party.color, 1);
    renderer.render(scene, camera);
    cache.set(def.id, canvas.toDataURL('image/png'));
    scene.remove(rig.root);
    disposeRig(rig);
    onProgress?.(i + 1, defs.length);
    if (i % 4 === 3) await new Promise((r) => setTimeout(r, 0));
  }
  renderer.dispose();
  renderer.forceContextLoss();
}
