import React from 'react';
import { MousePointer2, Wifi, Cloud, Zap, ArrowRight } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">📚</span>
        스마트 홈 데이터 흐름도
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MousePointer2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-700">1. 감지 (Input)</h3>
            <p className="text-sm text-slate-500 mt-1">센서가 변화를<br/>감지합니다.</p>
          </div>

          <ArrowRight className="hidden md:block w-8 h-8 text-slate-300" />

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Wifi className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-700">2. 전송 (Network)</h3>
            <p className="text-sm text-slate-500 mt-1">데이터를<br/>전달합니다.</p>
          </div>

          <ArrowRight className="hidden md:block w-8 h-8 text-slate-300" />

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cloud className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-700">3. 판단 (Process)</h3>
            <p className="text-sm text-slate-500 mt-1">서버/AI가<br/>분석합니다.</p>
          </div>

          <ArrowRight className="hidden md:block w-8 h-8 text-slate-300" />

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-700">4. 실행 (Output)</h3>
            <p className="text-sm text-slate-500 mt-1">액추에이터가<br/>작동합니다.</p>
          </div>

        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2">💡 입력 장치 (Sensor)</h3>
          <p className="text-slate-600 text-sm">
            사람의 오감과 같습니다. 온도를 느끼거나, 소리를 듣거나, 움직임을 봅니다.
            <br/><span className="text-xs text-slate-400">예: 온도 센서, 카메라, 마이크</span>
          </p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2">⚡ 출력 장치 (Actuator)</h3>
          <p className="text-slate-600 text-sm">
            사람의 손발과 같습니다. 실제로 불을 켜거나, 모터를 돌리거나, 소리를 냅니다.
            <br/><span className="text-xs text-slate-400">예: 스마트 전구, 보일러, 스피커</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabTheory;