export type Difficulty = 'easy' | 'medium' | 'hard';
export type ConceptId = 'linear_def' | 'binary_def' | 'comparison' | 'prerequisites';

export interface ConceptCard {
  id: ConceptId;
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
    answer: boolean; // True for O, False for X
    explanation: string;
  };
}

export interface QuizQuestion {
  id: string;
  conceptId: ConceptId;
  difficulty: Difficulty;
  question: string;
  options: string[]; // For multiple choice
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  mastery: Record<ConceptId, number>; // 0 to 100
  badges: string[];
  quizHistory: {
    timestamp: number;
    score: number;
    total: number;
    difficulty: Difficulty;
  }[];
  wrongNotes: string[]; // IDs of wrong questions
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: UserState) => boolean;
}
