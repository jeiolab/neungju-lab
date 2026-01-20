import React from 'react';
import { SimulationState, AlgorithmType } from '../types';
import { TrendingUp, RefreshCw } from 'lucide-react';

interface RaceTrackProps {
  algorithmName: AlgorithmType;
  state: SimulationState;
  colorTheme: 'cyan' | 'rose';
  isWinner?: boolean;
}

const RaceTrack: React.FC<RaceTrackProps> = ({ algorithmName, state, colorTheme, isWinner }) => {
  const { array, activeIndices, sortedIndices, comparisons, swaps, finished } = state;
  const maxVal = Math.max(...array, 1);

  const themeColors = {
    cyan: {
      bar: 'bg-cyan-500',
      active: 'bg-yellow-400',
      sorted: 'bg-emerald-500',
      bg: 'bg-white',
      border: 'border-cyan-300',
      text: 'text-cyan-600',
    },
    rose: {
      bar: 'bg-rose-500',
      active: 'bg-yellow-400',
      sorted: 'bg-purple-500',
      bg: 'bg-white',
      border: 'border-rose-300',
      text: 'text-rose-600',
    }
  }[colorTheme];

  return (
    <div className={`relative flex flex-col h-full rounded-xl border ${themeColors.border} ${themeColors.bg} shadow-sm overflow-hidden transition-all duration-300 ${isWinner ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]' : ''}`}>
      {/* Header Stats */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className={`text-lg font-bold ${themeColors.text}`}>{algorithmName}</h2>
          {finished && <span className="text-xs text-emerald-600 font-bold px-2 py-0.5 bg-emerald-100 rounded-full">완료!</span>}
        </div>
        <div className="flex space-x-4 text-sm font-mono">
          <div className="flex flex-col items-end">
            <span className="text-slate-600 text-xs flex items-center"><RefreshCw className="w-3 h-3 mr-1"/> 비교</span>
            <span className="text-slate-900 font-bold">{comparisons}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-600 text-xs flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> 교환</span>
            <span className="text-slate-900 font-bold">{swaps}</span>
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 p-4 flex items-end justify-center space-x-[2px] h-64">
        {array.map((value, idx) => {
          let bgColor = themeColors.bar;
          if (sortedIndices.includes(idx)) bgColor = themeColors.sorted;
          if (activeIndices.includes(idx)) bgColor = themeColors.active;
          
          const heightPercent = (value / maxVal) * 100;

          return (
            <div
              key={idx}
              className={`w-full rounded-t-sm transition-all duration-75 ${bgColor}`}
              style={{ height: `${heightPercent}%` }}
            ></div>
          );
        })}
      </div>
      
      {isWinner && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border-2 border-yellow-500 text-yellow-600 font-bold text-2xl animate-bounce shadow-lg">
                WINNER! 🏆
            </div>
        </div>
      )}
    </div>
  );
};

export default RaceTrack;
