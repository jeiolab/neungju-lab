import React, { useState } from 'react';
import { Agent } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Brain, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';

interface TabThinkProps {
  agents: Agent[];
}

const TabThink: React.FC<TabThinkProps> = ({ agents }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || "");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const handleAnalyze = async () => {
    if (!selectedAgent) return;
    
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        당신은 학생들을 위한 전문 AI 로봇 공학 컨설턴트입니다.
        학생이 만든 다음 에이전트 설계를 분석해주세요:
        이름: ${selectedAgent.name}
        목표: ${selectedAgent.goal}
        환경: ${selectedAgent.environment}
        센서: ${selectedAgent.sensors.join(', ')}
        행동: ${selectedAgent.actions.join(', ')}
        특성: ${selectedAgent.characteristics}

        과제: 누락된 센서, 논리적 허점, 또는 환경과의 부조화로 인해 이 에이전트가 실패하거나 오작동할 수 있는 3가지 구체적인 시나리오를 식별하세요.
        출력 형식: 마크다운 형태의 간단한 글머리 기호 목록으로 3가지를 작성하세요. 격려하는 말투를 쓰되 내용은 현실적이어야 합니다. 전체 길이는 150단어 이내로 하세요.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "당신은 로봇 공학 개념을 친절하고 이해하기 쉽게 설명하는 선생님입니다.",
        }
      });

      setAnalysis(response.text || "분석을 생성할 수 없습니다.");
    } catch (err: any) {
      console.error(err);
      setError("AI 컨설턴트가 응답하지 않습니다. (API Key 또는 네트워크를 확인하세요)");
    } finally {
      setLoading(false);
    }
  };

  if (agents.length === 0) {
     return (
        <div className="text-center py-20 bg-white rounded-xl shadow border border-slate-100">
           <Brain size={48} className="mx-auto text-slate-300 mb-4" />
           <p className="text-slate-500 text-lg">분석할 에이전트가 없습니다. <br/>제작 탭에서 먼저 에이전트를 만들어주세요!</p>
        </div>
     )
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Sidebar: Select Agent */}
      <div className="md:col-span-1 space-y-4">
        <h3 className="font-bold text-slate-700 text-lg px-2">분석할 에이전트 선택</h3>
        <div className="space-y-3">
           {agents.map(agent => (
             <button
                key={agent.id}
                onClick={() => {
                    setSelectedAgentId(agent.id);
                    setAnalysis(null);
                    setError(null);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedAgentId === agent.id ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-indigo-300'}`}
             >
                <div className="font-bold text-slate-800 text-lg">{agent.name}</div>
                <div className="text-sm text-slate-500 truncate mt-1">{agent.goal}</div>
             </button>
           ))}
        </div>
      </div>

      {/* Main: Analysis */}
      <div className="md:col-span-2">
        {selectedAgent ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedAgent.name} 정밀 진단</h2>
                  <p className="text-sm text-slate-500">잠재적인 문제 상황을 예측해봅니다.</p>
               </div>
               <button 
                 onClick={handleAnalyze}
                 disabled={loading}
                 className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
               >
                 {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                 {loading ? "분석 중..." : "시뮬레이션 실행"}
               </button>
            </div>
            
            <div className="p-8 flex-1">
               {error ? (
                   <div className="text-red-500 flex flex-col items-center justify-center h-full text-center p-8 bg-red-50 rounded-xl">
                       <AlertTriangle size={48} className="mb-4" />
                       <p className="font-bold">{error}</p>
                   </div>
               ) : analysis ? (
                   <div className="prose prose-slate prose-lg max-w-none animate-fade-in leading-relaxed">
                      <div className="bg-amber-50 border-l-4 border-amber-500 p-5 mb-6 text-amber-900 rounded-r-lg shadow-sm">
                          <strong className="block mb-1 text-lg">💡 컨설턴트 피드백:</strong> 
                          현실 세계에서는 이런 일이 발생할 수 있어요.
                      </div>
                      <div dangerouslySetInnerHTML={{ 
                          // Simple markdown parser for bold and list items
                          __html: analysis
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-700">$1</strong>')
                              .replace(/\n- /g, '<div class="flex gap-2 mb-3"><span class="text-indigo-500 mt-1">•</span><span>') 
                              .replace(/\n/g, '</span></div>')
                          }} 
                      />
                   </div>
               ) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center py-20">
                       <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                           <Brain size={48} className="text-slate-300" />
                       </div>
                       <p className="text-lg">오른쪽 상단의 <strong className="text-indigo-500">시뮬레이션 실행</strong> 버튼을 눌러<br/>AI에게 피드백을 받아보세요.</p>
                   </div>
               )}
            </div>
          </div>
        ) : (
            <div className="h-full flex items-center justify-center text-slate-400">에이전트를 선택해주세요.</div>
        )}
      </div>
    </div>
  );
};

export default TabThink;