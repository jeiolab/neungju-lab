export type Era = '2025' | '2045';

export enum ConceptType {
  CONNECTIVITY = '초연결 (Hyper-connectivity)',
  INTELLIGENCE = '초지능 (Hyper-intelligence)',
  CONVERGENCE = '초융합 (Hyper-convergence)',
  NONE = '기타',
}

export interface GameCard {
  id: string;
  title: string;
  description: string;
  era: Era;
  concept: ConceptType;
  imageKeyword: string; // Used for placeholder images
}

export interface SectorInfo {
  id: string;
  sector: string;
  current: string;
  future: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  aiFeedback?: string;
}

export interface UserStats {
  score: number;
  totalPlayed: number;
  rank: string;
}