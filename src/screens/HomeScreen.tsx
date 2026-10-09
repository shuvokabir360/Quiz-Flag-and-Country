import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameMode, QuizCategory } from '../types/game';
import { soundSynthesizer } from '../audio/soundSynthesizer';
import { pwaManager } from '../utils/pwaManager';

interface HomeScreenProps {
  onPlay: (mode: GameMode, category: QuizCategory) => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
}

const FEATURED_FLAGS = [
  { code: 'bd', name: 'Bangladesh', anim: 'animate-float-1' },
  { code: 'br', name: 'Brazil', anim: 'animate-float-2' },
  { code: 'jp', name: 'Japan', anim: 'animate-float-3' },
  { code: 'ca', name: 'Canada', anim: 'animate-float-4' },
  { code: 'fr', name: 'France', anim: 'animate-float-5' },
  { code: 'ar', name: 'Argentina', anim: 'animate-float-2' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlay,
  onOpenHowToPlay,
  onOpenSettings,
  soundEnabled,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('country');
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [canInstall, setCanInstall] = useState(pwaManager.canInstall());
  const [isInstalled, setIsInstalled] = useState(pwaManager.isAppInstalled());

  useEffect(() => {
    return pwaManager.subscribe(() => {
      setCanInstall(pwaManager.canInstall());
      setIsInstalled(pwaManager.isAppInstalled());
    });
  }, []);

  const handleStart = () => {
    if (soundEnabled) soundSynthesizer.playClick();
    onPlay(selectedMode, selectedCategory);
  };

  const modeConfigs = [
    {
      id: 'classic' as GameMode,
      icon: '♾️',
      title: 'Classic',
      desc: 'Endless Run',
      badge: 'POPULAR',
      badgeStyle: 'bg-sky-400/20 text-sky-300 border-sky-400/40',
      activeClass: 'mode-card-classic active',
      normalClass: 'mode-card-classic',
    },
    {
      id: 'challenge10' as GameMode,
      icon: '🎯',
      title: '10 Qs',
      desc: 'Speed Attack',
      badge: 'RANKED',
      badgeStyle: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
      activeClass: 'mode-card-challenge active',
      normalClass: 'mode-card-challenge',
    },
    {
      id: 'lives' as GameMode,
      icon: '❤️',
      title: '3 Lives',
      desc: 'Survival',
      badge: 'HARDCORE',
      badgeStyle: 'bg-rose-400/20 text-rose-300 border-rose-400/40',
      activeClass: 'mode-card-lives active',
      normalClass: 'mode-card-lives',
    },
  ];

  const isCapital = selectedCategory === 'capital';

  return (
    <div className="home-screen-root">
      {/* Top Header Navigation Bar */}
      <div className="w-full flex items-center justify-between z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="text-amber-400 text-xs">{isCapital ? '🏛️' : '🌍'}</span>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-200">
            {isCapital ? '195 CAPITALS' : '195 COUNTRIES'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isInstalled && (
            <button
              onClick={async () => {
                if (soundEnabled) soundSynthesizer.playClick();
                if (canInstall) {
                  await pwaManager.promptInstall();
                } else {
                  onOpenSettings();
                }
              }}
              title="Add to Home Screen / Install App"
              aria-label="Install App"
              className="h-10 px-3 rounded-2xl bg-gradient-to-r from-amber-500/25 to-yellow-400/20 border border-amber-400/50 flex items-center gap-1.5 text-amber-300 hover:text-white hover:border-amber-300 active:scale-95 transition-all shadow-lg cursor-pointer text-xs font-black tracking-wide"
            >
              <span>📲</span>
              <span>INSTALL</span>
            </button>
          )}

          <button
            onClick={() => {
              if (soundEnabled) soundSynthesizer.playClick();
              onOpenHowToPlay();
            }}
            aria-label="How To Play"
            className="w-10 h-10 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-400 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <span className="font-black text-sm">?</span>
          </button>
          <button
            onClick={() => {
              if (soundEnabled) soundSynthesizer.playClick();
              onOpenSettings();
            }}
            aria-label="Settings"
            className="w-10 h-10 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-400 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero Center Section */}
      <div className="flex flex-col items-center text-center my-auto z-20 w-full max-w-[380px] mx-auto">
        {/* Floating Realistic Flag Preview Showcase Strip */}
        <div className="flag-orbit-strip">
          {FEATURED_FLAGS.map((flag) => (
            <div key={flag.code} className={`flag-mini-chip ${flag.anim}`} title={flag.name}>
              <img src={`/flags/${flag.code}.svg`} alt={flag.name} loading="eager" />
            </div>
          ))}
        </div>

        {/* 3D Main Arcade Title Banner Card */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="hero-arcade-card"
        >
          {/* Top Arcade Ribbon Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-orange-500/25 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
            <span className="text-xs">⭐</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
              3D GEO ARENA
            </span>
            <span className="text-xs">⭐</span>
          </div>

          {/* Main Title */}
          <h1 className="arcade-title-main">
            WORLD FLAG
            <br />
            <span className="arcade-title-quiz">QUIZ</span>
          </h1>

          {/* Subtitle Badge */}
          <div className="mt-2.5 px-3.5 py-1 rounded-full bg-sky-950/60 border border-sky-400/40 shadow-inner">
            <p className="text-[11px] font-black uppercase tracking-wider text-sky-200">
              {isCapital ? '“SELECT THE CORRECT CAPITAL CITY!”' : '“DRAG THE CORRECT FLAG!”'}
            </p>
          </div>
        </motion.div>

        {/* Quiz Category Switcher: Country Names vs Capital Cities */}
        <div className="mt-3.5 w-full flex items-center justify-center p-1 rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-xl shadow-inner">
          <button
            onClick={() => {
              if (soundEnabled) soundSynthesizer.playClick();
              setSelectedCategory('country');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !isCapital
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)] border border-sky-300/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🚩</span>
            <span>COUNTRY NAME</span>
          </button>
          <button
            onClick={() => {
              if (soundEnabled) soundSynthesizer.playClick();
              setSelectedCategory('capital');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isCapital
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-300/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏛️</span>
            <span>CAPITAL CITIES</span>
          </button>
        </div>

        {/* Game Mode Selector Section */}
        <div className="mt-3 w-full flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 drop-shadow">
              SELECT MODE
            </span>
            <span className="text-[10px] font-bold text-sky-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              {selectedMode.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {modeConfigs.map((m) => {
              const isSelected = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    if (soundEnabled) soundSynthesizer.playClick();
                    setSelectedMode(m.id);
                  }}
                  className={`mode-card-item ${isSelected ? m.activeClass : m.normalClass}`}
                >
                  <span className="text-2xl mb-0.5 filter drop-shadow">{m.icon}</span>
                  <span className="text-xs font-black uppercase tracking-wide text-white">
                    {m.title}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-300 mt-0.5">
                    {m.desc}
                  </span>
                  <span className={`mt-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase border ${m.badgeStyle}`}>
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex flex-col gap-2.5 pb-1 z-20 w-full max-w-[380px] mx-auto">
        {/* Dominant 3D PLAY NOW Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="btn-play-arcade"
        >
          {/* Shimmer sweep effect */}
          <div className="btn-play-arcade-shimmer" />

          <div className="btn-play-icon-circle">
            ▶
          </div>
          <span className="btn-play-text">
            {isCapital ? 'PLAY CAPITALS' : 'PLAY NOW'}
          </span>
        </motion.button>

        {/* Secondary Buttons: HOW TO PLAY & SETTINGS */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (soundEnabled) soundSynthesizer.playClick();
              onOpenHowToPlay();
            }}
            className="btn-secondary-arcade"
          >
            <span className="text-sm">📖</span>
            <span>HOW TO PLAY</span>
          </button>
          <button
            onClick={() => {
              if (soundEnabled) soundSynthesizer.playClick();
              onOpenSettings();
            }}
            className="btn-secondary-arcade"
          >
            <span className="text-sm">⚙️</span>
            <span>SETTINGS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
