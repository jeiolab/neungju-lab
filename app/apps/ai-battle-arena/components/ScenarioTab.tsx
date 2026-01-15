import React, { useState } from 'react';
import { getAiExplanation } from '../services/geminiService';
import { Bot, MessageSquare } from 'lucide-react';

const SCENARIOS = [
  { title: "넷플릭스 추천 시스템", desc: "사용자가 좋아할 만한 영화 추천하기" },
  { title: "자율주행 표지판 인식", desc: "카메라로 본 표지판이 '정지'인지 '직진'인지 판단" },
  { title: "고객 세분화 마케팅", desc: "비슷한 소비 패턴을 가진 고객끼리 그룹핑" },
];

const ScenarioTab: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAskAi = async (scenarioTitle: string) => {
    setSelectedScenario(scenarioTitle);
    setLoading(true);
    setAiResponse("");
    const response = await getAiExplanation(scenarioTitle);
    setAiResponse(response);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 pb-24">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">상황별 적용 가이드</h2>
        <p className="text-slate-400 text-sm">실생활 예시를 통해 어떤 학습 방법이 쓰이는지 AI 심판관에게 물어보세요.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => handleAskAi(s.title)}
            className={`p-4 rounded-xl border transition-all text-left h-full flex flex-col justify-between ${
              selectedScenario === s.title 
                ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div>
              <h3 className="font-bold text-white mb-2">{s.title}</h3>
              <p className="text-xs text-slate-400">{s.desc}</p>
            </div>
            <div className="mt-4 flex items-center text-xs text-blue-400 font-bold">
              <Bot className="w-3 h-3 mr-1" /> 심판관에게 묻기
            </div>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 min-h-[200px] relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="bg-slate-700 p-2 rounded-lg">
             <Bot className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-bold text-slate-200">AI 심판관의 판결</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-24 space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : aiResponse ? (
          <div className="text-slate-300 leading-relaxed animate-in fade-in">
            {aiResponse}
          </div>
        ) : (
          <div className="text-center text-slate-500 mt-8 flex flex-col items-center">
            <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
            <p>위 카드 중 하나를 선택하면 분석 결과가 나옵니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioTab;