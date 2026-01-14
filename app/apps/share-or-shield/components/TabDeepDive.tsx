import React, { useState } from 'react';
import { getDeepDiveExplanation } from '../services/geminiService';

const TabDeepDive: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    
    const result = await getDeepDiveExplanation(input);
    setResponse(result);
    setLoading(false);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="h-full overflow-y-auto p-6 pb-24">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 font-tech">
          DEEP DIVE
        </h1>
        <p className="text-slate-400">AI에게 물어보세요: "왜 공유하면 안 되나요?"</p>
      </header>

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
          <textarea 
            className="w-full bg-slate-900 text-white p-4 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none resize-none h-32"
            placeholder="예: 친구가 찍은 내 엽기 사진을 단톡방에 올리는 건?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <div className="mt-3 flex justify-end">
              <button 
                onClick={handleAsk}
                disabled={loading || !input}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                  <span>AI 분석 요청</span>
              </button>
          </div>
      </div>

      {response && (
          <div className="bg-slate-800/80 p-6 rounded-xl border border-purple-500/30 animate-fade-in mb-6">
              <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold">
                  <i className="fas fa-robot"></i>
                  <span>AI Analyst Report</span>
              </div>
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {response}
              </div>
          </div>
      )}

      <div className="space-y-2">
          <p className="text-sm text-slate-500 font-bold">추천 질문:</p>
          <button onClick={() => handleSuggestion('학교 시험 족보를 공유하는 것')} className="block w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors">
              👉 학교 시험 족보를 공유하는 것
          </button>
           <button onClick={() => handleSuggestion('길에서 주운 USB의 내용을 확인하는 것')} className="block w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors">
              👉 길에서 주운 USB의 내용을 확인하는 것
          </button>
           <button onClick={() => handleSuggestion('내 얼굴이 나온 CCTV 영상을 요청하는 것')} className="block w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors">
              👉 내 얼굴이 나온 CCTV 영상을 요청하는 것
          </button>
      </div>
    </div>
  );
};

export default TabDeepDive;
