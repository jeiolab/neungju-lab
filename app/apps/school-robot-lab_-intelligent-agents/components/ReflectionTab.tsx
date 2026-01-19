import React, { useState } from 'react';
import { SCHOOL_SCENARIOS } from '../constants';
import { analyzeReflection } from '../services/geminiService';
import { Send, Bot, Loader2 } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState(SCHOOL_SCENARIOS[0].id);
  const [inputs, setInputs] = useState({ sensor: '', decision: '', action: '' });
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scenario = SCHOOL_SCENARIOS.find(s => s.id === activeScenario) || SCHOOL_SCENARIOS[0];

  const handleAnalyze = async () => {
    if (!inputs.sensor || !inputs.decision || !inputs.action) {
      alert("3가지 요소를 모두 작성해주세요!");
      return;
    }
    
    setLoading(true);
    setAiFeedback(null);
    
    const result = await analyzeReflection({
      scenario: scenario.label,
      sensor: inputs.sensor,
      decision: inputs.decision,
      action: inputs.action
    });

    setAiFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 pb-12">
      
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">1. 상황 선택하기</h3>
          <div className="grid grid-cols-1 gap-2">
            {SCHOOL_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveScenario(s.id);
                  setAiFeedback(null);
                }}
                className={`p-3 text-left rounded-lg text-sm transition-colors border ${
                  activeScenario === s.id
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-100 rounded-lg text-sm text-slate-600">
            <strong>상황 설명:</strong> {scenario.description}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg mb-2 text-slate-800">2. 에이전트 설계하기</h3>
          
          <div>
            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">INPUT (센서)</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="예: 열화상 카메라로 사람 체온 감지"
              value={inputs.sensor}
              onChange={e => setInputs({...inputs, sensor: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-600 uppercase mb-1">PROCESS (판단)</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="예: 온도가 37.5도 이상이면 경고 판단"
              value={inputs.decision}
              onChange={e => setInputs({...inputs, decision: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-green-600 uppercase mb-1">OUTPUT (행동)</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              placeholder="예: 보건 선생님 호출 메시지 전송"
              value={inputs.action}
              onChange={e => setInputs({...inputs, action: e.target.value})}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 bg-slate-800 text-white font-bold rounded-lg shadow hover:bg-slate-700 flex justify-center items-center mt-4"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            AI 선생님에게 검사받기
          </button>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="relative">
        <div className={`h-full bg-indigo-900 rounded-xl p-8 text-white shadow-xl flex flex-col items-center justify-center text-center transition-all ${!aiFeedback ? 'opacity-90' : ''}`}>
          
          <div className="bg-white/10 p-4 rounded-full mb-6 backdrop-blur-sm">
            <Bot size={48} className="text-indigo-200" />
          </div>

          {loading ? (
            <div className="space-y-4">
               <p className="text-lg font-medium animate-pulse">학생의 설계를 분석하고 있어요...</p>
            </div>
          ) : aiFeedback ? (
            <div className="text-left w-full space-y-4 animate-fade-in">
              <h4 className="text-xl font-bold text-indigo-200 border-b border-indigo-700 pb-2">AI 선생님의 피드백</h4>
              <p className="whitespace-pre-wrap leading-relaxed text-indigo-50">
                {aiFeedback}
              </p>
              <div className="pt-6 mt-6 border-t border-indigo-800 text-center">
                <span className="text-sm text-indigo-400">잘 이해가 안 된다면 내용을 수정해서 다시 물어보세요!</span>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-xl font-bold mb-2">설계를 완료하고<br/>피드백을 받아보세요!</h4>
              <p className="text-indigo-300 text-sm">여러분의 아이디어가 실제로<br/>어떻게 작동할지 AI가 분석해줍니다.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ReflectionTab;