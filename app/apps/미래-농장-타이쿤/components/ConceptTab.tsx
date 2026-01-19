import React from 'react';

const ConceptCard: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <div className="text-gray-600 leading-relaxed text-sm">
      {children}
    </div>
  </div>
);

const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">스마트 팜이란 무엇일까요?</h2>
        <p className="text-gray-600">
          비닐하우스나 축사에 ICT(정보통신기술)를 접목하여 
          원격·자동으로 작물과 가축의 생육 환경을 적절하게 유지·관리할 수 있는 농장을 말합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ConceptCard title="IoT 센서" icon="📡">
          <p>
            온도, 습도, CO2 농도 등을 측정하는 센서를 설치합니다. 
            이 센서들은 마치 인간의 눈과 피부처럼 농장의 상태를 24시간 감지하여 데이터를 수집합니다.
          </p>
        </ConceptCard>

        <ConceptCard title="빅데이터 & 클라우드" icon="☁️">
          <p>
            수집된 데이터는 클라우드(인터넷 저장소)에 모입니다.
            과거의 데이터와 비교 분석하여 "언제 밥을 줘야 살이 잘 찌는지", "언제 병에 걸리기 쉬운지" 패턴을 찾아냅니다.
          </p>
        </ConceptCard>

        <ConceptCard title="AI 제어" icon="🤖">
          <p>
            분석된 데이터를 바탕으로 AI가 판단합니다.
            "지금 너무 더우니 환풍기를 틀어라", "돼지가 아파 보이니 주인에게 알람을 보내라" 등
            스스로 환경을 제어합니다.
          </p>
        </ConceptCard>
      </div>

      <div className="bg-emerald-600 text-white p-8 rounded-2xl shadow-lg mt-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-3">왜 필요할까요?</h3>
          <ul className="list-disc list-inside space-y-2 opacity-90">
            <li>농촌 인구 감소와 고령화로 인한 <strong>노동력 부족 해결</strong></li>
            <li>데이터 기반 정밀 관리로 <strong>생산성 향상</strong></li>
            <li>전염병 차단 및 가축 복지 향상</li>
          </ul>
        </div>
        <div className="w-full md:w-1/3 bg-white/20 p-4 rounded-xl backdrop-blur-sm text-center">
            <div className="text-5xl mb-2">📱 + 🐖</div>
            <p className="font-bold">스마트폰으로 농장 관리!</p>
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;