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
        <h2 className="text-2xl font-bold text-slate-800 mb-8">시저 암호 생성기</h2>
        
        <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="비밀 메시지를 입력하세요..."
                className="w-full h-32 bg-slate-50 border-2 border-slate-300 text-slate-800 p-4 rounded-lg resize-none focus:border-indigo-500 outline-none font-mono"
            />
            
            <div className="flex items-center justify-center gap-4 my-6">
                <label className="text-slate-700 font-semibold">이동 키:</label>
                <input 
                    type="range" 
                    min="1" 
                    max="25" 
                    value={shift} 
                    onChange={(e) => setShift(parseInt(e.target.value))}
                    className="w-48 accent-indigo-600"
                />
                <span className="text-2xl font-bold text-indigo-600 w-8">{shift}</span>
            </div>

            <div className="flex justify-center mb-6">
                <ArrowDown className="text-slate-400 animate-bounce" />
            </div>

            <div className="relative">
                <div className="absolute -top-3 left-4 bg-white px-2 text-xs text-indigo-600 font-bold">암호화 결과</div>
                <div className="w-full bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200 text-indigo-700 font-mono text-lg min-h-[80px] break-words">
                    {input ? encrypt(input, shift) : '...'}
                </div>
            </div>
        </div>

        <p className="mt-8 text-slate-600 text-sm">
            친구에게 문제를 내보세요: 암호화된 텍스트를 보내고 "이동 키"가 비밀번호라고 알려주세요!
        </p>
    </div>
  );
};