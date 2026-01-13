import React, { useState } from 'react';
import { THEORY_CARDS } from '../constants';
import { BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ [key: string]: string | null }>({});

  const handleCheckAnswer = (id: string, answer: string, correct: string) => {
    const isCorrect = answer.toUpperCase() === correct;
    setFeedback(prev => ({
      ...prev,
      [id]: isCorrect ? '정답입니다! ✅' : '다시 생각해보세요. ❌'
    }));
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2">
          <BookOpen size={20} />
          제어 구조란?
        </h2>
        <p className="text-sm text-blue-700 mt-2 leading-relaxed">
          프로그램은 물 흐르듯 위에서 아래로 흐릅니다. 하지만 가끔은 
          <span className="font-bold bg-blue-200 px-1 rounded mx-1">갈림길(선택)</span>을 만나기도 하고, 
          <span className="font-bold bg-blue-200 px-1 rounded mx-1">제자리걸음(반복)</span>을 하기도 하죠. 
          이 흐름을 제어하는 것이 바로 제어 구조입니다!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEORY_CARDS.map((card) => (
          <div 
            key={card.id} 
            className={`
              relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 overflow-hidden
              ${activeCard === card.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-100 hover:border-slate-300'}
            `}
          >
            <div className="p-5 cursor-pointer" onClick={() => setActiveCard(activeCard === card.id ? null : card.id)}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800">{card.title}</h3>
                {activeCard === card.id ? <CheckCircle size={20} className="text-indigo-500"/> : <HelpCircle size={20} className="text-slate-400"/>}
              </div>
              <p className="text-slate-500 text-sm font-medium mb-3">{card.summary}</p>
              
              <div className={`transition-all duration-300 ease-in-out ${activeCard === card.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-3">
                  {card.content}
                </p>
              </div>
            </div>

            {/* 10s Check Section */}
            <div className="bg-slate-50 p-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">10초 체크</p>
              <p className="text-sm text-slate-800 font-medium mb-3">{card.checkQuestion}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCheckAnswer(card.id, 'O', card.checkAnswer)}
                  className="flex-1 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-indigo-50 text-sm font-bold text-indigo-600 transition-colors"
                >
                  O
                </button>
                <button 
                  onClick={() => handleCheckAnswer(card.id, 'X', card.checkAnswer)}
                  className="flex-1 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-indigo-50 text-sm font-bold text-indigo-600 transition-colors"
                >
                  X
                </button>
              </div>
              {feedback[card.id] && (
                <p className={`mt-2 text-xs font-bold ${feedback[card.id]?.includes('정답') ? 'text-green-600' : 'text-red-500'}`}>
                  {feedback[card.id]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
