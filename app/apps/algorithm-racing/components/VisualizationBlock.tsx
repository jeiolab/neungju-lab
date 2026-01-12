import React, { memo } from 'react';

interface VisualizationBlockProps {
  index: number;
  isActive: boolean;
  isVisited: boolean;
  isTargetRange: boolean; // For binary search range visualization
  isFound: boolean;
  totalSize: number;
}

export const VisualizationBlock: React.FC<VisualizationBlockProps> = memo(({
  isActive,
  isVisited,
  isTargetRange,
  isFound,
  totalSize,
}) => {
  // Dynamic sizing based on total dataset size
  const getSizeClass = () => {
    if (totalSize <= 20) return 'w-8 h-8 m-0.5 text-xs';
    if (totalSize <= 100) return 'w-3 h-3 m-[1px] text-[0px]';
    return 'w-1.5 h-1.5 m-[0.5px] text-[0px]'; // Pixel-like for 1000
  };

  const getColorClass = () => {
    if (isFound) return 'bg-yellow-400 border-yellow-600 scale-125 z-10 shadow-lg';
    if (isActive) return 'bg-blue-500 border-blue-700 scale-110 z-10';
    if (isVisited) return 'bg-slate-300 border-slate-400 opacity-50';
    if (isTargetRange) return 'bg-blue-100 border-blue-200';
    return 'bg-white border-slate-200';
  };

  return (
    <div
      className={`
        ${getSizeClass()} 
        ${getColorClass()}
        border rounded-sm flex items-center justify-center transition-all duration-150
      `}
    />
  );
});
