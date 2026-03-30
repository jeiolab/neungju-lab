import React from 'react';
import { TreeDeciduous, Sprout, Flower2, Bird } from 'lucide-react';

interface TreeVisualizerProps {
  level: number;
  co2Saved: number;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ level, co2Saved }) => {
  // Determine scale and elements based on level
  const scale = Math.min(1 + level * 0.2, 3);
  
  return (
    <div className="relative flex flex-col items-center justify-center h-64 w-full bg-gradient-to-b from-blue-50 to-green-100 rounded-xl overflow-hidden border-2 border-green-200 shadow-inner">
      {/* Sky elements */}
      <div className="absolute top-4 right-8 text-yellow-400 animate-pulse">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      </div>
      
      {level > 2 && (
        <div className="absolute top-10 left-10 text-slate-400 animate-bounce" style={{ animationDuration: '3s' }}>
          <Bird size={24} />
        </div>
      )}

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-8 bg-green-300"></div>

      {/* The Tree */}
      <div 
        className="transition-all duration-1000 ease-in-out transform origin-bottom z-10 text-green-700 flex flex-col items-center"
        style={{ transform: `scale(${scale}) translateY(10px)` }}
      >
        {level === 0 ? (
           <Sprout size={48} className="text-green-600" />
        ) : level < 3 ? (
           <TreeDeciduous size={64} className="text-green-600" />
        ) : (
           <div className="relative">
             <TreeDeciduous size={80} className="text-green-800" />
             {level >= 5 && <Flower2 size={16} className="absolute top-2 left-2 text-pink-400 animate-spin-slow" />}
             {level >= 6 && <Flower2 size={16} className="absolute top-4 right-4 text-orange-400 animate-spin-slow" />}
           </div>
        )}
      </div>
      
      <div className="absolute bottom-2 text-xs font-semibold text-green-800 bg-white/80 px-2 py-1 rounded-full z-20">
        레벨 {level}
      </div>
      <div className="absolute top-2 left-2 text-xs text-slate-500 bg-white/50 px-2 py-1 rounded">
        총 CO2 절감량: {co2Saved.toFixed(1)}g
      </div>
    </div>
  );
};

export default TreeVisualizer;