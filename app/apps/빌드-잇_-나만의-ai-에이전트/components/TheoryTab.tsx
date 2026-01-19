import React from 'react';
import { Eye, Brain, BookOpen, Zap } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  const cards = [
    {
      title: "1. 인식 (Perception)",
      icon: <Eye className="w-8 h-8 text-blue-500" />,
      desc: "주변 환경의 정보를 받아들이는 단계입니다.",
      content: "사람의 눈, 귀와 같이 '센서(Sensor)'를 사용합니다. 카메라, 마이크, 온도 센서 등이 여기에 해당합니다.",
      ref: "천재교과서 174p: 지능 에이전트의 정의"
    },
    {
      title: "2. 학습 (Learning)",
      icon: <BookOpen className="w-8 h-8 text-green-500" />,
      desc: "수집한 데이터를 바탕으로 지식을 쌓는 단계입니다.",
      content: "많은 데이터를 분석하여 패턴을 찾습니다. '데이터(Data)'가 많을수록 더 똑똑해집니다.",
      ref: "비상교육 175p: 로봇 축구의 학습"
    },
    {
      title: "3. 추론 (Reasoning)",
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      desc: "현재 상황을 판단하고 무엇을 할지 결정하는 단계입니다.",
      content: "'알고리즘(Algorithm)'을 통해 최적의 행동을 선택합니다. 입력된 정보와 학습된 지식을 연결합니다.",
      ref: "교문사 168p: 챗봇의 판단 원리"
    },
    {
      title: "4. 행동 (Action)",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      desc: "결정된 사항을 실제로 수행하는 단계입니다.",
      content: "'액추에이터(Actuator)'를 사용합니다. 모터로 이동하거나, 스피커로 소리를 내거나, 화면에 글을 띄웁니다.",
      ref: "교과서 공통: 에이전트의 산출물"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow overflow-hidden group">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                {card.icon}
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                STEP {idx + 1}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
            <p className="text-slate-600 font-medium mb-4">{card.desc}</p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-700 leading-relaxed mb-2">{card.content}</p>
              <p className="text-xs text-slate-400 text-right italic">{card.ref}</p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg mt-4">
        <h3 className="text-2xl font-bold mb-4">지능 에이전트란?</h3>
        <p className="text-blue-100 text-lg leading-relaxed">
          지능 에이전트는 환경을 인식(Sensor)하고, 스스로 판단(Algorithm)하여, 
          목표를 달성하기 위해 행동(Actuator)하는 자율적인 시스템입니다. 
          우리가 만드는 로봇 청소기, 자율주행 자동차, AI 스피커가 모두 이에 해당합니다.
        </p>
      </div>
    </div>
  );
};