import React, { useState } from 'react';
import { CASES } from '../constants';
import { Check, X, ArrowRight } from 'lucide-react';

interface TabCasesProps {
  completedCases: string[];
  markCaseCompleted: (id: string) => void;
  addBadge: (badge: string) => void;
}

const TabCases: React.FC<TabCasesProps> = ({ completedCases, markCaseCompleted, addBadge }) => {
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<number | null>(null);
  const [selectedCon, setSelectedCon] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeCase = CASES.find(c => c.id === activeCaseId);

  const checkAnswer = () => {
    if (!activeCase || selectedPro === null || selectedCon === null) return;

    if (selectedPro === activeCase.correctProIndex && selectedCon === activeCase.correctConIndex) {
      setFeedback("correct");
      markCaseCompleted(activeCase.id);
      if (completedCases.length + 1 === CASES.length) addBadge('사례 분석가');
    } else {
      setFeedback("incorrect");
    }
  };

  const resetSelection = () => {
    setActiveCaseId(null);
    setSelectedPro(null);
    setSelectedCon(null);
    setFeedback(null);
  };

  if (activeCase) {
    return (
      <div className="animate-in fade-in zoom-in duration-300 max-w-3xl mx-auto">
        <button onClick={resetSelection} className="mb-4 text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium">
          <ArrowRight className="rotate-180 w-4 h-4" /> 목록으로 돌아가기
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <img src={activeCase.image} alt={activeCase.title} className="w-full h-48 object-cover" />
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeCase.title}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{activeCase.description}</p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-blue-600 mb-3 flex items-center gap-2">혜택 (가장 큰 장점)</h3>
                <div className="space-y-2">
                  {activeCase.pros.map((pro, idx) => (
                    <button
                      key={idx}
                      onClick={() => !feedback && setSelectedPro(idx)}
                      className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${
                        selectedPro === idx 
                          ? 'bg-blue-100 border-blue-500 text-blue-900' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pro}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2">위험 (가장 큰 우려)</h3>
                <div className="space-y-2">
                  {activeCase.cons.map((con, idx) => (
                    <button
                      key={idx}
                      onClick={() => !feedback && setSelectedCon(idx)}
                      className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${
                        selectedCon === idx 
                          ? 'bg-red-100 border-red-500 text-red-900' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {con}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {feedback === 'correct' && (
              <div className="bg-green-100 text-green-800 p-4 rounded-xl flex items-center gap-3 mb-6">
                <Check className="w-6 h-6" />
                <span className="font-bold">정답입니다! 핵심적인 혜택과 위험을 정확히 파악하셨네요.</span>
              </div>
            )}
             {feedback === 'incorrect' && (
              <div className="bg-orange-100 text-orange-800 p-4 rounded-xl flex items-center gap-3 mb-6">
                <X className="w-6 h-6" />
                <span className="font-bold">다시 생각해보세요. 해당 기술의 가장 직접적이고 현실적인 혜택과 위험을 골라보세요.</span>
                <button onClick={() => setFeedback(null)} className="ml-auto underline text-sm">재시도</button>
              </div>
            )}

            {!feedback ? (
              <button 
                onClick={checkAnswer}
                disabled={selectedPro === null || selectedCon === null}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                결과 확인하기
              </button>
            ) : (
               <button 
                onClick={resetSelection}
                className="w-full bg-slate-200 text-slate-800 py-4 rounded-xl font-bold text-lg hover:bg-slate-300 transition-colors"
              >
                다른 사례 보기
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {CASES.map((caseItem) => (
        <div 
          key={caseItem.id}
          onClick={() => setActiveCaseId(caseItem.id)}
          className={`group bg-white rounded-2xl shadow-sm border overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${completedCases.includes(caseItem.id) ? 'border-green-400 ring-2 ring-green-100' : 'border-slate-200'}`}
        >
          <div className="h-40 overflow-hidden relative">
            <img src={caseItem.image} alt={caseItem.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            {completedCases.includes(caseItem.id) && (
              <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{caseItem.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">{caseItem.description}</p>
            <div className="mt-4 text-blue-500 font-medium text-sm flex items-center gap-1">
              분석 시작하기 <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabCases;