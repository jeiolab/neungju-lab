import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SimulationState, MLMethodType, GoalType, RecommendationResult } from '../types';
import { Play, Info, Sliders, Database, Clock, Target } from 'lucide-react';

interface SimulationProps {
  onDecisionMade: () => void;
}

const Simulation: React.FC<SimulationProps> = ({ onDecisionMade }) => {
  // Initial State
  const [state, setState] = useState<SimulationState>({
    goal: GoalType.CLUB_REC,
    accuracyImportance: 5,
    explainabilityImportance: 5,
    timeConstraint: 5,
    hasLabeledData: true,
  });

  const [result, setResult] = useState<RecommendationResult | null>(null);

  // Logic Engine
  const calculateRecommendation = (s: SimulationState): RecommendationResult => {
    let scores: Record<MLMethodType, number> = {
      [MLMethodType.SUPERVISED]: 0,
      [MLMethodType.UNSUPERVISED]: 0,
      [MLMethodType.REINFORCEMENT]: 0,
      [MLMethodType.RULE_BASED]: 0,
    };

    // Baseline adjustments based on Goal
    if (s.goal === GoalType.GAME_DIFF) {
      scores[MLMethodType.REINFORCEMENT] += 50; // Huge boost for RL in games
    } else if (s.goal === GoalType.CLUB_REC) {
      scores[MLMethodType.SUPERVISED] += 20; // Classic supervised
      scores[MLMethodType.UNSUPERVISED] += 10; // Clustering potential
    } else {
      scores[MLMethodType.SUPERVISED] += 20; // Lunch sat is usually regression
    }

    // Constraint: Labeled Data
    if (!s.hasLabeledData) {
      scores[MLMethodType.SUPERVISED] = -100; // Impossible
      scores[MLMethodType.UNSUPERVISED] += 40; // Best option usually
      scores[MLMethodType.RULE_BASED] += 20; // Fallback
      scores[MLMethodType.REINFORCEMENT] += 0; // RL generates its own data via interaction, but hard to setup
    } else {
      scores[MLMethodType.SUPERVISED] += 30; // Gold standard if data exists
    }

    // Slider: Accuracy Importance (0-10)
    scores[MLMethodType.SUPERVISED] += s.accuracyImportance * 4;
    scores[MLMethodType.REINFORCEMENT] += s.accuracyImportance * 3;
    scores[MLMethodType.RULE_BASED] -= s.accuracyImportance * 2; // Rules are rigid

    // Slider: Explainability Importance (0-10)
    scores[MLMethodType.RULE_BASED] += s.explainabilityImportance * 5;
    scores[MLMethodType.SUPERVISED] -= s.explainabilityImportance * 2; // Black box penalty (simplified)
    scores[MLMethodType.REINFORCEMENT] -= s.explainabilityImportance * 3; // Very hard to explain policies

    // Slider: Time Constraint (0-10, 10 is very little time/resources)
    scores[MLMethodType.RULE_BASED] += s.timeConstraint * 4; // Fast to write a few rules
    scores[MLMethodType.SUPERVISED] -= s.timeConstraint * 2; // Training takes time
    scores[MLMethodType.REINFORCEMENT] -= s.timeConstraint * 5; // Takes forever to train

    // Find Winner
    const sortedMethods = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const bestMethod = sortedMethods[0][0] as MLMethodType;
    const bestScore = sortedMethods[0][1];

    // Generate Feedback
    let feedback: string[] = [];
    let reason = "";
    let hiddenCost = "";
    let nextStep = "";

    switch (bestMethod) {
      case MLMethodType.SUPERVISED:
        reason = "정답 데이터(레이블)가 있고 정확도를 중요하게 생각하셨군요.";
        feedback = [
          "예측 정확도가 가장 높은 선택입니다.",
          "레이블이 달린 데이터셋을 지속적으로 관리해야 합니다.",
          "추천 시스템에서 가장 표준적으로 쓰이는 방식입니다."
        ];
        hiddenCost = "새로운 데이터에 일일이 정답을 다는 비용이 듭니다.";
        nextStep = "데이터를 학습용(Train)과 테스트용(Test)으로 나누세요.";
        break;
      case MLMethodType.UNSUPERVISED:
        reason = !s.hasLabeledData 
          ? "정답 데이터가 없으므로 발견(Discovery)이 가능한 이 방법이 최선입니다." 
          : "레이블이 있어도 숨겨진 패턴을 찾는 데 유리합니다.";
        feedback = [
          "몰랐던 사용자 그룹(군집)을 발견할 수 있습니다.",
          "구체적인 결과를 예측하기보다는 패턴을 보여줍니다.",
          "데이터가 없는 '콜드 스타트' 문제에 유용합니다."
        ];
        hiddenCost = "나눠진 그룹이 무엇을 의미하는지 사람이 해석해야 합니다.";
        nextStep = "K-Means 알고리즘을 돌려보고 그룹을 시각화하세요.";
        break;
      case MLMethodType.REINFORCEMENT:
        reason = s.goal === GoalType.GAME_DIFF 
          ? "변화하는 게임 환경에 가장 적합한 선택입니다." 
          : "정적인 문제에 너무 복잡한 방법을 선택하셨습니다.";
        feedback = [
          "시행착오를 통해 최적의 전략을 스스로 학습합니다.",
          "계산 비용과 학습 시간이 매우 많이 듭니다.",
          "환경 변화에 자동으로 적응할 수 있습니다."
        ];
        hiddenCost = "완벽한 시뮬레이션 환경을 먼저 구축해야 합니다.";
        nextStep = "보상 함수(Reward Function)를 정교하게 정의하세요.";
        break;
      case MLMethodType.RULE_BASED:
        reason = "설명 가능성과 속도를 최우선으로 하거나, 데이터가 부족한 상황입니다.";
        feedback = [
          "왜 이런 결과가 나왔는지 100% 투명하게 설명할 수 있습니다.",
          "구현이 매우 빠르고 수정이 쉽습니다.",
          "복잡한 패턴을 파악하지 못해 정확도는 낮을 수 있습니다."
        ];
        hiddenCost = "규칙이 늘어날수록 관리가 악몽처럼 변할 수 있습니다.";
        nextStep = "전문가 인터뷰를 통해 초기 규칙을 정의하세요.";
        break;
    }

    return { method: bestMethod, score: bestScore, reason, feedback, hiddenCost, nextStep };
  };

  const handleSimulate = () => {
    const res = calculateRecommendation(state);
    setResult(res);
    onDecisionMade();
  };

  const chartData = [
    { subject: '정확도', A: state.accuracyImportance, fullMark: 10 },
    { subject: '설명가능성', A: state.explainabilityImportance, fullMark: 10 },
    { subject: '시간제약', A: state.timeConstraint, fullMark: 10 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
      {/* Control Panel */}
      <div className="lg:col-span-5 bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Target className="text-indigo-600" />
            1. 목표 선택
          </h2>
          <div className="flex flex-col gap-2">
            {Object.values(GoalType).map((g) => (
              <button
                key={g}
                onClick={() => setState({ ...state, goal: g })}
                className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
                  state.goal === g 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Sliders className="text-indigo-600" />
            2. 트레이드오프 설정
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">정확도 중요도</label>
                <span className="text-sm font-bold text-indigo-600">{state.accuracyImportance}/10</span>
              </div>
              <input 
                type="range" min="0" max="10" 
                value={state.accuracyImportance}
                onChange={(e) => setState({...state, accuracyImportance: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">설명가능성 중요도</label>
                <span className="text-sm font-bold text-indigo-600">{state.explainabilityImportance}/10</span>
              </div>
              <input 
                type="range" min="0" max="10" 
                value={state.explainabilityImportance}
                onChange={(e) => setState({...state, explainabilityImportance: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">시간/비용 제약 (높을수록 촉박)</label>
                <span className="text-sm font-bold text-indigo-600">{state.timeConstraint}/10</span>
              </div>
              <input 
                type="range" min="0" max="10" 
                value={state.timeConstraint}
                onChange={(e) => setState({...state, timeConstraint: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Database className="text-indigo-600" />
            3. 데이터 제약
          </h2>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-700">정답(레이블) 데이터가 있나요?</span>
            <button 
              onClick={() => setState({...state, hasLabeledData: !state.hasLabeledData})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.hasLabeledData ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.hasLabeledData ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">레이블 데이터란 과거의 '정답' 기록을 의미합니다.</p>
        </div>

        <button 
          onClick={handleSimulate}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Play size={20} fill="currentColor" />
          의사결정 실행 (Run)
        </button>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-6">
        {/* Visualization */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
             <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">나의 의사결정 프로필</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                        name="My Requirements"
                        dataKey="A"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        fillOpacity={0.4}
                    />
                    </RadarChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Output Card */}
        {result ? (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl text-white p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">코치의 추천 방법</p>
                        <h2 className="text-3xl font-bold text-white mt-1">{result.method}</h2>
                    </div>
                    <div className="bg-white/10 p-3 rounded-full">
                         <Target className="text-emerald-400" size={32} />
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 mb-6 border-l-4 border-indigo-500">
                    <p className="font-medium text-indigo-200 mb-1">추천 이유</p>
                    <p className="text-slate-200">{result.reason}</p>
                </div>

                <div className="space-y-4 mb-6">
                    <h4 className="font-bold text-slate-300 border-b border-white/10 pb-2">분석 피드백</h4>
                    <ul className="space-y-2">
                        {result.feedback.map((line, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                <span className="text-emerald-400 mt-1">✓</span> {line}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                        <p className="text-rose-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Info size={12}/> 숨겨진 비용</p>
                        <p className="text-rose-100 text-sm">{result.hiddenCost}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                        <p className="text-blue-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Clock size={12}/> 다음 단계</p>
                        <p className="text-blue-100 text-sm">{result.nextStep}</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-gray-400">
                <Sliders size={48} className="mb-4 opacity-50" />
                <p>왼쪽 패널에서 조건을 설정하고 "실행"을 눌러보세요.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;