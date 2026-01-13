import React from 'react';
import { ArrowRight, Cpu, Zap, Layers } from 'lucide-react';

const ConceptView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in p-2">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600">
            <Zap size={24} />
          </span>
          직업 세계가 변하고 있어요
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          우리는 현재 <strong>4차 산업혁명</strong>의 한가운데에 살고 있습니다. 
          과거의 산업혁명이 육체 노동을 기계로 대체했다면, 지금은 인공지능(AI)과 빅데이터가 
          인간의 지적 노동까지 도와주거나 대체하고 있습니다.
          이에 따라 단순히 반복적인 업무를 하는 직업은 사라지고, 
          <span className="text-blue-600 font-bold"> 창의적이고 감성적인 역량</span>을 요구하는 새로운 직업들이 생겨나고 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-2">과거 (1~2차 산업혁명)</h3>
            <p className="text-sm text-gray-500">육체 노동 중심. 기계가 힘을 대체함. 대량 생산이 목표.</p>
            <div className="mt-2 text-xs text-gray-400">예: 방적공, 대장장이</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-1 bg-blue-500 text-white text-xs font-bold rounded-bl-lg">현재</div>
            <h3 className="font-bold text-blue-800 mb-2">정보화 혁명 (3차)</h3>
            <p className="text-sm text-blue-600">지식 정보 중심. 컴퓨터와 인터넷의 보급. 자동화 시작.</p>
             <div className="mt-2 text-xs text-blue-400">예: 프로그래머, 웹 디자이너</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-800 mb-2">미래 (4차 산업혁명)</h3>
            <p className="text-sm text-indigo-600">초연결, 초지능. AI와 로봇의 융합. 개인 맞춤형 서비스.</p>
             <div className="mt-2 text-xs text-indigo-400">예: AI 윤리 전문가, 우주 가이드</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
             <Layers className="mr-2" /> 변화의 트렌드
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center bg-white/10 p-4 rounded-lg backdrop-blur-sm flex-1 w-full md:w-auto">
              <span className="block text-2xl mb-1">🎞️</span>
              <span className="font-bold">영화 필름 현상원</span>
              <p className="text-xs text-blue-100 mt-1">디지털 카메라의 등장으로 소멸</p>
            </div>
            <ArrowRight className="hidden md:block text-white/50" size={32} />
            <div className="text-center md:hidden">↓</div>
            <div className="text-center bg-white/20 p-4 rounded-lg backdrop-blur-md flex-1 w-full md:w-auto border border-white/30">
              <span className="block text-2xl mb-1">🤖</span>
              <span className="font-bold">프롬프트 엔지니어</span>
              <p className="text-xs text-blue-100 mt-1">생성형 AI 시대의 새로운 전문가</p>
            </div>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <Cpu className="absolute -bottom-4 -right-4 text-white/10" size={120} />
      </div>
    </div>
  );
};

export default ConceptView;
