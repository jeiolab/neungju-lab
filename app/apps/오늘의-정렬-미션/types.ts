export type MissionType = 'TRUE_FALSE' | 'COMPARE_COUNT' | 'ALGO_SELECT';
export type ContextType = 'SCHOOL_NOTICE' | 'CLUB_APPLICANT' | 'LIBRARY_BOOK';

export interface ConceptCard {
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface Mission {
  id: string;
  date: string;
  type: MissionType;
  context: ContextType;
  title: string;
  question: string;
  options?: string[];
  answer: string | number;
  explanation: string;
  concepts: ConceptCard[];
}

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  maxStreak: number;
  lastCompletedDate: string | null;
  badges: string[];
  history: Record<string, DailyRecord>; // date -> record
  weaknesses: string[]; // concepts missed
}

export interface DailyRecord {
  completed: boolean;
  score: number;
  missionCorrect: boolean;
  quizScore: number; // out of 10
  recovered: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tag: string;
}
