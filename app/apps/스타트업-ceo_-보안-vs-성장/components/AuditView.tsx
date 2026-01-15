'use client';

import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle } from 'lucide-react';

const AuditView: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState<Record<string, boolean>>({});

  const handleSelect = (qId: string, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setShowResult(prev => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">보안 감사 (Security Audit)</h2>
        <p className="text-slate-600">정보보호 원칙에 대한 당신의 지식을 테스트해보세요.</p>
      </div>

      {QUIZ_QUESTIONS.map((q, idx) => {
        const isAnswered = showResult[q.id];
        const isCorrect = answers[q.id] === q.correctIndex;

        return (
          <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              <span className="text-indigo-600 font-bold mr-2">Q{idx + 1}.</span>
              {q.question}
            </h3>
            
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                let btnClass = "w-full text-left p-3 rounded border transition-colors ";
                
                if (isAnswered) {
                  if (optIdx === q.correctIndex) btnClass += "bg-green-50 border-green-500 text-green-700";
                  else if (answers[q.id] === optIdx) btnClass += "bg-red-50 border-red-500 text-red-700";
                  else btnClass += "bg-slate-50 border-transparent text-slate-500";
                } else {
                  btnClass += "bg-white hover:bg-slate-50 border-slate-200 text-slate-700";
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(q.id, optIdx)}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`mt-4 p-3 rounded flex items-start gap-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                {isCorrect ? <CheckCircle className="text-green-600 shrink-0" /> : <XCircle className="text-red-600 shrink-0" />}
                <div>
                  <p className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? '정답입니다!' : '오답입니다.'}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{q.explanation}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AuditView;