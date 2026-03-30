import React, { useState } from 'react';
import { generateThinkingFeedback, generateRandomScenario } from '../services/geminiService';
import { Lightbulb, Send, RefreshCw, MessageSquare } from 'lucide-react';

const ThinkingTab: React.FC = () => {
  const [scenario, setScenario] = useState<string>("비가 많이 와서 도로가 침수되었습니다. 버스는 우회해야 하고, 자전거는 위험합니다.");
  const [userSolution, setUserSolution] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  const handleNewScenario = async () => {
    setIsGeneratingScenario(true);
    const newScenario = await generateRandomScenario();
    setScenario(newScenario);
    setFeedback("");
    setUserSolution("");
    setIsGeneratingScenario(false);
  };

  const handleSubmit = async () => {
    if (!userSolution.trim()) return;
    setIsLoading(true);
    const result = await generateThinkingFeedback(scenario, userSolution);
    setFeedback(result);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Left Column: Challenge */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-amber-100 to-orange-50 p-6 rounded-xl border border-amber-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              오늘의 돌발 상황
            </h3>
            <button 
              onClick={handleNewScenario}
              disabled={isGeneratingScenario}
              className="text-amber-700 hover:bg-amber-200 p-2 rounded-full transition"
            >
              <RefreshCw className={`w-5 h-5 ${isGeneratingScenario ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-lg text-amber-800 font-medium leading-relaxed">
            "{scenario}"
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-2">나의 해결책 설계</h4>
          <p className="text-sm text-slate-500 mb-4">
            이 상황에서 어떤 트레이드오프를 고려했나요? (예: 안전을 위해 지각을 감수하겠다 등)
          </p>
          <textarea
            value={userSolution}
            onChange={(e) => setUserSolution(e.target.value)}
            placeholder="여기에 해결책을 적어보세요..."
            className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !userSolution.trim()}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition ${
              isLoading || !userSolution.trim() 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                AI 코치에게 피드백 받기
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Feedback */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-300 relative overflow-hidden min-h-[400px]">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MessageSquare size={100} />
        </div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          🤖 AI 코치의 피드백
        </h3>
        
        {feedback ? (
          <div className="prose prose-invert max-w-none whitespace-pre-line animate-fade-in leading-relaxed">
            {feedback}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <p>왼쪽에서 해결책을 제출하면</p>
            <p>이곳에 분석 내용이 나타납니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingTab;