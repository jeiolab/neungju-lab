import React, { useState } from 'react';
import { BINGO_ITEMS } from '../constants';

const BingoBoard: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(BINGO_ITEMS.length).fill(false));

  const toggleItem = (idx: number) => {
    const newChecked = [...checkedItems];
    newChecked[idx] = !newChecked[idx];
    setCheckedItems(newChecked);
  };

  const isBingo = () => {
    // Simple logic: just count checks for now, or real bingo logic (rows/cols/diagonals)
    // 3x3 Grid
    const wins = [
      [0,1,2], [3,4,5], [6,7,8], // Rows
      [0,3,6], [1,4,7], [2,5,8], // Cols
      [0,4,8], [2,4,6]           // Diagonals
    ];
    return wins.some(combination => combination.every(idx => checkedItems[idx]));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">생활 속 AI 빙고</h2>
        {isBingo() && <span className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full animate-pulse">BINGO!</span>}
      </div>
      <p className="text-sm text-slate-500 mb-4">일상에서 지능형 에이전트를 경험했다면 체크해보세요.</p>
      
      <div className="grid grid-cols-3 gap-2">
        {BINGO_ITEMS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => toggleItem(idx)}
            className={`aspect-square p-2 rounded-lg text-sm flex items-center justify-center text-center font-medium transition-all
              ${checkedItems[idx] 
                ? 'bg-blue-500 text-white shadow-inner transform scale-95' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BingoBoard;