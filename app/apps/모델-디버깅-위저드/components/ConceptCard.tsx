import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConceptCardProps {
  title: string;
  description: string;
  type?: 'tip' | 'warning' | 'success' | 'info';
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ title, description, type = 'info' }) => {
  const getIcon = () => {
    switch (type) {
      case 'tip': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'tip': return 'bg-yellow-50 border-yellow-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getBg()} shadow-sm mb-4 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
