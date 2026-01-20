export interface Coordinate {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  isNoise?: boolean; // If true, this is a decoration/building not needed for the graph
  type: 'intersection' | 'building' | 'tree' | 'start' | 'end';
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  ADVANCED = 'ADVANCED',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export interface SimulationStats {
  nodesFound: number;
  noiseClicked: number;
  edgesCreated: number;
  completed: boolean;
}