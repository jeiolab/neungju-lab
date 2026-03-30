import React, { useState } from 'react';
import { ConceptCard, UserState } from '../types';
import { CheckCircle, HelpCircle, ChevronRight, XCircle } from 'lucide-react';
import { CONCEPTS } from '../constants';

interface TheoryTabProps {
  userState: UserState;
  onUpdateStatus: (id: string, status: 'understood' | 'confused') => void;
  onCheckAnswer: (id: string, isCorrect: boolean) => void;
  recommendedIds: string[];
}

const TheoryTab: React.FC<TheoryTabProps> = ({ userState, onUpdateStatus, onCheckAnswer, recommendedIds }) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    if (activeCardId === id) {
      setActiveCardId(null);
    } else {
      setActiveCardId(id);
      setSelectedOption(null);
      setCheckFeedback(null);
    }
  };

  const submitCheck = (card: ConceptCard) => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === card.checkQuestion.answerIndex;
    setCheckFeedback(isCorrect ? "정답입니다! 🎉" : "아쉽네요. 다시 생각해볼까요? 🤔");
    onCheckAnswer(card.id, isCorrect);
  };

  return (
    <div className="pb-20">
      {recommendedIds.length > 0 && (
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-bold text-yellow-800 mb-2">💡 오늘의 추천 학습 (취약 개념)</h3>
          <div className="flex gap-2 flex-wrap">
            {recommendedIds.map(id => {
              const c = CONCEPTS.find(x => x.id === id);
              return c ? (
                <button 
                  key={id}
                  onClick={() => handleCardClick(id)}
                  className="px-3 py-1 bg-white text-xs border border-yellow-300 rounded-full shadow-sm hover:bg-yellow-100"
                >
                  {c.title}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((card) => {
          const status = userState.cardStatus[card.id];
          const isCheckDone = userState.checkQuestionHistory[card.id];
          const isActive = activeCardId === card.id;

          return (
            <div 
              key={card.id} 
              className={`bg-white rounded-xl shadow-md border-2 transition-all duration-300 overflow-hidden ${
                isActive ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-transparent'
              }`}
            >
              {/* Card Header */}
              <div 
                onClick={() => handleCardClick(card.id)}
                className="p-4 cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${status === 'understood' ? 'bg-green-500' : status === 'confused' ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                    <div>
                        <h3 className="font-bold text-gray-800">{card.title}</h3>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{card.definition}</p>
                    </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />
              </div>

              {/* Expanded Content */}
              {isActive && (
                <div className="p-4 border-t border-gray-100 animate-fadeIn">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-indigo-600 mb-1">핵심 키워드</p>
                    <div className="flex flex-wrap gap-2">
                      {card.keywords.map(k => (
                        <span key={k} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md">#{k}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-green-600 mb-1">예시</p>
                    <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">{card.example}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-red-500 mb-1">흔한 오해 & 교정</p>
                    <div className="text-sm bg-red-50 p-2 rounded">
                        <p className="text-gray-600 mb-1">❌ {card.misconception}</p>
                        <p className="text-gray-800 font-medium">⭕ {card.correction}</p>
                    </div>
                  </div>

                  {/* 10s Check */}
                  <div className="bg-gray-800 text-white p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-yellow-400">10초 체크!</span>
                        {isCheckDone && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12}/> 완료됨</span>}
                    </div>
                    <p className="text-sm font-medium mb-3">{card.checkQuestion.question}</p>
                    <div className="space-y-2">
                      {card.checkQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedOption(idx)}
                          disabled={!!checkFeedback}
                          className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                            selectedOption === idx 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {selectedOption !== null && !checkFeedback && (
                        <button 
                            onClick={() => submitCheck(card)}
                            className="mt-3 w-full py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded"
                        >
                            정답 확인
                        </button>
                    )}
                    {checkFeedback && (
                        <div className="mt-3 text-sm p-2 bg-gray-700 rounded animate-pulse">
                            <p className="font-bold mb-1">{checkFeedback}</p>
                            <p className="text-xs text-gray-300">{card.checkQuestion.explanation}</p>
                        </div>
                    )}
                  </div>

                  {/* Status Toggles */}
                  <div className="mt-6 flex gap-2 border-t pt-4">
                    <button 
                        onClick={() => onUpdateStatus(card.id, 'understood')}
                        className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors ${status === 'understood' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <CheckCircle size={16} /> 알겠음
                    </button>
                    <button 
                        onClick={() => onUpdateStatus(card.id, 'confused')}
                        className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors ${status === 'confused' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <HelpCircle size={16} /> 헷갈림
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TheoryTab;
