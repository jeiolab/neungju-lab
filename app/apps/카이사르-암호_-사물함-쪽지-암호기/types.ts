export type TabId = 'theory' | 'simulation' | 'history' | 'quiz' | 'reflection';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  exp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  simulationCount: number;
  decryptionSuccessCount: number;
  badges: Badge[];
  quizScore: number;
  dailyMissionCompleted: boolean;
  dailyMissionDate: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
  tags: string[]; // e.g., '치환', '키', '한계'
}

export interface IncorrectQuestion {
  questionId: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
  tags: string[];
  date: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
}

export enum CipherMode {
  ENCRYPT = 'ENCRYPT',
  DECRYPT = 'DECRYPT'
}
