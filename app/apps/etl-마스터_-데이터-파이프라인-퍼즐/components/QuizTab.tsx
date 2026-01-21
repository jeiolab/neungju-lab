import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    setScore(correctCount);
    setIsSubmitted(true);
    
    // Save to local storage
    localStorage.setItem('etl_quiz_score', correctCount.toString());
  };

  const handleRetry = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">데이터 엔지니어링 능력 평가</h2>
        <p className="text-slate-500">데이터 전처리 및 ETL 파이프라인에 대한 지식을 테스트해보세요.</p>
      </div>

      <div className="space-y-8">
        {QUIZ_QUESTIONS.map((q, index) => {
          const userAnswer = answers[q.id];
          const isCorrect = isSubmitted && userAnswer === q.correctAnswer;
          const isWrong = isSubmitted && userAnswer !== q.correctAnswer && userAnswer !== undefined;

          return (
            <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0">
              <h3 className="font-semibold text-lg text-slate-800 mb-4 flex gap-2">
                <span className="text-brand-600">{index + 1}.</span> {q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, i)}
                    disabled={isSubmitted}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex justify-between items-center
                      ${!isSubmitted && userAnswer === i ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500" : "border-slate-200 hover:bg-slate-50"}
                      ${isSubmitted && q.correctAnswer === i ? "border-green-500 bg-green-50 text-green-700" : ""}
                      ${isSubmitted && userAnswer === i && userAnswer !== q.correctAnswer ? "border-red-500 bg-red-50 text-red-700" : ""}
                    `}
                  >
                    <span>{opt}</span>
                    {isSubmitted && q.correctAnswer === i && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isSubmitted && userAnswer === i && userAnswer !== q.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                  </button>
                ))}
              </div>
              {isSubmitted && (
                 <div className="mt-3 p-3 bg-slate-50 rounded text-sm text-slate-600">
                   <strong>해설:</strong> {q.explanation}
                 </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== QUIZ_QUESTIONS.length}
            className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            제출하기
          </button>
        ) : (
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm text-slate-500">당신의 점수</p>
                <p className="text-2xl font-bold text-brand-600">{score} / {QUIZ_QUESTIONS.length}</p>
             </div>
             <button 
                onClick={handleRetry}
                className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
             >
                다시 풀기
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;