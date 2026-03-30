export interface ImageStats {
  sizeBytes: number;
  width: number;
  height: number;
  uniqueColors: number;
  loadTime?: number;
}

export interface CompressionResult {
  dataUrl: string;
  stats: ImageStats;
  quality: number; // 0-100
}

export interface ColorData {
  name: string;
  value: number;
  fill: string;
}
