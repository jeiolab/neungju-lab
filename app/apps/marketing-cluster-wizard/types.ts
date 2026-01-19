export interface DataPoint {
  id: number;
  height: number;
  weight: number;
  clusterId?: number;
}

export interface Cluster {
  id: number;
  color: string;
  name: string;
  centroid: { height: number; weight: number };
  points: DataPoint[];
}

export enum Tab {
  BASICS = 'basics',
  SIMULATION = 'simulation',
  CASES = 'cases',
  QUIZ = 'quiz',
  REFLECTION = 'reflection',
}

export interface QuizScore {
  name: string;
  score: number;
  date: string;
}

export type GeminiAnalysisStatus = 'idle' | 'loading' | 'success' | 'error';
