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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-2">과거 (1~2차 산업혁명)</h3>
            <p className="text-sm text-gray-500">육체 노동 중심. 기계가 힘을 대체함. 대량 생산이 목표.</p>
            <div className="mt-2 text-xs text-gray-400">예: 방적공, 대장장이</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">정보화 혁명 (3차)</h3>
            <p className="text-sm text-blue-600">지식 정보 중심. 컴퓨터와 인터넷의 보급. 자동화 시작.</p>
             <div className="mt-2 text-xs text-blue-400">예: 프로그래머, 웹 디자이너</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-indigo-600 text-white text-xs font-bold rounded-bl-lg">현재</div>
            <h3 className="font-bold text-indigo-800 mb-2">현재 (4차 산업혁명)</h3>
            <p className="text-sm text-indigo-600">초연결, 초지능. AI와 로봇의 융합. 개인 맞춤형 서비스.</p>
             <div className="mt-2 text-xs text-indigo-400">예: AI 윤리 전문가, 우주 가이드</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <h3 className="font-bold text-purple-800 mb-2">미래 (예상)</h3>
            <p className="text-sm text-purple-600">지속 가능한 경제, 순환 경제. 환경 친화 기술과 인간 중심 설계. 양자컴퓨팅, 생명공학, 우주개발의 융합.</p>
             <div className="mt-2 text-xs text-purple-400">예: 탄소 중립 전문가, 순환 경제 설계자</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 flex items-center text-slate-900">
             <Layers className="mr-2 text-blue-600" /> 변화의 트렌드
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center bg-slate-50 border border-slate-200 p-4 rounded-lg flex-1 w-full md:w-auto">
              <span className="block text-2xl mb-1">🎞️</span>
              <span className="font-bold text-slate-900">영화 필름 현상원</span>
              <p className="text-xs text-slate-500 mt-1">디지털 카메라의 등장으로 소멸</p>
            </div>
            <ArrowRight className="hidden md:block text-slate-300" size={32} />
            <div className="text-center md:hidden text-slate-300">↓</div>
            <div className="text-center bg-blue-50 border border-blue-200 p-4 rounded-lg flex-1 w-full md:w-auto">
              <span className="block text-2xl mb-1">🤖</span>
              <span className="font-bold text-slate-900">프롬프트 엔지니어</span>
              <p className="text-xs text-slate-600 mt-1">생성형 AI 시대의 새로운 전문가</p>
            </div>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <Cpu className="absolute -bottom-4 -right-4 text-slate-100" size={120} />
      </div>
    </div>
  );
};

export default ConceptView;
