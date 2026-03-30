import React, { useState } from 'react';
import { evaluateEssay } from '../services/geminiService';
import { Send, Sparkles, PenTool } from 'lucide-react';

interface TabEssayProps {
  onEssaySubmit: () => void;
}

const TOPICS = [
  {
    id: 1,
    title: "조건 바꾸기",
    prompt: "학교 전체가 하나의 네트워크가 되려면 LAN만으로 충분할까요? 만약 학교가 여러 캠퍼스로 나누어져 있다면 어떻게 될지 서술해보세요.",
  },
  {
    id: 2,
    title: "반례 찾기",
    prompt: "물리적으로 거리는 아주 짧지만(예: 바로 옆 건물), 연결을 위해 WAN(인터넷)을 거쳐야 하는 상황은 언제일까요?",
  },
  {
    id: 3,
    title: "적용 설계",
    prompt: "학교 축제 안내 시스템을 만든다고 가정합시다. 교내 학생용(LAN)과 외부 방문객용(WAN) 네트워크를 어떻게 구분하여 설계할지 아이디어를 적어보세요.",
  }
];

const TabEssay: React.FC<TabEssayProps> = ({ onEssaySubmit }) => {
  const [selectedTopicId, setSelectedTopicId] = useState(1);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0];

  const handleAICheck = async () => {
    if (!answer.trim()) return;
    setIsLoading(true);
    setFeedback("");
    
    const result = await evaluateEssay(currentTopic.prompt, answer);
    
    setFeedback(result);
    setIsLoading(false);
    onEssaySubmit(); // Award badge or points
  };

  return (
    <div className="pb-20 space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-2">
        {TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => { setSelectedTopicId(topic.id); setAnswer(""); setFeedback(""); }}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              selectedTopicId === topic.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="mb-6">
                <span className="text-indigo-600 font-bold tracking-wider text-xs bg-indigo-50 px-3 py-1 rounded-full uppercase">Question</span>
                <h3 className="font-bold text-2xl text-slate-800 mt-3 mb-2">{currentTopic.title}</h3>
                <p className="text-slate-600 bg-slate-50 p-6 rounded-2xl text-base leading-relaxed border border-slate-100">
                {currentTopic.prompt}
                </p>
            </div>

            <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="여기에 생각을 적어보세요 (2~3문장)"
            className="w-full h-48 p-6 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none resize-none text-slate-800 text-base leading-relaxed mb-4 flex-grow"
            />

            <div className="flex justify-end mt-auto">
            <button
                onClick={handleAICheck}
                disabled={isLoading || !answer.trim()}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
                {isLoading ? (
                <><span className="animate-spin text-xl">◌</span> AI 선생님이 채점 중...</>
                ) : (
                <><Sparkles size={20} /> AI 피드백 받기</>
                )}
            </button>
            </div>
        </div>

        {/* Feedback Area */}
        <div className={`transition-all duration-500 ${feedback ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
            {feedback ? (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 shadow-sm h-full">
                <h4 className="flex items-center gap-3 font-bold text-indigo-900 mb-6 text-xl">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-purple-600"><Sparkles size={24} /></div>
                    선생님 AI의 피드백
                </h4>
                <div className="bg-white/60 p-6 rounded-2xl border border-white/50 backdrop-blur-sm">
                    <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                        {feedback}
                    </p>
                </div>
                </div>
            ) : (
                <div className="h-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8">
                    <PenTool size={48} className="mb-4 opacity-50" />
                    <p>답변을 작성하고 AI의 피드백을 받아보세요!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TabEssay;