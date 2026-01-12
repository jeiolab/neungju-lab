import React, { useEffect, useState } from 'react';
import { generateRandomChars } from '../services/cryptoUtils';

interface ScrambleTextProps {
  finalText: string;
  isAnimating: boolean;
  duration?: number;
  onAnimationComplete?: () => void;
  placeholder?: string;
  className?: string;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ 
  finalText, 
  isAnimating, 
  duration = 1500, 
  onAnimationComplete,
  placeholder = "대기 중...",
  className
}) => {
  const [displayText, setDisplayText] = useState(finalText || placeholder);

  useEffect(() => {
    if (isAnimating) {
      let steps = 0;
      const totalSteps = 20; // How many scrambles before showing result
      const stepDuration = duration / totalSteps;
      const targetLength = finalText.length > 0 ? finalText.length : 10;
      
      const interval = setInterval(() => {
        steps++;
        // Gradually reveal real text if needed, or just pure chaos until end
        // For encryption visual, pure chaos looks cooler.
        setDisplayText(generateRandomChars(targetLength));

        if (steps >= totalSteps) {
          clearInterval(interval);
          setDisplayText(finalText);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      }, stepDuration);

      return () => clearInterval(interval);
    } else {
      setDisplayText(finalText || placeholder);
    }
  }, [isAnimating, finalText, duration, onAnimationComplete, placeholder]);

  return (
    <div className={`break-all ${className}`}>
      {displayText}
    </div>
  );
};

export default ScrambleText;