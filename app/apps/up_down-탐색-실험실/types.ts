export type Strategy = 'LINEAR' | 'BINARY' | 'RANDOM';

export interface GameConfig {
  min: number;
  max: number;
  target: number;
  strategy: Strategy;
  isPractice: boolean;
}

export interface GuessLog {
  guess: number;
  result: 'UP' | 'DOWN' | 'CORRECT';
  timestamp: number;
  rangeAfter: { min: number; max: number };
  suggestion?: string; // Coach feedback
}

export interface GameState {
  isPlaying: boolean;
  isWon: boolean;
  attempts: number;
  currentMin: number;
  currentMax: number;
  logs: GuessLog[];
  startTime: number;
}

export interface UserStats {
  totalGames: number;
  bestAttempts: Record<string, number>; // key: "min-max"
  totalAttempts: number;
  streak: number;
  lastPlayed: string; // ISO Date
  badges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats, currentGame?: GameState, config?: GameConfig) => boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}
