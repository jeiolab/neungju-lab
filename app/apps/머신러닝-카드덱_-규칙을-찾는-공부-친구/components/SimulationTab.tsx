import React, { useState, useEffect } from 'react';
import { SimulationState } from '../types';
import { Settings, Database, Activity, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SimulationTab: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    mode: 'traditional',
    dataVolume: 10
  });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    // Logic: 
    // Traditional: Score is static and mediocre (humans can't handle complex rules perfectly). 
    // Even with more data, the rule doesn't change automatically.
    // ML: Score scales with dataVolume.
    
    let newScore = 0;
    let newFeedback = [];

    if (state.mode === 'traditional') {
      newScore = 55; // Flat score
      newFeedback = [
        "규칙: 사람이 if-else로 직접 작성함.",
        "데이터가 늘어나도 규칙을 일일이 수정하지 않으면 성능이 제자리입니다.",
        "복잡한 예외 케이스를 모두 사람이 처리하기엔 한계가 있어요."
      ];
    } else {
      // ML Curve: Logarithmic-ish growth
      // 10 -> 30, 50 -> 70, 100 -> 95
      newScore = Math.min(98, Math.floor(20 + 78 * (1 - Math.exp(-state.dataVolume / 30))));
      newFeedback = [
        "규칙: 데이터에서 컴퓨터가 스스로 패턴을 찾음.",
        `데이터 양(${state.dataVolume})이 늘어날수록 더 정교한 규칙을 발견합니다.`,
        state.dataVolume < 30 ? "데이터가 아직 부족해요! 더 모아보세요." : "충분한 데이터 덕분에 일반화 성능이 높아졌습니다!"
      ];
    }

    setScore(newScore);
    setFeedback(newFeedback);
  }, [state]);

  const chartData = [
    { name: '새로운 사례 대응 점수', score: score }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="text-indigo-600"/> 시뮬레이션: 규칙 만들기
        </h2>
        
        {/* Controls */}
        <div className="space-y-6 mb-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">방식 선택</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setState(s => ({ ...s, mode: 'traditional' }))}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                            state.mode === 'traditional' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        전통적 프로그래밍 (Rule-based)
                    </button>
                    <button
                        onClick={() => setState(s => ({ ...s, mode: 'ml' }))}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                            state.mode === 'ml' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        기계학습 (Data-driven)
                    </button>
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Database size={16}/> 학습 데이터 양
                    </label>
                    <span className="text-sm font-bold text-indigo-600">{state.dataVolume}개</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={state.dataVolume}
                    onChange={(e) => setState(s => ({ ...s, dataVolume: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>적음</span>
                    <span>많음</span>
                </div>
            </div>
        </div>

        {/* Results Visualization */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full h-40 md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={40}>
                            <Cell fill={score > 80 ? '#22c55e' : score > 50 ? '#eab308' : '#ef4444'} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="text-center font-bold text-2xl mt-[-30px] relative z-10" style={{ color: score > 80 ? '#15803d' : '#a16207' }}>
                    {score}점
                </div>
            </div>

            <div className="w-full md:w-1/2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-2">분석 리포트</h3>
                <ul className="space-y-2">
                    {feedback.map((line, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-indigo-400">•</span> {line}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p>
            <strong>참고:</strong> 실제로는 데이터가 많다고 무조건 점수가 오르진 않습니다. 
            데이터의 질(Quality)이 좋지 않거나 잘못된 알고리즘을 선택하면 점수가 떨어질 수도 있어요!
            (이 시뮬레이션은 기본적인 경향성을 보여줍니다.)
        </p>
      </div>
    </div>
  );
};

export default SimulationTab;
