export enum GoalType {
  SAFETY = '안전 최우선',
  CONGESTION = '혼잡 최소화',
  SATISFACTION = '만족도 최대화'
}

export interface SimulationConfig {
  autonomy: number;
  cooperation: number;
  goal: GoalType;
}

export interface SimulationResult {
  score: number;
  feedback: string;
  config: SimulationConfig;
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type TabView = 'THEORY' | 'SIMULATION' | 'QUIZ' | 'REFLECTION' | 'MORE_INFO';