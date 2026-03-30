import React, { useState, useEffect } from 'react';
import { Puzzle, RefreshCcw, CheckCircle, HelpCircle } from 'lucide-react';
import { generateSecretMessage } from '../services/geminiService';

interface PuzzleModeProps {
  onGenerateMessage: () => Promise<string>;
}

interface Tile {
  id: string;
  char: string;
  correctIndex: number;
}

export const PuzzleMode: React.FC<PuzzleModeProps> = ({ onGenerateMessage }) => {
  const [targetMessage, setTargetMessage] = useState<string>("스키테일");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedTileId, setDraggedTileId] = useState<string | null>(null);

  // Initialize Game
  const startNewGame = (message: string) => {
    const clean = message.replace(/\s/g, '').toUpperCase().slice(0, 16); // Limit to 4x4 max
    setTargetMessage(clean);
    setIsSolved(false);

    // Create tiles and shuffle
    const newTiles: Tile[] = clean.split('').map((char, index) => ({
      id: `tile-${index}`,
      char,
      correctIndex: index
    }));

    // Fisher-Yates Shuffle
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    setTiles(newTiles);
  };

  useEffect(() => {
    startNewGame("스키테일");
  }, []);

  const handleGenerateAI = async () => {
    setIsLoading(true);
    const msg = await onGenerateMessage();
    startNewGame(msg);
    setIsLoading(false);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTileId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTileId || draggedTileId === targetId) return;

    const sourceIndex = tiles.findIndex(t => t.id === draggedTileId);
    const targetIndex = tiles.findIndex(t => t.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newTiles = [...tiles];
    // Swap
    [newTiles[sourceIndex], newTiles[targetIndex]] = [newTiles[targetIndex], newTiles[sourceIndex]];
    
    setTiles(newTiles);
    setDraggedTileId(null);
    checkWinCondition(newTiles);
  };

  const checkWinCondition = (currentTiles: Tile[]) => {
    const isCorrect = currentTiles.every((tile, index) => tile.correctIndex === index);
    if (isCorrect) setIsSolved(true);
  };

  return (
    <div className="flex flex-col items-center space-y-8 animate-fadeIn max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-greece-stone">암호 해독가의 도전</h2>
        <p className="text-stone-600">타일을 재배열하여 숨겨진 메시지를 찾아보세요.</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => startNewGame(targetMessage)}
          className="flex items-center px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          다시 섞기
        </button>
        <button
          onClick={handleGenerateAI}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-greece-blue text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <Puzzle className="w-4 h-4 mr-2" />
          )}
          새로운 AI 미션
        </button>
      </div>

      <div className="bg-greece-stone/10 p-8 rounded-xl border-2 border-greece-stone/20 relative">
        {isSolved && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl animate-fadeIn">
            <div className="text-center transform scale-110">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-greece-stone">해독 성공!</h3>
              <p className="text-greece-blue font-serif text-lg mt-2">{targetMessage}</p>
            </div>
          </div>
        )}

        <div 
          className="grid gap-3"
          style={{ 
            gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(tiles.length))}, minmax(4rem, 1fr))`
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile.id}
              draggable={!isSolved}
              onDragStart={(e) => handleDragStart(e, tile.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tile.id)}
              className={`
                aspect-square flex items-center justify-center text-2xl font-bold rounded-lg shadow-md cursor-grab active:cursor-grabbing
                transition-all duration-200 select-none
                ${isSolved ? 'bg-green-100 text-green-800 border-2 border-green-500' : 'bg-white text-stone-800 border-b-4 border-greece-stone hover:-translate-y-1'}
                ${draggedTileId === tile.id ? 'opacity-50' : 'opacity-100'}
              `}
            >
              {tile.char}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start text-sm text-yellow-800 max-w-md">
        <HelpCircle className="w-5 h-5 mr-2 flex-shrink-0" />
        <p>
          전치 암호는 글자의 <strong>위치</strong>만 바꿉니다. 키(막대의 지름)를 모르더라도, 자주 쓰이는 글자 조합을 찾아내어 추리할 수 있습니다.
        </p>
      </div>
    </div>
  );
};