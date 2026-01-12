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
    <div className="p-3 md:p-4 bg-white text-slate-900">
      <h3 className="text-base md:text-lg font-bold text-blue-600 mb-3 md:mb-4 flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5 shrink-0" /> 
        <span>카이사르 해독기</span>
      </h3>
      
      <div className="mb-3 md:mb-4">
        <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2">이동 값 (Shift Key)</label>
        <input 
          type="range" 
          min="-26" 
          max="26" 
          value={shift} 
          onChange={(e) => setShift(parseInt(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="text-center font-mono text-lg md:text-xl mt-1.5 text-blue-600 font-semibold">{shift > 0 ? `+${shift}` : shift}</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <div>
          <label className="block text-xs uppercase text-slate-600 mb-1.5 tracking-wider">암호문 (Cipher Text)</label>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="암호 입력..."
            className="w-full bg-white border border-slate-300 p-2 md:p-2.5 rounded text-slate-900 font-mono text-sm md:text-base uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div className="text-center text-slate-500 text-xs md:text-sm py-1">
             ↓ 해독 결과 ↓
        </div>

        <div>
          <label className="block text-xs uppercase text-slate-600 mb-1.5 tracking-wider">평문 (Plain Text)</label>
          <div className="w-full bg-slate-50 border border-blue-200 p-2.5 md:p-3 rounded text-blue-600 font-mono font-semibold min-h-[40px] md:min-h-[42px] flex items-center text-sm md:text-base">
            {output || <span className="text-slate-400">해독 결과가 여기에 표시됩니다</span>}
          </div>
        </div>
      </div>
    </div>
  );
};