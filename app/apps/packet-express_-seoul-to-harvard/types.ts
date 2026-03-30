export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  LEARN_MORE = 'LEARN_MORE',
  QUIZ = 'QUIZ',
  DISCUSSION = 'DISCUSSION'
}

export interface Packet {
  id: number;
  data: string;
  sequence: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'ARRIVED' | 'LOST';
  currentNodeId: string;
  pathIndex: number; // Current index in the calculated path
  path: string[]; // List of node IDs to visit
  delay: number; // Simulated network jitter
}

export interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isObstacle: boolean; // Simulates congestion/breakage
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
}
