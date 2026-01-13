import React from 'react';
import { CRITERIA_CARDS } from '../constants';
import { Brain, Heart, Scale, Database, ShieldCheck, Sparkles, Search } from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  Database, Heart, Scale, Sparkles, ShieldCheck, Search
};

const CriteriaTab: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">판별의 기준</h2>
        <p className="text-gray-600 mt-2">이 6가지만 기억하면 AI 고수가 될 수 있어!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CRITERIA_CARDS.map((card) => {
          const Icon = iconMap[card.icon] || Brain;
          let bgClass = 'bg-white';
          let borderClass = 'border-gray-200';
          let iconColor = 'text-gray-500';

          if (card.category === 'AI') {
            bgClass = 'bg-blue-50';
            borderClass = 'border-blue-200';
            iconColor = 'text-blue-500';
          } else if (card.category === 'HUMAN') {
            bgClass = 'bg-orange-50';
            borderClass = 'border-orange-200';
            iconColor = 'text-orange-500';
          } else {
            bgClass = 'bg-purple-50';
            borderClass = 'border-purple-200';
            iconColor = 'text-purple-500';
          }

          return (
            <div key={card.id} className={`p-5 rounded-xl border-2 ${borderClass} ${bgClass} shadow-sm flex items-start space-x-4 transition-transform hover:scale-102`}>
              <div className={`p-3 rounded-full bg-white shadow-sm ${iconColor}`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{card.description}</p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded ${card.category === 'AI' ? 'bg-blue-200 text-blue-800' : card.category === 'HUMAN' ? 'bg-orange-200 text-orange-800' : 'bg-purple-200 text-purple-800'}`}>
                  {card.category === 'BOTH' ? '조건부/공통' : card.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CriteriaTab;
