import React, { useState, useEffect } from 'react';
import { SCENARIOS } from './constants';
import { ScenarioType } from './types';
import SimulationCanvas from './components/SimulationCanvas';
import Quiz from './components/Quiz';
import { LayoutGrid, Terminal, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioType>('temp');
  const [sensorValue, setSensorValue] = useState<number>(0);
  const [showCode, setShowCode] = useState(false);

  // Reset sensor value to a safe default when scenario changes
  useEffect(() => {
    const scenario = SCENARIOS.find(s => s.id === activeScenarioId);
    if (scenario) {
      // Set to a "safe" (inactive) value by default
      if (scenario.logic.operator === '>') {
        setSensorValue(scenario.sensor.min); 
      } else {
        setSensorValue(scenario.sensor.max);
      }
    }
  }, [activeScenarioId]);

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                 <LayoutGrid className="text-white w-5 h-5" />
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                IoT 데이터 흐름 <span className="font-light text-slate-500 hidden sm:inline">시뮬레이터</span>
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowCode(!showCode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${showCode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
             >
                <Terminal className="w-4 h-4" />
                <span className="hidden sm:inline">{showCode ? '코드 숨기기' : '코드 보기'}</span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Intro */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
               IoT는 어떻게 작동할까요?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
               <span className="font-semibold text-blue-600">센서</span>가 데이터를 수집하고, 
               <span className="font-semibold text-purple-600"> 프로세서</span>가 결정을 내리고, 
               <span className="font-semibold text-green-600"> 액추에이터</span>가 행동하는 과정을 탐구해보세요.
            </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenarioId(scenario.id)}
              className={`px-6 py-3 rounded-xl border font-medium transition-all shadow-sm flex items-center gap-2
                ${activeScenarioId === scenario.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 shadow-md ring-2 ring-blue-100 ring-offset-2' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
              <span>{scenario.name}</span>
            </button>
          ))}
        </div>

        {/* Canvas */}
        <SimulationCanvas 
            scenario={activeScenario}
            sensorValue={sensorValue}
            setSensorValue={setSensorValue}
            showCode={showCode}
        />

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">1. 센서 (Sensor)</h3>
                <p className="text-sm text-slate-600">
                    온도, 빛, 소리와 같은 물리적인 데이터를 컴퓨터가 이해할 수 있는 디지털 신호로 변환합니다.
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                 <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                    <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">2. 제어 장치 (Controller)</h3>
                <p className="text-sm text-slate-600">
                    '두뇌' 역할을 하는 마이크로컨트롤러입니다. 설정된 규칙(예: X > Y)에 따라 데이터를 확인하고 판단합니다.
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">3. 액추에이터 (Actuator)</h3>
                <p className="text-sm text-slate-600">
                    신호를 받아 실제로 물리적인 변화(모터 회전, 조명 켜기, 문 열기 등)를 수행합니다.
                </p>
            </div>
        </div>

        {/* Quiz Section */}
        <Quiz />

      </main>
      
      <footer className="mt-20 border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>IoT 인터랙티브 학습 시뮬레이션 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;