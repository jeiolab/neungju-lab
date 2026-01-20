import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Check, X, Award } from 'lucide-react';

interface QuizTabProps {
  onScoreUpdate: (points: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        score += 10;
      }
    });
    onScoreUpdate(score);
    setShowResults(true);
  };

  const currentScore = Object.keys(answers).reduce((acc, qId) => {
      const q = QUIZ_QUESTIONS.find(que => que.id === parseInt(qId));
      if (q && answers[q.id] === q.correctIndex) return acc + 1;
      return acc;
  }, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">지식 확인 퀴즈</h2>
          {showResults && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                  <Award size={20} /> 점수: {currentScore} / {QUIZ_QUESTIONS.length}
              </div>
          )}
      </div>

      {QUIZ_QUESTIONS.map((q, idx) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.correctIndex;
        const showFeedback = showResults;

        return (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-slate-800">Q{idx + 1}. {q.question}</h3>
                <span className={`text-xs px-2 py-1 rounded font-bold ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {q.difficulty}
                </span>
            </div>
            
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                if (showResults) {
                    if (optIdx === q.correctIndex) btnClass += "bg-green-100 border-green-500 text-green-800 font-bold ";
                    else if (userAnswer === optIdx) btnClass += "bg-red-50 border-red-300 text-red-800 ";
                    else btnClass += "bg-slate-50 border-slate-200 text-slate-400 ";
                } else {
                    btnClass += userAnswer === optIdx ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 " : "bg-white border-slate-200 hover:bg-slate-50 ";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(q.id, optIdx)}
                    disabled={showResults}
                    className={btnClass}
                  >
                    <div className="flex justify-between items-center">
                        {opt}
                        {showResults && optIdx === q.correctIndex && <Check size={18} className="text-green-600" />}
                        {showResults && userAnswer === optIdx && optIdx !== q.correctIndex && <X size={18} className="text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {showFeedback && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 border-l-4 border-indigo-500">
                    <strong>해설:</strong> {q.explanation}
                </div>
            )}
          </div>
        );
      })}

      {!showResults && (
        <button
          onClick={calculateScore}
          disabled={Object.keys(answers).length !== QUIZ_QUESTIONS.length}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          답안 제출하기
        </button>
      )}
    </div>
  );
};

export default QuizTab;