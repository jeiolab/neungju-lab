import React, { useState } from 'react';
import { ROBOT_COMPONENTS } from '../constants';
import { Cpu, Eye, Settings, Fan, Info } from 'lucide-react';

const TabTheory: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Radar': return <Eye className="w-8 h-8 text-blue-500" />;
      case 'Settings': return <Settings className="w-8 h-8 text-gray-600" />;
      case 'Cpu': return <Cpu className="w-8 h-8 text-purple-500" />;
      case 'Fan': return <Fan className="w-8 h-8 text-teal-500" />;
      default: return <Info />;
    }
  };

  const getActiveDetail = () => ROBOT_COMPONENTS.find(c => c.id === selectedComponent);

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Interactive Diagram Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <h3 className="text-xl font-bold text-slate-800 mb-8 absolute top-6 left-6">
          로봇 청소기 구조도 (클릭해보세요)
        </h3>
        
        {/* Simplified Robot Visualization */}
        <div className="relative w-80 h-80">
          {/* Main Body */}
          <div className="absolute inset-0 bg-slate-100 rounded-full border-4 border-slate-300 shadow-xl flex items-center justify-center">
            
            {/* Lidar (Top) */}
            <button 
              onClick={() => setSelectedComponent('lidar')}
              className={`absolute top-4 p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-all transform hover:scale-110 border-2 ${selectedComponent === 'lidar' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-blue-300'}`}
              title="LiDAR Sensor"
            >
              <Eye className="w-6 h-6 text-blue-600" />
            </button>

            {/* CPU (Center) */}
            <button 
              onClick={() => setSelectedComponent('mcu')}
              className={`z-10 p-4 rounded-lg bg-purple-100 hover:bg-purple-200 transition-all transform hover:scale-110 border-2 ${selectedComponent === 'mcu' ? 'border-purple-500 ring-4 ring-purple-100' : 'border-purple-300'}`}
              title="MCU / AI Chip"
            >
              <Cpu className="w-10 h-10 text-purple-600" />
            </button>

            {/* Suction (Bottom Center) */}
            <button 
              onClick={() => setSelectedComponent('suction')}
              className={`absolute bottom-8 p-3 rounded-full bg-teal-100 hover:bg-teal-200 transition-all transform hover:scale-110 border-2 ${selectedComponent === 'suction' ? 'border-teal-500 ring-4 ring-teal-100' : 'border-teal-300'}`}
              title="Suction Motor"
            >
              <Fan className="w-6 h-6 text-teal-600" />
            </button>

            {/* Wheels (Left & Right) */}
            <button 
              onClick={() => setSelectedComponent('wheel')}
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-r-lg bg-gray-200 hover:bg-gray-300 transition-all border-2 ${selectedComponent === 'wheel' ? 'border-gray-500' : 'border-gray-400'}`}
            >
              <Settings className="w-6 h-6 text-gray-700 animate-spin-slow" />
            </button>
             <button 
              onClick={() => setSelectedComponent('wheel')}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-l-lg bg-gray-200 hover:bg-gray-300 transition-all border-2 ${selectedComponent === 'wheel' ? 'border-gray-500' : 'border-gray-400'}`}
            >
              <Settings className="w-6 h-6 text-gray-700 animate-spin-slow" />
            </button>
          </div>
          
          {/* Decorative pulse when nothing selected */}
          {!selectedComponent && (
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse-slow pointer-events-none"></div>
          )}
        </div>
        <p className="mt-8 text-slate-500 text-sm">부품을 클릭하여 지능 에이전트의 구성 요소를 확인하세요.</p>
      </div>

      {/* Info Panel */}
      <div className="w-full md:w-80 bg-slate-50 border-l border-slate-200 p-6 flex flex-col">
        {selectedComponent ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              {renderIcon(getActiveDetail()?.iconName || '')}
              <h2 className="text-xl font-bold text-slate-800">{getActiveDetail()?.title}</h2>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-slate-600 leading-relaxed">
              {getActiveDetail()?.description}
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-slate-700 mb-2">에이전트 관점:</h4>
              <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md text-sm font-medium">
                {selectedComponent === 'lidar' && '[인식] 단계: 주변 환경 데이터를 수집합니다.'}
                {selectedComponent === 'mcu' && '[판단] 단계: 수집된 데이터를 분석하고 규칙을 적용합니다.'}
                {selectedComponent === 'wheel' && '[행동] 단계: 결정된 방향으로 이동합니다.'}
                {selectedComponent === 'suction' && '[행동] 단계: 목표물(먼지)을 제거하여 상태를 변경합니다.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
            <Info className="w-12 h-12 mb-4 opacity-20" />
            <p>왼쪽 로봇의 부품을 클릭하면<br/>상세 설명이 나타납니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabTheory;
