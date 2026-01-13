import React from 'react';
import { Search, Lightbulb, Users, Tag } from 'lucide-react';

export const TabTheory: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Search className="text-blue-600" />
          비지도 학습(Unsupervised Learning)이란?
        </h2>
        
        <p className="text-lg text-slate-700 leading-relaxed mb-6">
          선생님 없이 스스로 공부하는 학생을 상상해보세요. 정답표(Label) 없이, 
          수많은 문제들(Data) 속에서 스스로 <strong>공통점과 규칙</strong>을 찾아내는 학습 방법입니다.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Tag size={18} className="text-red-500" />
              지도 학습 (Supervised)
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li>데이터에 <strong>정답(레이블)</strong>이 있음</li>
              <li>예: "이 사진은 고양이입니다"라고 알려줌</li>
              <li>목표: 정답을 맞추는 것</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Search size={18} className="text-blue-600" />
              비지도 학습 (Unsupervised)
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-blue-700">
              <li>데이터에 <strong>정답</strong>이 없음</li>
              <li>예: "이 사진들이 뭔지 모르지만 비슷하게 생겼네"</li>
              <li>목표: 데이터의 <strong>숨은 구조(패턴)</strong> 발견</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="text-purple-600" />
          핵심 기술: 군집화 (Clustering)
        </h2>
        <p className="text-slate-700 mb-6">
          비슷한 특성을 가진 데이터들을 같은 그룹(Cluster)으로 묶는 기술입니다.
          데이터 탐정인 여러분이 할 일은 데이터들이 어떻게 모여있는지 확인하는 것입니다.
        </p>

        <div className="relative h-40 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
          <svg width="300" height="150" viewBox="0 0 300 150">
            {/* Cluster A */}
            <circle cx="80" cy="75" r="40" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="70" cy="65" r="5" fill="#3b82f6" />
            <circle cx="90" cy="80" r="5" fill="#3b82f6" />
            <circle cx="75" cy="85" r="5" fill="#3b82f6" />
            
            {/* Cluster B */}
            <circle cx="220" cy="75" r="40" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="210" cy="65" r="5" fill="#ef4444" />
            <circle cx="230" cy="80" r="5" fill="#ef4444" />
            <circle cx="225" cy="85" r="5" fill="#ef4444" />

            <text x="150" y="140" textAnchor="middle" fontSize="12" fill="#64748b">거리(Distance)가 가까울수록 같은 그룹!</text>
          </svg>
        </div>
      </div>
    </div>
  );
};