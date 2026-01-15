import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';

const ExploreTab: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('relation');

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Relationship Diagram */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button 
            onClick={() => toggleSection('relation')}
            className="w-full p-4 flex justify-between items-center bg-gray-50 font-bold text-gray-800"
        >
            <span>AI {'>'} ML {'>'} DL 포함 관계</span>
            {expandedSection === 'relation' ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
        </button>
        
        {expandedSection === 'relation' && (
            <div className="p-6 flex justify-center">
                {/* CSS Circle Diagram */}
                <div className="relative w-64 h-64 bg-blue-100 rounded-full flex flex-col items-center pt-4 shadow-inner border-2 border-blue-200">
                    <span className="font-bold text-blue-800">인공지능 (AI)</span>
                    <div className="absolute top-12 w-48 h-48 bg-green-100 rounded-full flex flex-col items-center pt-4 shadow-md border-2 border-green-200">
                        <span className="font-bold text-green-800">기계학습 (ML)</span>
                        <div className="absolute top-12 w-32 h-32 bg-purple-100 rounded-full flex justify-center items-center shadow-md border-2 border-purple-200">
                            <span className="font-bold text-purple-800 text-center text-sm">딥러닝<br/>(Deep Learning)</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* 2. Use Cases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
            { title: "넷플릭스 추천", type: "비지도/지도 혼합", desc: "내가 본 영화와 비슷한 취향을 가진 사람들을 군집화하여 영화를 추천함." },
            { title: "스팸 메일 필터", type: "지도학습(분류)", desc: "수많은 메일 데이터와 '스팸/정상' 라벨을 학습해 자동으로 걸러냄." },
            { title: "알파고 바둑", type: "강화학습", desc: "승리라는 보상을 위해 수많은 대국(시뮬레이션)을 두며 전략을 수정함." },
            { title: "주식 가격 예측", type: "지도학습(회귀)", desc: "과거의 가격 추이를 바탕으로 내일의 가격(숫자)을 예측함." }
        ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-500 rounded">{item.type}</span>
                </div>
                <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
        ))}
      </div>

      {/* Mini Quiz */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
            <Zap className="text-yellow-300 fill-current" />
            <h3 className="font-bold text-lg">돌발 퀴즈!</h3>
        </div>
        <p className="mb-4 text-indigo-100">자율주행 자동차가 표지판을 인식해서 '멈춤'인지 '직진'인지 판단하는 건 어떤 학습일까요?</p>
        <details className="group">
            <summary className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded text-center font-bold list-none select-none transition-colors">
                정답 보기
            </summary>
            <div className="mt-3 bg-white text-gray-800 p-3 rounded shadow-lg animate-fadeIn">
                <p className="font-bold mb-1">정답: 지도학습 (분류)</p>
                <p className="text-sm text-gray-600">
                    표지판 이미지(입력)에 대해 어떤 표지판인지 정답(레이블)을 미리 학습해야 하므로 지도학습이며, 
                    정해진 종류 중 하나를 고르므로 분류입니다.
                </p>
            </div>
        </details>
      </div>
    </div>
  );
};

export default ExploreTab;
