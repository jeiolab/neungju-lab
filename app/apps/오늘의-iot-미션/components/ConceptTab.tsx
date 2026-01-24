import React from 'react';
import { ConceptCard } from '../types';
import { BookOpen, AlertTriangle, Quote } from 'lucide-react';

interface ConceptTabProps {
  concept: ConceptCard;
}

const ConceptTab: React.FC<ConceptTabProps> = ({ concept }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
        <div className={`p-6 ${concept.category === 'Social' ? 'bg-indigo-50' : 'bg-emerald-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              concept.category === 'Social' ? 'bg-indigo-200 text-indigo-800' : 'bg-emerald-200 text-emerald-800'
            }`}>
              {concept.category === 'Social' ? '사회적 변화' : '개인적 변화'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{concept.title}</h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <BookOpen className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <p className="text-gray-700 leading-relaxed text-lg">
              {concept.content}
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-yellow-800">취약 개념 (Weakness)</h3>
            </div>
            <p className="text-yellow-900 font-medium">
              {concept.weakness}
            </p>
          </div>

          <div className="relative p-6 bg-slate-800 rounded-xl text-white mt-8">
            <Quote className="absolute top-4 left-4 w-8 h-8 text-slate-600 opacity-50" />
            <p className="text-center text-xl font-light italic relative z-10 pt-4">
              "{concept.quote}"
            </p>
            <div className="text-center mt-4 text-slate-400 text-sm">
              - 오늘의 핵심 한 줄 -
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;
