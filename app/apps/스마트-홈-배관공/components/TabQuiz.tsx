import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState<Record<number, boolean>>({});

  const handleAnswer = (qId: number, optionIdx: number) => {
    setAnswers({ ...answers, [qId]: optionIdx });
    setShowResult({ ...showResult, [qId]: true });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <HelpCircle className="text-blue-500" /> 개념 확인 퀴즈
      </h2>

      <div className="space-y-8">
        {QUIZ_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Q{idx + 1}. {q.question}</h3>
            
            <div className="grid gap-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[q.id] === optIdx;
                const isCorrect = q.correctAnswer === optIdx;
                const revealed = showResult[q.id];
                
                let btnClass = "text-left p-4 rounded-lg border transition-all ";
                if (revealed) {
                    if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
                    else if (isSelected) btnClass += "bg-red-50 border-red-500 text-red-800";
                    else btnClass += "bg-slate-50 border-slate-200 opacity-50";
                } else {
                    btnClass += "bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400";
                    if (isSelected) btnClass += " border-blue-500 bg-blue-50";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => !revealed && handleAnswer(q.id, optIdx)}
                    disabled={revealed}
                    className={btnClass}
                  >
                    <div className="flex justify-between items-center">
                      <span>{opt}</span>
                      {revealed && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {revealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult[q.id] && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 flex gap-2 items-start">
                <span className="font-bold shrink-0">해설:</span>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabQuiz;