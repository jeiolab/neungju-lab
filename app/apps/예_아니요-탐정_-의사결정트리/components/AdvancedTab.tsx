import React from 'react';
import { Network, Trees, Award } from 'lucide-react';

const AdvancedTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
                <Trees size={32} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">랜덤 포레스트 (Random Forest)</h2>
                <p className="text-indigo-600 font-medium text-lg mt-1">숲을 보면 나무가 보인다!</p>
            </div>
        </div>
        
        <p className="text-slate-700 leading-relaxed mb-6 text-lg">
          의사결정트리 하나는 아주 똑똑하지만, 가끔 고집이 세서 실수를 할 때가 있습니다(과적합). 
          만약 수백 명의 탐정들이 각자 조금씩 다른 질문을 던지고, 다수결로 결론을 내린다면 어떨까요?
        </p>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <Network size={20} className="text-purple-500" />
                    집단 지성 (Ensemble)
                </h3>
                <p className="text-slate-600 text-sm">
                    하나의 완벽한 나무를 만드는 것보다, 
                    조금 부족하더라도 서로 다른 여러 나무들을 모아 '숲(Forest)'을 만들면 
                    훨씬 더 강력하고 안정적인 예측을 할 수 있습니다.
                </p>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <Award size={20} className="text-yellow-500" />
                    왜 더 좋을까요?
                </h3>
                <p className="text-slate-600 text-sm">
                    어떤 나무는 날개를 중요하게 보고, 어떤 나무는 털을 중요하게 봅니다.
                    각자의 편견을 서로 상쇄시켜주기 때문에 새로운 데이터가 들어와도 잘 맞춥니다.
                </p>
            </div>
        </div>
      </div>
      
      <div className="p-6 text-center">
          <p className="text-slate-400 text-sm">현실 세계에서는 주식 예측, 질병 진단, 추천 시스템 등에서 랜덤 포레스트가 널리 쓰이고 있습니다.</p>
      </div>
    </div>
  );
};

export default AdvancedTab;