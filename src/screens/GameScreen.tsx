import { useState, useRef, useEffect, useCallback } from 'react';
import type { Country, GameMode, GameSettings, QuizCategory } from '../types/game';
import { useQuizGame } from '../hooks/useQuizGame';
import { GameHeader } from '../components/GameHeader';
import { CountryQuestion } from '../components/CountryQuestion';
import { FlagCard } from '../components/FlagCard';
import { CapitalCard } from '../components/CapitalCard';
import { AnswerGraph } from '../components/AnswerGraph';
import { ResultScreen } from '../components/ResultScreen';
import { soundSynthesizer } from '../audio/soundSynthesizer';
import { voiceManager } from '../audio/voiceManager';
import { triggerConfettiBurst } from '../components/ConfettiEffect';
import { virtualHandController } from '../utils/virtualHandController';
import { getFlagUrl } from '../utils/assetUrl';

interface GameScreenProps {
  mode: GameMode;
  category?: QuizCategory;
  onGoHome: () => void;
  onOpenSettings: () => void;
  settings: GameSettings;
  updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  category = 'country',
  onGoHome,
  onOpenSettings,
  settings,
  updateSetting,
}) => {
  const {
    currentRound,
    currentQuestion,
    stats,
    startNewGame,
    recordCorrectAnswer,
    recordWrongAnswer,
    nextQuestion,
  } = useQuizGame(mode);

  // Selected option & feedback states
  const [selectedOptionCountry, setSelectedOptionCountry] = useState<Country | null>(null);
  const [wrongClickedCodes, setWrongClickedCodes] = useState<string[]>([]);
  const [lastAnswerClicks, setLastAnswerClicks] = useState<number | null>(null);

  // Feedback states
  const [feedbackStatus, setFeedbackStatus] = useState<'correct' | 'wrong' | null>(null);
  const [isRoundLocked, setIsRoundLocked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    startNewGame(mode);
  }, [mode, startNewGame]);

  // Voice announcement on new question
  useEffect(() => {
    if (currentQuestion && settings.voice && !isGameOver) {
      if (category === 'capital') {
        voiceManager.speakCapitalOfCountry(currentQuestion.correctCountry.name);
      } else {
        voiceManager.speakNewQuestion(currentQuestion.correctCountry.name);
      }
    }
  }, [currentQuestion, settings.voice, isGameOver, category]);

  const correctTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live countdown timer for answer display duration (default 5s)
  const [countdown, setCountdown] = useState<number>(settings.answerDisplayTime ?? 5);

  const advanceToNext = useCallback(() => {
    if (correctTimerRef.current) {
      clearTimeout(correctTimerRef.current);
      correctTimerRef.current = null;
    }
    setFeedbackStatus(null);
    setSelectedOptionCountry(null);
    setWrongClickedCodes([]);
    setLastAnswerClicks(null);
    setIsRoundLocked(false);

    if (mode === 'challenge10' && currentRound >= 10) {
      setIsGameOver(true);
    } else {
      nextQuestion();
    }
  }, [mode, currentRound, nextQuestion]);

  const advanceToNextRef = useRef(advanceToNext);
  advanceToNextRef.current = advanceToNext;

  // Live countdown timer effect for correct answer display (stays visible for settings.answerDisplayTime)
  useEffect(() => {
    if (feedbackStatus !== 'correct') {
      setCountdown(settings.answerDisplayTime ?? 5);
      return;
    }

    const duration = settings.answerDisplayTime ?? 5;
    setCountdown(duration);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          advanceToNextRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [feedbackStatus, settings.answerDisplayTime]);

  // Process flag drop
  const handleDropOnTarget = useCallback(
    (droppedCountry: Country) => {
      if (isRoundLocked || !currentQuestion || isGameOver) return;

      const isCorrect = droppedCountry.code === currentQuestion.correctCountry.code;

      if (isCorrect) {
        setIsRoundLocked(true);
        setFeedbackStatus('correct');

        const attempts = wrongClickedCodes.length + 1;
        setLastAnswerClicks(attempts);
        const pts = attempts === 1 ? 10 : attempts === 2 ? 7 : attempts === 3 ? 5 : 2;

        const newStreak = recordCorrectAnswer(pts, attempts);

        if (settings.soundEffects) {
          soundSynthesizer.playCorrect(newStreak);
          if (newStreak === 3 || newStreak === 5 || newStreak === 10) {
            setTimeout(() => soundSynthesizer.playStreakBonus(), 250);
          }
        }

        if (settings.voice) {
          if (category === 'capital' && currentQuestion.correctCountry.capital) {
            voiceManager.speakCapitalWithClicks(
              currentQuestion.correctCountry.capital,
              currentQuestion.correctCountry.name,
              attempts
            );
          } else {
            voiceManager.speakFlagWithClicks(
              currentQuestion.correctCountry.name,
              attempts,
              newStreak
            );
          }
        }

        triggerConfettiBurst(newStreak);

        // Haptic feedback if supported
        if (settings.vibration && 'vibrate' in navigator) {
          try {
            navigator.vibrate([40, 60, 100]);
          } catch {
            // ignore
          }
        }

      } else {
        // Wrong answer: in ALL modes, no popup - record wrong code, show red feedback on card and dropzone!
        setWrongClickedCodes((prev) => (prev.includes(droppedCountry.code) ? prev : [...prev, droppedCountry.code]));
        setFeedbackStatus('wrong');
        setTimeout(() => {
          setFeedbackStatus((curr) => (curr === 'wrong' ? null : curr));
        }, 1200);
        recordWrongAnswer();

        if (settings.soundEffects) {
          soundSynthesizer.playWrong();
        }

        if (settings.voice) {
          voiceManager.speakWrong();
        }

        if (settings.vibration && 'vibrate' in navigator) {
          try {
            navigator.vibrate(200);
          } catch {
            // ignore
          }
        }

        // Check lives mode termination
        if (mode === 'lives' && (stats.lives ?? 3) - 1 <= 0) {
          setTimeout(() => {
            setFeedbackStatus(null);
            setIsGameOver(true);
          }, 1500);
        }
      }
    },
    [
      isRoundLocked,
      currentQuestion,
      isGameOver,
      wrongClickedCodes,
      recordCorrectAnswer,
      category,
      settings.soundEffects,
      settings.voice,
      settings.vibration,
      settings.answerDisplayTime,
      recordWrongAnswer,
      mode,
      stats.lives,
      advanceToNext,
    ]
  );

  // Keyboard accessibility: 1, 2, 3, 4 keys select options
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (!currentQuestion || isRoundLocked || isGameOver) return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 4) {
        const option = currentQuestion.options[keyNum - 1];
        if (option) {
          setSelectedOptionCountry(option);
          handleDropOnTarget(option);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [currentQuestion, isRoundLocked, isGameOver, handleDropOnTarget]);

  // Auto Play state and 5-second countdown loop
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [autoCountdown, setAutoCountdown] = useState<number>(5);

  const handleToggleAutoPlay = useCallback(() => {
    setIsAutoPlay((prev) => {
      const next = !prev;
      if (!next) {
        virtualHandController.releaseVirtual();
      } else {
        setAutoCountdown(5);
        // Immediately make Girl Hand visible on the game screen
        virtualHandController.activateAutoMode();
      }
      return next;
    });
  }, []);

  // Cleanup virtual hand on unmount
  useEffect(() => {
    return () => {
      virtualHandController.releaseVirtual();
    };
  }, []);

  // Reset auto countdown and keep hand visible when round changes
  useEffect(() => {
    setAutoCountdown(5);
    if (isAutoPlay) {
      virtualHandController.activateAutoMode();
    }
  }, [currentQuestion?.round, isAutoPlay]);

  // Auto Play execution loop: every 5 seconds, selects a random remaining unclicked card until correct answer is found
  useEffect(() => {
    if (!isAutoPlay || isRoundLocked || isGameOver || !currentQuestion) {
      return;
    }

    // Ensure Girl Hand is visible on the game screen
    virtualHandController.activateAutoMode();

    const interval = setInterval(() => {
      setAutoCountdown((prev) => {
        // At 2 seconds remaining, begin smooth gliding toward candidate card so user sees it moving
        if (prev === 2) {
          const availableOptions = currentQuestion.options.filter(
            (opt) => !wrongClickedCodes.includes(opt.code)
          );
          if (availableOptions.length > 0) {
            const previewOption =
              availableOptions[Math.floor(Math.random() * availableOptions.length)];
            const el = document.getElementById(`quiz-option-${previewOption.code}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              const targetX = rect.left + rect.width / 2;
              const targetY = rect.top + rect.height / 2;
              virtualHandController.glideToAndTap(targetX, targetY, 700, 0);
            }
          }
        }

        if (prev <= 1) {
          // Time to execute tap and click!
          const availableOptions = currentQuestion.options.filter(
            (opt) => !wrongClickedCodes.includes(opt.code)
          );

          if (availableOptions.length > 0) {
            const randomOption =
              availableOptions[Math.floor(Math.random() * availableOptions.length)];

            const el = document.getElementById(`quiz-option-${randomOption.code}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              const targetX = rect.left + rect.width / 2;
              const targetY = rect.top + rect.height / 2;

              // Visually glide directly to the card and perform the physical tap!
              virtualHandController
                .glideToAndTap(targetX, targetY, 450, 280)
                .then(() => {
                  setSelectedOptionCountry(randomOption);
                  handleDropOnTarget(randomOption);
                });
            } else {
              setSelectedOptionCountry(randomOption);
              handleDropOnTarget(randomOption);
            }
          }
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isAutoPlay,
    isRoundLocked,
    isGameOver,
    currentQuestion,
    wrongClickedCodes,
    handleDropOnTarget,
  ]);

  if (isGameOver) {
    return (
      <ResultScreen
        stats={stats}
        onPlayAgain={() => {
          setIsGameOver(false);
          startNewGame(mode);
        }}
        onGoHome={onGoHome}
        voiceEnabled={settings.voice}
        soundEnabled={settings.soundEffects}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none z-20 overflow-hidden">
      {/* Top Header: Navigation & Controls (Score hidden in Capital mode) */}
      <GameHeader
        stats={stats}
        onOpenSettings={onOpenSettings}
        onGoHome={onGoHome}
        soundEnabled={settings.soundEffects}
        onToggleSound={() => updateSetting('soundEffects', !settings.soundEffects)}
        hideScore={true}
        isAutoPlay={isAutoPlay}
        autoCountdown={autoCountdown}
        onToggleAutoPlay={handleToggleAutoPlay}
      />

      {/* Main Interactive Stage - Vertically Balanced for 9:16 Screen */}
      <div className="flex-1 flex flex-col justify-evenly items-center w-full my-auto px-1 py-1.5">
        {/* Main Question Display: Country or Capital Name */}
        <CountryQuestion
          country={currentQuestion.correctCountry}
          round={currentRound}
          category={category}
        />

        {/* Center Stage: Flag showcase in Capital Mode (Official 2:3 proportion / 3:2 aspect ratio) */}
        {category === 'capital' && (
          <div
            className="rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.35),0_12px_28px_rgba(0,0,0,0.85)] relative flex items-center justify-center my-1"
            style={{
              width: '270px',
              maxWidth: '92%',
              aspectRatio: '3 / 2',
            }}
          >
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={getFlagUrl(currentQuestion.correctCountry)}
                alt={currentQuestion.correctCountry.name}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading="eager"
              />
            </div>
            {/* Glossy sheen reflection */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.25) 100%)',
              }}
            />
          </div>
        )}

        {/* Answer Reveal Notification Pill with Display Time Filter & Live Countdown */}
        {feedbackStatus === 'correct' && (
          <div className="w-full max-w-[390px] mx-auto py-1 px-3 rounded-full bg-slate-900/98 border border-emerald-400/70 shadow-[0_0_25px_rgba(52,211,153,0.4)] flex items-center justify-between z-30 mb-0.5">
            {/* Points Earned */}
            <div className="flex items-center gap-1.5 text-emerald-300 font-black text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {lastAnswerClicks === 1
                  ? '🎯 1-CLICK'
                  : lastAnswerClicks === 2
                  ? '⚡ 2-CLICK'
                  : lastAnswerClicks === 3
                  ? '🥉 3-CLICK'
                  : '👍 4-CLICK'}
              </span>
              <span className="text-white font-black text-xs bg-emerald-500/30 px-1.5 py-0.5 rounded">
                +{lastAnswerClicks === 1 ? 10 : lastAnswerClicks === 2 ? 7 : lastAnswerClicks === 3 ? 5 : 2} PTS
              </span>
            </div>

            {/* Quick Display Time Filter & Skip */}
            <div className="flex items-center gap-1.5">
              {/* Display Time Filter Cycle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const times = [1, 2, 3, 5, 8, 10];
                  const currentIdx = times.indexOf(settings.answerDisplayTime ?? 5);
                  const nextTime = times[(currentIdx + 1) % times.length];
                  updateSetting('answerDisplayTime', nextTime);
                }}
                title="Click to cycle display time (1s, 2s, 3s, 5s default, 8s, 10s)"
                className="px-2 py-0.5 rounded-full bg-slate-800 border border-amber-400/50 text-amber-300 text-[11px] font-black flex items-center gap-1 hover:border-amber-300 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span>⏱️</span>
                <span>{countdown}s</span>
                <span className="text-[9px] text-slate-400">({settings.answerDisplayTime ?? 5}s)</span>
              </button>

              {/* Skip immediately */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  advanceToNext();
                }}
                className="text-xs font-black text-amber-300 flex items-center gap-0.5 cursor-pointer hover:underline active:scale-95 px-1 py-0.5"
              >
                <span>Skip</span>
                <span>❯</span>
              </button>
            </div>
          </div>
        )}

        {/* Four Options Grid (2x2): Capital Cards in Capital Mode, Flag Cards in Flag Mode */}
        <div className="w-full px-4 pb-1">
          <div className="grid grid-cols-2 gap-3 max-w-[410px] mx-auto">
            {category === 'capital'
              ? currentQuestion.options.map((option, idx) => (
                  <CapitalCard
                    key={`${currentQuestion.round}-${option.code}`}
                    country={option}
                    index={idx}
                    isCorrectOption={option.code === currentQuestion.correctCountry.code}
                    isWrongClicked={wrongClickedCodes.includes(option.code)}
                    isSelected={selectedOptionCountry?.code === option.code}
                    feedbackStatus={feedbackStatus}
                    isDisabled={isRoundLocked}
                    onClick={(c) => {
                      setSelectedOptionCountry(c);
                      handleDropOnTarget(c);
                    }}
                  />
                ))
              : currentQuestion.options.map((option, idx) => (
                  <FlagCard
                    key={`${currentQuestion.round}-${option.code}`}
                    country={option}
                    index={idx}
                    isDragDisabled={isRoundLocked}
                    isCorrectOption={option.code === currentQuestion.correctCountry.code}
                    isWrongClicked={wrongClickedCodes.includes(option.code)}
                    feedbackStatus={feedbackStatus}
                    onClick={(c) => {
                      setSelectedOptionCountry(c);
                      handleDropOnTarget(c);
                    }}
                    onDropOnTarget={(c) => {
                      setSelectedOptionCountry(c);
                      handleDropOnTarget(c);
                    }}
                    reducedMotion={settings.reducedMotion}
                  />
                ))}
          </div>
        </div>

        {/* Answer Attempts Graph (1, 2, 3, 4 Click Graph) below the Options Grid */}
        <AnswerGraph stats={stats} lastAnswerClicks={lastAnswerClicks} />
      </div>

    </div>
  );
};
