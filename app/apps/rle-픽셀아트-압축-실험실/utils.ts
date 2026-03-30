import { GridSize, PixelColor, RLEData, ScanMode } from './types';
import { COLOR_NAMES } from './constants';

export const generateEmptyGrid = (size: GridSize): PixelColor[] => {
  return new Array(size * size).fill(0);
};

export const getIndex = (x: number, y: number, size: number) => y * size + x;

// PRNG for Daily Challenge
export const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateDailyGrid = (size: GridSize): PixelColor[] => {
  const today = new Date();
  const seedStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  let seed = parseInt(seedStr, 10);
  
  const grid = new Array(size * size).fill(0);
  for (let i = 0; i < grid.length; i++) {
    const r = seededRandom(seed + i);
    // Bias towards generating some runs
    if (i > 0 && r > 0.6) {
        grid[i] = grid[i-1];
    } else {
        grid[i] = r > 0.5 ? 1 : 0 as PixelColor;
    }
  }
  return grid;
};

export const calculateRLE = (
  grid: PixelColor[],
  size: GridSize,
  scanMode: ScanMode,
  useLeadingZeroRule: boolean
): RLEData => {
  const scannedPixels: PixelColor[] = [];

  if (scanMode === 'row') {
    for (let i = 0; i < grid.length; i++) {
      scannedPixels.push(grid[i]);
    }
  } else {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        scannedPixels.push(grid[getIndex(x, y, size)]);
      }
    }
  }

  const sequence: { color: PixelColor; count: number }[] = [];
  
  if (scannedPixels.length === 0) {
    return { sequence: [], originalSize: 0, compressedSize: 0, compressionRatio: 0, rawString: '' };
  }

  // Handle Leading Zero Rule (Only relevant if we are treating output as pure counts)
  // But for this simulation, we output (Color, Count) pairs primarily.
  // The 'Leading Zero' logic usually applies when the decoder *assumes* white starts.
  // To simulate this teaching moment: If the rule is active, and first pixel is NOT white (0),
  // we conceptually pretend there was a "White 0" run before it. 
  // However, practically, let's just do standard RLE: Value-Run.
  
  let currentColor = scannedPixels[0];
  let currentCount = 1;

  for (let i = 1; i < scannedPixels.length; i++) {
    if (scannedPixels[i] === currentColor) {
      currentCount++;
    } else {
      sequence.push({ color: currentColor, count: currentCount });
      currentColor = scannedPixels[i];
      currentCount = 1;
    }
  }
  sequence.push({ color: currentColor, count: currentCount });

  // Add leading zero visual representation if requested and first color is not white
  // This modifies the visual sequence, but we store it as a special case for display?
  // Actually, let's just calculate raw metrics.

  const originalSize = scannedPixels.length; // 1 unit per pixel (e.g. 1 byte)
  const compressedSize = sequence.length * 2; // 2 units per run (Color + Count)
  
  // Refined Calculation:
  // If we assume a very efficient bit-packing, maybe less, but for education:
  // Raw: N pixels
  // RLE: 2 numbers per run.
  
  const compressionRatio = (compressedSize / originalSize) * 100;
  
  // Format string
  let rawString = "";
  if (useLeadingZeroRule && sequence.length > 0 && sequence[0].color !== 0) {
    rawString += "(0) ";
  }
  rawString += sequence.map(s => `${COLOR_NAMES[s.color]}${s.count}`).join(' ');

  return {
    sequence,
    originalSize,
    compressedSize,
    compressionRatio,
    rawString
  };
};

export const generateFeedback = (rle: RLEData, scanMode: ScanMode): string[] => {
  const lines = [];
  
  // 1. Why
  if (rle.compressionRatio >= 100) {
    lines.push(`현재 패턴은 변화가 너무 잦아 압축 효율이 떨어집니다 (${rle.compressionRatio.toFixed(0)}%).`);
  } else if (rle.compressionRatio < 40) {
    lines.push(`연속된 색상이 많아 매우 효율적으로 압축되었습니다! (${rle.compressionRatio.toFixed(0)}%).`);
  } else {
    lines.push(`적당히 압축되었지만 더 줄일 수 있어 보입니다 (${rle.compressionRatio.toFixed(0)}%).`);
  }

  // 2. Fix
  if (rle.sequence.length > rle.originalSize / 2) {
    lines.push("작은 점들을 연결하여 큰 덩어리로 만들면 유리합니다.");
  } else {
    lines.push("현재 색상 덩어리가 큼직하게 잘 배치되어 있습니다.");
  }

  // 3. Retry
  lines.push(
    scanMode === 'row' 
      ? "가로보다 세로로 긴 패턴이 있다면 '열 우선'으로 바꿔보세요." 
      : "세로보다 가로로 긴 패턴이 있다면 '행 우선'으로 바꿔보세요."
  );

  return lines;
};

// LocalStorage helpers
export const loadStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

export const saveStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
