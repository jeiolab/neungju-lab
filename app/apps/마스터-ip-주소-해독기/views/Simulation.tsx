import React, { useState, useEffect } from 'react';
import { BitSwitch } from '../components/BitSwitch';
import { BIT_VALUES, calculateDecimal, generateRandomTarget } from '../types';
import { RefreshCw, CheckCircle, Unlock, Play } from 'lucide-react';

export const Simulation: React.FC = () => {
  const [target, setTarget] = useState<number>(0);
  const [bits, setBits] = useState<boolean[]>(new Array(8).fill(false));
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize on mount
  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    setTarget(generateRandomTarget());
    setBits(new Array(8).fill(false));
    setIsSuccess(false);
    setShowConfetti(false);
  };

  const toggleBit = (index: number) => {
    if (isSuccess) return;
    const newBits = [...bits];
    newBits[index] = !newBits[index];
    setBits(newBits);
  };

  const currentSum = calculateDecimal(bits);

  // Check win condition
  useEffect(() => {
    if (currentSum === target && target !== 0) { // Avoid 0 trigger on init if target happens to be 0 (edge case, handled by reset)
       // But actually target 0 is valid. 
       // Let's rely on user interaction mostly, but useEffect is fine for auto-detect.
       // We only set success if not already success
       if (!isSuccess) {
           setIsSuccess(true);
           setShowConfetti(true);
       }
    } else if (currentSum === target && target === 0 && bits.every(b => !b)) {
        // Special case for 0
        if (!isSuccess) {
            setIsSuccess(true);
            setShowConfetti(true);
        }
    }
  }, [currentSum, target, bits, isSuccess]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Unlock className="w-6 h-6 text-green-600" />
          비트 토글 챌린지
        </h2>
        <p className="text-slate-500">스위치를 조작하여 목표 숫자를 만드세요.</p>
      </div>

      {/* Target Display */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {isSuccess && (
          <div className="absolute inset-0 bg-green-50/90 flex items-center justify-center z-10 backdrop-blur-sm animate-in zoom-in duration-300">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-green-600 mb-2 flex items-center justify-center gap-2">
                <CheckCircle className="w-8 h-8" /> ACCESS GRANTED
              </h3>
              <p className="text-slate-600 mb-4">보안 코드가 해독되었습니다.</p>
              <button 
                onClick={startNewRound}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4" /> 다음 레벨
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 text-center md:text-left">
          <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Target Decimal</div>
          <div className="text-5xl font-mono font-bold text-slate-900">{target}</div>
        </div>

        <div className="hidden md:block w-px h-16 bg-slate-200"></div>

        <div className="flex-1 text-center md:text-right">
          <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Current Sum</div>
          <div className={`text-5xl font-mono font-bold transition-colors ${currentSum === target ? 'text-green-600' : 'text-slate-400'}`}>
            {currentSum}
          </div>
        </div>
      </div>

      {/* Switches */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          {BIT_VALUES.map((val, idx) => (
            <BitSwitch 
              key={val}
              bitValue={val}
              isOn={bits[idx]}
              onToggle={() => toggleBit(idx)}
              disabled={isSuccess}
            />
          ))}
        </div>
        
        {/* Helper Equation */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-slate-200 font-mono text-sm md:text-base text-slate-600 overflow-x-auto whitespace-nowrap">
          <span className="font-bold text-slate-400">Equation: </span>
          {bits.map((isOn, idx) => (
             isOn ? <span key={idx} className="text-green-600 font-bold">{BIT_VALUES[idx]}</span> : null
          )).reduce((prev, curr, idx) => {
             if (!prev) return curr;
             return <>{prev} + {curr}</>;
          }, null as React.ReactNode) || <span className="text-slate-400">0</span>}
          <span className="mx-2">=</span>
          <span className="font-bold">{currentSum}</span>
        </div>
      </div>

      <div className="flex justify-center">
         <button 
            onClick={startNewRound}
            className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm"
         >
            <RefreshCw className="w-4 h-4" /> Reset Number
         </button>
      </div>

    </div>
  );
};