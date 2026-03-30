import React from 'react';
import { BookOpen, Target, Users, ArrowRightCircle } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8" />
          <h2 className="text-3xl font-bold">K-평균 군집화란?</h2>
        </div>
        <p className="text-lg text-indigo-100 leading-relaxed">
          K-평균(K-Means)은 <strong>비지도 학습</strong>의 대표적인 알고리즘입니다. 
          정답(레이블)이 없는 데이터를 서로 비슷한 특성을 가진 <strong>K개의 그룹(군집)</strong>으로 묶어줍니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">목표 (Goal)</h3>
          <p className="text-slate-600">
            데이터 안에서 숨겨진 패턴을 찾아 <strong>끼리끼리</strong> 뭉치게 만듭니다. 
            같은 그룹 내의 데이터는 가깝게, 다른 그룹 간에는 멀게 만드는 것이 목표입니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">핵심 원리</h3>
          <p className="text-slate-600">
            1. <strong>배정</strong>: 나는 어느 대장(중심)이랑 제일 가깝지? <br/>
            2. <strong>이동</strong>: 우리 팀원들의 평균 위치로 대장(중심)이 이동하자!
          </p>
        </div>
      </div>

      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ArrowRightCircle className="w-5 h-5 text-indigo-600" />
          쉽게 이해하기: 반장 선거 비유
        </h3>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold min-w-[60px] text-center">Step 1</span>
            운동장에 학생들이 흩어져 있습니다. (데이터)
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold min-w-[60px] text-center">Step 2</span>
            K명의 임시 반장을 아무 곳에나 세웁니다. (초기 중심)
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold min-w-[60px] text-center">Step 3</span>
            학생들은 가장 가까운 반장 옆으로 가서 줄을 섭니다. (배정)
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold min-w-[60px] text-center">Step 4</span>
            각 반의 학생들이 모인 곳의 <strong>한가운데</strong>로 반장이 이동합니다. (이동)
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold min-w-[60px] text-center">Step 5</span>
            반장의 위치가 더 이상 변하지 않을 때까지 3, 4번을 반복합니다!
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TheoryTab;
