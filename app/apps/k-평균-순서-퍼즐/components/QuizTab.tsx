import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizTabProps {
  onScoreUpdate: (score: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_DATA.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    return correct;
  };

  const handleSubmit = () => {
    setShowResults(true);
    const correctCount = calculateScore();
    const score = (correctCount / QUIZ_DATA.length) * 100; // normalized score for badges
    onScoreUpdate(score);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">이해 쏙쏙 퀴즈</h2>
        <p className="text-slate-600">K-평균 알고리즘에 대해 얼마나 이해했는지 확인해보세요.</p>
      </div>

      <div className="space-y-6">
        {QUIZ_DATA.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex gap-2">
                <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">{idx + 1}</span>
                {q.question}
              </h3>
              <span className={`text-xs px-2 py-1 rounded font-bold uppercase
                ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                  q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {q.difficulty}
              </span>
            </div>

            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[q.id] === optIdx;
                const isCorrect = q.correctIndex === optIdx;
                let className = "w-full text-left p-3 rounded-lg border transition-all ";
                
                if (showResults) {
                  if (isCorrect) className += "bg-green-50 border-green-500 text-green-800 font-bold ";
                  else if (isSelected && !isCorrect) className += "bg-red-50 border-red-500 text-red-800 ";
                  else className += "border-slate-200 opacity-50 ";
                } else {
                  if (isSelected) className += "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium shadow-sm ring-1 ring-indigo-500 ";
                  else className += "border-slate-200 hover:bg-slate-50 hover:border-indigo-300 ";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(q.id, optIdx)}
                    className={className}
                    disabled={showResults}
                  >
                    <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {showResults && isCorrect && <CheckCircle className="w-4 h-4 text-green-600"/>}
                        {showResults && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600"/>}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResults && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 border-l-4 border-indigo-400">
                <strong>해설:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!showResults && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length < QUIZ_DATA.length}
          className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          제출하고 결과 보기
        </button>
      )}

      {showResults && (
        <div className="text-center p-6 bg-indigo-50 rounded-xl">
            <p className="text-xl font-bold text-indigo-900 mb-2">
                맞힌 개수: {calculateScore()} / {QUIZ_DATA.length}
            </p>
            <button 
                onClick={() => { setShowResults(false); setSelectedAnswers({}); }}
                className="text-indigo-600 font-medium hover:underline"
            >
                다시 풀기
            </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;
