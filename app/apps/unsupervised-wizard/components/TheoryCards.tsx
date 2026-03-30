import React from 'react';
import { THEORY_CARDS } from '../constants';
import { Brain, Users, AlertTriangle, Activity } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-8 h-8 text-blue-500" />,
  Group: <Users className="w-8 h-8 text-green-500" />,
  Alert: <AlertTriangle className="w-8 h-8 text-red-500" />,
  Wave: <Activity className="w-8 h-8 text-purple-500" />,
};

const TheoryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {THEORY_CARDS.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4 space-x-3">
            <div className="p-2 bg-slate-100 rounded-full">
              {iconMap[card.icon]}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{card.title}</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {card.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TheoryCards;
