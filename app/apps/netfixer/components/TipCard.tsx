import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TipCardProps {
  tip: string;
}

const TipCard: React.FC<TipCardProps> = ({ tip }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm flex items-start gap-3 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="text-yellow-500 shrink-0 mt-1">
        <Lightbulb size={20} fill="currentColor" className="opacity-80" />
      </div>
      <div>
        <h4 className="font-bold text-yellow-800 text-xs uppercase tracking-wider mb-1">해결사 꿀팁</h4>
        <p className="text-yellow-900 text-sm leading-snug break-keep">{tip}</p>
      </div>
    </div>
  );
};

export default TipCard;