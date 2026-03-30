import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const handleSubmit = () => {
    setShowResult(true);
    const score = calculateScore();
    // Award points roughly
    if (score > 0) onComplete(score * 10);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">개념 확인 퀴즈</h2>
        <p className="text-slate-500">프로젝트 설계 전, 핵심 개념을 점검해봅시다.</p>
      </div>

      {QUIZ_QUESTIONS.map((q, idx) => {
        const isCorrect = answers[q.id] === q.correctAnswer;
        const userAnswer = answers[q.id];
        
        return (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Q{idx+1}. {q.question}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {q.difficulty}
                </span>
            </div>
            
            <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                    <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors flex justify-between items-center
                            ${userAnswer === optIdx ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'}
                            ${showResult && q.correctAnswer === optIdx ? '!bg-green-100 !border-green-500' : ''}
                            ${showResult && userAnswer === optIdx && userAnswer !== q.correctAnswer ? '!bg-red-100 !border-red-500' : ''}
                        `}
                    >
                        <span>{opt}</span>
                        {showResult && q.correctAnswer === optIdx && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {showResult && userAnswer === optIdx && userAnswer !== q.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                    </button>
                ))}
            </div>

            {showResult && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                    <strong>해설:</strong> {q.explanation}
                </div>
            )}
          </div>
        );
      })}

      {!showResult && (
        <button 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-transform active:scale-95"
        >
            채점하기
        </button>
      )}
      
      {showResult && (
          <div className="text-center p-6 bg-slate-800 text-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-2">점수: {calculateScore()} / {QUIZ_QUESTIONS.length}</h3>
              <p>{calculateScore() === QUIZ_QUESTIONS.length ? "완벽합니다! 이제 프로젝트를 설계해보세요." : "오답 노트를 확인하고 다시 도전해보세요."}</p>
          </div>
      )}
    </div>
  );
};

export default Quiz;
