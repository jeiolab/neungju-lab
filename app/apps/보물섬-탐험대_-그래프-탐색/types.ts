export interface Point {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  isTreasure?: boolean;
}

export interface Edge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export enum AlgorithmType {
  BFS = 'BFS',
  DFS = 'DFS',
}

export interface SimulationStep {
  visitedNodes: string[]; // Order of visitation
  currentPath: string[]; // Current recursion stack or path being considered
  activeNode: string | null;
}

export interface PuzzleLevel {
  id: number;
  name: string;
  difficulty: '쉬움' | '보통' | '어려움';
  graph: GraphData;
  startNodeId: string;
  targetNodeId: string;
  minMoves: number;
}