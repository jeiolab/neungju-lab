import React from 'react';
import { Concept } from '../types';

interface Props {
  concept: Concept;
}

const ConceptCard: React.FC<Props> = ({ concept }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-2">
        <div className="w-2 h-8 bg-indigo-500 rounded-full mr-3"></div>
        <h4 className="text-lg font-bold text-slate-800">{concept.title}</h4>
      </div>
      <p className="text-slate-600 text-sm mb-3 leading-relaxed">{concept.description}</p>
      <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 border border-slate-100">
        <span className="font-bold text-indigo-600 mr-1">예시:</span>
        {concept.example}
      </div>
    </div>
  );
};

export default ConceptCard;
