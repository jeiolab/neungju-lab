export interface Point {
  id: number;
  x: number;
  y: number;
  clusterIndex: number; // -1 if unassigned
}

export interface Centroid {
  id: number;
  x: number;
  y: number;
  color: string;
}

export enum SimulationStep {
  IDLE = 'IDLE',
  ASSIGNED = 'ASSIGNED',
  UPDATED = 'UPDATED',
  CONVERGED = 'CONVERGED',
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserStats {
  level: number;
  exp: number;
  experimentsCompleted: number;
}
