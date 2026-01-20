import React, { useState } from 'react';
import { ArrowRight, Search, ListOrdered, CheckCircle2 } from 'lucide-react';

interface TabTheoryProps {
  onComplete: () => void;
}

const TabTheory: React.FC<TabTheoryProps> = ({ onComplete }) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const handleCardClick = (id: number) => {
    if (!flippedCards.includes(id)) {
      const newFlipped = [...flippedCards, id];
      setFlippedCards(newFlipped);
      // If all 3 cards are flipped, mark as complete
      if (newFlipped.length === 3) {
        onComplete();
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
          <Search className="w-6 h-6 mr-2" />
          탐색이란?
        </h2>
        <p className="text-slate-600 leading-relaxed text-lg">
          탐색(Search)은 많은 데이터 속에서 원하는 데이터를 찾아내는 과정입니다.<br/>
          우리가 도서관에서 책을 찾거나, 전화번호부에서 친구 이름을 찾는 것 모두가 '탐색'입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Linear Search Card */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2" /> 순차 탐색 (Linear Search)
          </h3>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li>데이터를 <strong>처음부터 끝까지 하나씩</strong> 순서대로 비교합니다.</li>
            <li>데이터가 정렬되어 있지 않아도 사용할 수 있습니다.</li>
            <li>데이터가 많을수록 속도가 비례해서 느려집니다.</li>
          </ul>
        </div>

        {/* Binary Search Card */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center">
            <ListOrdered className="w-5 h-5 mr-2" /> 이진 탐색 (Binary Search)
          </h3>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li>탐색 범위를 <strong>절반씩 줄여가며</strong> 찾습니다.</li>
            <li><span className="bg-yellow-200 px-1 font-bold text-red-600">필수: 데이터가 정렬되어 있어야 합니다.</span></li>
            <li>데이터가 많아도 매우 빠르게 찾을 수 있습니다.</li>
          </ul>
        </div>
      </div>

      {/* Interactive Keyword Cards */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">핵심 키워드 뒤집기 (클릭하여 확인)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 1, front: "인덱스 (Index)", back: "데이터의 위치를 나타내는 번호 (0부터 시작)" },
            { id: 2, front: "중앙값 (Mid)", back: "탐색 범위의 한가운데에 있는 값" },
            { id: 3, front: "정렬 (Sort)", back: "데이터를 순서대로 나열하는 것 (이진 탐색의 조건!)" },
          ].map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`relative h-32 cursor-pointer transition-all duration-500 preserve-3d group perspective`}
            >
              <div
                className={`absolute inset-0 w-full h-full rounded-xl shadow-md flex items-center justify-center text-center p-4 backface-hidden transition-transform duration-500 ${
                  flippedCards.includes(card.id) ? "rotate-y-180 opacity-0" : "bg-white border-2 border-indigo-100"
                }`}
              >
                <span className="text-lg font-bold text-indigo-600">{card.front}</span>
              </div>
              <div
                className={`absolute inset-0 w-full h-full rounded-xl shadow-md flex items-center justify-center text-center p-4 backface-hidden transition-transform duration-500 bg-indigo-600 text-white ${
                  flippedCards.includes(card.id) ? "rotate-y-0" : "rotate-y-180 opacity-0"
                }`}
                style={{ transform: flippedCards.includes(card.id) ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
              >
                <span className="font-medium">{card.back}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {flippedCards.length === 3 && (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg flex items-center justify-center animate-pulse">
           <CheckCircle2 className="w-5 h-5 mr-2"/>
           모든 개념 카드를 확인했습니다! 상단의 '시뮬레이션' 탭으로 이동해보세요.
        </div>
      )}
    </div>
  );
};

export default TabTheory;