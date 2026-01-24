import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { RefreshCcw, CheckCircle, XCircle } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    window.scrollTo(0,0);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">최종 점검 퀴즈</h2>
        <p className="text-gray-600">총 {QUIZ_QUESTIONS.length}문제입니다. 만점에 도전하세요!</p>
      </div>

      {QUIZ_QUESTIONS.map((q, idx) => {
        const isCorrect = answers[q.id] === q.correctAnswer;
        const isAnswered = answers[q.id] !== undefined;
        
        return (
          <div key={q.id} className={`bg-white p-6 rounded-xl shadow-sm border-2 ${submitted ? (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-transparent'}`}>
            <div className="flex items-start justify-between mb-4">
               <h3 className="font-bold text-lg text-gray-800">Q{idx + 1}. {q.question}</h3>
               {submitted && (
                 isCorrect ? <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" /> : <XCircle className="text-red-500 w-6 h-6 flex-shrink-0" />
               )}
            </div>

            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(q.id, optIdx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    answers[q.id] === optIdx 
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-900 font-semibold' 
                      : 'hover:bg-gray-50 border-gray-200 text-gray-700'
                  } ${submitted && q.correctAnswer === optIdx ? 'ring-2 ring-green-500 bg-green-100' : ''}`}
                  disabled={submitted}
                >
                  {optIdx + 1}) {opt}
                </button>
              ))}
            </div>

            {submitted && !isCorrect && (
              <div className="mt-4 p-3 bg-white rounded border border-red-200 text-sm text-red-700">
                <span className="font-bold">오답 노트:</span> {q.explanation}
              </div>
            )}
            {submitted && isCorrect && (
               <div className="mt-4 p-3 bg-white rounded border border-green-200 text-sm text-green-700">
                <span className="font-bold">해설:</span> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      <div className="sticky bottom-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-gray-200 flex justify-between items-center">
        {submitted ? (
          <>
            <div className="text-xl font-bold">
              점수: <span className={score === QUIZ_QUESTIONS.length ? 'text-green-600' : 'text-indigo-600'}>{score}</span> / {QUIZ_QUESTIONS.length}
            </div>
            <button onClick={handleRetry} className="px-6 py-2 bg-gray-800 text-white rounded-lg flex items-center hover:bg-gray-900">
              <RefreshCcw className="mr-2 w-4 h-4" /> 다시 풀기
            </button>
          </>
        ) : (
          <button 
            onClick={handleSubmit} 
            disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-400 shadow-lg"
          >
            채점하기
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTab;