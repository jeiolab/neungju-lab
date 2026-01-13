import React, { useState } from 'react';
import { SCENARIOS } from '../constants';
import { CryptoMethod, Scenario, SimulationResult } from '../types';
import { evaluateDecision } from '../utils';
import { Play, RotateCcw, ShieldCheck, Zap, KeyRound } from 'lucide-react';

interface Props {
  onComplete: (result: SimulationResult) => void;
}

const SimulationTab: React.FC<Props> = ({ onComplete }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [sliders, setSliders] = useState({ speed: 5, security: 5, management: 5 });
  const [result, setResult] = useState<SimulationResult | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleSliderChange = (key: keyof typeof sliders, value: number) => {
    setSliders(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectMethod = (method: CryptoMethod) => {
    const simResult = evaluateDecision(scenario, method, sliders);
    setResult(simResult);
    onComplete(simResult);
  };

  const reset = () => {
    setResult(null);
    setSliders({ speed: 5, security: 5, management: 5 });
  };

  if (result) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
        <div className={`p-6 text-white ${result.score >= 80 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}>
          <h2 className="text-2xl font-bold mb-1">적합도 점수: {result.score}점</h2>
          <p className="opacity-90">{result.score >= 80 ? '훌륭한 선택입니다!' : '조금 더 고민이 필요합니다.'}</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">📋 피드백 리포트</h3>
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
              <p className="flex gap-2">
                <span className="text-blue-600 font-bold min-w-[4rem]">Good:</span>
                <span>{result.feedback.pro}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-red-500 font-bold min-w-[4rem]">Cost:</span>
                <span>{result.feedback.con}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-emerald-600 font-bold min-w-[4rem]">Real:</span>
                <span>{result.feedback.reality}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={reset}
            className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            다음 회의 진행하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Scenario Selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">시나리오 선택</label>
        <select 
          value={selectedScenarioId} 
          onChange={(e) => { setSelectedScenarioId(e.target.value); reset(); }}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {SCENARIOS.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-900">
            <h3 className="font-bold mb-1">상황 브리핑</h3>
            <p className="text-sm mb-2">{scenario.description}</p>
            <p className="text-xs font-bold bg-white inline-block px-2 py-1 rounded text-indigo-600">💡 힌트: {scenario.context}</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
           🎚️ 중요도 설정 <span className="text-xs font-normal text-slate-500">(이 상황에서 무엇이 중요한가요?)</span>
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <Zap size={18} className="text-amber-500" /> 속도 (Speed)
              </label>
              <span className="font-bold text-slate-900">{sliders.speed}</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.speed} 
              onChange={(e) => handleSliderChange('speed', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <ShieldCheck size={18} className="text-emerald-500" /> 보안강도 (Security)
              </label>
              <span className="font-bold text-slate-900">{sliders.security}</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.security} 
              onChange={(e) => handleSliderChange('security', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <KeyRound size={18} className="text-blue-500" /> 키 관리 편의성 (Mgmt)
              </label>
              <span className="font-bold text-slate-900">{sliders.management}</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.management} 
              onChange={(e) => handleSliderChange('management', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {Object.values(CryptoMethod).map((method) => (
          <button
            key={method}
            onClick={() => handleSelectMethod(method)}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition text-slate-700 font-bold text-sm md:text-base text-left"
          >
            {method}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SimulationTab;