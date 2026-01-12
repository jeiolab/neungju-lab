import React from 'react';

const InfoRow: React.FC<{ title: string; subtitle: string; desc: string; image: string; reverse?: boolean }> = ({ title, subtitle, desc, image, reverse }) => (
  <div className={`flex flex-col md:flex-row items-center gap-8 py-8 ${reverse ? 'md:flex-row-reverse' : ''}`}>
    <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-xl overflow-hidden shadow-md relative group">
       <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
       <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
    </div>
    <div className="w-full md:w-1/2">
      <span className="text-blue-600 font-bold tracking-wider text-sm">{subtitle}</span>
      <h3 className="text-2xl font-bold text-gray-800 mt-1 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-justify">
        {desc}
      </p>
    </div>
  </div>
);

const MoreInfoTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">농업을 넘어, 세상의 모든 곳으로</h2>
        <p className="text-gray-500 mt-2">디지털 기술(DX)은 농장뿐만 아니라 다양한 산업을 혁신하고 있습니다.</p>
      </div>

      <InfoRow 
        title="스마트 팩토리" 
        subtitle="MANUFACTURING"
        desc="공장의 모든 기계가 인터넷으로 연결되어 있습니다. 주문이 들어오면 자동으로 생산 계획을 세우고, 불량품이 발생하면 AI가 원인을 찾아 즉시 수정합니다. 개인 맞춤형 신발이나 자동차를 빠르게 만들 수 있게 되었습니다."
        image="https://picsum.photos/800/600?grayscale"
      />

      <InfoRow 
        title="디지털 헬스케어" 
        subtitle="HEALTHCARE"
        desc="스마트 워치로 심박수와 활동량을 측정해 의사에게 전송합니다. AI는 MRI 사진을 분석해 의사보다 더 빠르고 정확하게 암을 찾아내기도 합니다. 병원에 가지 않아도 건강을 관리받는 시대입니다."
        image="https://picsum.photos/800/601?grayscale"
        reverse
      />

      <InfoRow 
        title="스마트 시티" 
        subtitle="URBAN LIFE"
        desc="도시 전체가 거대한 유기체처럼 움직입니다. 교통량을 분석해 신호등 주기를 자동으로 조절하여 막힘을 뚫고, 전력 사용량을 예측해 에너지를 절약합니다. 쓰레기통이 꽉 차면 자동으로 수거 차량을 부릅니다."
        image="https://picsum.photos/800/602?grayscale"
      />
    </div>
  );
};

export default MoreInfoTab;