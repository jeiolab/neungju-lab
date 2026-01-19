import React from 'react';
import { Target, Map, Eye, Zap, Heart } from 'lucide-react';

const TabTheory: React.FC = () => {
  const elements = [
    {
      icon: <Target className="w-8 h-8 text-white" />,
      color: "bg-indigo-500",
      title: "1. 목표 (Goal)",
      desc: "이 에이전트는 왜 존재할까요? 어떤 문제를 해결하나요? 모든 훌륭한 에이전트에게는 명확한 '목적'이 필요합니다."
    },
    {
      icon: <Map className="w-8 h-8 text-white" />,
      color: "bg-emerald-500",
      title: "2. 환경 (Environment)",
      desc: "어디서 활동하나요? 청소 로봇은 가구의 위치를 알아야 하고, 화성 탐사선은 바위와 먼지를 견뎌야 합니다."
    },
    {
      icon: <Eye className="w-8 h-8 text-white" />,
      color: "bg-blue-500",
      title: "3. 센서 (Sensors)",
      desc: "세상을 어떻게 '인식'하나요? 시각을 위한 카메라, 소리를 듣는 마이크, 온도를 재는 온도계 등이 필요합니다."
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      color: "bg-amber-500",
      title: "4. 행동 (Actions)",
      desc: "실제로 무엇을 '수행'할 수 있나요? 바퀴로 이동하기, 화면에 메시지 띄우기, 소리 내기, 이메일 보내기 등이 있습니다."
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      color: "bg-pink-500",
      title: "5. 특성 (Characteristics)",
      desc: "어떤 성격을 가졌나요? 빠르고 과감한가요, 아니면 느리지만 신중한가요? 친절한 말투를 쓰나요, 기계적인 말투를 쓰나요?"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">지능형 에이전트 설계도</h2>
        <p className="text-slate-600 text-lg">똑똑한 인공지능 에이전트를 만들기 위해서는 이 5가지 핵심 요소가 필요합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elements.map((el, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${el.color} flex items-center justify-center mb-4 shadow-lg shadow-slate-200`}>
              {el.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{el.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{el.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-indigo-900 mb-2">설계할 준비가 되셨나요?</h3>
          <p className="text-indigo-700">이론을 모두 익혔다면, 이제 <strong>제작 (Simulation)</strong> 탭으로 이동해서 나만의 에이전트를 만들어보세요!</p>
        </div>
      </div>
    </div>
  );
};

export default TabTheory;