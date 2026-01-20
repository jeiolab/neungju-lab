export interface Song {
  id: string;
  title: string;
  bpm: number;
  duration: number; // in seconds
  preference: number; // 1-5
}

export type SortField = 'bpm' | 'duration' | 'preference';
export type SortOrder = 'asc' | 'desc';

export interface SortCriteria {
  primary: SortField;
  primaryOrder: SortOrder;
  secondary?: SortField;
  secondaryOrder?: SortOrder;
}

export interface UserProject {
  problemDefinition: string;
  criteria: SortCriteria;
  explanation: string; // My own words explanation
  reflection: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  score: number;
  streak: number;
  lastVisit: string; // ISO date
  badges: string[];
  completedWizard: boolean;
  quizScore: number;
}