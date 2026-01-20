export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  EFFICIENCY = 'EFFICIENCY',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface SimulationState {
  originalArray: number[];
  currentArray: number[];
  pivotIndex: number | null;
  leftPartition: number[];
  rightPartition: number[];
  status: 'SELECT_PIVOT' | 'PARTITIONING' | 'COMPLETED';
  score: number;
  history: string[]; // Log of actions
}
