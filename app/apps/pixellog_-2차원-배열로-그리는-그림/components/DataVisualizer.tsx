import React from 'react';
import { GridData } from '../types';

interface DataVisualizerProps {
  data: GridData;
  hoveredCell?: { r: number, c: number } | null;
  onHoverCell?: (r: number | null, c: number | null) => void;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({ data, hoveredCell, onHoverCell }) => {
  return (
    <div className="font-mono text-xs sm:text-sm bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto shadow-inner h-full">
      <div className="text-slate-500 mb-2">// 2D Array Representation</div>
      <div className="text-purple-400">const <span className="text-yellow-300">image_data</span> = [</div>
      {data.map((row, r) => (
        <div key={r} className="pl-4 flex hover:bg-slate-900 rounded">
          <span className="text-slate-600 mr-2 select-none">[{r}]</span>
          <span className="text-blue-300">[</span>
          {row.map((val, c) => {
            const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
            return (
              <span 
                key={c}
                onMouseEnter={() => onHoverCell && onHoverCell(r, c)}
                onMouseLeave={() => onHoverCell && onHoverCell(null, null)}
                className={`
                  cursor-pointer px-1 rounded transition-colors
                  ${isHovered ? 'bg-yellow-500/30 text-yellow-200 font-bold' : val === 1 ? 'text-blue-400' : 'text-slate-500'}
                `}
              >
                {val}
                {c < row.length - 1 && <span className="text-slate-600">,</span>}
              </span>
            );
          })}
          <span className="text-blue-300">]</span>
          {r < data.length - 1 && <span className="text-slate-600">,</span>}
        </div>
      ))}
      <div className="text-purple-400">];</div>
    </div>
  );
};