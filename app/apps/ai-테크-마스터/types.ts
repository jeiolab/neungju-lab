export type TechCategory = 'VISION' | 'NLP' | 'GEN_AI';

export interface ConceptCard {
  id: string;
  category: TechCategory;
  title: string;
  description: string;
  keywords: string[];
  iconName: string;
}

export interface SimulationItem {
  id: string;
  name: string;
  description: string;
  correctCategory: TechCategory;
  iconName: string;
}

export interface QuizQuestion {
  id: string;
  category: TechCategory;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface MasteryState {
  VISION: number;
  NLP: number;
  GEN_AI: number;
}

export interface UserStats {
  correctCount: number;
  totalAttempts: number;
  badges: string[];
}