export type ViewState = 'dashboard' | 'theory' | 'simulation' | 'quiz' | 'reflection';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  basePublicGood: number; // Base score for public good depending on scenario nature
}

export interface DataCategory {
  id: string;
  label: string;
  riskFactor: number;
  convenienceFactor: number;
  publicGoodFactor: number;
}

export interface ProtectionMeasure {
  id: string;
  label: string;
  riskReduction: number;
  convenienceCost: number; // Some measures might reduce convenience (e.g., 2FA)
}

export interface SimulationScores {
  convenience: number;
  risk: number;
  publicGood: number;
  balance: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  relatedConcept: string;
}

export interface UserHistory {
  scenarioId: string;
  score: SimulationScores;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}