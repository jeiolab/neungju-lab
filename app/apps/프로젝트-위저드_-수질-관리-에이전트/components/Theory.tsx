import React, { useState } from 'react';
import { THEORY_CARDS } from '../constants';
import { Eye, Brain, Zap, Activity, ChevronRight, AlertCircle } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  Eye: <Eye className="w-8 h-8 text-blue-500" />,
  Brain: <Brain className="w-8 h-8 text-purple-500" />,
  Zap: <Zap className="w-8 h-8 text-yellow-500" />,
  Activity: <Activity className="w-8 h-8 text-green-500" />,
};

const Theory: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">개념 도서관</h2>
        <p className="text-slate-600">지능형 에이전트의 핵심 구성 요소를 마스터하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {THEORY_CARDS.map((card) => (
          <div 
            key={card.id}
            className={`bg-white rounded-xl shadow-md border-2 transition-all duration-300 cursor-pointer overflow-hidden ${activeCard === card.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-slate-200'}`}
            onClick={() => setActiveCard(activeCard === card.id ? null : card.id)}
          >
            <div className="p-6 flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                {icons[card.icon]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-slate-600 mb-4">{card.definition}</p>
                
                {activeCard === card.id && (
                  <div className="space-y-4 mt-4 border-t pt-4 animate-fadeIn">
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                      <strong>핵심 키워드:</strong> {card.keywords.join(', ')}
                    </div>
                    <div className="bg-green-50 p-3 rounded text-sm text-green-800 border-l-4 border-green-500">
                      <strong>예시:</strong> {card.example}
                    </div>
                    <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><strong>흔한 오해:</strong> {card.misconception}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-2 text-blue-500 text-sm font-semibold flex items-center">
                  {activeCard === card.id ? '접기' : '더 알아보기'} <ChevronRight className={`w-4 h-4 transition-transform ${activeCard === card.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theory;