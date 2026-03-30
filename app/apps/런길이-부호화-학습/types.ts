export type ColorType = 'white' | 'black' | 'red' | 'blue';

export interface Cell {
  id: string;
  color: ColorType;
}

export type GridRow = Cell[];
export type GridData = GridRow[];

export interface RunLength {
  color: ColorType;
  count: number;
}

export interface CompressionResult {
  encoded: RunLength[];
  originalSize: number; // In "units" (e.g., character count equivalent)
  compressedSize: number; // In "units"
  efficiency: number; // Percentage reduction
}

export const PALETTE: Record<ColorType, string> = {
  white: '#ffffff',
  black: '#1e293b',
  red: '#ef4444',
  blue: '#3b82f6',
};

export const COLOR_LABELS: Record<ColorType, string> = {
  white: 'W',
  black: 'B',
  red: 'R',
  blue: 'L',
};