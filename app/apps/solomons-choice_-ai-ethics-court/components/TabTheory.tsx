import React from 'react';
import { BookOpen, Eye, Lock, Users, AlertTriangle } from 'lucide-react';

export const TabTheory: React.FC = () => {
  const cards = [
    {
      title: "편향성 (Bias)",
      icon: <Users className="text-orange-500" size={32} />,
      desc: "AI 학습 데이터가 특정 인종, 성별, 계층에 치우치면 AI도 차별적인 판단을 할 수 있습니다. '공정성'을 확보하는 것이 핵심입니다.",
      example: "예: 남성 이력서만 주로 학습한 채용 AI가 여성 지원자를 탈락시키는 경우."
    },
    {
      title: "책임성 (Accountability)",
      icon: <BookOpen className="text-blue-500" size={32} />,
      desc: "AI의 결정으로 문제가 발생했을 때(예: 자율주행 사고), 그 책임을 개발자, 사용자, 제조사 중 누가 질 것인지 명확히 해야 합니다.",
      example: "예: AI 의사의 오진으로 환자가 피해를 입었을 때의 법적 책임."
    },
    {
      title: "투명성 (Transparency)",
      icon: <Eye className="text-green-500" size={32} />,
      desc: "AI가 어떤 근거로 그런 판단을 내렸는지 설명 가능해야 합니다(XAI). '블랙박스' 문제를 해결하고 신뢰를 얻기 위함입니다.",
      example: "예: 대출 거절 사유를 명확히 설명하지 못하는 금융 AI."
    },
    {
      title: "안전성 (Safety)",
      icon: <Lock className="text-red-500" size={32} />,
      desc: "AI가 인간에게 해를 끼치지 않도록 설계되어야 하며, 오작동이나 해킹에 대한 방어책이 마련되어야 합니다.",
      example: "예: 킬러 로봇 금지, 자율주행차의 비상 정지 시스템."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-3xl font-serif font-bold text-gray-800">AI 윤리의 기초</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          강인공지능 시대를 대비하여 우리는 기술적 발전뿐만 아니라 올바른 관계 정립을 위한 규칙이 필요합니다.
          다음 4가지 핵심 가치는 AI 윤리 헌장의 토대가 됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-law-gold hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
              {card.icon}
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">{card.desc}</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 flex gap-2">
              <AlertTriangle size={16} className="min-w-[16px] mt-0.5 text-law-gold" />
              <span>{card.example}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
        <h3 className="font-bold text-blue-900 mb-2">💡 교과서 핵심 포인트</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-800">
          <li><strong>비상 174p:</strong> 강인공지능은 인간의 지적 능력을 초월할 수 있으므로, 사회적 합의와 법적 규제가 필수적입니다.</li>
          <li><strong>이오북스 185p:</strong> 인간과 AI의 바람직한 관계 정립을 위해 '인간 존엄성'이 최우선 가치가 되어야 합니다.</li>
        </ul>
      </div>
    </div>
  );
};
