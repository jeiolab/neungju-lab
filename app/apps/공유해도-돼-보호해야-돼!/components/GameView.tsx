import React, { useState, useEffect } from 'react';
import { CardType, ConditionOption, GameCard } from '../types';
import { GAME_CARDS } from '../constants';
import { Check, X, Shield, Share2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface GameViewProps {
  onComplete: (score: number, correctCount: number, misconceptions: string[]) => void;
}

const GameView: React.FC<GameViewProps> = ({ onComplete }) => {
  const [deck, setDeck] = useState<GameCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; msg: string } | null>(null);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<ConditionOption[]>([]);
  const [misconceptions, setMisconceptions] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const shuffled = [...GAME_CARDS].sort(() => 0.5 - Math.random()).slice(0, 10);
    setDeck(shuffled);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver && deck.length > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
  }, [timeLeft, isGameOver, deck]);

  const handleGameOver = () => {
    setIsGameOver(true);
    onComplete(score, correctCount, misconceptions);
  };

  const currentCard = deck[currentIndex];

  const handleChoice = (type: CardType) => {
    if (isGameOver) return;
    if (type === CardType.CONDITIONAL) {
      setSelectedConditions([]);
      setShowConditionModal(true);
      return;
    }
    processAnswer(type);
  };

  const submitConditional = () => {
    setShowConditionModal(false);
    processAnswer(CardType.CONDITIONAL, selectedConditions);
  };

  const processAnswer = (userType: CardType, userConditions?: ConditionOption[]) => {
    if (!currentCard) return;

    let isCorrect = false;
    let points = 0;
    let misconceptionTag = "";

    if (userType === currentCard.type) {
      if (userType === CardType.CONDITIONAL) {
        const required = currentCard.requiredConditions || [];
        const missing = required.filter(r => !userConditions?.includes(r));
        
        if (missing.length === 0) {
          isCorrect = true;
          points = 100;
        } else {
          misconceptionTag = "조건 선택 미흡";
          setFeedback({ type: 'wrong', msg: `조건이 부족해요! 필요 조건: ${missing.join(', ')}` });
        }
      } else {
        isCorrect = true;
        points = 100;
      }
    } else {
        if(currentCard.type === CardType.SHARE && userType === CardType.PROTECT) misconceptionTag = "과잉보호";
        if(currentCard.type === CardType.PROTECT && userType === CardType.SHARE) misconceptionTag = "무방비공유";
        if(currentCard.type === CardType.CONDITIONAL && userType === CardType.SHARE) misconceptionTag = "조건무시";
    }

    if (isCorrect) {
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setFeedback({ type: 'correct', msg: `정답! ${currentCard.explanation}` });
    } else if (!isCorrect && !misconceptionTag) {
       setFeedback({ type: 'wrong', msg: `오답입니다. ${currentCard.explanation}` });
    }

    if (misconceptionTag) {
        setMisconceptions(prev => [...prev, misconceptionTag]);
        setFeedback({ type: 'wrong', msg: `아쉬워요. (${misconceptionTag}) ${currentCard.explanation}` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < deck.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        handleGameOver();
      }
    }, 2000);
  };

  if (deck.length === 0) return <div className="text-center p-10">로딩 중...</div>;
  if (isGameOver) return <div className="text-center p-10 text-xl">게임 종료! 결과 집계 중...</div>;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
      
      {/* Left Column: The Card (Focus Area) */}
      <div className="lg:col-span-8 flex flex-col relative bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header HUD */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
           <div className="flex items-center gap-2 text-slate-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
               <Clock size={18}/> 
               <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
           </div>
           <div className="text-slate-400 font-medium">Card {currentIndex + 1} / {deck.length}</div>
        </div>

        {/* Card Content Area */}
        <div className="flex-grow flex items-center justify-center p-12 relative bg-slate-50">
             <div className="absolute top-6 right-6">
                <span className="text-sm font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {currentCard.category}
                </span>
             </div>
             
             <h2 className="text-3xl font-bold text-slate-800 text-center leading-normal max-w-2xl">
                 {currentCard.content}
             </h2>

            {/* Feedback Overlay */}
            {feedback && (
            <div className={clsx(
                "absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-opacity-95 backdrop-blur-md z-10 transition-opacity duration-300",
                feedback.type === 'correct' ? 'bg-green-600' : 'bg-red-600'
            )}>
                <div className="animate-bounce mb-4">
                    {feedback.type === 'correct' ? <Check size={64} /> : <X size={64} />}
                </div>
                <p className="font-bold text-3xl mb-4">{feedback.type === 'correct' ? '정답입니다!' : '틀렸습니다!'}</p>
                <p className="text-xl max-w-xl opacity-90 leading-relaxed">{feedback.msg}</p>
            </div>
            )}
        </div>
      </div>

      {/* Right Column: Controls & Score */}
      <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Score Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
               <div>
                   <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Current Score</p>
                   <p className="text-4xl font-extrabold text-indigo-600">{score}</p>
               </div>
               <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                   <TrophyIcon className="text-indigo-500" />
               </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-grow grid grid-rows-3 gap-4">
            <button 
                onClick={() => handleChoice(CardType.SHARE)}
                className="group relative flex items-center justify-between px-8 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-2xl transition-all duration-300 border border-blue-100 hover:border-blue-600 hover:shadow-lg"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/50 rounded-xl group-hover:bg-white/20 transition-colors">
                        <Share2 size={24} />
                    </div>
                    <span className="text-xl font-bold">공유해도 돼!</span>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button 
                onClick={() => handleChoice(CardType.CONDITIONAL)}
                className="group relative flex items-center justify-between px-8 bg-yellow-50 hover:bg-yellow-500 text-yellow-700 hover:text-white rounded-2xl transition-all duration-300 border border-yellow-100 hover:border-yellow-500 hover:shadow-lg"
            >
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-white/50 rounded-xl group-hover:bg-white/20 transition-colors">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="text-left">
                        <span className="block text-xl font-bold">조건부 공유</span>
                        <span className="text-xs opacity-70 font-medium">동의나 가명처리가 필요해요</span>
                    </div>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button 
                onClick={() => handleChoice(CardType.PROTECT)}
                className="group relative flex items-center justify-between px-8 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded-2xl transition-all duration-300 border border-red-100 hover:border-red-600 hover:shadow-lg"
            >
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-white/50 rounded-xl group-hover:bg-white/20 transition-colors">
                        <Shield size={24} />
                    </div>
                    <span className="text-xl font-bold">절대 보호!</span>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
      </div>

      {/* Conditional Modal */}
      {showConditionModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl transform transition-all scale-100">
            <h3 className="text-2xl font-bold mb-2 text-slate-800">어떤 조건이 필요한가요?</h3>
            <p className="text-slate-500 mb-6">해당 정보를 공유하기 위해 필요한 조치를 모두 선택해주세요.</p>
            
            <div className="grid grid-cols-1 gap-3 mb-8">
              {Object.values(ConditionOption).map((option) => (
                <label key={option} className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedConditions.includes(option) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}>
                  <div className={`w-6 h-6 rounded border flex items-center justify-center ${selectedConditions.includes(option) ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-slate-300'}`}>
                      {selectedConditions.includes(option) && <Check size={14} className="text-white"/>}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedConditions.includes(option)}
                    onChange={(e) => {
                        if (e.target.checked) setSelectedConditions(prev => [...prev, option]);
                        else setSelectedConditions(prev => prev.filter(c => c !== option));
                    }}
                    className="hidden"
                  />
                  <span className={`text-lg font-medium ${selectedConditions.includes(option) ? 'text-indigo-900' : 'text-slate-600'}`}>{option}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => setShowConditionModal(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                    취소
                </button>
                <button 
                    onClick={submitConditional}
                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                    선택 완료
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Icon Component for specific use
const TrophyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

export default GameView;