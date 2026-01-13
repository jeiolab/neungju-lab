import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const THEORY_CARDS = [
  {
    title: "1. 치환 암호란?",
    content: "글자를 다른 글자로 1:1 교환하는 방식입니다. 예를 들어, 'A'를 'B'로, 'B'를 'C'로 바꾸는 식이죠. 규칙만 알면 원래대로 돌려놓을 수 있습니다.",
    icon: "🔄"
  },
  {
    title: "2. 카이사르 암호의 원리",
    content: "로마의 율리우스 카이사르가 사용했습니다. 알파벳 순서에서 일정한 수(키)만큼 밀어서 글자를 바꿉니다. 키가 1이면 A→B, B→C가 됩니다.",
    icon: "🏛️"
  },
  {
    title: "3. 키(Key)의 중요성",
    content: "암호를 만들 때 가장 중요한 비밀입니다. 카이사르 암호에서는 '몇 칸 밀었는지'가 키입니다. 키를 모르면 해독하기 어렵지만, 가능한 키가 25개뿐이라 다 해보면 뚫립니다!",
    icon: "🔑"
  },
  {
    title: "4. 치명적인 약점",
    content: "영어에서 가장 많이 쓰이는 글자는 'e'입니다. 긴 암호문에서 가장 많이 나온 글자가 있다면, 그 글자가 'e'가 변한 것일 확률이 높습니다. 이를 '빈도 분석'이라고 합니다.",
    icon: "📊"
  }
];

const Theory: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => setCurrentCard(p => Math.min(THEORY_CARDS.length - 1, p + 1));
  const prevCard = () => setCurrentCard(p => Math.max(0, p - 1));

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden min-h-[400px] flex flex-col relative">
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((currentCard + 1) / THEORY_CARDS.length) * 100}%` }}
          />
        </div>
        
        <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
            <div className="text-6xl mb-6 animate-bounce-slow">
                {THEORY_CARDS[currentCard].icon}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {THEORY_CARDS[currentCard].title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
                {THEORY_CARDS[currentCard].content}
            </p>
        </div>

        <div className="p-6 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <button 
            onClick={prevCard} 
            disabled={currentCard === 0}
            className="p-3 rounded-full hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          
          <span className="font-mono text-sm text-slate-400">
            {currentCard + 1} / {THEORY_CARDS.length}
          </span>

          <button 
            onClick={nextCard}
            disabled={currentCard === THEORY_CARDS.length - 1}
            className="p-3 rounded-full hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
          >
            {currentCard === THEORY_CARDS.length - 1 ? (
                <CheckCircle2 size={24} className="text-green-600" />
            ) : (
                <ArrowRight size={24} className="text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Theory;
