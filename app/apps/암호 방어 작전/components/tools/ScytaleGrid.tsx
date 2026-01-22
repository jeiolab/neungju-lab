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
    <div className="p-4 bg-slate-900 border border-cyan-500/30 rounded-lg shadow-xl text-cyan-50">
      <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <Grid3X3 className="w-5 h-5" /> 행렬 전치 (스키테일)
      </h3>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-xs uppercase text-slate-400 mb-1">입력 문자열</label>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 p-2 rounded font-mono uppercase focus:border-cyan-500 outline-none"
          />
        </div>
        <div className="w-20">
          <label className="block text-xs uppercase text-slate-400 mb-1">열(칸)</label>
          <input 
            type="number"
            min="2"
            max="10"
            value={columns}
            onChange={(e) => setColumns(parseInt(e.target.value))}
            className="w-full bg-slate-800 border border-slate-600 p-2 rounded font-mono text-center"
          />
        </div>
      </div>

      <div className="bg-black p-4 rounded mb-4 flex justify-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {grid.map((row, rI) => 
            row.map((cell, cI) => (
              <div key={`${rI}-${cI}`} className="w-10 h-10 flex items-center justify-center border border-green-900 text-green-500 font-bold bg-green-900/10">
                {cell}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-slate-800 p-3 rounded">
        <p className="text-xs text-slate-400 uppercase mb-1">세로로 읽기 (위에서 아래, 왼쪽에서 오른쪽):</p>
        <p className="font-mono text-yellow-400 break-all">{readColumnar()}</p>
      </div>
    </div>
  );
};