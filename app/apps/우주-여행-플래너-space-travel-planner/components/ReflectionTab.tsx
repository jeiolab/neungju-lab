import React, { useState } from 'react';
import { Lightbulb, Send, Bot, AlertTriangle } from 'lucide-react';
import { askMissionControl } from '../services/geminiService';

const ReflectionTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: '반갑습니다. NASA 비행 디렉터입니다. 코드나 우주 여행에 대해 궁금한 점이 있다면 무엇이든 물어보세요.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMsg = prompt;
    setPrompt('');
    setConversation(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const answer = await askMissionControl(userMsg, "현재 사용자는 '우주 여행 플래너' 앱의 Reflection 탭에 있습니다. 행성을 추가하는 방법이나 클래스 구조의 유연성에 대해 질문할 수 있습니다.");
    
    setConversation(prev => [...prev, { role: 'ai', text: answer }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Left: Thinking Problem */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-600 mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          생각해볼 문제: 새로운 행성의 발견?
        </h2>
        
        <div className="space-y-6 text-gray-700">
          <p>
            과학자들이 태양계 끝자락에서 새로운 <strong>'제 9의 행성(Planet Nine)'</strong>을 발견했다고 가정해봅시다!
          </p>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">만약 딕셔너리로 코드를 짰다면?</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>변수 <code className="bg-gray-100 px-1 rounded">planet9_name</code>, <code className="bg-gray-100 px-1 rounded">planet9_dist</code> 등을 일일이 새로 만들어야 합니다.</li>
              <li>기존의 계산 함수가 새로운 변수 이름을 인식하도록 코드를 수정해야 할 수도 있습니다.</li>
              <li>실수의 가능성이 매우 높습니다.</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">클래스(Class)를 사용했다면?</h3>
            <pre className="bg-gray-50 p-4 rounded text-sm font-mono text-blue-700 overflow-x-auto border border-gray-200">
{`# 단 한 줄만 추가하면 끝!
planet9 = Planet("제9행성", 50000000000, "미지의 가스")

# 기존 리스트에 추가만 하면
# 모든 시뮬레이터에서 즉시 작동합니다.
solar_system.append(planet9)`}
            </pre>
            <p className="mt-3 text-sm text-gray-600">
              이것이 바로 객체 지향 프로그래밍(OOP)이 가진 <strong>유지보수의 용이성</strong>과 <strong>확장성</strong>입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Right: AI Chat */}
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-lg">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            NASA 비행 디렉터 AI
          </h3>
          <span className="text-xs text-gray-500">Powered by Gemini</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-3 rounded-lg rounded-bl-none flex gap-2 items-center border border-gray-200">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 객체를 생성하는 코드를 알려줘..."
              className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionTab;