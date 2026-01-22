import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SIMULATION_SCENARIOS } from '../constants';
import { Info } from 'lucide-react';

const Simulation: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = SIMULATION_SCENARIOS[selectedScenarioIndex];

  const chartData = [
    { name: '원본', size: scenario.originalSize, fill: '#94a3b8' },
    { name: '압축 후', size: scenario.compressedSize, fill: '#10b981' },
  ];

  const reductionRate = Math.round(((scenario.originalSize - scenario.compressedSize) / scenario.originalSize) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-500" /> 압축 효과 실험실
        </h2>
        <p className="text-gray-500 mt-1">파일 종류와 압축 방식에 따른 데이터량 변화를 확인해보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-4">
          <label className="block">
            <span className="text-gray-700 font-semibold mb-2 block">시나리오 선택</span>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              value={selectedScenarioIndex}
              onChange={(e) => setSelectedScenarioIndex(Number(e.target.value))}
            >
              {SIMULATION_SCENARIOS.map((s, idx) => (
                <option key={idx} value={idx}>{s.fileType} + {s.method}</option>
              ))}
            </select>
          </label>

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 space-y-2">
            <p><strong>방식:</strong> {scenario.method}</p>
            <p><strong>설명:</strong> {scenario.description}</p>
            <p><strong>품질 영향:</strong> {scenario.qualityImpact}</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col items-center">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 14}} />
                <Tooltip formatter={(value) => `${value}%`} cursor={{fill: 'transparent'}} />
                <Bar dataKey="size" radius={[0, 10, 10, 0]} barSize={40}>
                   {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-600">데이터 다이어트 결과</p>
            <p className="text-3xl font-bold text-emerald-600 animate-pulse">
               {reductionRate}% 감소!
            </p>
            <p className="text-xs text-gray-400 mt-2">
              * 데이터량이 줄어들면 전송 에너지가 절약되어 탄소 배출이 감소합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;