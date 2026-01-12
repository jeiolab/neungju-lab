import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ALPHABET } from '../types';

interface CipherWheelProps {
  shift: number;
  onShiftChange: (newShift: number) => void;
}

const CipherWheel: React.FC<CipherWheelProps> = ({ shift, onShiftChange }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate the rotation angle based on the shift
  const anglePerSegment = 360 / 26;
  const rotation = -(shift * anglePerSegment);

  const calculateAngle = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle in radians
    const radians = Math.atan2(clientY - centerY, clientX - centerX);
    // Convert to degrees and adjust so 0 is at top (12 o'clock)
    let degrees = radians * (180 / Math.PI) + 90; 
    
    return degrees;
  }, []);

  const handleStart = () => setIsDragging(true);
  
  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    
    let angle = calculateAngle(clientX, clientY);
    // Normalize angle
    if (angle < 0) angle += 360; 
    
    const rawIndex = Math.round(angle / anglePerSegment);
    // Invert because positive angle (CW) = negative shift visually
    let newShift = -rawIndex % 26; 
    if (newShift < 0) newShift += 26;
    
    onShiftChange(newShift);
  }, [isDragging, calculateAngle, anglePerSegment, onShiftChange]);

  const handleEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove]);

  // Helper to create wheel segments
  const renderSegments = (isInner: boolean) => {
    return ALPHABET.map((char, i) => {
      const angle = i * anglePerSegment;
      return (
        <div
          key={char}
          className="absolute top-0 left-0 w-full h-full text-center origin-center select-none"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <span 
            className={`inline-block mt-2 font-mono font-bold ${
              isInner ? 'text-purple-600' : 'text-slate-800'
            } ${isInner ? 'text-sm' : 'text-base'}`}
            style={{ 
                paddingTop: isInner ? '10px' : '5px' 
            }}
          >
            {char}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 select-none">
      <div className="relative w-80 h-80 sm:w-96 sm:h-96">
        {/* Outer Wheel (Fixed - Plaintext) */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-300 bg-white shadow-2xl flex items-center justify-center">
            {/* Markers */}
            <div className="absolute w-full h-full rounded-full border border-slate-300"></div>
             {renderSegments(false)}
             
             {/* Label */}
             <div className="absolute -top-8 text-xs text-slate-600 uppercase tracking-widest font-bold">
               외부: 평문 (Plain)
             </div>
        </div>

        {/* Inner Wheel (Rotatable - Ciphertext) */}
        <div 
          ref={wheelRef}
          className="absolute inset-8 rounded-full border-4 border-purple-500 bg-slate-50 shadow-inner cursor-grab active:cursor-grabbing transition-transform duration-75 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
           {renderSegments(true)}
           
           {/* Center Decoration */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-white to-slate-100 border-2 border-purple-300 flex items-center justify-center shadow-md">
              <span className="text-xl font-black text-slate-600">KEY</span>
           </div>
        </div>
        
        {/* Static Indicator Arrow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-purple-500 z-10 pointer-events-none" />
      </div>

      <p className="mt-8 text-slate-600 text-sm">
        내부 휠을 드래그하여 키 값을 설정하세요
      </p>
    </div>
  );
};

export default CipherWheel;