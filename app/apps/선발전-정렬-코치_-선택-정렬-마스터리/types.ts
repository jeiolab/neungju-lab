export interface Student {
  id: string;
  name: string;
  korean: number;
  math: number;
  info: number;
  total: number;
}

export interface ConceptCard {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: {
    myth: string;
    truth: string;
  };
  checkQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface QuizQuestion {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple' | 'short';
  question: string;
  options?: string[]; // Only for multiple choice
  correctAnswer: string;
  feedback: {
    reason: string;
    correction: string;
    retryQuestion: string; // Simplified for the retry mechanism
  };
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  badges: string[];
  conceptMastery: Record<string, number>; // cardId -> 0-100
  completedQuizzes: number[];
  quizHistory: QuizHistoryItem[];
}

export interface QuizHistoryItem {
  questionId: number;
  isCorrect: boolean;
  userAnswer: string;
  timestamp: number;
}

export type SortOrder = 'asc' | 'desc';
export type SortCriteria = 'total' | 'info' | 'korean';

export interface SortState {
  stepIndex: number; // Current 'i' in selection sort
  compareIndex: number; // Current 'j' being compared
  minIndex: number; // Current minimum found so far
  sortedCount: number; // How many are fully sorted
  comparisons: number;
  swaps: number;
  students: Student[];
  finished: boolean;
  log: string;
}
