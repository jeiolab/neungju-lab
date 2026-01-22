import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

export const CaesarWheel: React.FC = () => {
  const [shift, setShift] = useState(0);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const processText = (text: string, s: number) => {
      return text.toUpperCase().split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          // A=65, Z=90
          return String.fromCharCode(((code - 65 + s) % 26 + 26) % 26 + 65);
        }
        return char;
      }).join('');
    };
    setOutput(processText(input, shift));
  }, [input, shift]);

  return (
    <div className="p-4 bg-white border-2 border-indigo-200 rounded-lg shadow-sm text-slate-800">
      <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
        <ArrowRightLeft className="w-5 h-5" /> 카이사르 해독기
      </h3>
      
      <div className="mb-4">
        <label className="block text-xs uppercase tracking-widest text-slate-600 mb-1 font-semibold">이동 값 (Shift Key)</label>
        <input 
          type="range" 
          min="-26" 
          max="26" 
          value={shift} 
          onChange={(e) => setShift(parseInt(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="text-center font-mono text-xl mt-1 text-yellow-600">{shift > 0 ? `+${shift}` : shift}</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs uppercase text-slate-600 mb-1 font-semibold">암호문 (Cipher Text)</label>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="암호 입력..."
            className="w-full bg-slate-50 border-2 border-slate-300 p-2 rounded-lg text-slate-800 font-mono uppercase focus:border-indigo-500 outline-none"
          />
        </div>
        
        <div className="text-center text-slate-500">
             ↓ 해독 결과 ↓
        </div>

        <div>
          <label className="block text-xs uppercase text-slate-600 mb-1 font-semibold">평문 (Plain Text)</label>
          <div className="w-full bg-green-50 border-2 border-green-400 p-2 rounded-lg text-green-700 font-mono font-bold min-h-[42px]">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
};