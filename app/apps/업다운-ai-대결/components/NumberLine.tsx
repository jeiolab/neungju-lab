import React from 'react';
import { COLORS } from '../constants';

interface NumberLineProps {
  globalMin: number;
  globalMax: number;
  currentMin: number;
  currentMax: number;
  targetGuess?: number;
  isModeA?: boolean; // If true, show AI's current guess
}

const NumberLine: React.FC<NumberLineProps> = ({ 
  globalMin, 
  globalMax, 
  currentMin, 
  currentMax, 
  targetGuess,
  isModeA 
}) => {
  const range = globalMax - globalMin + 1;
  
  // Calculate percentages for visualization
  const inactiveLeftWidth = ((currentMin - globalMin) / range) * 100;
  const activeWidth = ((currentMax - currentMin + 1) / range) * 100;
  
  // Position of the guess marker
  let guessPosition = 0;
  if (targetGuess !== undefined) {
    guessPosition = ((targetGuess - globalMin) / range) * 100;
  }

  return (
    <div className="w-full my-8">
      <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono">
        <span>{globalMin}</span>
        <span>{globalMax}</span>
      </div>
      
      <div className="relative h-12 w-full bg-slate-100 rounded-lg overflow-hidden flex border border-slate-200">
        {/* Left Inactive Area */}
        <div 
          style={{ width: `${inactiveLeftWidth}%`, backgroundColor: COLORS.inactive }} 
          className="h-full transition-all duration-500 ease-in-out border-r border-slate-300"
        />

        {/* Active Area */}
        <div 
          style={{ width: `${activeWidth}%`, backgroundColor: '#e0f2fe' }} 
          className="h-full relative transition-all duration-500 ease-in-out flex items-center justify-center"
        >
            <div className="w-full h-1 bg-blue-300 rounded-full mx-2"></div>
        </div>

        {/* Right Inactive Area (implicit by remaining space, but explicitly pushed by left+active) */}
        
        {/* Min/Max Labels for Active Range */}
        {activeWidth > 10 && (
            <>
                <div 
                    className="absolute top-1 text-[10px] font-bold text-blue-600 transition-all duration-500"
                    style={{ left: `${inactiveLeftWidth}%`, transform: 'translateX(4px)' }}
                >
                    {currentMin}
                </div>
                <div 
                    className="absolute top-1 text-[10px] font-bold text-blue-600 transition-all duration-500"
                    style={{ left: `${inactiveLeftWidth + activeWidth}%`, transform: 'translateX(-100%) translateX(-4px)' }}
                >
                    {currentMax}
                </div>
            </>
        )}

        {/* Guess Marker */}
        {targetGuess !== undefined && (
          <div 
            className="absolute h-full w-1 bg-red-500 top-0 transition-all duration-500 z-10"
            style={{ left: `${guessPosition}%` }}
          >
            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
              {isModeA ? 'AI 추측' : '나의 추측'} : {targetGuess}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-red-500 rotate-180"></div>
          </div>
        )}
      </div>
      <div className="text-center mt-2 text-sm text-slate-600">
        현재 탐색 범위: <span className="font-bold text-slate-900">{currentMax - currentMin + 1}</span> 개
      </div>
    </div>
  );
};

export default NumberLine;