import React, { useState } from 'react';
import { ConceptCard, UserProfile } from '../types';
import { Check, HelpCircle, RotateCw } from 'lucide-react';

interface Props {
  cards: ConceptCard[];
  profile: UserProfile;
  updateMastery: (id: string, delta: number) => void;
}

const TheoryTab: React.FC<Props> = ({ cards, profile, updateMastery }) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [confidence, setConfidence] = useState(3);

  const handleCardClick = (id: string) => {
    if (activeCardId === id) {
      setIsFlipped(!isFlipped);
    } else {
      setActiveCardId(id);
      setIsFlipped(false);
      setConfidence(3);
    }
  };

  const handleComplete = (cardId: string) => {
    // Calculation: Confidence (1-5) * 4 = 20 max + Base 10
    const delta = 10 + (confidence * 4);
    updateMastery(cardId, delta);
    setIsFlipped(false);
    setActiveCardId(null);
    alert('학습이 기록되었습니다! (+경험치)');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">개념 카드 덱</h2>
        <p className="text-gray-600 text-sm">카드를 눌러 내용을 확인하고 마스터리를 높이세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => {
          const mastery = profile.mastery[card.id] || 0;
          const isActive = activeCardId === card.id;

          return (
            <div key={card.id} className={`relative h-80 w-full perspective-1000 group`}>
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-all cursor-pointer ${
                  isActive && isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                {/* Front Side */}
                <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">Concept</span>
                      <div className="text-xs font-medium text-gray-400">
                        Mastery: 
                        <span className={`ml-1 ${mastery >= 80 ? 'text-green-500' : 'text-orange-500'}`}>
                          {mastery}%
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm mb-4 line-clamp-3">{card.definition}</p>
                    <div className="flex flex-wrap gap-2">
                      {card.keywords.map(k => (
                        <span key={k} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#{k}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center mt-4 text-indigo-500 text-sm font-medium flex items-center justify-center gap-1 animate-pulse">
                    <RotateCw className="w-4 h-4" /> 클릭해서 뒤집기
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-50 rounded-2xl shadow-lg border border-indigo-200 p-6 flex flex-col overflow-y-auto">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-bold text-indigo-900 text-sm mb-1">🏫 학교 생활 예시</h4>
                      <p className="text-sm text-indigo-800 bg-white p-2 rounded border border-indigo-100">{card.example}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-700 text-sm mb-1 flex items-center gap-1">
                         <HelpCircle className="w-3 h-3" /> 흔한 오해
                      </h4>
                      <div className="text-sm bg-red-50 p-2 rounded border border-red-100 text-gray-700">
                        <span className="line-through text-gray-400 block text-xs mb-1">"{card.misconception.common}"</span>
                         → {card.misconception.correction}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-green-700 text-sm mb-1">10초 체크!</h4>
                      <p className="text-xs text-gray-700 font-medium mb-1">Q. {card.checkQuestion.question}</p>
                      <p className="text-xs text-green-600 font-bold">A. {card.checkQuestion.answer}</p>
                    </div>
                  </div>
                  
                  {/* Action Area (Stop Propagation to prevent flip) */}
                  <div className="mt-4 pt-4 border-t border-indigo-200" onClick={(e) => e.stopPropagation()}>
                    <label className="block text-xs font-bold text-gray-500 mb-2 text-center">이해했나요? (자신감: {confidence})</label>
                    <input 
                      type="range" min="1" max="5" 
                      value={confidence} 
                      onChange={(e) => setConfidence(Number(e.target.value))}
                      className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mb-3"
                    />
                    <button 
                      onClick={() => handleComplete(card.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check className="w-4 h-4" /> 학습 완료 체크
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TheoryTab;