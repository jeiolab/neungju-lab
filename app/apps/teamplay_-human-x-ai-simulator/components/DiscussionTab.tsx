import React, { useState } from 'react';
import { getDiscussionInsight } from '../services/geminiService';
import { MessageSquare, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';

const DiscussionTab: React.FC = () => {
  const [topic, setTopic] = useState("AI 의존도가 너무 높아지면 인간의 능력은 퇴화할까?");
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState<{ text: string, type: 'PRO' | 'CON' | null }>({ text: "", type: null });
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (stance: 'PRO' | 'CON') => {
    if (!userInput.trim()) {
        alert("관심있는 세부 주제를 입력해주세요. (예: 코딩 능력, 예술적 감각, 기본 연산 등)");
        return;
    }
    setLoading(true);
    setAiResponse({ text: "", type: stance });
    
    const response = await getDiscussionInsight(userInput, stance);
    setAiResponse({ text: response, type: stance });
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🤔 생각해볼 문제</h2>
        <p className="text-xl font-medium text-blue-600">"{topic}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PRO Side */}
        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
          <div className="flex items-center mb-4 text-red-700">
            <ThumbsUp className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">찬성 (Yes)</h3>
          </div>
          <p className="text-sm text-red-800 mb-4 font-medium">"편리함에 익숙해져 기본 능력을 상실할 것이다."</p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside bg-white p-4 rounded-lg shadow-sm">
            <li>복잡한 연산이나 길찾기 등 기초 인지 능력 저하 (디지털 치매)</li>
            <li>문제 해결 과정에서 AI에 대한 과도한 의존 (Thinkless)</li>
            <li>직접적인 경험 부족으로 인한 창의적 직관 상실</li>
          </ul>
        </div>

        {/* CON Side */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center mb-4 text-blue-700">
            <ThumbsDown className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">반대 (No)</h3>
          </div>
          <p className="text-sm text-blue-800 mb-4 font-medium">"새로운 도구를 통해 더 고차원적인 능력으로 진화할 것이다."</p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside bg-white p-4 rounded-lg shadow-sm">
            <li>암기나 단순 반복에서 해방되어 창의적 기획에 집중</li>
            <li>AI를 도구로 활용하는 '프롬프트 엔지니어링' 등 신기술 습득</li>
            <li>역사적으로 계산기/컴퓨터 도입 시에도 인간 지능은 확장됨</li>
          </ul>
        </div>
      </div>

      {/* AI Interaction Area */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
        <div className="flex items-center mb-4">
            <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">AI에게 의견 물어보기</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
            특정 영역(예: 코딩, 글쓰기, 운전)에 대해 AI의 생각이 궁금한가요? 키워드를 입력하고 버튼을 눌러보세요.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="예: 아이들의 글쓰기 능력, 프로그래머의 코딩 실력..."
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <button 
                onClick={() => handleAskAI('PRO')}
                disabled={loading}
                className="px-6 py-3 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors whitespace-nowrap"
            >
                찬성 논거 보기
            </button>
             <button 
                onClick={() => handleAskAI('CON')}
                disabled={loading}
                className="px-6 py-3 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition-colors whitespace-nowrap"
            >
                반대 논거 보기
            </button>
        </div>

        {/* AI Result Display */}
        {loading && (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center animate-pulse">
                AI가 논리적인 근거를 생성하고 있습니다...
            </div>
        )}
        
        {!loading && aiResponse.text && (
            <div className={`p-6 rounded-xl border ${aiResponse.type === 'PRO' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                <h4 className={`font-bold mb-3 ${aiResponse.type === 'PRO' ? 'text-red-800' : 'text-blue-800'}`}>
                    AI Insight ({aiResponse.type === 'PRO' ? '퇴화 가능성' : '진화 가능성'})
                </h4>
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
                    {aiResponse.text}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionTab;