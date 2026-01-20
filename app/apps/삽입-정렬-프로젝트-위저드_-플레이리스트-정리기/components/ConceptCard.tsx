import React from 'react';
import { Lightbulb, Info, AlertTriangle } from 'lucide-react';

interface ConceptCardProps {
  title: string;
  type: 'info' | 'tip' | 'warning';
  children: React.ReactNode;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ title, type, children }) => {
  const styles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: <Info className="w-5 h-5" /> },
    tip: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: <Lightbulb className="w-5 h-5" /> },
    warning: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', icon: <AlertTriangle className="w-5 h-5" /> },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-4 rounded-r-md shadow-sm mb-4`}>
      <div className={`flex items-center gap-2 font-bold ${style.text} mb-2`}>
        {style.icon}
        <h3>{title}</h3>
      </div>
      <div className="text-slate-700 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};