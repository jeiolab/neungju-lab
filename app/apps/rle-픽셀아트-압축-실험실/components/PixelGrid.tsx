import React from 'react';
import { GridSize, PixelColor, ScanMode } from '../types';
import { COLORS } from '../constants';
import { getIndex } from '../utils';

interface PixelGridProps {
  grid: PixelColor[];
  size: GridSize;
  scanMode: ScanMode;
  onPixelClick: (index: number) => void;
  showScanPath?: boolean;
}

export const PixelGrid: React.FC<PixelGridProps> = ({ 
  grid, 
  size, 
  scanMode,
  onPixelClick,
  showScanPath = false
}) => {
  return (
    <div 
      className="grid gap-1 bg-slate-200 p-2 rounded-lg shadow-inner select-none touch-manipulation mx-auto"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        maxWidth: '300px', // Limit width for better mobile view
      }}
    >
      {Array.from({ length: size * size }).map((_, i) => {
        // Calculate coordinates for visualizing scan order
        const x = i % size;
        const y = Math.floor(i / size);
        
        let orderIndex = i;
        if (scanMode === 'col') {
          orderIndex = x * size + y;
        }

        return (
          <div
            key={i}
            onMouseDown={() => onPixelClick(i)}
            className={`
              aspect-square rounded-sm cursor-pointer transition-all duration-75 hover:scale-105 active:scale-95
              border border-slate-300 relative overflow-hidden
            `}
            style={{ backgroundColor: COLORS[grid[i]] }}
          >
             {showScanPath && (
               <span className="absolute inset-0 flex items-center justify-center text-[8px] text-slate-400/50 font-mono pointer-events-none">
                 {scanMode === 'row' ? i + 1 : (x * size + y + 1)}
               </span>
             )}
          </div>
        );
      })}
    </div>
  );
};