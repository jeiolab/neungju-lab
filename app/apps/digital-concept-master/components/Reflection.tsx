import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { getReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Send, User, Bot, Lightbulb } from 'lucide-react';

const Reflection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(CONCEPTS[0].term);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setFeedback(null);
    const response = await getReflectionFeedback(selectedTopic, input);
    setFeedback(response);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-full flex flex-col">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Lightbulb className="text-yellow-300" />
            생각 넓히기
        </h2>
        <p className="opacity-90 text-sm md:text-base">
          기술의 발전은 항상 '부작용(Side Effect)'을 동반합니다.<br/>
          아래 기술 중 하나를 선택하고, 발생할 수 있는 문제점과 해결책을 자유롭게 적어보세요.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar for topic selection */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto max-h-48 md:max-h-full">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">토픽 선택</h3>
            <div className="space-y-2">
                {CONCEPTS.slice(0, 5).map(c => (
                    <button
                        key={c.id}
                        onClick={() => { setSelectedTopic(c.term); setFeedback(null); setInput(''); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTopic === c.term ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-slate-200 text-slate-600'}`}
                    >
                        {c.term}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col overflow-y-auto">
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {selectedTopic}의 부작용에 대한 나의 생각:
                </label>
                <textarea
                    className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none h-32 text-sm"
                    placeholder="예: AI가 발전하면 일자리가 줄어들 것 같습니다. 왜냐하면..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                    <button 
                        onClick={handleSubmit}
                        disabled={loading || !input.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                        {loading ? '선생님이 읽는 중...' : '제출하고 피드백 받기'}
                        {!loading && <Send size={16} />}
                    </button>
                </div>
            </div>

            {feedback && (
                <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 animate-fade-in mt-4">
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
                        <Bot size={20} />
                        <span>AI 선생님의 피드백</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                        {feedback}
                    </p>
                </div>
            )}
            
            {!feedback && !loading && (
                <div className="flex-1 flex items-center justify-center text-slate-300 flex-col gap-2 mt-4">
                    <MessageSquare size={32} />
                    <span className="text-sm">생각을 제출하면 피드백이 여기에 표시됩니다.</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Reflection;
