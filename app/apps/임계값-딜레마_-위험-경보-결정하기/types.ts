export interface DataPoint {
  id: number;
  x1: number; // e.g., Distance or Days Left
  x2: number; // e.g., Sleep Time or Difficulty
  actualLabel: 0 | 1; // 0: Safe, 1: Risk
  probability?: number;
  predictedLabel?: 0 | 1;
}

export enum DatasetType {
  LATENESS = 'LATENESS', // 지각 위험
  ASSIGNMENT = 'ASSIGNMENT' // 과제 미제출 위험
}

export interface SimulationStats {
  tp: number; // True Positive (Risk Correctly Identified)
  tn: number; // True Negative (Safe Correctly Identified)
  fp: number; // False Positive (False Alarm - Crying Wolf)
  fn: number; // False Negative (Missed Risk - Dangerous)
  accuracy: number;
  safetyScore: number; // Penalizes FN heavily
  efficiencyScore: number; // Penalizes FP
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type TabState = 'CONCEPT' | 'SIMULATION' | 'QUIZ';