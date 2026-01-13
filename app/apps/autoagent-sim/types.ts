export type TabId = 'theory' | 'simulation' | 'info' | 'quiz' | 'ethics';

export interface AgentStats {
  speed: number;
  safety: number;
  social: number;
}

export interface SimulationResult {
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  outcome: string;
  description: string;
  analysis: string; // Must contain key terms
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export enum GameState {
  IDLE,
  RUNNING,
  COMPLETED,
  ERROR
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
