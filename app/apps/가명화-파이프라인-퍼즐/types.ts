export type TabType = 'concepts' | 'puzzle' | 'metadata' | 'quiz' | 'design';

export enum Difficulty {
  EASY = '쉬움',
  MEDIUM = '보통',
  HARD = '도전'
}

export interface TheoryCard {
  id: string;
  term: string;
  definition: string;
  icon: string;
}

export interface PuzzleStep {
  id: string;
  title: string;
  description: string;
  options: {
    label: string;
    riskEffect: number; // -10 to 10
    utilityEffect: number; // -10 to 10
  }[];
  selectedOptionIndex: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
}

export interface SimulationResult {
  risk: number; // 0-100
  utility: number; // 0-100
  feedback: string[];
  score: number; // 0-3 stars
}