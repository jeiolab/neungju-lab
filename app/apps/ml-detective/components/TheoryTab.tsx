import React from 'react';
import { Brain, Database, Shuffle, Search } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-sepia-50 text-ink p-6 rounded-lg shadow-md border-l-4 border-sepia-400">
        <h2 className="font-serif text-2xl font-bold mb-4 flex items-center">
          <Search className="mr-2" /> 수사 지침서: 기계학습의 조건
        </h2>
        <p className="mb-4">
          신입 탐정, 환영하네. 모든 사건이 기계학습으로 해결될 수 있는 건 아니야. 
          우리가 사건을 맡기 전 확인해야 할 <strong>3가지 철칙</strong>을 알려주지.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-900 rounded-full mb-4 text-blue-300">
            <Database size={24} />
          </div>
          <h3 className="text-xl font-bold text-blue-300 mb-2">1. 데이터 (Data)</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            범인을 잡으려면 단서가 필요하듯, 기계학습은 <strong>충분한 양의 데이터</strong>가 필수적이라네. 
            데이터가 없거나 너무 적으면(Few-shot) 학습할 수 없어.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-green-900 rounded-full mb-4 text-green-300">
            <Brain size={24} />
          </div>
          <h3 className="text-xl font-bold text-green-300 mb-2">2. 규칙성 (Pattern)</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            데이터 속에 <strong>숨겨진 패턴</strong>이 있어야 해. 
            입력(원인)과 출력(결과) 사이에 논리적인 인과관계나 상관관계가 존재해야 기계가 배울 수 있지.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-red-900 rounded-full mb-4 text-red-300">
            <Shuffle size={24} />
          </div>
          <h3 className="text-xl font-bold text-red-300 mb-2">3. 무작위성 (Randomness)</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            복권 번호처럼 <strong>완전히 무작위</strong>거나, 예술처럼 정의하기 어려운 <strong>순수 창작</strong>의 영역은 피하게. 
            규칙이 없다면 학습도 없네.
          </p>
        </div>
      </div>

      <div className="bg-sepia-900/50 p-4 rounded text-sm text-sepia-200 text-center italic border border-sepia-800">
        "기계학습은 마법이 아네. 데이터라는 흙 속에서 패턴이라는 진주를 찾는 기술이지."
      </div>
    </div>
  );
};

export default TheoryTab;