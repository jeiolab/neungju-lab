import React, { useState } from 'react';
import { analyzeStudentReflection } from '../services/geminiService';
import { UserState } from '../types';
import { Sparkles, Send } from 'lucide-react';

interface Props {
    userState: UserState;
    setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const ReflectionTab: React.FC<Props> = ({ userState, setUserState }) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<{q: string, a: string}[]>([]);

    const handleSubmit = async () => {
        if (!input.trim()) return;
        setLoading(true);

        const context = `
          학생 레벨: ${Math.floor(userState.xp / 100) + 1},
          완료한 실험 횟수: ${userState.experimentsRun},
          사용한 전략: ${userState.strategiesUsed.join(', ')}
        `;

        const response = await analyzeStudentReflection(context, input);
        
        setHistory(prev => [{q: input, a: response.feedback}, ...prev]);
        setInput("");
        setLoading(false);
        setUserState(prev => ({...prev, xp: prev.xp + 15}));
    };

    return (
        <div className="max-w-2xl mx-auto h-[600px] flex flex-col">
            <div className="bg-indigo-50 p-6 rounded-2xl mb-6">
                 <h2 className="text-xl font-bold text-indigo-900 mb-2">생각해볼 문제 🤔</h2>
                 <p className="text-indigo-700 text-sm">
                     "만약 내가 온라인 쇼핑몰 사장님이라면, 옷 사이즈 데이터의 결측치를 어떻게 처리하는 게 가장 매출에 도움이 될까요?"
                 </p>
                 <p className="text-indigo-600 text-xs mt-4">
                     위 질문이나, 실험하면서 궁금했던 점을 자유롭게 적어보세요. AI 선생님이 피드백을 줄 거예요!
                 </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {history.length === 0 && (
                    <div className="text-center text-slate-400 mt-10">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>자유롭게 생각을 적어보세요.</p>
                    </div>
                )}
                {history.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="bg-slate-100 p-4 rounded-2xl rounded-tr-none ml-auto max-w-[80%] text-right text-slate-800">
                            {item.q}
                        </div>
                        <div className="bg-white border border-indigo-100 p-4 rounded-2xl rounded-tl-none mr-auto max-w-[90%] text-indigo-900 shadow-sm">
                            <span className="text-xs font-bold text-indigo-400 block mb-1">AI Feedback</span>
                            {item.a}
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-4 pr-14 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-sm"
                    placeholder="여기에 생각을 적어보세요..."
                    rows={3}
                    disabled={loading}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ReflectionTab;
