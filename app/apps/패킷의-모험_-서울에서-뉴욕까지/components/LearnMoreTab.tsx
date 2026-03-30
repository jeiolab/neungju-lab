import React from 'react';
import { Globe2, Anchor } from 'lucide-react';

const LearnMoreTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Submarine Cables */}
      <section className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Anchor className="text-blue-500" />
            해저 광케이블 지도
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
             인터넷은 구름(Cloud) 위에 있는 것이 아니라, 차가운 바다 밑에 있습니다. 전 세계 데이터 트래픽의 99%는 해저 광케이블을 통해 이동합니다.
             상어의 공격을 막기 위해 특수 코팅이 되어 있으며, 머리카락만큼 얇은 유리 섬유를 통해 빛의 속도로 정보를 보냅니다.
          </p>
          <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-300 shadow-inner">
             {/* Simple Visualization Placeholder */}
             <div className="absolute inset-0 opacity-30 bg-[url('https://picsum.photos/800/400?grayscale')] bg-cover bg-center"></div>
             <div className="z-10 text-center">
                <Globe2 size={48} className="mx-auto text-blue-400 mb-2 animate-pulse" />
                <p className="text-xs text-blue-200">Global Submarine Cable Network Visualization</p>
             </div>
             {/* Decorative lines representing cables */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
               <path d="M 100 200 Q 400 50 700 300" stroke="#60a5fa" strokeWidth="2" fill="none" className="animate-[dash_5s_linear_infinite]" strokeDasharray="10,10"/>
               <path d="M 50 100 Q 300 300 750 150" stroke="#60a5fa" strokeWidth="2" fill="none" className="animate-[dash_7s_linear_infinite]" strokeDasharray="10,10"/>
             </svg>
          </div>
        </div>
      </section>

      {/* TLD Info */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">국가 최상위 도메인 (ccTLD)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {[
             { code: '.kr', country: '대한민국' },
             { code: '.jp', country: '일본' },
             { code: '.cn', country: '중국' },
             { code: '.us', country: '미국' },
             { code: '.uk', country: '영국' },
             { code: '.de', country: '독일' },
             { code: '.fr', country: '프랑스' },
             { code: '.tv', country: '투발루(방송용으로 인기)' },
           ].map((item, idx) => (
             <div key={idx} className="bg-slate-50 p-3 rounded-lg text-center hover:bg-slate-100 transition-colors border border-slate-100 hover:border-blue-300">
               <span className="text-blue-600 font-bold block text-lg">{item.code}</span>
               <span className="text-slate-500 text-xs">{item.country}</span>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default LearnMoreTab;