import React, { useState, useEffect } from 'react';
import { SituationCard, AgentType, ReasoningTag } from '../types';
import { SITUATION_CARDS, REASONING_TAG_LABELS } from '../constants';
import { Shuffle, Check, X, ArrowRight, Brain, Zap } from 'lucide-react';

interface SimulationGameProps {
  onScoreUpdate: (points: number, isSuccess: boolean) => void;
  completedCards: string[];
}

const SimulationGame: React.FC<SimulationGameProps> = ({ onScoreUpdate, completedCards }) => {
  const [currentCard, setCurrentCard] = useState<SituationCard | null>(null);
  const [step, setStep] = useState<'DRAW' | 'CLASSIFY' | 'REASON' | 'RESULT'>('DRAW');
  const [selectedType, setSelectedType] = useState<AgentType | null>(null);
  const [selectedTags, setSelectedTags] = useState<ReasoningTag[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [dailyCount, setDailyCount] = useState(0);

  // Filter available cards
  const availableCards = SITUATION_CARDS.filter(c => !completedCards.includes(c.id));

  const drawCard = () => {
    if (availableCards.length === 0) {
      alert("모든 카드를 완료했습니다! 대단해요!");
      return;
    }
    if (dailyCount >= 5) {
      alert("오늘의 감별 미션(5장)을 모두 완료했습니다!");
      return;
    }

    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    setCurrentCard(randomCard);
    setStep('CLASSIFY');
    setSelectedType(null);
    setSelectedTags([]);
    setFeedbackMsg('');
    setDailyCount(prev => prev + 1);
  };

  const handleClassify = (type: AgentType) => {
    setSelectedType(type);
    if (type === currentCard?.correctType) {
      setStep('REASON');
    } else {
      setFeedbackMsg(`틀렸습니다! ${currentCard?.title}은(는) 왜 ${type === 'GENERAL' ? '일반' : '지능'}형이 아닐까요?`);
      onScoreUpdate(-5, false);
      setStep('RESULT'); // Fail immediately on wrong classification
    }
  };

  const toggleTag = (tag: ReasoningTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const submitReasoning = () => {
    if (!currentCard) return;

    // Check if user selected at least one correct tag. 
    // For strict scoring, we could require ALL correct tags, but for education, finding the key ones is enough.
    const correctTags = currentCard.correctReasoning;
    const hasKeyReason = selectedTags.some(tag => correctTags.includes(tag));
    
    // Penalize if selecting completely wrong tags (e.g., Learning for a Rule Bot)
    const isTotallyWrong = selectedTags.some(tag => 
       currentCard.correctType === 'GENERAL' && ['LEARNING', 'AUTONOMY'].includes(tag)
    );

    if (hasKeyReason && !isTotallyWrong) {
      setFeedbackMsg("정확한 분석입니다! 훌륭한 감별사시군요.");
      onScoreUpdate(20, true);
    } else {
      setFeedbackMsg(`분류는 맞았지만 근거가 조금 부족해요. 정답 근거: ${correctTags.map(t => REASONING_TAG_LABELS[t]).join(', ')}`);
      onScoreUpdate(10, true); // Partial credit
    }
    setStep('RESULT');
  };

  if (step === 'DRAW') {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="mb-6 bg-blue-100 p-6 rounded-full text-blue-600">
          <Shuffle size={48} />
        </div>
        <h3 className="text-xl font-bold mb-2">새로운 의뢰가 도착했습니다</h3>
        <p className="text-slate-500 mb-6">오늘의 할당량: {dailyCount}/5</p>
        <button 
          onClick={drawCard}
          disabled={dailyCount >= 5}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          상황 카드 뽑기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <span className="text-xs font-mono uppercase bg-slate-700 px-2 py-1 rounded">Case #{currentCard?.id.toUpperCase()}</span>
        <span className="font-bold">에이전트 감별 프로세스</span>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">{currentCard?.title}</h2>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8 text-lg leading-relaxed text-slate-700">
          {currentCard?.description}
        </div>

        {step === 'CLASSIFY' && (
          <div className="space-y-4">
            <p className="text-center font-medium text-slate-500 mb-4">이 에이전트의 유형을 판별하세요.</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleClassify('GENERAL')}
                className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <Zap className="text-slate-400 group-hover:text-blue-500" size={32} />
                <span className="font-bold text-lg text-slate-700 group-hover:text-blue-600">일반 에이전트</span>
                <span className="text-xs text-slate-400">규칙 기반 / 단순 반응</span>
              </button>
              <button
                onClick={() => handleClassify('INTELLIGENT')}
                className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition group"
              >
                <Brain className="text-slate-400 group-hover:text-purple-500" size={32} />
                <span className="font-bold text-lg text-slate-700 group-hover:text-purple-600">지능 에이전트</span>
                <span className="text-xs text-slate-400">학습 / 추론 / 목표</span>
              </button>
            </div>
          </div>
        )}

        {step === 'REASON' && (
          <div className="animate-fade-in">
            <p className="text-center font-medium text-slate-500 mb-4">
              <span className="text-green-600 font-bold">1차 판별 성공!</span> 핵심 근거를 1~3개 선택하세요.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {(Object.keys(REASONING_TAG_LABELS) as ReasoningTag[]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                    ${selectedTags.includes(tag) 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                >
                  {REASONING_TAG_LABELS[tag]}
                </button>
              ))}
            </div>
            <button
              onClick={submitReasoning}
              disabled={selectedTags.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              최종 판별 제출
            </button>
          </div>
        )}

        {step === 'RESULT' && (
          <div className="animate-fade-in text-center">
            <div className={`inline-flex p-4 rounded-full mb-4 ${feedbackMsg.includes('틀렸') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {feedbackMsg.includes('틀렸') ? <X size={40} /> : <Check size={40} />}
            </div>
            <h3 className="text-xl font-bold mb-2">판별 결과</h3>
            <p className="text-slate-700 mb-6">{feedbackMsg}</p>
            
            <div className="bg-slate-100 p-4 rounded-lg text-left mb-6 text-sm">
              <span className="font-bold block mb-1">상세 해설:</span>
              {currentCard?.explanation}
            </div>

            <button
              onClick={() => setStep('DRAW')}
              className="flex items-center justify-center gap-2 mx-auto text-blue-600 font-bold hover:underline"
            >
              다음 사건으로 이동 <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationGame;