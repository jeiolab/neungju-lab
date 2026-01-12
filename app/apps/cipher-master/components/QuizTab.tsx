import React, { useState, useEffect } from 'react';
import { generateQuestion, caesarDecrypt } from '../utils/cipherLogic';
import { RefreshCw, CheckCircle, XCircle, Trophy, HelpCircle, Lightbulb } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [question, setQuestion] = useState(generateQuestion());
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const handleCheck = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (status === 'CORRECT') {
       // If already correct, pressing enter goes to next
       handleNext();
       return;
    }

    if (userGuess.trim().toUpperCase() === question.plain) {
      setStatus('CORRECT');
      setScore(s => s + 10 + (streak * 2));
      setStreak(s => s + 1);
    } else {
      setStatus('WRONG');
      setStreak(0);
    }
  };

  const handleNext = () => {
    setQuestion(generateQuestion());
    setUserGuess('');
    setStatus('IDLE');
    setShowHint(false);
    setHintUsed(false);
  };

  const handleShowHint = () => {
    if (!hintUsed) {
      setShowHint(true);
      setHintUsed(true);
      // 힌트를 사용하면 점수 감점
      setScore(s => Math.max(0, s - 2));
    }
  };

  // 힌트: 첫 글자와 마지막 글자 보여주기
  const getHint = () => {
    const plain = question.plain;
    if (plain.length <= 2) return plain;
    return plain[0] + '?'.repeat(plain.length - 2) + plain[plain.length - 1];
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-fadeIn">
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        
        {/* Header / Score */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">복호화 챌린지</h2>
            <p className="text-slate-600 text-sm">암호문을 해독하고 점수를 얻으세요.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-purple-600">{score}</div>
            <div className="text-xs text-slate-600 flex items-center justify-end gap-1">
                 <Trophy size={12} className={streak > 2 ? "text-purple-500" : "text-slate-400"} />
                 연속 정답: {streak}
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="mb-8 text-center space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <div className="text-xs text-slate-600 uppercase tracking-widest mb-2">문제 (암호문)</div>
                <div className="text-4xl md:text-5xl font-mono font-bold text-slate-900 tracking-widest break-all">
                    {question.cipher}
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-600">
                <span>키 값은</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded font-bold font-mono">
                    -{question.shift}
                </span>
                <span>입니다 (반대로 이동)</span>
            </div>

            {/* Hint Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleShowHint}
                disabled={hintUsed}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  hintUsed 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Lightbulb size={16} className={hintUsed ? 'opacity-50' : ''} />
                <span>{hintUsed ? '힌트 사용됨' : '힌트 보기 (-2점)'}</span>
              </button>
            </div>

            {/* Hint Display */}
            {showHint && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
                <div className="flex items-start gap-2">
                  <HelpCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 font-semibold mb-1">💡 힌트</div>
                    <div className="text-lg font-mono font-bold text-blue-700">
                      {getHint()}
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
                      첫 글자와 마지막 글자를 확인하세요!
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleCheck} className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => {
                        setUserGuess(e.target.value);
                        if (status !== 'IDLE') setStatus('IDLE');
                    }}
                    placeholder="해독된 단어를 입력하세요..."
                    className={`w-full bg-white p-4 pl-6 rounded-xl border outline-none font-mono text-xl transition-colors ${
                        status === 'WRONG' ? 'border-red-500 text-red-700' : 
                        status === 'CORRECT' ? 'border-green-500 text-green-700' : 
                        'border-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-900'
                    }`}
                    autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {status === 'CORRECT' && <CheckCircle className="text-green-500 animate-bounce" />}
                    {status === 'WRONG' && <XCircle className="text-red-500 animate-pulse" />}
                </div>
            </div>

            <div className="flex gap-3">
                 <button
                    type="submit"
                    disabled={status === 'CORRECT'}
                    className={`flex-1 py-4 rounded-xl font-bold transition-all transform active:scale-95 ${
                        status === 'CORRECT' 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                        : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-200'
                    }`}
                >
                    정답 확인
                </button>
                {status === 'CORRECT' && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse"
                    >
                        다음 문제 <RefreshCw size={18} />
                    </button>
                )}
            </div>
        </form>
        
        {status === 'WRONG' && (
            <div className="mt-4 text-center text-red-600 text-sm animate-shake">
                다시 시도해보세요! {question.shift}칸 뒤로 밀어야 합니다.
            </div>
        )}

      </div>
    </div>
  );
};

export default QuizTab;