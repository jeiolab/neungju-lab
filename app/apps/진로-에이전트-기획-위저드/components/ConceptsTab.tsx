import React from 'react';
import { Users, Scale, ShieldCheck, AlertCircle } from 'lucide-react';

const ConceptsTab: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const cards = [
    {
      title: '역할 분담 (Role Division)',
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      desc: 'AI는 데이터를 분석하고 초안을 만들지만, 최종 결정은 인간이 합니다. AI가 잘하는 일(반복, 분석)과 인간이 잘하는 일(판단, 공감)을 나누어야 합니다.'
    },
    {
      title: '문제 정의 (Goal Setting)',
      icon: AlertCircle,
      color: 'bg-amber-100 text-amber-700',
      desc: 'AI에게 무엇을 시킬지 명확히 정의해야 합니다. "진로를 찾아줘" 같은 모호한 명령보다는 "내 성적과 흥미를 기반으로 학과 3개를 추천해줘"가 좋습니다.'
    },
    {
      title: 'AI 윤리 (Ethics)',
      icon: Scale,
      color: 'bg-green-100 text-green-700',
      desc: 'AI가 편향된 정보를 주거나 개인정보를 유출하지 않도록 감시해야 합니다. 특정 직업에 성별 고정관념이 반영되지 않았는지 확인해야 합니다.'
    },
    {
      title: '검증 (Verification)',
      icon: ShieldCheck,
      color: 'bg-purple-100 text-purple-700',
      desc: 'AI의 답변(Output)이 사실인지 확인하는 과정입니다. AI는 거짓말을 사실처럼 말하는 "환각(Hallucination)" 현상이 있을 수 있습니다.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">인간과 AI의 올바른 협업</h2>
        <p className="text-gray-600">진로 에이전트를 기획하기 전에 꼭 알아야 할 4가지 개념입니다.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
        >
          기획 시작하기
        </button>
      </div>
    </div>
  );
};

export default ConceptsTab;