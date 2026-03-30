export enum SortType {
  BUBBLE = 'BUBBLE',
  SELECTION = 'SELECTION',
  INSERTION = 'INSERTION',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface AnimationStep {
  array: number[];
  highlightIndices: number[]; // Indices currently being compared
  swapIndices: number[];      // Indices currently being swapped (visual effect)
  sortedIndices: number[];    // Indices that are fully sorted
  description: string;        // Text explanation of the step
  pivotIndex?: number;        // For Selection sort (current min/max candidate) or Insertion (current key)
}

export interface SimulationConfig {
  sortType: SortType;
  direction: SortDirection;
  count: number;
  speed: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}
