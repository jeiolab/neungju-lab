import React, { useState } from 'react';
import { generateReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Sparkles, Send } from 'lucide-react';

const TabReflection: React.FC = () => {
  const [scenario, setScenario] = useState('체육대회');
  const [constraint, setConstraint] = useState('예산이 50% 삭감됨');
  const [userPlan, setUserPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAskMentor = async () => {
    if (!userPlan.trim()) return alert("계획을 입력해주세요!");
    
    setLoading(true);
    setFeedback(null);
    const response = await generateReflectionFeedback(scenario, userPlan, constraint);
    setFeedback(response);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <Sparkles className="text-yellow-500" />
        생각해볼 문제: 시나리오 대처
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <label className="block text-sm font-bold text-orange-800 mb-1">상황 설정</label>
            <div className="flex gap-2 mb-2">
                <select 
                    value={scenario} 
                    onChange={(e) => setScenario(e.target.value)}
                    className="p-2 border rounded bg-white text-sm w-full"
                >
                    <option value="체육대회">체육대회 운영</option>
                    <option value="학교 홍보 영상">학교 홍보 영상 제작</option>
                    <option value="동아리 발표회">동아리 발표회</option>
                </select>
            </div>
            <div className="flex gap-2">
                 <select 
                    value={constraint} 
                    onChange={(e) => setConstraint(e.target.value)}
                    className="p-2 border rounded bg-white text-sm w-full"
                >
                    <option value="예산이 50% 삭감됨">예산이 50% 삭감됨</option>
                    <option value="준비 기간이 1주일로 줄어듦">준비 기간이 1주일로 줄어듦</option>
                    <option value="비가 와서 실내에서 진행해야 함">비가 와서 실내 진행 필요</option>
                </select>
            </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            "완벽한 계획도 예상치 못한 변수를 만납니다. 위 상황에서 기존 계획(WBS)을 어떻게 수정하시겠습니까? 구체적으로 적어주세요."
        </div>
      </div>

      <textarea
        className="w-full h-40 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none mb-4 text-gray-700"
        placeholder="예: 예산이 부족하므로 외부 강사 초청을 취소하고 선생님들의 재능 기부를 요청하겠습니다. 또한..."
        value={userPlan}
        onChange={(e) => setUserPlan(e.target.value)}
      ></textarea>

      <button
        onClick={handleAskMentor}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
        }`}
      >
        {loading ? (
            <>AI 멘토가 생각중입니다...</>
        ) : (
            <><Send size={18} /> AI 멘토에게 피드백 받기</>
        )}
      </button>

      {feedback && (
        <div className="mt-6 p-6 bg-indigo-50 rounded-xl border border-indigo-100 animate-fade-in">
          <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <MessageSquare size={18}/> 멘토의 피드백
          </h3>
          <div className="text-gray-800 whitespace-pre-line leading-relaxed text-sm md:text-base">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabReflection;