import React from 'react';
import { CONCEPTS } from '../constants';

const FeaturesTab: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
          미래 사회 3대 키워드
        </h2>
        <p className="text-slate-400">우리가 맞이할 세상은 이 세 가지로 정의됩니다.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {CONCEPTS.map((concept, index) => {
          const Icon = concept.icon;
          return (
            <div 
              key={index} 
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 shadow-lg"
            >
              <div className={`mb-4 ${concept.color}`}>
                <Icon size={48} strokeWidth={1.5} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${concept.color}`}>
                {concept.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {concept.desc}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
        <h4 className="text-lg font-semibold text-white mb-2">💡 미래학자의 한마디</h4>
        <p className="text-slate-400 text-sm">
          "기술은 독립적으로 발전하지 않습니다. <span className="text-cyan-400">연결</span>되고, <span className="text-fuchsia-400">지능화</span>되며, 결국 하나로 <span className="text-emerald-400">융합</span>됩니다. 이 흐름을 이해하는 것이 미래를 준비하는 첫걸음입니다."
        </p>
      </div>
    </div>
  );
};

export default FeaturesTab;