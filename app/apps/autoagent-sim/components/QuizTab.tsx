import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { QUIZ_DATA } from '../constants';

const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: number]: number | null}>({});

  const handleSelect = (qId: number, optionIdx: number) => {
    if (answers[qId] !== undefined) return; // Prevent changing answer
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">상황 판단 퀴즈</h2>
        <p className="text-gray-500">다양한 주행 상황에서 가장 필요한 에이전트 특성을 맞춰보세요.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZ_DATA.map((q) => {
          const userAnswer = answers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
              <div className="flex items-start gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-snug">
                  {q.question}
                </h3>
              </div>
              
              <div className="space-y-2 flex-1">
                {q.options.map((opt, idx) => {
                  let btnClass = "border border-gray-200 hover:bg-gray-50";
                  
                  if (isAnswered) {
                    if (idx === q.correctAnswer) btnClass = "bg-green-50 border-green-200 text-green-800 font-medium ring-1 ring-green-200";
                    else if (idx === userAnswer) btnClass = "bg-red-50 border-red-200 text-red-800 ring-1 ring-red-200";
                    else btnClass = "bg-gray-50 text-gray-400 border-transparent opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(q.id, idx)}
                      disabled={isAnswered}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm flex justify-between items-center ${btnClass}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && idx === q.correctAnswer && <CheckCircle size={18} className="text-green-600 flex-shrink-0" />}
                      {isAnswered && idx === userAnswer && idx !== q.correctAnswer && <XCircle size={18} className="text-red-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className={`mt-6 p-4 rounded-xl text-sm animate-fade-in-up ${isCorrect ? 'bg-green-50 text-green-900 border border-green-100' : 'bg-red-50 text-red-900 border border-red-100'}`}>
                  <strong className="block mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</strong> 
                  <span className="opacity-90">{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTab;
