import React, { useState, useEffect } from 'react';
import { SIMULATION_CARDS, ERAS } from '../constants';
import { Card, EraId } from '../types';

interface SimulationTabProps {
  onComplete: (score: number) => void;
  updateProgress: (progress: number) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onComplete, updateProgress }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>({
    msg: "왼쪽의 카드를 선택한 후, 오른쪽의 올바른 시대를 클릭하세요.",
    type: 'info'
  });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Shuffle cards on mount
    const shuffled = [...SIMULATION_CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleCardClick = (id: string) => {
    // Prevent clicking already matched cards (though they are hidden)
    if (cards.find(c => c.id === id)) {
        setSelectedCard(id);
        setFeedback({ msg: "이 카드가 속할 역사적 시대를 오른쪽에서 선택하세요.", type: 'info' });
    }
  };

  const handleEraClick = (eraId: EraId) => {
    if (!selectedCard) {
      setFeedback({ msg: "먼저 배치할 카드를 선택해주세요.", type: 'error' });
      return;
    }

    const card = cards.find(c => c.id === selectedCard);
    if (!card) return;

    if (card.correctEra === eraId) {
      // Correct
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedback({ 
        msg: `정답입니다! ${newStreak > 1 ? `${newStreak}연속 정답! 보너스 점수 획득!` : ''}`, 
        type: 'success' 
      });
      
      // Remove card from pool
      const remainingCards = cards.filter(c => c.id !== selectedCard);
      setCards(remainingCards);
      setSelectedCard(null);
      
      const newMatchedCount = matchedCount + 1;
      setMatchedCount(newMatchedCount);
      
      const progress = Math.round((newMatchedCount / SIMULATION_CARDS.length) * 100);
      updateProgress(progress);

      if (remainingCards.length === 0) {
        onComplete(100 + (newStreak * 10)); // Base score + streak bonus
        setFeedback({ msg: "모든 역사를 완벽하게 분류했습니다! 축하합니다.", type: 'success' });
      }

    } else {
      // Incorrect
      setStreak(0);
      let hint = "";
      if (card.correctEra === 'era1') hint = "이 기술은 규칙 기반의 초기 AI 시대(1950-70s)에 해당합니다.";
      else if (card.correctEra === 'era2') hint = "이 내용은 데이터 부족과 과도기적 특징을 보인 1980-90년대입니다.";
      else hint = "이것은 빅데이터와 딥러닝이 주도하는 현대(2000s~)의 특징입니다.";
      
      setFeedback({ 
        msg: `틀렸습니다. 당시 상황을 떠올려보세요. (힌트: ${hint})`, 
        type: 'error' 
      });
    }
  };

  return (
    <div className="flex flex-col h-[600px] lg:h-[700px] gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-bold text-slate-800">역사 퍼즐 맞추기</h2>
            <p className="text-sm text-slate-500">남은 카드: {cards.length} / {SIMULATION_CARDS.length}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            feedback?.type === 'success' ? 'bg-green-100 text-green-800' :
            feedback?.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-indigo-50 text-indigo-800'
        }`}>
            {feedback?.msg}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* Card Pool */}
        <div className="lg:w-1/3 bg-slate-100 p-4 rounded-xl border border-slate-200 overflow-y-auto">
            <h3 className="font-semibold text-slate-700 mb-4 sticky top-0 bg-slate-100 pb-2 border-b border-slate-200">배치할 카드</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {cards.map(card => (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`p-4 rounded-lg text-left text-sm transition-all shadow-sm border-2 ${
                            selectedCard === card.id 
                            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
                            : 'border-white bg-white hover:border-indigo-300'
                        }`}
                    >
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${
                            card.type === 'event' ? 'bg-blue-100 text-blue-700' :
                            card.type === 'role' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                            {card.type === 'event' ? '사건' : card.type === 'role' ? '인간의 역할' : '기술'}
                        </span>
                        <div className="font-medium text-slate-800">{card.content}</div>
                    </button>
                ))}
                {cards.length === 0 && (
                    <div className="text-center text-slate-400 py-10 italic">
                        모든 카드를 분류했습니다!
                    </div>
                )}
            </div>
        </div>

        {/* Eras Targets */}
        <div className="lg:w-2/3 grid grid-rows-3 gap-4 h-full">
            {ERAS.map(era => (
                <div 
                    key={era.id}
                    onClick={() => handleEraClick(era.id)}
                    className="relative bg-white rounded-xl border-2 border-slate-200 hover:border-indigo-400 cursor-pointer transition-all p-4 flex flex-col justify-center group"
                >
                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 text-4xl font-black text-slate-900">
                        {era.period.split(' ')[0]}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{era.title} <span className="text-sm font-normal text-slate-500">({era.period})</span></h3>
                    <p className="text-sm text-slate-600 mt-1">{era.keywords.join(', ')}</p>
                    
                    {/* Visual cue for drop zone */}
                    {selectedCard && (
                        <div className="absolute inset-0 bg-indigo-500 bg-opacity-5 border-2 border-dashed border-indigo-300 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none flex items-center justify-center">
                            <span className="text-indigo-600 font-bold bg-white px-3 py-1 rounded shadow-sm">여기에 배치</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
