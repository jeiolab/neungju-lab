import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Axis, Scenario, PolicyOption, UserStats } from '../types';
import { SCENARIOS } from '../constants';
import { AxisSlider, Button, Card, Badge } from './ui/UIComponents';
import { AlertTriangle, CheckCircle, RefreshCw, Zap, Users, Lock, ChevronRight } from 'lucide-react';
import { generateRandomScenario } from '../services/geminiService';

interface GameTabProps {
  userStats: UserStats;
  updateUserStats: (newStats: Partial<UserStats>) => void;
}

const GameTab: React.FC<GameTabProps> = ({ userStats, updateUserStats }) => {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [sliders, setSliders] = useState({
    [Axis.PUBLIC_INTEREST]: 50,
    [Axis.CONVENIENCE]: 50,
    [Axis.PRIVACY]: 50,
  });
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [result, setResult] = useState<{ score: number; feedback: string; recommendations: string[] } | null>(null);

  // Initialize selected policies when scenario changes
  useEffect(() => {
    setSelectedPolicies([]);
    setResult(null);
    setSliders({
      [Axis.PUBLIC_INTEREST]: 50,
      [Axis.CONVENIENCE]: 50,
      [Axis.PRIVACY]: 50,
    });
  }, [currentScenario.id]);

  const handleSliderChange = (axis: Axis, val: number) => {
    setSliders(prev => ({ ...prev, [axis]: val }));
  };

  const togglePolicy = (policyId: string) => {
    // Determine category of clicked policy
    const policy = currentScenario.policyOptions.find(p => p.id === policyId);
    if (!policy) return;

    setSelectedPolicies(prev => {
      // Remove other policies of the same category
      const othersRemoved = prev.filter(id => {
        const p = currentScenario.policyOptions.find(opt => opt.id === id);
        return p?.category !== policy.category;
      });
      return [...othersRemoved, policyId];
    });
  };

  const handleRandomScenario = async () => {
    setIsLoading(true);
    const newScenario = await generateRandomScenario();
    if (newScenario) {
      setCurrentScenario(newScenario);
    } else {
      alert("AI 시나리오 생성에 실패했습니다. 기본 시나리오를 사용합니다.");
    }
    setIsLoading(false);
  };

  const calculateScore = () => {
    // 1. Vector Distance Score
    const ideal = currentScenario.idealValues;
    const diffInterest = Math.abs(ideal[Axis.PUBLIC_INTEREST] - sliders[Axis.PUBLIC_INTEREST]);
    const diffConvenience = Math.abs(ideal[Axis.CONVENIENCE] - sliders[Axis.CONVENIENCE]);
    const diffPrivacy = Math.abs(ideal[Axis.PRIVACY] - sliders[Axis.PRIVACY]);
    
    const distanceScore = 100 - ((diffInterest + diffConvenience + diffPrivacy) / 3);

    // 2. Policy Score
    let correctPolicies = 0;
    const policiesSelected = currentScenario.policyOptions.filter(p => selectedPolicies.includes(p.id));
    policiesSelected.forEach(p => {
      if (p.isIdeal) correctPolicies++;
    });
    
    // Penalize if no policy selected for a category needed?
    // Simplified: Just add bonus for correct policies
    const policyScore = (correctPolicies / Math.max(1, policiesSelected.length)) * 20; // Max 20 bonus points

    // 3. Threshold Check Penalty
    let penalty = 0;
    let riskMsg = "";
    if (currentScenario.minThresholds[Axis.PRIVACY] && sliders[Axis.PRIVACY] < currentScenario.minThresholds[Axis.PRIVACY]!) {
        penalty += 30;
        riskMsg = "⚠️ 사생활 보호가 너무 취약합니다! ";
    }
    if (currentScenario.minThresholds[Axis.PUBLIC_INTEREST] && sliders[Axis.PUBLIC_INTEREST] < currentScenario.minThresholds[Axis.PUBLIC_INTEREST]!) {
        penalty += 20;
        riskMsg += "⚠️ 공익 목적 달성이 어렵습니다. ";
    }

    const finalScore = Math.max(0, Math.min(100, Math.round(distanceScore + policyScore - penalty)));

    // Generate Feedback
    let feedbackText = "";
    if (finalScore >= 80) feedbackText = currentScenario.feedback.balanced;
    else if (sliders[Axis.PRIVACY] < (ideal[Axis.PRIVACY] - 20)) feedbackText = currentScenario.feedback.tooRisky;
    else feedbackText = currentScenario.feedback.tooRestrictive;

    if (riskMsg) feedbackText = riskMsg + feedbackText;

    // Recommendations
    const recs: string[] = [];
    currentScenario.policyOptions.forEach(p => {
        if (p.isIdeal && !selectedPolicies.includes(p.id)) {
            recs.push(`추천: '${p.label}' 정책을 고려해보세요.`);
        }
    });
    if (recs.length === 0 && finalScore < 100) recs.push("슬라이더를 미세 조정하여 황금비를 찾아보세요.");

    setResult({
      score: finalScore,
      feedback: feedbackText,
      recommendations: recs.slice(0, 2)
    });

    // Update Global Stats
    updateUserStats({
      score: userStats.score + finalScore,
      streak: userStats.streak + 1,
      // Simple bias update logic
      decisionStyle: {
        [Axis.PUBLIC_INTEREST]: (userStats.decisionStyle[Axis.PUBLIC_INTEREST] + sliders[Axis.PUBLIC_INTEREST]) / 2,
        [Axis.CONVENIENCE]: (userStats.decisionStyle[Axis.CONVENIENCE] + sliders[Axis.CONVENIENCE]) / 2,
        [Axis.PRIVACY]: (userStats.decisionStyle[Axis.PRIVACY] + sliders[Axis.PRIVACY]) / 2,
      }
    });
  };

  const chartData = [
    { subject: '공익', A: sliders[Axis.PUBLIC_INTEREST], fullMark: 100 },
    { subject: '편의', A: sliders[Axis.CONVENIENCE], fullMark: 100 },
    { subject: '보호', A: sliders[Axis.PRIVACY], fullMark: 100 },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Left Column: Controls */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
             <div className="flex gap-2 overflow-x-auto pb-2 max-w-[70%]">
                {SCENARIOS.map(s => (
                    <button 
                        key={s.id}
                        onClick={() => setCurrentScenario(s)}
                        className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${currentScenario.id === s.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                    >
                        {s.category === 'disaster' && '🚨 '}
                        {s.category === 'school' && '🏫 '}
                        {s.title}
                    </button>
                ))}
             </div>
             <Button variant="secondary" size="sm" onClick={handleRandomScenario} disabled={isLoading}>
                 {isLoading ? <RefreshCw className="animate-spin w-4 h-4"/> : <div className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500"/>AI 랜덤</div>}
             </Button>
        </div>

        <Card title={currentScenario.title} className="border-l-4 border-l-blue-500">
          <p className="text-slate-600 mb-4">{currentScenario.description}</p>
          <div className="flex gap-2">
            <Badge color="slate">{currentScenario.category.toUpperCase()}</Badge>
            {result && <Badge color={result.score > 80 ? 'green' : 'orange'}>점수: {result.score}</Badge>}
          </div>
        </Card>

        {/* Sliders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <AxisSlider 
                label="공익 (Public Interest)" 
                value={sliders[Axis.PUBLIC_INTEREST]} 
                onChange={(v) => handleSliderChange(Axis.PUBLIC_INTEREST, v)} 
                colorClass="bg-blue-500"
                icon={<Users className="w-5 h-5 text-blue-500"/>}
            />
            <AxisSlider 
                label="편의 (Convenience)" 
                value={sliders[Axis.CONVENIENCE]} 
                onChange={(v) => handleSliderChange(Axis.CONVENIENCE, v)} 
                colorClass="bg-green-500"
                icon={<Zap className="w-5 h-5 text-green-500"/>}
            />
            <AxisSlider 
                label="사생활 보호 (Privacy)" 
                value={sliders[Axis.PRIVACY]} 
                onChange={(v) => handleSliderChange(Axis.PRIVACY, v)} 
                colorClass="bg-red-500"
                icon={<Lock className="w-5 h-5 text-red-500"/>}
            />
        </div>

        {/* Policy Cards */}
        <div className="space-y-3">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                정책 옵션 카드 <span className="text-xs font-normal text-slate-500">(하나씩 선택하세요)</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {currentScenario.policyOptions.map(option => (
                    <button
                        key={option.id}
                        onClick={() => togglePolicy(option.id)}
                        className={`p-3 rounded-xl border text-left text-sm transition-all ${
                            selectedPolicies.includes(option.id) 
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        <div className="text-xs text-slate-400 mb-1 font-mono uppercase">{option.category}</div>
                        <div className="font-medium text-slate-800">{option.label}</div>
                    </button>
                ))}
            </div>
        </div>

        {!result && (
            <Button size="lg" className="w-full" onClick={calculateScore}>
                결정 완료 (Submit)
            </Button>
        )}
      </div>

      {/* Right Column: Visualization & Result */}
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
             {/* Radar Chart */}
            <div className="w-full h-64 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#475569" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="내 결정"
                            dataKey="A"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fill="#3b82f6"
                            fillOpacity={0.5}
                        />
                        {result && (
                            <Radar
                                name="이상적 균형"
                                dataKey="fullMark" // Just visualizing full scope as background usually, but here ideally we'd map ideal values
                                // Implementing "Ideal" overlay is complex with current data structure in map, skipping for simplicity of display
                                // or we can create a secondary dataset.
                                stroke="transparent" 
                                fill="transparent"
                            />
                        )}
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="absolute top-4 right-4 text-xs text-slate-400">
                실시간 밸런스 모니터
            </div>
        </div>

        {result && (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">결과 리포트</h3>
                    <div className="text-3xl font-black text-blue-600">{result.score}<span className="text-sm text-slate-400 font-normal">/100</span></div>
                </div>
                
                <div className={`p-4 rounded-xl mb-4 flex items-start gap-3 ${result.score >= 80 ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
                    {result.score >= 80 ? <CheckCircle className="shrink-0 mt-1"/> : <AlertTriangle className="shrink-0 mt-1"/>}
                    <p className="font-medium">{result.feedback}</p>
                </div>

                {result.recommendations.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI 추천 개선안</p>
                        {result.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg">
                                <ChevronRight className="w-4 h-4 text-blue-500" />
                                {rec}
                            </div>
                        ))}
                    </div>
                )}
                
                <Button variant="secondary" className="w-full mt-6" onClick={() => {
                    setResult(null);
                    setSliders({ [Axis.PUBLIC_INTEREST]: 50, [Axis.CONVENIENCE]: 50, [Axis.PRIVACY]: 50 });
                    setSelectedPolicies([]);
                }}>
                    다시 조정하기
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default GameTab;
