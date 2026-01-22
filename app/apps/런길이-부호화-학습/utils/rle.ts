import { GridData, RunLength, CompressionResult, ColorType, Cell } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const createEmptyGrid = (size: number = 10): GridData => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      id: generateId(),
      color: 'white' as ColorType,
    }))
  );
};

// Encode a single row
export const encodeRow = (row: Cell[]): RunLength[] => {
  if (row.length === 0) return [];

  const runs: RunLength[] = [];
  let currentColor = row[0].color;
  let currentCount = 1;

  for (let i = 1; i < row.length; i++) {
    if (row[i].color === currentColor) {
      currentCount++;
    } else {
      runs.push({ color: currentColor, count: currentCount });
      currentColor = row[i].color;
      currentCount = 1;
    }
  }
  runs.push({ color: currentColor, count: currentCount });
  return runs;
};

// Calculate efficiency for the entire grid
export const calculateEfficiency = (grid: GridData): CompressionResult => {
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  const allRuns: RunLength[] = [];

  grid.forEach((row) => {
    const runs = encodeRow(row);
    runs.forEach(r => allRuns.push(r));
    
    // Logic: 
    // Original: 1 unit per cell (e.g., "W")
    // Compressed: Number of digits in count + 1 for color char (e.g., "10W" is 3, "5W" is 2)
    // For simplicity in this educational app:
    // Original = length of row
    // Compressed = 2 units per run (Count + Color, e.g. "5W")
    // Note: If count > 9, real RLE might take more bytes, but for high school level "Count+Color" is standard visualization (2 bytes).
    
    totalOriginalSize += row.length; 
    totalCompressedSize += runs.length * 2; 
  });

  const efficiency = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100;

  return {
    encoded: allRuns,
    originalSize: totalOriginalSize,
    compressedSize: totalCompressedSize,
    efficiency: efficiency,
  };
};

export const getRLEString = (grid: GridData): string => {
  return grid.map(row => {
    const runs = encodeRow(row);
    return runs.map(r => `${r.count}${r.color.charAt(0).toUpperCase()}`).join(' ');
  }).join('\n');
};

// Presets
export const PRESET_STRIPES = (size: number): GridData => {
  return Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, () => ({
      id: generateId(),
      color: rowIndex % 2 === 0 ? 'white' : 'black',
    }))
  );
};

export const PRESET_CHECKERBOARD = (size: number): GridData => {
  return Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, (_, colIndex) => ({
      id: generateId(),
      color: (rowIndex + colIndex) % 2 === 0 ? 'white' : 'black',
    }))
  );
};

export const PRESET_FLAG_STYLE = (size: number): GridData => {
  // Simple approximation of a flag-like circle in center
  const grid = createEmptyGrid(size);
  const center = size / 2;
  const radius = 3;
  
  for(let y=0; y<size; y++) {
    for(let x=0; x<size; x++) {
       const dist = Math.sqrt(Math.pow(x - center + 0.5, 2) + Math.pow(y - center + 0.5, 2));
       if (dist < radius) {
         grid[y][x].color = 'red';
       } else if (dist < radius + 1) {
         grid[y][x].color = 'blue';
       }
    }
  }
  return grid;
};