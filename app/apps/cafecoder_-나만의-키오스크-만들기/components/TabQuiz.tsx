import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { Badge } from '../types';

interface TabQuizProps {
  onAllCorrect: () => void;
  badges: Badge[];
}

const TabQuiz: React.FC<TabQuizProps> = ({ onAllCorrect, badges }) => {
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleInputChange = (id: number, val: string) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const checkAnswers = () => {
    let correctCount = 0;
    QUIZZES.forEach(q => {
      const userAns = answers[q.id]?.trim().toLowerCase() || "";
      const correctAns = q.answer.toLowerCase();
      // Simple exact match check (could be improved)
      if (userAns === correctAns) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResult(true);

    if (correctCount === QUIZZES.length) {
      onAllCorrect();
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto pb-24 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-coffee-800">파이썬 마스터 퀴즈</h2>
        <div className="bg-coffee-100 text-coffee-800 px-3 py-1 rounded-full text-sm font-bold">
          {score} / {QUIZZES.length}
        </div>
      </div>

      {showResult && (
        <div className={`mb-8 p-6 rounded-xl text-center ${score === QUIZZES.length ? 'bg-green-100 border-green-200' : 'bg-coffee-50 border-coffee-200'} border`}>
          {score === QUIZZES.length ? (
            <div className="flex flex-col items-center gap-2">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h3 className="text-xl font-bold text-green-800">축하합니다! 만점입니다!</h3>
              <p className="text-green-700">파이썬 마스터 배지를 획득하셨습니다.</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-coffee-800">조금 더 노력해보세요!</h3>
              <p className="text-coffee-600">오답 노트를 확인하고 다시 도전하세요.</p>
            </div>
          )}
          <button onClick={resetQuiz} className="mt-4 bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50">다시 풀기</button>
        </div>
      )}

      <div className="space-y-6">
        {QUIZZES.map((q, idx) => {
          const isCorrect = answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase();
          const userAnswer = answers[q.id] || "";

          return (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  q.difficulty === '초급' ? 'bg-green-100 text-green-700' :
                  q.difficulty === '중급' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {q.difficulty}
                </span>
                {showResult && (
                  isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {idx + 1}. {q.question}
              </h3>

              <div className="mb-4">
                {q.type === 'choice' ? (
                  <div className="grid grid-cols-1 gap-2">
                    {q.options?.map(opt => (
                      <button
                        key={opt}
                        disabled={showResult}
                        onClick={() => handleInputChange(q.id, opt)}
                        className={`p-3 rounded-lg text-left border transition-all ${
                          userAnswer === opt 
                            ? 'bg-coffee-100 border-coffee-500 text-coffee-900 ring-1 ring-coffee-500' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        } ${showResult && opt === q.answer ? '!bg-green-100 !border-green-500' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input 
                    type="text"
                    disabled={showResult}
                    value={userAnswer}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    placeholder="정답을 입력하세요"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 outline-none font-mono"
                  />
                )}
              </div>

              {showResult && !isCorrect && (
                <div className="bg-red-50 p-3 rounded text-sm text-red-700 border border-red-100">
                  <p className="font-bold">정답: {q.answer}</p>
                  <p className="mt-1">{q.explanation}</p>
                </div>
              )}
              {showResult && isCorrect && (
                <div className="bg-green-50 p-3 rounded text-sm text-green-700 border border-green-100">
                  <p className="font-bold">정답입니다!</p>
                  <p className="mt-1">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResult && (
        <button 
          onClick={checkAnswers}
          className="w-full mt-8 bg-coffee-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-coffee-700 shadow-lg transition-transform active:scale-95"
        >
          채점하기
        </button>
      )}
    </div>
  );
};

export default TabQuiz;