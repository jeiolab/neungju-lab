import React from 'react';
import { Share2, Circle, Activity } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900">친구 관계를 수학으로 본다면?</h1>
        <p className="text-lg text-slate-600">
          우리의 인간관계는 <span className="text-indigo-600 font-bold">소셜 네트워크(Social Network)</span>라는 거대한 그물망과 같습니다.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <Circle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">노드 (Node)</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            그래프에서 <strong>점</strong>을 의미합니다. 소셜 네트워크에서는 '사람' 한 명 한 명이 바로 노드가 됩니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">엣지 (Edge)</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            노드와 노드를 잇는 <strong>선</strong>입니다. 친구 관계, 팔로우, 좋아요 등 사람 사이의 '연결'을 의미해요.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">중심성 (Centrality)</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            누가 가장 영향력이 클까요? 연결된 선이 많을수록, 혹은 중요한 길목에 있을수록 <strong>중심성</strong>이 높습니다.
          </p>
        </div>
      </div>

      <div className="bg-indigo-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">케빈 베이컨의 6단계 법칙</h2>
          <p className="text-indigo-200 mb-6 max-w-2xl">
            지구상의 모든 사람은 최대 6단계만 건너뛰면 서로 아는 사이라는 이론입니다. 
            여러분의 학급 친구들은 몇 단계 만에 모두와 연결될 수 있을까요?
            <br/><br/>
            이것을 <strong>'작은 세상 현상(Small World Phenomenon)'</strong>이라고도 부릅니다.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default TheoryTab;
