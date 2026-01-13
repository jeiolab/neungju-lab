import React, { useState } from 'react';
import { Send, Bot, Sparkles, BookOpen } from 'lucide-react';
import { getFutureDiaryFeedback } from '../services/geminiService';

const ReflectionView: React.FC = () => {
  const [diary, setDiary] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!diary.trim()) return;
    
    setIsLoading(true);
    setFeedback('');
    
    // Call Gemini API
    const response = await getFutureDiaryFeedback(diary);
    setFeedback(response || "응답을 불러올 수 없습니다.");
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">미래 일기장 📓</h2>
        <p className="text-gray-500">
          10년 뒤 나의 직업은 어떤 모습일까요? 상상력을 발휘해 적어보세요.<br/>
          <span className="text-blue-600 font-semibold">미래의 AI 멘토</span>가 답변을 해줍니다.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100 relative">
        <div className="absolute top-0 left-8 -mt-3 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          2035년의 어느 날
        </div>
        
        <textarea
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
          placeholder="예시: 나는 드론 택시 정비사가 되어 아침 일찍 출근했다. AI 진단 프로그램으로..."
          className="w-full h-48 p-4 text-lg border-none focus:ring-0 resize-none bg-transparent placeholder-gray-300 leading-relaxed font-handwriting"
          style={{ backgroundImage: 'linear-gradient(transparent, transparent 29px, #e5e7eb 30px)', backgroundSize: '100% 30px', lineHeight: '30px' }}
        />
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !diary.trim()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all
              ${isLoading || !diary.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-105'}
            `}
          >
            {isLoading ? (
              <>
                <Sparkles className="animate-spin" size={20} />
                <span>미래로 전송 중...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>미래로 보내기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Bot size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <Bot className="text-indigo-600" size={24} />
              </div>
              <h3 className="font-bold text-indigo-800">미래에서 온 답장</h3>
            </div>
            <div className="prose prose-indigo text-gray-700 leading-relaxed bg-white/50 p-4 rounded-xl backdrop-blur-sm">
              {feedback.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionView;
