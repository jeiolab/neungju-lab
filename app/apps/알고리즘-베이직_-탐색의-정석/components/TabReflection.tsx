import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Sparkles, Send } from 'lucide-react';

const TabReflection: React.FC = () => {
  const [userThought, setUserThought] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userThought.trim()) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const apiKey = process.env.API_KEY; // Injected by environment
      if (!apiKey) {
        setFeedback("API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. (개발 환경을 확인해주세요)");
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        고등학교 1학년 정보 교과 멘토로서, 학생의 답변에 대해 평가하고 조언해줘.
        
        주제: "데이터가 계속 추가(Insertion)되는 상황이라면, 탐색 속도가 빠른 '이진 탐색'을 유지하는 것이 항상 유리할까?"
        핵심 포인트: 이진 탐색을 하려면 '정렬' 상태를 유지해야 함. 데이터 추가 시마다 정렬하는 비용(Cost) 발생.
        
        학생 답변: "${userThought}"
        
        지시사항:
        1. 학생의 답변이 정렬 비용(Sorting Cost)을 고려했는지 확인.
        2. 3줄 이내로 친절하게 피드백 작성.
        3. 정렬 비용을 언급했다면 칭찬, 언급하지 않았다면 그 부분을 생각해보게 유도.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setFeedback(response.text || "피드백을 생성할 수 없습니다.");
    } catch (error) {
      console.error(error);
      setFeedback("AI 서버 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" /> 생각해볼 문제
        </h2>
        <p className="text-lg text-indigo-800 font-medium mb-2">
            "데이터가 계속 추가되는 상황이라면 어떤 탐색이 유리할까?"
        </p>
        <p className="text-slate-600 text-sm">
            이진 탐색은 빠르지만, 전제 조건(정렬)이 있었습니다. 만약 도서관에 매일 새 책이 100권씩 들어온다면, 
            사서 선생님은 바로바로 꽂을 수 있는 방법과 번호순서대로 정리하는 방법 중 무엇을 선호할까요?
            데이터 추가와 탐색의 관계에 대해 자유롭게 적어보세요.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <textarea
            value={userThought}
            onChange={(e) => setUserThought(e.target.value)}
            placeholder="예: 데이터가 추가될 때마다 정렬을 다시 해야 한다면..."
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-4"
        />
        <button
            onClick={handleSubmit}
            disabled={isLoading || !userThought}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold flex items-center justify-center hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    AI 멘토가 생각하는 중...
                </>
            ) : (
                <>
                    <Send className="w-5 h-5 mr-2" />
                    제출하고 피드백 받기
                </>
            )}
        </button>
      </div>

      {feedback && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 animate-slide-up">
            <h3 className="text-lg font-bold text-purple-700 mb-2 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" /> 멘토의 피드백
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {feedback}
            </p>
        </div>
      )}
    </div>
  );
};

export default TabReflection;