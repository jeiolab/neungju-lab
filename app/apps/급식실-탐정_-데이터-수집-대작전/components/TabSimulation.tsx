import React, { useState } from 'react';
import { MISSIONS } from '../constants';
import { Mission, UserState } from '../types';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface Props {
  userState: UserState;
  updateUserState: (newState: Partial<UserState>) => void;
}

const TabSimulation: React.FC<Props> = ({ userState, updateUserState }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Assuming levels correspond to mission indices for simplicity
  const mission = MISSIONS[currentStep];
  const isComplete = currentStep >= MISSIONS.length;

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const checkAnswer = () => {
    if (!selectedOption || !mission) return;
    
    const correct = selectedOption === mission.correctId;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const newCoins = userState.coins + 10;
      let newBadges = [...userState.badges];
      
      // Award badge if finishing final level
      if (currentStep === MISSIONS.length - 1 && !userState.badges.includes('명탐정 배지')) {
          newBadges.push('명탐정 배지');
      }

      updateUserState({
        coins: newCoins,
        badges: newBadges,
        level: Math.max(userState.level, currentStep + 2) // Level starts at 1
      });
    } else {
      // Save wrong answer
      const wrongNote = {
        id: `${mission.id}-${Date.now()}`,
        question: mission.title,
        yourAnswer: mission.options.find(o => o.id === selectedOption)?.label || '',
        correctAnswer: mission.options.find(o => o.id === mission.correctId)?.label || '',
        explanation: mission.feedbackWrong,
        timestamp: Date.now()
      };
      updateUserState({
        wrongAnswers: [wrongNote, ...userState.wrongAnswers]
      });
    }
  };

  const nextMission = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setCurrentStep(prev => prev + 1);
  };

  const retryMission = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl text-center space-y-6">
        <Award className="w-24 h-24 text-amber-500 animate-bounce" />
        <h2 className="text-3xl font-bold text-slate-800">모든 미션 완료!</h2>
        <p className="text-slate-600 text-lg">
          축하합니다, <strong>{userState.name}</strong> 탐정님!<br/>
          급식실 문제 해결을 위한 완벽한 데이터 수집 계획을 세웠어요.
        </p>
        <div className="bg-indigo-50 p-6 rounded-xl w-full max-w-md">
          <p className="font-bold text-indigo-900 mb-2">획득한 보상</p>
          <div className="flex justify-center gap-4 text-2xl">
            <span>💰 {userState.coins} 코인</span>
            <span>🏅 {userState.badges.length} 배지</span>
          </div>
        </div>
        <button 
          onClick={() => setCurrentStep(0)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          처음부터 다시하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${((currentStep) / MISSIONS.length) * 100}%` }}
        ></div>
        <p className="text-right text-xs text-slate-500 mt-1">Level {currentStep + 1} / {MISSIONS.length}</p>
      </div>

      {/* Scenario Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">MISSION {mission.id}: {mission.title}</h3>
          <span className="text-amber-400 text-sm font-medium">탐정의 선택</span>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
            <h4 className="font-bold text-indigo-900 mb-1">상황 (Scenario)</h4>
            <p className="text-slate-700 leading-relaxed">{mission.scenario}</p>
          </div>
          
          <div className="text-center font-medium text-slate-600">
            <p className="mb-4 text-lg">{mission.description}</p>
            <p className="text-sm text-slate-400">👇 아래에서 올바른 도구를 선택하세요 👇</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {mission.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showFeedback}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 group
                  ${selectedOption === option.id 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]' 
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }
                  ${showFeedback && option.id === mission.correctId ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : ''}
                  ${showFeedback && selectedOption === option.id && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                `}
              >
                <div className={`
                  p-3 rounded-full 
                  ${selectedOption === option.id ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-500'}
                `}>
                  {option.icon}
                </div>
                <span className="font-bold text-lg text-slate-800">{option.label}</span>
                
                {/* Result Icons */}
                {showFeedback && option.id === mission.correctId && (
                   <CheckCircle2 className="absolute top-4 right-4 text-green-600 w-6 h-6" />
                )}
                {showFeedback && selectedOption === option.id && !isCorrect && (
                   <XCircle className="absolute top-4 right-4 text-red-600 w-6 h-6" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          {!showFeedback ? (
            <button
              onClick={checkAnswer}
              disabled={!selectedOption}
              className={`
                px-8 py-3 rounded-xl font-bold text-white transition shadow-lg
                ${selectedOption 
                  ? 'bg-indigo-600 hover:bg-indigo-700 transform hover:-translate-y-1' 
                  : 'bg-slate-300 cursor-not-allowed'}
              `}
            >
              선택 완료
            </button>
          ) : (
            <div className="w-full">
               <div className={`mb-4 p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                 <p className="font-bold mb-1">{isCorrect ? '정답입니다! 🎉' : '아쉬워요! 😅'}</p>
                 <p>{isCorrect ? mission.feedbackCorrect : mission.feedbackWrong}</p>
               </div>
               <div className="flex justify-end">
                 {isCorrect ? (
                    <button 
                      onClick={nextMission}
                      className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
                    >
                      다음 미션 <ArrowRight className="w-5 h-5" />
                    </button>
                 ) : (
                    <button 
                      onClick={retryMission}
                      className="flex items-center gap-2 px-8 py-3 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 transition shadow-lg"
                    >
                      다시 시도하기 <RotateCcw className="w-5 h-5" />
                    </button>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;
