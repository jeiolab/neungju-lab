import React from 'react';
import { Layers, GitMerge, AlertTriangle } from 'lucide-react';

const AdvancedTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6" />
          단순함을 넘어: 다중 선형 회귀
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          지금까지 우리는 <strong>공부 시간</strong>이라는 단 하나의 변수만으로 성적을 예측했습니다. 
          이것을 <span className="font-bold text-indigo-600">단순 선형 회귀 (Simple Linear Regression)</span>라고 합니다.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          하지만 현실 세계는 훨씬 복잡하죠. 성적에 영향을 주는 것이 공부 시간뿐일까요?
          학원 수강 여부, 수면 시간, 집중력 등 다양한 요인이 있습니다.
        </p>
        
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
           <h3 className="text-lg font-bold text-purple-900 mb-4">수식의 확장</h3>
           <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-4">
              <div className="text-center">
                 <p className="text-sm text-gray-500 mb-2">단순 선형 회귀</p>
                 <div className="text-2xl font-mono bg-white px-6 py-3 rounded-lg shadow-sm">
                    y = w₁x + b
                 </div>
              </div>
              <div className="hidden md:block text-purple-300">
                 <GitMerge className="w-8 h-8 rotate-90" />
              </div>
              <div className="text-center">
                 <p className="text-sm text-gray-500 mb-2">다중 선형 회귀</p>
                 <div className="text-2xl font-mono bg-white px-6 py-3 rounded-lg shadow-sm border-2 border-purple-200">
                    y = w₁x₁ + w₂x₂ + ... + b
                 </div>
              </div>
           </div>
           <p className="text-center text-sm text-purple-700 mt-4">
              변수가 많아질수록 2차원 평면이 아닌, 3차원 공간 이상의 <strong>초평면(Hyperplane)</strong>을 찾게 됩니다.
           </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-amber-500" />
               상관관계 ≠ 인과관계
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
               여름에 아이스크림 판매량(x)과 상어의 공격 횟수(y)는 강한 양의 상관관계를 가집니다.
               그렇다고 아이스크림이 상어를 부르는 걸까요? 아닙니다!
               <strong>'기온'</strong>이라는 제3의 변수가 둘 다에게 영향을 미친 것입니다.
               회귀 분석을 할 때는 이런 '숨겨진 변수'를 조심해야 합니다.
            </p>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
               <GitMerge className="w-5 h-5 text-blue-500" />
               과적합 (Overfitting)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
               데이터를 너무 완벽하게 설명하려고 구불구불한 선을 그리면 어떻게 될까요?
               현재 데이터에는 오차가 0일지 몰라도, 새로운 데이터가 들어오면 예측력이 꽝이 됩니다.
               적당히 단순한 직선이 오히려 미래를 더 잘 맞출 수 있습니다.
            </p>
         </div>
      </div>
    </div>
  );
};

export default AdvancedTab;