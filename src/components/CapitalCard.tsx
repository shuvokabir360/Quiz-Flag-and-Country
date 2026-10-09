import React from 'react';
import { motion } from 'framer-motion';
import type { Country } from '../types/game';

interface CapitalCardProps {
  country: Country;
  index?: number;
  isCorrectOption: boolean;
  isSelected?: boolean;
  isWrongClicked?: boolean;
  feedbackStatus?: 'correct' | 'wrong' | null;
  isDisabled?: boolean;
  onClick: (country: Country) => void;
}

export const CapitalCard: React.FC<CapitalCardProps> = ({
  country,
  index = 0,
  isCorrectOption,
  isSelected = false,
  isWrongClicked = false,
  feedbackStatus = null,
  isDisabled = false,
  onClick,
}) => {
  const capitalName = country.capital || 'Unknown';

  const isRoundResolved = feedbackStatus === 'correct';
  const isThisCardCorrect = isCorrectOption && isRoundResolved;
  // When round is resolved (correct answer chosen), all wrong cards turn red with ✕ (none are hidden!)
  const isThisCardWrong =
    !isCorrectOption && (isRoundResolved || isWrongClicked || (isSelected && feedbackStatus === 'wrong'));

  let borderClass = 'border-slate-700/80 hover:border-amber-400/80';
  let bgClass = 'bg-slate-900/90 hover:bg-slate-800/95';
  let shadowClass = 'shadow-[0_6px_16px_rgba(0,0,0,0.5)]';
  let textColor = 'text-white';
  let bottomBorderColor = '#0f172a';

  if (isThisCardCorrect) {
    // Correct highlight: Vivid emerald green
    borderClass = 'border-[3px] border-emerald-400 ring-2 ring-emerald-400/40';
    bgClass = 'bg-emerald-950/95';
    shadowClass = 'shadow-[0_0_40px_rgba(52,211,153,0.9),inset_0_0_20px_rgba(52,211,153,0.3)]';
    textColor = 'text-emerald-300 font-black';
    bottomBorderColor = '#059669';
  } else if (isThisCardWrong) {
    // Wrong capital: Vivid glowing Red with X mark on left
    borderClass = 'border-rose-500';
    bgClass = 'bg-rose-950/90';
    shadowClass = 'shadow-[0_0_25px_rgba(244,63,94,0.7),inset_0_0_12px_rgba(244,63,94,0.25)]';
    textColor = 'text-rose-300 font-bold';
    bottomBorderColor = '#e11d48';
  }

  return (
    <motion.button
      id={`quiz-option-${country.code}`}
      data-quiz-option-index={index}
      whileHover={!isDisabled && !isRoundResolved && !isThisCardWrong ? { scale: 1.03 } : {}}
      whileTap={!isDisabled && !isRoundResolved && !isThisCardWrong ? { scale: 0.96 } : {}}
      animate={
        isThisCardCorrect
          ? { scale: [1, 1.10, 1.07], opacity: 1 }
          : isThisCardWrong && !isRoundResolved
          ? { x: [-7, 7, -5, 5, -2, 2, 0], opacity: 1 }
          : { opacity: isThisCardWrong && isRoundResolved ? 0.7 : 1 }
      }
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={() => {
        if (!isDisabled && !isRoundResolved && !isThisCardWrong) onClick(country);
      }}
      disabled={isDisabled || isRoundResolved || isThisCardWrong}
      className={`relative w-full py-3 px-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer select-none transition-all backdrop-blur-xl group overflow-hidden ${borderClass} ${bgClass} ${shadowClass}`}
      style={{
        borderBottomWidth: '4px',
        borderBottomColor: bottomBorderColor,
        minHeight: '58px',
        zIndex: isThisCardCorrect ? 50 : 20,
      }}
    >
      {/* Subtle top reflection sheen */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '12px',
          right: '12px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* 1. LEFT SIDE SLOT: Correct (✓) or Wrong (✕) symbol badge */}
      <div
        style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isThisCardCorrect && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '9999px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 900,
              boxShadow: '0 0 14px #10b981',
            }}
          >
            ✓
          </motion.div>
        )}

        {isThisCardWrong && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.25, 1], opacity: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '9999px',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 900,
              boxShadow: '0 0 12px #f43f5e',
            }}
          >
            ✕
          </motion.div>
        )}
      </div>

      {/* 2. CENTER: Capital Name - Perfectly legible and unobstructed */}
      <h3
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '1.05rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          lineHeight: 1.2,
          padding: '0 4px',
          margin: 0,
          wordBreak: 'break-word',
          textShadow: isThisCardCorrect
            ? '0 0 18px rgba(52,211,153,0.9), 0 2px 4px rgba(0,0,0,0.95)'
            : isThisCardWrong
            ? '0 0 18px rgba(244,63,94,0.9), 0 2px 4px rgba(0,0,0,0.95)'
            : '0 2px 8px rgba(0,0,0,0.9)',
        }}
        className={textColor}
      >
        {capitalName}
      </h3>

      {/* 3. RIGHT SIDE BALANCER SLOT: Ensures the capital name remains perfectly centered */}
      <div
        style={{
          width: '28px',
          height: '28px',
          flexShrink: 0,
        }}
      />
    </motion.button>
  );
};
