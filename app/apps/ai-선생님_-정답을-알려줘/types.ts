export enum AppTab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  REAL_WORLD = 'real_world',
  QUIZ = 'quiz',
  CLEANING = 'cleaning',
  DISCUSSION = 'discussion'
}

export interface TrainingDataPoint {
  step: number;
  accuracy: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CleaningItem {
  id: number;
  imageEmoji: string;
  assignedLabel: string;
  isCorrect: boolean;
}