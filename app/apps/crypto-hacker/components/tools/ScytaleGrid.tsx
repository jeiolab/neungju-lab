import React, { useState } from 'react';
import { Grid3X3 } from 'lucide-react';

export const ScytaleGrid: React.FC = () => {
  const [input, setInput] = useState('TREHSIPAS');
  const [columns, setColumns] = useState(3);

  const getGrid = () => {
    const safeInput = input.replace(/\s/g, '').toUpperCase();
    const rows = Math.ceil(safeInput.length / columns);
    const grid: string[][] = [];
    
    let index = 0;
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < columns; c++) {
        row.push(safeInput[index] || '_');
        index++;
      }
      grid.push(row);
    }
    return grid;
  };

  const grid = getGrid();

  const readColumnar = () => {
    let result = "";
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < grid.length; r++) {
        const char = grid[r][c];
        if (char && char !== '_') result += char;
      }
    }
    return result;
  };

  return (
    <div className="p-3 md:p-4 bg-white text-slate-900">
      <h3 className="text-base md:text-lg font-bold text-blue-600 mb-3 md:mb-4 flex items-center gap-2">
        <Grid3X3 className="w-4 h-4 md:w-5 md:h-5 shrink-0" /> 
        <span>행렬 전치 (스키테일)</span>
      </h3>

      <div className="flex gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="flex-1">
          <label className="block text-xs uppercase text-slate-600 mb-1.5 tracking-wider">입력 문자열</label>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white border border-slate-300 p-2 md:p-2.5 rounded font-mono text-sm md:text-base uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="w-20 md:w-24">
          <label className="block text-xs uppercase text-slate-600 mb-1.5 tracking-wider">열(칸)</label>
          <input 
            type="number"
            min="2"
            max="10"
            value={columns}
            onChange={(e) => setColumns(parseInt(e.target.value))}
            className="w-full bg-white border border-slate-300 p-2 md:p-2.5 rounded font-mono text-center text-sm md:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-50 p-3 md:p-4 rounded mb-3 md:mb-4 flex justify-center border border-slate-200 overflow-x-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {grid.map((row, rI) => 
            row.map((cell, cI) => (
              <div key={`${rI}-${cI}`} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-blue-300 text-blue-600 font-semibold bg-blue-50 text-xs md:text-sm">
                {cell}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-2.5 md:p-3 rounded border border-slate-200">
        <p className="text-xs text-slate-600 uppercase mb-1.5 tracking-wider">세로로 읽기 (위에서 아래, 왼쪽에서 오른쪽):</p>
        <p className="font-mono text-blue-600 break-all text-sm md:text-base font-semibold">{readColumnar()}</p>
      </div>
    </div>
  );
};