export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type DecisionType = 'NO_ML' | 'YES_ML' | 'HARD_ML';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  correctDecision: DecisionType;
  expertReasoning: string;
  counterExample: string; // 반례
  category: 'SCHOOL' | 'LIFE' | 'ART' | 'ETHICS';
}

export interface QuizQuestion {
  id: string;
  difficulty: Difficulty;
  type: 'MULTIPLE' | 'SHORT_ANSWER';
  question: string;
  options?: string[];
  answer: string | string[]; // Array for keywords in short answer
  explanation: string;
  conceptTag: string;
  retryQuestion?: {
    question: string;
    answer: string | string[];
    explanation: string;
  }
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastPlayedDate: string;
  badges: string[];
  masteryByConcept: Record<string, number>; // 0-100
  wrongNotes: {
    questionId: string;
    question: string;
    myAnswer: string;
    correctAnswer: string;
    explanation: string;
    timestamp: number;
  }[];
}

export interface EvaluationCriteria {
  dataQuality: number; // 1-5
  pattern: number;
  prediction: number;
  automation: number;
  creativity: number;
  deduction: number;
}
