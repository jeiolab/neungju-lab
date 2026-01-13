import React from 'react';
import { Cpu, Activity, Flag, MessageCircle } from 'lucide-react';

const TheoryTab: React.FC = () => {
  const cards = [
    {
      title: "자율성 (Autonomy)",
      eng: "Autonomy",
      icon: <Cpu className="w-8 h-8 text-indigo-500" />,
      desc: "외부의 간섭 없이 스스로 판단하고 행동하는 능력입니다.",
      ex: "네비게이션 경로가 막혔을 때, 스스로 우회 도로를 탐색하고 결정함."
    },
    {
      title: "반응성 (Reactivity)",
      eng: "Reactivity",
      icon: <Activity className="w-8 h-8 text-green-500" />,
      desc: "환경의 변화를 즉각적으로 감지하고 대응하는 능력입니다.",
      ex: "갑자기 튀어나온 보행자를 센서로 감지하고 즉시 브레이크를 밟음."
    },
    {
      title: "목표지향성 (Goal-orientedness)",
      eng: "Goal-orientedness",
      icon: <Flag className="w-8 h-8 text-red-500" />,
      desc: "단순 반응을 넘어 원하는 목적(Goal)을 달성하려는 성질입니다.",
      ex: "단기적인 장애물을 피하면서도 최종 목적지인 집으로 계속 이동함."
    },
    {
      title: "사회성 (Social Ability)",
      eng: "Social Ability",
      icon: <MessageCircle className="w-8 h-8 text-blue-500" />,
      desc: "다른 에이전트(차량, 인프라)와 소통하고 협력하는 능력입니다.",
      ex: "차선 변경 시 깜빡이를 켜서 뒷차에게 의도를 알리고 양보를 받음."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">지능형 에이전트의 4대 특성</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          자율주행 자동차는 단순한 기계가 아닌, 환경을 인식하고 판단하는 '지능형 에이전트(Intelligent Agent)'입니다. 
          에이전트가 갖춰야 할 핵심적인 4가지 특성을 알아봅시다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                {card.icon}
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{card.title}</h3>
            <p className="text-xs text-gray-400 font-mono uppercase mb-4 tracking-wider">{card.eng}</p>
            
            <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-1">
              {card.desc}
            </p>
            
            <div className="bg-indigo-50 p-4 rounded-xl text-xs text-indigo-900 border border-indigo-100">
              <strong className="block mb-1 text-indigo-600">Example Scenario:</strong>
              {card.ex}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheoryTab;
