import React, { useState } from 'react';
import { Eye, Brain, Activity, ChevronRight } from 'lucide-react';

const TheoryTab: React.FC = () => {
  const [activeExample, setActiveExample] = useState<'serving' | 'cleaner' | 'door'>('serving');

  const examples = {
    serving: {
      title: "서빙 로봇",
      sensor: "카메라, LiDAR (사람/테이블 인식)",
      decision: "경로 계획, 장애물 회피 판단",
      action: "바퀴 구동, 정지, 음성 안내",
      image: "https://picsum.photos/400/200?random=1"
    },
    cleaner: {
      title: "로봇 청소기",
      sensor: "충돌 센서, 절벽 감지 센서",
      decision: "청소 안 된 구역 탐색, 패턴 결정",
      action: "브러시 회전, 먼지 흡입 이동",
      image: "https://picsum.photos/400/200?random=2"
    },
    door: {
      title: "자동문",
      sensor: "적외선 동작 감지 센서",
      decision: "신호 감지 시 '열림' 신호 생성",
      action: "모터 작동 (문 슬라이딩)",
      image: "https://picsum.photos/400/200?random=3"
    }
  };

  const current = examples[activeExample];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">지능 에이전트의 3단계</h2>
        <p className="text-slate-600">로봇은 어떻게 생각하고 움직일까요?</p>
      </header>

      {/* 3 Step Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <Eye size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">1. 센서 (입력)</h3>
          <p className="text-sm text-slate-600">환경을 인식합니다.<br/>(예: 카메라, 마이크)</p>
        </div>
        
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 relative">
           <div className="hidden md:block absolute -left-5 top-1/2 transform -translate-y-1/2 z-10 text-slate-300">
             <ChevronRight size={32} />
           </div>
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
            <Brain size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">2. 판단 (처리)</h3>
          <p className="text-sm text-slate-600">정보를 분석하고 결정합니다.<br/>(예: AI 모델, 규칙)</p>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 relative">
          <div className="hidden md:block absolute -left-5 top-1/2 transform -translate-y-1/2 z-10 text-slate-300">
             <ChevronRight size={32} />
           </div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <Activity size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">3. 행동 (출력)</h3>
          <p className="text-sm text-slate-600">실제로 환경을 변화시킵니다.<br/>(예: 모터, 스피커)</p>
        </div>
      </div>

      {/* Interactive Examples */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 justify-center">
          {(Object.keys(examples) as Array<keyof typeof examples>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeExample === key 
                  ? 'bg-slate-800 text-white shadow-md transform scale-105' 
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {examples[key].title}
            </button>
          ))}
        </div>
        
        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">INPUT</span>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Eye size={20} className="text-blue-500" />
                <span className="text-slate-700 font-medium">{current.sensor}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">PROCESS</span>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Brain size={20} className="text-purple-500" />
                <span className="text-slate-700 font-medium">{current.decision}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider">OUTPUT</span>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Activity size={20} className="text-green-500" />
                <span className="text-slate-700 font-medium">{current.action}</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
             <div className="rounded-xl overflow-hidden shadow-md border border-slate-200">
               <img src={current.image} alt={current.title} className="w-full h-64 object-cover" />
               <div className="p-3 bg-slate-900 text-white text-center font-medium">
                 {current.title}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;