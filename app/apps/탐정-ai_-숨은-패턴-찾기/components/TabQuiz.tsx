import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, Trophy, RefreshCcw } from 'lucide-react';

export const TabQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center animate-fadeIn">
        <div className="mb-6 flex justify-center">
          {score === QUIZ_QUESTIONS.length ? (
            <div className="bg-yellow-100 p-6 rounded-full">
              <Trophy size={64} className="text-yellow-600 animate-bounce" />
            </div>
          ) : (
            <div className="bg-slate-100 p-6 rounded-full">
              <CheckCircle size={64} className="text-slate-500" />
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">퀴즈 종료!</h2>
        <p className="text-lg text-slate-600 mb-6">
          당신의 점수는 <span className="text-blue-600 font-bold text-2xl">{score}</span> / {QUIZ_QUESTIONS.length} 점입니다.
        </p>
        
        {score === QUIZ_QUESTIONS.length && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
             <h3 className="font-bold text-yellow-800 mb-1">🏅 명탐정 배지 획득!</h3>
             <p className="text-sm text-yellow-700">완벽합니다! 데이터 패턴의 마스터시군요.</p>
          </div>
        )}

        <button 
          onClick={restart}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={18} /> 다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300" 
          style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Difficulty Label */}
        <span className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded ${
          currentQ.difficulty === '상' ? 'bg-red-100 text-red-600' :
          currentQ.difficulty === '중' ? 'bg-yellow-100 text-yellow-600' :
          'bg-green-100 text-green-600'
        }`}>
          난이도: {currentQ.difficulty}
        </span>

        <h2 className="text-xl font-bold text-slate-800 mb-6 pr-12">
          Q{currentQ.id}. {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
            
            if (showResult) {
               if (idx === currentQ.correctAnswer) {
                 btnClass += "border-green-500 bg-green-50 text-green-800";
               } else if (idx === selectedOption) {
                 btnClass += "border-red-500 bg-red-50 text-red-800";
               } else {
                 btnClass += "border-slate-100 text-slate-400 opacity-50";
               }
            } else {
               btnClass += "border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {showResult && idx === currentQ.correctAnswer && <CheckCircle size={20} className="text-green-500"/>}
                  {showResult && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle size={20} className="text-red-500"/>}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 animate-fadeIn">
            <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-700">
              <strong>💡 해설:</strong> {currentQ.explanation}
            </div>
            <button
              onClick={nextQuestion}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold"
            >
              {currentIdx < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};