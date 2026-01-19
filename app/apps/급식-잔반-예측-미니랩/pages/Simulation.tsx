import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend, ReferenceLine } from 'recharts';
import { PlayCircle, Save, Info, RefreshCw, AlertTriangle, Check, Sliders } from 'lucide-react';
import { DataPoint, ExperimentLog, ScenarioType, SimulationState } from '../types';
import { generateData, calculateLinearRegression, calculatePolynomialRegression, calculateMAE } from '../utils/mathUtils';
import { addLog, getStats, saveStats } from '../utils/storageUtils';

const Simulation: React.FC = () => {
  // State
  const [scenario, setScenario] = useState<ScenarioType>('lunch');
  const [dataCount, setDataCount] = useState(50);
  const [noiseLevel, setNoiseLevel] = useState(2);
  const [modelType, setModelType] = useState<'linear' | 'polynomial'>('linear');
  const [splitRatio, setSplitRatio] = useState(80);
  const [featureValue, setFeatureValue] = useState(50); // Additional feature factor (e.g. Menu Quality)

  const [data, setData] = useState<DataPoint[]>([]);
  const [modelMetrics, setModelMetrics] = useState({ maeTrain: 0, maeTest: 0, formula: '' });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string[]>([]);
  const [hypothesis, setHypothesis] = useState('');

  // Generation
  const runSimulation = useCallback(() => {
    const newData = generateData(scenario, dataCount, noiseLevel, featureValue, splitRatio);
    setData(newData);
    setShowFeedback(true);
  }, [scenario, dataCount, noiseLevel, featureValue, splitRatio]);

  // Initial Run
  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  // Calculation (Memoized for performance)
  const chartData = useMemo(() => {
    if (data.length === 0) return { points: [], line: [] };
    
    const trainData = data.filter(d => d.type === 'train');
    const testData = data.filter(d => d.type === 'test');

    let predictFn: (x: number) => number;
    let formulaStr = '';

    if (modelType === 'linear') {
      const { m, b } = calculateLinearRegression(trainData);
      predictFn = (x) => m * x + b;
      formulaStr = `y = ${m.toFixed(2)}x + ${b.toFixed(2)}`;
    } else {
      const { a, b, c } = calculatePolynomialRegression(trainData);
      predictFn = (x) => a * x * x + b * x + c;
      formulaStr = `y = ${a.toFixed(3)}x² + ${b.toFixed(2)}x + ${c.toFixed(2)}`;
    }

    const maeTrain = calculateMAE(trainData, predictFn);
    const maeTest = calculateMAE(testData, predictFn);
    setModelMetrics({ maeTrain, maeTest, formula: formulaStr });

    // Prepare chart data with prediction line
    // We generate points for the line across the range [0, 100]
    const linePoints = [];
    for(let i=0; i<=100; i+=5) {
        linePoints.push({ x: i, predicted: predictFn(i) });
    }

    return { points: data, line: linePoints };
  }, [data, modelType]);

  // Generate Feedback
  useEffect(() => {
    if (!showFeedback) return;
    
    const messages = [];
    const diff = Math.abs(modelMetrics.maeTrain - modelMetrics.maeTest);
    
    // 1. Accuracy Check
    if (modelMetrics.maeTest < 10) messages.push("✅ 모델이 매우 정확합니다! 예측 오차가 적어요.");
    else if (modelMetrics.maeTest < 25) messages.push("⚠️ 모델 성능이 보통입니다. 오차가 좀 있네요.");
    else messages.push("❌ 모델이 데이터를 잘 설명하지 못하고 있습니다.");

    // 2. Overfitting/Underfitting
    if (diff > 15 && modelMetrics.maeTrain < 10) {
        messages.push("🚨 과적합(Overfitting) 의심! 학습 데이터만 달달 외웠네요.");
        checkBadge("overfit");
    } else if (modelType === 'linear' && scenario !== 'lunch' && modelMetrics.maeTest > 20) {
        messages.push("📉 단순 선형 모델로는 복잡한 패턴(곡선)을 설명하기 어렵습니다.");
    }

    // 3. Recommendation
    if (dataCount < 30) messages.push("💡 데이터 개수가 너무 적습니다. 더 늘려보세요!");
    else if (noiseLevel > 7) messages.push("💡 데이터에 노이즈(잡음)가 너무 많아 학습이 어렵습니다.");
    else messages.push("👍 훌륭한 실험 설정입니다. 다른 변수도 조절해보세요.");

    setFeedbackText(messages);
  }, [modelMetrics, showFeedback, dataCount, noiseLevel, modelType, scenario]);

  const checkBadge = (type: string) => {
    const stats = getStats();
    if (type === 'overfit' && !stats.badges.includes('과적합 발견자')) {
        stats.badges.push('과적합 발견자');
        stats.points += 50;
        saveStats(stats);
        alert("🎉 배지 획득: 과적합 발견자!");
    }
  };

  const saveLog = () => {
    const log: ExperimentLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        scenario,
        mae: Number(modelMetrics.maeTest.toFixed(2)),
        note: `Data: ${dataCount}, Noise: ${noiseLevel}, Model: ${modelType}`
    };
    addLog(log);
    
    const stats = getStats();
    stats.points += 10;
    saveStats(stats);
    alert("실험 결과가 저장되었습니다! (+10포인트)");
  };

  const getXLabel = () => {
    if (scenario === 'lunch') return '메뉴 선호도 (점수)';
    if (scenario === 'icecream') return '기온 (°C)';
    return '환기 시간 (분)';
  };

  const getYLabel = () => {
    if (scenario === 'lunch') return '잔반량 (kg)';
    if (scenario === 'icecream') return '판매량 (개)';
    return 'CO2 농도 (ppm)';
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-1/3 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5" /> 실험 설정
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">시나리오 선택</label>
                    <select 
                        value={scenario} 
                        onChange={(e) => setScenario(e.target.value as ScenarioType)}
                        className="w-full p-2 border rounded-lg bg-slate-50"
                    >
                        <option value="lunch">🍱 급식 잔반 예측</option>
                        <option value="icecream">🍦 매점 아이스크림 판매</option>
                        <option value="co2">🌬️ 교실 CO2 농도</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">모델 복잡도</label>
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                        <button 
                            onClick={() => setModelType('linear')}
                            className={`flex-1 py-1 text-sm rounded-md transition-all ${modelType === 'linear' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
                        >
                            직선 (단순)
                        </button>
                        <button 
                            onClick={() => setModelType('polynomial')}
                            className={`flex-1 py-1 text-sm rounded-md transition-all ${modelType === 'polynomial' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
                        >
                            곡선 (복잡)
                        </button>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-600">데이터 양 (N)</span>
                            <span className="text-sm font-bold text-indigo-600">{dataCount}</span>
                        </div>
                        <input type="range" min="10" max="200" step="10" value={dataCount} onChange={(e) => setDataCount(Number(e.target.value))} className="w-full accent-indigo-600" />
                    </div>
                    
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-600">노이즈 (잡음)</span>
                            <span className="text-sm font-bold text-indigo-600">{noiseLevel}</span>
                        </div>
                        <input type="range" min="0" max="10" step="1" value={noiseLevel} onChange={(e) => setNoiseLevel(Number(e.target.value))} className="w-full accent-indigo-600" />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-600">특성값 (X 강도)</span>
                            <span className="text-sm font-bold text-indigo-600">{featureValue}</span>
                        </div>
                        <input type="range" min="0" max="100" value={featureValue} onChange={(e) => setFeatureValue(Number(e.target.value))} className="w-full accent-indigo-600" />
                    </div>
                </div>
            </div>
        </div>

        {/* Feedback Panel */}
        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> AI 코치 피드백
            </h3>
            <ul className="space-y-2 text-sm text-indigo-900">
                {feedbackText.map((text, i) => (
                    <li key={i} className="flex gap-2 items-start">
                        <span className="mt-0.5">•</span>
                        <span>{text}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="w-full md:w-2/3 space-y-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-[400px] relative">
             <div className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded shadow border border-slate-100 text-xs">
                <div className="font-bold text-slate-500">테스트 오차 (MAE)</div>
                <div className={`text-xl font-bold ${modelMetrics.maeTest < 15 ? 'text-green-600' : 'text-red-500'}`}>
                    {modelMetrics.maeTest.toFixed(2)}
                </div>
             </div>

             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <XAxis 
                        dataKey="x" 
                        type="number" 
                        domain={[0, 100]} 
                        label={{ value: getXLabel(), position: 'bottom', offset: 0 }} 
                        allowDataOverflow
                    />
                    <YAxis 
                        dataKey="y" 
                        type="number" 
                        label={{ value: getYLabel(), angle: -90, position: 'left' }} 
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    {/* Training Data */}
                    <Scatter name="학습 데이터" data={chartData.points.filter(p => p.type === 'train')} fill="#6366f1" fillOpacity={0.6} />
                    {/* Test Data */}
                    <Scatter name="검증(테스트) 데이터" data={chartData.points.filter(p => p.type === 'test')} fill="#f59e0b" shape="triangle" />
                    {/* Prediction Line */}
                    <Line 
                        data={chartData.line} 
                        dataKey="predicted" 
                        type="monotone" 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        dot={false} 
                        name="AI 모델 예측선" 
                        activeDot={false}
                    />
                </ComposedChart>
             </ResponsiveContainer>
        </div>

        {/* Action Bar */}
        <div className="flex gap-3">
             <button 
                onClick={runSimulation}
                className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
             >
                <RefreshCw className="w-5 h-5" />
                새 데이터 생성
             </button>
             <button 
                onClick={saveLog}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
             >
                <Save className="w-5 h-5" />
                결과 기록하기
             </button>
        </div>

        {/* Hypothesis Builder */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">🧪 가설 세우기</h3>
            <div className="flex gap-2 mb-3">
                <button 
                    onClick={() => setHypothesis(`만약 ${getXLabel()}이(가) 증가하면, ${getYLabel()}은(는) 감소할 것이다.`)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full text-slate-600 transition-colors"
                >
                    # 반비례 가설
                </button>
                <button 
                    onClick={() => setHypothesis(`노이즈가 많아질수록 테스트 오차(MAE)가 증가할 것이다.`)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full text-slate-600 transition-colors"
                >
                    # 노이즈 가설
                </button>
            </div>
            <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                rows={2}
                placeholder="이곳에 실험 가설을 적어보세요..."
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
            />
        </div>
      </div>
    </div>
  );
};

export default Simulation;