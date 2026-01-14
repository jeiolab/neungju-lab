import React, { useState, useRef, useEffect } from 'react';
import { DataCard, ClassificationType } from '../types';

interface GameCardProps {
  card: DataCard;
  onSwipe: (direction: ClassificationType) => void;
  active: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ card, onSwipe, active }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Reset position when card changes
    setPosition({ x: 0, y: 0 });
  }, [card]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!active) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !active) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setPosition({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Threshold for swipe
    const threshold = 100;
    if (position.x > threshold) {
      onSwipe(ClassificationType.SHARE);
    } else if (position.x < -threshold) {
      onSwipe(ClassificationType.SHIELD);
    } else {
      // Reset
      setPosition({ x: 0, y: 0 });
    }
  };

  const rotation = position.x * 0.1;
  const opacity = Math.max(0, 1 - Math.abs(position.x) / 500);
  
  // Visual indicators
  const isShield = position.x < -20;
  const isShare = position.x > 20;

  return (
    <div
      className={`absolute w-full max-w-sm aspect-[3/4] perspective-1000 ${active ? 'z-10' : 'z-0 opacity-0 pointer-events-none'}`}
      style={{
        transform: active ? `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)` : 'scale(0.9)',
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp} // Safety net
    >
      <div className="relative w-full h-full bg-slate-800 border-2 border-slate-600 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 select-none overflow-hidden">
        
        {/* Indicators Overlay */}
        {isShield && (
          <div className="absolute top-8 right-8 text-red-500 border-4 border-red-500 rounded-lg px-4 py-2 text-2xl font-black rotate-12 opacity-80 z-20">
            SHIELD
          </div>
        )}
        {isShare && (
          <div className="absolute top-8 left-8 text-blue-400 border-4 border-blue-400 rounded-lg px-4 py-2 text-2xl font-black -rotate-12 opacity-80 z-20">
            SHARE
          </div>
        )}

        {/* Card Content */}
        <div className="mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto ${card.type === ClassificationType.SHIELD ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
             <i className={`fas ${card.type === ClassificationType.SHIELD ? 'fa-file-shield' : 'fa-network-wired'}`}></i>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">{card.title}</h2>
          <p className="text-slate-400 text-center text-lg">{card.description}</p>
        </div>

        <div className="mt-auto w-full">
            <div className="text-xs text-slate-500 text-center font-tech mb-2">DATA_ID: {card.id}</div>
            <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${card.difficulty > 1 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${card.difficulty * 33}%`}}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Lv.{card.difficulty}</span>
                <span>SECURITY PROTOCOL</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default GameCard;
