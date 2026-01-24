import React, { useState } from 'react';
import { TECH_DATA } from '../constants';
import { TechCard as ITechCard } from '../types';
import { Bluetooth, Wifi, Smartphone, Radio, Activity, Star, Info } from 'lucide-react';

interface Props {
  onToggleWordbook: (id: string) => void;
  wordbook: string[];
}

const TechIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'Bluetooth': return <Bluetooth className={className} />;
    case 'Wifi': return <Wifi className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'Radio': return <Radio className={className} />;
    case 'Activity': return <Activity className={className} />;
    default: return <Info className={className} />;
  }
};

const Flashcard: React.FC<{ tech: ITechCard; isSaved: boolean; onToggle: () => void }> = ({ tech, isSaved, onToggle }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-64 cursor-pointer group perspective-1000"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${flipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className="absolute w-full h-full bg-white rounded-xl shadow-lg border-2 border-indigo-100 p-6 flex flex-col items-center justify-center backface-hidden z-10 hover:border-indigo-300 transition-colors">
          <div className="bg-indigo-50 p-4 rounded-full mb-4 text-indigo-600">
            <TechIcon name={tech.icon} className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{tech.name}</h3>
          <p className="text-sm text-slate-500 text-center">카드를 클릭하여 뒷면 보기</p>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={`absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 ${isSaved ? 'text-yellow-400' : 'text-slate-300'}`}
          >
            <Star fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full bg-indigo-600 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center backface-hidden rotate-y-180 text-white">
          <h4 className="font-bold text-lg mb-4 border-b border-indigo-400 pb-2 w-full text-center">특징 및 용도</h4>
          <ul className="text-sm space-y-2 w-full text-left list-disc pl-4">
            {tech.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <div className="mt-4 pt-4 border-t border-indigo-500 w-full text-center">
            <p className="font-semibold text-indigo-200 text-xs uppercase mb-1">사용 예시</p>
            <p className="text-sm">{tech.usage.join(', ')}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export const TabTheory: React.FC<Props> = ({ onToggleWordbook, wordbook }) => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">네트워크 기술 탐험</h2>
        <p className="text-slate-600">카드를 뒤집어 기술의 비밀을 알아보세요!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TECH_DATA.map((tech) => (
          <Flashcard 
            key={tech.id} 
            tech={tech} 
            isSaved={wordbook.includes(tech.id)} 
            onToggle={() => onToggleWordbook(tech.id)} 
          />
        ))}
      </div>
    </div>
  );
};