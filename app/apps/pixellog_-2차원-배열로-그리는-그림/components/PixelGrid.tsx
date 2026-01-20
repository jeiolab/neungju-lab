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
    <div className="flex flex-col gap-1 items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-inner border-2 border-gray-300">
      {/* Column Indices */}
      {showLabels && (
        <div className="flex gap-1 mb-1 pl-8">
          {data[0].map((_, i) => (
            <div key={`col-idx-${i}`} className="w-10 h-6 flex items-end justify-center text-xs text-gray-600 font-mono font-semibold">
              {i}
            </div>
          ))}
        </div>
      )}

      {data.map((row, r) => (
        <div key={`row-${r}`} className="flex gap-1 items-center">
          {/* Row Index */}
          {showLabels && (
            <div className="w-8 h-10 flex items-center justify-end pr-2 text-xs text-gray-600 font-mono font-semibold">
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
                  w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg transition-all duration-200
                  ${val === 1 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-600 shadow-lg shadow-blue-300' 
                    : 'bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                  }
                  ${isHighlighted ? 'ring-4 ring-yellow-400 ring-offset-2 scale-110 z-10' : ''}
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