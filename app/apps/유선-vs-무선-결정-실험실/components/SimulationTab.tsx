import React, { useState } from 'react';
import { ExperimentResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Wifi, Users, BrickWall } from 'lucide-react';

interface SimulationTabProps {
  onExperimentComplete: (result: ExperimentResult) => void;
  history: ExperimentResult[];
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onExperimentComplete, history }) => {
  const [users, setUsers] = useState<number>(1);
  const [walls, setWalls] = useState<number>(0);
  const [result, setResult] = useState<ExperimentResult | null>(null);

  const runSimulation = () => {
    const base = 80;
    let penaltyUsers = 0;
    if (users > 10) {
      penaltyUsers = (users - 10) * 1.2;
    }
    const penaltyWalls = walls * 10;
    
    // Intro noise
    const randomNoise = Math.random() * 5 - 2.5; 
    
    let quality = base - penaltyUsers - penaltyWalls + randomNoise;
    quality = Math.max(0, Math.min(100, quality));
    
    // Format feedback
    const feedbacks = [];
    if (quality >= 80) feedbacks.push("✅ 매우 쾌적함: 유튜브 4K도 거뜬해요!");
    else if (quality >= 50) feedbacks.push("⚠️ 보통: 가끔 버퍼링이 걸릴 수 있어요.");
    else feedbacks.push("❌ 연결 끊김: 페이지를 열기 힘들어요.");

    if (users > 20) feedbacks.push("💡 팁: 접속자가 너무 많아 대역폭이 부족해요.");
    if (walls === 2) feedbacks.push("💡 팁: 두꺼운 벽이 전파를 막고 있어요.");

    const newResult: ExperimentResult = {
      id: Date.now(),
      timestamp: Date.now(),
      users,
      walls,
      quality: Math.round(quality),
      feedback: feedbacks
    };

    setResult(newResult);
    onExperimentComplete(newResult);
  };

  const getBarColor = (quality: number) => {
    if (quality >= 80) return '#22c55e'; // green-500
    if (quality >= 50) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Wifi className="text-blue-600" /> 실험 조건 설정
        </h2>
        
        <div className="space-y-8">
          {/* User Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4" /> 동시 접속자 수
              </label>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">{users}명</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              value={users}
              onChange={(e) => setUsers(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>나 혼자 (1명)</span>
              <span>우리 반 전체 (40명)</span>
            </div>
          </div>

          {/* Wall Selector */}
          <div>
            <label className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
              <BrickWall className="w-4 h-4" /> 장애물(벽)
            </label>
            <div className="flex gap-2">
              {[0, 1, 2].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setWalls(cnt)}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                    walls === cnt 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cnt === 0 ? '없음 (개방)' : `벽 ${cnt}개`}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runSimulation}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            실험 시작 🚀
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-l-blue-500 animate-slide-up">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wide mb-1">연결 품질 점수</h3>
              <div className="text-5xl font-extrabold" style={{ color: getBarColor(result.quality) }}>
                {result.quality}<span className="text-2xl text-slate-400">/100</span>
              </div>
            </div>
            <div className="flex-[2] bg-slate-50 p-4 rounded-xl w-full">
              <h4 className="font-bold text-slate-700 mb-2">실험 피드백</h4>
              <ul className="space-y-2">
                {result.feedback.map((line, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span>•</span> {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* History Chart */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">최근 실험 기록</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history.slice(-10)}>
                <XAxis dataKey="id" tick={false} label={{ value: '최근 순서', position: 'insideBottom', offset: -5 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={() => '실험 결과'}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="quality" radius={[4, 4, 0, 0]}>
                  {history.slice(-10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.quality)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationTab;
