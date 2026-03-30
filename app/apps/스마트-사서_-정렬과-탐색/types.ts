export interface Book {
  id: number;
  title: string;
  color: string;
  height: number; // For visual variety (e.g., percentage 80-100)
}

export enum AlgorithmType {
  LINEAR = 'LINEAR',
  BINARY = 'BINARY',
  SORTING = 'SORTING'
}

export interface SearchState {
  isSearching: boolean;
  activeIndex: number | null; // Currently checking this index
  lowIndex: number | null; // For binary search range
  highIndex: number | null; // For binary search range
  foundIndex: number | null;
  stepsTaken: number;
  message: string;
}

export enum AppTab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  LEARN_MORE = 'learn_more',
  QUIZ = 'quiz',
  REFLECTION = 'reflection'
}
