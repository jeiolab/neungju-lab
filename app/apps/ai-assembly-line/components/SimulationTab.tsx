import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calculator } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [engineSize, setEngineSize] = useState<number>(2.0);
  
  // Linear Regression Model Simulation: CO2 = 20 * EngineSize + 100
  // e.g., 2.0L -> 140g/km
  const slope = 20;
  const intercept = 100;
  
  const calculatedEmission = Math.round(slope * engineSize + intercept);
  
  // Generate dummy dataset for visualization
  const data = [
    { x: 1.0, y: 125 },
    { x: 1.4, y: 132 },
    { x: 1.6, y: 135 },
    { x: 2.0, y: 145 },
    { x: 2.4, y: 150 },
    { x: 3.0, y: 165 },
    { x: 3.5, y: 175 },
    { x: 4.0, y: 180 },
    { x: 5.0, y: 205 },
  ];

  // The point the user is predicting
  const userPoint = [{ x: engineSize, y: calculatedEmission }];

  return (
    <div className="h-full bg-white p-6 rounded-lg shadow-inner flex flex-col md:flex-row gap-8 overflow-y-auto">
      {/* Controls & Explanation */}
      <div className="md:w-1/3 flex flex-col">
        <h2 className="text-2xl font-bold text-factory-800 mb-4 flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          실전 예측 시뮬레이터
        </h2>
        <p className="text-factory-600 mb-6">
          완성된 '탄소 배출량 예측 모델(회귀)'을 테스트합니다.<br/>
          <strong>선형 회귀 공식:</strong> <code className="bg-slate-100 px-1 rounded text-red-600 font-mono">y = {slope}x + {intercept}</code>
        </p>

        <div className="bg-factory-50 p-6 rounded-xl border border-factory-200 shadow-sm">
          <label className="block text-sm font-bold text-factory-700 mb-2">
            자동차 엔진 크기 (L)
          </label>
          <div className="flex items-center gap-4 mb-4">
            <input 
              type="range" 
              min="0.8" 
              max="6.0" 
              step="0.1" 
              value={engineSize} 
              onChange={(e) => setEngineSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-factory-700"
            />
            <span className="font-mono font-bold text-lg w-16 text-right">{engineSize.toFixed(1)}L</span>
          </div>

          <div className="mt-8 text-center">
            <div className="text-xs text-factory-500 uppercase tracking-wider font-bold mb-1">예측된 탄소 배출량</div>
            <div className="text-4xl font-black text-factory-800 transition-all">
              {calculatedEmission} <span className="text-lg font-medium text-factory-500">g/km</span>
            </div>
            
            <div className={`mt-4 text-sm font-bold px-3 py-1 rounded inline-block
              ${calculatedEmission < 140 ? 'bg-green-100 text-green-700' : calculatedEmission < 180 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
            `}>
              {calculatedEmission < 140 ? '친환경 등급 🌱' : calculatedEmission < 180 ? '일반 등급 🚗' : '고배출 등급 🏭'}
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[300px]">
        <h3 className="text-center font-bold text-slate-500 mb-2">데이터 분포 및 회귀선</h3>
        <ResponsiveContainer width="100%" height="90%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="배기량" unit="L" domain={[0, 7]} />
            <YAxis type="number" dataKey="y" name="CO2" unit="g" domain={[0, 250]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Historical Data */}
            <Scatter name="학습 데이터" data={data} fill="#94a3b8" />
            
            {/* The Regression Line (Idealized) */}
            <ReferenceLine 
              segment={[{ x: 0, y: intercept }, { x: 7, y: slope * 7 + intercept }]} 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              label="예측 모델"
            />

            {/* User Prediction Point */}
            <Scatter name="현재 예측" data={userPoint} fill="#2563eb" shape="star" r={10} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimulationTab;