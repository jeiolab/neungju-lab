import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { generateOpenEndedFeedback } from '../services/geminiService';

const TabThink: React.FC = () => {
    const question = "우리 학교 매점의 빵 재고 관리를 AI에게 맡긴다면, 어떤 데이터를 수집해야 하고 어떤 효과를 기대할 수 있을까요?";
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        const result = await generateOpenEndedFeedback(question, answer);
        setFeedback(result);
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">생각해볼 문제 🤔</h2>
                <p className="text-slate-600">정답은 없습니다. 자유롭게 상상해보세요!</p>
            </div>

            <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles size={120} />
                </div>
                <h3 className="text-xl font-bold mb-4 relative z-10">오늘의 질문</h3>
                <p className="text-lg leading-relaxed font-light relative z-10">"{question}"</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2">나의 생각 적기</label>
                <textarea 
                    className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all"
                    placeholder="예: 날씨 데이터와 요일별 판매량이 필요할 것 같아요. 그러면 빵이 남아서 버리는 일을 줄일 수 있어요."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={handleSubmit}
                        disabled={loading || answer.length < 5}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'AI가 생각하는 중...' : <>AI 피드백 받기 <Send size={16} /></>}
                    </button>
                </div>
            </div>

            {feedback && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-fadeIn">
                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <MessageSquare size={18} /> AI 선생님의 피드백
                    </h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {feedback}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TabThink;