import React, { useState, useEffect } from 'react';
import { generateRandomTarget, toBinaryString } from '../types';
import { HelpCircle, Check, X, ArrowRight } from 'lucide-react';

export const Quiz: React.FC = () => {
  const [question, setQuestion] = useState(0);
  const [binaryStr, setBinaryStr] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');

  useEffect(() => {
    nextQuestion();
  }, []);

  const nextQuestion = () => {
    const newVal = generateRandomTarget();
    setQuestion(newVal);
    setBinaryStr(toBinaryString(newVal));
    setUserAnswer("");
    setStatus('IDLE');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(userAnswer);
    if (isNaN(val)) return;

    if (val === question) {
      setStatus('CORRECT');
    } else {
      setStatus('WRONG');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          역설계 퀴즈
        </h2>
        <p className="text-slate-500 mt-2">제시된 2진수 코드를 보고 10진수로 변환하여 입력하세요.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Question Display */}
        <div className="bg-slate-50 border-b border-slate-200 p-8 text-center">
          <div className="text-slate-500 text-sm mb-2 font-mono">BINARY CODE</div>
          <div className="text-4xl md:text-5xl font-mono font-bold text-blue-600 tracking-[0.2em]">
            {binaryStr.slice(0, 4)} <span className="text-blue-400">.</span> {binaryStr.slice(4)}
          </div>
        </div>

        {/* Answer Input */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative">
              <input 
                type="number" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={status === 'CORRECT'}
                placeholder="0-255"
                className={`
                  w-full text-center text-4xl font-bold font-mono py-4 border-b-2 bg-transparent outline-none transition-colors
                  ${status === 'IDLE' ? 'border-slate-300 focus:border-blue-500 text-slate-900' : ''}
                  ${status === 'CORRECT' ? 'border-blue-500 text-blue-600' : ''}
                  ${status === 'WRONG' ? 'border-red-500 text-red-600' : ''}
                `}
                autoFocus
              />
              {status === 'CORRECT' && <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 w-8 h-8" />}
              {status === 'WRONG' && <X className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 w-8 h-8" />}
            </div>

            {status === 'IDLE' && (
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors"
              >
                해독 확인
              </button>
            )}

            {status === 'CORRECT' && (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-50 text-blue-900 p-4 rounded-lg text-center font-bold mb-4">
                  정답입니다! 완벽한 해독이군요.
                </div>
                <button 
                  type="button" 
                  onClick={nextQuestion}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
                >
                  다음 문제 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {status === 'WRONG' && (
              <div className="animate-in shake duration-300">
                <div className="bg-red-50 text-red-900 p-4 rounded-lg text-center font-bold mb-4">
                  틀렸습니다. 다시 계산해보세요.
                </div>
                <button 
                  type="button" 
                  onClick={() => setStatus('IDLE')}
                  className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-200"
                >
                  다시 시도
                </button>
              </div>
            )}
          </form>

          {/* Cheat Sheet Toggle */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <details className="text-sm text-slate-600 cursor-pointer">
              <summary className="hover:text-blue-600 transition-colors">힌트 보기: 비트 값</summary>
              <div className="mt-2 flex justify-between font-mono bg-slate-50 p-2 rounded">
                 <span>128</span><span>64</span><span>32</span><span>16</span><span>8</span><span>4</span><span>2</span><span>1</span>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};