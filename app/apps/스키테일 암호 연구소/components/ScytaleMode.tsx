import React, { useMemo } from 'react';
import { ArrowDown, ArrowRight, RotateCw, Info } from 'lucide-react';

interface ScytaleModeProps {
  input: string;
  diameter: number;
  setDiameter: (d: number) => void;
}

export const ScytaleMode: React.FC<ScytaleModeProps> = ({ input, diameter, setDiameter }) => {
  // Clean input: Remove spaces, uppercase English (Korean chars left as is)
  const cleanInput = input.replace(/\s/g, '').toUpperCase();
  const rows = diameter;
  const cols = Math.ceil(cleanInput.length / rows);
  
  // Calculate the cipher text (reading column by column)
  const cipherText = useMemo(() => {
    let result = '';
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const index = c + (r * cols); // Writing horizontally (wrapping around rod)
        if (index < cleanInput.length) {
          result += cleanInput[index];
        }
      }
      result += ' '; // Space between columns for readability
    }
    return result.trim();
  }, [cleanInput, rows, cols]);

  const gridData = useMemo(() => {
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const charIndex = c + (r * cols);
        row.push(charIndex < cleanInput.length ? cleanInput[charIndex] : '');
      }
      grid.push(row);
    }
    return grid;
  }, [cleanInput, rows, cols]);

  return (
    <div className="flex flex-col space-y-8 animate-fadeIn">
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <label className="block text-sm font-semibold text-stone-600 mb-2">
          막대 지름 (면의 수): {diameter}
        </label>
        <input
          type="range"
          min="2"
          max="8"
          value={diameter}
          onChange={(e) => setDiameter(Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-greece-clay"
        />
        <div className="flex justify-between text-xs text-stone-400 mt-1">
          <span>얇게</span>
          <span>굵게</span>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* The Rod View */}
        <div className="flex-1 bg-greece-stone/5 p-6 rounded-xl border border-stone-200 relative overflow-hidden">
          <h3 className="text-lg font-serif font-bold text-greece-blue mb-4 flex items-center">
            <RotateCw className="w-5 h-5 mr-2" />
            감겨진 스키테일 (암호 키)
          </h3>
          
          <div className="relative perspective-1000 overflow-x-auto pb-4">
            {/* Simulated Cylinder using Grid */}
            <div className="inline-grid gap-y-1 bg-greece-gold/20 p-4 rounded-r-3xl rounded-l-md shadow-inner border-y-4 border-greece-gold"
                 style={{ 
                   gridTemplateRows: `repeat(${rows}, minmax(40px, 1fr))`,
                   minWidth: '300px'
                 }}>
              
              {gridData.map((row, rIndex) => (
                <div key={rIndex} className="flex">
                  {/* Rod Face Label */}
                  <div className="w-8 flex items-center justify-center text-[10px] text-stone-400 font-mono border-r border-stone-300 mr-2">
                    {rIndex + 1}
                  </div>
                  {row.map((char, cIndex) => (
                    <div 
                      key={`${rIndex}-${cIndex}`}
                      className={`
                        w-10 h-10 flex items-center justify-center text-lg font-bold border border-stone-300/50
                        ${char ? 'bg-white shadow-sm text-stone-800' : 'bg-transparent'}
                        transform transition-all duration-300
                      `}
                    >
                      {char}
                    </div>
                  ))}
                  {/* Infinite Rod illusion */}
                  <div className="w-20 bg-gradient-to-r from-transparent to-greece-gold/10"></div>
                </div>
              ))}
            </div>
            
            {/* Reading Direction Indicators */}
            <div className="absolute top-4 left-16 bottom-4 w-10 border-2 border-dashed border-greece-clay/50 rounded pointer-events-none flex flex-col items-center justify-center opacity-50">
               <ArrowDown className="text-greece-clay w-4 h-4 animate-bounce" />
            </div>
             <p className="mt-4 text-xs text-stone-500 italic text-center">
               * 메시지는 막대를 따라 가로로 적힙니다.
               <br/>
               * 풀어진 띠는 세로 방향(열 순서)으로 읽게 됩니다.
             </p>
          </div>
        </div>

        {/* The Strip View (Result) */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-serif font-bold text-greece-clay mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2" />
            풀어진 띠 (암호문)
          </h3>
          
          <div className="flex-grow flex items-center justify-center bg-stone-100 rounded-lg p-4 inner-shadow relative overflow-hidden">
            <div className="flex flex-wrap gap-2 justify-center">
               {cipherText.split('').map((char, i) => (
                 <span key={i} className={`
                    w-8 h-12 flex items-center justify-center bg-greece-cream border-y-4 border-greece-gold text-stone-800 font-mono text-lg font-bold shadow-md
                    ${char === ' ' ? 'w-4 opacity-0' : ''}
                 `}>
                   {char}
                 </span>
               ))}
            </div>
            {/* Texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
          </div>
          
          <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-start">
             <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
             <p className="text-sm text-blue-800">
               <strong>원리:</strong> 글자의 순서가 물리적으로 뒤섞입니다. 지름(키)이 같은 막대가 없으면, 이 띠는 의미 없는 글자의 나열로 보입니다.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};