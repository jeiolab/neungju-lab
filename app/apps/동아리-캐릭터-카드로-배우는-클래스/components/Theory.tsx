import React, { useState } from 'react';
import { THEORY_CARDS } from '../constants';
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { UserProgress } from '../types';

interface TheoryProps {
  onProgressUpdate: (newProgress: Partial<UserProgress>) => void;
  progress: UserProgress;
}

export const Theory: React.FC<TheoryProps> = ({ onProgressUpdate, progress }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [checkAnswer, setCheckAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentCard = THEORY_CARDS[currentCardIndex];
  const isLastCard = currentCardIndex === THEORY_CARDS.length - 1;

  const handleNext = () => {
    if (isLastCard) return;
    setCurrentCardIndex((prev) => prev + 1);
    resetCardState();
  };

  const handlePrev = () => {
    if (currentCardIndex === 0) return;
    setCurrentCardIndex((prev) => prev - 1);
    resetCardState();
  };

  const resetCardState = () => {
    setIsFlipped(false);
    setCheckAnswer(null);
    setIsCorrect(null);
  };

  const handleCheckAnswer = (idx: number) => {
    setCheckAnswer(idx);
    const correct = idx === currentCard.checkQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      // Simple XP gain logic
      onProgressUpdate({ xp: progress.xp + 5 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">개념 카드 학습</h2>
        <span className="text-sm font-medium text-slate-500">
          {currentCardIndex + 1} / {THEORY_CARDS.length}
        </span>
      </div>

      {/* Card Area */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] perspective-1000">
        <div 
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full relative transition-all duration-300"
        >
            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg sm:text-xl">{currentCard.title}</h3>
              <div className="flex gap-1">
                 {currentCard.keywords.map((kw, i) => (
                   <span key={i} className="text-xs bg-indigo-500 px-2 py-1 rounded-full">{kw}</span>
                 ))}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col overflow-y-auto">
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">한 줄 정의</span>
                <p className="text-lg font-medium text-slate-800 leading-relaxed break-keep">
                  {currentCard.definition}
                </p>
              </div>

              <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">예시</span>
                <p className="text-slate-700 break-keep">{currentCard.example}</p>
              </div>

              {/* Misconception Toggle */}
              <div className="mt-auto">
                <button 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-lg transition-colors border border-orange-200"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-bold text-sm">흔한 오해와 진실</span>
                  </div>
                  <span className="text-xs underline">{isFlipped ? '접기' : '펼쳐보기'}</span>
                </button>
                
                {isFlipped && (
                  <div className="mt-2 p-3 bg-white border border-orange-200 rounded-lg text-sm space-y-2 animate-fadeIn">
                    <p className="text-slate-500 line-through decoration-red-500 decoration-2">"{currentCard.misconception.statement}"</p>
                    <div className="flex gap-2 text-indigo-700 items-start">
                      <Lightbulb className="w-4 h-4 mt-1 flex-shrink-0" />
                      <p className="font-medium">{currentCard.misconception.correction}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Check Question Area */}
            <div className="bg-indigo-50 p-4 border-t border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-800 mb-2 uppercase flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> 10초 체크
              </h4>
              <p className="text-sm font-medium text-slate-800 mb-3">{currentCard.checkQuestion.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {currentCard.checkQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCheckAnswer(idx)}
                    disabled={checkAnswer !== null}
                    className={`text-xs p-2 rounded border text-left transition-all ${
                      checkAnswer === idx
                        ? isCorrect 
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    } ${checkAnswer !== null && idx === currentCard.checkQuestion.answer ? 'bg-green-100 border-green-500' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {checkAnswer !== null && (
                 <div className={`mt-2 text-xs font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                   {isCorrect ? '정답입니다! (+5 XP)' : '다시 한 번 생각해보세요.'}
                 </div>
              )}
            </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center px-2">
        <button 
          onClick={handlePrev} 
          disabled={currentCardIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" /> 이전
        </button>
        <div className="flex gap-1">
          {THEORY_CARDS.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-colors ${idx === currentCardIndex ? 'bg-indigo-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
        <button 
           onClick={handleNext}
           disabled={isLastCard}
           className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
        >
          다음 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
