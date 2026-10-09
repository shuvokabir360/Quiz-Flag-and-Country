export type Continent =
  | 'Asia'
  | 'Europe'
  | 'Africa'
  | 'North America'
  | 'South America'
  | 'Oceania';

export interface Country {
  code: string; // ISO 2-letter code e.g. "BD", "JP", "US"
  name: string; // e.g. "Bangladesh", "Japan"
  continent: Continent;
  capital?: string;
  flagSvg?: string; // High-quality standalone clean SVG markup or SVG data URI
  flagUrl?: string; // Static local URL e.g. "/flags/bd.svg"
  aspectRatio?: string; // default "3 / 2"
}

export interface Question {
  round: number;
  correctCountry: Country;
  options: Country[]; // Exactly 4 countries, shuffled
}

export type GameScreen = 'home' | 'game' | 'result';

export type QuizCategory = 'country' | 'capital';

export type GameMode = 'classic' | 'challenge10' | 'time' | 'lives' | 'capital';

export interface GameSettings {
  soundEffects: boolean;
  voice: boolean;
  music: boolean;
  reducedMotion: boolean;
  vibration: boolean;
  answerDisplayTime: number; // in seconds: 2, 3, 5, 8, 10 (default 5)
  keepScreenAwake: boolean; // Keep mobile screen awake / prevent display off
}

export interface QuizStats {
  score: number;
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  correctAnswers: number;
  wrongAttempts: number;
  lives?: number;
  timeRemaining?: number;
  oneClickCount?: number;
  twoClickCount?: number;
  threeClickCount?: number;
  fourClickCount?: number;
}
