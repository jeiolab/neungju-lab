export type AlgorithmType = 'linear' | 'binary' | 'sort_binary';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  defaultDataSize: number; // 1-100 scale
  defaultIsSorted: boolean;
  defaultUpdateFreq: number; // 1-100 scale
  defaultSearchFreq: number; // 1-100 scale
  context: string;
}

export interface SimulationMetrics {
  speedScore: number;      // Higher is faster
  prepCost: number;        // Higher is more expensive (bad)
  maintenanceCost: number; // Higher is more expensive (bad)
  totalSuitability: number; // 0-100
}

export interface SimulationState {
  selectedScenarioId: string;
  dataSize: number;
  isSorted: boolean;
  updateFreq: number;
  searchFreq: number;
  selectedAlgorithm: AlgorithmType | null;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
  type: 'multiple' | 'short';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}
