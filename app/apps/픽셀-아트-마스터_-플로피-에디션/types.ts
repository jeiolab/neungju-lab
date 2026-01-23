export type GridSize = 8 | 16;
export type Color = string; // Hex code

export enum CompressionMode {
  BMP = 'BMP',
  RLE = 'RLE',
  JPEG = 'JPEG',
}

export interface PixelArt {
  id: string;
  name: string;
  grid: Color[];
  size: GridSize;
  originalSize: number;
  compressedSize: number;
  mode: CompressionMode;
  timestamp: number;
}

export interface CompressionStats {
  originalBytes: number;
  compressedBytes: number;
  compressionRatio: number; // 0 to 1 (1 means no compression, 0.1 means 10% of original size)
  streamVisualization: string; // Representation of the data stream
}

export enum Tab {
  DESIGN_LAB = 'DESIGN_LAB',
  GALLERY = 'GALLERY',
  DEV_NOTES = 'DEV_NOTES',
  QA_TEST = 'QA_TEST',
  PLANNING = 'PLANNING',
}
