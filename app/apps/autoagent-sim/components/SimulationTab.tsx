import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, Shield, Zap, Users, Monitor, Terminal } from 'lucide-react';
import { AgentStats, GameState, SimulationResult } from '../types';
import { SCENARIOS } from '../constants';
import { runSimulation } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SimulationTab: React.FC = () => {
  const [stats, setStats] = useState<AgentStats>({ speed: 50, safety: 50, social: 50 });
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [currentScenario, setCurrentScenario] = useState(SCENARIOS[0]);

  const handleStart = async () => {
    setGameState(GameState.RUNNING);
    // Pick a random scenario
    const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setCurrentScenario(randomScenario);

    const simResult = await runSimulation(stats, randomScenario);
    setResult(simResult);
    setGameState(GameState.COMPLETED);
  };

  const handleReset = () => {
    setGameState(GameState.IDLE);
    setResult(null);
  };

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case 'S': return 'text-purple-500';
      case 'A': return 'text-green-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-yellow-500';
      case 'D': return 'text-orange-500';
      default: return 'text-red-500';
    }
  };

  const chartData = [
    { name: '속도', value: stats.speed, color: '#f59e0b', full: '속도/효율' },
    { name: '안전', value: stats.safety, color: '#10b981', full: '안전/반응' },
    { name: '사회', value: stats.social, color: '#3b82f6', full: '사회/협력' },
  ];

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-full">
      {/* Left Column: Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
             <div className="bg-yellow-100 p-2 rounded-lg"><Zap className="w-5 h-5 text-yellow-600" /></div>
             <h2 className="text-lg font-bold text-gray-900">파라미터 설정 (Controls)</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="flex justify-between text-sm font-bold mb-3 text-gray-700">
                <span className="flex items-center gap-2"><Zap size={16} className="text-yellow-500" /> 속도 & 효율성</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{stats.speed}%</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={stats.speed} 
                onChange={(e) => setStats({...stats, speed: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">목적지 도달 시간을 단축하지만, 사고 위험이 증가할 수 있습니다.</p>
            </div>

            <div>
              <label className="flex justify-between text-sm font-bold mb-3 text-gray-700">
                <span className="flex items-center gap-2"><Shield size={16} className="text-green-500" /> 안전 & 반응성</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{stats.safety}%</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={stats.safety} 
                onChange={(e) => setStats({...stats, safety: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">돌발 상황에 민감하게 반응하지만, 주행 속도가 느려질 수 있습니다.</p>
            </div>

            <div>
              <label className="flex justify-between text-sm font-bold mb-3 text-gray-700">
                <span className="flex items-center gap-2"><Users size={16} className="text-blue-500" /> 협력 & 사회성</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{stats.social}%</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={stats.social} 
                onChange={(e) => setStats({...stats, social: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">주변 차량에게 양보를 잘하지만, 교통 흐름에 따라 지체될 수 있습니다.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Parameter Visualization</h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={40} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Viewport */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="bg-gray-900 rounded-2xl p-8 flex-1 shadow-2xl flex flex-col relative overflow-hidden min-h-[500px]">
          {/* Header */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-3">
              <Monitor className="text-gray-400" size={20} />
              <span className="text-gray-400 font-mono text-sm">SIMULATION_VIEWPORT_v1.0</span>
            </div>
            {gameState === GameState.IDLE && (
              <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-mono animate-pulse">
                SYSTEM READY
              </div>
            )}
            {gameState === GameState.RUNNING && (
               <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-mono animate-pulse">
                PROCESSING SCENARIO...
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            {gameState === GameState.IDLE && (
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="text-white ml-1" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">시뮬레이션 준비 완료</h3>
                <p className="text-gray-400 mb-8">왼쪽 패널에서 에이전트의 성향을 설정한 후 운행을 시작하세요.</p>
                <button
                  onClick={handleStart}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <Play size={20} /> 운행 시작 (Launch)
                </button>
              </div>
            )}

            {gameState === GameState.RUNNING && (
               <div className="text-center">
                 <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                 <h3 className="text-xl font-mono text-white">AI DRIVING AGENT ACTIVATED</h3>
                 <p className="text-gray-500 mt-2 font-mono text-sm">Calculaing physics and ethics...</p>
               </div>
            )}

            {gameState === GameState.COMPLETED && result && (
              <div className="w-full max-w-2xl animate-fade-in-up">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden text-left">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                      <div>
                        <div className="text-xs text-indigo-300 font-mono mb-1">SCENARIO: {currentScenario.id.toUpperCase()}</div>
                        <h3 className="text-2xl font-bold text-white">{currentScenario.name}</h3>
                      </div>
                      <div className={`text-5xl font-black ${getGradeColor(result.grade)}`}>{result.grade}</div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <Terminal size={16} className="text-gray-400" />
                           <h4 className="text-white font-bold text-lg">{result.outcome}</h4>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{result.description}</p>
                      </div>
                      
                      <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30">
                        <h5 className="text-indigo-300 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                          <AlertTriangle size={12} /> Decision Analysis
                        </h5>
                        <p className="text-indigo-100 text-sm leading-relaxed whitespace-pre-line">
                          {result.analysis}
                        </p>
                      </div>

                      <div className="flex justify-center pt-2">
                         <button 
                            onClick={handleReset}
                            className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors text-sm"
                          >
                            <RotateCcw size={16} /> 다시 시도 (Reset)
                          </button>
                      </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
             <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-indigo-500"></div>
             <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-indigo-500"></div>
             <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
