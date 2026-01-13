import React, { useState } from 'react';
import { REFLECTION_TEMPLATES } from '../constants';
import { evaluateReflection } from '../services/geminiService';
import { MessageSquare, Send } from 'lucide-react';

const Reflection: React.FC = () => {
  const [activeId, setActiveId] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const activeTemplate = REFLECTION_TEMPLATES.find(t => t.id === activeId);

  const handleSubmit = async () => {
    if (!activeTemplate || !answers[activeId] || loading) return;
    
    setLoading(true);
    const result = await evaluateReflection(activeTemplate.question, answers[activeId]);
    setFeedback(prev => ({ ...prev, [activeId]: result }));
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 grid md:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1 space-y-2">
        {REFLECTION_TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              activeId === t.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <div className="font-bold mb-1">질문 {t.id}</div>
            <div className={`text-xs truncate ${activeId === t.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                {t.question}
            </div>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="md:col-span-2">
        {activeTemplate && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex gap-2 items-start">
                    <MessageSquare className="text-indigo-500 mt-1 flex-shrink-0" size={24} />
                    {activeTemplate.question}
                </h3>
                
                <textarea
                    value={answers[activeId] || ''}
                    onChange={(e) => setAnswers(prev => ({...prev, [activeId]: e.target.value}))}
                    placeholder={activeTemplate.placeholder}
                    className="flex-1 w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 resize-none mb-4"
                />

                {feedback[activeId] && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 text-sm">
                        🤖 <strong>선생님(AI)의 피드백:</strong> {feedback[activeId]}
                    </div>
                )}

                <div className="flex justify-end">
                    <button 
                        onClick={handleSubmit}
                        disabled={loading || !answers[activeId]}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? '검토 중...' : (
                            <>
                                <Send size={18} /> 제출하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reflection;
