import React, { useState } from 'react';
import CipherWheel from './CipherWheel';
import { caesarCipher } from '../utils/cipherLogic';
import { ALPHABET } from '../types';
import { ArrowRight, RotateCcw, Copy } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [shift, setShift] = useState(0);
  const [input, setInput] = useState('');

  const output = caesarCipher(input, shift);
  
  // Find the letter mapping for the visual guide (A -> ?)
  const mappedChar = ALPHABET[shift % 26];

  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-center justify-center w-full max-w-6xl mx-auto animate-fadeIn">
      
      {/* Left: The Wheel */}
      <div className="flex-1 flex flex-col items-center">
        <CipherWheel shift={shift} onShiftChange={setShift} />
        
        {/* Slider Alternative */}
        <div className="w-full max-w-xs mt-4">
          <div className="flex justify-between text-xs text-slate-600 mb-2">
            <span>키 값: 0</span>
            <span className="text-purple-600 font-bold text-lg">{shift}</span>
            <span>25</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-600 transition-colors"
          />
        </div>
      </div>

      {/* Right: Input/Output & Visuals */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Visual Mapping Guide */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-6">
            <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">평문</div>
                <div className="text-3xl font-mono font-bold text-slate-800">A</div>
            </div>
            <ArrowRight className="text-slate-400" />
            <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">암호문</div>
                <div className="text-3xl font-mono font-bold text-purple-600">{mappedChar}</div>
            </div>
            <div className="ml-4 pl-4 border-l border-slate-200">
                 <div className="text-xs text-slate-500">규칙</div>
                 <div className="text-sm font-mono text-purple-600 font-semibold">
                    + {shift} 칸 이동
                 </div>
            </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                평문 (입력)
            </label>
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="비밀 메시지를 입력하세요 (영어)..."
                    className="w-full h-32 bg-white p-4 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none font-mono text-lg resize-none transition-all text-slate-900"
                />
                {input && (
                    <button 
                        onClick={() => setInput('')}
                        className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                        title="지우기"
                    >
                        <RotateCcw size={16} />
                    </button>
                )}
            </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                암호문 (결과)
            </label>
            <div className="relative group">
                <textarea
                    readOnly
                    value={output}
                    placeholder="결과가 여기에 표시됩니다..."
                    className="w-full h-32 bg-slate-50 p-4 rounded-xl border border-slate-300 focus:border-purple-300 outline-none font-mono text-lg resize-none text-slate-900"
                />
                <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-md"
                    title="클립보드에 복사"
                >
                    <Copy size={18} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SimulationTab;