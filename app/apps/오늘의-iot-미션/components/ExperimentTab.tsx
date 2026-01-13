import React, { useState, useEffect } from 'react';
import { Sliders, Activity, Lock, Share2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { evaluateExperiment, isGeminiConfigured } from '../services/geminiService';

const ExperimentTab: React.FC = () => {
  const [automation, setAutomation] = useState<number>(50);
  const [sharing, setSharing] = useState<number>(50);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptanceScore, setAcceptanceScore] = useState<number>(50);

  // Calculate score locally for instant feedback
  useEffect(() => {
    // Logic: 
    // High automation requires high sharing for efficiency -> High Acceptance if balanced.
    // High automation but low sharing -> Low efficiency/Errors -> Low Acceptance.
    // Low automation but high sharing -> Privacy invasion without benefit -> Very Low Acceptance.
    
    const diff = Math.abs(automation - sharing);
    // Score is higher if automation and sharing are correlated (people accept sharing if they get automation benefits)
    // But extremely high sharing always has a privacy penalty.
    let baseScore = 100 - diff; 
    
    // Penalty for excessive sharing
    if (sharing > 80) baseScore -= 10;
    
    // Penalty for useless sharing (low automation, high sharing)
    if (automation < 30 && sharing > 50) baseScore -= 20;

    setAcceptanceScore(Math.max(0, Math.min(100, baseScore)));
  }, [automation, sharing]);

  const runSimulation = async () => {
    setLoading(true);
    const feedback = await evaluateExperiment(automation, sharing);
    setResult(feedback);
    setLoading(false);
  };

  const data = [
    { name: '수용', value: acceptanceScore },
    { name: '거부', value: 100 - acceptanceScore },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          마이크로 실험실
        </h2>
        <p className="text-gray-600 mb-6">
          미래 도시의 시스템을 설계해보세요. 자동화 수준과 데이터 공유 범위에 따라 시민들의 수용도가 달라집니다.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> 자동화 수준
                </label>
                <span className="text-blue-600 font-bold">{automation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={automation}
                onChange={(e) => setAutomation(Number(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                0% (완전 수동) <span className="float-right">100% (완전 AI 통제)</span>
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> 데이터 공유 범위
                </label>
                <span className="text-indigo-600 font-bold">{sharing}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sharing}
                onChange={(e) => setSharing(Number(e.target.value))}
                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                0% (나만 보기) <span className="float-right">100% (모두 공개)</span>
              </p>
            </div>

            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? '분석 중...' : '결과 확인하기'}
            </button>
            {!isGeminiConfigured() && (
               <p className="text-xs text-center text-orange-500">
                 * API 키가 없어 데모 모드로 작동합니다.
               </p>
            )}
          </div>

          {/* Results Visualization */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-gray-700 mb-2">사회 수용도 점수</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-gray-800">{acceptanceScore}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              {acceptanceScore >= 70 ? '대중이 환영하는 시스템입니다.' : 
               acceptanceScore >= 40 ? '논란이 예상되는 시스템입니다.' : '강한 저항에 부딪힐 것입니다.'}
            </p>
          </div>
        </div>

        {/* AI Feedback Area */}
        {result && (
          <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-lg animate-fade-in-up">
            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" /> AI 코치 피드백
            </h3>
            <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-line">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentTab;
