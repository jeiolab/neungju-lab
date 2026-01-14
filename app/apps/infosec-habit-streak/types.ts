export enum Difficulty {
  EASY = '초급',
  MEDIUM = '중급',
  HARD = '고급',
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
  difficulty: Difficulty;
  conceptTag: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  actionType: 'CHECK' | 'INPUT' | 'QUIZ';
  relatedConcept: {
    title: string;
    description: string;
  };
  sharingVsProtection: {
    personal: string;
    corporate: string;
    national: string;
  };
  thinkPrompts: string[];
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  completed: boolean;
  reflection?: string;
  quizScore?: number;
}

export interface UserState {
  xp: number;
  level: number;
  currentStreak: number;
  maxStreak: number;
  badges: string[];
  lastLoginDate: string;
  history: Record<string, DailyRecord>; // Key is YYYY-MM-DD
  quizHistory: {
    totalAttempted: number;
    totalCorrect: number;
    weaknessTags: Record<string, number>; // Tag -> incorrect count
  };
}
