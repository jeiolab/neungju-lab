import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { Trophy, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface QuizSectionProps {
  onScoreUpdate: (score: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onScoreUpdate }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correctCount = 0;
    QUIZ_DATA.forEach(q => {
      if (answers[q.id]?.trim() === q.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
    onScoreUpdate(correctCount);
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">개념 확인 퀴즈</h2>
        <p className="text-slate-500">총 10문제입니다. 배운 내용을 확인해보세요!</p>
      </div>

      {submitted && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 text-center animate-bounce-in">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-slate-800">결과: {score} / 10점</h3>
          <p className="text-slate-600 mb-4">
            {score === 10 ? '완벽합니다! 객체지향 마스터시네요!' : 
             score >= 7 ? '훌륭합니다! 조금만 더 복습해볼까요?' : 
             '이론 탭으로 돌아가서 복습하고 다시 도전해보세요!'}
          </p>
          <button 
            onClick={resetQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 풀기
          </button>
        </div>
      )}

      <div className="space-y-6">
        {QUIZ_DATA.map((q, index) => {
          const isCorrect = submitted && answers[q.id]?.trim() === q.answer;
          const isWrong = submitted && !isCorrect;

          return (
            <div key={q.id} className={`bg-white p-6 rounded-xl shadow-sm border-2 ${
              isCorrect ? 'border-green-200 bg-green-50' : 
              isWrong ? 'border-red-200 bg-red-50' : 
              'border-slate-100'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {q.difficulty.toUpperCase()}
                  </span>
                  <span className="font-bold text-slate-400">Q{index + 1}.</span>
                </div>
                {submitted && (
                  <div>
                    {isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-slate-800 mb-4">{q.question}</h3>

              {q.type === 'multiple' ? (
                <div className="space-y-2">
                  {q.options?.map((opt) => (
                    <label key={opt} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      answers[q.id] === opt 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input 
                        type="radio" 
                        name={`q-${q.id}`} 
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                        disabled={submitted}
                        className="mr-3 w-4 h-4 text-blue-600"
                      />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input 
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                  disabled={submitted}
                  placeholder="답을 입력하세요"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              )}

              {submitted && (
                <div className="mt-4 p-4 bg-white rounded border border-slate-200">
                  <p className="text-sm font-bold text-slate-600 mb-1">정답 및 해설:</p>
                  <p className="text-blue-600 font-medium mb-1">{q.answer}</p>
                  <p className="text-sm text-slate-500">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex justify-center pt-6">
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 shadow-lg transform transition hover:-translate-y-1"
          >
            채점하기
          </button>
        </div>
      )}
    </div>
  );
};
