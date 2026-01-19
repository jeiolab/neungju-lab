import React from 'react';
import { Target, Layers } from 'lucide-react';

const AdvancedTab: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">단순 회귀 vs 다중 회귀</h2>
        <p className="text-slate-600">세상은 하나의 원인으로만 돌아가지 않아요!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Simple Regression */}
        <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">단순 선형 회귀</h3>
          </div>
          <p className="text-slate-600 mb-4 min-h-[3rem]">
            "공부 시간 하나만 알면 점수를 알 수 있을까?"
          </p>
          <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm mb-4">
            Score = w₁ * 공부시간 + b
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">✅ <strong>특징:</strong> 입력 변수(X)가 1개</li>
            <li className="flex gap-2">✅ <strong>장점:</strong> 그래프(2D)로 그리기 쉽고 이해가 빠름</li>
            <li className="flex gap-2">❌ <strong>단점:</strong> 복잡한 현실 문제를 설명하기엔 너무 단순함</li>
          </ul>
        </div>

        {/* Multiple Regression */}
        <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">다중 선형 회귀</h3>
          </div>
          <p className="text-slate-600 mb-4 min-h-[3rem]">
            "공부 시간, 수면 시간, 학원 개수... 다 따져보자!"
          </p>
          <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm mb-4">
            Score = w₁*공부 + w₂*수면 + w₃*학원 + b
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">✅ <strong>특징:</strong> 입력 변수(X)가 2개 이상</li>
            <li className="flex gap-2">✅ <strong>장점:</strong> 예측 정확도가 훨씬 높음 (현실적)</li>
            <li className="flex gap-2">❌ <strong>단점:</strong> 시각화하기 어렵고(3D 이상), 계산이 복잡함</li>
          </ul>
        </div>
      </div>

      {/* Code Block Analogy */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-inner">
        <div className="flex gap-2 mb-4 text-xs uppercase tracking-widest text-slate-500">
          <span className="bg-slate-800 px-2 py-1 rounded">Code View</span>
        </div>
        <pre>{`// 단순 회귀 (Simple)
function predictScore(studyTime) {
  return 2.2 * studyTime + 40; 
}

// 다중 회귀 (Multiple)
function predictScore(studyTime, sleepTime, absences) {
  return (2.2 * studyTime) + (1.5 * sleepTime) - (3.5 * absences) + 40;
}
`}</pre>
        <p className="mt-4 text-slate-400 text-sm font-sans">
          * 다중 회귀는 더 많은 정보를 종합해서 판단하므로, 마치 전문가처럼 더 정교한 예측을 할 수 있어요!
        </p>
      </div>
    </div>
  );
};

export default AdvancedTab;