import React from 'react';
import { CONCEPTS } from '../constants';

const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">표준 입출력 vs 파일 입출력</h2>
        <p className="text-gray-600 mt-2">데이터가 어디로 흐르는지 확인해보세요!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {CONCEPTS.map((concept, idx) => {
          const Icon = concept.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`p-4 ${concept.color} flex items-center justify-between`}>
                <h3 className="font-bold text-lg">{concept.title}</h3>
                <Icon size={24} />
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm font-medium">{concept.desc}</p>
                <ul className="space-y-3">
                  {concept.details.map((detail, dIdx) => (
                    <li key={dIdx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="font-mono text-indigo-600 font-bold block mb-1">{detail.label}</span>
                      <span className="text-sm text-gray-500">{detail.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-8">
        <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
          ⚡ 흔한 오해 (Common Pitfalls)
        </h3>
        <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
          <li><strong>w 모드는 조심하세요!</strong> 파일을 여는 순간 기존 내용이 싹 사라집니다.</li>
          <li><strong>a는 append(덧붙이기)</strong>의 약자입니다. 원본을 지키면서 추가할 때 씁니다.</li>
          <li><strong>open만 하고 close를 안 하면?</strong> 편집하던 내용이 저장되지 않고 날아갈 수 있어요.</li>
        </ul>
      </div>
    </div>
  );
};

export default ConceptTab;
