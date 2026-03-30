import React, { useState } from 'react';
import { CASE_STUDIES } from '../constants';
import { AlertTriangle, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';

const DeepDiveTab: React.FC = () => {
  const [showChecklist, setShowChecklist] = useState(false);
  const [activeCases, setActiveCases] = useState<Record<string, boolean>>({});

  const toggleCase = (id: string) => {
    setActiveCases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getTagColor = (tag: string) => {
    if (tag === '안전') return 'bg-green-100 text-green-700';
    if (tag === '편리') return 'bg-blue-100 text-blue-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button 
          onClick={() => setShowChecklist(!showChecklist)}
          className="w-full flex justify-between items-center text-slate-800 font-bold"
        >
          <span className="flex items-center gap-2">
            <CheckSquare className="text-blue-600" /> 공유 전 안전 체크리스트
          </span>
          {showChecklist ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {showChecklist && (
          <div className="mt-4 space-y-2 animate-fade-in border-t border-slate-100 pt-3">
            {[
              "공유하려는 파일에 개인정보(전화번호, 주소)가 없는가?",
              "공유 대상(받는 사람)이 확실한가?",
              "출처가 불분명한 파일을 열지는 않았는가?",
              "중요한 자료는 백업해 두었는가?",
              "공용 PC라면 로그아웃을 했는가?"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 hover:bg-slate-50 rounded">
                <input type="checkbox" className="mt-1 accent-blue-600" />
                <span className="text-slate-600 text-sm">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mt-6">공유 사고 & 모범 사례</h3>
      <div className="grid gap-4">
        {CASE_STUDIES.map(study => (
          <div key={study.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition">
            <div 
              className="p-4 cursor-pointer flex justify-between items-start"
              onClick={() => toggleCase(study.id)}
            >
              <div>
                <div className="flex gap-2 mb-2">
                  {study.tags.map(tag => (
                    <span key={tag} className={`px-2 py-0.5 rounded text-xs font-bold ${getTagColor(tag)}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="font-bold text-slate-800">{study.title}</h4>
              </div>
              <ChevronDown className={`text-slate-400 transition-transform ${activeCases[study.id] ? 'rotate-180' : ''}`} />
            </div>
            
            {activeCases[study.id] && (
              <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100 pt-3 animate-fade-in">
                <p className="text-sm text-slate-700 mb-3 font-medium">📜 상황: {study.scenario}</p>
                
                <div className="bg-white p-3 rounded border border-slate-200">
                  <p className="text-sm text-slate-600 flex gap-2">
                    <span className="text-xl">🎓</span>
                    <span>{study.feedback}</span>
                  </p>
                </div>

                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  <span>이유란에는 개인정보를 절대 입력하지 마세요.</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeepDiveTab;