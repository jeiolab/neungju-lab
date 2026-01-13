export enum AppTab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  REAL_WORLD = 'REAL_WORLD',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export enum BlockType {
  LOAD = 'LOAD',
  CLEAN = 'CLEAN',
  INTEGRATE = 'INTEGRATE',
  REDUCE = 'REDUCE',
  NORMALIZE = 'NORMALIZE',
  TRAIN = 'TRAIN',
}

export interface ETLBlock {
  id: string; // unique instance id
  type: BlockType;
  label: string;
  description: string;
  iconName: string; // Lucide icon name mapping
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface SimulationResult {
  success: boolean;
  message: string;
  logs: string[];
  score: number;
}
