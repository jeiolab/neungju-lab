import React from 'react';
import { ArrowRight, Box, Target, Ruler } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">컴퓨팅 사고의 핵심</h2>
        <p className="text-slate-600">
          컴퓨터에게 일을 시키려면 문제를 명확하게 정의해야 합니다. 이것을 <strong>문제 모델링</strong>이라고 합니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3 text-blue-600">
            <Box size={24} />
            <h3 className="font-bold text-lg">1. 초기 상태 (Initial State)</h3>
          </div>
          <p className="text-sm text-slate-600">
            문제가 시작되는 시점의 정보입니다. <br/>
            <span className="text-slate-400 text-xs">(예: 로봇의 현재 좌표 (0,0), 배터리 잔량 100%)</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3 text-red-500">
            <Target size={24} />
            <h3 className="font-bold text-lg">2. 목표 상태 (Goal State)</h3>
          </div>
          <p className="text-sm text-slate-600">
            문제가 해결되었을 때의 모습입니다. <br/>
            <span className="text-slate-400 text-xs">(예: 로봇이 좌표 (10,10)에 도착함)</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3 text-emerald-600">
            <Ruler size={24} />
            <h3 className="font-bold text-lg">3. 제약 조건 (Constraints)</h3>
          </div>
          <p className="text-sm text-slate-600">
            지켜야 할 규칙이나 한계입니다. <br/>
            <span className="text-slate-400 text-xs">(예: 장애물은 피해야 함, 배터리가 0이 되면 안 됨)</span>
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <h4 className="font-bold text-indigo-800 mb-2">실전 예시: 네비게이션</h4>
        <div className="flex items-center justify-between text-xs text-indigo-700 font-medium">
          <div className="text-center">현재 위치<br/>(GPS)</div>
          <ArrowRight size={16} />
          <div className="text-center">도로망 데이터<br/>(규칙)</div>
          <ArrowRight size={16} />
          <div className="text-center">목적지 도착<br/>(경로 산출)</div>
        </div>
      </div>
    </div>
  );
};
