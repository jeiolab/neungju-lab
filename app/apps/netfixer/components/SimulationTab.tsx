import React, { useState, useEffect, useRef } from 'react';
import { Scenario, ChatMessage } from '../types';
import { generateCustomerReaction } from '../services/geminiService';
import { Send, User, Bot, Briefcase, CheckCircle, XCircle } from 'lucide-react';

interface SimulationTabProps {
  onSolve: () => void;
  onCollectTip: (tip: string) => void;
}

const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    customerName: '학생 김철수',
    problem: "제 방에서 유튜브가 자꾸 끊겨요! 공유기는 거실에 있고요. 정말 답답해서 공부를 못하겠어요.",
    context: "거실과 방 사이에 콘크리트 벽이 두 개 있습니다. 사용자는 현재 5GHz 와이파이에 연결되어 있습니다.",
    options: [
      { id: 'opt1', label: "2.4GHz 와이파이로 변경 유도", isCorrect: true, cost: 'low', effectiveness: 'medium', feedback: "2.4GHz는 5GHz보다 벽 투과율이 좋아 방까지 신호가 잘 도달합니다." },
      { id: 'opt2', label: "비싼 최고급 공유기 구매 권유", isCorrect: false, cost: 'high', effectiveness: 'medium', feedback: "단순한 신호 도달 문제에 비해 비용이 너무 많이 듭니다. 가성비가 떨어집니다." },
      { id: 'opt3', label: "공유기 재부팅", isCorrect: false, cost: 'low', effectiveness: 'low', feedback: "재부팅만으로는 물리적인 벽에 의한 신호 감쇄를 해결할 수 없습니다." }
    ],
    tipReward: "Tip: 2.4GHz는 5GHz보다 속도는 느리지만 장애물을 더 잘 통과합니다."
  },
  {
    id: 's2',
    customerName: '게이머 이영희',
    problem: "온라인 게임 하는데 렉이 너무 심해요. 동생이 넷플릭스 볼 때마다 핑이 튀어서 게임을 져요.",
    context: "대역폭 공유 문제입니다. 공유기가 QoS(Quality of Service) 기능을 지원합니다.",
    options: [
      { id: 'opt1', label: "QoS 설정으로 게임 트래픽 우선순위 지정", isCorrect: true, cost: 'low', effectiveness: 'high', feedback: "QoS는 동영상 스트리밍이 게임 패킷을 방해하지 않도록 트래픽을 관리해줍니다." },
      { id: 'opt2', label: "동생에게 동영상 보지 말라고 하기", isCorrect: false, cost: 'low', effectiveness: 'medium', feedback: "기술적인 해결책이 아니며, 가정 불화를 유발할 수 있습니다." },
      { id: 'opt3', label: "DNS 서버 변경", isCorrect: false, cost: 'low', effectiveness: 'low', feedback: "DNS는 웹사이트 접속 초기 속도에 영향을 주지만, 대역폭 혼잡을 해결하진 못합니다." }
    ],
    tipReward: "Tip: QoS 기능을 쓰면 특정 기기나 게임의 인터넷 속도를 우선적으로 보장할 수 있습니다."
  },
  {
    id: 's3',
    customerName: '카페 사장 박민수',
    problem: "손님들이 와이파이 연결할 때 '보안되지 않음' 경고가 뜬다고 불안해해요.",
    context: "편의를 위해 공유기 보안 설정이 '개방형(Open)'으로 되어 있습니다.",
    options: [
      { id: 'opt1', label: "WPA2/WPA3 비밀번호 설정", isCorrect: true, cost: 'low', effectiveness: 'high', feedback: "암호화를 설정하면 경고가 사라지고 고객의 데이터를 보호할 수 있습니다." },
      { id: 'opt2', label: "SSID(네트워크 이름) 숨기기", isCorrect: false, cost: 'low', effectiveness: 'low', feedback: "이름을 숨겨도 보안 경고는 사라지지 않으며, 해커는 쉽게 찾을 수 있습니다." },
      { id: 'opt3', label: "전송 출력(Tx Power) 높이기", isCorrect: false, cost: 'low', effectiveness: 'low', feedback: "신호 강도와 보안 프로토콜은 관련이 없습니다." }
    ],
    tipReward: "Tip: 와이파이는 절대 개방형으로 두지 마세요. WPA2 이상 암호화가 필수입니다."
  }
];

