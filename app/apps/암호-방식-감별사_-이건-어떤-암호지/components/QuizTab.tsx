import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { Check, X } from 'lucide-react';

interface QuizTabProps {
  updateScore: (points: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ updateScore }) => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({}); // qId -> selected option index
  const [results, setResults] = useState<{[key: number]: boolean}>({}); // qId -> isCorrect

  const handleSelect = (qId: number, optionIdx: number, correctIdx: number) => {
    if (answers[qId] !== undefined) return; // Prevent changing answer

    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    const isCorrect = optionIdx === correctIdx;
    setResults(prev => ({ ...prev, [qId]: isCorrect }));

    if (isCorrect) {
      updateScore(5); // 5 points per quiz
    }
  };

  const correctCount = Object.values(results).filter(Boolean).length;
  const progress = (Object.keys(answers).length / QUIZZES.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Progress */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <span className="text-sm text-slate-500 block">진행률</span>
          <div className="w-48 h-2 bg-slate-200 rounded-full mt-1">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-indigo-600">{correctCount}</span>
          <span className="text-slate-400"> / {QUIZZES.length} 정답</span>
        </div>
      </div>

      <div className="space-y-6">
        {QUIZZES.map((q, idx) => {
          const userAnswer = answers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = results[q.id];

          return (
            <div key={q.id} className={`bg-white rounded-xl p-6 shadow-md transition-all ${isAnswered ? (isCorrect ? 'border-2 border-green-200' : 'border-2 border-red-200') : ''}`}>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Q{idx + 1}. {q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(q.id, oIdx, q.answer)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isAnswered
                        ? oIdx === q.answer 
                          ? 'bg-green-100 border-green-400 text-green-900 font-bold' 
                          : oIdx === userAnswer 
                            ? 'bg-red-100 border-red-400 text-red-900' 
                            : 'bg-slate-50 border-slate-100 text-slate-400'
                        : 'bg-white border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{opt}</span>
                      {isAnswered && oIdx === q.answer && <Check className="w-5 h-5 text-green-600" />}
                      {isAnswered && oIdx === userAnswer && oIdx !== q.answer && <X className="w-5 h-5 text-red-600" />}
                    </div>
                  </button>
                ))}
              </div>
              
              {isAnswered && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 border-l-4 border-slate-400">
                  <span className="font-bold mr-2">해설:</span>
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

export default QuizTab;