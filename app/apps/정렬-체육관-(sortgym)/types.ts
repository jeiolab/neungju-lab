export type AlgorithmType = 'Selection' | 'Bubble' | 'Insertion' | 'Quick' | 'Merge';

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  keywords: string[];
  bestCase: string;
  avgCase: string;
  worstCase: string;
  codePython: string;
  codePseudo: string;
  pros: string[];
  cons: string[];
}

export type QuestionType = 'multiple-choice' | 'fill-in-blank' | 'flashcard';

export interface Question {
  id: string;
  type: QuestionType;
  category: AlgorithmType | 'General';
  question: string;
  options?: string[]; // For multiple choice
  answer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UserStats {
  masteryScore: number; // 0-100
  streak: number;
  lastLogin: string;
  solvedCount: number;
  correctCount: number;
  weaknesses: { [key in AlgorithmType]?: number }; // count of wrong answers per algo
  history: { date: string; score: number }[];
}

export interface GameCard {
  id: string;
  content: string;
  type: 'name' | 'concept';
  matchId: string;
  isFlipped: boolean;
  isMatched: boolean;
}
