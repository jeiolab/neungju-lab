import React from 'react';
import { GridData } from '../types';

interface PixelGridProps {
  data: GridData;
  onPixelClick?: (row: number, col: number) => void;
  readonly?: boolean;
  highlightCell?: { r: number, c: number } | null;
  showLabels?: boolean;
}

export const PixelGrid: React.FC<PixelGridProps> = ({ 
  data, 
  onPixelClick, 
  readonly = false, 
  highlightCell,
  showLabels = true
}) => {
  const size = data.length;

  return (
    <div className="flex flex-col gap-1 items-center justify-center p-4 bg-slate-800 rounded-xl shadow-inner border border-slate-700">
      {/* Column Indices */}
      {showLabels && (
        <div className="flex gap-1 mb-1 pl-6">
          {data[0].map((_, i) => (
            <div key={`col-idx-${i}`} className="w-8 h-6 flex items-end justify-center text-xs text-slate-400 font-mono">
              {i}
            </div>
          ))}
        </div>
      )}

      {data.map((row, r) => (
        <div key={`row-${r}`} className="flex gap-1 items-center">
          {/* Row Index */}
          {showLabels && (
            <div className="w-6 h-8 flex items-center justify-end pr-2 text-xs text-slate-400 font-mono">
              {r}
            </div>
          )}

          {row.map((val, c) => {
            const isHighlighted = highlightCell?.r === r && highlightCell?.c === c;
            return (
              <button
                key={`cell-${r}-${c}`}
                disabled={readonly}
                onClick={() => onPixelClick && onPixelClick(r, c)}
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 border rounded-md transition-all duration-200
                  ${val === 1 
                    ? 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                    : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                  }
                  ${isHighlighted ? 'ring-2 ring-yellow-400 scale-110 z-10' : ''}
                  ${readonly ? 'cursor-default' : 'cursor-pointer active:scale-95'}
                `}
                aria-label={`Grid cell at row ${r}, column ${c}, value ${val}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};