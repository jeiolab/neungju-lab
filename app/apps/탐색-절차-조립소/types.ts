export type AlgorithmType = 'BINARY_SEARCH' | 'DFS' | 'BFS';

export interface PuzzleBlock {
  id: string;
  text: string;
  order: number; // The correct order index (0-based)
  description?: string; // For custom editing
}

export interface SimulationStep {
  highlightIndices?: number[]; // For Array
  highlightNodes?: string[]; // For Graph
  activeLine?: string; // ID of the puzzle block currently active
  message: string;
  variables?: Record<string, string | number>;
}

export interface GraphData {
  nodes: { id: string; x: number; y: number; label: string }[];
  edges: { source: string; target: string }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface UserProgress {
  score: number;
  level: number;
  badges: string[];
  puzzleScores: Record<AlgorithmType, number>;
}
