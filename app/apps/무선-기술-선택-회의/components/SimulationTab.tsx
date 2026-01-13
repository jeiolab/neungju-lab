import React, { useState, useEffect } from 'react';
import { SCENARIOS, TECH_PROFILES } from '../constants';
import { TechType } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface SimulationTabProps {
  onDecisionComplete: (scenarioId: string, score: number) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onDecisionComplete }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechType | null>(null);
  const [sliderSecurity, setSliderSecurity] = useState<number>(50);
  const [sliderDistance, setSliderDistance] = useState<number>(50);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId);
  const tech = TECH_PROFILES.find(t => t.id === selectedTech);

  // Reset state when changing scenario
  useEffect(() => {
    setSelectedTech(null);
    setSliderSecurity(50);
    setSliderDistance(50);
    setResult(null);
  }, [selectedScenarioId]);

  const calculateScore = () => {
    if (!scenario || !tech) return;

    let score = 0;
    let feedback = "";

    // 1. Tech Match (60 pts)
    if (tech.id === scenario.requiredTech) {
      score += 60;
    } else {
      // Partial credit logic could go here, but keeping it simple for now
      score += 10; 
    }

    // 2. Slider Accuracy (40 pts)
    // Distance
    const distDiff = Math.abs(scenario.idealAttributes.distance - sliderDistance);
    if (distDiff < 15) score += 20;
    else if (distDiff < 30) score += 10;
    
    // Security
    const secDiff = Math.abs(scenario.idealAttributes.security - sliderSecurity);
    if (secDiff < 15) score += 20;
    else if (secDiff < 30) score += 10;

    // Generate Feedback
    if (score >= 90) {
      feedback = `완벽합니다! ${tech.name}은(는) 이 상황에 최적입니다. 거리와 보안 중요도 판단도 정확했습니다.`;
    } else if (tech.id !== scenario.requiredTech) {
      feedback = `아쉽네요. ${tech.name}보다는 다른 기술이 더 적합할 것 같습니다. ${scenario.contextHint}`;
    } else {
      feedback = `기술 선택은 옳았지만, 트레이드오프(중요도) 설정이 조금 빗나갔어요. ${scenario.idealAttributes.security > 60 ? '보안을 더 신경써야 합니다.' : ''} ${scenario.idealAttributes.distance < 30 ? '거리는 짧게 유지하는게 핵심입니다.' : ''}`;
    }

    setResult({ score, feedback });
    onDecisionComplete(scenario.id, score);
  };

  const chartData = tech && scenario ? [
    { subject: '거리', A: tech.distance, B: scenario.idealAttributes.distance, fullMark: 100 },
    { subject: '속도', A: tech.speed, B: 50, fullMark: 100 }, // Scenario speed generic baseline
    { subject: '보안', A: tech.security, B: scenario.idealAttributes.security, fullMark: 100 },
    { subject: '비용', A: tech.cost, B: 50, fullMark: 100 },
    { subject: '편의', A: tech.convenience, B: 50, fullMark: 100 },
  ] : [];

  if (!selectedScenarioId) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">시나리오를 선택하세요</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenarioId(s.id)}
              className="bg-white p-6 rounded-lg shadow hover:bg-blue-50 text-left transition"
            >
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <button 
        onClick={() => setSelectedScenarioId(null)}
        className="text-gray-500 hover:text-gray-800 text-sm mb-4"
      >
        ← 시나리오 목록으로 돌아가기
      </button>

      {/* Scenario Header */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
        <h2 className="text-xl font-bold text-indigo-900 mb-2">{scenario?.title}</h2>
        <p className="text-gray-700">{scenario?.description}</p>
        <div className="mt-2 flex items-center text-sm text-indigo-600">
          <Info className="w-4 h-4 mr-1" />
          <span>힌트: {scenario?.contextHint}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. 기술 선택</label>
            <div className="grid grid-cols-2 gap-2">
              {TECH_PROFILES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => !result && setSelectedTech(t.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium border transition
                    ${selectedTech === t.id 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                    ${result ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={!!result}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4">2. 중요도 설정 (트레이드오프)</h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>보안 낮음</span>
                <span className="font-bold text-blue-600">보안 중요도: {sliderSecurity}</span>
                <span>보안 높음</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderSecurity}
                onChange={(e) => setSliderSecurity(parseInt(e.target.value))}
                disabled={!!result}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>단거리</span>
                <span className="font-bold text-green-600">거리 필요성: {sliderDistance}</span>
                <span>장거리</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderDistance}
                onChange={(e) => setSliderDistance(parseInt(e.target.value))}
                disabled={!!result}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {!result ? (
            <button
              onClick={calculateScore}
              disabled={!selectedTech}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition
                ${selectedTech ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              결정 완료 & 결과 확인
            </button>
          ) : (
            <button
              onClick={() => setSelectedScenarioId(null)}
              className="w-full py-3 rounded-lg font-bold text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50"
            >
              다른 시나리오 도전
            </button>
          )}
        </div>

        {/* Visualization & Result */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-lg min-h-[400px]">
          {selectedTech ? (
            <>
               <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="선택한 기술 스펙"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="시나리오 요구사항"
                      dataKey="B"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {result && (
                <div className={`mt-4 p-4 rounded-lg w-full ${result.score >= 80 ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
                  <div className="flex items-center mb-2">
                    {result.score >= 80 ? <CheckCircle className="w-6 h-6 mr-2" /> : <AlertTriangle className="w-6 h-6 mr-2" />}
                    <h3 className="font-bold text-lg">점수: {result.score}점</h3>
                  </div>
                  <p className="text-sm">{result.feedback}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p>왼쪽에서 기술을 선택하면<br/>분석 차트가 나타납니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
