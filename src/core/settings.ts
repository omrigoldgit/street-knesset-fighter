export interface Settings {
  difficulty: number;
  roundsToWin: number;
  roundTime: number;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  announcer: boolean;
  rumble: boolean;
  showHitboxes: boolean;
  inputDisplay: boolean;
  quality: Quality;
  faces: 'photo' | 'cartoon';
}

/** Ultra: ambient occlusion + bloom + MSAA; High: bloom + MSAA; Low: no post-processing or shadows. */
export type Quality = 'ultra' | 'high' | 'low';
export const QUALITIES: Quality[] = ['ultra', 'high', 'low'];
export const QUALITY_NAMES: Record<Quality, string> = { ultra: 'Ultra', high: 'High', low: 'Low' };

export const DEFAULT_SETTINGS: Settings = {
  difficulty: 1,
  roundsToWin: 2,
  roundTime: 99,
  masterVolume: 0.8,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  announcer: true,
  rumble: true,
  showHitboxes: false,
  inputDisplay: false,
  quality: 'ultra',
  faces: 'photo',
};

const KEY = 'skf.settings';

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
      if (!QUALITIES.includes(s.quality)) s.quality = DEFAULT_SETTINGS.quality;
      return s;
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}
