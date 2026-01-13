export interface DataRow {
  id: string; // Unique internal ID for React keys
  studentId: string | number;
  name: string;
  age: number | null | string; // Dirty data can be string or null
  satisfaction: number | null | string; // 1-5, but can be dirty
  attendance: number | null | string; // %
  isDuplicate?: boolean;
}

export type CellValue = string | number | null;

export interface GameLevel {
  level: number;
  description: string;
  rows: number;
  defects: {
    nan: number;
    outliers: number;
    duplicates: number;
    typos: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  INSIGHTS = 'insights',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion',
}

export interface UserStats {
  streak: number;
  lastLogin: string;
  maxScore: number;
  clearedStages: number;
}
