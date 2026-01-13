import React, { useState } from 'react';
import { QUIZ_POOL } from '../constants';
import { Check, X, RotateCcw } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> selectedOptionIndex
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_POOL.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return correct;
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">시각화 개념 퀴즈</h2>
        {showResults && (
          <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">
            {calculateScore()} / {QUIZ_POOL.length} 정답
          </span>
        )}
      </div>

      {QUIZ_POOL.map((q, idx) => {
        const isAnswered = answers[q.id] !== undefined;
        const isCorrect = answers[q.id] === q.correctIndex;
        
        return (
          <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between mb-3">
              <span className="text-xs font-bold text-gray-400">Q{idx + 1} • {q.conceptTag}</span>
              {showResults && (
                isCorrect 
                  ? <Check className="w-5 h-5 text-green-500" />
                  : <X className="w-5 h-5 text-red-500" />
              )}
            </div>
            <h3 className="font-semibold text-gray-800 mb-4">{q.question}</h3>
            
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(q.id, optIdx)}
                  disabled={showResults}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors border ${
                    showResults 
                      ? (optIdx === q.correctIndex 
                          ? 'bg-green-100 border-green-200 text-green-800 font-bold' 
                          : (answers[q.id] === optIdx ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-100 text-gray-500'))
                      : (answers[q.id] === optIdx 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50')
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {showResults && !isCorrect && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <strong>해설:</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!showResults ? (
        <button
          onClick={() => setShowResults(true)}
          disabled={Object.keys(answers).length < QUIZ_POOL.length}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          제출하고 채점하기
        </button>
      ) : (
        <button
          onClick={resetQuiz}
          className="w-full bg-white border border-indigo-600 text-indigo-600 py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-indigo-50"
        >
          <RotateCcw className="w-4 h-4" />
          다시 풀기
        </button>
      )}
    </div>
  );
};