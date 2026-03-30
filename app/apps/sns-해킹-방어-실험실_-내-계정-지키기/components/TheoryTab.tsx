'use client';

import React, { useState } from 'react';
import { THEORY_CARDS } from '../constants';
import { CheckCircle, XCircle, BookOpen } from 'lucide-react';
import clsx from 'clsx';

export const TheoryTab: React.FC = () => {
  const [checked, setChecked] = useState<Record<string, boolean | null>>({});

  const handleCheck = (id: string, answer: boolean, correct: boolean) => {
    if (checked[id] !== undefined) return;
    setChecked(prev => ({ ...prev, [id]: answer === correct }));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-slate-800">
          <BookOpen className="w-6 h-6 text-blue-600" />
          핵심 개념 연구소
        </h2>
        <p className="text-slate-600 text-sm">
          SNS를 안전하게 쓰기 위해 꼭 알아야 할 4가지 개념입니다. 
          카드를 읽고 10초 체크를 풀어보세요!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {THEORY_CARDS.map((card) => (
          <div key={card.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className={clsx(
                  "px-2 py-1 text-xs font-bold rounded-full",
                  card.category === 'Hacking' ? "bg-red-100 text-red-700" :
                  card.category === 'Smishing' ? "bg-orange-100 text-orange-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {card.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {card.content}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                10초 체크
              </p>
              <p className="text-sm font-medium text-slate-800 mb-3">
                Q. {card.checkQuestion}
              </p>
              
              {checked[card.id] === undefined ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCheck(card.id, true, card.checkAnswer)}
                    className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors"
                  >
                    O 맞다
                  </button>
                  <button 
                    onClick={() => handleCheck(card.id, false, card.checkAnswer)}
                    className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors"
                  >
                    X 아니다
                  </button>
                </div>
              ) : (
                <div className={clsx(
                  "p-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2",
                  checked[card.id] ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {checked[card.id] ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> 정답입니다!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> 다시 공부해보세요.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};