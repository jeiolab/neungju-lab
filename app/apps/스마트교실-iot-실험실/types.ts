export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  EXPLORE = 'EXPLORE',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

export interface UserState {
  level: number;
  exp: number;
  badges: string[];
  stamps: Record<string, number>; // Scenario ID -> Max Score
  streak: number;
  completedScenarios: string[];
}

export interface SimulationResult {
  convenience: number;
  safety: number;
  dependency: number;
  feedback: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: '쉬움' | '보통' | '어려움';
}
