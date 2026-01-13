import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';

const InvestigationLog: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation(prev => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">수사 일지 (Investigation Log)</h2>
        <p className="text-slate-400">이 중요한 질문들에 답하여 당신의 데이터 탐정 능력을 증명하세요.</p>
      </div>

      {QUIZ_QUESTIONS.map((q) => {
        const isAnswered = answers[q.id] !== undefined;
        const isCorrect = answers[q.id] === q.correctIndex;

        return (
          <div key={q.id} className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
            <h3 className="text-lg font-bold text-slate-100 mb-4">
              <span className="text-amber-500 mr-2">질문 {q.id}.</span>
              {q.question}
            </h3>
            
            <div className="space-y-3">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !isAnswered && handleSelect(q.id, idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded transition-all duration-200 border
                    ${
                      isAnswered
                        ? idx === q.correctIndex
                          ? 'bg-green-900/50 border-green-500 text-green-100'
                          : idx === answers[q.id]
                          ? 'bg-red-900/50 border-red-500 text-red-100'
                          : 'bg-slate-700/50 border-transparent text-slate-400 opacity-50'
                        : 'bg-slate-700 hover:bg-slate-600 border-transparent text-slate-200'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {showExplanation[q.id] && (
              <div className={`mt-4 p-4 rounded ${isCorrect ? 'bg-green-900/30 text-green-200' : 'bg-red-900/30 text-red-200'}`}>
                <p className="font-bold mb-1">{isCorrect ? '정답입니다!' : '아쉽게도 틀렸습니다.'}</p>
                <p className="text-sm opacity-90">{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InvestigationLog;
