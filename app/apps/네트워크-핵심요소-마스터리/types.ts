export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Concept {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: {
    wrong: string;
    right: string;
  };
  checkQuestion: {
    question: string;
    answer: string;
    options: string[];
  };
}

export interface SimulationScenario {
  media: 'wired' | 'wireless';
  distance: 'short' | 'medium' | 'long';
}

export interface SimulationResult {
  score: number;
  reasons: string;
  tip: string;
  recommendation: string;
}

export interface Question {
  id: string;
  type: 'multiple' | 'short' | 'narrative';
  difficulty: Difficulty;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: number | string[]; // Index for multiple, array of valid strings for short
  keywords?: string[]; // For narrative
  explanation: string;
  correction: string;
}

export interface UserState {
  mastery: Record<string, number>; // conceptId -> score (0-100)
  totalScore: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  badges: string[];
  wrongNotes: {
    questionId: string;
    timestamp: number;
    userAnswer: string;
  }[];
  layout: NetworkItem[];
  simulationHistory: SimulationScenario[];
}

export interface NetworkItem {
  id: string;
  type: 'laptop' | 'printer' | 'router' | 'switch' | 'server';
  x: number;
  y: number;
}
