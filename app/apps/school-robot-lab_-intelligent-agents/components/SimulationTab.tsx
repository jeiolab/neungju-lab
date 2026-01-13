import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { Play, RotateCcw, Save, Sliders, AlertTriangle } from 'lucide-react';
import { SensorQuality, PolicyType, SimulationResult } from '../types';

interface Props {
  onRunComplete: (result: SimulationResult) => void;
  history: SimulationResult[];
}

const SimulationTab: React.FC<Props> = ({ onRunComplete, history }) => {
  const [sensorQuality, setSensorQuality] = useState<SensorQuality>(SensorQuality.LOW);
  const [policyType, setPolicyType] = useState<PolicyType>(PolicyType.RULE_BASED);
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);

  const runSimulation = () => {
    setLoading(true);
    setCurrentResult(null);

    // Closed-book Logic Calculation
    // Base Success Rate for "Complex School Lunchtime"
    let baseRate = 50;
    
    // Sensor Factor
    if (sensorQuality === SensorQuality.HIGH) baseRate += 30;
    else baseRate -= 20;

    // Policy Factor
    if (policyType === PolicyType.LEARNING_REASONING) {
      if (sensorQuality === SensorQuality.LOW) {
         // Compensate for low sensor
         baseRate += 25; 
      } else {
         baseRate += 10; // Slight boost even with high sensor
      }
    }

    // Random noise (+/- 5%)
    const noise = Math.floor(Math.random() * 11) - 5;
    const finalRate = Math.min(100, Math.max(0, baseRate + noise));

    // Generate Feedback
    let feedback = { perception: '', reasoning: '', action: '' };
    
    if (sensorQuality === SensorQuality.LOW) {
      feedback.perception = "센서에 노이즈가 많아 장애물 위치가 불분명했습니다.";
    } else {
      feedback.perception = "고해상도 센서로 학생과 식판의 위치를 정확히 파악했습니다.";
    }

    if (policyType === PolicyType.RULE_BASED) {
       if (sensorQuality === SensorQuality.LOW) {
         feedback.reasoning = "규칙대로만 이동하려다 보니 부정확한 위치 정보로 인해 충돌 위험이 증가했습니다.";
         feedback.action = "급정지하거나 길을 잃는 횟수가 많았습니다.";
       } else {
         feedback.reasoning = "정확한 정보를 바탕으로 정해진 규칙을 잘 따랐습니다.";
         feedback.action = "안정적으로 서빙을 완료했습니다.";
       }
    } else {
       if (sensorQuality === SensorQuality.LOW) {
         feedback.reasoning = "센서가 불안정했지만, 확률적 추론을 통해 가장 안전한 경로를 예측했습니다.";
         feedback.action = "속도를 줄이고 우회하는 전략으로 사고를 예방했습니다.";
       } else {
         feedback.reasoning = "정확한 정보와 최적화된 경로 계획이 시너지를 냈습니다.";
         feedback.action = "매우 빠르고 효율적으로 임무를 완수했습니다.";
       }
    }

    setTimeout(() => {
      const result: SimulationResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        sensorQuality,
        policyType,
        successRate: finalRate,
        feedback
      };
      setCurrentResult(result);
      setLoading(false);
    }, 1500); // Simulate processing delay
  };

  const handleSave = () => {
    if (currentResult) {
      onRunComplete(currentResult);
      alert("실험 결과가 저장되었습니다! 배지 현황을 확인해보세요.");
    }
  };

  // Prepare data for chart (Local history only)
  const chartData = history.slice(-5).map((run, idx) => ({
    name: `실험 ${history.length - 4 + idx}`,
    score: run.successRate,
    isCurrent: false
  }));

  if (currentResult) {
    chartData.push({
      name: '현재',
      score: currentResult.successRate,
      isCurrent: true
    });
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-12">
      
      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
            <Sliders className="w-5 h-5 mr-2 text-blue-600" />
            실험 설정
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                1. 센서 품질 (Sensor)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSensorQuality(SensorQuality.LOW)}
                  className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    sensorQuality === SensorQuality.LOW
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  낮음 (Low)
                  <span className="block text-xs font-normal mt-1 opacity-70">노이즈 많음</span>
                </button>
                <button
                  onClick={() => setSensorQuality(SensorQuality.HIGH)}
                  className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    sensorQuality === SensorQuality.HIGH
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  높음 (High)
                  <span className="block text-xs font-normal mt-1 opacity-70">정확도 높음</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                2. 정책 유형 (Policy)
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setPolicyType(PolicyType.RULE_BASED)}
                  className={`p-3 text-left rounded-lg border-2 text-sm font-bold transition-all ${
                    policyType === PolicyType.RULE_BASED
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  규칙 기반 (Rule-based)
                  <span className="block text-xs font-normal mt-1 opacity-70">"장애물이 있으면 멈춘다" (단순함)</span>
                </button>
                <button
                  onClick={() => setPolicyType(PolicyType.LEARNING_REASONING)}
                  className={`p-3 text-left rounded-lg border-2 text-sm font-bold transition-all ${
                    policyType === PolicyType.LEARNING_REASONING
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  학습/추론 (Learning)
                  <span className="block text-xs font-normal mt-1 opacity-70">"경험을 통해 확률적으로 판단" (복잡함)</span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={runSimulation}
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                   <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                실험 시작 (Run)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start">
           <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
           <p>
             <strong>환경 설정:</strong> "학교 점심시간 (매우 혼잡)"으로 고정되어 있습니다. 
             많은 학생이 움직이는 불확실한 환경입니다.
           </p>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-8 space-y-6">
        {currentResult ? (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-fade-in">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-800">실험 결과 분석</h3>
               <span className={`text-2xl font-black ${
                 currentResult.successRate >= 80 ? 'text-green-500' :
                 currentResult.successRate >= 50 ? 'text-yellow-500' : 'text-red-500'
               }`}>
                 성공률 {currentResult.successRate}%
               </span>
             </div>

             {/* Feedback Cards */}
             <div className="grid md:grid-cols-3 gap-4 mb-8">
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                 <h4 className="font-bold text-blue-600 mb-2 text-sm">👁️ 인식 (Sensor)</h4>
                 <p className="text-sm text-slate-700">{currentResult.feedback.perception}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                 <h4 className="font-bold text-purple-600 mb-2 text-sm">🧠 추론 (Decision)</h4>
                 <p className="text-sm text-slate-700">{currentResult.feedback.reasoning}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                 <h4 className="font-bold text-green-600 mb-2 text-sm">🏃 행동 (Action)</h4>
                 <p className="text-sm text-slate-700">{currentResult.feedback.action}</p>
               </div>
             </div>

             <div className="flex justify-end space-x-3">
               <button 
                 onClick={() => setCurrentResult(null)}
                 className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
               >
                 <RotateCcw className="w-4 h-4 mr-2" />
                 다시하기
               </button>
               <button 
                 onClick={handleSave}
                 className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md"
               >
                 <Save className="w-4 h-4 mr-2" />
                 결과 저장 & XP 획득
               </button>
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-400 flex flex-col items-center justify-center h-64">
             {loading ? (
               <>
                 <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                 <p>로봇이 열심히 시뮬레이션 중입니다...</p>
               </>
             ) : (
                <>
                  <Play className="w-16 h-16 opacity-20 mb-4" />
                  <p>왼쪽 패널에서 설정을 마치고<br/>[실험 시작] 버튼을 눌러주세요.</p>
                </>
             )}
          </div>
        )}

        {/* History Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">최근 실험 기록</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{fill: 'transparent'}}
                />
                <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="3 3" />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                   {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#4f46e5' : '#94a3b8'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SimulationTab;