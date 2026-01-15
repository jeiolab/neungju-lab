export enum TabType {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  DEEP_DIVE = 'DEEP_DIVE',
  QUIZ = 'QUIZ',
  DISCUSSION = 'DISCUSSION'
}

export interface EmailData {
  id: number;
  subject: string;
  body: string;
  isSpam: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SimulationResult {
  step: number;
  accuracy: number;
}
