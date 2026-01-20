export enum AlgorithmType {
  BUBBLE = 'Bubble Sort',
  SELECTION = 'Selection Sort',
  INSERTION = 'Insertion Sort',
  QUICK = 'Quick Sort',
}

export enum DataType {
  RANDOM = '랜덤 데이터',
  SORTED = '정방향 정렬',
  REVERSE = '역순 데이터',
}

export interface SortStep {
  array: number[];
  activeIndices: number[]; // Indices currently being compared or swapped
  sortedIndices: number[]; // Indices that are finalized
  comparisons: number;
  swaps: number;
  description?: string;
}

export interface SimulationState {
  array: number[];
  activeIndices: number[];
  sortedIndices: number[];
  comparisons: number;
  swaps: number;
  finished: boolean;
}

export interface RaceResult {
  algorithm: AlgorithmType;
  timeTaken: number; // in logical steps
  comparisons: number;
  swaps: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BigOCardData {
  title: string;
  complexity: string;
  description: string;
  analogy: string;
}
