import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const PredictionQuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-white">퀴즈 완료!</h2>
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-slate-300">
          총 {QUIZ_QUESTIONS.length}문제 중 <span className="text-cyan-400 font-bold">{score}</span>문제를 맞혔습니다.
        </p>
        <button 
          onClick={resetQuiz}
          className="px-6 py-2 bg-cyan-600 rounded-full text-white font-bold hover:bg-cyan-500"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-lg mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">미래 예측 퀴즈</h2>
        <span className="text-sm text-slate-400">
          {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg mb-6">
        <h3 className="text-lg font-medium text-white mb-6 leading-relaxed">
          Q. {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all ";
            
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnClass += "bg-green-900/30 border-green-500 text-green-300";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-900/30 border-red-500 text-red-300";
              } else {
                btnClass += "bg-slate-700/50 border-slate-700 text-slate-500 opacity-50";
              }
            } else {
              btnClass += "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 hover:border-cyan-500";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && idx === currentQ.correctIndex && <CheckCircle2 size={20} />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={20} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-fade-in bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-6">
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <AlertCircle size={16} className="mt-0.5 text-cyan-400 shrink-0" />
            <p>{currentQ.explanation}</p>
          </div>
        </div>
      )}

      {isAnswered && (
        <button
          onClick={nextQuestion}
          className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl shadow-lg transition-colors"
        >
          {currentQIndex < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'}
        </button>
      )}
    </div>
  );
};

export default PredictionQuizTab;