import React from 'react';
import { GitGraph, Split, Leaf, HelpCircle } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <GitGraph className="text-blue-500" />
          의사결정트리(Decision Tree)란?
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          마치 <strong>'스무고개'</strong> 게임과 같습니다! 데이터를 분류하거나 결과를 예측하기 위해 
          질문을 계속 던지며 정답을 찾아가는 나무 모양의 지도입니다.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 font-bold text-blue-700 mb-2">
              <HelpCircle className="w-5 h-5" />
              1. 루트 노드 (Root)
            </div>
            <p className="text-sm text-blue-900">
              나무의 뿌리입니다. 가장 처음 던지는 질문이에요. 여기서 데이터가 처음으로 나뉩니다.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 font-bold text-green-700 mb-2">
              <Split className="w-5 h-5" />
              2. 규칙 노드 (Decision)
            </div>
            <p className="text-sm text-green-900">
              "Yes" 또는 "No"로 갈라지는 분기점입니다. 날개가 있는가? 다리가 4개인가? 같은 질문들이죠.
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 font-bold text-orange-700 mb-2">
              <Leaf className="w-5 h-5" />
              3. 리프 노드 (Leaf)
            </div>
            <p className="text-sm text-orange-900">
              더 이상 질문할 필요가 없는 끝부분입니다. "이것은 강아지다!"라고 결론을 내리는 곳이죠.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-3">과적합(Overfitting) 주의보! 🚨</h3>
        <p className="text-slate-600 mb-4">
          나무가 너무 복잡하면 어떻게 될까요? 
          질문을 너무 많이 해서 딱 하나뿐인 예외까지 모두 맞추려고 하면, 
          새로운 데이터가 들어왔을 때 오히려 틀릴 확률이 높아집니다. 
          이것을 <strong>'과적합'</strong>이라고 해요.
        </p>
        <div className="bg-slate-100 p-4 rounded-lg text-center text-slate-500 text-sm">
          "너무 꼬치꼬치 캐묻는 탐정보다는, 핵심 질문 몇 개로 범인을 잡는 탐정이 더 유능합니다!"
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;