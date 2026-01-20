export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface Link {
  source: string;
  target: string;
  weight?: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
  startNodeId: string;
  targetNodeId: string;
}

export enum AlgoType {
  DFS = 'DFS',
  BFS = 'BFS',
}

export interface DailyMissionState {
  date: string;
  completed: boolean;
  score: number;
  algoUsed?: AlgoType;
}

export interface UserStats {
  streak: number;
  lastMissionDate: string; // YYYY-MM-DD
  totalXP: number;
  level: number;
  badges: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
}
