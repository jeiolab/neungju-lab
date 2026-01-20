export type ProblemType = 'COMPUTABLE' | 'NOT_COMPUTABLE' | 'CONDITIONAL';

export interface ProblemCard {
  id: string;
  title: string;
  description: string;
  correctType: ProblemType;
  missingElements?: string[]; // For CONDITIONAL: e.g., ['Initial State', 'Constraints']
  explanation: string;
}

export interface UserStats {
  score: number;
  streak: number;
  lastPlayedDate: string | null;
  badges: string[];
  solvedCount: number;
  refinedCount: number;
}

export interface RefinedProblem {
  originalId: string;
  title: string;
  userRefinement: string;
  timestamp: number;
}

export interface WrongNote {
  problemId: string;
  userChoice: ProblemType;
  timestamp: number;
}

export type TabView = 'THEORY' | 'GAME' | 'DEEP_DIVE' | 'QUIZ' | 'DISCUSSION' | 'PROFILE';

export enum QuestionType {
  CLASSIFY = 'CLASSIFY',
  FILL_BLANK = 'FILL_BLANK'
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}
