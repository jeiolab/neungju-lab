export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Concept {
  id: string;
  term: string;
  definition: string;
  example: string;
  category: 'Core' | 'Extended';
  relatedDeepDive?: string; 
}

export interface MasteryState {
  [conceptId: string]: number; // 0 to 100
}

export interface UserStats {
  level: number;
  xp: number;
  title: string;
  badges: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export enum Tab {
  CARDS = 'cards',
  MATCHING = 'matching',
  DEEP_DIVE = 'deep_dive',
  QUIZ = 'quiz',
  REFLECTION = 'reflection',
}
