import React, { useState, useEffect, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sliders, RefreshCw, PlayCircle, Info } from 'lucide-react';
import { generateMockData, calculateMetrics } from '../services/clusteringService';
import { getSimulationFeedback } from '../services/geminiService';
import { ScenarioType, DataPoint, FeedbackResult, LogEntry } from '../types';

interface SimulationProps {
  onLogDecision: (entry: LogEntry) => void;
  updateScore: (points: number) => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Simulation: React.FC<SimulationProps> = ({ onLogDecision, updateScore }) => {
  const [scenario, setScenario] = useState<ScenarioType>('streaming');
  const [k, setK] = useState<number>(3);
  const [weights, setWeights] = useState({ interpretability: 5, cohesion: 5, efficiency: 5 });
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [metrics, setMetrics] = useState({ interpretability: 0, cohesion: 0, efficiency: 0 });

  // Initialize data on mount and when K/Scenario changes
  useEffect(() => {
    setDataPoints(generateMockData(k, scenario));
    const result = calculateMetrics(k, weights);
    setMetrics(result.metrics);
  }, [k, scenario]); // Recalculate basic metrics immediately for UI responsiveness

  const handleRunSimulation = useCallback(async () => {
    setLoading(true);
    setFeedback(null);

    // 1. Calculate final metrics locally
    const result = calculateMetrics(k, weights);
    setMetrics(result.metrics);

    // 2. Get AI Feedback
    const aiFeedback = await getSimulationFeedback(k, weights, scenario, result.metrics);
    
    // 3. Update State
    setFeedback(aiFeedback);
    updateScore(Math.round(result.finalScore));
    setLoading(false);

    // 4. Log
    onLogDecision({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      scenario,
      k,
      score: Math.round(result.finalScore),
      feedback: aiFeedback.winner
    });
  }, [k, weights, scenario, onLogDecision, updateScore]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 h-full">
      {/* Left Control Panel */}
      <div className="w-full lg:w-1/3 space-y-6">
        
        {/* Scenario Selector */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <RefreshCw size={18} /> 시나리오 선택
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setScenario('streaming')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                scenario === 'streaming' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📺 스트리밍 습관
            </button>
            <button
              onClick={() => setScenario('school')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                scenario === 'school' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏫 학교 배정
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            {scenario === 'streaming' 
              ? "데이터: 일일 시청 시간(X) vs 장르 다양성(Y). 목표: 마케팅 그룹 만들기."
              : "데이터: 교직원 수(X) vs 학생 수(Y). 목표: 지원 정책 그룹 만들기."}
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Sliders size={18} /> 의사결정 조작
          </h3>
          
          {/* K Slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">군집 수 (K): <span className="text-indigo-600 text-lg">{k}</span></span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>단순 (2)</span>
              <span>복잡 (8)</span>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-4"></div>

          {/* Weights Sliders */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-600">중요도 가중치 설정 (0-10)</h4>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>해석 쉬움 (Explainability)</span>
                <span className="font-bold text-green-600">{weights.interpretability}</span>
              </div>
              <input
                type="range" min="0" max="10"
                value={weights.interpretability}
                onChange={(e) => setWeights({...weights, interpretability: Number(e.target.value)})}
                className="w-full h-1.5 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>군집 내 뭉침 (Cohesion)</span>
                <span className="font-bold text-blue-600">{weights.cohesion}</span>
              </div>
              <input
                type="range" min="0" max="10"
                value={weights.cohesion}
                onChange={(e) => setWeights({...weights, cohesion: Number(e.target.value)})}
                className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>운영 효율 (Efficiency)</span>
                <span className="font-bold text-orange-600">{weights.efficiency}</span>
              </div>
              <input
                type="range" min="0" max="10"
                value={weights.efficiency}
                onChange={(e) => setWeights({...weights, efficiency: Number(e.target.value)})}
                className="w-full h-1.5 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>
          </div>
          
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'AI 분석 중...' : (
              <>
                <PlayCircle size={20} /> 의사결정 실행
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Visualization & Feedback */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        
        {/* Chart Area */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 mb-4 ml-2">군집 시각화 (K={k})</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" name="X축" unit="" tick={false} axisLine={false} />
              <YAxis type="number" dataKey="y" name="Y축" unit="" tick={false} axisLine={false} />
              <ZAxis type="number" range={[50, 50]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Users" data={dataPoints} fill="#8884d8">
                {dataPoints.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(entry.cluster - 1) % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            {Array.from({ length: k }).map((_, i) => (
              <div key={i} className="flex items-center gap-1 text-xs text-gray-600">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                Group {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-xl animate-fade-in">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               🤖 AI 코치의 피드백
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-sm font-bold whitespace-nowrap">WINNER</span>
                <p className="text-gray-200">{feedback.winner}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-sm font-bold whitespace-nowrap">LOSER</span>
                <p className="text-gray-200">{feedback.loser}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-sm font-bold whitespace-nowrap">TIP</span>
                <p className="text-gray-200">{feedback.suggestion}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                지표 점수:
                <span className="ml-2 text-xs">
                  (해석 {Math.round(metrics.interpretability)} / 응집 {Math.round(metrics.cohesion)} / 효율 {Math.round(metrics.efficiency)})
                </span>
              </div>
              <div className="text-xl font-bold text-indigo-400">
                균형 점수: {Math.round(calculateMetrics(k, weights).finalScore)}점
              </div>
            </div>
          </div>
        )}

        {!feedback && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 h-48">
            <Info size={32} className="mb-2 opacity-50" />
            <p>설정을 변경하고 [의사결정 실행] 버튼을 눌러보세요.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Simulation;