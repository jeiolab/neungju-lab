export type PixelValue = 0 | 1; // 0 for white, 1 for black (or primary color)
export type GridData = PixelValue[][];

export enum TabView {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  QUIZ = 'quiz',
  MYSTERY = 'mystery',
  GALLERY = 'gallery'
}

export interface SavedArt {
  id: string;
  name: string;
  data: GridData;
  createdAt: number;
}

export interface QuizQuestion {
  id: number;
  type: 'coordinate' | 'slice' | 'value';
  question: string;
  grid?: GridData; // Optional grid context for the question
  answer: string | number; // The expected answer
  options?: string[]; // Multiple choice options
  explanation: string;
}

export interface Challenge {
  name: string;
  target: GridData;
  description: string;
}