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
    <div className="p-4 bg-slate-900 border border-cyan-500/30 rounded-lg shadow-xl text-cyan-50">
      <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <ArrowRightLeft className="w-5 h-5" /> 카이사르 해독기
      </h3>
      
      <div className="mb-4">
        <label className="block text-xs uppercase tracking-widest text-slate-400 mb-1">이동 값 (Shift Key)</label>
        <input 
          type="range" 
          min="-26" 
          max="26" 
          value={shift} 
          onChange={(e) => setShift(parseInt(e.target.value))}
          className="w-full accent-cyan-500"
        />
        <div className="text-center font-mono text-xl mt-1 text-yellow-400">{shift > 0 ? `+${shift}` : shift}</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">암호문 (Cipher Text)</label>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="암호 입력..."
            className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white font-mono uppercase focus:border-cyan-500 outline-none"
          />
        </div>
        
        <div className="text-center text-slate-500">
             ↓ 해독 결과 ↓
        </div>

        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1">평문 (Plain Text)</label>
          <div className="w-full bg-black border border-green-500/50 p-2 rounded text-green-400 font-mono font-bold min-h-[42px]">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
};