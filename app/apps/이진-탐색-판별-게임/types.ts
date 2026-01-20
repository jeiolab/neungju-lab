export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

export enum GameMode {
  DASHBOARD = 'DASHBOARD',
  THEORY = 'THEORY',
  GAME = 'GAME',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

export type AnswerType = 'POSSIBLE' | 'IMPOSSIBLE' | 'CONDITIONAL';

export interface Scenario {
  id: string;
  category: 'SCHOOL' | 'LIFE' | 'CAREER';
  description: string;
  dataState: 'SORTED' | 'UNSORTED' | 'DYNAMIC';
  target: 'EXISTENCE' | 'LOCATION' | 'SHORTEST_PATH';
  correctAnswer: AnswerType;
  explanation: string; // Why it is/isn't possible
  difficulty: Difficulty;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserStats {
  score: number;
  streak: number;
  maxStreak: number;
  totalPlayed: number;
  badges: string[];
  misconceptions: {
    ignoreSorting: number; // Ignored that binary search needs sorting
    alwaysFast: number; // Thought binary is always faster than linear
    dynamicCost: number; // Ignored cost of maintaining sort in dynamic data
  };
  wrongNotes: Scenario[]; // History of wrong answers
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}