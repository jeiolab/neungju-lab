import React, { useState } from 'react';
import { DiagnosisType } from '../types';

const QuizTab: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const quiz = {
    question: "다음 코드의 실행 결과로 올바른 것은?",
    code: `
수축기_혈압 = 135
이완기_혈압 = 85

IF 수축기_혈압 >= 140:
    판정 = "위험"
ELSE IF 수축기_혈압 >= 120:
    판정 = "주의"
ELSE:
    판정 = "정상"
    `,
    options: [
      { id: 1, text: "위험", correct: false },
      { id: 2, text: "주의", correct: true },
      { id: 3, text: "정상", correct: false },
    ],
    explanation: "수축기 혈압 135는 140보다는 작지만(False), 120보다는 크거나 같으므로(True) 두 번째 조건인 '주의'에 해당합니다."
  };

  const handleCheck = (id: number) => {
    setSelectedOption(id);
    setShowAnswer(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white">
          <h2 className="text-xl font-bold">🩺 AI 코딩 퀴즈</h2>
        </div>
        <div className="p-6">
          <p className="text-lg text-slate-800 font-medium mb-4">{quiz.question}</p>
          
          <div className="bg-slate-900 rounded-lg p-4 mb-6 font-mono text-sm text-green-400 overflow-x-auto shadow-inner">
            <pre>{quiz.code}</pre>
          </div>

          <div className="space-y-3">
            {quiz.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleCheck(option.id)}
                disabled={showAnswer}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  showAnswer
                    ? option.correct
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : option.id === selectedOption
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 opacity-50'
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{option.text}</span>
                  {showAnswer && option.correct && <span>✅ 정답!</span>}
                  {showAnswer && !option.correct && option.id === selectedOption && <span>❌</span>}
                </div>
              </button>
            ))}
          </div>

          {showAnswer && (
            <div className="mt-6 p-4 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100 animate-fade-in">
              <p className="font-bold mb-1">💡 해설</p>
              <p>{quiz.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;
