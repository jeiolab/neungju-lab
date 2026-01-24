import React, { useState } from 'react';
import { CONCEPT_CARDS } from '../constants';
import { ConceptCard } from '../types';
import { CheckCircle2, HelpCircle, XCircle, RefreshCw } from 'lucide-react';

interface Props {
  masteryMap: Record<string, number>;
  onUpdateMastery: (id: string, change: number) => void;
}

const TheoryTab: React.FC<Props> = ({ masteryMap, onUpdateMastery }) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // 개념별 마스터리 바 색상 계산
  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const activeCard = CONCEPT_CARDS.find(c => c.id === activeCardId);

  // 취약 개념 추천 (점수가 가장 낮은 3개)
  const weakConcepts = [...CONCEPT_CARDS]
    .sort((a, b) => (masteryMap[a.id] || 0) - (masteryMap[b.id] || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. 상단: 취약 개념 추천 */}
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm">
        <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2 mb-3">
           <RefreshCw size={16} /> 지금 보완해야 할 개념 TOP 3
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weakConcepts.map(card => (
            <button
              key={card.id}
              onClick={() => setActiveCardId(card.id)}
              className="flex-shrink-0 bg-white px-3 py-2 rounded-lg border border-orange-200 text-sm text-slate-700 shadow-sm hover:bg-orange-100 transition"
            >
              {card.title} ({masteryMap[card.id] || 0}%)
            </button>
          ))}
        </div>
      </div>

      {/* 2. 카드 리스트 & 상세 보기 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 리스트 영역 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-800">개념 목록</h3>
          {CONCEPT_CARDS.map(card => (
            <div 
              key={card.id}
              onClick={() => setActiveCardId(card.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${activeCardId === card.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 bg-white'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-800">{card.title}</span>
                <span className="text-xs font-mono text-slate-500">{masteryMap[card.id] || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getBarColor(masteryMap[card.id] || 0)}`} 
                  style={{ width: `${masteryMap[card.id] || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* 카드 상세 영역 (Sticky) */}
        <div className="md:sticky md:top-6 h-fit">
          {activeCard ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-blue-600 p-4 text-white">
                <h2 className="text-xl font-bold">{activeCard.title}</h2>
                <p className="opacity-90 text-sm mt-1">{activeCard.definition}</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">핵심 키워드</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeCard.keywords.map(k => (
                      <span key={k} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm font-medium">#{k}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-1">💡 예시</h4>
                  <p className="text-sm text-slate-600">{activeCard.example}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-red-500 mb-1">❌ 흔한 오해</h4>
                  <p className="text-sm text-slate-600 line-through decoration-red-400 decoration-2">{activeCard.misconception}</p>
                  <p className="text-sm text-blue-600 font-medium mt-1">✅ 교정: {activeCard.correction}</p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-800 mb-2">⚡ 10초 체크!</h4>
                  <p className="text-sm text-slate-700 italic mb-4">"{activeCard.checkQuestion}"</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => onUpdateMastery(activeCard.id, 8)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition"
                    >
                      <CheckCircle2 size={20} className="mb-1" />
                      <span className="text-xs font-bold">알겠음 (+8)</span>
                    </button>
                    <button 
                      onClick={() => onUpdateMastery(activeCard.id, 3)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 transition"
                    >
                      <HelpCircle size={20} className="mb-1" />
                      <span className="text-xs font-bold">헷갈림 (+3)</span>
                    </button>
                    <button 
                      onClick={() => onUpdateMastery(activeCard.id, -2)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition"
                    >
                      <XCircle size={20} className="mb-1" />
                      <span className="text-xs font-bold">모름 (-2)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p>왼쪽 목록에서 카드를 선택해봐!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;