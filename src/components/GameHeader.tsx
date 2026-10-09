import { motion } from 'framer-motion';
import type { QuizStats } from '../types/game';

interface GameHeaderProps {
  stats: QuizStats;
  onOpenSettings: () => void;
  onGoHome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hideScore?: boolean;
  isAutoPlay?: boolean;
  autoCountdown?: number;
  onToggleAutoPlay?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  stats,
  onOpenSettings,
  onGoHome,
  soundEnabled,
  onToggleSound,
  hideScore = false,
  isAutoPlay = false,
  autoCountdown = 5,
  onToggleAutoPlay,
}) => {
  const isHighStreak = stats.streak >= 3;
  const isFlameStreak = stats.streak >= 5;

  return (
    <header className="w-full px-4 pt-3 pb-2 flex items-center justify-between select-none z-30">
      {/* Home / Back button */}
      <button
        onClick={onGoHome}
        aria-label="Back to Home"
        className="w-10 h-10 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-400 active:scale-95 transition-all shadow-md"
      >
        <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      {/* Center HUD: Score & Streak (Hidden when hideScore is true) */}
      {!hideScore && (
        <div className="flex items-center gap-3">
        {/* Score pill */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-lg flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-sky-400">
            SCORE
          </span>
          <motion.span
            key={stats.score}
            initial={{ scale: 1.3, color: '#38bdf8' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-xl sm:text-2xl font-black tracking-tight"
          >
            {stats.score}
          </motion.span>
        </div>

        {/* Streak pill with animated fire */}
        <div
          className={`px-4 py-2 rounded-2xl backdrop-blur-md border shadow-lg flex items-center gap-2 transition-all duration-300 ${
            isFlameStreak
              ? 'bg-gradient-to-r from-amber-950/90 via-rose-950/90 to-purple-950/90 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
              : isHighStreak
              ? 'bg-slate-900/90 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900/90 border-slate-700/70'
          }`}
        >
          <motion.span
            animate={
              isFlameStreak
                ? { scale: [1, 1.25, 1], rotate: [-4, 4, -4] }
                : isHighStreak
                ? { scale: [1, 1.15, 1] }
                : {}
            }
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-lg"
          >
            🔥
          </motion.span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            STREAK
          </span>
          <motion.span
            key={stats.streak}
            initial={{ scale: 1.35 }}
            animate={{ scale: 1 }}
            className={`text-xl sm:text-2xl font-black tracking-tight ${
              isFlameStreak ? 'text-amber-300' : 'text-white'
            }`}
          >
            {stats.streak}
          </motion.span>
        </div>

        {/* Lives indicator (if in lives mode) */}
        {stats.lives !== undefined && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-slate-900/90 border border-rose-500/40">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < (stats.lives ?? 0) ? 'opacity-100 scale-100' : 'opacity-25 grayscale'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Right Controls: Auto/Manual Toggle, Quick Mute & Settings Modal */}
      <div className="flex items-center gap-1.5">
        {onToggleAutoPlay && (
          <button
            type="button"
            onClick={onToggleAutoPlay}
            title={isAutoPlay ? 'Switch to Manual Mode' : 'Switch to Auto Play Mode (Clicks every 5s)'}
            aria-label={isAutoPlay ? 'Disable Auto Play' : 'Enable Auto Play'}
            className={`h-10 px-2 sm:px-2.5 rounded-2xl border flex items-center gap-1 text-[11px] font-black tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
              isAutoPlay
                ? 'bg-gradient-to-r from-amber-500/35 via-rose-500/25 to-purple-500/35 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.45)] ring-1 ring-amber-400/50'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            <span>{isAutoPlay ? '🤖' : '👤'}</span>
            <span>{isAutoPlay ? `AUTO ${autoCountdown}s` : 'MANUAL'}</span>
            {isAutoPlay && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        )}

        <button
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          className="w-10 h-10 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-400 active:scale-95 transition-all shadow-md"
        >
          {soundEnabled ? (
            <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="w-10 h-10 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:border-sky-400 active:scale-95 transition-all shadow-md"
        >
          <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};
