import React, { useState } from 'react';
import { Concept, UserState } from '../types';
import { CONCEPTS } from '../constants';
import { ChevronDown, ChevronUp, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface ConceptViewProps {
  user: UserState;
  onUpdateMastery: (id: string, delta: number) => void;
}

const ConceptCard: React.FC<{ 
  concept: Concept; 
  mastery: number; 
  onRate: (delta: number) => void;
  isRecommended: boolean;
}> = ({ concept, mastery, onRate, isRecommended }) => {
  const [showCheck, setShowCheck] = useState(false);

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${isRecommended ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-200'} p-5 mb-6 transition-all`}>
      {isRecommended && (
        <div className="mb-2 inline-flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
          <AlertTriangle size={12} className="mr-1" /> 집중 학습 필요
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-gray-900">{concept.title}</h2>
        <div className="flex flex-col items-end">
          <div className="text-xs text-gray-400 mb-1">숙련도</div>
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${mastery >= 80 ? 'bg-green-500' : mastery >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} 
              style={{ width: `${mastery}%` }}
            ></div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 font-medium mb-4 bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-500">
        {concept.definition}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {concept.keywords.map(k => (
          <span key={k} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">#{k}</span>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-500 mb-1 flex items-center">
            <Lightbulb size={14} className="mr-1"/> 예시 (School Context)
        </h3>
        <p className="text-sm text-gray-600 bg-blue-50/50 p-2 rounded">{concept.example}</p>
      </div>

      <div className="mb-4 border border-red-100 bg-red-50/30 rounded-lg p-3">
        <h3 className="text-xs font-bold text-red-500 mb-1 flex items-center">
            <AlertTriangle size={12} className="mr-1"/> 흔한 오개념
        </h3>
        <p className="text-sm text-gray-500 line-through decoration-red-400 mb-1">"{concept.misconception.myth}"</p>
        <p className="text-sm text-gray-800 font-medium">→ {concept.misconception.fact}</p>
      </div>

      <div className="mt-6 border-t pt-4">
        <button 
          onClick={() => setShowCheck(!showCheck)}
          className="w-full text-left flex justify-between items-center text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <span>10초 체크 질문</span>
          {showCheck ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showCheck && (
          <div className="mt-3 bg-gray-900 text-white p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
            <p className="font-medium mb-2">Q. {concept.checkQuestion.question}</p>
            <p className="text-green-400 text-sm font-bold">A. {concept.checkQuestion.answer}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <button onClick={() => onRate(8)} className="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-bold transition-colors">
          알겠음 (+8)
        </button>
        <button onClick={() => onRate(3)} className="flex-1 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm font-bold transition-colors">
          헷갈림 (+3)
        </button>
        <button onClick={() => onRate(-2)} className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-bold transition-colors">
          모름 (-2)
        </button>
      </div>
    </div>
  );
};

const ConceptView: React.FC<ConceptViewProps> = ({ user, onUpdateMastery }) => {
  const sortedConcepts = [...CONCEPTS].sort((a, b) => {
    // Show low mastery first
    const masteryA = user.mastery[a.id] || 0;
    const masteryB = user.mastery[b.id] || 0;
    return masteryA - masteryB;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">나의 학습 현황</h3>
        <div className="grid grid-cols-4 gap-2">
            {CONCEPTS.map(c => {
                const m = user.mastery[c.id] || 0;
                return (
                    <div key={c.id} className="text-center">
                        <div className="h-20 w-4 bg-gray-100 mx-auto rounded-full relative overflow-hidden">
                            <div 
                                className={`absolute bottom-0 w-full transition-all duration-500 ${m >= 80 ? 'bg-green-500' : m >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                style={{ height: `${m}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-1 truncate px-1">{c.keywords[0]}</span>
                    </div>
                )
            })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">오늘의 학습 카드</h3>
        {sortedConcepts.map(concept => (
          <ConceptCard 
            key={concept.id} 
            concept={concept} 
            mastery={user.mastery[concept.id] || 0}
            onRate={(delta) => onUpdateMastery(concept.id, delta)}
            isRecommended={(user.mastery[concept.id] || 0) < 50}
          />
        ))}
      </div>
    </div>
  );
};

export default ConceptView;