import React from 'react';
import { Layers, Activity, Smartphone, RefreshCw } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in p-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
          <Layers className="mr-2 text-indigo-600" />
          디지털 트윈(Digital Twin)이란?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          디지털 트윈은 <strong className="text-indigo-600">현실 세계의 사물, 시스템, 환경 등을 가상 공간에 똑같이 구현(쌍둥이)</strong>한 것을 말합니다.
          단순한 3D 모델링을 넘어, 현실의 데이터를 실시간으로 동기화하여 시뮬레이션하고 결과를 예측하는 기술입니다.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center text-center p-4 bg-indigo-50 rounded-xl">
            <div className="bg-white p-3 rounded-full shadow-md mb-3">
              <Smartphone className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">1. 현실 (Physical)</h3>
            <p className="text-sm text-slate-600">실제 농장의 센서에서 온도, 습도, 가축 상태 데이터를 수집합니다.</p>
          </div>
          
          <div className="flex flex-col items-center justify-center">
             <RefreshCw className="w-10 h-10 text-slate-400 animate-spin-slow" />
             <span className="text-xs font-bold text-slate-500 mt-2">실시간 데이터 동기화</span>
          </div>

          <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-xl">
            <div className="bg-white p-3 rounded-full shadow-md mb-3">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">2. 가상 (Virtual)</h3>
            <p className="text-sm text-slate-600">컴퓨터 속 가상 농장에서 다양한 상황을 시뮬레이션하고 문제를 예측합니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">왜 농장에 필요할까요?</h3>
        <ul className="space-y-4">
            <li className="flex items-start">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold mr-3 mt-1">예방</span>
                <p className="text-slate-600">질병이 확산되거나 기기가 고장 나기 전에 미리 징후를 발견할 수 있습니다.</p>
            </li>
            <li className="flex items-start">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-bold mr-3 mt-1">실험</span>
                <p className="text-slate-600">실제 돼지에게 위험할 수 있는 환경 변화(온도 조절 등)를 가상에서 안전하게 실험해 볼 수 있습니다.</p>
            </li>
            <li className="flex items-start">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-bold mr-3 mt-1">최적화</span>
                <p className="text-slate-600">데이터를 분석하여 사료량, 에너지를 효율적으로 관리해 생산성을 극대화합니다.</p>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default TabTheory;