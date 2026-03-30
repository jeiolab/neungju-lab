export type ScenarioId = 'huge-data' | 'low-memory' | 'almost-sorted' | 'predictable';

export interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  icon: string;
}

export type AlgorithmId = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

export interface Algorithm {
  id: AlgorithmId;
  name: string;
  description: string;
  complexityTime: string;
  complexitySpace: string;
  isStable: boolean;
  baseScores: {
    time: number;
    memory: number;
    predictability: number;
  };
}

export interface UserState {
  level: number;
  xp: number;
  badges: string[];
  scenariosCompleted: string[];
  streak: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Recommendation {
  primary: Algorithm;
  alternative: Algorithm;
  reasoning: {
    time: string;
    memory: string;
    predictability: string;
  };
}
