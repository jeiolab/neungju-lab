import React, { useMemo } from 'react';
import { SearchStep } from '../types';
import { VisualizationBlock } from './VisualizationBlock';
import { Turtle, Rabbit } from 'lucide-react';

interface RaceTrackProps {
  type: 'sequential' | 'binary';
  dataSize: number;
  currentStep: SearchStep | null;
  history: Set<number>; // Indices visited
  range?: { low: number; high: number }; // For binary search scope
}

export const RaceTrack: React.FC<RaceTrackProps> = ({
  type,
  dataSize,
  currentStep,
  history,
  range,
}) => {
  const isBinary = type === 'binary';
  const Icon = isBinary ? Rabbit : Turtle;
  const color = isBinary ? 'text-rose-500' : 'text-emerald-500';
  const title = isBinary ? '이진 탐색 (토끼)' : '선형 탐색 (거북이)';
  
  // Optimization: For large datasets (1000), we only render what's necessary to avoid DOM overload,
  // or use a very lightweight renderer.
  // However, rendering 1000 simple divs is manageable in React 18 with memoization.
  // We use useMemo to generate the grid.

  const grid = useMemo(() => {
    return Array.from({ length: dataSize }).map((_, i) => {
      // Logic for Visual State
      const isActive = currentStep?.index === i;
      const isVisited = history.has(i);
      const isFound = currentStep?.found === true && isActive;
      
      let isTargetRange = false;
      if (isBinary && range) {
        isTargetRange = i >= range.low && i <= range.high;
      }

      return (
        <VisualizationBlock
          key={i}
          index={i}
          isActive={isActive}
          isVisited={isVisited}
          isTargetRange={isTargetRange}
          isFound={isFound}
          totalSize={dataSize}
        />
      );
    });
  }, [dataSize, currentStep, history, range, isBinary]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full bg-slate-100 ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">
            {isBinary ? '분할 정복 (O(log n))' : '단순 탐색 (O(n))'}
          </p>
        </div>
        <div className="ml-auto flex flex-col items-end">
           <span className="text-sm font-mono font-medium text-slate-600">
             위치: {currentStep?.index ?? '-'}
           </span>
           <span className="text-xs text-slate-400">
             값: {currentStep?.value ?? '-'}
           </span>
        </div>
      </div>

      <div className="relative w-full bg-slate-50 rounded-lg p-2 min-h-[60px] max-h-[200px] overflow-y-auto overflow-x-hidden hide-scrollbar">
        <div className="flex flex-wrap content-start">
          {grid}
        </div>
      </div>
    </div>
  );
};