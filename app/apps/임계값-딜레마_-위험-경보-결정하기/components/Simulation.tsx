import React, { useState, useEffect, useMemo } from 'react';
import { ComposedChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Label } from 'recharts';
import { DataPoint, DatasetType, SimulationStats } from '../types';
import { Sliders, AlertTriangle, CheckCircle, Shield, Target } from 'lucide-react';

interface SimulationProps {
  onLevelUp: () => void;
}

export const Simulation: React.FC<SimulationProps> = ({ onLevelUp }) => {
  // --- State ---
  const [datasetType, setDatasetType] = useState<DatasetType>(DatasetType.LATENESS);
  const [w1, setW1] = useState<number>(0.8);
  const [w2, setW2] = useState<number>(-0.5);
  const [bias, setBias] = useState<number>(-2);
  const [threshold, setThreshold] = useState<number>(0.5);
  const [data, setData] = useState<DataPoint[]>([]);
  const [showBoundary, setShowBoundary] = useState(true);

  // --- Constants & Helpers ---
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  // --- Data Generation ---
  useEffect(() => {
    const generateData = () => {
      const points: DataPoint[] = [];
      const count = 50;

      for (let i = 0; i < count; i++) {
        let x1, x2, noise, actual;
        
        if (datasetType === DatasetType.LATENESS) {
            // x1: Distance (0-10km), x2: Wake up time (6am - 9am, mapped 0-10)
            // Rule: Far distance + Late wake up = Risk
            x1 = Math.random() * 10;
            x2 = Math.random() * 10;
            noise = (Math.random() - 0.5) * 3;
            // Logic: if (x1 * 0.7 + x2 * 0.6 > 6) -> Risk
            // Mapping x2: 0 is 6am, 10 is 9am. Late wake up (high x2) increases risk.
            actual = (x1 * 0.6 + x2 * 0.7 + noise > 6.5) ? 1 : 0;
        } else {
            // Assignment Risk
            // x1: Days Left (0-10), x2: Difficulty (0-10)
            // Rule: Few days left (Low x1) + High difficulty (High x2) = Risk
            x1 = Math.random() * 10;
            x2 = Math.random() * 10;
            noise = (Math.random() - 0.5) * 3;
            // Risk if (10-x1) * 0.8 + x2 * 0.5 > 7
            actual = ((10 - x1) * 0.8 + x2 * 0.5 + noise > 7) ? 1 : 0;
        }

        points.push({ id: i, x1, x2, actualLabel: actual as 0 | 1 });
      }
      setData(points);
    };
    generateData();
    
    // Reset weights for better initial view per dataset
    if (datasetType === DatasetType.LATENESS) {
        setW1(0.8); setW2(0.5); setBias(-4);
    } else {
        setW1(-0.8); setW2(0.6); setBias(2);
    }

  }, [datasetType]);

  // --- Calculation Loop ---
  const processedData = useMemo(() => {
    return data.map(point => {
      const z = (w1 * point.x1) + (w2 * point.x2) + bias;
      const p = sigmoid(z);
      const predicted = p >= threshold ? 1 : 0;
      return { ...point, probability: p, predictedLabel: predicted };
    });
  }, [data, w1, w2, bias, threshold]);

  // --- Stats Calculation ---
  const stats: SimulationStats = useMemo(() => {
    let tp = 0, tn = 0, fp = 0, fn = 0;
    processedData.forEach(p => {
      if (p.actualLabel === 1 && p.predictedLabel === 1) tp++;
      else if (p.actualLabel === 0 && p.predictedLabel === 0) tn++;
      else if (p.actualLabel === 0 && p.predictedLabel === 1) fp++;
      else if (p.actualLabel === 1 && p.predictedLabel === 0) fn++;
    });

    const total = processedData.length;
    const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 0;
    // Safety Score: Heavy penalty on FN (Missing a risk is bad)
    const safetyScore = Math.max(0, 100 - (fn * 10) - (fp * 2)); 
    // Efficiency/Fairness Score: Penalty on FP (False alarm is annoying)
    const efficiencyScore = Math.max(0, 100 - (fp * 8) - (fn * 2));

    return { tp, tn, fp, fn, accuracy, safetyScore, efficiencyScore };
  }, [processedData]);

  // --- Decision Boundary Line Calculation ---
  const boundaryData = useMemo(() => {
    if (!showBoundary) return [];
    // Boundary equation: w1*x1 + w2*x2 + b = logit(t) = ln(t / (1-t))
    // x2 = (ln(t/(1-t)) - b - w1*x1) / w2
    
    // Avoid division by zero and log of 0/1
    const t = Math.max(0.001, Math.min(0.999, threshold));
    const logit = Math.log(t / (1 - t));
    const safeW2 = Math.abs(w2) < 0.01 ? 0.01 : w2;

    const linePoints = [];
    for (let x = 0; x <= 10; x += 1) {
      const y = (logit - bias - (w1 * x)) / safeW2;
      if (y >= -2 && y <= 12) { // Keep within reasonable chart bounds
        linePoints.push({ x1: x, x2: y });
      }
    }
    return linePoints;
  }, [w1, w2, bias, threshold, showBoundary]);


  // --- Custom Tooltip ---
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm">
          <p className="font-bold mb-1">데이터 포인트 #{d.id}</p>
          <p>특성1(X): {d.x1.toFixed(1)}</p>
          <p>특성2(Y): {d.x2.toFixed(1)}</p>
          <p className="mt-2">실제: <span className={d.actualLabel === 1 ? "text-red-600 font-bold" : "text-blue-600 font-bold"}>{d.actualLabel === 1 ? "위험" : "안전"}</span></p>
          <p>예측확률: <span className="font-mono text-purple-600">{(d.probability * 100).toFixed(1)}%</span></p>
          <p>판정: {d.predictedLabel === 1 ? "위험 경보" : "안전함"}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
      {/* Control Panel */}
      <div className="w-full lg:w-1/3 space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 mb-4">
            <Sliders className="w-5 h-5 text-brand-500" />
            모델 제어실
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-600 mb-2">시나리오 선택</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setDatasetType(DatasetType.LATENESS)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-colors ${datasetType === DatasetType.LATENESS ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                🏃 지각 위험
              </button>
              <button 
                onClick={() => setDatasetType(DatasetType.ASSIGNMENT)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-colors ${datasetType === DatasetType.ASSIGNMENT ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                📝 과제 펑크
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <label className="flex justify-between text-sm font-bold text-purple-900 mb-2">
                <span>⚠️ 임계값 (Threshold)</span>
                <span>{threshold.toFixed(2)}</span>
              </label>
              <input 
                type="range" min="0.01" max="0.99" step="0.01" 
                value={threshold} 
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <p className="text-xs text-purple-700 mt-2">
                낮추면 민감(겁쟁이), 높이면 둔감(태평)
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Parameters</p>
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span>가중치 1 (X축 영향력)</span>
                  <span>{w1.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="-3" max="3" step="0.1" 
                  value={w1} onChange={(e) => setW1(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span>가중치 2 (Y축 영향력)</span>
                  <span>{w2.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="-3" max="3" step="0.1" 
                  value={w2} onChange={(e) => setW2(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span>편향 (Bias, 기준점 이동)</span>
                  <span>{bias.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="-10" max="10" step="0.5" 
                  value={bias} onChange={(e) => setBias(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization & Stats */}
      <div className="w-full lg:w-2/3 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">정확도 (Accuracy)</div>
            <div className="text-2xl font-black text-slate-800">{stats.accuracy.toFixed(0)}%</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
             <div className={`absolute top-0 left-0 h-1 bg-red-500 transition-all duration-300`} style={{width: `${stats.safetyScore}%`}}></div>
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
               <Shield size={12} className="text-red-500"/> 안전 점수
            </div>
            <div className="text-2xl font-black text-red-600">{stats.safetyScore}</div>
            <div className="text-[10px] text-slate-400">위험 감지 능력</div>
          </div>
           <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className={`absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300`} style={{width: `${stats.efficiencyScore}%`}}></div>
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
               <CheckCircle size={12} className="text-blue-500"/> 효율 점수
            </div>
            <div className="text-2xl font-black text-blue-600">{stats.efficiencyScore}</div>
            <div className="text-[10px] text-slate-400">오탐 최소화 능력</div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl shadow-sm text-white flex flex-col justify-between">
            <div className="text-xs text-slate-400">놓친 위험 (치명적)</div>
            <div className="text-3xl font-black text-red-400 text-right">{stats.fn} <span className="text-sm font-normal text-white">건</span></div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 h-[450px] relative">
            <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-2 rounded-lg border border-slate-200 text-xs shadow-sm">
                <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span> 실제 위험</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 opacity-80"></span> 실제 안전</div>
                <div className="mt-2 text-[10px] text-slate-500">배경선 = 예측 경계</div>
            </div>

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x1" 
                domain={[0, 10]} 
                name="Feature 1" 
                label={{ value: datasetType === DatasetType.LATENESS ? '학교와의 거리 (km)' : '남은 기간 (일)', position: 'bottom', offset: 0 }} 
              />
              <YAxis 
                type="number" 
                dataKey="x2" 
                domain={[0, 10]} 
                name="Feature 2" 
                label={{ value: datasetType === DatasetType.LATENESS ? '기상 시간 (늦음→)' : '과제 난이도', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              
              {/* Decision Boundary Line */}
              <Scatter name="Boundary" data={boundaryData} line={{ stroke: '#9333ea', strokeWidth: 2, strokeDasharray: '5 5' }} shape={() => null} isAnimationActive={false} />

              {/* Data Points - Split into Risk and Safe for coloring */}
              <Scatter 
                name="Actual Risk" 
                data={processedData.filter(d => d.actualLabel === 1)} 
                fill="#ef4444"
                shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isError = payload.predictedLabel !== payload.actualLabel;
                    return (
                        <g>
                             <circle cx={cx} cy={cy} r={6} fill="#ef4444" fillOpacity={0.6} stroke={isError ? "#991b1b" : "none"} strokeWidth={isError ? 3 : 0} />
                             {isError && <text x={cx} y={cy-10} textAnchor="middle" fill="#991b1b" fontSize={10} fontWeight="bold">Miss!</text>}
                        </g>
                    )
                }}
              />
              <Scatter 
                name="Actual Safe" 
                data={processedData.filter(d => d.actualLabel === 0)} 
                fill="#3b82f6"
                shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isError = payload.predictedLabel !== payload.actualLabel;
                    return (
                        <g>
                             <circle cx={cx} cy={cy} r={6} fill="#3b82f6" fillOpacity={0.6} stroke={isError ? "#1e40af" : "none"} strokeWidth={isError ? 3 : 0} />
                             {isError && <text x={cx} y={cy-10} textAnchor="middle" fill="#1e40af" fontSize={10} fontWeight="bold">False!</text>}
                        </g>
                    )
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Mission/Feedback Area */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-start gap-3">
             <Target className="text-brand-600 mt-1" />
             <div>
                <h4 className="font-bold text-slate-800">오늘의 미션: 위험 제로 작전</h4>
                <p className="text-sm text-slate-600 mb-2">
                   "놓친 위험(Missed Risk)"을 0건으로 만드세요. 단, 효율 점수가 50점 이상이어야 합니다.
                </p>
                {stats.fn === 0 && stats.efficiencyScore >= 50 ? (
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        <CheckCircle size={16} /> 미션 성공!
                    </div>
                ) : (
                    <div className="text-xs text-orange-600 font-semibold">
                       현재 상태: {stats.fn === 0 ? "성공 조건(효율) 미달" : `아직 위험 ${stats.fn}건을 놓치고 있어요!`}
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};