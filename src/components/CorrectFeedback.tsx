import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CorrectFeedbackProps {
  countryName: string;
  capital?: string;
  streak: number;
  onNext?: () => void;
}

export const CorrectFeedback = ({ countryName, capital, streak, onNext }: CorrectFeedbackProps) => {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[2px] pointer-events-auto"
    >
      <div className="relative flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-900/95 border-2 border-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.7)] text-center max-w-[280px] w-full">
        {/* Glowing badge icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.25, 1] }}
          transition={{ duration: 0.35 }}
          className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/60 mb-2"
        >
          <svg className="w-10 h-10 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h3 className="text-2xl font-black uppercase tracking-wider text-emerald-300">
          CORRECT!
        </h3>
        <p className="text-sm font-black text-white mt-1 uppercase tracking-wide">
          {countryName}
        </p>
        {capital && (
          <div className="mt-1 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[11px] font-black text-amber-300">
            🏛️ Capital: {capital}
          </div>
        )}

        {/* Score & Streak points award pill */}
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
            +10 PTS
          </span>
          {streak > 1 && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
              🔥 {streak}x STREAK
            </span>
          )}
        </div>

        {/* 5-second countdown indicator */}
        <div className="w-full mt-4 flex flex-col items-center gap-1.5">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-full bg-emerald-400 rounded-full"
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Next in {secondsLeft}s...
          </span>
        </div>

        {/* Optional Skip/Next button */}
        {onNext && (
          <button
            onClick={onNext}
            className="mt-2 text-xs font-extrabold text-emerald-400 hover:text-emerald-300 active:scale-95 transition-all py-1 px-3 rounded-lg hover:bg-emerald-500/10 cursor-pointer"
          >
            NEXT NOW ❯
          </button>
        )}
      </div>
    </motion.div>
  );
};
