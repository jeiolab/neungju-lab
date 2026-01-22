import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { Check, X, RefreshCw } from 'lucide-react';

interface TabQuizProps {
  score: number;
  setScore: (s: number) => void;
  completed: boolean;
  setCompleted: (b: boolean) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ score, setScore, completed, setCompleted }) => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    QUIZ_DATA.forEach(q => {
      if (answers[q.id] === q.answer) correctCount++;
    });
    setScore(correctCount);
    setCompleted(true);
    setShowResult(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResult(false);
    setCompleted(false);
    setScore(0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎓 보안 지식 점검 퀴즈</h2>
        <p className="text-gray-600">
          총 10문제가 출제됩니다. 문제를 풀고 내 보안 지식 수준을 확인해보세요.
        </p>
      </div>

      <div className="space-y-6">
        {QUIZ_DATA.map((q, idx) => {
          const isCorrect = answers[q.id] === q.answer;
          const isSelected = answers[q.id] !== undefined;
          
          return (
            <div key={q.id} className={`bg-white p-6 rounded-xl border ${showResult ? (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-gray-200'}`}>
              <h3 className="font-bold text-lg mb-4 flex gap-2">
                <span className="text-indigo-600">Q{idx + 1}.</span> {q.question}
              </h3>
              
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(q.id, oIdx)}
                    className={`w-full text-left p-3 rounded-lg border transition-all
                      ${answers[q.id] === oIdx 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}
                      ${showResult && q.answer === oIdx ? '!bg-green-600 !text-white !border-green-600' : ''}
                      ${showResult && answers[q.id] === oIdx && answers[q.id] !== q.answer ? '!bg-red-500 !text-white !border-red-500' : ''}
                    `}
                    disabled={showResult}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className="mt-4 p-4 bg-white/60 rounded-lg text-sm">
                  <p className={`font-bold mb-1 flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {isCorrect ? '정답입니다!' : '오답입니다.'}
                  </p>
                  <p className="text-gray-700">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center pt-6">
        {!showResult ? (
          <button 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < QUIZ_DATA.length}
            className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-transform hover:-translate-y-1 ${Object.keys(answers).length < QUIZ_DATA.length ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            제출하고 채점하기
          </button>
        ) : (
          <div className="space-y-4">
             <div className="text-2xl font-bold text-gray-800">
                당신의 점수는 <span className="text-indigo-600">{score}개</span> / 10개 입니다!
             </div>
             <button 
              onClick={handleRetry}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> 다시 풀기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;
