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
  quality: 'high' | 'low';
}

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
  quality: 'high',
};

const KEY = 'skf.settings';

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
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
