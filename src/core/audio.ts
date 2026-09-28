// Procedural audio: synthesized SFX, a small step-sequencer for music, and a speech-synth announcer.

type Mode = 'minor' | 'phrygian' | 'dorian' | 'major';

const SCALES: Record<Mode, number[]> = {
  minor: [0, 2, 3, 5, 7, 8, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
};

const PROGRESSIONS: Record<Mode, number[]> = {
  minor: [0, 5, 2, 6],
  phrygian: [0, 1, 0, 6],
  dorian: [0, 3, 0, 4],
  major: [0, 4, 5, 3],
};

export interface MusicSpec {
  bpm: number;
  root: number;
  mode: Mode;
  intensity: number;
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export class AudioEngine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private sfxBus!: GainNode;
  private musicBus!: GainNode;
  private comp!: DynamicsCompressorNode;
  private noiseBuf!: AudioBuffer;
  private seqTimer: number | null = null;
  private nextNoteTime = 0;
  private step = 0;
  private music: MusicSpec | null = null;
  private musicSeed = 1;
  volumes = { master: 0.8, music: 0.5, sfx: 0.8 };
  announcer = true;
  private voice: SpeechSynthesisVoice | null = null;

  /** Must be called from a user gesture at least once for browsers to allow audio. */
  unlock(): void {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AC();
      } catch {
        return;
      }
      const ctx = this.ctx;
      this.comp = ctx.createDynamicsCompressor();
      this.comp.threshold.value = -14;
      this.comp.ratio.value = 4;
      this.master = ctx.createGain();
      this.sfxBus = ctx.createGain();
      this.musicBus = ctx.createGain();
      this.sfxBus.connect(this.master);
      this.musicBus.connect(this.master);
      this.master.connect(this.comp);
      this.comp.connect(ctx.destination);
      this.applyVolumes();
      const len = ctx.sampleRate;
      this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.pickVoice();
      if (this.music) this.startSequencer();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => undefined);
  }

  get running(): boolean {
    return !!this.ctx && this.ctx.state === 'running';
  }

  applyVolumes(): void {
    if (!this.ctx) return;
    this.master.gain.value = this.volumes.master;
    this.sfxBus.gain.value = this.volumes.sfx;
    this.musicBus.gain.value = this.volumes.music * 0.55;
  }

  private pickVoice(): void {
    if (!('speechSynthesis' in window)) return;
    const choose = () => {
      const vs = speechSynthesis.getVoices();
      this.voice = vs.find((v) => /en[-_](US|GB)/i.test(v.lang) && /male|david|daniel|george|guy|fred/i.test(v.name)) ?? vs.find((v) => /^en/i.test(v.lang)) ?? null;
    };
    choose();
    speechSynthesis.onvoiceschanged = choose;
  }

  say(text: string): void {
    if (!this.announcer || !('speechSynthesis' in window) || this.volumes.master * this.volumes.sfx <= 0.01) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (this.voice) u.voice = this.voice;
      u.rate = 0.95;
      u.pitch = 0.55;
      u.volume = Math.min(1, this.volumes.master * this.volumes.sfx * 1.2);
      speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }

  // ---------------------------------------------------------------- primitives

  private env(g: GainNode, t: number, a: number, peak: number, d: number): void {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  private tone(type: OscillatorType, f0: number, f1: number, dur: number, vol: number, bus: GainNode, when = 0, attack = 0.005): void {
    const ctx = this.ctx!;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    this.env(g, t, attack, vol, dur);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + attack + dur + 0.05);
  }

  private noise(dur: number, vol: number, filter: BiquadFilterType, f0: number, f1: number, q: number, bus: GainNode, when = 0): void {
    const ctx = this.ctx!;
    const t = ctx.currentTime + when;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const bq = ctx.createBiquadFilter();
    bq.type = filter;
    bq.frequency.setValueAtTime(f0, t);
    bq.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    bq.Q.value = q;
    const g = ctx.createGain();
    this.env(g, t, 0.003, vol, dur);
    src.connect(bq).connect(g).connect(bus);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
  }

  // ---------------------------------------------------------------- sfx

  sfx(name: string, pitch = 1): void {
    if (!this.running) return;
    const b = this.sfxBus;
    switch (name) {
      case 'whoosh':
        this.noise(0.12, 0.25, 'bandpass', 900 * pitch, 3000 * pitch, 1.5, b);
        break;
      case 'whooshHeavy':
        this.noise(0.2, 0.35, 'bandpass', 500, 1800, 1.2, b);
        break;
      case 'hitLight':
        this.noise(0.07, 0.6, 'lowpass', 4000, 800, 0.8, b);
        this.tone('sine', 220 * pitch, 90, 0.08, 0.5, b);
        break;
      case 'hitHeavy':
        this.noise(0.16, 0.8, 'lowpass', 3000, 300, 0.8, b);
        this.tone('sine', 140 * pitch, 50, 0.2, 0.9, b);
        this.tone('square', 90, 40, 0.1, 0.15, b);
        break;
      case 'hitSuper':
        this.noise(0.3, 0.9, 'lowpass', 5000, 200, 0.6, b);
        this.tone('sine', 120, 35, 0.35, 1, b);
        this.tone('sawtooth', 300, 60, 0.25, 0.2, b);
        break;
      case 'block':
        this.tone('square', 1400, 900, 0.04, 0.18, b);
        this.noise(0.06, 0.3, 'highpass', 2500, 1500, 1, b);
        break;
      case 'jump':
        this.tone('sine', 300, 520, 0.08, 0.12, b);
        break;
      case 'land':
        this.tone('sine', 110, 60, 0.08, 0.3, b);
        break;
      case 'landHard':
        this.noise(0.2, 0.5, 'lowpass', 900, 120, 0.7, b);
        this.tone('sine', 80, 35, 0.25, 0.8, b);
        break;
      case 'special':
        this.tone('sawtooth', 220 * pitch, 660 * pitch, 0.18, 0.12, b);
        this.noise(0.2, 0.2, 'bandpass', 800, 3000, 2, b);
        break;
      case 'projectile':
        this.tone('square', 660 * pitch, 220 * pitch, 0.18, 0.1, b);
        break;
      case 'superFlash':
        this.noise(0.6, 0.4, 'bandpass', 400, 4000, 1.5, b);
        [0, 4, 7, 12].forEach((n, i) => this.tone('sawtooth', midi(57 + n), midi(57 + n + 12), 0.5, 0.08, b, i * 0.04));
        break;
      case 'ko':
        this.noise(1.2, 0.8, 'lowpass', 2000, 60, 0.5, b);
        this.tone('sine', 90, 25, 1.2, 1, b);
        break;
      case 'grab':
        this.noise(0.1, 0.4, 'bandpass', 600, 300, 1, b);
        this.tone('sine', 160, 90, 0.1, 0.4, b);
        break;
      case 'tech':
        this.tone('triangle', 1600, 1200, 0.15, 0.3, b);
        this.tone('triangle', 2100, 1700, 0.15, 0.2, b, 0.02);
        break;
      case 'shield':
        this.tone('sine', 1800, 1200, 0.25, 0.25, b);
        break;
      case 'reflect':
        this.tone('triangle', 900, 1800, 0.15, 0.3, b);
        break;
      case 'armor':
        this.tone('square', 300, 200, 0.1, 0.2, b);
        this.tone('triangle', 2400, 2000, 0.2, 0.15, b);
        break;
      case 'teleport':
        this.tone('sine', 400, 1600, 0.12, 0.2, b);
        this.tone('sine', 1600, 400, 0.12, 0.2, b, 0.12);
        break;
      case 'buff':
        [0, 4, 7].forEach((n, i) => this.tone('triangle', midi(72 + n), midi(72 + n), 0.12, 0.12, b, i * 0.05));
        break;
      case 'lifeline':
        this.tone('sine', 70, 50, 0.12, 0.8, b);
        this.tone('sine', 70, 50, 0.12, 0.8, b, 0.2);
        [0, 7, 12].forEach((n, i) => this.tone('triangle', midi(76 + n), midi(76 + n), 0.3, 0.15, b, 0.4 + i * 0.08));
        break;
      case 'clash':
        this.tone('square', 900, 500, 0.12, 0.2, b);
        this.noise(0.15, 0.4, 'bandpass', 2000, 800, 2, b);
        break;
      case 'counter':
        this.tone('sawtooth', 500, 1500, 0.1, 0.2, b);
        break;
      case 'menuMove':
        this.tone('square', 880, 880, 0.035, 0.07, b);
        break;
      case 'menuConfirm':
        this.tone('square', 880, 880, 0.05, 0.08, b);
        this.tone('square', 1320, 1320, 0.08, 0.08, b, 0.05);
        break;
      case 'menuBack':
        this.tone('square', 660, 440, 0.08, 0.07, b);
        break;
      case 'select':
        this.tone('sawtooth', 440, 880, 0.12, 0.12, b);
        this.noise(0.2, 0.2, 'highpass', 3000, 6000, 1, b);
        break;
      case 'round':
        this.tone('triangle', 523, 523, 0.25, 0.2, b);
        break;
      case 'crowd':
        this.noise(1.2, 0.18, 'bandpass', 900, 700, 0.6, b);
        break;
    }
  }

  // ---------------------------------------------------------------- music

  playMusic(spec: MusicSpec | null, seed = 1): void {
    this.music = spec;
    this.musicSeed = seed;
    this.stopSequencer();
    if (spec && this.ctx) this.startSequencer();
  }

  private stopSequencer(): void {
    if (this.seqTimer !== null) {
      clearInterval(this.seqTimer);
      this.seqTimer = null;
    }
  }

  private startSequencer(): void {
    if (!this.ctx || !this.music) return;
    this.stopSequencer();
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.seqTimer = window.setInterval(() => this.schedule(), 25);
  }

  private rnd(n: number): number {
    const x = Math.sin(n * 12.9898 + this.musicSeed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  private schedule(): void {
    const ctx = this.ctx;
    const m = this.music;
    if (!ctx || !m) return;
    const stepDur = 60 / m.bpm / 4;
    while (this.nextNoteTime < ctx.currentTime + 0.12) {
      this.playStep(this.step, this.nextNoteTime - ctx.currentTime, m);
      this.nextNoteTime += stepDur;
      this.step++;
    }
  }

  private playStep(step: number, when: number, m: MusicSpec): void {
    const s = step % 16;
    const bar = Math.floor(step / 16) % 4;
    const scale = SCALES[m.mode];
    const deg = PROGRESSIONS[m.mode][bar];
    const chordRoot = m.root + scale[deg % 7] + (deg >= 7 ? 12 : 0);
    const note = (d: number, oct = 0) => {
      const idx = deg + d;
      return m.root + scale[((idx % 7) + 7) % 7] + 12 * Math.floor(idx / 7) + oct * 12;
    };
    const w = Math.max(0, when);
    // Drums
    if (s % 4 === 0) this.kick(w);
    if (s === 4 || s === 12) this.snare(w);
    if (m.intensity > 0.85 && s === 14) this.snare(w, 0.5);
    this.hat(w, s % 2 === 0 ? 0.08 : 0.04);
    // Bass: driving eighths with octave jumps
    if (s % 2 === 0) {
      const oct = s % 8 === 6 ? 12 : 0;
      this.voiceNote('sawtooth', midi(chordRoot - 12 + oct), 60 / m.bpm / 2 * 0.9, 0.12, w, 700);
    }
    // Lead: arpeggio / melody generated from the seed
    const phrase = Math.floor(step / 64);
    if (this.rnd(s + phrase * 16 + bar * 3) < 0.45 + m.intensity * 0.25) {
      const d = [0, 2, 4, 7, 4, 2, 5, 3][Math.floor(this.rnd(s * 7 + phrase) * 8)];
      this.voiceNote('square', midi(note(d, 1) + 12), 60 / m.bpm / 4 * 0.8, 0.045, w, 3200);
    }
    // Pad chord on the downbeat
    if (s === 0) {
      for (const d of [0, 2, 4]) this.voiceNote('triangle', midi(note(d)), 60 / m.bpm * 3.6, 0.035, w, 1800, 0.08);
    }
  }

  private voiceNote(type: OscillatorType, f: number, dur: number, vol: number, when: number, cutoff: number, attack = 0.005): void {
    const ctx = this.ctx!;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = cutoff;
    const g = ctx.createGain();
    this.env(g, t, attack, vol, dur);
    o.connect(lp).connect(g).connect(this.musicBus);
    o.start(t);
    o.stop(t + attack + dur + 0.05);
  }

  private kick(when: number): void {
    const ctx = this.ctx!;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    this.env(g, t, 0.002, 0.5, 0.16);
    o.connect(g).connect(this.musicBus);
    o.start(t);
    o.stop(t + 0.2);
  }

  private snare(when: number, vol = 0.8): void {
    this.noise(0.12, 0.28 * vol, 'bandpass', 1800, 1200, 0.9, this.musicBus, when);
    this.tone('triangle', 220, 160, 0.06, 0.12 * vol, this.musicBus, when);
  }

  private hat(when: number, vol: number): void {
    this.noise(0.03, vol, 'highpass', 7000, 9000, 1, this.musicBus, when);
  }
}
