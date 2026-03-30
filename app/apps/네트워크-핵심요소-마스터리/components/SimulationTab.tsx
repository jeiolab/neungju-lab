import React, { useState } from 'react';
import { SIMULATION_LOGIC } from '../constants';
import { SimulationResult, UserState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  userState: UserState;
  onUpdateState: (newState: Partial<UserState>) => void;
}

const SimulationTab: React.FC<Props> = ({ userState, onUpdateState }) => {
  const [media, setMedia] = useState<'wired' | 'wireless'>('wired');
  const [distance, setDistance] = useState<'short' | 'medium' | 'long'>('short');
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = () => {
    const res = SIMULATION_LOGIC(media, distance);
    setResult(res);
    
    // Update history only if it's a new combination
    const exists = userState.simulationHistory.some(h => h.media === media && h.distance === distance);
    if (!exists) {
        onUpdateState({
            simulationHistory: [...userState.simulationHistory, { media, distance }],
            totalScore: userState.totalScore + 10
        });
    }
  };

  const scoreData = [
    { name: '안정성', score: result ? result.score : 0, full: 100 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Controls */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                🎛️ 실험 조건 설정
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">실험 완료: {userState.simulationHistory.length} / 6</span>
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">전송 매체 (연결 방식)</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setMedia('wired')}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${media === 'wired' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <span className="text-2xl">🔌</span>
                            <span className="font-bold">유선 (Wired)</span>
                        </button>
                        <button 
                            onClick={() => setMedia('wireless')}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${media === 'wireless' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <span className="text-2xl">📡</span>
                            <span className="font-bold">무선 (Wireless)</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">거리 (시스템 간 거리)</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {['short', 'medium', 'long'].map((d) => (
                             <button
                                key={d}
                                onClick={() => setDistance(d as any)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${distance === d ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                                {d === 'short' ? '짧음 (교실 내)' : d === 'medium' ? '보통 (복도)' : '김 (운동장)'}
                             </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={runSimulation}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-transform active:scale-95 shadow-lg shadow-slate-200"
                >
                    실험 시작 🚀
                </button>
            </div>
        </div>

        {/* Read more */}
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-3">💡 더 알아보기: 학교 축제 라이브 방송</h4>
            <div className="space-y-2 text-sm text-blue-800">
                <details className="group cursor-pointer">
                    <summary className="font-medium list-none flex justify-between items-center">
                        <span>왜 운동장에서는 와이파이가 끊길까?</span>
                        <span className="transition group-open:rotate-180">⌄</span>
                    </summary>
                    <p className="mt-2 text-blue-700 bg-white/50 p-2 rounded">거리가 멀어질수록 전파가 약해지고(감쇄), 장애물의 영향을 많이 받기 때문이에요.</p>
                </details>
                <div className="h-px bg-blue-200 my-2"></div>
                <details className="group cursor-pointer">
                    <summary className="font-medium list-none flex justify-between items-center">
                        <span>방송용으로는 유선이 필수인가요?</span>
                        <span className="transition group-open:rotate-180">⌄</span>
                    </summary>
                    <p className="mt-2 text-blue-700 bg-white/50 p-2 rounded">네! 끊김 없는 안정적인 방송을 위해서는 유선 랜(LAN) 연결이 훨씬 유리합니다.</p>
                </details>
            </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
        {result ? (
            <>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">실험 결과 리포트</h2>
                    <p className="text-slate-500">예상 안정성 점수</p>
                </div>
                
                <div className="h-64 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreData} layout="vertical" margin={{top: 0, right: 30, left: 30, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar 
                                dataKey="score" 
                                fill={result.score > 80 ? '#10b981' : result.score > 50 ? '#f59e0b' : '#ef4444'} 
                                radius={[0, 10, 10, 0]} 
                                barSize={40}
                                background={{ fill: '#f1f5f9' }}
                                label={{ position: 'right', fill: '#64748b', fontWeight: 'bold' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-blue-500">
                        <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Analysis</span>
                        <p className="text-slate-800 font-medium">{result.reasons}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-yellow-500">
                        <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Pro Tip</span>
                        <p className="text-slate-800 font-medium">{result.tip}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-purple-500">
                        <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Recommendation</span>
                        <p className="text-slate-800 font-medium">{result.recommendation}</p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 mb-2">다른 조합도 테스트해보세요!</p>
                    <button 
                        onClick={() => {
                            setMedia(media === 'wired' ? 'wireless' : 'wired');
                            setResult(null);
                        }}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        다음 추천 조합: {media === 'wired' ? '무선 환경 테스트' : '유선 환경 테스트'} &rarr;
                    </button>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4">🧪</div>
                <p>왼쪽에서 조건을 설정하고<br/>실험 시작 버튼을 눌러주세요.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SimulationTab;
