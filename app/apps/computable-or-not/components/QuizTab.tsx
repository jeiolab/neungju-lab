import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizTabProps {
  onScoreUpdate: (points: number) => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    return correctCount;
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < QUIZ_QUESTIONS.length) {
      alert("모든 문제를 풀어주세요!");
      return;
    }
    const correctCount = calculateScore();
    onScoreUpdate(correctCount * 5); // 5 points per question
    setSubmitted(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">확인 퀴즈</h2>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">
            {submitted ? `점수: ${calculateScore()} / ${QUIZ_QUESTIONS.length}` : '진행 중'}
        </span>
      </div>

      <div className="space-y-8">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          
          return (
            <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between mb-3">
                 <span className="text-xs font-bold text-slate-400">Q{idx + 1}. {q.difficulty}</span>
                 {submitted && (
                     isCorrect ? <CheckCircle2 className="text-green-500" size={20}/> : <XCircle className="text-red-500" size={20}/>
                 )}
              </div>
              
              <h3 className="font-bold text-slate-800 mb-4 text-sm">{q.text}</h3>
              
              <div className="space-y-2">
                {q.options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                      answers[q.id] === opt
                        ? submitted 
                            ? isCorrect ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'
                            : 'bg-indigo-100 border-indigo-300 text-indigo-900 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                    } ${submitted && opt === q.correctAnswer ? 'ring-2 ring-green-500 bg-green-50' : ''}`}
                    disabled={submitted}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {submitted && !isCorrect && (
                  <p className="mt-3 text-xs text-red-500">정답: {q.correctAnswer}</p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition"
        >
          채점하기
        </button>
      )}
    </div>
  );
};
