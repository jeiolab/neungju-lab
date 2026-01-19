import React from 'react';
import { Lightbulb, Scale, Users, BrainCircuit } from 'lucide-react';

const TheoryTab: React.FC = () => {
  const concepts = [
    {
      title: "창의성 혁신 (Creative Innovation)",
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      desc: "인간의 고유 영역. 기존에 없던 새로운 아이디어를 내고, 비정형적인 문제를 정의하는 단계에서 인간의 역할이 필수적입니다.",
      key: "Human > AI"
    },
    {
      title: "의사결정 지원 (Decision Support)",
      icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
      desc: "AI의 강점 영역. 방대한 데이터를 분석하여 패턴을 찾고 예측 모델을 제공하여 인간의 판단을 돕습니다.",
      key: "AI > Human (속도/정확도)"
    },
    {
      title: "노동력 분배 (Labor Distribution)",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      desc: "단순 반복 업무는 AI에게 위임하고, 인간은 가치 판단과 윤리적 책임이 필요한 고차원 업무에 집중하는 협업 모델입니다.",
      key: "Collaboration"
    },
    {
      title: "책임과 윤리 (Responsibility)",
      icon: <Scale className="w-8 h-8 text-red-500" />,
      desc: "최종 결정에 대한 책임은 인간에게 있습니다. AI는 도구일 뿐, 윤리적 딜레마를 해결하는 주체는 인간이어야 합니다.",
      key: "Human ONLY"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">협업의 3대 요소</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          성공적인 프로젝트를 위해서는 인간과 AI의 장단점을 명확히 이해하고 적재적소에 배치해야 합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-start">
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              {concept.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{concept.title}</h3>
            <p className="text-gray-600 mb-4 flex-grow leading-relaxed">
              {concept.desc}
            </p>
            <div className="text-sm font-semibold text-primary bg-blue-50 px-3 py-1 rounded-full">
              핵심: {concept.key}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-xl mt-8">
        <h3 className="text-2xl font-bold mb-4">💡 PM을 위한 Tip</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-50 text-lg">
          <li>초기 기획 단계에서는 <strong>인간의 직관</strong>을 믿으세요.</li>
          <li>데이터 검증 단계에서는 <strong>AI의 연산 능력</strong>을 활용하세요.</li>
          <li>최종 생산 및 결정 단계에서는 반드시 <strong>인간이 개입</strong>하여 리스크를 관리해야 합니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default TheoryTab;