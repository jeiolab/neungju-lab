export interface UserStats {
  xp: number;
  level: number;
  badges: string[];
  simulationCount: number;
  highAccuracyCount: number; // Count of runs with >= 80% accuracy
  quizScore: number;
}

export interface SimulationConfig {
  dataCount: number;
  useKeyword: boolean;
  useLinks: boolean;
  useExclamation: boolean;
}

export interface SimulationResult {
  accuracy: number;
  timestamp: number;
  config: SimulationConfig;
  feedback: string[];
}

export interface EmailData {
  id: number;
  isSpam: boolean;
  hasKeyword: boolean; // "Free", "Winner", etc.
  linkCount: number;
  exclamationCount: number;
}

export enum QuizType {
  OX = 'OX',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY'
}

export interface QuizQuestion {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: QuizType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string; // Or boolean string "true"/"false"
  explanation: string;
}

export interface ReflectionEntry {
  id: string;
  question: string;
  answer: string;
}
