import { useState, useCallback, useRef } from 'react';
import type { Question, QuizStats, GameMode } from '../types/game';
import { COUNTRIES } from '../data/countries';

export function useQuizGame(mode: GameMode = 'classic') {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [stats, setStats] = useState<QuizStats>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    correctAnswers: 0,
    wrongAttempts: 0,
    lives: mode === 'lives' ? 3 : undefined,
  });

  const recentCountriesRef = useRef<string[]>([]);
  const isQuestionAnsweredRef = useRef(false);

  // Generate a robust new question with 4 unique options
  const generateQuestion = useCallback((round: number): Question => {
    // Exclude recent correct countries to avoid repetition
    const maxHistory = Math.min(15, Math.floor(COUNTRIES.length / 2));
    const availablePool = COUNTRIES.filter(
      (c) => !recentCountriesRef.current.slice(-maxHistory).includes(c.code)
    );

    const candidates = availablePool.length >= 4 ? availablePool : COUNTRIES;
    const correctIndex = Math.floor(Math.random() * candidates.length);
    const correctCountry = candidates[correctIndex];

    // Pick 3 distinct incorrect options
    const incorrectPool = COUNTRIES.filter((c) => c.code !== correctCountry.code);
    const shuffledIncorrect = [...incorrectPool].sort(() => 0.5 - Math.random());
    const wrongOptions = shuffledIncorrect.slice(0, 3);

    // Shuffle options together
    const allOptions = [correctCountry, ...wrongOptions].sort(() => 0.5 - Math.random());

    // Update history
    recentCountriesRef.current = [...recentCountriesRef.current.slice(-maxHistory), correctCountry.code];
    isQuestionAnsweredRef.current = false;

    return {
      round,
      correctCountry,
      options: allOptions,
    };
  }, []);

  const startNewGame = useCallback((gameMode: GameMode = mode) => {
    recentCountriesRef.current = [];
    isQuestionAnsweredRef.current = false;
    setCurrentRound(1);
    setStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      totalAnswered: 0,
      correctAnswers: 0,
      wrongAttempts: 0,
      lives: gameMode === 'lives' ? 3 : undefined,
      oneClickCount: 0,
      twoClickCount: 0,
      threeClickCount: 0,
      fourClickCount: 0,
    });
    const firstQ = generateQuestion(1);
    setCurrentQuestion(firstQ);
  }, [generateQuestion, mode]);

  const recordCorrectAnswer = useCallback((pts = 10, attempts = 1) => {
    isQuestionAnsweredRef.current = true;
    let nextStreak = 0;
    setStats((prev) => {
      nextStreak = prev.streak + 1;
      return {
        ...prev,
        score: prev.score + pts,
        streak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: prev.correctAnswers + 1,
        oneClickCount: (prev.oneClickCount ?? 0) + (attempts === 1 ? 1 : 0),
        twoClickCount: (prev.twoClickCount ?? 0) + (attempts === 2 ? 1 : 0),
        threeClickCount: (prev.threeClickCount ?? 0) + (attempts === 3 ? 1 : 0),
        fourClickCount: (prev.fourClickCount ?? 0) + (attempts >= 4 ? 1 : 0),
      };
    });
    return nextStreak;
  }, []);

  const recordWrongAnswer = useCallback(() => {
    setStats((prev) => {
      const updatedLives = prev.lives !== undefined ? Math.max(0, prev.lives - 1) : undefined;
      return {
        ...prev,
        streak: 0,
        wrongAttempts: prev.wrongAttempts + 1,
        lives: updatedLives,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    const nextR = currentRound + 1;
    setCurrentRound(nextR);
    const nextQ = generateQuestion(nextR);
    setCurrentQuestion(nextQ);
  }, [currentRound, generateQuestion]);

  return {
    currentRound,
    currentQuestion,
    stats,
    startNewGame,
    recordCorrectAnswer,
    recordWrongAnswer,
    nextQuestion,
  };
}
