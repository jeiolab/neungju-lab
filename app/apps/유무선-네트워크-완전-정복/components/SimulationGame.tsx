import React, { useState } from 'react';
import { SCENARIOS } from '../constants';
import { NetworkType } from '../types';
import { CheckCircle2, XCircle, ArrowRight, Gamepad2, Trees, Building2 } from 'lucide-react';

interface SimulationGameProps {
  onComplete: (score: number) => void;
}

export const SimulationGame: React.FC<SimulationGameProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<NetworkType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  const scenario = SCENARIOS[currentIndex];
  const isLast = currentIndex === SCENARIOS.length - 1;

  const handleChoice = (choice: NetworkType) => {
    if (showResult) return;
    
    setSelectedAnswer(choice);
    setShowResult(true);

    if (choice === scenario.correctAnswer) {
      setLocalScore(prev => prev + 25);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(localScore);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const renderIcon = () => {
    switch (scenario.iconType) {
      case 'GAME': return <Gamepad2 className="w-10 h-10 text-purple-500" />;
      case 'PARK': return <Trees className="w-10 h-10 text-green-500" />;
      case 'OFFICE': return <Building2 className="w-10 h-10 text-blue-500" />;
      default: return <Gamepad2 className="w-10 h-10 text-slate-500" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">상황별 네트워크 선택</h2>
        <span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {currentIndex + 1} / {SCENARIOS.length}
        </span>
      </div>

      {/* Scenario Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-6 relative">
        <div className="p-8 text-center flex flex-col items-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            {renderIcon()}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{scenario.title}</h3>
          <p className="text-slate-600 text-lg leading-relaxed max-w-sm">
            "{scenario.situation}"
          </p>
        </div>

        {/* Feedback Overlay */}
        {showResult && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in z-10">
            {selectedAnswer === scenario.correctAnswer ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h4 className="text-2xl font-bold text-green-600 mb-2">정답입니다! (+25점)</h4>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h4 className="text-2xl font-bold text-red-600 mb-2">아쉬워요!</h4>
              </>
            )}
            <p className="text-slate-600 mb-6 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed max-w-sm">
              {scenario.explanation}
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 transition-transform hover:scale-105"
            >
              {isLast ? "퀴즈 풀러 가기" : "다음 문제"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {!showResult && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleChoice('WIRED')}
            className="group p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-800 hover:bg-slate-50 transition-all flex flex-col items-center gap-2"
          >
            <span className="font-bold text-lg text-slate-800 group-hover:text-black">유선 연결</span>
            <span className="text-xs text-slate-400">안정성, 속도, 보안</span>
          </button>
          <button
            onClick={() => handleChoice('WIRELESS')}
            className="group p-4 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center gap-2"
          >
            <span className="font-bold text-lg text-blue-700 group-hover:text-blue-900">무선 연결</span>
            <span className="text-xs text-blue-400">이동성, 편리함</span>
          </button>
        </div>
      )}
    </div>
  );
};