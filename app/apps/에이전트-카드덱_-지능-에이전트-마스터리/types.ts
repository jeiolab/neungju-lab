export interface ConceptCard {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string; // School life example
  misconception: {
    common: string;
    correction: string;
  };
  checkQuestion: {
    question: string;
    answer: string;
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple' | 'short' | 'narrative';
  difficulty: 'easy' | 'normal' | 'challenge';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string; // Or keyword for short answer
  explanation: string; // "Why it's wrong"
  correction: string; // "Correction statement"
  retryQuestion?: {
    question: string;
    options?: string[];
    correctAnswer: string;
  };
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  tags: string[];
}

export interface UserProfile {
  score: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  mastery: Record<string, number>; // cardId -> mastery score (0-100)
  badges: string[];
  quizHistory: {
    quizId: string;
    isCorrect: boolean;
    timestamp: number;
  }[];
  userExamples: Record<string, string>; // term -> user's example
  reflections: Record<string, any>;
}

export const MASTERY_WEIGHTS = {
  REVIEW_COUNT: 10,
  QUIZ_CORRECT: 40,
  CONFIDENCE: 30,
  RECENCY: 20,
};