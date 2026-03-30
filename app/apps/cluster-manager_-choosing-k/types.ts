export interface SimulationState {
  k: number;
  weights: {
    interpretability: number;
    cohesion: number;
    efficiency: number;
  };
  priorityMode: 'interpretability' | 'performance'; // 'performance' combines cohesion/efficiency
}

export interface FeedbackResult {
  winner: string;
  loser: string;
  suggestion: string;
  score: number;
}

export interface DataPoint {
  x: number;
  y: number;
  cluster: number;
  label?: string; // e.g., "Heavy Watcher"
}

export type ScenarioType = 'streaming' | 'school';

export interface LogEntry {
  id: string;
  timestamp: string;
  scenario: ScenarioType;
  k: number;
  score: number;
  feedback: string;
}

export interface UserStats {
  points: number;
  badges: string[];
  streak: number;
  lastPlayed: string;
}