import React from 'react';
import { Cpu, Wifi, Watch } from 'lucide-react';
import { CONCEPTS } from '../constants';

const ConceptTab: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'IoT': return <Wifi className="w-12 h-12 text-blue-500" />;
      case 'AI': return <Cpu className="w-12 h-12 text-purple-500" />;
      case 'Wearable': return <Watch className="w-12 h-12 text-green-500" />;
      default: return <Wifi />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">디지털 기술이란?</h2>
        <p className="text-gray-600">
          우리 삶을 더 편리하고 스마트하게 만들어주는 핵심 기술 3가지를 알아봐요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CONCEPTS.map((concept, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="mb-4 p-4 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
              {getIcon(concept.iconName)}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{concept.title}</h3>
            <p className="text-sm text-blue-600 font-semibold mb-3">{concept.description}</p>
            <p className="text-gray-600 text-sm leading-relaxed text-left break-keep">
              {concept.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
        <div className="bg-blue-500 text-white rounded-full p-2 shrink-0">
          <span className="font-bold text-lg px-2">?</span>
        </div>
        <div>
          <h4 className="font-bold text-lg text-blue-900 mb-1">교과서 연결하기</h4>
          <p className="text-blue-800 text-sm">
            정보 교과서 '디지털 문화' 단원에서 배운 내용입니다. 
            이 기술들이 융합되어 우리 집을 '스마트 홈'으로 변화시키고 있습니다. 
            다음 탭에서 직접 집을 꾸며보세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;