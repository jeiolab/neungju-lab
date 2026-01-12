export type CipherMode = 'scytale' | 'box' | 'puzzle';

export interface CipherState {
  input: string;
  key: number; // Diameter for Scytale, Columns for Box
}

export interface GridCell {
  char: string;
  index: number;
  isPadding: boolean;
  originalIndex?: number; // For puzzle mode
}

export interface PuzzleTile {
  id: string;
  char: string;
  correctIndex: number;
  currentIndex: number;
}
