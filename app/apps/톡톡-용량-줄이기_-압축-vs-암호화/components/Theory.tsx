import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { ConceptCard as IConceptCard } from '../types';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface Props {
  onConceptComplete: (id: string) => void;
  completedConcepts: string[];
}

const ConceptCard: React.FC<{ data: IConceptCard; isComplete: boolean; onComplete: () => void }> = ({
  data,
  isComplete,
  onComplete,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [checkedMisconception, setCheckedMisconception] = useState(false);

  const handleCheck = () => {
    setShowAnswer(true);
    if (!isComplete) onComplete();
  };

  return (
    <div className={`p-5 rounded-xl border-2 transition-all ${isComplete ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white shadow-sm'}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{data.title}</h3>
        {isComplete && <CheckCircle2 className="text-green-500 w-6 h-6" />}
      </div>
      
      <p className="text-gray-700 font-medium mb-3">{data.definition}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {data.keywords.map((k, i) => (
          <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-semibold">
            #{k}
          </span>
        ))}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800">
        <span className="font-bold">💡 예시:</span> {data.example}
      </div>

      <div 
        className={`border-l-4 p-3 rounded-r-lg mb-4 cursor-pointer transition-colors ${checkedMisconception ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-gray-50'}`}
        onClick={() => setCheckedMisconception(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-sm text-gray-700">흔한 오해</span>
        </div>
        <p className="text-sm text-gray-600">"{data.misconception.text}"</p>
        {checkedMisconception && (
          <p className="text-sm text-orange-700 mt-2 font-medium">👉 교정: {data.misconception.correction}</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-gray-700">10초 체크</span>
        </div>
        <p className="text-sm text-gray-800 mb-2">{data.checkQuestion.question}</p>
        {!showAnswer ? (
          <button 
            onClick={handleCheck}
            className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold transition-colors"
          >
            정답 확인
          </button>
        ) : (
          <div className="p-2 bg-indigo-50 text-indigo-800 rounded text-sm text-center font-bold">
            정답: {data.checkQuestion.answer}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Theory({ onConceptComplete, completedConcepts }: Props) {
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-2">코치의 한마디 🗣️</h2>
        <p className="text-sm text-gray-600">
          용량을 줄이는 것(압축)과 내용을 숨기는 것(암호화)은 달라요. 
          아래 카드를 하나씩 뒤집으며 핵심을 익혀보세요!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((concept) => (
          <ConceptCard 
            key={concept.id} 
            data={concept} 
            isComplete={completedConcepts.includes(concept.id)}
            onComplete={() => onConceptComplete(concept.id)}
          />
        ))}
      </div>
    </div>
  );
}