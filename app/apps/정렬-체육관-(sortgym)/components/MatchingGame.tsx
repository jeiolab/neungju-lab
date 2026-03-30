import React, { useState, useEffect } from 'react';
import { GameCard } from '../types';
import { ALGORITHMS } from '../constants';
import { RefreshCw, CheckCircle } from 'lucide-react';

const MatchingGame: React.FC = () => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [won, setWon] = useState(false);

  const initializeGame = () => {
    const newCards: GameCard[] = [];
    Object.values(ALGORITHMS).forEach((algo) => {
      // Card 1: Name
      newCards.push({
        id: `${algo.id}-name`,
        content: algo.name,
        type: 'name',
        matchId: algo.id,
        isFlipped: false,
        isMatched: false,
      });
      // Card 2: Concept (Description or Keyword)
      newCards.push({
        id: `${algo.id}-concept`,
        content: algo.keywords[0] + ' / ' + algo.description.substring(0, 20) + '...',
        type: 'concept',
        matchId: algo.id,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    newCards.sort(() => Math.random() - 0.5);
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: string) => {
    // If already won, matched or 2 flipped, ignore
    if (won || matched.includes(cards.find(c => c.id === id)?.matchId || '') || flipped.length >= 2 || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1 && card2 && card1.matchId === card2.matchId) {
        // Match found
        setMatched([...matched, card1.matchId]);
        setFlipped([]);
        if (matched.length + 1 === Object.keys(ALGORITHMS).length) {
          setWon(true);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">🧩 알고리즘 매칭 게임</h2>
        <button 
          onClick={initializeGame} 
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <RefreshCw size={18} />
          <span>다시 시작</span>
        </button>
      </div>

      {won && (
        <div className="mb-8 p-4 bg-emerald-100 text-emerald-800 rounded-xl flex items-center animate-bounce">
          <CheckCircle className="mr-2" />
          <span className="font-bold text-lg">축하합니다! 모든 알고리즘을 연결했습니다!</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.matchId);
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                relative h-32 cursor-pointer transition-all duration-500 transform perspective-1000
                ${isFlipped ? 'rotate-y-180' : ''}
              `}
              style={{ perspective: '1000px' }}
            >
              <div 
                className={`
                  absolute w-full h-full rounded-xl shadow-md flex items-center justify-center p-4 text-center select-none
                  transition-all duration-300 backface-hidden
                  ${isFlipped 
                    ? 'bg-white border-2 border-indigo-500 text-indigo-900' 
                    : 'bg-indigo-600 text-white'}
                `}
              >
                {isFlipped ? (
                   <span className="text-sm font-semibold">{card.content}</span>
                ) : (
                   <span className="text-2xl opacity-20">?</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchingGame;
