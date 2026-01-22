export type TechType = 'symmetric' | 'asymmetric' | 'hash' | 'hybrid';

export interface TechInfo {
  id: TechType;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestUse: string;
}

export interface Scenario {
  id: number;
  client: string;
  role: string;
  description: string;
  reqSecurity: number; // 1-10
  reqSpeed: number; // 1-10
  reqConvenience: number; // 1-10
  correctTech: TechType;
  budgetSensitivity: 'low' | 'medium' | 'high'; // 'low' means they don't care about cost (high budget ok)
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface GameState {
  score: number;
  scenariosCompleted: number;
  history: {
    scenarioId: number;
    success: boolean;
    points: number;
  }[];
}