export type Genre = 'HipHop' | 'Ballad' | 'Idol' | 'Indie';

export interface DataPoint {
  id: number;
  x: number; // e.g., Study Time
  y: number; // e.g., Phone Usage or Money
  genre: Genre;
}

export type DistanceMetric = 'Euclidean' | 'Manhattan';

export interface GameState {
  badges: string[];
  conceptsRead: boolean;
  simulationExplored: boolean;
  quizScore: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AxisConfig {
  label: string;
  min: number;
  max: number;
  unit: string;
}

export interface DatasetScenario {
  id: string;
  name: string;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  description: string;
  points: DataPoint[];
}