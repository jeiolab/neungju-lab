// Graph Types
export interface Node {
  id: string;
  label: string; // Nickname
  x?: number;
  y?: number;
  vx?: number;
}

export type RelationType = 'BEST_FRIEND' | 'CLASSMATE' | 'CLUB_MEMBER' | 'FRIEND_OF_FRIEND';

export interface Edge {
  source: string | Node; // D3 transforms string ID to Node object
  target: string | Node;
  type: RelationType;
  weight: number; // 0.0 to 1.0
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// Simulation Types
export interface SimulationSettings {
  weights: Record<RelationType, number>;
  goalTarget: number; // e.g., reach 20 people
}

export interface SimulationResult {
  reachedNodes: string[];
  totalReach: number;
  steps: number;
  startNodeId: string;
}

// User Progress Types
export interface UserStats {
  streak: number;
  lastLogin: string;
  badges: string[];
  totalSimulations: number;
  masteryScore: number; // 0-100
  wrongNotes: string[]; // List of concept IDs missed
}

// Decomposition Step
export enum ProblemStep {
  COLLECT = "관계 수집",
  MODEL = "모델 만들기",
  COMPARE = "후보 비교",
  SELECT = "최종 선택"
}

export interface FeedbackData {
  whyGood: string;
  bottleneck: string;
  suggestion: string;
}