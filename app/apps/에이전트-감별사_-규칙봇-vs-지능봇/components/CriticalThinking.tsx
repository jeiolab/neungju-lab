import React, { useState } from 'react';
import { SITUATION_CARDS } from '../constants';
import { evaluateCriticalThinking } from '../services/geminiService';
import { MessageSquare, Sparkles, Send } from 'lucide-react';

const CriticalThinking: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState(SITUATION_CARDS[0].id);
  const [userReflection, setUserReflection] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedScenario = SITUATION_CARDS.find(s => s.id === selectedScenarioId);

  const handleSubmit = async () => {
    if (!userReflection.trim() || !selectedScenario) return;

    setIsLoading(true);
    setFeedback(null);

    const result = await evaluateCriticalThinking(
      selectedScenario.title,
      userReflection,
      selectedScenario.correctType === 'GENERAL' ? '일반 에이전트' : '지능 에이전트'
    );

    setFeedback(result);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4 text-purple-700">
        <Sparkles size={24} />
        <h2 className="text-xl font-bold">생각해볼 문제: 반례 찾기</h2>
      </div>
      
      <p className="text-slate-600 mb-6">
        선택한 에이전트가 다른 유형으로 바뀌려면 어떤 조건이 필요할까요? 
        혹은 내가 고른 분류가 틀릴 수 있는 예외 상황은 무엇일까요?
        <br/><span className="text-xs text-slate-400">* AI 감별사 선생님이 피드백을 드립니다.</span>
      </p>

      <div className="mb-4">
        <label className="block text-sm font-bold text-slate-700 mb-2">대상 시나리오 선택</label>
        <select 
          className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
          value={selectedScenarioId}
          onChange={(e) => {
            setSelectedScenarioId(e.target.value);
            setFeedback(null);
            setUserReflection('');
          }}
        >
          {SITUATION_CARDS.map(card => (
            <option key={card.id} value={card.id}>{card.title} ({card.correctType === 'GENERAL' ? '일반' : '지능'})</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-600 mb-2">
          {selectedScenario?.description}
        </div>
        <textarea
          className="w-full p-4 border border-slate-300 rounded-lg h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          placeholder="예: '자동 출석 게이트'라도 얼굴을 인식해서 기분을 파악하고 '힘내세요'라고 말해준다면 지능형이 될 것 같아요."
          value={userReflection}
          onChange={(e) => setUserReflection(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !userReflection.trim()}
        className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg disabled:bg-slate-300 transition-colors"
      >
        {isLoading ? 'AI가 생각 중...' : <><Send size={18} /> 의견 제출 및 피드백 받기</>}
      </button>

      {feedback && (
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4 animate-fade-in relative">
          <div className="absolute top-0 left-0 -mt-3 ml-4 bg-purple-600 text-white text-xs px-2 py-1 rounded">AI 선생님 피드백</div>
          <div className="flex gap-3 mt-2">
            <MessageSquare className="text-purple-400 shrink-0 mt-1" />
            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriticalThinking;