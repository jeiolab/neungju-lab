import React, { useState } from 'react';
import { MessageSquare, Send, Scale } from 'lucide-react';
import { analyzeEthics } from '../services/geminiService';

const EthicsTab: React.FC = () => {
  const [thought, setThought] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!thought.trim()) return;
    setLoading(true);
    const result = await analyzeEthics(thought);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden grid lg:grid-cols-2 min-h-[500px]">
        {/* Left Side: Input */}
        <div className="p-8 lg:p-10 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-black rounded-xl text-white">
              <Scale size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-gray-900">트롤리 딜레마 (Trolley Dilemma)</h2>
               <p className="text-sm text-gray-500">AI Ethics Committee</p>
            </div>
          </div>
          
          <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
            <p>
              자율주행차가 브레이크 고장으로 질주하고 있습니다. 
              <br/>
              <strong>Option A:</strong> 그대로 가면 5명의 보행자를 치게 됩니다.
              <br/>
              <strong>Option B:</strong> 핸들을 꺾으면 1명의 탑승자(본인)가 위험합니다.
            </p>
            <p className="font-medium text-gray-900">
              AI는 어떤 판단을 내려야 할까요? 여러분의 윤리적 가치관을 서술해주세요.
            </p>
          </div>

          <div className="flex-1 flex flex-col">
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="예: 공리주의적 관점에서 다수를 살리는 것이 맞다고 생각하지만..."
              className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none text-sm bg-gray-50 mb-4 flex-1"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !thought.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all transform active:scale-95 font-bold"
            >
              {loading ? '위원회 검토 중...' : <><Send size={18} /> 의견 제출하기</>}
            </button>
          </div>
        </div>

        {/* Right Side: Feedback */}
        <div className="bg-gray-50 p-8 lg:p-10 flex flex-col justify-center">
          {feedback ? (
            <div className="animate-fade-in-up">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 relative">
                <div className="absolute -top-4 -left-4 bg-indigo-600 text-white p-2 rounded-lg shadow-md">
                   <MessageSquare size={24} />
                </div>
                <h3 className="font-bold text-indigo-900 text-lg mb-4 ml-6">AI 윤리 위원회 피드백</h3>
                <div className="h-1 w-20 bg-indigo-100 mb-6"></div>
                <p className="text-gray-700 leading-loose whitespace-pre-line text-lg font-serif">
                  "{feedback}"
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Verified by Gemini AI
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
               <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <MessageSquare size={40} className="text-gray-300" />
               </div>
               <h3 className="text-lg font-medium text-gray-500 mb-2">피드백 대기 중</h3>
               <p className="text-sm max-w-xs mx-auto">
                 왼쪽 패널에 의견을 작성하고 제출하면, AI 윤리 위원회의 분석 결과를 이곳에서 확인할 수 있습니다.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EthicsTab;
