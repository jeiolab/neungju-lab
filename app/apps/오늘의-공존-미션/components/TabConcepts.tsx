import React from 'react';
import { CONCEPTS } from '../constants';
import { Scale, UserCheck, Search, ShieldAlert } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'scale': <Scale size={24} />,
  'user-check': <UserCheck size={24} />,
  'search': <Search size={24} />,
  'shield-alert': <ShieldAlert size={24} />
};

const TabConcepts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">핵심 공존 개념</h2>
        <p className="text-slate-500 text-sm mt-1">AI와 함께 살아가기 위해 꼭 필요한 4가지 태도</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((concept) => (
          <div key={concept.id} className={`p-5 rounded-xl border ${concept.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-10 ')} bg-white shadow-sm hover:shadow-md transition-shadow`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${concept.color}`}>
              {iconMap[concept.icon]}
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">{concept.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{concept.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabConcepts;