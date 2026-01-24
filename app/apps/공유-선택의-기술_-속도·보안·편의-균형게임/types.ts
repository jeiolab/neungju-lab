export interface Scenario {
  id: string;
  title: string;
  description: string;
  recommendedWeights: { speed: number; security: number; convenience: number };
}

export interface SharingMethod {
  id: string;
  name: string;
  type: 'physical' | 'wireless' | 'cloud';
  stats: {
    speed: number;
    security: number;
    convenience: number;
  };
  description: string;
}

export interface SimulationResult {
  scenarioId: string;
  weights: { speed: number; security: number; convenience: number };
  selectedMethodId: string;
  timestamp: number;
  aiExplanation?: string;
  score: number;
}

export interface UserState {
  level: number;
  exp: number;
  badges: string[];
  history: SimulationResult[];
  quizScore: number;
  policies: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CloudServiceType {
  id: string;
  name: string; // IaaS, PaaS, SaaS
  description: string;
  examples: string[];
}
