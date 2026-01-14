import React, { useState, useEffect, useCallback } from 'react';
import { DataCard, ClassificationType, GameMode, RankingRecord, GameHistoryItem, Achievement } from '../types';
import { INITIAL_CARDS, INITIAL_ACHIEVEMENTS } from '../constants';
import GameCard from './GameCard';

interface TabGameProps {
  onHistoryUpdate: (item: GameHistoryItem) => void;
  onAchievementUnlock: (ach: Achievement) => void;
}

const TabGame: React.FC<TabGameProps> = ({ onHistoryUpdate, onAchievementUnlock }) => {
  const [cards, setCards] = useState<DataCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mode, setMode] = useState<GameMode>(GameMode.PRACTICE);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'correct' | 'wrong' | null }>({ msg: '', type: null });
  const [gameOver, setGameOver] = useState(false);

  // Shuffle and init cards
  const initGame = useCallback((gameMode: GameMode) => {
    const shuffled = [...INITIAL_CARDS, ...INITIAL_CARDS, ...INITIAL_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, id: `${c.id}-${i}` })); // Unique IDs for duplicated cards
    
    setCards(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMode(gameMode);
    setTimeLeft(60);
    setIsPlaying(true);
    setGameOver(false);
    setFeedback({ msg: '', type: null });
  }, []);

  // Timer for ranking mode
  useEffect(() => {
    let timer: number;
    if (mode === GameMode.RANKING && isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setGameOver(true);
            saveRanking(score, combo);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, isPlaying, timeLeft, score, combo]);

  const saveRanking = (finalScore: number, maxCombo: number) => {
    const record: RankingRecord = {
      score: finalScore,
      comboMax: maxCombo,
      date: new Date().toISOString()
    };
    const existing = localStorage.getItem('ranking');
    const records = existing ? JSON.parse(existing) : [];
    records.push(record);
    // Keep top 5
    records.sort((a: RankingRecord, b: RankingRecord) => b.score - a.score);
    localStorage.setItem('ranking', JSON.stringify(records.slice(0, 5)));
  };

  const checkAchievements = (newCombo: number, currentCardType: ClassificationType, isCorrect: boolean) => {
      // Simple check logic for demo purposes
      // Real app would track consecutive correct per type in state
      if (score === 0 && isCorrect) {
           const ach = INITIAL_ACHIEVEMENTS.find(a => a.id === 'a1');
           if (ach) onAchievementUnlock(ach);
      }
      if (mode === GameMode.RANKING && score >= 1000) {
          const ach = INITIAL_ACHIEVEMENTS.find(a => a.id === 'a4');
           if (ach) onAchievementUnlock(ach);
      }
  };

  const handleSwipe = (direction: ClassificationType) => {
    const currentCard = cards[currentIndex];
    const isCorrect = currentCard.type === direction;

    // Feedback Logic
    if (isCorrect) {
      const multiplier = 1 + Math.floor(combo / 5) * 0.5;
      const points = Math.round(100 * multiplier);
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setFeedback({ msg: 'CORRECT!', type: 'correct' });
      checkAchievements(combo + 1, currentCard.type, true);
    } else {
      setCombo(0);
      setFeedback({ msg: currentCard.explanation, type: 'wrong' }); // Show instant explanation
      // In practice mode, maybe pause? In ranking, just lose combo.
    }

    // Add to history
    onHistoryUpdate({
      cardId: currentCard.id,
      cardTitle: currentCard.title,
      userChoice: direction,
      correctType: currentCard.type,
      timestamp: Date.now()
    });

    // Move to next card
    setTimeout(() => {
        setFeedback({ msg: '', type: null });
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of deck
            setIsPlaying(false);
            setGameOver(true);
            if (mode === GameMode.RANKING) saveRanking(score, combo);
        }
    }, isCorrect ? 300 : 2500); // Longer delay for wrong answer to read explanation
  };

  if (!isPlaying && !gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 p-6 animate-fade-in">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-tech text-blue-400 mb-2">READY?</h1>
            <p className="text-slate-400">데이터 분류 작업을 시작합니다.</p>
        </div>
        
        <button 
          onClick={() => initGame(GameMode.PRACTICE)}
          className="w-full max-w-xs p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors border border-slate-600 flex items-center justify-between group"
        >
          <div className="text-left">
            <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">연습 모드</div>
            <div className="text-xs text-slate-400">시간 제한 없음, 천천히 학습</div>
          </div>
          <i className="fas fa-book-open text-2xl text-slate-500 group-hover:text-emerald-400"></i>
        </button>

        <button 
          onClick={() => initGame(GameMode.RANKING)}
          className="w-full max-w-xs p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors border border-slate-600 flex items-center justify-between group"
        >
          <div className="text-left">
            <div className="font-bold text-white group-hover:text-amber-400 transition-colors">랭킹 챌린지</div>
            <div className="text-xs text-slate-400">60초 제한, 최고 점수 도전</div>
          </div>
          <i className="fas fa-trophy text-2xl text-slate-500 group-hover:text-amber-400"></i>
        </button>
      </div>
    );
  }

  if (gameOver) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
              <h2 className="text-3xl font-tech text-white">MISSION COMPLETE</h2>
              <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-sm border border-slate-600">
                  <div className="text-slate-400 mb-1">FINAL SCORE</div>
                  <div className="text-5xl font-bold text-emerald-400 font-tech mb-4">{score}</div>
                  <div className="flex justify-between text-sm text-slate-400 border-t border-slate-700 pt-4">
                      <span>Max Combo</span>
                      <span className="text-white">{combo}</span>
                  </div>
              </div>
              <button 
                onClick={() => setGameOver(false)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all"
              >
                메인으로 돌아가기
              </button>
          </div>
      )
  }

  return (
    <div className="relative h-full flex flex-col items-center overflow-hidden">
      {/* HUD */}
      <div className="w-full p-4 flex justify-between items-end z-20 bg-gradient-to-b from-slate-900 to-transparent">
        <div>
           <div className="text-xs text-slate-400 font-tech">SCORE</div>
           <div className="text-2xl font-bold text-white font-tech">{score.toLocaleString()}</div>
        </div>
        {mode === GameMode.RANKING && (
            <div className={`text-3xl font-bold font-tech ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
            </div>
        )}
        <div className="text-right">
           <div className="text-xs text-slate-400 font-tech">COMBO</div>
           <div className="text-2xl font-bold text-amber-400 font-tech">x{combo}</div>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 w-full flex items-center justify-center relative mt-4 mb-20">
         {currentIndex < cards.length && (
             <GameCard 
                key={cards[currentIndex].id}
                card={cards[currentIndex]}
                onSwipe={handleSwipe}
                active={!feedback.type} // Disable interaction while showing feedback
             />
         )}
         
         {/* Feedback Overlay */}
         {feedback.type && (
             <div className={`absolute inset-0 z-30 flex items-center justify-center bg-slate-900/80 p-6 text-center backdrop-blur-sm animate-fade-in`}>
                 <div>
                     {feedback.type === 'correct' ? (
                         <div className="text-green-400 text-6xl mb-4"><i className="fas fa-circle-check"></i></div>
                     ) : (
                         <div className="text-red-500 text-6xl mb-4"><i className="fas fa-circle-xmark"></i></div>
                     )}
                     <p className="text-white text-lg font-bold">{feedback.msg}</p>
                 </div>
             </div>
         )}
      </div>

      {/* Controls (for desktop mostly) */}
      <div className="absolute bottom-6 w-full px-8 flex justify-between max-w-md z-20">
          <button 
            onClick={() => handleSwipe(ClassificationType.SHIELD)}
            disabled={!!feedback.type}
            className="w-16 h-16 rounded-full bg-slate-800 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
          >
              <i className="fas fa-shield text-2xl"></i>
          </button>
           <button 
            onClick={() => handleSwipe(ClassificationType.SHARE)}
            disabled={!!feedback.type}
            className="w-16 h-16 rounded-full bg-slate-800 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
              <i className="fas fa-share text-2xl"></i>
          </button>
      </div>

    </div>
  );
};

export default TabGame;
