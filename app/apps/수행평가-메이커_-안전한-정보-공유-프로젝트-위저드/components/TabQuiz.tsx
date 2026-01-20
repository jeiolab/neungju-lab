import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { HelpCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export const TabQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  
  const handleAnswer = (qId: number, optionIdx: number) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_DATA.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score += 1;
    });
    return score;
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResult(false);
  };

  const score = calculateScore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle className="text-purple-600" /> 정보보호 퀴즈
        </h2>
        {showResult && (
          <button onClick={resetQuiz} className="text-sm flex items-center gap-1 text-gray-500 hover:text-gray-800">
            <RefreshCw size={14} /> 다시 풀기
          </button>
        )}
      </div>

      {showResult && (
        <div className="bg-purple-50 p-6 rounded-lg text-center mb-6 animate-fadeIn">
          <div className="text-4xl font-bold text-purple-700 mb-2">{score * 20}점</div>
          <p className="text-purple-600">
            {score === 5 ? "완벽합니다! 정보보호 전문가시네요!" : "오답노트를 확인하고 다시 도전해보세요!"}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {QUIZ_DATA.map((q, idx) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          const isAnswered = answers[q.id] !== undefined;

          return (
            <div key={q.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between mb-3">
                <span className="font-bold text-gray-800">Q{idx + 1}. {q.question}</span>
                <span className={`text-xs px-2 py-1 rounded h-fit ${
                  q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {q.difficulty}
                </span>
              </div>
              
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleAnswer(q.id, oIdx)}
                    disabled={showResult}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      showResult 
                        ? oIdx === q.correctAnswer 
                          ? 'bg-green-100 border-green-400'
                          : answers[q.id] === oIdx 
                            ? 'bg-red-100 border-red-400' 
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        : answers[q.id] === oIdx
                          ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300'
                          : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {showResult && !isCorrect && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 text-sm rounded flex gap-2 items-start">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <div>
                    <strong>오답 풀이:</strong> {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResult && (
        <button
          onClick={() => setShowResult(true)}
          disabled={Object.keys(answers).length < QUIZ_DATA.length}
          className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl shadow hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          제출하고 결과 보기
        </button>
      )}
    </div>
  );
};