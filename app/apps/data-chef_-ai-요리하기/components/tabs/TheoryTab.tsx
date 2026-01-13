import React from 'react';
import { Database, Scissors, Brain, Award } from 'lucide-react';
import { GlossaryTerm } from '../Glossary';

interface Props {
  onTermClick: (term: string) => void;
}

export const TheoryTab: React.FC<Props> = ({ onTermClick }) => {
  const steps = [
    {
      icon: <Database className="w-12 h-12 text-blue-500" />,
      title: "1. 데이터 수집/전처리",
      desc: "좋은 요리는 좋은 재료에서 시작합니다. 데이터를 모으고, 노이즈(상한 재료)를 제거하여 깨끗하게 만듭니다.",
      terms: ["데이터 전처리", "노이즈"]
    },
    {
      icon: <Scissors className="w-12 h-12 text-green-500" />,
      title: "2. 데이터 분리",
      desc: "모든 재료를 요리에 다 쓰지 않습니다. 일부는 나중에 맛을 보기 위해 남겨둡니다(테스트 데이터).",
      terms: ["학습 데이터", "테스트 데이터"]
    },
    {
      icon: <Brain className="w-12 h-12 text-orange-500" />,
      title: "3. 모델 학습",
      desc: "레시피에 따라 요리를 합니다. 모델이 데이터를 공부하며 패턴을 익히는 과정입니다.",
      terms: ["모델"]
    },
    {
      icon: <Award className="w-12 h-12 text-purple-500" />,
      title: "4. 평가 및 적용",
      desc: "완성된 요리를 맛봅니다. 남겨둔 테스트 데이터로 성능을 확인하고, 실전에 사용합니다.",
      terms: ["과적합"]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">AI 요리 과정 (Machine Learning Pipeline)</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 bg-orange-50/50 rounded-xl hover:bg-orange-50 transition-colors">
              <div className="mb-3 p-3 bg-white rounded-full shadow-md">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 mb-3">{step.desc}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {step.terms.map(term => (
                  <GlossaryTerm key={term} term={term} onClick={onTermClick} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};