import React from 'react';
import { THEORY_CARDS } from '../constants';
import { BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';

const TheoryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {THEORY_CARDS.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
          <div className="p-5 flex-grow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-indigo-700">{card.title}</h3>
              <BookOpen size={18} className="text-indigo-400" />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {card.keywords.map((kw, i) => (
                <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                  {kw}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-700 mb-4 leading-relaxed">{card.definition}</p>
            
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-xs font-semibold text-blue-800 uppercase mb-1">예시 (Example)</p>
              <p className="text-sm text-blue-900 leading-snug">{card.example}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-orange-500 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">오해:</span> {card.misconception}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">체크:</span> {card.check}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TheoryCards;