import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameSettings } from '../types/game';
import { pwaManager } from '../utils/pwaManager';
import { wakeLockManager } from '../utils/wakeLockManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  resetSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSetting,
  resetSettings,
}) => {
  const [canInstall, setCanInstall] = useState(pwaManager.canInstall());
  const [isInstalled, setIsInstalled] = useState(pwaManager.isAppInstalled());
  const [isWakeLockActive, setIsWakeLockActive] = useState(wakeLockManager.isActive());
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const unsubPWA = pwaManager.subscribe(() => {
      setCanInstall(pwaManager.canInstall());
      setIsInstalled(pwaManager.isAppInstalled());
    });

    const unsubWake = wakeLockManager.subscribe((active) => {
      setIsWakeLockActive(active);
    });

    return () => {
      unsubPWA();
      unsubWake();
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (canInstall) {
      const outcome = await pwaManager.promptInstall();
      if (outcome === 'unavailable') {
        setShowInstallGuide(true);
      }
    } else {
      setShowInstallGuide((prev) => !prev);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 p-4 sm:p-5 shadow-2xl flex flex-col gap-4 text-white max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-lg font-black tracking-wide uppercase text-amber-400">
              Settings & App
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* PWA: Add to Home Screen / Install as App */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-sky-500/15 to-purple-500/15 border border-amber-400/40 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📲</span>
              <div>
                <h4 className="text-sm font-black text-amber-300">
                  {isInstalled ? 'App Installed' : 'Add to Home Screen'}
                </h4>
                <p className="text-[11px] text-slate-300">
                  {isInstalled
                    ? 'Running as installed mobile app'
                    : 'Install on phone like a real app'}
                </p>
              </div>
            </div>
            {isInstalled ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/40">
                ✓ INSTALLED
              </span>
            ) : (
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                INSTALL
              </button>
            )}
          </div>

          {/* Quick instructions guide for iOS Safari / Android */}
          <AnimatePresence>
            {(showInstallGuide || !isInstalled) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex flex-col gap-1.5"
              >
                <div className="flex items-start gap-1.5 bg-slate-950/50 p-2 rounded-xl border border-white/5">
                  <span className="text-sm">🍎</span>
                  <span>
                    <strong className="text-white">iPhone/iPad (Safari):</strong> Tap the{' '}
                    <strong className="text-amber-300">Share</strong> icon (⎋ / ↑) then tap{' '}
                    <strong className="text-amber-300">'Add to Home Screen'</strong> (➕).
                  </span>
                </div>
                <div className="flex items-start gap-1.5 bg-slate-950/50 p-2 rounded-xl border border-white/5">
                  <span className="text-sm">🤖</span>
                  <span>
                    <strong className="text-white">Android (Chrome/Edge):</strong> Tap the{' '}
                    <strong className="text-amber-300">3 dots (⋮)</strong> menu then tap{' '}
                    <strong className="text-amber-300">'Install App'</strong> or{' '}
                    <strong className="text-amber-300">'Add to Home screen'</strong>.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle options */}
        <div className="flex flex-col gap-2.5">
          {/* Screen Wake Lock (Keep Screen Awake / No Sleep) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/40">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔆</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold">Keep Screen Awake</h4>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                      isWakeLockActive
                        ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                    }`}
                  >
                    {isWakeLockActive ? 'ACTIVE (NO SLEEP)' : 'ENABLED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Phone display will NOT turn off while playing
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('keepScreenAwake', !settings.keepScreenAwake)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                settings.keepScreenAwake ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  settings.keepScreenAwake ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/40">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔊</span>
              <div>
                <h4 className="text-sm font-bold">Sound Effects</h4>
                <p className="text-[11px] text-slate-400">Chimes, buzzers, and whooshes</p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                settings.soundEffects ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Voice Narration */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/40">
            <div className="flex items-center gap-3">
              <span className="text-lg">🎙️</span>
              <div>
                <h4 className="text-sm font-bold">Voice Narration</h4>
                <p className="text-[11px] text-slate-400">Host calls questions and feedback</p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('voice', !settings.voice)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                settings.voice ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  settings.voice ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/40">
            <div className="flex items-center gap-3">
              <span className="text-lg">📳</span>
              <div>
                <h4 className="text-sm font-bold">Haptic Vibration</h4>
                <p className="text-[11px] text-slate-400">Vibrate on answer (Supported devices)</p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('vibration', !settings.vibration)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                settings.vibration ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  settings.vibration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Answer Display Duration Filter / Settings */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⏱️</span>
                <div>
                  <h4 className="text-sm font-bold">Answer Display Time</h4>
                  <p className="text-[11px] text-slate-400">
                    Duration answer stays visible (Default: 5s)
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs border border-amber-400/40">
                {settings.answerDisplayTime ?? 5}s
              </span>
            </div>

            {/* Time selector pills: 1s, 2s, 3s, 5s (Default), 8s, 10s */}
            <div className="grid grid-cols-6 gap-1 mt-1">
              {[1, 2, 3, 5, 8, 10].map((sec) => {
                const isActive = (settings.answerDisplayTime ?? 5) === sec;
                return (
                  <button
                    key={sec}
                    onClick={() => updateSetting('answerDisplayTime', sec)}
                    className={`py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border flex flex-col items-center justify-center ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                        : 'bg-slate-900/80 text-slate-400 border-slate-700/60 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span>{sec}s</span>
                    {sec === 5 && (
                      <span className="text-[8px] opacity-80 leading-none">DEF</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={resetSettings}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
