export enum AppView {
  DASHBOARD = 'DASHBOARD',
  THEORY = 'THEORY',
  PUZZLE = 'PUZZLE',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export enum PuzzleDifficulty {
  EASY = 'EASY', // 4 Stages only
  MEDIUM = 'MEDIUM', // 4 Stages + 3 Tokens
  HARD = 'HARD', // Scenario Matching
}

export interface StageCard {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  misconception: string;
  example: string;
}

export interface PuzzleItem {
  id: string;
  type: 'STAGE' | 'TOKEN';
  label: string;
  description?: string;
  correctSlotIndex?: number; // For easy/medium: strictly ordered
  correctSlotId?: string; // For tokens
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserStats {
  puzzleStreak: number;
  lastPlayedDate: string | null;
  badges: string[];
  quizScore: number;
  puzzleCompletes: {
    [key in PuzzleDifficulty]: number;
  };
}
