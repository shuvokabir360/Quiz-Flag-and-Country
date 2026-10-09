import { motion } from 'framer-motion';

interface WrongFeedbackProps {
  reducedMotion?: boolean;
  onRetry: () => void;
  correctCountryName?: string;
  capital?: string;
}

export const WrongFeedback = ({
  reducedMotion,
  onRetry,
  correctCountryName,
  capital,
}: WrongFeedbackProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: reducedMotion ? 0 : [-8, 8, -6, 6, -3, 3, 0],
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.35 }}
      onClick={onRetry}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-rose-950/50 backdrop-blur-sm pointer-events-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900/95 border-2 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.7)] text-center max-w-[280px] w-full"
      >
        {/* Glowing X Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/60 mb-2">
          <svg className="w-10 h-10 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h3 className="text-2xl font-black uppercase tracking-wider text-rose-400">
          WRONG!
        </h3>
        <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wide">
          {correctCountryName ? `Not ${correctCountryName}` : 'Not the right flag'}
        </p>

        {capital && (
          <div className="mt-2 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-200">
            Hint: Capital is <span className="font-black text-amber-300">{capital}</span>
          </div>
        )}

        {/* Interactive Try Again Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
          autoFocus
          className="mt-4 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>🔄</span>
          <span>TRY AGAIN</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
