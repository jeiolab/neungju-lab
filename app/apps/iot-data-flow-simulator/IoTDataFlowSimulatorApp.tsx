'use client'

import React, { useState, useEffect } from 'react';
import { SCENARIOS } from './constants';
import { ScenarioType } from './types';
import SimulationCanvas from './components/SimulationCanvas';
import Quiz from './components/Quiz';
import { LayoutGrid, Terminal, Info } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const IoTDataFlowSimulatorApp: React.FC = () => {
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
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-6 pb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setActiveScenarioId('temp');
                  setShowCode(false);
                }} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">IoT 시뮬레이터</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">IoT 시스템의 데이터 흐름(센서에서 처리 논리, 물리적 제어 장치까지)을 시각화하는 인터랙티브 교육 시뮬레이션입니다.</p>
                </div>
              </button>
              
              <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setShowCode(!showCode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${showCode ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                 >
                    <Terminal className="w-4 h-4" />
                    <span className="hidden sm:inline">{showCode ? '코드 숨기기' : '코드 보기'}</span>
                 </button>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Intro */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
               IoT는 어떻게 작동할까요?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
               <span className="font-semibold text-blue-600">센서</span>가 데이터를 수집하고, 
               <span className="font-semibold text-blue-600"> 프로세서</span>가 결정을 내리고, 
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
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
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
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">1. 센서 (Sensor)</h3>
                <p className="text-sm text-slate-600">
                    온도, 빛, 소리와 같은 물리적인 데이터를 컴퓨터가 이해할 수 있는 디지털 신호로 변환합니다.
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">2. 제어 장치 (Controller)</h3>
                <p className="text-sm text-slate-600">
                    '두뇌' 역할을 하는 마이크로컨트롤러입니다. 설정된 규칙(예: X {'>'} Y)에 따라 데이터를 확인하고 판단합니다.
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">3. 액추에이터 (Actuator)</h3>
                <p className="text-sm text-slate-600">
                    신호를 받아 실제로 물리적인 변화(모터 회전, 조명 켜기, 문 열기 등)를 수행합니다.
                </p>
            </div>
        </div>

            {/* Quiz Section */}
            <Quiz />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IoTDataFlowSimulatorApp;