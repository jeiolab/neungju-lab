export type Tab = 'concept' | 'game' | 'learn' | 'quiz' | 'reflection';

export enum DistanceMetric {
  EUCLIDEAN = 'Euclidean',
  MANHATTAN = 'Manhattan',
}

export enum DatasetType {
  STUDY_SLEEP = 'STUDY_SLEEP',
  LATENESS_DISTANCE = 'LATENESS_DISTANCE',
  CO2_WINDOW = 'CO2_WINDOW',
}

export interface DataPoint {
  id: number;
  x: number;
  y: number;
  isAnomaly: boolean; // Mathematically determined by current threshold
  userSelected: boolean;
  distance: number; // Calculated distance from center
}

export interface GameState {
  score: number;
  combo: number;
  round: number;
  maxRounds: number;
  badges: string[];
}
