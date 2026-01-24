import React, { useState, useMemo } from 'react';
import { SCENARIOS, SHARING_METHODS, BADGES } from '../constants';
import { Scenario, SharingMethod, UserState } from '../types';
import { getSimulationCoaching } from '../services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Play, RotateCcw, Award, Loader2, Bot } from 'lucide-react';

interface Props {
  userState: UserState;
  onComplete: (result: any) => void;
}

const Simulation: React.FC<Props> = ({ userState, onComplete }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [weights, setWeights] = useState({ speed: 5, security: 5, convenience: 5 });
  const [result, setResult] = useState<SharingMethod | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');

  // Calculate scores dynamically
  const scoredMethods = useMemo(() => {
    return SHARING_METHODS.map(method => {
      const score = 
        (method.stats.speed * weights.speed) +
        (method.stats.security * weights.security) +
        (method.stats.convenience * weights.convenience);
      return { ...method, totalScore: score };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [weights]);

  const handleSimulate = async () => {
    if (!selectedScenario) return;
    
    const bestMethod = scoredMethods[0];
    setResult(bestMethod);
    setAiLoading(true);

    const explanation = await getSimulationCoaching(
        selectedScenario.title,
        bestMethod.name,
        weights,
        bestMethod.stats
    );

    setAiExplanation(explanation);
    setAiLoading(false);

    onComplete({
        scenarioId: selectedScenario.id,
        weights,
        selectedMethodId: bestMethod.id,
        aiExplanation: explanation,
        score: bestMethod.totalScore
    });
  };

  const handleReset = () => {
    setResult(null);
    setAiExplanation('');
    setWeights({ speed: 5, security: 5, convenience: 5 });
    setSelectedScenario(null);
  };

  const radarData = useMemo(() => {
    if(!result) return [];
    return [
      { subject: '속도', A: result.stats.speed, fullMark: 10 },
      { subject: '보안', A: result.stats.security, fullMark: 10 },
      { subject: '편의', A: result.stats.convenience, fullMark: 10 },
    ];
  }, [result]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
           <Award className="text-yellow-500" />
           공유 의사결정 시뮬레이터
        </h2>
        <div className="text-sm text-gray-500">
            Level {userState.level} | EXP {userState.exp}%
        </div>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-slate-700">1. 상황 선택</h3>
            <div className="space-y-3">
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedScenario?.id === s.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-100 hover:border-indigo-300'}`}
                >
                  <div className="font-bold text-slate-800">{s.title}</div>
                  <div className="text-sm text-slate-500 mt-1">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={`transition-opacity ${selectedScenario ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="font-bold text-lg mb-4 text-slate-700">2. 가중치 설정 (0-10)</h3>
            
            <div className="space-y-6 bg-slate-50 p-6 rounded-xl">
              <div>
                <div className="flex justify-between mb-2">
                   <label className="font-semibold text-blue-600">속도 (Speed)</label>
                   <span className="font-mono font-bold bg-white px-2 rounded border">{weights.speed}</span>
                </div>
                <input 
                  type="range" min="0" max="10" 
                  value={weights.speed} 
                  onChange={(e) => setWeights({...weights, speed: Number(e.target.value)})}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                   <label className="font-semibold text-green-600">보안 (Security)</label>
                   <span className="font-mono font-bold bg-white px-2 rounded border">{weights.security}</span>
                </div>
                <input 
                  type="range" min="0" max="10" 
                  value={weights.security} 
                  onChange={(e) => setWeights({...weights, security: Number(e.target.value)})}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                   <label className="font-semibold text-purple-600">편의 (Convenience)</label>
                   <span className="font-mono font-bold bg-white px-2 rounded border">{weights.convenience}</span>
                </div>
                <input 
                  type="range" min="0" max="10" 
                  value={weights.convenience} 
                  onChange={(e) => setWeights({...weights, convenience: Number(e.target.value)})}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>

            <button 
                onClick={handleSimulate}
                className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Play fill="currentColor" /> 결과 분석하기
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                  <div className="bg-indigo-900 text-white p-6 rounded-t-2xl">
                    <div className="text-indigo-200 text-sm mb-1">AI 추천 공유 방식</div>
                    <div className="text-3xl font-bold">{result.name}</div>
                    <div className="mt-2 text-indigo-100 opacity-80">{result.description}</div>
                  </div>
                  <div className="bg-slate-50 border-x border-b border-slate-200 p-6 rounded-b-2xl shadow-sm">
                     <h4 className="font-bold flex items-center gap-2 mb-4 text-slate-700">
                        <Bot className="text-indigo-500" /> AI 코치 의견
                     </h4>
                     {aiLoading ? (
                        <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                            <Loader2 className="animate-spin" /> 분석 중입니다...
                        </div>
                     ) : (
                        <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line bg-white p-4 rounded-lg border border-slate-100">
                            {aiExplanation}
                        </div>
                     )}
                  </div>
              </div>

              <div className="bg-white rounded-xl border p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                        name={result.name}
                        dataKey="A"
                        stroke="#4f46e5"
                        fill="#6366f1"
                        fillOpacity={0.6}
                    />
                    <Legend />
                    </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="mt-8 flex justify-center">
              <button 
                onClick={handleReset}
                className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 flex items-center gap-2 transition-colors"
              >
                <RotateCcw size={18} /> 다른 상황 시뮬레이션
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;
