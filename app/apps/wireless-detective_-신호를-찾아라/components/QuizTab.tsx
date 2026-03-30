import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [revealed, setRevealed] = useState<number[]>([]);

  const toggleReveal = (id: number) => {
    if (revealed.includes(id)) return;
    setRevealed((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">진실 혹은 거짓</h2>
        <p className="text-slate-500">무선 통신 기술에 대한 오해를 풀어봅시다.</p>
      </div>

      <div className="space-y-4">
        {QUIZ_DATA.map((q) => {
          const isRevealed = revealed.includes(q.id);
          
          return (
            <div key={q.id} className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 flex items-start gap-4">
                <div className="bg-slate-100 p-2 rounded-full shrink-0 text-slate-500">
                  <HelpCircle size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-800 mb-4 leading-relaxed">
                    {q.question}
                  </h3>
                  
                  {!isRevealed ? (
                    <div className="flex gap-4">
                      <button
                        onClick={() => toggleReveal(q.id)}
                        className="flex-1 py-3 bg-white hover:bg-green-50 rounded-lg text-green-600 font-bold border border-slate-200 hover:border-green-300 transition-all shadow-sm"
                      >
                        O (그렇다)
                      </button>
                      <button
                        onClick={() => toggleReveal(q.id)}
                        className="flex-1 py-3 bg-white hover:bg-red-50 rounded-lg text-red-600 font-bold border border-slate-200 hover:border-red-300 transition-all shadow-sm"
                      >
                        X (아니다)
                      </button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-lg border flex items-start gap-3 animate-slideIn ${q.isO ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      {q.isO ? (
                        <CheckCircle className="text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-bold mb-1 ${q.isO ? 'text-green-700' : 'text-red-700'}`}>
                           {q.isO ? '정답입니다 (O)' : '정답입니다 (X)'}
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};