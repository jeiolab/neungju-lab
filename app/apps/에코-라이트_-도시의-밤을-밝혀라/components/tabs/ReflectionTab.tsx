import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { MessageSquare, Send } from 'lucide-react';
import { getReflectionFeedback } from '../../services/gemini';

export const ReflectionTab: React.FC = () => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setIsLoading(true);
    const result = await getReflectionFeedback(answer);
    setFeedback(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <Card title="생각해보기: 네트워크 설계" className="mb-6">
        <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Q. 가로등 고장을 어떻게 알 수 있을까?</h3>
          <p className="text-slate-600 leading-relaxed">
            도시 전체에 가로등이 10,000개가 있습니다. 시민이 신고하기 전에, 
            중앙 관제 센터에서 가로등 전구 고장을 <strong>자동으로</strong> 알 수 있는 방법을 
            상상해서 적어보세요. (힌트: 센서, 통신)
          </p>
        </div>

        <div className="space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="예: 가로등마다 전류 센서를 달아서..."
            className="w-full h-32 bg-white border border-slate-300 rounded-lg p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
          />
          
          <div className="flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !answer.trim()}
              className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white py-2 px-6 rounded-lg flex items-center gap-2 font-medium transition-all shadow-md"
            >
              {isLoading ? (
                <>제출 중...</>
              ) : (
                <>
                  <Send size={18} /> 제출하고 피드백 받기
                </>
              )}
            </button>
          </div>
        </div>
      </Card>

      {feedback && (
        <Card className="border-green-200 bg-green-50 animate-slideUp">
           <div className="flex items-start gap-4">
             <div className="p-3 bg-green-600 rounded-full text-white shadow-lg shadow-green-600/20">
               <MessageSquare size={24} />
             </div>
             <div className="flex-1">
               <h3 className="text-lg font-bold text-green-800 mb-2">AI 멘토의 피드백</h3>
               <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                 {feedback}
               </p>
             </div>
           </div>
        </Card>
      )}
    </div>
  );
};