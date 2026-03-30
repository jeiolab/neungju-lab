import React from 'react';
import { AnimationStep, SortType } from '../types';

interface VisualizerProps {
  step: AnimationStep | null;
  sortType: SortType;
}

const Visualizer: React.FC<VisualizerProps> = ({ step, sortType }) => {
  if (!step) {
    return <div className="h-64 flex items-center justify-center text-slate-400">데이터를 생성해주세요.</div>;
  }

  const { array, highlightIndices, swapIndices, sortedIndices, pivotIndex } = step;
  const maxValue = Math.max(...array, 100);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Bars Container */}
      <div className="flex items-end justify-center space-x-2 h-64 w-full p-4 bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden relative">
        {array.map((value, idx) => {
          let bgColor = 'bg-blue-400'; // Default
          
          if (sortedIndices.includes(idx)) {
            bgColor = 'bg-green-400';
          }
          
          if (highlightIndices.includes(idx)) {
            bgColor = 'bg-yellow-400';
          }

          if (swapIndices.includes(idx)) {
            bgColor = 'bg-red-400';
          }

          // Special visualization for pivot/extreme value in Selection/Insertion
          if (pivotIndex === idx) {
             // For Selection Sort, this is min/max candidate
             // For Insertion Sort, this is the item being inserted
             bgColor = 'bg-purple-500';
          }

          const heightPercent = (value / maxValue) * 100;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-end w-12 transition-all duration-300 ease-in-out relative group`}
              style={{ height: `${heightPercent}%` }}
            >
              {/* Bar */}
              <div className={`w-full h-full rounded-t-md ${bgColor} shadow-md flex items-end justify-center pb-1`}>
                <span className="text-white font-bold text-sm drop-shadow-md">{value}</span>
              </div>
              
              {/* Index Label */}
              <div className="absolute -bottom-6 text-xs text-slate-400 font-mono">
                {idx}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log / Description */}
      <div className="mt-8 p-4 bg-slate-800 text-white rounded-lg w-full shadow-lg min-h-[80px] flex items-center justify-center text-center">
        <p className="text-lg font-medium animate-pulse">
           {step.description}
        </p>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded"></div>일반</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded"></div>비교중</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded"></div>교환/이동</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded"></div>정렬완료</div>
        {(sortType === SortType.SELECTION || sortType === SortType.INSERTION) && (
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded"></div>기준값/선택값</div>
        )}
      </div>
    </div>
  );
};

export default Visualizer;