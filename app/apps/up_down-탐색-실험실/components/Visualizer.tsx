import React from 'react';

interface VisualizerProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  target?: number; // Only shown if practice mode or game over
  lastGuess?: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  min,
  max,
  currentMin,
  currentMax,
  target,
  lastGuess
}) => {
  const totalRange = max - min + 1;
  
  // Calculate percentages for the bars
  const leftDiscarded = currentMin - min;
  const activeRange = currentMax - currentMin + 1;
  // const rightDiscarded = max - currentMax;

  const leftWidth = (leftDiscarded / totalRange) * 100;
  const activeWidth = (activeRange / totalRange) * 100;
  const rightWidth = 100 - leftWidth - activeWidth;

  return (
    <div className="w-full mt-6 mb-8">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      
      {/* The Bar */}
      <div className="h-8 w-full flex rounded-lg overflow-hidden border border-gray-200 shadow-inner bg-gray-100 relative">
        {/* Left Discarded */}
        <div 
          style={{ width: `${leftWidth}%` }} 
          className="bg-gray-300 transition-all duration-500 relative"
        >
          {leftWidth > 5 && <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[10px] pattern-dots">❌</div>}
        </div>

        {/* Active Range */}
        <div 
          style={{ width: `${activeWidth}%` }} 
          className="bg-blue-500 transition-all duration-500 flex items-center justify-center relative"
        >
          {activeRange <= 20 && (
             <span className="text-white text-xs font-bold px-1 whitespace-nowrap">
               {activeRange}개 남음
             </span>
          )}
        </div>

        {/* Right Discarded */}
        <div 
          style={{ width: `${rightWidth}%` }} 
          className="bg-gray-300 transition-all duration-500 relative"
        >
           {rightWidth > 5 && <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[10px] pattern-dots">❌</div>}
        </div>

        {/* Markers */}
        {target !== undefined && (
          <div 
            className="absolute top-0 bottom-0 w-1 bg-yellow-400 z-20 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
            style={{ left: `${((target - min) / totalRange) * 100}%` }}
          />
        )}
        
        {lastGuess !== undefined && (
            <div 
            className="absolute top-0 h-full w-0.5 bg-red-500 z-30 transition-all duration-300"
            style={{ left: `${((lastGuess - min) / totalRange) * 100}%` }}
            >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-1 rounded">
                    {lastGuess}
                </div>
            </div>
        )}

      </div>
      
      <div className="flex justify-between text-sm mt-2 font-medium text-gray-700">
        <div className="text-left w-1/3">
            {currentMin > min && <span className="text-gray-400">~{currentMin - 1} 제거됨</span>}
        </div>
        <div className="text-center w-1/3 text-blue-600">
            현재 후보: {currentMin} ~ {currentMax}
        </div>
        <div className="text-right w-1/3">
             {currentMax < max && <span className="text-gray-400">{currentMax + 1}~ 제거됨</span>}
        </div>
      </div>
    </div>
  );
};
