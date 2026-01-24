import React from 'react';
import { DEEP_DIVE_CONTENT } from '../constants';
import { BookOpen } from 'lucide-react';

const TabDeepDive: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">수석 탐정을 위한 심화 자료</h2>
        <p className="text-slate-600">교과서 밖의 최신 IoT 트렌드를 파악하고 지식을 확장해보세요.</p>
      </div>

      {DEEP_DIVE_CONTENT.map((item, idx) => (
        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
          </div>
          <p className="text-slate-700 leading-8 whitespace-pre-wrap">
            {item.content}
          </p>
        </div>
      ))}

      <div className="bg-slate-800 text-white p-6 rounded-2xl mt-8">
        <h3 className="font-bold text-lg mb-2">🔎 탐정의 메모</h3>
        <p className="text-slate-300 text-sm">
          사물 인터넷은 4차 산업혁명의 핵심 기술입니다. 단순히 기계를 연결하는 것을 넘어, 생성된 데이터를 AI로 분석하여 새로운 가치를 창출하는 것이 미래의 방향입니다.
        </p>
      </div>
    </div>
  );
};

export default TabDeepDive;