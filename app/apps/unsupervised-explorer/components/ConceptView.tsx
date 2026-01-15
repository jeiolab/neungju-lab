import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { Brain, Key, Library, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ConceptViewProps {
  onComplete: () => void;
}

const ConceptView: React.FC<ConceptViewProps> = ({ onComplete }) => {
  const [readCards, setReadCards] = useState<number[]>([]);

  const markAsRead = (index: number) => {
    if (!readCards.includes(index)) {
      const newRead = [...readCards, index];
      setReadCards(newRead);
      if (newRead.length === CONCEPTS.length) {
        onComplete();
      }
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-8 h-8 text-indigo-500" />;
      case 'Key': return <Key className="w-8 h-8 text-amber-500" />;
      case 'Library': return <Library className="w-8 h-8 text-green-500" />;
      case 'AlertTriangle': return <AlertTriangle className="w-8 h-8 text-red-500" />;
      default: return <Brain className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">개념 학습</h2>
        <p className="text-slate-600">
          비지도학습의 세계에 오신 것을 환영합니다! 아래 카드를 하나씩 눌러 개념을 익혀보세요.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(readCards.length / CONCEPTS.length) * 100}%` }}
            ></div>
          </div>
          <span className="whitespace-nowrap">{readCards.length} / {CONCEPTS.length} 완료</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((concept, index) => {
          const isRead = readCards.includes(index);
          return (
            <div
              key={index}
              onClick={() => markAsRead(index)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md
                ${isRead ? 'border-indigo-100 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-indigo-300'}
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                  {getIcon(concept.icon)}
                </div>
                {isRead && <CheckCircle2 className="w-6 h-6 text-indigo-500" />}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{concept.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                {concept.content}
              </p>
              {!isRead && (
                <div className="mt-4 flex items-center text-indigo-500 text-sm font-medium animate-pulse">
                  눌러서 읽음 표시 <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConceptView;
