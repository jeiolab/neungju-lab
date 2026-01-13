import React, { useState, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, RotateCcw, Info } from 'lucide-react';
import { DataPoint, SimulationMode, RegressionResult } from '../types';
import { generateDataset, trainModel } from '../services/mathUtils';

interface SimulationTabProps {
  onCompleteMission: (metric: number) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onCompleteMission }) => {
  const [mode, setMode] = useState<SimulationMode>(SimulationMode.SCORE);
  const [dataCount, setDataCount] = useState(30);
  const [outlierRatio, setOutlierRatio] = useState(0.0);
  const [dataset, setDataset] = useState<DataPoint[]>([]);
  const [model, setModel] = useState<RegressionResult | null>(null);
  
  // Inputs for prediction
  const [inputStudy, setInputStudy] = useState(5);
  const [inputSleep, setInputSleep] = useState(7);
  const [inputAbsence, setInputAbsence] = useState(0);
  const [inputKwh, setInputKwh] = useState(250);

  // Generate Data & Train
  const runSimulation = () => {
    const newData = generateDataset(mode, dataCount, outlierRatio);
    setDataset(newData);
    const result = trainModel(newData, mode);
    setModel(result);

    // Check for mission (simple logic: decent RMSE)
    if (result.rmse < 8) {
      onCompleteMission(result.rmse);
    }
  };

  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, dataCount, outlierRatio]);

  // Calculate Predicted Value for current user inputs
  const currentPrediction = useMemo(() => {
    if (!model) return 0;
    const { weights } = model;
    if (!weights) return 0;

    let val = weights[0]; // Intercept
    if (mode === SimulationMode.SCORE) {
      val += weights[1] * inputStudy;
      val += weights[2] * inputSleep;
      val += weights[3] * inputAbsence;
      return Math.max(0, Math.min(100, val));
    } else {
      val += weights[1] * inputKwh;
      return Math.max(0, val);
    }
  }, [model, inputStudy, inputSleep, inputAbsence, inputKwh, mode]);

  // Generate line points for visualization (Only for Primary X)
  const lineData = useMemo(() => {
    if (!model) return [];
    // Visualizing simplified line (Slope * X + Intercept) ignoring other features for 2D plot
    // Note: This is an approximation for visual purposes in Multiple Regression mode
    const minX = 0;
    const maxX = mode === SimulationMode.SCORE ? 10 : 500;
    
    // Calculate "Average" contribution of other features to the intercept for visualization
    let visualIntercept = model.intercept;
    if (mode === SimulationMode.SCORE && model.weights) {
      visualIntercept += model.weights[2] * 7; // assume avg sleep 7
      visualIntercept += model.weights[3] * 1; // assume avg absence 1
    }

    return [
      { x: minX, y: visualIntercept + model.slope * minX },
      { x: maxX, y: visualIntercept + model.slope * maxX },
    ];
  }, [model, mode]);

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Controls */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 lg:col-span-1 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">시나리오 선택</label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode(SimulationMode.SCORE)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === SimulationMode.SCORE ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              📊 성적 예측
            </button>
            <button
              onClick={() => setMode(SimulationMode.CARBON)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === SimulationMode.CARBON ? 'bg-white shadow text-eco-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              🌱 탄소 예측
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-slate-500 uppercase">데이터 양 (N)</label>
              <span className="text-xs font-mono text-slate-700">{dataCount}개</span>
            </div>
            <input
              type="range" min="10" max="200" step="10"
              value={dataCount}
              onChange={(e) => setDataCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-slate-500 uppercase">이상치 비율 (노이즈)</label>
              <span className="text-xs font-mono text-slate-700">{(outlierRatio * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range" min="0" max="0.2" step="0.01"
              value={outlierRatio}
              onChange={(e) => setOutlierRatio(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" /> 예측 해보기
          </h4>
          
          <div className="space-y-3">
            {mode === SimulationMode.SCORE ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                    <label className="text-xs text-slate-500">공부 (시간)</label>
                    <input type="number" value={inputStudy} onChange={e=>setInputStudy(Number(e.target.value))} className="w-full p-2 border rounded text-sm"/>
                   </div>
                   <div>
                    <label className="text-xs text-slate-500">수면 (시간)</label>
                    <input type="number" value={inputSleep} onChange={e=>setInputSleep(Number(e.target.value))} className="w-full p-2 border rounded text-sm"/>
                   </div>
                   <div className="col-span-2">
                    <label className="text-xs text-slate-500">결석 (일)</label>
                    <input type="number" value={inputAbsence} onChange={e=>setInputAbsence(Number(e.target.value))} className="w-full p-2 border rounded text-sm"/>
                   </div>
                </div>
              </>
            ) : (
               <div>
                <label className="text-xs text-slate-500">전기 사용량 (kWh)</label>
                <input type="number" value={inputKwh} onChange={e=>setInputKwh(Number(e.target.value))} className="w-full p-2 border rounded text-sm"/>
               </div>
            )}

            <div className="bg-slate-900 text-white p-4 rounded-lg text-center shadow-lg transform transition hover:scale-105">
               <div className="text-xs text-slate-400 mb-1">모델의 예측값</div>
               <div className="text-2xl font-bold">
                 {currentPrediction.toFixed(1)} 
                 <span className="text-sm font-normal text-slate-400 ml-1">
                   {mode === SimulationMode.SCORE ? '점' : 'kgCO₂'}
                 </span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1 min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">
              {mode === SimulationMode.SCORE ? '공부시간 vs 점수 산점도' : '사용량 vs 배출량 산점도'}
            </h3>
            <button onClick={runSimulation} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors" title="새 데이터 생성">
              <RotateCcw className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={mode === SimulationMode.SCORE ? "공부시간" : "전기사용량"} 
                unit={mode === SimulationMode.SCORE ? "시간" : "kWh"}
                domain={mode === SimulationMode.SCORE ? [0, 10] : [0, 500]}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={mode === SimulationMode.SCORE ? "점수" : "CO2"} 
                unit={mode === SimulationMode.SCORE ? "점" : "kg"}
                domain={['auto', 'auto']}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data" data={dataset} fill={mode === SimulationMode.SCORE ? "#0ea5e9" : "#16a34a"} shape="circle" />
              {/* Regression Line Visualization (Approximation for Multiple Regression) */}
              <Scatter 
                name="Trend" 
                data={lineData} 
                line={{ stroke: '#f59e0b', strokeWidth: 3 }} 
                shape={() => null} 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Panel */}
        {model && (
          <div className="bg-slate-800 text-white p-5 rounded-xl shadow-lg">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">RMSE (오차)</div>
                  <div className={`text-2xl font-bold ${model.rmse < 5 ? 'text-green-400' : model.rmse < 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {model.rmse}
                  </div>
                </div>
                <div className="flex-1">
                   <h4 className="font-bold flex items-center gap-2 mb-2">
                     <Info className="w-4 h-4" /> 
                     코치의 피드백
                   </h4>
                   <p className="text-sm text-slate-300 leading-relaxed">
                     {model.rmse < 5 
                       ? "훌륭해요! 오차(RMSE)가 매우 작습니다. 데이터 패턴이 뚜렷하네요." 
                       : model.rmse < 15 
                       ? "나쁘지 않아요. 하지만 현실 데이터는 이렇게 오차가 조금씩 있답니다." 
                       : "오차가 꽤 큽니다! 🚨 이상치가 많거나 데이터가 너무 적어서 패턴을 찾기 어려워 보여요."}
                   </p>
                   {outlierRatio > 0.1 && (
                     <p className="text-xs text-red-300 mt-2 font-mono">
                       * Tip: 이상치 비율을 줄이면 오차가 더 줄어들 수 있어요.
                     </p>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationTab;