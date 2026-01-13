import React, { useState } from 'react';
import { PenTool, Send, Cpu } from 'lucide-react';
import { analyzeDesignAnswer } from '../services/geminiService';

const TabDesign: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const result = await analyzeDesignAnswer(answer);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto h-full p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
                <PenTool className="text-purple-600" size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">설계 챌린지</h2>
                <p className="text-sm text-gray-500">배운 내용을 실제 시나리오에 적용해보세요.</p>
            </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">미션:</h3>
            <p className="text-gray-600 leading-relaxed">
                당신은 '그린 고등학교'의 데이터 설계자입니다.
                학교는 **5층**으로 되어 있고, 각 층에는 격자 모양으로 교실이 배치되어 있습니다 (행과 열).
                <br/><br/>
                <strong>학교의 모든 교실에서 발생하는 매일의 쓰레기 양을 저장하기 위한 데이터 구조를 어떻게 설계할지 설명해보세요.</strong> 
                <br/>
                <span className="text-sm text-gray-500 italic">(힌트: 차원과 인덱스에 대해 생각해보세요!)</span>
            </p>
        </div>

        <div>
            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="예: 저는 trashData라는 3D 배열을 만들겠습니다. 여기서..."
                className="w-full h-32 p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none transition-all"
            />
            <button
                onClick={handleSubmit}
                disabled={loading || !answer.trim()}
                className={`mt-3 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${loading || !answer.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
            >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <Send size={16} />}
                {loading ? '분석 중...' : '설계 제출'}
            </button>
        </div>

        {feedback && (
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-2">
                    <Cpu className="text-indigo-600" size={18} />
                    <h4 className="font-bold text-indigo-900">AI 코치 피드백</h4>
                </div>
                <div className="text-indigo-800 text-sm whitespace-pre-wrap leading-relaxed">
                    {feedback}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TabDesign;