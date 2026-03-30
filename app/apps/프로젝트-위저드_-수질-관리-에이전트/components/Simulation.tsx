import React, { useState, useEffect } from 'react';
import { Settings, AlertTriangle, CheckCircle, Droplets } from 'lucide-react';

interface SimulationProps {
  onRun: () => void;
}

const Simulation: React.FC<SimulationProps> = ({ onRun }) => {
  const [ph, setPh] = useState<number>(7.0);
  const [turbidity, setTurbidity] = useState<number>(10);
  
  const [phThresholdLow, setPhThresholdLow] = useState<number>(6.5);
  const [phThresholdHigh, setPhThresholdHigh] = useState<number>(8.5);
  const [turbidityThreshold, setTurbidityThreshold] = useState<number>(50);
  
  const [actionMode, setActionMode] = useState<'notify' | 'shutoff'>('notify');
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'safe' | 'danger'>('safe');

  const runSimulation = () => {
    onRun();
    let isDanger = false;
    let messages = [];

    if (ph < phThresholdLow || ph > phThresholdHigh) {
      isDanger = true;
      messages.push(`pH 수치(${ph})가 안전 범위(${phThresholdLow}-${phThresholdHigh})를 벗어났습니다.`);
    }

    if (turbidity > turbidityThreshold) {
      isDanger = true;
      messages.push(`탁도(${turbidity} NTU)가 허용치(${turbidityThreshold} NTU)를 초과했습니다.`);
    }

    if (isDanger) {
      setStatus('danger');
      if (actionMode === 'notify') {
        setResult(`⚠️ 경보: ${messages.join(' ')} 관리자에게 알림을 전송했습니다.`);
      } else {
        setResult(`🚫 행동 실행: ${messages.join(' ')} 유입 밸브를 자동으로 차단했습니다.`);
      }
    } else {
      setStatus('safe');
      setResult("✅ 시스템 정상: 수질이 안전 범위 내에 있습니다. 별도 조치 없음.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
           <Settings className="w-5 h-5 text-blue-600" />
           에이전트 설정 (규칙 정하기)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Threshold Controls */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">임계값(Threshold) 설정</h3>
            
            <div>
              <label className="text-sm text-slate-600 block mb-1">최대 탁도 (NTU): {turbidityThreshold}</label>
              <input 
                type="range" min="0" max="200" step="5"
                value={turbidityThreshold} onChange={(e) => setTurbidityThreshold(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-slate-600 block mb-1">최소 pH: {phThresholdLow}</label>
                <input 
                  type="number" step="0.1"
                  value={phThresholdLow} onChange={(e) => setPhThresholdLow(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-slate-600 block mb-1">최대 pH: {phThresholdHigh}</label>
                <input 
                  type="number" step="0.1"
                  value={phThresholdHigh} onChange={(e) => setPhThresholdHigh(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Mode */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">액추에이터 작동 방식 선택</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setActionMode('notify')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors ${actionMode === 'notify' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
              >
                🔔 알림만 발송
              </button>
              <button 
                onClick={() => setActionMode('shutoff')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors ${actionMode === 'shutoff' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600'}`}
              >
                🛑 자동 차단
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              "알림만 발송"은 인간의 개입이 필요합니다. "자동 차단"은 에이전트의 자율적인 물리적 행동입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Environment Simulation */}
      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
           <Droplets className="w-5 h-5 text-cyan-600" />
           환경 데이터 시뮬레이션
        </h2>
        <p className="text-sm text-slate-600 mb-6">실제 강물의 상태를 변경하여 에이전트가 어떻게 반응하는지 테스트해보세요.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
           <div className="bg-white p-4 rounded-lg shadow-sm">
             <label className="block font-semibold mb-2 text-blue-900">현재 탁도: {turbidity} NTU</label>
             <input 
                type="range" min="0" max="200"
                value={turbidity} onChange={(e) => setTurbidity(Number(e.target.value))}
                className="w-full accent-cyan-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>맑음</span>
                <span>혼탁함</span>
              </div>
           </div>

           <div className="bg-white p-4 rounded-lg shadow-sm">
             <label className="block font-semibold mb-2 text-purple-900">현재 pH 수치: {ph}</label>
             <input 
                type="range" min="0" max="14" step="0.1"
                value={ph} onChange={(e) => setPh(Number(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>산성 (0)</span>
                <span>중성 (7)</span>
                <span>염기성 (14)</span>
              </div>
           </div>
        </div>

        <button 
          onClick={runSimulation}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transform active:scale-95 transition-all"
        >
          에이전트 실행 (Run Cycle)
        </button>
      </div>

      {/* Result Output */}
      {result && (
        <div className={`p-6 rounded-xl border-l-8 animate-fadeIn ${status === 'danger' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-green-50 border-green-500 text-green-900'}`}>
          <div className="flex items-start gap-3">
            {status === 'danger' ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
            <div>
              <h3 className="font-bold text-lg">{status === 'danger' ? '조치 발동' : '모니터링 중'}</h3>
              <p className="mt-1">{result}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;