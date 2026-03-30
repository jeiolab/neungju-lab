import React, { useState } from 'react';
import { InsertionGame } from './games/InsertionGame';
import { SelectionGame } from './games/SelectionGame';
import { SortType } from '../types';

interface SimulationTabProps {
  onSuccess: (type: SortType) => void;
}

export const SimulationTab: React.FC<SimulationTabProps> = ({ onSuccess }) => {
  const [activeGame, setActiveGame] = useState<SortType>(SortType.INSERTION);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveGame(SortType.INSERTION)}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            activeGame === SortType.INSERTION
              ? 'bg-amber-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          책 정리 (삽입 정렬)
        </button>
        <button
          onClick={() => setActiveGame(SortType.SELECTION)}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            activeGame === SortType.SELECTION
              ? 'bg-indigo-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          서류 정리 (선택 정렬)
        </button>
      </div>

      <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
        {activeGame === SortType.INSERTION ? (
          <InsertionGame onSuccess={() => onSuccess(SortType.INSERTION)} />
        ) : (
          <SelectionGame onSuccess={() => onSuccess(SortType.SELECTION)} />
        )}
      </div>
    </div>
  );
};
