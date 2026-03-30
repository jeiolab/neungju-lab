import React, { useState, useEffect } from 'react';
import { caesarCipher } from '../services/cipherUtils';
import { ArrowRight, RotateCw, Copy, Check } from 'lucide-react';

export const CaesarTab: React.FC = () => {
  const [input, setInput] = useState('ROME WAS NOT BUILT IN A DAY');
  const [shift, setShift] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutput(caesarCipher(input, shift));
  }, [input, shift]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Introduction */}
      <div className="bg-amber-100/50 p-6 rounded-lg border-l-4 border-amber-600">
        <h3 className="font-serif text-xl font-bold text-amber-900 mb-2">카이사르의 암호 (Caesar Cipher)</h3>
        <p className="text-amber-800">
          줄리어스 시저는 군사 명령을 보낼 때 알파벳을 일정 간격만큼 밀어서 썼습니다.
          가장 단순한 <strong>치환 암호(Substitution Cipher)</strong>입니다.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold uppercase tracking-wider text-stone-600">
            평문 입력 (Plaintext)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 bg-white border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none font-mono"
            placeholder="암호화할 메시지를 입력하세요..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <label className="block text-sm font-bold uppercase tracking-wider text-stone-600">
                암호문 결과 (Ciphertext)
              </label>
              <button 
                onClick={handleCopy}
                className="flex items-center text-xs text-amber-700 hover:text-amber-900"
              >
                {copied ? <Check size={14} className="mr-1"/> : <Copy size={14} className="mr-1"/>}
                {copied ? "복사됨" : "복사하기"}
              </button>
          </div>
         
          <div className="w-full h-32 p-4 bg-stone-800 text-stone-100 border-2 border-stone-600 rounded-lg font-mono overflow-auto">
            {output}
          </div>
        </div>
      </div>

      {/* The Wheel Simulation */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <h4 className="font-serif text-lg font-bold mb-2">카이사르 휠 (Shift: {shift})</h4>
            <input
              type="range"
              min="0"
              max="25"
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
              className="w-64 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          {/* Visual Representation of Shift */}
          <div className="relative w-full overflow-hidden py-4 bg-stone-50 rounded-lg border border-stone-200">
             <div className="flex flex-col gap-2">
                {/* Original Alphabet */}
                <div className="flex justify-center gap-1 font-mono text-stone-400 text-sm">
                   {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char, i) => (
                       <span key={i} className="w-6 text-center">{char}</span>
                   ))}
                </div>
                
                {/* Shift Indicator Arrows */}
                 <div className="flex justify-center gap-1 text-amber-500">
                   {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((_, i) => (
                       <div key={i} className="w-6 flex justify-center">
                         <ArrowRight className="rotate-90" size={12} />
                       </div>
                   ))}
                </div>

                {/* Shifted Alphabet */}
                 <div className="flex justify-center gap-1 font-mono font-bold text-stone-800 text-lg">
                   {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char, i) => {
                       const shiftedCode = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
                       return (
                        <span key={i} className="w-6 text-center bg-amber-100 rounded">
                           {String.fromCharCode(shiftedCode)}
                        </span>
                       )
                   })}
                </div>
             </div>
             <p className="text-center text-xs text-stone-500 mt-4">
                * 한글은 유니코드 순서대로 {shift}칸 밀려서 변환됩니다.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};