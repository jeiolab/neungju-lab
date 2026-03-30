import React, { useState, useEffect } from 'react';
import { GAME_CARDS } from '../constants';
import { NetworkType, GameCard, WrongNoteItem } from '../types';
import { CheckCircle, XCircle, AlertCircle, Play, RotateCcw } from 'lucide-react';

interface TabGameProps {
  onGameComplete: (score: number, correctCount: number) => void;
  onWrongAnswer: (item: WrongNoteItem) => void;
}

const TabGame: React.FC<TabGameProps> = ({ onGameComplete, onWrongAnswer }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'FEEDBACK' | 'RESULT'>('IDLE');
  const [currentCards, setCurrentCards] = useState<GameCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedConfidence, setSelectedConfidence] = useState<number>(2); // 1, 2, 3
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctType: NetworkType; explanation: string } | null>(null);

  useEffect(() => {
    // Initial Load stats if needed
  }, []);

  const startGame = () => {
    // Shuffle and pick 8 cards
    const shuffled = [...GAME_CARDS].sort(() => 0.5 - Math.random());
    setCurrentCards(shuffled.slice(0, 8));
    setCurrentIndex(0);
    setScore(0);
    setGameState('PLAYING');
    setFeedback(null);
  };

  const handleAnswer = (type: NetworkType) => {
    const currentCard = currentCards[currentIndex];
    const isCorrect = currentCard.correctType === type;

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      onWrongAnswer({
        cardId: currentCard.id,
        description: currentCard.description,
        correctType: currentCard.correctType,
        userSelected: type,
        timestamp: Date.now()
      });
    }

    setFeedback({
      isCorrect,
      correctType: currentCard.correctType,
      explanation: currentCard.explanation
    });
    setGameState('FEEDBACK');
  };

  const nextCard = () => {
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setGameState('PLAYING');
      setFeedback(null);
      setSelectedConfidence(2);
    } else {
      setGameState('RESULT');
      const finalScore = Math.round((score + (feedback?.isCorrect ? 0 : 0)) / currentCards.length * 100); 
      onGameComplete(Math.round(score / 8 * 100), score);
    }
  };

  if (gameState === 'IDLE') {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-10 max-w-2xl mx-auto mt-10">
        <div className="bg-indigo-50 p-8 rounded-full">
          <Play size={64} className="text-indigo-600 ml-2" />
        </div>
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">분류 게임 시작</h2>
            <p className="text-slate-500 text-lg">
            8개의 랜덤 카드가 나옵니다.<br/>
            각 상황에 맞는 네트워크를 선택하세요!
            </p>
        </div>
        <button 
          onClick={startGame}
          className="bg-indigo-600 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-xl hover:bg-indigo-700 transition-transform hover:scale-105"
        >
          게임 시작하기
        </button>
      </div>
    );
  }

  if (gameState === 'RESULT') {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-10 max-w-2xl mx-auto mt-10 animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-800">게임 결과</h2>
        <div className="text-8xl font-black text-indigo-600">
          {Math.round((score / 8) * 100)}<span className="text-3xl font-medium text-slate-400">점</span>
        </div>
        <p className="text-slate-600 text-lg">
          8문제 중 <span className="font-bold text-indigo-600">{score}</span>개를 맞췄습니다!
        </p>
        <button 
          onClick={startGame}
          className="flex items-center justify-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700 hover:shadow-lg transition-all"
        >
          <RotateCcw size={24} /> 다시 도전하기
        </button>
      </div>
    );
  }

  const currentCard = currentCards[currentIndex];
  const progress = ((currentIndex + 1) / 8) * 100;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-4 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left: Question Area */}
        <div className="md:col-span-3">
             <div className="bg-white rounded-3xl shadow-lg p-10 min-h-[300px] flex flex-col justify-center items-center text-center border-2 border-slate-100 h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-50"></div>
                <span className="bg-indigo-50 text-indigo-600 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
                문제 {currentIndex + 1} / 8
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug break-keep">
                {currentCard.description}
                </h3>
            </div>
        </div>

        {/* Right: Controls */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-6">
            {/* Confidence Selector */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-500">얼마나 확신하나요?</span>
                    <span className="text-xs text-indigo-500 font-medium">점수 반영</span>
                </div>
                <div className="flex gap-2">
                {[1, 2, 3].map((level) => (
                    <button
                    key={level}
                    onClick={() => setSelectedConfidence(level)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${selectedConfidence === level ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}
                    >
                    {level}
                    </button>
                ))}
                </div>
            </div>

            {/* Network Type Buttons */}
            <div className="grid grid-cols-2 gap-3">
            {Object.values(NetworkType).map((type) => (
                <button
                key={type}
                onClick={() => handleAnswer(type)}
                disabled={gameState === 'FEEDBACK'}
                className="bg-white border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 py-6 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-sm hover:shadow-md"
                >
                {type}
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* Feedback Overlay */}
      {gameState === 'FEEDBACK' && feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-bounce-small transform scale-100">
            <div className={`flex flex-col items-center gap-4 text-2xl font-bold mb-6 ${feedback.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
              {feedback.isCorrect ? 
                <div className="bg-green-100 p-4 rounded-full"><CheckCircle size={48} /></div> : 
                <div className="bg-red-100 p-4 rounded-full"><XCircle size={48} /></div>
              }
              {feedback.isCorrect ? '정답입니다!' : '오답입니다...'}
            </div>
            
            <div className="text-center mb-6">
                <p className="text-slate-500 text-sm mb-1">정답 네트워크</p>
                <p className="text-3xl font-black text-slate-800">{feedback.correctType}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl text-slate-700 mb-8 border border-slate-100 text-center leading-relaxed">
              {feedback.explanation}
            </div>
            <button 
              onClick={nextCard}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              다음 문제로
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabGame;