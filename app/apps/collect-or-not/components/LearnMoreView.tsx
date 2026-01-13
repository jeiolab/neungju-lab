import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const FLASHCARDS = [
  { title: "설문조사 (Survey)", pros: "사람의 내면(의견, 감정) 파악 가능", cons: "거짓 응답 가능성, 설문 설계 어려움" },
  { title: "센서 (Sensor)", pros: "24시간 자동 수집, 정확한 수치 데이터", cons: "장비 비용 발생, 고장/오류 가능성" },
  { title: "관찰 (Observation)", pros: "자연스러운 행동 패턴 파악 가능", cons: "관찰자의 주관 개입 가능성, 시간 소요" },
  { title: "공유 데이터 (Shared)", pros: "비용/시간 절약, 방대한 과거 데이터", cons: "내 목적에 딱 맞는 데이터가 없을 수 있음" },
  { title: "웹 수집 (Crawling)", pros: "최신 트렌드, 방대한 텍스트/이미지", cons: "저작권 문제, 사이트 구조 변경 시 오류" },
];

export const LearnMoreView: React.FC = () => {
  return (
    <div className="p-4 h-full overflow-y-auto pb-24 max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">수집 방법별 장단점</h2>
      {FLASHCARDS.map((card, idx) => (
        <FlipCard key={idx} data={card} />
      ))}
    </div>
  );
};

const FlipCard: React.FC<{ data: { title: string, pros: string, cons: string } }> = ({ data }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      onClick={() => setFlipped(!flipped)}
      className="h-32 perspective cursor-pointer group"
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute w-full h-full bg-white rounded-xl shadow-md border border-indigo-100 p-6 flex items-center justify-between backface-hidden">
          <h3 className="text-lg font-bold text-indigo-900">{data.title}</h3>
          <ChevronRight className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </div>
        
        {/* Back */}
        <div className="absolute w-full h-full bg-indigo-600 rounded-xl shadow-md p-4 flex flex-col justify-center text-white rotate-y-180 backface-hidden">
           <div className="text-sm mb-1"><span className="font-bold text-green-300">장점:</span> {data.pros}</div>
           <div className="text-sm"><span className="font-bold text-red-300">단점:</span> {data.cons}</div>
        </div>
      </div>
    </div>
  );
};