import React, { useState } from 'react';
import { CONCEPT_CARDS, MODULE_INFO } from '../constants';
import { ModuleType, ConceptCard } from '../types';
import { BookOpen, CheckCircle, RotateCw } from 'lucide-react';

interface Props {
  onCardRead: (cardId: string, moduleId: ModuleType) => void;
  completedCardIds: string[];
}

const TrainingManual: React.FC<Props> = ({ onCardRead, completedCardIds }) => {
  const [selectedModule, setSelectedModule] = useState<ModuleType>(ModuleType.PERSONAL_INFO);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const filteredCards = CONCEPT_CARDS.filter(card => card.moduleId === selectedModule);

  const handleCardClick = (card: ConceptCard) => {
    setFlippedCardId(flippedCardId === card.id ? null : card.id);
    if (!completedCardIds.includes(card.id)) {
      // Small delay to prevent instant mastery before reading
      setTimeout(() => onCardRead(card.id, card.moduleId), 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(MODULE_INFO).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedModule(key as ModuleType)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              selectedModule === key
                ? 'bg-slate-800 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {info.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCards.map((card) => {
          const isFlipped = flippedCardId === card.id;
          const isCompleted = completedCardIds.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="relative h-64 cursor-pointer group perspective-1000"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-all ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side */}
                <div className="absolute w-full h-full bg-white rounded-xl shadow-md p-6 border-2 border-slate-100 backface-hidden flex flex-col justify-between hover:border-blue-300 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {MODULE_INFO[card.moduleId].title}
                      </span>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                    <p className="text-slate-500 text-sm">클릭하여 내용 확인</p>
                  </div>
                  <div className="flex justify-center">
                    <RotateCw className="w-6 h-6 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full bg-slate-800 rounded-xl shadow-xl p-6 text-white rotate-y-180 backface-hidden flex flex-col overflow-y-auto">
                  <div className="mb-4">
                     <h4 className="text-sm text-blue-300 font-bold mb-1">정의</h4>
                     <p className="text-sm leading-relaxed">{card.definition}</p>
                  </div>
                  <div className="mb-4">
                     <h4 className="text-sm text-yellow-300 font-bold mb-1">핵심 키워드</h4>
                     <div className="flex flex-wrap gap-1">
                       {card.keywords.map(k => (
                         <span key={k} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-slate-200">#{k}</span>
                       ))}
                     </div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-slate-600">
                    <h4 className="text-xs text-red-300 font-bold mb-1">⚠️ 주의할 점</h4>
                    <p className="text-xs text-slate-300 italic">{card.misconception}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>교관의 조언:</strong> 카드를 클릭하여 내용을 숙지하면 훈련 숙련도가 상승한다. 
          모든 개념을 완벽히 암기하도록!
        </p>
      </div>
    </div>
  );
};

export default TrainingManual;