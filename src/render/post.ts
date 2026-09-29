// Post-processing chain: HDR render (MSAA) → ambient occlusion → bloom → tone mapping → grade.
// The grade pass adds a vignette, contrast/saturation, and short impact pulses (chromatic
// aberration and flash) that the renderer fires on heavy hits.

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import type { Quality } from '../core/settings';

const GradeShader = {
  name: 'GradeShader',
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    vignette: { value: 0.32 },
    saturation: { value: 1.08 },
    contrast: { value: 1.06 },
    aberration: { value: 0.0 },
    flash: { value: 0.0 },
    flashColor: { value: new THREE.Color(1, 1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float vignette, saturation, contrast, aberration, flash;
    uniform vec3 flashColor;
    varying vec2 vUv;
    void main() {
      vec2 d = vUv - 0.5;
      vec2 off = d * aberration * length(d);
      vec3 c = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(l), c, saturation);
      c = (c - 0.5) * contrast + 0.5;
      float v = smoothstep(0.9, 0.25, length(d * vec2(1.0, 0.8)));
      c *= mix(1.0 - vignette, 1.0, v);
      c = mix(c, flashColor, flash);
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`,
};

export class PostFX {
  composer: EffectComposer;
  private renderPass: RenderPass;
  private gtao: GTAOPass;
  private bloom: UnrealBloomPass;
  private grade: ShaderPass;
  private aberration = 0;
  private flash = 0;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(renderer, target);
    this.renderPass = new RenderPass(scene, camera);
    this.gtao = new GTAOPass(scene, camera, size.x, size.y);
    this.gtao.blendIntensity = 0.85;
    this.gtao.updateGtaoMaterial({ radius: 0.35, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 12 });
    this.gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
    // Glowing effects (sparks, strike trails, auras) are see-through: keep them out of the AO
    // pre-pass, which would otherwise treat them as solid and darken them.
    const ao = this.gtao as unknown as { _overrideVisibility(): void; _visibilityCache: THREE.Object3D[] };
    const hideLines = ao._overrideVisibility.bind(ao);
    ao._overrideVisibility = () => {
      hideLines();
      scene.traverse((o) => {
        const mat = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (o.visible && (o as THREE.Mesh).isMesh && mat && !Array.isArray(mat) && mat.transparent && !mat.depthWrite) {
          o.visible = false;
          ao._visibilityCache.push(o);
        }
      });
    };
    this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.42, 0.38, 0.86);
    this.grade = new ShaderPass(GradeShader);
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.gtao);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.composer.addPass(this.grade);
  }

  setQuality(q: Quality): void {
    this.gtao.enabled = q === 'ultra';
    this.bloom.enabled = q !== 'low';
  }

  setSize(w: number, h: number, pixelRatio: number): void {
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(w, h);
  }

  /** Stage mood: bloom strength and grading. */
  setLook(look: { bloom?: number; threshold?: number; vignette?: number; saturation?: number; contrast?: number }): void {
    this.bloom.strength = look.bloom ?? 0.42;
    this.bloom.threshold = look.threshold ?? 0.86;
    const u = this.grade.uniforms;
    u.vignette.value = look.vignette ?? 0.32;
    u.saturation.value = look.saturation ?? 1.08;
    u.contrast.value = look.contrast ?? 1.06;
  }

  /** Impact pulse: chromatic aberration and an optional flash, decaying over a few frames. */
  pulse(aberration: number, flash = 0, color = 0xffffff): void {
    this.aberration = Math.max(this.aberration, aberration);
    if (flash > this.flash) {
      this.flash = flash;
      (this.grade.uniforms.flashColor.value as THREE.Color).setHex(color);
    }
  }

  render(dt: number): void {
    const k = Math.pow(0.001, dt * 4);
    this.aberration *= k;
    this.flash *= Math.pow(0.0005, dt * 5);
    this.grade.uniforms.aberration.value = this.aberration;
    this.grade.uniforms.flash.value = this.flash;
    this.composer.render(dt);
  }

  dispose(): void {
    this.composer.dispose();
  }
}
