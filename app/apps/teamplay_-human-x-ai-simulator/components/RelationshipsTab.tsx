import React from 'react';
import { RelationshipType } from '../types';

const RelationshipsTab: React.FC = () => {
  const relationships: RelationshipType[] = [
    {
      title: "협력 (Cooperation)",
      description: "인간과 AI가 서로 다른 역할을 수행하며 공동의 목표를 달성하는 이상적인 관계.",
      example: "의사(진단/상담) + AI(영상 판독)",
      icon: "🤝"
    },
    {
      title: "의존 (Reliance)",
      description: "인간이 수행하던 작업을 AI에게 전적으로 맡기며, 인간의 개입이 줄어드는 상태.",
      example: "자율주행 자동차 (Level 4 이상)",
      icon: "🤖"
    },
    {
      title: "대체 (Replacement)",
      description: "AI가 인간의 노동력을 완전히 대신하여 인간이 해당 업무에서 배제되는 형태.",
      example: "무인 키오스크, 자동화 공장 로봇",
      icon: "📉"
    },
    {
      title: "경쟁 (Competition)",
      description: "동일한 업무 영역에서 인간과 AI가 성과를 두고 경쟁하는 구도.",
      example: "체스/바둑 대결, 주식 트레이딩",
      icon: "⚔️"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">인간과 AI의 4가지 관계</h2>
        <p className="text-gray-600 mt-2">우리는 어떤 관계를 지향해야 할까요?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {relationships.map((rel, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500 hover:shadow-lg transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{rel.title}</h3>
                <span className="text-4xl">{rel.icon}</span>
              </div>
              <p className="text-gray-600 mb-4 h-12">{rel.description}</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Example</span>
                <p className="text-sm font-medium text-gray-800 mt-1">{rel.example}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
        <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center">미래 사회의 방향성</h3>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-2 border-2 border-indigo-200">
                    <span className="text-4xl">🧑‍🎨</span>
                </div>
                <p className="font-bold text-indigo-800">인간: 가치 창출</p>
            </div>
            <div className="text-3xl text-indigo-300 hidden md:block">➕</div>
            <div className="text-3xl text-indigo-300 md:hidden">⬇️</div>
            <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-2 border-2 border-indigo-200">
                    <span className="text-4xl">⚡</span>
                </div>
                <p className="font-bold text-indigo-800">AI: 효율성 극대화</p>
            </div>
            <div className="text-3xl text-indigo-300 hidden md:block">➡️</div>
            <div className="text-3xl text-indigo-300 md:hidden">⬇️</div>
            <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-2 border-2 border-indigo-500 bg-gradient-to-br from-indigo-500 to-blue-500">
                    <span className="text-4xl">🚀</span>
                </div>
                <p className="font-bold text-indigo-900">상생과 혁신</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipsTab;