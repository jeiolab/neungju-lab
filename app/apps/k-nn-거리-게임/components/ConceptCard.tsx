import React, { useState } from 'react';
import { ArrowRight, BookOpen, Brain, CheckCircle } from 'lucide-react';

interface ConceptCardProps {
  onComplete: () => void;
}

const concepts = [
  {
    title: "미션: 취향을 맞춰라!",
    content: "전학생이 되어 내 음악 취향을 알아봅시다. 나랑 생활 패턴(공부, 게임)이 비슷한 친구들을 보면 알 수 있죠. 이것이 바로 k-NN 알고리즘의 핵심입니다!",
    icon: <Brain className="w-12 h-12 text-indigo-500" />
  },
  {
    title: "1. k-NN이란?",
    content: "k-최근접 이웃(k-Nearest Neighbors)은 단순합니다. 새로운 점(나)을 분류할 때, 가장 가까운 'k'개의 기존 점(이웃)을 찾아 다수결로 정하는 방법입니다.",
    icon: <BookOpen className="w-12 h-12 text-blue-500" />
  },
  {
    title: "2. 'k'의 의미",
    content: "k는 물어볼 이웃의 수입니다. k=1이면 제일 가까운 친구 1명만 따라갑니다. k=5면 5명에게 물어보고 다수결을 따르죠. k값에 따라 결과가 달라집니다!",
    icon: <div className="text-4xl font-bold text-yellow-500">k=?</div>
  },
  {
    title: "3. 거리와 정규화",
    content: "우리는 '거리'로 가까움을 잽니다. 주의할 점! 공부시간은 0-10인데 용돈이 0-100,000이라면? 큰 숫자가 결과를 지배합니다. 그래서 모두 0~1로 맞추는 '정규화'가 필요합니다.",
    icon: <div className="text-4xl font-bold text-green-500">0...1</div>
  }
];

const ConceptCard: React.FC<ConceptCardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < concepts.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const current = concepts[step];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto min-h-[400px] flex flex-col justify-between border-t-4 border-indigo-500">
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-indigo-50 rounded-full">
            {current.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{current.title}</h2>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed break-keep">
          {current.content}
        </p>
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          {concepts.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full transition-colors ${i === step ? 'bg-indigo-500' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <button 
          onClick={nextStep}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
        >
          {step === concepts.length - 1 ? '시뮬레이션 시작' : '다음'}
          {step === concepts.length - 1 ? <CheckCircle size={20} /> : <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ConceptCard;