export interface DataPoint {
  id: number;
  x: number; // Primary feature (e.g., Study Time or kWh)
  x2?: number; // Sleep
  x3?: number; // Absence
  y: number; // Target (Score or CO2)
  isOutlier: boolean;
}

export interface RegressionResult {
  slope: number; // For simple regression or primary coefficient
  intercept: number;
  weights?: number[]; // For multiple regression [intercept, w1, w2, w3...]
  mae: number;
  rmse: number;
}

export enum SimulationMode {
  SCORE = 'SCORE',
  CARBON = 'CARBON'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserState {
  level: number;
  xp: number;
  badges: Badge[];
  dailyMissionCompleted: boolean;
}