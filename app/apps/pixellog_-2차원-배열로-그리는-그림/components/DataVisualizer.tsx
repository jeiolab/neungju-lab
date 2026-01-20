import React from 'react';
import { GridData } from '../types';

interface DataVisualizerProps {
  data: GridData;
  hoveredCell?: { r: number, c: number } | null;
  onHoverCell?: (r: number | null, c: number | null) => void;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({ data, hoveredCell, onHoverCell }) => {
  return (
    <div className="font-mono text-sm sm:text-base bg-gray-900 p-6 rounded-xl border-2 border-gray-700 overflow-x-auto shadow-inner h-full">
      <div className="text-gray-500 mb-3 text-xs">// 2D Array Representation</div>
      <div className="text-purple-400 font-semibold">const <span className="text-yellow-300">image_data</span> = [</div>
      {data.map((row, r) => (
        <div key={r} className="pl-6 flex hover:bg-gray-800 rounded py-1 transition-colors">
          <span className="text-gray-500 mr-3 select-none font-semibold">[{r}]</span>
          <span className="text-blue-400 font-bold">[</span>
          {row.map((val, c) => {
            const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
            return (
              <span 
                key={c}
                onMouseEnter={() => onHoverCell && onHoverCell(r, c)}
                onMouseLeave={() => onHoverCell && onHoverCell(null, null)}
                className={`
                  cursor-pointer px-2 py-0.5 rounded transition-all
                  ${isHovered ? 'bg-yellow-400 text-gray-900 font-bold scale-110' : val === 1 ? 'text-green-400 font-semibold' : 'text-gray-500'}
                `}
              >
                {val}
                {c < row.length - 1 && <span className="text-gray-600">,</span>}
              </span>
            );
          })}
          <span className="text-blue-400 font-bold">]</span>
          {r < data.length - 1 && <span className="text-gray-600">,</span>}
        </div>
      ))}
      <div className="text-purple-400 font-semibold">];</div>
    </div>
  );
};