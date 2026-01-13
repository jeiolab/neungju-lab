import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuizSectionProps {
  onScoreUpdate: (points: number) => void;
  quizScore: number;
}

const QuizSection: React.FC<QuizSectionProps> = ({ onScoreUpdate, quizScore }) => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({}); // questionId -> selectedOptionIndex
  const [showResult, setShowResult] = useState<{ [key: number]: boolean }>({});

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResult[qId]) return; // Locked after answering
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const checkAnswer = (qId: number, correctIdx: number) => {
    if (showResult[qId]) return;
    
    const isCorrect = answers[qId] === correctIdx;
    setShowResult(prev => ({ ...prev, [qId]: true }));
    
    if (isCorrect) {
      onScoreUpdate(10);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 mb-6">
        <h2 className="text-xl font-bold text-slate-800">개념 확인 퀴즈</h2>
        <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          현재 점수: {quizScore}점
        </div>
      </div>

      <div className="grid gap-6">
        {QUIZZES.map((q) => {
          const isAnswered = showResult[q.id];
          const isCorrect = answers[q.id] === q.correctAnswer;
          const selectedIdx = answers[q.id];

          return (
            <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded mb-2 font-bold
                    ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                      q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                  `}>
                    {q.difficulty === 'easy' ? '쉬움' : q.difficulty === 'medium' ? '보통' : '도전'}
                  </span>
                  <h3 className="text-lg font-medium text-slate-800">{q.question}</h3>
                </div>
                {isAnswered && (
                  isCorrect 
                    ? <CheckCircle className="text-green-500 flex-shrink-0" size={28} />
                    : <XCircle className="text-rose-500 flex-shrink-0" size={28} />
                )}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(q.id, idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all border
                      ${isAnswered 
                        ? idx === q.correctAnswer 
                          ? 'bg-green-50 border-green-300 text-green-800 font-bold' 
                          : idx === selectedIdx 
                            ? 'bg-rose-50 border-rose-300 text-rose-800' 
                            : 'bg-white border-slate-100 text-slate-400'
                        : idx === selectedIdx
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }
                    `}
                  >
                    {idx + 1}. {opt}
                  </button>
                ))}
              </div>

              {!isAnswered ? (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => checkAnswer(q.id, q.correctAnswer)}
                    disabled={selectedIdx === undefined}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
                  >
                    정답 확인
                  </button>
                </div>
              ) : (
                <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-rose-50 text-rose-800'}`}>
                  <p className="font-bold flex items-center gap-2 mb-1">
                    <HelpCircle size={16} /> 해설
                  </p>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizSection;