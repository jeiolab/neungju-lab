import React, { useState } from 'react';
import { ERAS } from '../constants';

const TimelineTab: React.FC = () => {
  const [expandedEra, setExpandedEra] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">AI 발전의 흐름</h2>
        <p className="text-slate-600">
          인공지능은 <span className="font-bold text-indigo-600">규칙(Rule)</span>에서 
          <span className="font-bold text-indigo-600"> 데이터(Data)</span> 중심으로 진화해왔습니다.
          각 시대를 클릭하여 상세 내용을 확인하세요.
        </p>
      </div>

      <div className="relative border-l-4 border-indigo-200 ml-4 space-y-8 py-4">
        {ERAS.map((era) => (
          <div key={era.id} className="relative pl-8">
            {/* Timeline Dot */}
            <div 
              className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white cursor-pointer transition-colors ${
                expandedEra === era.id ? 'bg-indigo-600' : 'bg-slate-300 hover:bg-indigo-400'
              }`}
              onClick={() => setExpandedEra(expandedEra === era.id ? null : era.id)}
            ></div>

            {/* Content Card */}
            <div 
              className={`bg-white rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden ${
                expandedEra === era.id 
                  ? 'shadow-lg border-indigo-500 ring-1 ring-indigo-500' 
                  : 'shadow-sm border-slate-200 hover:border-indigo-300'
              }`}
              onClick={() => setExpandedEra(expandedEra === era.id ? null : era.id)}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{era.title}</h3>
                  <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{era.period}</span>
                </div>
                <p className="text-slate-600 mb-3">{era.description}</p>
                <div className="flex flex-wrap gap-2">
                  {era.keywords.map(k => (
                    <span key={k} className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              <div className={`bg-slate-50 px-5 transition-all duration-500 ease-in-out ${
                expandedEra === era.id ? 'max-h-96 py-5 opacity-100 border-t border-slate-100' : 'max-h-0 py-0 opacity-0'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-bold text-slate-700 mb-1">인간의 역할</h4>
                    <p className="text-slate-600 bg-white p-3 rounded border border-slate-200">{era.humanRole}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 mb-1">기술적 초점</h4>
                    <p className="text-slate-600 bg-white p-3 rounded border border-slate-200">{era.techFocus}</p>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <h4 className="font-bold text-slate-700 mb-1">큐레이터 노트</h4>
                    <p className="text-slate-800 leading-relaxed">{era.details}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineTab;
