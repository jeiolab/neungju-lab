import React, { useState, useEffect } from 'react';
import { ConceptCard, CardCategory } from '../types';
import { CONCEPT_CARDS } from '../constants';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface TheoryTabProps {
  masteredIds: string[];
  onCardResult: (id: string, success: boolean) => void;
}

const TheoryTab: React.FC<TheoryTabProps> = ({ masteredIds, onCardResult }) => {
  const [currentCard, setCurrentCard] = useState<ConceptCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Filter cards that are NOT mastered yet
  const availableCards = CONCEPT_CARDS.filter(card => !masteredIds.includes(card.id));
  
  const loadNewCard = () => {
    if (availableCards.length === 0) {
      setCurrentCard(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    setCurrentCard(availableCards[randomIndex]);
    setIsFlipped(false);
  };

  useEffect(() => {
    if (!currentCard) {
      loadNewCard();
    }
  }, [masteredIds]);

  const handleResult = (success: boolean) => {
    if (currentCard) {
      onCardResult(currentCard.id, success);
      setTimeout(() => {
         loadNewCard();
      }, 300);
    }
  };

  if (availableCards.length === 0 && !currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in bg-gray-50">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">모든 개념 마스터!</h2>
        <p className="text-xl text-gray-500 mb-8 max-w-md">
          기초 개념을 모두 완벽하게 익히셨습니다.<br/>이제 실전 퀴즈와 시뮬레이션으로<br/>실력을 증명할 차례입니다!
        </p>
      </div>
    );
  }

  if (!currentCard) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl flex flex-col h-[600px]">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">개념 플래시카드</h2>
          <span className="bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
            남은 카드: <span className="text-blue-600 font-bold">{availableCards.length}</span>장
          </span>
        </div>

        <div 
          className="flex-grow perspective-1000 cursor-pointer group relative"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow p-12 flex flex-col items-center justify-center text-center">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold mb-8
                ${currentCard.category === CardCategory.WIRED ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' : 
                  currentCard.category === CardCategory.WIRELESS ? 'bg-green-50 text-green-700 ring-1 ring-green-100' : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'}`}>
                {currentCard.category}
              </span>
              <h3 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">{currentCard.term}</h3>
              <p className="text-gray-400 font-medium animate-pulse">(클릭해서 뒤집기)</p>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-blue-100 w-full">{currentCard.term}</h3>
              <p className="text-3xl font-bold text-blue-900 mb-8 leading-snug break-keep">{currentCard.definition}</p>
              <div className="bg-white p-6 rounded-2xl text-base text-gray-600 w-full shadow-sm border border-blue-50">
                <span className="font-bold text-blue-500 block mb-2 text-sm uppercase tracking-wide">Teacher's Note</span>
                {currentCard.details}
              </div>
            </div>
          </div>
        </div>

        {/* Controls - Only visible when flipped */}
        <div className={`mt-8 grid grid-cols-2 gap-6 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleResult(false); }}
            className="py-4 bg-white border-2 border-red-100 text-red-500 rounded-2xl font-bold text-lg hover:bg-red-50 hover:border-red-200 transition flex items-center justify-center gap-3 shadow-sm"
          >
            <XCircle size={24} />
            복습 필요
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleResult(true); }}
            className="py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] transition shadow-lg shadow-blue-200 flex items-center justify-center gap-3"
          >
            <CheckCircle size={24} />
            이해 완료!
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;