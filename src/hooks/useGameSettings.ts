import { useState, useEffect } from 'react';
import type { GameSettings } from '../types/game';
import { soundSynthesizer } from '../audio/soundSynthesizer';
import { wakeLockManager } from '../utils/wakeLockManager';

const SETTINGS_STORAGE_KEY = 'flag_quiz_settings_v1';

const DEFAULT_SETTINGS: GameSettings = {
  soundEffects: true,
  voice: true,
  music: false,
  reducedMotion: false,
  vibration: true,
  answerDisplayTime: 5,
  keepScreenAwake: true,
};

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          answerDisplayTime: parsed.answerDisplayTime ?? 5,
          keepScreenAwake: parsed.keepScreenAwake ?? true,
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }

    if (settings.music) {
      soundSynthesizer.startBackgroundMusic();
    } else {
      soundSynthesizer.stopBackgroundMusic();
    }

    // Sync Screen Wake Lock with settings
    wakeLockManager.setEnabled(settings.keepScreenAwake ?? true);
  }, [settings]);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}
