export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  ADVANCED = 'ADVANCED',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

export interface DataPoint {
  id: number;
  x: number; // 공부 시간
  y: number; // 성적
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface SimulationStats {
  mse: number;
  bestMse: number;
}