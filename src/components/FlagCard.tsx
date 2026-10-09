import React from 'react';
import { motion } from 'framer-motion';
import type { Country } from '../types/game';
import { getFlagUrl } from '../utils/assetUrl';

interface FlagCardProps {
  country: Country;
  index: number;
  showCountryName?: boolean;
  isDragDisabled?: boolean;
  isDisabled?: boolean;
  isCorrectOption?: boolean;
  isWrongClicked?: boolean;
  feedbackStatus?: 'correct' | 'wrong' | null;
  onDropOnTarget?: (country: Country) => void;
  onClick?: (country: Country) => void;
  onDragStart?: (country: Country) => void;
  onDragMove?: (point: { x: number; y: number }) => void;
  onDragEnd?: () => void;
  dropZoneRect?: DOMRect | null;
  reducedMotion?: boolean;
}

export const FlagCard: React.FC<FlagCardProps> = ({
  country,
  index,
  showCountryName = false,
  isDragDisabled = false,
  isDisabled = false,
  isCorrectOption = false,
  isWrongClicked = false,
  feedbackStatus = null,
  onDropOnTarget,
  onClick,
  reducedMotion = false,
}) => {
  const isRoundResolved = feedbackStatus === 'correct';
  const isThisCardCorrect = isCorrectOption && isRoundResolved;
  const isThisCardWrong = !isCorrectOption && (isRoundResolved || isWrongClicked);
  const isInteractive = !isDragDisabled && !isDisabled && !isRoundResolved && !isThisCardWrong;

  const handleClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!isInteractive) return;

    if (onClick) {
      onClick(country);
    } else if (onDropOnTarget) {
      onDropOnTarget(country);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  // Border & Glow styling
  let borderClass = 'border-2 border-slate-700/80 hover:border-sky-400/80 shadow-[0_8px_20px_rgba(0,0,0,0.4)]';
  if (isThisCardCorrect) {
    borderClass =
      'border-[3.5px] border-emerald-400 shadow-[0_0_45px_rgba(52,211,153,0.95),0_0_20px_rgba(16,185,129,0.9),0_15px_30px_rgba(0,0,0,0.95)] ring-2 ring-emerald-400/40';
  } else if (isThisCardWrong) {
    borderClass = 'border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.65)]';
  }

  return (
    <motion.button
      id={`quiz-option-${country.code}`}
      data-quiz-option-index={index}
      type="button"
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-label={`Flag option ${index + 1}: ${country.name}. Click or press Enter to choose.`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={
        isInteractive && !reducedMotion
          ? { scale: 1.04, y: -2, transition: { duration: 0.15 } }
          : {}
      }
      whileTap={
        isInteractive && !reducedMotion
          ? { scale: 0.96, transition: { duration: 0.1 } }
          : {}
      }
      animate={{
        scale: isThisCardCorrect ? (reducedMotion ? 1.05 : [1, 1.12, 1.09]) : 1,
        x: isThisCardWrong && isWrongClicked && !reducedMotion ? [-4, 4, -3, 3, 0] : 0,
      }}
      transition={{
        scale: isThisCardCorrect ? { duration: 0.35, ease: 'easeOut' } : { duration: 0.2 },
        x: { duration: 0.3 },
      }}
      style={{
        zIndex: isThisCardCorrect ? 60 : isThisCardWrong ? 10 : 20,
      }}
      className={`relative w-full text-left select-none outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded-2xl transition-all flex flex-col items-center ${
        isInteractive ? 'cursor-pointer' : 'cursor-default'
      } ${isThisCardWrong && isRoundResolved ? 'opacity-65' : 'opacity-100'}`}
    >
      {/* Physical Card Enclosure with Flag Artwork */}
      <div
        className={`w-full aspect-[3/2] rounded-2xl overflow-hidden bg-slate-900 transition-all duration-200 relative flex items-center justify-center ${borderClass}`}
      >
        {/* Realistic SVG Flag Artwork */}
        <div className="flag-svg-wrapper w-full h-full flex items-center justify-center">
          {country.flagSvg ? (
            <div
              className="w-full h-full flex items-center justify-center pointer-events-none"
              dangerouslySetInnerHTML={{ __html: country.flagSvg }}
            />
          ) : (
            <img
              src={getFlagUrl(country)}
              alt={`${country.name} flag`}
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="eager"
              decoding="async"
            />
          )}
        </div>

        {/* Realistic glossy lighting reflection */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Correct (✓) Badge on Top-Left Corner */}
        {isThisCardCorrect && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.35, 1.15], opacity: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-black shadow-[0_0_20px_#10b981] pointer-events-none z-30"
          >
            ✓
          </motion.div>
        )}

        {/* Wrong (✕) Badge on Top-Left Corner */}
        {isThisCardWrong && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.25, 1], opacity: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm font-black shadow-[0_0_12px_#f43f5e] pointer-events-none z-30"
          >
            ✕
          </motion.div>
        )}

        {/* Option number pill badge if NOT showing country name below */}
        {!showCountryName && (
          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-[11px] font-black text-white/90 shadow-md pointer-events-none z-20">
            {index + 1}
          </div>
        )}
      </div>

      {/* Optional Highlighted Country Name Pill BELOW the flag (if applicable) */}
      {showCountryName && (
        <div
          className="w-full mt-1.5 py-1.5 px-3 rounded-xl flex items-center justify-between border-2 shadow-lg backdrop-blur-xl pointer-events-none z-20 transition-all"
          style={{
            background:
              'linear-gradient(135deg, rgba(16, 20, 42, 0.98) 0%, rgba(28, 24, 55, 0.98) 100%)',
            borderColor: 'rgba(251, 191, 36, 0.85)',
            boxShadow:
              '0 0 16px rgba(251, 191, 36, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 10px rgba(0, 0, 0, 0.6)',
          }}
        >
          <span
            className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-300 truncate drop-shadow leading-tight"
            style={{
              textShadow: '0 1px 8px rgba(251, 191, 36, 0.7), 0 2px 4px rgba(0,0,0,0.9)',
            }}
          >
            {country.name}
          </span>
          <span className="w-6 h-6 rounded-full bg-amber-400/25 border border-amber-400/50 text-xs font-black text-amber-300 flex items-center justify-center shrink-0 ml-1.5 shadow-inner">
            {index + 1}
          </span>
        </div>
      )}
    </motion.button>
  );
};
