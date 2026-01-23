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
      className="grid gap-1.5 bg-slate-100 p-3 rounded-xl border border-slate-200 select-none touch-manipulation mx-auto shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        maxWidth: '320px',
      }}
    >
      {Array.from({ length: size * size }).map((_, i) => {
        const x = i % size;
        const y = Math.floor(i / size);
        const orderIndex = scanMode === 'col' ? x * size + y : i;

        return (
          <div
            key={i}
            onMouseDown={() => onPixelClick(i)}
            className="aspect-square rounded-md cursor-pointer transition-all duration-75 hover:scale-105 active:scale-95 border-2 border-slate-400 relative overflow-hidden shadow-sm"
            style={{ backgroundColor: COLORS[grid[i]] }}
          >
             {showScanPath && (
               <span className="absolute bottom-0 right-0 px-1 text-[10px] font-mono text-slate-500/80 pointer-events-none bg-white/60 rounded-tl">
                 {orderIndex + 1}
               </span>
             )}
          </div>
        );
      })}
    </div>
  );
};