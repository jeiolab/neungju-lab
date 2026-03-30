import React, { useState } from 'react';
import { ConceptCard } from '../types';
import { CONCEPT_CARDS } from '../constants';
import { CheckCircle2, RefreshCw } from 'lucide-react';

interface TabConceptsProps {
  completedConcepts: string[];
  onConceptComplete: (id: string) => void;
}

const TabConcepts: React.FC<TabConceptsProps> = ({ completedConcepts, onConceptComplete }) => {
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    if (flippedId === id) {
      setFlippedId(null);
    } else {
      setFlippedId(id);
      if (!completedConcepts.includes(id)) {
        onConceptComplete(id);
      }
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case '센서': return 'bg-blue-100 text-blue-800 border-blue-200';
      case '네트워크': return 'bg-green-100 text-green-800 border-green-200';
      case '인터페이스': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">IoT 핵심 증거 수집</h2>
        <p className="text-slate-600">카드를 눌러 뒤집으면 숨겨진 단서를 찾을 수 있습니다. 모든 단서를 모아보세요!</p>
        <div className="mt-4 flex justify-center items-center gap-2">
           <span className="text-sm font-medium bg-slate-200 px-3 py-1 rounded-full text-slate-700">
             수집 현황: {completedConcepts.length} / {CONCEPT_CARDS.length}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONCEPT_CARDS.map((card) => (
          <div
            key={card.id}
            className="group h-64 w-full cursor-pointer perspective-1000"
            onClick={() => handleCardClick(card.id)}
          >
            <div
              className={`relative h-full w-full transition-all duration-500 transform-style-3d shadow-lg rounded-xl ${
                flippedId === card.id ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Side */}
              <div className="absolute h-full w-full bg-white rounded-xl backface-hidden flex flex-col items-center justify-center p-6 border-2 border-slate-100 hover:border-indigo-300 transition-colors">
                <span className={`px-3 py-1 rounded-full text-xs font-bold mb-4 ${getCategoryColor(card.category)}`}>
                  {card.category}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-slate-500 text-center text-sm">{card.frontContent}</p>
                <div className="absolute bottom-4 right-4 text-slate-400">
                   {completedConcepts.includes(card.id) ? (
                     <CheckCircle2 className="w-6 h-6 text-green-500" />
                   ) : (
                     <div className="animate-pulse bg-indigo-100 text-indigo-500 rounded-full p-1">
                        <RefreshCw className="w-5 h-5" />
                     </div>
                   )}
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute h-full w-full bg-indigo-50 rounded-xl backface-hidden rotate-y-180 p-6 border-2 border-indigo-200 overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-bold text-indigo-900 mb-3 border-b border-indigo-200 pb-2">
                  {card.title} 정의
                </h3>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                  {card.backDefinition}
                </p>
                
                <div className="bg-white p-3 rounded-lg mb-3 shadow-sm">
                  <span className="text-xs font-bold text-blue-600 block mb-1">탐정 노트 (예시)</span>
                  <p className="text-xs text-slate-600">{card.backExample}</p>
                </div>

                <div className={`text-xs p-2 rounded border ${card.backMythFact.includes('진실') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  {card.backMythFact}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabConcepts;