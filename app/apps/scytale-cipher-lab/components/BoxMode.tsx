import React, { useMemo } from 'react';
import { ArrowRight, ArrowDown, Grid3X3, ArrowRightCircle } from 'lucide-react';

interface BoxModeProps {
  input: string;
  columns: number;
  setColumns: (c: number) => void;
}

export const BoxMode: React.FC<BoxModeProps> = ({ input, columns, setColumns }) => {
  const cleanInput = input.replace(/\s/g, '').toUpperCase();
  const rows = Math.ceil(cleanInput.length / columns);
  const totalCells = rows * columns;

  const gridData = useMemo(() => {
    const grid = [];
    let charIdx = 0;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < columns; c++) {
        if (charIdx < cleanInput.length) {
          row.push({ char: cleanInput[charIdx], index: charIdx, isPad: false });
          charIdx++;
        } else {
          row.push({ char: 'X', index: -1, isPad: true }); // Padding
        }
      }
      grid.push(row);
    }
    return grid;
  }, [cleanInput, rows, columns]);

  // Generate Cipher (Read Column by Column)
  const cipherGroups = useMemo(() => {
    const groups = [];
    for (let c = 0; c < columns; c++) {
        let groupStr = "";
        for (let r = 0; r < rows; r++) {
            const row = gridData[r];
            if (row && row[c]) {
                groupStr += row[c].char;
            }
        }
        groups.push(groupStr);
    }
    return groups;
  }, [gridData, columns, rows]);

  return (
    <div className="flex flex-col space-y-8 animate-fadeIn">
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:w-1/2">
            <label className="block text-sm font-semibold text-slate-600 mb-2">
            표의 칸 수 (열): {columns}
            </label>
            <input
            type="range"
            min="2"
            max="6"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
        </div>
        <div className="text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            총 칸 수: <span className="font-bold text-slate-900">{totalCells}</span> (빈 칸은 &apos;X&apos;로 채움)
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Grid Visual */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
            <span className="flex items-center"><Grid3X3 className="w-5 h-5 mr-2 text-blue-600"/> 암호화 표</span>
            <span className="text-xs font-normal bg-green-100 text-green-800 px-2 py-1 rounded">1. 가로로 채우기</span>
           </h3>

           <div className="relative inline-block">
                {/* Writing Direction Arrow */}
                <div className="absolute -top-6 left-0 right-0 flex justify-center">
                    <div className="flex items-center text-xs text-blue-600 font-bold tracking-widest animate-pulse">
                        쓰기 <ArrowRight className="ml-1 w-4 h-4"/>
                    </div>
                </div>

                <div 
                    className="grid gap-2 border-2 border-slate-300 p-2 rounded bg-slate-50"
                    style={{ gridTemplateColumns: `repeat(${columns}, minmax(3rem, 1fr))` }}
                >
                    {gridData.map((row, rIdx) => (
                        row.map((cell, cIdx) => (
                            <div 
                                key={`${rIdx}-${cIdx}`}
                                className={`
                                    aspect-square flex items-center justify-center text-xl font-bold rounded shadow-sm border
                                    ${cell.isPad 
                                        ? 'bg-slate-200 text-slate-400 border-slate-300' 
                                        : 'bg-white text-blue-600 border-blue-300'}
                                    transition-all duration-300 hover:scale-105
                                `}
                            >
                                {cell.char}
                            </div>
                        ))
                    ))}
                </div>
                
                 {/* Reading Direction Indicators (Column Headers) */}
                 <div 
                    className="grid gap-2 mt-2"
                    style={{ gridTemplateColumns: `repeat(${columns}, minmax(3rem, 1fr))` }}
                >
                    {Array.from({length: columns}).map((_, i) => (
                        <div key={i} className="flex justify-center">
                            <ArrowDown className="w-5 h-5 text-blue-600 animate-bounce" style={{ animationDelay: `${i * 100}ms`}}/>
                        </div>
                    ))}
                </div>
           </div>
        </div>

        {/* Result Visual */}
        <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-lg font-bold text-blue-600 mb-6 relative z-10 flex items-center justify-between">
                <span>암호문 출력</span>
                <span className="text-xs font-normal bg-blue-600 text-white px-2 py-1 rounded">2. 세로로 읽기</span>
            </h3>
            
            <div className="space-y-4 relative z-10">
                {cipherGroups.map((group, i) => (
                    <div key={i} className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mr-3">
                            {i + 1}
                        </div>
                        <div className="flex-grow bg-white p-3 rounded font-mono text-xl tracking-widest border border-slate-300 text-slate-900">
                            {group}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center text-sm text-slate-600">
                <ArrowRightCircle className="w-5 h-5 mr-2 text-blue-600" />
                <span>결과: {cipherGroups.join(" ")}</span>
            </div>
        </div>
      </div>
    </div>
  );
};