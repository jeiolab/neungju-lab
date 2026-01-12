export type AlgorithmType = 'sequential' | 'binary';

export interface SearchStep {
  index: number;
  value: number;
  low?: number; // For binary search visualization
  high?: number; // For binary search visualization
  found: boolean;
}

export interface SimulationState {
  sequentialSteps: SearchStep[];
  binarySteps: SearchStep[];
  target: number;
  dataSize: number;
  data: number[];
}

export interface RaceState {
  status: 'idle' | 'running' | 'finished';
  sequentialCurrentStepIndex: number;
  binaryCurrentStepIndex: number;
  bet: AlgorithmType | null;
  winner: AlgorithmType | null;
}
