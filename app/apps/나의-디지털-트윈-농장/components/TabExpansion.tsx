import React from 'react';
import { Building2, Car, Zap, HeartPulse } from 'lucide-react';

const TabExpansion: React.FC = () => {
  return (
    <div className="p-4 animate-fade-in space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">농장을 넘어 도시로: 스마트 시티</h2>
        <p className="text-lg text-slate-600 mb-8">
          우리가 배운 '디지털 트윈' 기술은 양돈 농장뿐만 아니라 우리가 사는 <strong>도시 전체</strong>에도 적용되고 있습니다.
          이를 <span className="text-indigo-600 font-bold">'스마트 시티(Smart City)'</span>라고 합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-xl hover:bg-white hover:shadow-md transition border border-slate-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4"><Car size={24} /></div>
              <h3 className="text-xl font-bold">교통 최적화</h3>
            </div>
            <p className="text-slate-600">
              도로의 차량 흐름을 센서로 감지하고, 가상 도시에서 시뮬레이션하여 신호등 주기를 실시간으로 조절, 교통 체증을 줄입니다.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl hover:bg-white hover:shadow-md transition border border-slate-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600 mr-4"><Zap size={24} /></div>
              <h3 className="text-xl font-bold">에너지 관리</h3>
            </div>
            <p className="text-slate-600">
              건물의 전력 사용량을 예측하고, 태양광 발전량과 비교하여 남는 전기를 자동으로 저장하거나 분배하여 낭비를 막습니다.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl hover:bg-white hover:shadow-md transition border border-slate-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg text-red-600 mr-4"><HeartPulse size={24} /></div>
              <h3 className="text-xl font-bold">안전 및 재난 방지</h3>
            </div>
            <p className="text-slate-600">
              화재 발생 시 센서가 감지하고, 디지털 트윈이 바람의 방향과 불길을 예측하여 소방차에게 가장 빠른 경로와 대피로를 안내합니다.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl hover:bg-white hover:shadow-md transition border border-slate-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 mr-4"><Building2 size={24} /></div>
              <h3 className="text-xl font-bold">도시 계획</h3>
            </div>
            <p className="text-slate-600">
              새로운 건물을 짓기 전에 가상 도시에서 미리 지어보고, 일조권 침해나 바람길 막힘 등의 문제를 사전에 확인합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center p-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl text-white">
        <h3 className="text-2xl font-bold mb-4">여러분의 아이디어는?</h3>
        <p className="mb-6 opacity-90">디지털 트윈 기술을 우리 학교나 집에 적용한다면 어떤 문제를 해결할 수 있을까요?</p>
        <button className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-full hover:bg-indigo-50 transition">
            생각해보기
        </button>
      </div>
    </div>
  );
};

export default TabExpansion;