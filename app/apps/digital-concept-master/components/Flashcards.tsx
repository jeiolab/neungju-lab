import React, { useState } from 'react';
import { Concept, MasteryState } from '../types';
import { Check, X, RotateCw } from 'lucide-react';

interface Props {
  concepts: Concept[];
  mastery: MasteryState;
  onUpdateMastery: (id: string, success: boolean) => void;
}

const Flashcards: React.FC<Props> = ({ concepts, mastery, onUpdateMastery }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentConcept = concepts[currentIndex];
  const currentMastery = mastery[currentConcept.id] || 0;

  const handleNext = (success: boolean) => {
    onUpdateMastery(currentConcept.id, success);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % concepts.length);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-4">
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-slate-500">
          카드 {currentIndex + 1} / {concepts.length}
        </span>
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">숙련도:</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${currentMastery >= 80 ? 'bg-green-500' : currentMastery >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${currentMastery}%` }}
                />
            </div>
            <span className="text-xs font-bold">{currentMastery}%</span>
        </div>
      </div>

      <div 
        className="group w-full h-80 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center">
            <span className="text-indigo-500 text-sm font-bold uppercase tracking-wider mb-4">{currentConcept.category}</span>
            <h2 className="text-3xl font-bold text-slate-800">{currentConcept.term}</h2>
            <p className="mt-4 text-slate-400 text-sm">(클릭하여 정의 및 예시 확인)</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-50 rounded-2xl shadow-xl border border-indigo-100 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
            <h3 className="text-lg font-bold text-indigo-700 mb-2">정의</h3>
            <p className="text-slate-700 mb-4 leading-relaxed">{currentConcept.definition}</p>
            <div className="w-full h-px bg-indigo-200 my-2"></div>
            <h3 className="text-lg font-bold text-emerald-600 mb-2 mt-2">실생활 예시</h3>
            <p className="text-slate-700 italic">"{currentConcept.example}"</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 w-full justify-center">
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(false); }}
          className="flex-1 max-w-[150px] flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm font-semibold"
        >
          <X size={20} />
          모르겠어요
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <RotateCw size={20} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(true); }}
          className="flex-1 max-w-[150px] flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 font-semibold"
        >
          <Check size={20} />
          알고 있어요
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
