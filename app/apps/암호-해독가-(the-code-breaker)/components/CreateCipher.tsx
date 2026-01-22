import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';

export const CreateCipher: React.FC = () => {
  const [input, setInput] = useState('');
  const [shift, setShift] = useState(3);

  const encrypt = (text: string, s: number) => {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - base + s) % 26) + base);
        }
        return char;
    }).join('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-8">시저 암호 생성기 (CAESAR CIPHER)</h2>
        
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="비밀 메시지를 입력하세요..."
                className="w-full h-32 bg-black border border-slate-600 text-white p-4 rounded resize-none focus:border-green-500 outline-none font-mono"
            />
            
            <div className="flex items-center justify-center gap-4 my-6">
                <label className="text-slate-400">이동 키 (SHIFT):</label>
                <input 
                    type="range" 
                    min="1" 
                    max="25" 
                    value={shift} 
                    onChange={(e) => setShift(parseInt(e.target.value))}
                    className="w-48 accent-green-500"
                />
                <span className="text-2xl font-bold text-green-500 w-8">{shift}</span>
            </div>

            <div className="flex justify-center mb-6">
                <ArrowDown className="text-slate-500 animate-bounce" />
            </div>

            <div className="relative">
                <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-xs text-green-400 font-bold">암호화 결과 (ENCRYPTED OUTPUT)</div>
                <div className="w-full bg-slate-800 p-4 rounded border border-green-900 text-green-400 font-mono text-lg min-h-[80px] break-words">
                    {input ? encrypt(input, shift) : '...'}
                </div>
            </div>
        </div>

        <p className="mt-8 text-slate-500 text-sm">
            친구에게 문제를 내보세요: 암호화된 텍스트를 보내고 "이동 키"가 비밀번호라고 알려주세요!
        </p>
    </div>
  );
};