import React from 'react';
import { ArrowRight, Wifi, Server, Cpu, Settings } from 'lucide-react';

const TabTech: React.FC = () => {
  return (
    <div className="p-4 space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">스마트팜 & 디지털 트윈 작동 원리</h2>
        <p className="text-slate-600">데이터가 어떻게 수집되고 현실을 제어하는지 흐름을 확인해보세요.</p>
      </div>

      <div className="relative">
        {/* Connection Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          
          {/* Step 1: Sensors */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
              <Wifi size={32} />
            </div>
            <h3 className="font-bold text-lg text-slate-800">1. IoT 센서</h3>
            <p className="text-sm text-slate-500 mt-2">
              축사의 온도, 습도, CO2, 가축의 움직임 등을 실시간으로 감지하여 디지털 데이터로 변환합니다.
            </p>
          </div>

          {/* Step 2: Cloud/Big Data */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <Server size={32} />
            </div>
            <h3 className="font-bold text-lg text-slate-800">2. 클라우드 & 빅데이터</h3>
            <p className="text-sm text-slate-500 mt-2">
              수집된 방대한 데이터를 서버에 저장하고, 과거 데이터와 비교 분석하여 패턴을 찾습니다.
            </p>
          </div>

          {/* Step 3: AI Analysis (Digital Twin) */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 ring-2 ring-indigo-500 ring-offset-2">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
              <Cpu size={32} />
            </div>
            <h3 className="font-bold text-lg text-slate-800">3. AI & 디지털 트윈</h3>
            <p className="text-sm text-slate-500 mt-2">
              가상 모델에서 시뮬레이션을 돌려 최적의 환경 값을 계산하고 질병을 예측합니다.
            </p>
          </div>

          {/* Step 4: Actuator */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <Settings size={32} />
            </div>
            <h3 className="font-bold text-lg text-slate-800">4. 액추에이터 제어</h3>
            <p className="text-sm text-slate-500 mt-2">
              분석 결과에 따라 자동으로 환풍기를 켜거나, 사료 양을 조절하여 현실을 최적화합니다.
            </p>
          </div>

        </div>
      </div>

      <div className="mt-12 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-lg mb-4 text-center">💡 피드백 루프 (Feedback Loop)</h3>
        <p className="text-center text-slate-600 max-w-2xl mx-auto">
          이 모든 과정은 <strong>순환</strong>합니다. 제어 후 변경된 환경은 다시 센서에 의해 감지되고, 
          데이터는 다시 분석되어 끊임없이 농장을 최적의 상태로 유지합니다.
        </p>
        <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2 text-slate-400">
                <span>감지</span>
                <ArrowRight size={16}/>
                <span>분석</span>
                <ArrowRight size={16}/>
                <span>예측</span>
                <ArrowRight size={16}/>
                <span>제어</span>
                <ArrowRight size={16}/>
                <span>(다시 감지)</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TabTech;