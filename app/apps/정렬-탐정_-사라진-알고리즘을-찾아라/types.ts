export enum AlgorithmType {
  Bubble = '버블 정렬',
  Selection = '선택 정렬',
  Insertion = '삽입 정렬',
  Quick = '퀵 정렬'
}

export interface ArraySnapshot {
  array: number[];
  highlights: number[]; // Indices currently being compared/swapped
  sortedIndices: number[]; // Indices considered "sorted" so far
  pivotIndex?: number; // For Quick Sort
  description?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // Index of correct option
  explanation: string;
}

export interface ThinkProblem {
  title: string;
  scenario: string;
  question: string;
  hint: string;
  answerKey: string;
}