const SimulationTab: React.FC<SimulationTabProps> = ({ onSolve, onCollectTip }) => {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scenarioActive, setScenarioActive] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentScenario = SCENARIOS[activeScenarioIndex];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startScenario = () => {
    setScenarioActive(true);
    setMessages([
      {
        id: 'sys-start',
        sender: 'system',
        text: `새로운 의뢰 요청: ${currentScenario.customerName}`,
        timestamp: new Date()
      },
      {
        id: 'npc-1',
        sender: 'user',
        text: currentScenario.problem,
        timestamp: new Date()
      }
    ]);
    setShowOptions(true);
  };

  const handleOptionSelect = async (optionId: string) => {
    setShowOptions(false);
    const selectedOption = currentScenario.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    // Add User (Technician) response
    const techMsg: ChatMessage = {
      id: `tech-${Date.now()}`,
      sender: 'bot', // 'bot' here is the User/Technician
      text: `조치: ${selectedOption.label}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, techMsg]);

    setIsTyping(true);

    // Call Gemini for reaction
    const reaction = await generateCustomerReaction(
      currentScenario.context,
      selectedOption.label,
      selectedOption.isCorrect,
      selectedOption.effectiveness
    );

    setIsTyping(false);

    const npcMsg: ChatMessage = {
      id: `npc-${Date.now()}`,
      sender: 'user', // 'user' is the NPC
      text: reaction,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, npcMsg]);

    // System Feedback
    setTimeout(() => {
      const resultMsg: ChatMessage = {
        id: `sys-res-${Date.now()}`,
        sender: 'system',
        text: selectedOption.isCorrect 
          ? `성공! ${selectedOption.feedback}` 
          : `실패. ${selectedOption.feedback}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, resultMsg]);

      if (selectedOption.isCorrect) {
        onSolve();
        if (currentScenario.tipReward) {
            onCollectTip(currentScenario.tipReward);
        }
      }
    }, 1000);
  };

  const nextScenario = () => {
    if (activeScenarioIndex < SCENARIOS.length - 1) {
      setActiveScenarioIndex(prev => prev + 1);
      setScenarioActive(false);
      setMessages([]);
    } else {
        alert("모든 의뢰를 완료했습니다! 훌륭한 네트워크 해결사시네요!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase size={20} />
            <h2 className="font-bold">의뢰 #{activeScenarioIndex + 1}: {currentScenario.customerName}</h2>
          </div>
          {!scenarioActive && activeScenarioIndex < SCENARIOS.length && (
            <button 
              onClick={startScenario}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold transition-colors"
            >
              의뢰 수락
            </button>
          )}
          {activeScenarioIndex >= SCENARIOS.length && (
              <span className="text-green-400 font-bold">모든 업무 완료</span>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {!scenarioActive && activeScenarioIndex < SCENARIOS.length && (
            <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-2">
              <Briefcase size={48} />
              <p>새로운 의뢰를 기다리는 중...</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'bot' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.sender === 'system' ? (
                 <div className="w-full text-center my-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${msg.text.includes('성공') ? 'bg-green-100 text-green-700' : msg.text.includes('실패') ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                        {msg.text}
                    </span>
                 </div>
              ) : (
                <div className={`max-w-[80%] flex gap-2 ${msg.sender === 'bot' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-blue-600' : 'bg-indigo-500'}`}>
                    {msg.sender === 'bot' ? <User className="text-white" size={16} /> : <User className="text-white" size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'bot' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
                 <div className="bg-gray-200 text-gray-500 text-xs px-3 py-2 rounded-full animate-pulse">
                     고객님이 입력 중입니다...
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Area */}
        <div className="p-4 bg-white border-t border-slate-200 min-h-[140px]">
          {scenarioActive && showOptions ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {currentScenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className="p-3 border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-slate-700 group-hover:text-blue-700 break-keep">{option.label}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex gap-2">
                     <span className="bg-slate-100 px-1 rounded">비용: {option.cost === 'low' ? '낮음' : option.cost === 'medium' ? '보통' : '높음'}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
             <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm">
                    {messages.length > 0 && (messages[messages.length - 1].text.includes('성공') || messages[messages.length - 1].text.includes('실패'))
                      ? "의뢰가 종료되었습니다." 
                      : "대화 내용을 읽고 해결책을 선택하세요."}
                </p>
                {(messages.some(m => m.text.includes('성공') || m.text.includes('실패'))) && (
                    <button 
                        onClick={nextScenario}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                        다음 의뢰 <Send size={16} />
                    </button>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;