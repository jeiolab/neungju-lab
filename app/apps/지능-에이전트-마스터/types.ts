export type Difficulty = '하' | '중' | '상';

export interface Concept {
  id: string;
  title: string;
  definition: string;
  example: string;
  misconception: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
}

export interface ThinkingPrompt {
  id: number;
  title: string;
  prompt: string;
}

export interface UserStats {
  level: number;
  xp: number;
  conceptsRead: string[]; // IDs of read concepts
  quizzesSolved: number; // Count of solved quizzes
  unlockedBadges: string[];
}

export enum TabView {
  CONCEPT = 'CONCEPT',
  OX = 'OX',
  DICTIONARY = 'DICTIONARY',
  TEST = 'TEST',
  THINKING = 'THINKING'
}
