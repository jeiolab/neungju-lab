import React, { useState } from 'react';
import { THINK_SCENARIO, INITIAL_GRAPH } from '../constants';
import { evaluateSolution } from '../services/geminiService';
import NetworkGraph from './NetworkGraph';
import { MessageSquare, Sparkles, Send } from 'lucide-react';

const ThinkTab: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setAiResponse(null);
    
    try {
      const response = await evaluateSolution(userInput, THINK_SCENARIO);
      setAiResponse(response);
    } catch (err) {
      setAiResponse("AI 연결에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 text-white/20 w-16 h-16" />
            <h2 className="text-2xl font-bold mb-4">생각해 볼 문제</h2>
            <p className="text-indigo-100 leading-relaxed text-lg">
                {THINK_SCENARIO}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
            <label className="block text-sm font-bold text-slate-700 mb-2">
                나의 해결책을 적어보세요
            </label>
            <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                placeholder="예: 저는 지민이와 짝을 시켜주고 싶어요. 왜냐하면..."
            />
            <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <Send className="w-5 h-5" />
                )}
            </button>
        </form>

        {aiResponse && (
            <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold">
                    <MessageSquare className="w-5 h-5" />
                    AI 선생님의 피드백
                </div>
                <div className="prose prose-sm prose-indigo text-slate-700">
                    {aiResponse}
                </div>
            </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-500 mb-2 text-xs">참고용 그래프</h3>
             <NetworkGraph data={INITIAL_GRAPH} height={350} />
             <p className="text-xs text-center text-slate-400 mt-2">
                전학생 '재민'이는 현재 이 그래프에 없지만, 곧 추가될 예정입니다.
             </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2">💡 힌트</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>새로운 친구가 '중심성'이 높은 친구와 연결되면 어떻게 될까요?</li>
                <li>비슷한 취미를 가진 친구를 찾으면 연결이 더 쉬울까요?</li>
                <li>이미 그룹에 속해있는 친구들은 어떤 특징이 있나요?</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default ThinkTab;
