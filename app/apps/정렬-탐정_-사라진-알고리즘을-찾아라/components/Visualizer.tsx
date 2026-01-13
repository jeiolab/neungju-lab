import React from 'react';
import { ArraySnapshot } from '../types';

interface VisualizerProps {
  snapshot: ArraySnapshot;
  className?: string;
  showLabels?: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ snapshot, className = "", showLabels = true }) => {
  const { array, highlights, sortedIndices, pivotIndex } = snapshot;
  const maxValue = Math.max(...array, 100);

  return (
    <div className={`flex items-end justify-center gap-1 sm:gap-2 h-64 w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 ${className}`}>
      {array.map((value, idx) => {
        const isHighlighted = highlights.includes(idx);
        const isSorted = sortedIndices.includes(idx);
        const isPivot = pivotIndex === idx;

        let barColor = "bg-slate-400"; // Default
        if (isSorted) barColor = "bg-emerald-500";
        if (isHighlighted) barColor = "bg-amber-400";
        if (isPivot) barColor = "bg-indigo-500";

        const heightPercent = (value / maxValue) * 100;

        return (
          <div key={idx} className="flex flex-col items-center gap-1 w-full max-w-[40px] group relative">
             {/* Tooltip for value */}
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded transition-opacity">
                {value}
            </div>
            
            <div 
                className={`w-full rounded-t-md transition-all duration-300 ${barColor} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                style={{ height: `${heightPercent}%` }}
            >
            </div>
            {showLabels && (
                <span className={`text-[10px] sm:text-xs font-mono mt-1 ${isSorted ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {value}
                </span>
            )}
            {/* Index Marker */}
            <span className="text-[8px] text-slate-600 font-mono">{idx}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Visualizer;
