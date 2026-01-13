export type TabType = 'theory' | 'puzzle' | 'simulation' | 'quiz' | 'reflection';

export interface PuzzlePiece {
  id: string;
  text: string;
  description: string;
}

export interface Point {
  x: number;
  y: number;
  clusterIndex: number; // -1 if unassigned
}

export interface Centroid {
  x: number;
  y: number;
  color: string;
}

export interface SimulationState {
  points: Point[];
  centroids: Centroid[];
  k: number;
  iteration: number;
  isConverged: boolean;
  history: { iteration: number; centroids: Centroid[] }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface GameState {
  score: number;
  badges: Badge[];
  puzzleCompleted: boolean;
  maxLevel: number;
}
