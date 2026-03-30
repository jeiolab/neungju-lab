export type CellType = 'FOREST' | 'ROCK' | 'WATER' | 'VILLAGE';

export interface GridCell {
  x: number;
  y: number;
  type: CellType;
  hasSensor: boolean;
  temp: number; // Current simulated temperature
  isOnFire: boolean;
}

export interface SimulationResult {
  detectedAt: number | null; // Time step when detected, null if failed
  costUsed: number;
  falseAlarms: number;
  burnedArea: number;
  success: boolean;
  score: number;
}

export interface DailyRecord {
  date: string;
  seed: string;
  completed: boolean;
  score: number;
  metrics: SimulationResult;
  reflection: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface UserState {
  level: number;
  exp: number;
  streak: number;
  lastLoginDate: string;
  history: DailyRecord[];
  wrongAnswers: number[]; // IDs of wrong answers
}

export type SensitivityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500];