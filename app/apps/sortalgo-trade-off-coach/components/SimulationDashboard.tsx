import React, { useState, useEffect, useMemo } from 'react';
import { Algorithm, Scenario, Recommendation, UserState } from '../types';
import { SCENARIOS, ALGORITHMS } from '../constants';
import { evaluateReasoning } from '../services/geminiService';
import { awardXP, awardBadge } from '../services/storageService';
import { Play, RotateCcw, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface Props {
  userState: UserState;
  onUpdateUser: (newState: UserState) => void;
}

export const SimulationDashboard: React.FC<Props> = ({ userState, onUpdateUser }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [weights, setWeights] = useState({ time: 50, memory: 30, predictability: 20 });
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [userReasoning, setUserReasoning] = useState('');
  const [feedback, setFeedback] = useState<{ score: number; text: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Recommendation Engine Logic
  const calculateRecommendation = () => {
    // Normalize weights to ensure sum is effectively treated as ratios
    const totalWeight = weights.time + weights.memory + weights.predictability;
    const wT = totalWeight === 0 ? 0 : weights.time / totalWeight;
    const wM = totalWeight === 0 ? 0 : weights.memory / totalWeight;
    const wP = totalWeight === 0 ? 0 : weights.predictability / totalWeight;

    const scores = ALGORITHMS.map(algo => {
      let score = 
        (algo.baseScores.time * wT) + 
        (algo.baseScores.memory * wM) + 
        (algo.baseScores.predictability * wP);

      // Scenario Modifiers
      if (selectedScenario.id === 'huge-data') {
        if (algo.complexityTime === 'O(N²)') score -= 5; // Heavily penalize slow algos
      }
      if (selectedScenario.id === 'low-memory') {
        if (algo.id === 'merge') score -= 4; // Penalize extra space
        if (algo.complexitySpace === 'O(1)') score += 2;
      }
      if (selectedScenario.id === 'almost-sorted') {
        if (algo.id === 'insertion') score += 6; // Massive boost for insertion
      }
      if (selectedScenario.id === 'predictable') {
        if (algo.id === 'quick') score -= 3; // Risk of O(N^2)
        if (algo.id === 'merge') score += 2; // Guaranteed O(N log N)
      }

      return { algo, score };
    });

    scores.sort((a, b) => b.score - a.score);

    const primary = scores[0].algo;
    const alternative = scores[1].algo;

    // Generate dynamic reasoning text based on high weights
    const getReasoning = (algo: Algorithm) => {
      const reasons = [];
      if (wT > 0.4 && algo.baseScores.time >= 8) reasons.push("빠른 처리 속도");
      if (wT > 0.4 && selectedScenario.id === 'almost-sorted' && algo.id === 'insertion') reasons.push("거의 정렬된 데이터 최적화");
      if (wM > 0.4 && algo.baseScores.memory >= 8) reasons.push("적은 메모리 사용량");
      if (wP > 0.4 && algo.baseScores.predictability >= 8) reasons.push("안정적인 성능 보장");
      if (reasons.length === 0) return "전반적인 균형이 좋음";
      return reasons.join(", ");
    };

    setRecommendation({
      primary,
      alternative,
      reasoning: {
        time: wT > 0.5 ? "시간 가중치가 높아 빠른 알고리즘 우선" : "시간 효율성 고려",
        memory: wM > 0.5 ? "메모리 제약이 중요한 요소로 작용" : "공간 효율성 고려",
        predictability: wP > 0.5 ? "최악의 경우를 피하는 것이 핵심" : "안정성 고려"
      }
    });
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateRecommendation();
  }, [selectedScenario, weights]);

  const handleReasoningSubmit = async () => {
    if (!userReasoning.trim()) return;
    setIsEvaluating(true);
    
    const result = await evaluateReasoning(
      selectedScenario.description,
      recommendation?.primary.name || '',
      userReasoning
    );
    
    setFeedback({ score: result.score, text: result.feedback });
    setIsEvaluating(false);

    // Gamification Logic
    let newState = awardXP(10, userState); // Base XP for trying
    if (result.score > 80) {
      newState = awardXP(20, newState); // Bonus
    }
    
    // Check for badges
    if (selectedScenario.id === 'predictable' && recommendation?.primary.id !== 'quick') {
      newState = awardBadge("피벗 함정 회피", newState);
    }
    if (selectedScenario.id === 'low-memory' && recommendation?.primary.complexitySpace === 'O(1)') {
      newState = awardBadge("메모리 절약 설계자", newState);
    }

    onUpdateUser(newState);
  };

  const totalWeight = weights.time + weights.memory + weights.predictability;
  const isBalanceWarning = totalWeight !== 100;

  return (
    <div className="space-y-8">
      {/* 1. Scenario Selection */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          시나리오 선택
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenario(scenario);
                setFeedback(null);
                setUserReasoning('');
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                selectedScenario.id === scenario.id
                  ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                  : 'border-slate-200 hover:border-indigo-300 bg-white'
              }`}
            >
              <div className="text-3xl mb-2">{scenario.icon}</div>
              <h3 className="font-bold text-slate-900">{scenario.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-3">{scenario.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Weight Sliders */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
          우선순위 가중치 설정 (합계: {totalWeight}/100)
        </h2>
        
        {isBalanceWarning && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-700 text-sm rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>가중치 합이 100이 되도록 조정해보세요. (현재 시스템은 비율로 자동 계산합니다)</span>
          </div>
        )}

        <div className="space-y-6">
          {(['time', 'memory', 'predictability'] as const).map((key) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700 capitalize">
                  {key === 'time' ? '⏱️ 시간 (속도)' : key === 'memory' ? '💾 메모리 (공간)' : '🛡️ 안정성/예측가능성'}
                </label>
                <span className="text-sm font-bold text-indigo-600">{weights[key]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights[key]}
                onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Recommendation Engine Output */}
      {recommendation && (
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-md">
           <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
            AI 추천 결과
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Recommendation */}
            <div className="bg-white p-5 rounded-lg border-2 border-indigo-500 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">
                추천 1순위
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{recommendation.primary.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{recommendation.primary.complexityTime} • {recommendation.primary.complexitySpace}</p>
              
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{recommendation.reasoning.time}</span>
                </p>
                <p className="flex items-start gap-2">
                   <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                   <span>{recommendation.reasoning.memory}</span>
                </p>
                <p className="flex items-start gap-2">
                   <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                   <span>{recommendation.reasoning.predictability}</span>
                </p>
              </div>
            </div>

             {/* Alternative Recommendation */}
             <div className="bg-white/80 p-5 rounded-lg border border-slate-300 border-dashed">
              <div className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">대안 (2순위)</div>
              <h3 className="text-xl font-bold text-slate-700 mb-1">{recommendation.alternative.name}</h3>
              <p className="text-sm text-slate-500 mb-3">{recommendation.alternative.description}</p>
              <div className="bg-slate-100 p-2 rounded text-xs text-slate-600">
                <Info className="w-3 h-3 inline mr-1" />
                1순위와 비교: {
                  recommendation.primary.baseScores.memory < recommendation.alternative.baseScores.memory 
                  ? "메모리는 더 적게 쓰지만 느릴 수 있음" 
                  : "성능은 비슷하나 특성이 다름"
                }
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Reasoning Input */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-2">🤔 나의 선택 이유 작성하기</h2>
        <p className="text-sm text-slate-500 mb-4">왜 이 결과가 나왔을까요? 혹은 다른 생각이 있나요? 작성하면 AI 코치가 피드백을 줍니다.</p>
        
        <textarea
          value={userReasoning}
          onChange={(e) => setUserReasoning(e.target.value)}
          placeholder="예: 데이터가 거의 정렬되어 있어서 삽입 정렬이 빠를 것 같아 시간 가중치를 높였어."
          className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] mb-4 text-sm"
        />
        
        <div className="flex items-center justify-between">
           <button
            onClick={handleReasoningSubmit}
            disabled={isEvaluating || !userReasoning}
            className={`px-6 py-2 rounded-lg font-bold text-white transition-colors flex items-center gap-2 ${
              isEvaluating || !userReasoning ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isEvaluating ? '분석 중...' : '피드백 받기'}
            {!isEvaluating && <Play className="w-4 h-4" />}
          </button>
        </div>

        {feedback && (
          <div className="mt-6 animate-fadeIn bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-green-800">코치 피드백</h4>
              <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded">
                점수: {feedback.score}
              </span>
            </div>
            <p className="text-sm text-green-700">{feedback.text}</p>
          </div>
        )}
      </section>
    </div>
  );
};