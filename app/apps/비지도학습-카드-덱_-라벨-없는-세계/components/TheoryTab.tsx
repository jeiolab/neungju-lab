import React, { useState } from 'react';
import { CONCEPTS } from '../data';
import { Brain, CheckCircle, Clock, RotateCcw } from 'lucide-react';
import { UserStats, ConceptCard } from '../types';

interface Props {
  userStats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onRequestReview: (conceptId: string) => void;
}

const TheoryTab: React.FC<Props> = ({ userStats, onUpdateStats, onRequestReview }) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [checking, setChecking] = useState<string | null>(null); // Id of card being checked
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  const handleCardClick = (id: string) => {
    setActiveCardId(activeCardId === id ? null : id);
    setChecking(null);
    setFeedback(null);
  };

  const handleCheckAnswer = (card: ConceptCard, optionIndex: number) => {
    const isCorrect = card.checkQuestion.answer === optionIndex;
    setFeedback({
      correct: isCorrect,
      msg: isCorrect ? "정답입니다! (+8 Mastery)" : "아쉽네요. 다시 읽어보세요."
    });

    if (isCorrect) {
      // Update Mastery
      const newMastery = { ...userStats.mastery };
      const current = newMastery[card.id] || 0;
      if (current < 100) {
        newMastery[card.id] = Math.min(100, current + 8);
      }
      
      // Update Cards Reviewed Today if not already done recently (simplified logic)
      onUpdateStats({
        ...userStats,
        mastery: newMastery,
        cardsReviewedToday: userStats.cardsReviewedToday + 1
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
      {userStats.reviewQueue.length > 0 && (
        <div className="col-span-1 md:col-span-2 bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 font-medium">오늘의 복습 큐: {userStats.reviewQueue.length}개의 카드가 기다립니다.</span>
          </div>
        </div>
      )}

      {CONCEPTS.map((card) => {
        const mastery = userStats.mastery[card.id] || 0;
        const isExpanded = activeCardId === card.id;
        const isReviewNeeded = userStats.reviewQueue.includes(card.id);

        return (
          <div 
            key={card.id} 
            className={`relative bg-white rounded-xl shadow-sm border transition-all duration-300 ${
              isReviewNeeded ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'
            } ${isExpanded ? 'row-span-2' : ''}`}
          >
            {/* Header */}
            <div 
              onClick={() => handleCardClick(card.id)}
              className="p-5 cursor-pointer hover:bg-slate-50 transition-colors rounded-t-xl"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <div className={`w-2 h-8 rounded-full ${mastery > 80 ? 'bg-green-500' : mastery > 40 ? 'bg-yellow-400' : 'bg-slate-300'}`}></div>
                  {card.title}
                </h3>
                {isReviewNeeded && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">복습 필요</span>}
              </div>
              <p className="text-slate-600 mt-2 text-sm leading-relaxed">{card.definition}</p>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-xl animate-fadeIn">
                <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4">
                  <h4 className="font-semibold text-slate-700 mb-2 text-sm">심화 설명</h4>
                  <p className="text-slate-600 text-sm">{card.detail}</p>
                </div>

                {checking === card.id ? (
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 text-sm mb-3">10초 체크!</h4>
                    <p className="text-sm font-medium mb-3">{card.checkQuestion.q}</p>
                    <div className="space-y-2">
                      {card.checkQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCheckAnswer(card, idx)}
                          disabled={!!feedback}
                          className={`w-full text-left text-sm p-2 rounded border ${
                            feedback 
                              ? idx === card.checkQuestion.answer 
                                ? 'bg-green-100 border-green-300 text-green-800' 
                                : feedback.correct ? 'opacity-50' : idx === userStats.mastery[card.id] ? 'bg-red-100' : 'bg-white'
                              : 'bg-white border-slate-200 hover:bg-indigo-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {feedback && (
                      <div className={`mt-3 text-sm font-bold ${feedback.correct ? 'text-green-600' : 'text-red-500'}`}>
                        {feedback.msg}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => setChecking(card.id)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> 이해도 체크
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRequestReview(card.id); }}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> 나중에 복습
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TheoryTab;