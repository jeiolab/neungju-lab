import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot } from 'lucide-react';
import { getThinkingFeedback } from '../services/geminiService';

const QUESTIONS = [
  "공용 PC에서 로그아웃을 깜빡하고 자리를 비웠을 때 발생할 수 있는 보안 문제는?",
  "인터넷 속도가 매우 느린 상황에서 대용량 파일을 가장 효율적으로 공유하는 방법은 무엇일까?",
  "암호가 걸려있지 않은 'Everyone' 공유 폴더의 위험성은 무엇일까?",
  "학급 친구들과 함께 쓰는 '공동 과제 폴더'를 만들 때 꼭 지켜야 할 규칙 3가지를 정해본다면?"
];

const ThinkingSection: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [selectedQ, setSelectedQ] = useState(QUESTIONS[0]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setFeedback(null);
    
    const result = await getThinkingFeedback(selectedQ, answer);
    
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Sparkles className="mr-2 text-purple-500" /> 생각해볼 문제
        </h2>
        <button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">돌아가기</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Question Selector */}
        <div className="md:col-span-1 space-y-2">
          {QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedQ(q);
                setFeedback(null);
                setAnswer('');
              }}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                selectedQ === q 
                  ? 'bg-purple-50 border-purple-300 text-purple-900 font-medium shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Q{idx + 1}. {q.length > 20 ? q.slice(0, 20) + '...' : q}
            </button>
          ))}
        </div>

        {/* Interaction Area */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{selectedQ}</h3>
            
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="여기에 나의 생각을 적어보세요..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none resize-none h-32 mb-4"
            />
            
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg font-bold flex justify-center items-center transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  AI 선생님이 생각하는 중...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" /> AI 피드백 받기
                </>
              )}
            </button>
          </div>

          {/* Feedback Area */}
          {feedback && (
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md border border-purple-100 animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                  <Bot size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-purple-900 mb-2">AI 선생님의 피드백</h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{feedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThinkingSection;