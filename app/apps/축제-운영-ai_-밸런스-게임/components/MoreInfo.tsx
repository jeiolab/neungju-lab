import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isOpen, onClick }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
    <button
      className={`w-full p-4 text-left flex justify-between items-center transition-colors ${
        isOpen ? 'bg-indigo-50 text-indigo-700 font-bold' : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <span>{title}</span>
      <span className="text-xl">{isOpen ? '−' : '+'}</span>
    </button>
    <div
      className={`bg-white px-4 text-gray-600 text-sm overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
      }`}
    >
      {content}
    </div>
  </div>
);

const MoreInfo: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    {
      title: "⚠️ 충돌 사례 1: 자율성 vs 안전성",
      content: "자율성이 너무 높은 로봇이 빠른 길을 찾기 위해 '공사 중' 표지판을 무시하고 지나가려다 사고가 날 수 있습니다. 안전이 최우선일 땐 자율성을 제한해야 합니다."
    },
    {
      title: "⚠️ 충돌 사례 2: 개인 최적화 vs 전체 효율",
      content: "모든 로봇이 각자의 주인에게 가장 빠른 서비스를 제공하려다(개인 최적화), 통로가 막혀 아무도 움직이지 못하는 교착 상태(Deadlock)에 빠질 수 있습니다. 이때는 협력성이 필요합니다."
    },
    {
      title: "❓ 자율성은 '마음대로' 인가요?",
      content: "아닙니다. 자율성은 설계자가 정한 '목적 함수(Reward Function)'를 최대화하는 방향으로 스스로 방법을 찾는 것입니다. 완전한 자유가 아니라 '목적 있는 자율'입니다."
    },
    {
      title: "💡 우리 주변의 지능 에이전트",
      content: "로봇 청소기(장애물 회피), 내비게이션 앱(실시간 경로 재탐색), 게임 속 NPC(플레이어에 반응) 등이 모두 지능 에이전트의 일종입니다."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📚 더 알아보기: 특성 간의 충돌과 균형</h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        {items.map((item, idx) => (
          <AccordionItem
            key={idx}
            title={item.title}
            content={item.content}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default MoreInfo;