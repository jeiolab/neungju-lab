import React from 'react';
import { LearningType } from '../types';

const TheoryCards: React.FC = () => {
  const cards = [
    {
      title: LearningType.SUPERVISED,
      icon: "📘",
      color: "bg-indigo-600",
      desc: "정답(레이블)이 있는 데이터를 학습합니다.",
      keywords: ["문제+답", "예측", "분류"],
      example: "개/고양이 사진에 이름표를 붙여서 학습시키기"
    },
    {
      title: LearningType.UNSUPERVISED,
      icon: "🔮",
      color: "bg-purple-600",
      desc: "정답 없이 데이터의 특징만으로 패턴을 찾습니다.",
      keywords: ["군집화", "유사도", "추천"],
      example: "비슷한 뉴스끼리 주제별로 묶기 (주제명은 모름)"
    },
    {
      title: LearningType.REINFORCEMENT,
      icon: "🥕",
      color: "bg-orange-600",
      desc: "시행착오를 통해 보상을 최대화하는 행동을 배웁니다.",
      keywords: ["보상/벌칙", "에이전트", "시행착오"],
      example: "넘어지면서 배우는 자전거 타기, 알파고"
    },
    {
      title: LearningType.TRADITIONAL,
      icon: "💻",
      color: "bg-slate-600",
      desc: "사람이 직접 명시적인 규칙(Rule)을 코딩합니다.",
      keywords: ["If-Then", "알고리즘", "규칙기반"],
      example: "점수가 90점 이상이면 A학점을 주는 코드"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
      {cards.map((card) => (
        <div key={card.title} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-2xl transition-shadow">
          <div className={`${card.color} p-4 flex items-center`}>
            <span className="text-4xl mr-3">{card.icon}</span>
            <h3 className="text-xl font-bold text-white">{card.title}</h3>
          </div>
          <div className="p-5">
            <p className="text-gray-300 mb-4 h-12">{card.desc}</p>
            
            <div className="mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Keywords</span>
              <div className="flex gap-2">
                {card.keywords.map(k => (
                  <span key={k} className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded-md">{k}</span>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Example</span>
              <p className="text-sm text-gray-300">{card.example}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Reflection Section */}
      <div className="md:col-span-2 bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl border border-gray-600 mt-4">
        <h3 className="text-xl font-bold text-white mb-3">🤔 생각해볼 문제</h3>
        <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
                <span className="mr-2 text-yellow-400">Q.</span>
                정답을 일부만 주고(반지도학습), 나머지는 스스로 찾게 하면 어떨까요?
            </li>
            <li className="flex items-start">
                <span className="mr-2 text-yellow-400">Q.</span>
                유튜브 추천 알고리즘은 비지도학습일까요, 지도학습일까요? (정답: 둘 다 섞어 씁니다!)
            </li>
        </ul>
      </div>
    </div>
  );
};

export default TheoryCards;