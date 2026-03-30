import React, { useState } from 'react';
import { THOUGHT_SCENARIOS } from '../constants';
import { evaluateActionPlan } from '../services/geminiService';
import { MessageSquare, Send, Sparkles, Loader2 } from 'lucide-react';

const ThoughtLab: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState(THOUGHT_SCENARIOS[0].id);
  const [userPlan, setUserPlan] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scenario = THOUGHT_SCENARIOS.find(s => s.id === selectedScenarioId) || THOUGHT_SCENARIOS[0];

  const handleSubmit = async () => {
    if (!userPlan.trim()) return;
    setIsLoading(true);
    setFeedback(null);
    
    try {
        const result = await evaluateActionPlan(scenario.text, userPlan);
        setFeedback(result || null);
    } catch (e) {
        setFeedback("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Sparkles className="text-purple-500" /> AI 코치와 함께 생각하기
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-500 mb-2">상황 선택</label>
        <div className="flex flex-wrap gap-2">
            {THOUGHT_SCENARIOS.map(s => (
                <button
                    key={s.id}
                    onClick={() => {
                        setSelectedScenarioId(s.id);
                        setFeedback(null);
                        setUserPlan('');
                    }}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedScenarioId === s.id ? 'bg-purple-100 border-purple-300 text-purple-800 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    {s.text.substring(0, 15)}...
                </button>
            ))}
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
        <h3 className="font-bold text-purple-900 mb-2">🤔 문제 상황</h3>
        <p className="text-purple-800 text-sm leading-relaxed">{scenario.text}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-500 mb-2">나의 해결 계획</label>
        <textarea
            value={userPlan}
            onChange={(e) => setUserPlan(e.target.value)}
            placeholder="예: DHCP 서버를 확인하고, 만약 안되면 수동 IP를 할당하겠습니다..."
            className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !userPlan.trim()}
        className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-300 flex items-center justify-center gap-2"
      >
        {isLoading ? <><Loader2 className="animate-spin" size={18}/> AI 분석 중...</> : <><Send size={18}/> 피드백 받기</>}
      </button>

      {feedback && (
          <div className="mt-6 bg-white border border-purple-200 rounded-lg p-5 shadow-sm animate-fade-in">
              <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <MessageSquare size={18}/> AI 코치의 피드백
              </h4>
              <div className="prose prose-sm prose-purple text-slate-700 whitespace-pre-wrap">
                  {feedback}
              </div>
          </div>
      )}
    </div>
  );
};

export default ThoughtLab;