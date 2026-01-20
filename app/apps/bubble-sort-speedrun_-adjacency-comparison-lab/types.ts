export interface Student {
  id: string;
  height: number;
}

export enum GameState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export interface SimulationStats {
  comparisons: number;
  swaps: number;
  startTime: number | null;
  endTime: number | null;
}

export interface QuizQuestion {
  id: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  question: string;
  options: string[]; // For multiple choice
  correctAnswer: string; // Or index
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';
  explanation: string;
}

export interface UserData {
  level: number;
  xp: number;
  streak: number;
  lastLogin: string;
  badges: string[];
  history: {
    date: string;
    comparisons: number;
    swaps: number;
    timeMs: number;
    arraySize: number;
  }[];
  mistakeNote: number[]; // IDs of wrong questions
  mastery: {
    concept: number; // 0-100
    mechanism: number;
    complexity: number;
  };
}

export interface FeedbackData {
  meaning: string;
  impact: string;
  next: string;
}
