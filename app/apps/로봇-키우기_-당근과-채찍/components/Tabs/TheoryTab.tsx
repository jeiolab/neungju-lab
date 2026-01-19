import React from 'react';
import { Brain, Trophy, AlertTriangle, Target } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">강화 학습(Reinforcement Learning)이란?</h2>
        <p className="text-lg text-slate-600">
          "시행착오를 겪으며 당근(보상)은 쫓고, 채찍(벌)은 피하는 학습 방법"
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold">에이전트 (Agent)</h3>
          </div>
          <p className="text-slate-600">
            학습하는 주인공입니다. 이 앱에서는 <strong>로봇</strong>이 에이전트입니다.
            현재 상태를 보고 어떤 행동을 할지 결정합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold">보상 (Reward)</h3>
          </div>
          <p className="text-slate-600">
            잘한 행동에 주는 점수입니다. 
            <br/><span className="text-sm text-green-600 font-semibold">+10점: 목적지 도착, +1점: 배터리 획득</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold">벌칙 (Punishment)</h3>
          </div>
          <p className="text-slate-600">
            잘못한 행동에 주는 감점입니다.
            <br/><span className="text-sm text-red-600 font-semibold">-10점: 함정 빠짐, -1점: 시간 지체</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold">환경 (Environment)</h3>
          </div>
          <p className="text-slate-600">
            에이전트가 활동하는 세상입니다. 벽, 장애물, 목표 지점 등이 배치된 <strong>그리드 맵</strong>이 환경입니다.
          </p>
        </div>
      </div>

      <div className="bg-brand-50 p-6 rounded-xl border border-brand-100">
        <h3 className="text-lg font-bold text-brand-900 mb-2">실생활 예시</h3>
        <ul className="list-disc list-inside space-y-2 text-brand-900">
          <li><strong>알파고(AlphaGo):</strong> 바둑을 두며 이기면 보상을 받아 승리하는 수를 학습합니다.</li>
          <li><strong>자율주행차:</strong> 차선을 지키면 보상, 이탈하면 벌칙을 가상으로 주며 운전을 배웁니다.</li>
          <li><strong>로봇 청소기:</strong> 먼지를 흡입하면 보상, 가구에 부딪히면 벌칙을 받습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default TheoryTab;
