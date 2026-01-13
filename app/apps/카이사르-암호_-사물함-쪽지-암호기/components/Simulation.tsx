import React, { useState, useEffect } from 'react';
import { caesarCipher, autoGuessKeys } from '../utils/caesarUtils';
import { CipherMode } from '../types';
import { ArrowRight, Lock, Unlock, Zap, RotateCw } from 'lucide-react';

interface SimulationProps {
  onSimulate: (key: number, isDecrypt: boolean) => void;
  onBadgeEarn: (badgeId: string) => void;
}

const Simulation: React.FC<SimulationProps> = ({ onSimulate, onBadgeEarn }) => {
  const [text, setText] = useState('Hello World');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<CipherMode>(CipherMode.ENCRYPT);
  const [result, setResult] = useState('');
  const [changedCount, setChangedCount] = useState(0);
  const [sameCount, setSameCount] = useState(0);
  const [guesses, setGuesses] = useState<{ key: number; confidence: string }[]>([]);

  useEffect(() => {
    const output = caesarCipher(text, shift, mode === CipherMode.DECRYPT);
    setResult(output);

    // Calculate stats
    let changed = 0;
    let same = 0;
    const cleanInput = text.replace(/[^a-zA-Z]/g, ''); // Count only alphabets for stats logic
    
    // Actually compare the full string indices
    for (let i = 0; i < text.length; i++) {
        if (/[a-zA-Z]/.test(text[i])) {
            if (shift % 26 !== 0) {
                changed++;
            } else {
                same++;
            }
        } else {
            same++;
        }
    }

    setChangedCount(changed);
    setSameCount(text.length - changed);
    
    if (shift === 13) onBadgeEarn('rot13_finder');
    
    // Notify parent to update stats (debounced usually, but here immediate is okay for simple counters)
    const timeout = setTimeout(() => {
        onSimulate(shift, mode === CipherMode.DECRYPT);
    }, 1000);

    return () => clearTimeout(timeout);

  }, [text, shift, mode, onSimulate, onBadgeEarn]);

  const handleAutoGuess = () => {
    const suggestions = autoGuessKeys(text);
    setGuesses(suggestions);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-6">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              이동 키 (Shift): <span className="text-indigo-600 font-bold text-lg">{shift}</span>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span>
              <span>13 (ROT13)</span>
              <span>25</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode(CipherMode.ENCRYPT)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === CipherMode.ENCRYPT
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Lock size={16} /> 암호화
            </button>
            <button
              onClick={() => setMode(CipherMode.DECRYPT)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === CipherMode.DECRYPT
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Unlock size={16} /> 복호화
            </button>
          </div>
        </div>

        {/* I/O Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Arrow Indicator */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center bg-white border rounded-full p-2 shadow-sm text-slate-400">
            <ArrowRight size={20} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              입력 (쪽지 내용)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-none font-mono text-slate-700"
              placeholder="여기에 내용을 입력하세요..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              결과 ({mode === CipherMode.ENCRYPT ? '암호문' : '평문'})
            </label>
            <div className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 break-all overflow-y-auto">
              {result}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Line Feedback */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-2">
        <p className="flex items-center gap-2 text-indigo-900 text-sm">
          <RotateCw size={16} className="text-indigo-500" />
          <span>이번 키는 <span className="font-bold">{shift}</span>라서 알파벳이 <span className="font-bold">{shift}</span>칸 {mode === CipherMode.ENCRYPT ? '앞으로' : '뒤로'} 이동했어.</span>
        </p>
        <p className="flex items-center gap-2 text-indigo-800 text-sm">
          <span className="w-4 h-4 rounded-full bg-indigo-200 flex items-center justify-center text-[10px] font-bold">A</span>
          <span>변환된 글자 수: <span className="font-bold">{changedCount}</span>개 / 그대로인 문자: <span className="font-bold">{sameCount}</span>개</span>
        </p>
        <p className="flex items-center gap-2 text-red-800 text-sm bg-red-50 p-2 rounded-lg border border-red-100">
          <Zap size={16} className="text-red-500" />
          <span><strong>이 방식의 약점:</strong> 'A'는 항상 같은 글자로 바뀜! (빈도 분석으로 추측 가능)</span>
        </p>
      </div>

      {/* Weakness Demo */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">🕵️‍♀️ 암호 해독가의 도구</h3>
          <button
            onClick={handleAutoGuess}
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-900 transition-colors shadow-sm flex items-center gap-2"
          >
            <Zap size={14} /> 자동 추측 (빈도 힌트)
          </button>
        </div>
        
        {guesses.length > 0 && (
          <div className="bg-slate-100 p-4 rounded-xl animate-fade-in">
            <p className="text-xs text-slate-500 mb-2">이 텍스트의 글자 빈도를 분석한 결과, 다음 키들이 의심됩니다:</p>
            <div className="flex gap-3">
              {guesses.map((g, idx) => (
                <button 
                    key={idx}
                    onClick={() => setShift(g.key)}
                    className="flex-1 bg-white border border-slate-200 p-3 rounded-lg text-center hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <div className="text-lg font-bold text-slate-800 group-hover:text-indigo-600">Key: {g.key}</div>
                  <div className="text-xs text-slate-500">{g.confidence}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">*클릭하면 해당 키로 설정됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;
