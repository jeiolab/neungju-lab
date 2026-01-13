import React, { useState } from 'react';
import { CASES } from '../data';
import { Music, Factory, Shirt, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { CaseStudy } from '../types';

const CasesTab: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const toggleSelection = (caseId: string, attr: string) => {
    const current = selections[caseId] || [];
    if (current.includes(attr)) {
      setSelections({ ...selections, [caseId]: current.filter(a => a !== attr) });
    } else {
      if (current.length >= 3) return; // Max 3
      setSelections({ ...selections, [caseId]: [...current, attr] });
    }
    setFeedback({ ...feedback, [caseId]: '' }); // Clear feedback on change
  };

  const checkAttributes = (c: CaseStudy) => {
    const current = selections[c.id] || [];
    const correctCount = current.filter(attr => c.correctAttributes.includes(attr)).length;
    
    if (correctCount >= 3) {
      setFeedback({ ...feedback, [c.id]: "훌륭합니다! 핵심 속성을 잘 파악했네요. (군집화 성공)" });
    } else {
      setFeedback({ ...feedback, [c.id]: `아쉽네요. ${correctCount}개만 적절합니다. 비지도학습에서는 노이즈가 될 수 있는 속성을 배제하는 것이 중요합니다.` });
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'music': return <Music className="w-6 h-6 text-indigo-500" />;
      case 'factory': return <Factory className="w-6 h-6 text-slate-500" />;
      case 'shirt': return <Shirt className="w-6 h-6 text-pink-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <h2 className="text-indigo-900 font-bold mb-1">현실 세계의 비지도학습</h2>
        <p className="text-indigo-700 text-sm">데이터에는 라벨이 없는 경우가 훨씬 많습니다. 어떤 속성을 모아야 의미 있는 그룹을 만들 수 있을까요?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {CASES.map((c) => {
          const isExpanded = expandedId === c.id;
          const currentSelections = selections[c.id] || [];
          const currentFeedback = feedback[c.id];

          return (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div 
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-full">
                    {getIcon(c.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{c.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.description}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-slate-100 bg-slate-50">
                  <p className="text-slate-700 text-sm mb-4 bg-white p-3 rounded border border-slate-200">{c.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-sm text-slate-800 mb-2">분석에 사용할 속성 3가지를 선택하세요:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {c.attributes.map(attr => (
                        <button
                          key={attr}
                          onClick={() => toggleSelection(c.id, attr)}
                          className={`flex items-center gap-2 p-2 text-sm rounded border transition-colors ${
                            currentSelections.includes(attr) 
                              ? 'bg-indigo-100 border-indigo-300 text-indigo-900' 
                              : 'bg-white border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {currentSelections.includes(attr) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          {attr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium h-5">
                      {currentFeedback && <span className={currentFeedback.includes('훌륭') ? 'text-green-600' : 'text-amber-600'}>{currentFeedback}</span>}
                    </div>
                    <button
                      onClick={() => checkAttributes(c)}
                      disabled={currentSelections.length !== 3}
                      className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900"
                    >
                      결과 확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CasesTab;