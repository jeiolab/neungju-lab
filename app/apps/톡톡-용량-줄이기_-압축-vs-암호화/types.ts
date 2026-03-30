export interface ConceptCard {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: {
    text: string;
    correction: string;
  };
  checkQuestion: {
    question: string;
    answer: string;
  };
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  baseSize: string;
  targets: {
    quality: number; // 0-100 importance
    speed: number;   // 0-100 importance
    security: number; // 0-100 importance
  };
  recommended: {
    compression: 'lossless' | 'lossy' | 'none';
    encryption: boolean;
  };
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: number;
  type: 'choice' | 'ox' | 'short' | 'essay' | 'category';
  difficulty: QuizDifficulty;
  question: string;
  options?: string[]; // For choice or category
  correctAnswer: string | string[]; // Array for multiple correct or category matching
  feedback: {
    reason: string;
    correction: string;
    retry?: string;
  };
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  badges: string[];
  completedConcepts: string[];
  mastery: {
    [key: string]: number; // concept ID -> score 0-100
  };
  wrongNotes: number[]; // Array of question IDs
  reflections: {
    [key: string]: string; // reflection ID -> user answer
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: UserState) => boolean;
}