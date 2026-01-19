import React, { useState } from 'react';
import { Save } from 'lucide-react';

const Reflection: React.FC = () => {
  const [reflection1, setReflection1] = useState('');
  const [reflection2, setReflection2] = useState('');

  const handleSave = () => {
    localStorage.setItem('water_agent_reflection', JSON.stringify({ r1: reflection1, r2: reflection2 }));
    alert("성찰 내용이 저장되었습니다!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-purple-500">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">비판적 사고: "실패" 시나리오 생각하기</h2>
        <p className="text-slate-600 mb-6">
          에이전트를 설계하는 것은 잘 작동할 때뿐만 아니라, 잘못될 상황을 대비하는 것도 중요합니다.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              1. "오탐 (False Positive - 제1종 오류)" 상황을 생각해보세요.
            </label>
            <p className="text-sm text-slate-500 mb-2">
              상황: 물은 깨끗한데, 에이전트가 경보를 울렸습니다. 원인이 무엇일까요? (예: 센서의 오작동, 공기 방울, 일시적 오류 등)
            </p>
            <textarea 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all"
              rows={4}
              value={reflection1}
              onChange={(e) => setReflection1(e.target.value)}
              placeholder="센서가 무엇을 잘못 감지했을까요?"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">
              2. "미탐 (False Negative - 제2종 오류)" 상황을 생각해보세요.
            </label>
            <p className="text-sm text-slate-500 mb-2">
              상황: 물이 위험하게 오염되었는데, 에이전트가 침묵하고 있습니다. 왜 그럴까요? (예: 임계값이 너무 높음, 전원 차단, 센서 위치 잘못됨 등)
            </p>
            <textarea 
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all"
              rows={4}
              value={reflection2}
              onChange={(e) => setReflection2(e.target.value)}
              placeholder="오염 물질이 어떻게 센서를 피해갔을까요?"
            />
          </div>

          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            <Save className="w-4 h-4" /> 성찰 내용 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reflection;