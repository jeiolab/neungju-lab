import React from 'react';
import { Divide, Table, Scale } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Divide className="w-6 h-6 text-blue-600" />
          문제 분해 (Decomposition)
        </h2>
        <p className="text-slate-600 mb-4">
          복잡한 문제를 해결 가능한 작은 단위로 나누는 것입니다. 
          "학교에 늦지 않기"라는 큰 문제는 너무 막연합니다. 
          이것을 <strong>준비 시간</strong>, <strong>이동 시간</strong>, <strong>여유 시간</strong>으로 나누면 어디서 줄여야 할지 보입니다.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="font-semibold text-blue-800">💡 랩 조교의 팁:</p>
          <p className="text-blue-700 text-sm">
            문제를 나눌 때는 각 단계가 서로 겹치지 않게(MECE) 나누는 것이 중요해요!
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Table className="w-6 h-6 text-emerald-600" />
          모델링 (Modeling)
        </h2>
        <p className="text-slate-600 mb-4">
          현실 세계의 복잡한 현상을 단순화하여 표현(표, 그래프, 수식)하는 것입니다.
          모델링을 하면 <strong>변수(입력값)</strong>를 조작했을 때 <strong>결과</strong>가 어떻게 바뀔지 예측(Simulation)할 수 있습니다.
        </p>
        <ul className="list-disc list-inside text-slate-600 space-y-2">
          <li><strong>입력(Input):</strong> 기상 시간, 교통 수단</li>
          <li><strong>처리(Process):</strong> 이동 속도, 교통 체증 반영</li>
          <li><strong>출력(Output):</strong> 학교 도착 시각</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Scale className="w-6 h-6 text-amber-600" />
          트레이드오프 (Trade-off)
        </h2>
        <p className="text-slate-600 mb-4">
          두 가지 목표를 동시에 달성할 수 없는 딜레마 상황입니다.
          하나를 얻으려면 다른 하나를 희생해야 합니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border p-4 rounded-lg bg-red-50 border-red-100">
            <h3 className="font-bold text-red-700">택시 이용 시</h3>
            <p className="text-red-600 text-sm">시간 절약 (👍)<br/>비용 증가 (👎)<br/>환경 오염 (👎)</p>
          </div>
          <div className="border p-4 rounded-lg bg-green-50 border-green-100">
            <h3 className="font-bold text-green-700">도보 이용 시</h3>
            <p className="text-green-600 text-sm">시간 소요 (👎)<br/>비용 절약 (👍)<br/>건강/환경 (👍)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;