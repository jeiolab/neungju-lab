export type PixelColor = 0 | 1 | 2; // 0: White, 1: Black, 2: Accent (Blue/Red)
export type ScanMode = 'row' | 'col';
export type GridSize = 8 | 10;

export interface RLEData {
  sequence: { color: PixelColor; count: number }[];
  originalSize: number; // in 'units' (e.g., number of pixels)
  compressedSize: number; // in 'units' (e.g., count + color = 2 units per run)
  compressionRatio: number; // percentage
  rawString: string;
}

export interface HistoryItem {
  id: number;
  grid: PixelColor[];
  timestamp: number;
  stats: RLEData;
}

export interface QuizQuestion {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReflectionData {
  q1: string; // Condition change
  q2: string; // Counter example
  q3: string; // Application design
}

export interface AppState {
  badges: string[];
  bestScore: number; // Lowest compression ratio
  streak: number;
  lastVisit: string;
  quizMastery: Record<number, boolean>; // questionId -> solved
  wrongNotes: number[]; // questionIds
}