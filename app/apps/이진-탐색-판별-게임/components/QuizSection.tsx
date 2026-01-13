import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle2, XCircle } from 'lucide-react';

const QuizSection: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctIndex) score += 1;
    });
    return score;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-indigo-900 mb-2">개념 확인 퀴즈</h2>
        <p className="text-slate-600 text-sm">총 {QUIZ_QUESTIONS.length}문제입니다. 모든 문제를 풀고 제출해주세요.</p>
      </div>

      {QUIZ_QUESTIONS.map((q, idx) => (
        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between mb-4">
            <span className="font-bold text-indigo-600">Q{idx + 1}</span>
            {submitted && (
              answers[q.id] === q.correctIndex 
                ? <span className="text-green-600 flex items-center gap-1 text-sm font-bold"><CheckCircle2 size={16}/> 정답</span>
                : <span className="text-red-600 flex items-center gap-1 text-sm font-bold"><XCircle size={16}/> 오답</span>
            )}
          </div>
          <h3 className="font-bold text-slate-800 mb-4 text-lg">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((opt, optIdx) => (
              <button
                key={optIdx}
                disabled={submitted}
                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  answers[q.id] === optIdx 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-medium' 
                    : 'border-slate-200 hover:bg-slate-50'
                } ${submitted && optIdx === q.correctIndex ? 'ring-2 ring-green-400 bg-green-50' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {submitted && (
            <div className="mt-4 p-3 bg-slate-50 rounded text-sm text-slate-600">
              <span className="font-bold">해설:</span> {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          답안 제출하기
        </button>
      ) : (
        <div className="text-center p-6 bg-indigo-900 text-white rounded-xl">
          <h3 className="text-2xl font-bold mb-2">총점: {calculateScore()} / {QUIZ_QUESTIONS.length}</h3>
          <p>수고하셨습니다! 오답 노트를 확인하고 다시 도전해보세요.</p>
        </div>
      )}
    </div>
  );
};

export default QuizSection;