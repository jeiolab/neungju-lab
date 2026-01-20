export type TabId = 'theory' | 'simulation' | 'learn-more' | 'quiz' | 'discussion';

export interface SimulationLog {
  searchCount: number;
  linearTime: number;
  sortedTime: number; // Includes sorting cost if applicable
}

export interface SimulationState {
  packageCount: number;
  isSorted: boolean;
  totalSearches: number;
  accumulatedTime: number;
  logs: SimulationLog[];
  hasSorted: boolean; // To track if the one-time sort cost has been paid
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Cost Constants (in hypothetical ms)
export const COST_SORT_BASE = 500; // Fixed overhead for sorting
export const COST_LINEAR_PER_ITEM = 10;
export const COST_BINARY_PER_ITEM = 1;
