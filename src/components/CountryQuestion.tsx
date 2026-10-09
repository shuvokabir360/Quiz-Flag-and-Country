import { motion } from 'framer-motion';
import type { Country, QuizCategory } from '../types/game';

interface CountryQuestionProps {
  country: Country;
  round: number;
  category?: QuizCategory;
}

export const CountryQuestion: React.FC<CountryQuestionProps> = ({
  country,
  category = 'country',
}) => {
  const isCapital = category === 'capital';

  return (
    <div className="w-full px-4 pt-1 pb-1 flex flex-col items-center text-center select-none z-10">
      {/* High-Contrast Highlighted Question Card Banner */}
      <motion.div
        key={`${category}-${country.code}`}
        initial={{ scale: 0.92, opacity: 0, y: -4 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className="w-full max-w-[390px] rounded-3xl py-3 px-4 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-2xl border-2"
        style={{
          background: isCapital
            ? 'linear-gradient(180deg, rgba(20, 16, 48, 0.98) 0%, rgba(35, 20, 60, 0.96) 50%, rgba(15, 12, 38, 0.98) 100%)'
            : 'linear-gradient(180deg, rgba(13, 18, 45, 0.98) 0%, rgba(24, 21, 65, 0.96) 50%, rgba(13, 18, 45, 0.98) 100%)',
          borderColor: isCapital ? 'rgba(245, 158, 11, 0.9)' : 'rgba(251, 191, 36, 0.85)',
          boxShadow: isCapital
            ? '0 0 35px rgba(245, 158, 11, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 12px 28px rgba(0, 0, 0, 0.8)'
            : '0 0 30px rgba(251, 191, 36, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 12px 28px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Illuminated top glow */}
        <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />

        {/* Question text: Pure White Color */}
        <div className="text-xl sm:text-2xl font-black text-white tracking-wide text-center drop-shadow-md leading-tight mb-1">
          {isCapital ? "What's the capital of" : "What's the flag of"}
        </div>

        {/* Country Name: Vibrant Red Color with '?' */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          <span
            style={{
              color: '#ff1a1a',
              textShadow: '0 0 25px rgba(255, 26, 26, 0.8), 0 2px 8px rgba(0, 0, 0, 1)',
            }}
          >
            {country.name}
          </span>
          <span className="text-white drop-shadow-md font-black">?</span>
        </h1>
      </motion.div>
    </div>
  );
};

