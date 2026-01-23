import { GridSize, Color, CompressionStats } from '../types';

// Helper to calculate raw BMP size (3 bytes per pixel for RGB)
export const calculateBMPSize = (grid: Color[]): number => {
  return grid.length * 3; 
};

// Helper to simulate RLE compression
// Returns size in bytes (assuming 1 byte for count, 3 bytes for color)
export const calculateRLE = (grid: Color[]): CompressionStats => {
  if (grid.length === 0) return { originalBytes: 0, compressedBytes: 0, compressionRatio: 1, streamVisualization: '' };

  let compressedBytes = 0;
  let currentRunColor = grid[0];
  let currentRunCount = 1;
  let visualization = '';

  for (let i = 1; i < grid.length; i++) {
    if (grid[i] === currentRunColor && currentRunCount < 255) {
      currentRunCount++;
    } else {
      // End of run
      compressedBytes += 4; // 1 byte count + 3 bytes color
      visualization += `[${currentRunCount}x${currentRunColor}] `;
      
      currentRunColor = grid[i];
      currentRunCount = 1;
    }
  }
  // Add last run
  compressedBytes += 4;
  visualization += `[${currentRunCount}x${currentRunColor}]`;

  const originalBytes = calculateBMPSize(grid);

  return {
    originalBytes,
    compressedBytes,
    compressionRatio: compressedBytes / originalBytes,
    streamVisualization: visualization
  };
};

// Helper to convert Hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Simulate JPEG-ish lossy compression (Downsampling/Block Averaging)
// We will take 2x2 blocks and average them
export const simulateLossyCompression = (grid: Color[], size: GridSize): { newGrid: Color[], stats: CompressionStats } => {
  const newGrid = [...grid];
  const originalBytes = calculateBMPSize(grid);
  
  // For simulation, we assume JPEG gets roughly 10-20% of original size depending on complexity
  // But visually, we will "chunk" the pixels.
  
  const blockSize = 2; // 2x2 blocks
  
  for (let y = 0; y < size; y += blockSize) {
    for (let x = 0; x < size; x += blockSize) {
      // Gather pixels in block
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      
      for (let dy = 0; dy < blockSize; dy++) {
        for (let dx = 0; dx < blockSize; dx++) {
          const py = y + dy;
          const px = x + dx;
          if (py < size && px < size) {
            const idx = py * size + px;
            const rgb = hexToRgb(grid[idx]);
            rSum += rgb.r;
            gSum += rgb.g;
            bSum += rgb.b;
            count++;
          }
        }
      }

      // Average
      const avgR = Math.round(rSum / count);
      const avgG = Math.round(gSum / count);
      const avgB = Math.round(bSum / count);
      const avgHex = rgbToHex(avgR, avgG, avgB);

      // Apply back to block
      for (let dy = 0; dy < blockSize; dy++) {
        for (let dx = 0; dx < blockSize; dx++) {
           const py = y + dy;
           const px = x + dx;
           if (py < size && px < size) {
             newGrid[py * size + px] = avgHex;
           }
        }
      }
    }
  }

  // Simulate High Compression Ratio for "JPEG"
  // Real JPEG is complex (DCT + Huffman), here we simulate the SIZE reduction metric
  const compressedBytes = Math.floor(originalBytes * 0.15); 

  return {
    newGrid,
    stats: {
      originalBytes,
      compressedBytes,
      compressionRatio: 0.15,
      streamVisualization: "DCT_COEFFS_QUANTIZED_HUFFMAN_ENCODED..." // Abstract representation
    }
  };
};
