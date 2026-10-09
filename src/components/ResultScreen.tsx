import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { QuizStats } from '../types/game';
import { soundSynthesizer } from '../audio/soundSynthesizer';
import { voiceManager } from '../audio/voiceManager';
import { triggerConfettiBurst } from './ConfettiEffect';

interface ResultScreenProps {
  stats: QuizStats;
  onPlayAgain: () => void;
  onGoHome: () => void;
  voiceEnabled: boolean;
  soundEnabled: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  stats,
  onPlayAgain,
  onGoHome,
  voiceEnabled,
  soundEnabled,
}) => {
  const total = stats.correctAnswers + stats.wrongAttempts;
  const accuracy = total > 0 ? Math.round((stats.correctAnswers / total) * 100) : 100;

  useEffect(() => {
    if (soundEnabled) {
      soundSynthesizer.playVictory();
    }
    if (voiceEnabled) {
      voiceManager.speakGameOver(stats.score);
    }
    triggerConfettiBurst(5);
  }, [soundEnabled, voiceEnabled, stats.score]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 select-none text-white z-20">
      {/* Top Banner */}
      <div className="flex flex-col items-center text-center mt-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(251,191,36,0.6)] mb-3"
        >
          🏆
        </motion.div>

        <h1 className="text-3xl font-black uppercase tracking-wider text-white drop-shadow-lg">
          GAME COMPLETE!
        </h1>
        <p className="text-xs font-bold text-sky-300 uppercase tracking-widest mt-1">
          Master of World Flags
        </p>
      </div>

      {/* Main Score & Stats Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-3 p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl"
      >
        {/* Huge Final Score Display */}
        <div className="flex flex-col items-center py-2 border-b border-slate-800">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            FINAL SCORE
          </span>
          <span className="text-5xl font-black text-amber-400 tracking-tight drop-shadow-md">
            {stats.score}
          </span>
        </div>

        {/* 2x2 Grid of In-Depth Stats */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              CORRECT
            </span>
            <span className="text-2xl font-black text-white mt-0.5">
              {stats.correctAnswers}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              WRONG
            </span>
            <span className="text-2xl font-black text-white mt-0.5">
              {stats.wrongAttempts}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              ACCURACY
            </span>
            <span className="text-2xl font-black text-white mt-0.5">
              {accuracy}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              BEST STREAK
            </span>
            <span className="text-2xl font-black text-amber-300 mt-0.5">
              🔥 {stats.bestStreak}
            </span>
          </div>
        </div>

        {/* Click Attempts Breakdown if any recorded */}
        {((stats.oneClickCount ?? 0) > 0 ||
          (stats.twoClickCount ?? 0) > 0 ||
          (stats.threeClickCount ?? 0) > 0 ||
          (stats.fourClickCount ?? 0) > 0) && (
          <div className="pt-2 mt-1 border-t border-slate-800 flex items-center justify-around text-center">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-amber-400">🎯 1-CLICK</span>
              <span className="text-lg font-black text-white">{stats.oneClickCount ?? 0}</span>
            </div>
            <div className="w-px h-5 bg-slate-700/60" />
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-sky-400">⚡ 2-CLICK</span>
              <span className="text-lg font-black text-white">{stats.twoClickCount ?? 0}</span>
            </div>
            <div className="w-px h-5 bg-slate-700/60" />
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-purple-400">🥉 3-CLICK</span>
              <span className="text-lg font-black text-white">{stats.threeClickCount ?? 0}</span>
            </div>
            <div className="w-px h-5 bg-slate-700/60" />
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-400">👍 4-CLICK</span>
              <span className="text-lg font-black text-white">{stats.fourClickCount ?? 0}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlayAgain}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 font-black text-base uppercase tracking-wider text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>PLAY AGAIN</span>
        </motion.button>

        <button
          onClick={onGoHome}
          className="w-full py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 font-extrabold text-sm uppercase tracking-wider text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <span>🏠</span>
          <span>RETURN HOME</span>
        </button>
      </div>
    </div>
  );
};
