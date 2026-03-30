import React from 'react';
import { MessageSquare, BrainCircuit } from 'lucide-react';

export const TabDiscussion: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit size={32} className="text-indigo-200" />
          <h2 className="text-2xl font-bold">생각해 볼 문제</h2>
        </div>
        <p className="text-indigo-100 text-lg leading-relaxed">
          "쇼핑몰이 나의 지난 구매 목록만 보고, 내가 다음에 무엇을 살지 어떻게 알아내는 걸까요? 
          이 과정에서 '나의 개인정보'는 어떻게 활용되고 있을까요?"
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <MessageSquare size={18} />
          탐정 노트 (나만의 생각 정리하기)
        </h3>
        <textarea 
          className="w-full h-40 p-4 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 placeholder-slate-400"
          placeholder="여기에 자유롭게 생각을 적어보세요. (예: 비슷한 구매 패턴을 가진 사람들을 그룹핑해서...)"
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            저장하기 (로컬)
          </button>
        </div>
      </div>
      
      <div className="bg-slate-50 p-6 rounded-xl text-sm text-slate-600">
        <strong>힌트:</strong> 비지도 학습은 데이터 간의 <em>거리</em>를 계산합니다. 
        만약 여러분이 '운동화'와 '테니스 라켓'을 샀다면, 같은 물건을 산 다른 사람(Cluster A)이 샀던 
        '스포츠 양말'이 여러분과 가까운 거리에 있다고 판단될 것입니다.
      </div>
    </div>
  );
};