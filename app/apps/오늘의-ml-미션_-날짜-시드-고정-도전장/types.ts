export enum MLType {
  SUPERVISED = '지도학습',
  UNSUPERVISED = '비지도학습',
  REINFORCEMENT = '강화학습',
  TRADITIONAL = '전통적 기법'
}

export interface DailyTheme {
  type: MLType;
  title: string;
  description: string;
  keyConcepts: Array<{ title: string; content: string }>;
}

export interface UserProgress {
  streak: number;
  lastCompletedDate: string | null;
  totalPoints: number;
  frozenStreakAvailable: boolean;
  history: Record<string, boolean>; // date string -> completed
  badges: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // index
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type ViewState = 'HOME' | 'MISSION' | 'QUIZ' | 'REFLECTION' | 'CALENDAR';

export interface DailySeedData {
  seed: number;
  dateStr: string;
}