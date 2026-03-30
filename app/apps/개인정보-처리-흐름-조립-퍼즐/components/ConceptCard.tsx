import React from 'react';
import { VenetianMask, Handshake, Minimize, Trash2, Info } from 'lucide-react';
import { ConceptCardData } from '../types';

interface ConceptCardProps {
  data: ConceptCardData;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ data }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'VenetianMask': return <VenetianMask className="w-6 h-6 text-indigo-600" />;
      case 'Handshake': return <Handshake className="w-6 h-6 text-green-600" />;
      case 'Minimize': return <Minimize className="w-6 h-6 text-blue-600" />;
      case 'Trash2': return <Trash2 className="w-6 h-6 text-red-600" />;
      default: return <Info className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-slate-100 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">
          {getIcon(data.iconName)}
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{data.category}</span>
          <h3 className="text-lg font-bold text-slate-800">{data.title}</h3>
        </div>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed flex-grow">
        {data.content}
      </p>
    </div>
  );
};

export default ConceptCard;