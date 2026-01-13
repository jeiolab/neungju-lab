import React from 'react';

const Principles: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-indigo-500 pl-4">K-Means 알고리즘이란?</h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          K-Means 알고리즘은 데이터를 <strong>K개의 군집(Cluster)</strong>으로 묶는 비지도 학습(Unsupervised Learning) 알고리즘입니다. 
          데이터를 비슷한 특성을 가진 그룹으로 나누어 패턴을 분석할 때 주로 사용됩니다.
        </p>

        <h3 className="text-lg font-bold text-slate-800 mb-4">핵심 용어</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="font-bold text-indigo-600 mb-2">중심점 (Centroid)</h4>
            <p className="text-sm text-slate-600">각 군집의 중심 위치를 나타냅니다. 시뮬레이션에서는 별 모양으로 표시됩니다.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="font-bold text-indigo-600 mb-2">유클리디안 거리 (Euclidean Distance)</h4>
            <p className="text-sm text-slate-600">점과 점 사이의 직선 거리를 계산하는 공식입니다. {`$$ \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2} $$`}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-4">알고리즘 순서 (Flowchart)</h3>
        <div className="relative border-l-2 border-indigo-200 ml-4 space-y-6">
          <div className="ml-6 relative">
            <div className="absolute -left-[31px] bg-indigo-500 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
            <h4 className="font-bold text-slate-800">1. 초기화 (Initialization)</h4>
            <p className="text-sm text-slate-500">K개의 중심점을 데이터 공간에 무작위로 배치합니다.</p>
          </div>
          <div className="ml-6 relative">
             <div className="absolute -left-[31px] bg-indigo-500 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
            <h4 className="font-bold text-slate-800">2. 할당 (Assignment)</h4>
            <p className="text-sm text-slate-500">모든 데이터 포인트에 대해 각 중심점까지의 거리를 계산하고, 가장 가까운 중심점의 그룹에 속하게 합니다.</p>
          </div>
          <div className="ml-6 relative">
             <div className="absolute -left-[31px] bg-indigo-500 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
            <h4 className="font-bold text-slate-800">3. 이동 (Update)</h4>
            <p className="text-sm text-slate-500">각 군집에 속한 데이터들의 평균 위치(평균 좌표)를 계산하여 중심점을 이동시킵니다.</p>
          </div>
          <div className="ml-6 relative">
             <div className="absolute -left-[31px] bg-indigo-500 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
            <h4 className="font-bold text-slate-800">4. 반복 (Repeat)</h4>
            <p className="text-sm text-slate-500">중심점의 위치가 변하지 않을 때(수렴)까지 2~3단계를 반복합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Principles;