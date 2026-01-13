import React from 'react';
import { TrendingUp, PieChart, Maximize2 } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">기만의 기술</h2>
        <p className="text-slate-400 text-lg">데이터 인식을 조작하는 데 사용되는 일반적인 속임수들입니다.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500/50 transition-colors">
          <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">잘린 축 (Truncated Axis)</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Y축을 0이 아닌 숫자에서 시작하여 작은 변화를 거대하게 보이게 합니다. 밑동을 자르면 1% 상승이 100% 폭등처럼 보일 수 있습니다.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500/50 transition-colors">
          <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <PieChart className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">3D 왜곡 (3D Distortion)</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            파이 차트나 막대에 3D 효과를 사용합니다. 원근법 때문에 실제 값과 상관없이 앞에 있는 항목이 훨씬 커 보입니다.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500/50 transition-colors">
          <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Maximize2 className="text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">면적 대 반지름 (Area vs. Radius)</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            2D 도형(사람이나 거품 등)의 높이를 두 배로 늘리면 실제로는 면적이 네 배가 됩니다. 우리 뇌는 면적을 정확히 판단하기 어렵습니다.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 mt-8">
        <h3 className="text-xl font-bold text-white mb-4">탐정의 체크리스트</h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Y축이 0에서 시작하나요?
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            X축의 시간 간격이 일정한가요? (예: 연도를 건너뛰지 않았는지)
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            특정 이야기를 보여주기 위해 데이터가 "체리 피킹(선별)"되었나요?
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            성장률 감소를 숨기기 위해 누적 숫자를 사용했나요?
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TheoryTab;