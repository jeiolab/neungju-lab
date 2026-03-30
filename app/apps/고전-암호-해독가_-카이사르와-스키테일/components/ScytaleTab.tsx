import React, { useState, useEffect } from 'react';
import { scytaleCipher, getScytaleGrid } from '../services/cipherUtils';
import { Columns, Copy, Check } from 'lucide-react';

export const ScytaleTab: React.FC = () => {
  const [input, setInput] = useState('HELPMEOUTIAMTRAPPED');
  const [diameter, setDiameter] = useState(4); // Effectively rows
  const [output, setOutput] = useState('');
  const [grid, setGrid] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // We demonstrate ENCODING here.
    // Input is plaintext. We wrap it around the rod.
    // The resulting strip (ciphertext) is read column by column.
    // Wait, let's align with the function logic in cipherUtils.
    
    // In our util: scytaleCipher(text, rows, false)
    // returns the text read off the strip IF we wrote it row-by-row on the rod.
    // This produces the transposition.
    
    // So Input = Plaintext. Output = Ciphertext.
    const cleanInput = input.replace(/\s/g, '').toUpperCase();
    const cipher = scytaleCipher(cleanInput, diameter, false);
    setOutput(cipher);
    
    // For visualization: We want to show the ROD with the plaintext written on it.
    setGrid(getScytaleGrid(cleanInput, diameter));
    
  }, [input, diameter]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="bg-amber-100/50 p-6 rounded-lg border-l-4 border-amber-600">
        <h3 className="font-serif text-xl font-bold text-amber-900 mb-2">스파르타의 스키테일 (Scytale)</h3>
        <p className="text-amber-800">
          가늘고 긴 양피지 띠를 원통 막대(Scytale)에 감아 메시지를 적었습니다.
          막대의 굵기(지름)가 일치해야만 메시지를 읽을 수 있는 <strong>전치 암호(Transposition Cipher)</strong>입니다.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Column */}
        <div className="lg:col-span-1 space-y-4">
             <label className="block text-sm font-bold uppercase tracking-wider text-stone-600">
                1. 메시지 작성 (Plaintext)
             </label>
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-3 bg-white border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="공백 없이 영어/한글..."
              />
              
              <div className="pt-4">
                <label className="block text-sm font-bold uppercase tracking-wider text-stone-600 mb-2">
                    2. 막대 굵기 설정 (Rows: {diameter})
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={diameter}
                  onChange={(e) => setDiameter(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                    <span>얇음 (2)</span>
                    <span>굵음 (8)</span>
                </div>
              </div>

             <div className="pt-4">
                 <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-bold uppercase tracking-wider text-stone-600">
                        3. 풀린 띠 (Ciphertext)
                    </label>
                    <button onClick={handleCopy} className="text-amber-700 hover:text-amber-900">
                        {copied ? <Check size={16}/> : <Copy size={16}/>}
                    </button>
                 </div>
                 <div className="w-full p-3 bg-stone-800 text-stone-100 rounded-lg font-mono break-all text-sm min-h-[80px]">
                    {output}
                 </div>
                 <p className="text-xs text-stone-500 mt-2">
                    * 이 문자열은 막대에서 띠를 풀었을 때 보이는 순서입니다. (세로로 읽기)
                 </p>
             </div>
        </div>

        {/* Visual Column */}
        <div className="lg:col-span-2 bg-stone-200/50 p-6 rounded-xl border border-stone-300 flex flex-col items-center justify-center min-h-[400px]">
             <h4 className="font-serif text-lg font-bold text-stone-700 mb-6 flex items-center">
                <Columns className="mr-2" /> 막대에 감긴 모습 (Top View)
             </h4>
             
             {/* The Cylinder Visualization */}
             <div className="relative shadow-2xl bg-[#e3d5c5] rounded-lg overflow-hidden border-y-8 border-stone-800" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                 {/* Texture overlay */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
                 
                 <div className="flex flex-col">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex border-b border-stone-400/30 last:border-0 h-12">
                            {row.map((char, colIndex) => (
                                <div 
                                    key={colIndex} 
                                    className="w-12 flex-shrink-0 flex items-center justify-center font-serif text-xl font-bold text-stone-800 border-r border-stone-400/30 relative group"
                                >
                                    {char}
                                    {/* Tooltip for reading order */}
                                    <span className="absolute text-[8px] top-1 right-1 text-stone-400 opacity-50">
                                        {colIndex * diameter + rowIndex + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                 </div>
             </div>
             
             <div className="mt-8 text-center max-w-md">
                 <p className="text-sm text-stone-600">
                    <span className="font-bold text-amber-700">가로로 읽으면:</span> 평문 (Wrapped)<br/>
                    <span className="font-bold text-amber-700">세로로 읽으면:</span> 암호문 (Unwrapped strip)
                 </p>
             </div>
        </div>
      </div>
    </div>
  );
};