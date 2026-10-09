import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface DropZoneProps {
  isDraggingActive: boolean;
  isPointerOver: boolean;
  hoverValidity: 'correct' | 'wrong' | 'neutral' | null;
  lastAttemptStatus: 'correct' | 'wrong' | null;
  reducedMotion?: boolean;
}

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  (
    {
      isDraggingActive,
      isPointerOver,
      hoverValidity,
      lastAttemptStatus,
      reducedMotion = false,
    },
    ref
  ) => {
    // Determine dynamic state styling
    const isSuccess = lastAttemptStatus === 'correct' || (isPointerOver && hoverValidity === 'correct');
    const isError = lastAttemptStatus === 'wrong' || (isPointerOver && hoverValidity === 'wrong');

    let borderColor = 'border-sky-400/50';
    let glowShadow = '0 0 25px rgba(56, 189, 248, 0.25)';
    let bgGradient = 'from-slate-900/80 to-slate-950/90';

    if (isSuccess) {
      borderColor = 'border-emerald-400';
      glowShadow = '0 0 45px rgba(52, 211, 153, 0.8), inset 0 0 20px rgba(52, 211, 153, 0.3)';
      bgGradient = 'from-emerald-950/70 to-slate-900/90';
    } else if (isError) {
      borderColor = 'border-rose-500';
      glowShadow = '0 0 45px rgba(244, 63, 94, 0.8), inset 0 0 20px rgba(244, 63, 94, 0.3)';
      bgGradient = 'from-rose-950/70 to-slate-900/90';
    } else if (isDraggingActive) {
      borderColor = 'border-amber-400';
      glowShadow = '0 0 35px rgba(251, 191, 36, 0.6)';
      bgGradient = 'from-blue-950/70 to-slate-900/90';
    }

    return (
      <div className="w-full px-5 py-2 flex justify-center items-center">
        <motion.div
          ref={ref}
          animate={{
            scale: isPointerOver ? 1.05 : isDraggingActive ? 1.02 : 1,
            y: reducedMotion ? 0 : [0, -3, 0],
          }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.18 },
          }}
          style={{
            boxShadow: glowShadow,
          }}
          className={`relative w-full max-w-[340px] h-[130px] rounded-3xl border-2 border-dashed ${borderColor} 
                      bg-gradient-to-b ${bgGradient} backdrop-blur-xl 
                      flex flex-col items-center justify-center transition-colors duration-200 overflow-hidden select-none`}
        >
          {/* Ambient 3D pedestal grid line pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Central Target Glyph */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isSuccess
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                  : isError
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50'
                  : isDraggingActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/50'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
              }`}
            >
              {isSuccess ? (
                <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : isError ? (
                <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
            </div>

            <div className="text-center">
              <span
                className={`block text-base sm:text-lg font-black uppercase tracking-widest ${
                  isSuccess
                    ? 'text-emerald-300'
                    : isError
                    ? 'text-rose-300'
                    : isDraggingActive
                    ? 'text-amber-300'
                    : 'text-white'
                }`}
              >
                {isSuccess
                  ? 'PERFECT MATCH!'
                  : isError
                  ? 'NOT THIS ONE!'
                  : isDraggingActive
                  ? 'RELEASE HERE'
                  : 'DRAG FLAG HERE'}
              </span>
            </div>
          </div>

          {/* Glowing bottom edge highlight */}
          <div className="absolute bottom-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
        </motion.div>
      </div>
    );
  }
);

DropZone.displayName = 'DropZone';
