export type Difficulty = 'easy' | 'normal' | 'hard';

export type Concept = 'sequence' | 'selection' | 'iteration' | 'indentation' | 'logic' | 'nested';

export interface UserState {
  points: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  masteryByConcept: Record<Concept, number>;
  badges: string[];
}

export interface QuizQuestion {
  id: number;
  difficulty: Difficulty;
  type: 'multiple' | 'short' | 'narrative';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[]; // Array for multiple acceptable keywords
  concept: Concept;
  explanation: string; // Why logic
}

export interface WrongNote {
  questionId: number;
  userAnswer: string;
  timestamp: number;
  concept: Concept;
}

export interface SimulationConfig {
  startTime: number; // Minutes from midnight (e.g., 8:00 AM = 480)
  budget: number;
  isRaining: boolean;
  busWaitTime: number;
  walkTime: number;
  lateThreshold: number; // School starts at (e.g., 8:30 = 510)
}

export interface ReflectionEntry {
  id: string;
  type: 'change_condition' | 'find_counter' | 'design_apply';
  content: string;
  date: string;
}
