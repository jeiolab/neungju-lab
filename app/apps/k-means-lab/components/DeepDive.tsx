import React from 'react';

const DeepDive: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">K값을 잘못 설정하면?</h2>
        <p className="text-slate-600 mb-8">
          K-Means 알고리즘의 가장 큰 단점은 <strong>사용자가 처음에 군집의 개수(K)를 직접 정해줘야 한다</strong>는 점입니다. 
          데이터의 실제 분포와 맞지 않는 K값을 선택하면 어떻게 될까요?
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Underfitting Example */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-2">K가 너무 작을 때 (Underfitting)</h3>
            <div className="bg-white h-48 rounded-lg mb-4 flex items-center justify-center border border-slate-200 relative overflow-hidden">
               {/* Visual Mockup using simple SVG */}
               <svg viewBox="0 0 200 150" className="w-full h-full">
                 {/* Imagine 3 real clusters, but only 2 centroids */}
                 <circle cx="50" cy="50" r="20" fill="#ef4444" opacity="0.2" />
                 <circle cx="150" cy="50" r="20" fill="#ef4444" opacity="0.2" />
                 <circle cx="100" cy="120" r="20" fill="#3b82f6" opacity="0.2" />
                 
                 <text x="100" y="75" textAnchor="middle" fontSize="10" fill="#64748b">실제 군집은 3개인데...</text>
                 
                 <circle cx="100" cy="50" r="4" fill="#ef4444" stroke="white" strokeWidth="2"/> {/* Red Centroid trying to cover top two */}
                 <circle cx="100" cy="120" r="4" fill="#3b82f6" stroke="white" strokeWidth="2"/>
               </svg>
            </div>
            <p className="text-sm text-slate-600">
              서로 다른 특성을 가진 두 그룹이 억지로 하나의 군집으로 묶이게 됩니다. 정보의 손실이 발생합니다.
            </p>
          </div>

          {/* Overfitting Example */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-2">K가 너무 클 때 (Overfitting)</h3>
             <div className="bg-white h-48 rounded-lg mb-4 flex items-center justify-center border border-slate-200 relative overflow-hidden">
               {/* Visual Mockup */}
               <svg viewBox="0 0 200 150" className="w-full h-full">
                 {/* Imagine 1 real cluster, but split into 3 */}
                 <circle cx="100" cy="75" r="40" fill="#10b981" opacity="0.1" />
                 
                 <text x="100" y="130" textAnchor="middle" fontSize="10" fill="#64748b">하나의 덩어리인데 쪼개짐</text>
                 
                 <circle cx="80" cy="60" r="4" fill="#ef4444" stroke="white" strokeWidth="2"/> 
                 <circle cx="120" cy="60" r="4" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                 <circle cx="100" cy="90" r="4" fill="#10b981" stroke="white" strokeWidth="2"/>
               </svg>
            </div>
            <p className="text-sm text-slate-600">
              같은 특성을 가진 그룹이 의미 없이 쪼개집니다. 해석이 어려워지고 모델이 불필요하게 복잡해집니다.
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-2">💡 해결 방법: 엘보우 기법 (Elbow Method)</h4>
          <p className="text-sm text-indigo-800">
            적절한 K를 찾기 위해, K를 늘려가며 오차(데이터와 중심점 간의 거리 합)가 급격히 줄어들다가 완만해지는 지점을 찾습니다. 그 모양이 팔꿈치 같다고 하여 엘보우 기법이라고 부릅니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeepDive;
