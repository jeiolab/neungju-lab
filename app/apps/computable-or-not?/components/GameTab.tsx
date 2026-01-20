import React, { useState, useEffect } from 'react';
import { ProblemCard, ProblemType } from '../types';
import { PROBLEM_CARDS } from '../constants';
import { getRefinementFeedback } from '../services/geminiService';
import { Check, X, HelpCircle, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';

interface GameTabProps {
  onScoreUpdate: (points: number) => void;
  onRefineComplete: (id: string, text: string) => void;
}

export const GameTab: React.FC<GameTabProps> = ({ onScoreUpdate, onRefineComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; msg: string }>({ type: null, msg: '' });
  const [showRefinementModal, setShowRefinementModal] = useState(false);
  const [refinementText, setRefinementText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const currentCard = PROBLEM_CARDS[currentCardIndex];
  const isLastCard = currentCardIndex >= PROBLEM_CARDS.length - 1;

  useEffect(() => {
    // Reset state on card change
    setFeedback({ type: null, msg: '' });
    setShowRefinementModal(false);
    setRefinementText('');
    setAiFeedback(null);
  }, [currentCardIndex]);

  const handleChoice = (choice: ProblemType) => {
    if (feedback.type) return; // Prevent double clicking

    if (choice === currentCard.correctType) {
      if (choice === 'CONDITIONAL') {
        // Correctly identified as conditional -> open refinement modal
        setShowRefinementModal(true);
      } else {
        // Standard correct
        setFeedback({ type: 'correct', msg: `정답! ${currentCard.explanation}` });
        onScoreUpdate(10);
      }
    } else {
      setFeedback({ type: 'wrong', msg: `아쉬워요. 이 문제는 '${getTypeLabel(currentCard.correctType)}'입니다. ${currentCard.explanation}` });
      onScoreUpdate(-5);
    }
  };

  const getTypeLabel = (type: ProblemType) => {
    switch (type) {
      case 'COMPUTABLE': return '해결 가능';
      case 'NOT_COMPUTABLE': return '해결 불가';
      case 'CONDITIONAL': return '조건부 (보완 필요)';
    }
  };

  const handleRefinementSubmit = async () => {
    if (!refinementText.trim()) return;

    setIsAnalyzing(true);
    const result = await getRefinementFeedback(currentCard.description, refinementText);
    setIsAnalyzing(false);

    if (result.success) {
        setAiFeedback(`성공! ${result.feedback}`);
        onScoreUpdate(20); // Bonus points for refinement
        onRefineComplete(currentCard.id, refinementText);
        // Delay moving to next card so user can read feedback
        setTimeout(() => {
             handleNextCard();
        }, 3000);
    } else {
        setAiFeedback(`다시 시도해보세요. ${result.feedback}`);
    }
  };

  const handleNextCard = () => {
    if (!isLastCard) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  // If showing modal
  if (showRefinementModal) {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">보완 챌린지</span>
          <h2 className="text-xl font-bold mt-2 text-slate-800">문제를 다시 정의해볼까요?</h2>
          <p className="text-sm text-slate-600 mt-1 mb-4 bg-slate-100 p-3 rounded italic">"{currentCard.description}"</p>
          <p className="text-sm text-slate-500">
            이 문제가 컴퓨터로 해결 가능하려면 <strong className="text-indigo-600">누락된 정보(입력, 조건, 데이터)</strong>를 채워야 합니다.
          </p>
          {currentCard.missingElements && (
             <div className="mt-2 flex flex-wrap gap-2">
                 {currentCard.missingElements.map(el => (
                     <span key={el} className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-full">{el} 누락</span>
                 ))}
             </div>
          )}
        </div>

        <textarea
          className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
          placeholder="예: 사용자의 1주일치 식단 기록(데이터)과 예산 1만원 이하(조건)를 입력받아 메뉴를 출력한다."
          value={refinementText}
          onChange={(e) => setRefinementText(e.target.value)}
        />

        {aiFeedback && (
            <div className={`mt-4 p-3 rounded text-sm ${aiFeedback.includes('성공') ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
                {aiFeedback}
            </div>
        )}

        <div className="mt-auto pt-4">
          <button
            onClick={handleRefinementSubmit}
            disabled={isAnalyzing}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center"
          >
            {isAnalyzing ? <Loader2 className="animate-spin mr-2" /> : <RefreshCw className="mr-2" size={18} />}
            {isAnalyzing ? 'AI 코치가 분석 중...' : '제출 및 평가받기'}
          </button>
        </div>
      </div>
    );
  }

  // Main Card View
  return (
    <div className="flex flex-col h-full p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-400 font-mono text-xs">CARD {currentCardIndex + 1} / {PROBLEM_CARDS.length}</span>
        <div className="flex space-x-1">
             {PROBLEM_CARDS.map((_, idx) => (
                 <div key={idx} className={`h-1.5 w-4 rounded-full ${idx === currentCardIndex ? 'bg-indigo-500' : idx < currentCardIndex ? 'bg-indigo-200' : 'bg-slate-200'}`} />
             ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="bg-white w-full aspect-[4/5] rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500" />
            
            <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center break-keep">{currentCard.title}</h3>
            
            <div className="flex-1 flex items-center justify-center">
                 <p className="text-lg text-slate-600 text-center leading-relaxed break-keep">
                    "{currentCard.description}"
                </p>
            </div>

            {feedback.type && (
                <div className={`absolute inset-0 ${feedback.type === 'correct' ? 'bg-green-500/90' : 'bg-red-500/90'} backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center z-10 transition-opacity duration-300`}>
                    {feedback.type === 'correct' ? <Check size={48} className="mb-2" /> : <X size={48} className="mb-2" />}
                    <p className="font-bold text-lg mb-2">{feedback.type === 'correct' ? '정답입니다!' : '오답입니다.'}</p>
                    <p className="text-sm opacity-90">{feedback.msg}</p>
                    <button 
                        onClick={handleNextCard}
                        className="mt-6 bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-100 transition flex items-center"
                    >
                        다음 문제 <ArrowRight size={16} className="ml-2"/>
                    </button>
                </div>
            )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <button
          onClick={() => handleChoice('COMPUTABLE')}
          className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition active:scale-95"
        >
          <Check className="mb-1 text-green-500" size={24} />
          <span className="text-xs font-bold">가능</span>
        </button>
        
        <button
          onClick={() => handleChoice('CONDITIONAL')}
          className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition active:scale-95"
        >
          <HelpCircle className="mb-1 text-yellow-500" size={24} />
          <span className="text-xs font-bold">조건부</span>
        </button>

        <button
          onClick={() => handleChoice('NOT_COMPUTABLE')}
          className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition active:scale-95"
        >
          <X className="mb-1 text-red-500" size={24} />
          <span className="text-xs font-bold">불가능</span>
        </button>
      </div>
    </div>
  );
};
