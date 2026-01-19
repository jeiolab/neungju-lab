import React, { useState } from 'react';
import { ConceptCardData } from '../types';
import { CONCEPTS } from '../constants';
import { CheckCircle, Circle, BookOpen } from 'lucide-react';

interface ConceptTabProps {
  completedIds: string[];
  onComplete: (id: string) => void;
}

const ConceptTab: React.FC<ConceptTabProps> = ({ completedIds, onComplete }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h2 className="text-lg font-bold text-blue-800 flex items-center">
          <BookOpen className="mr-2" size={20} />
          오늘의 개념 학습
        </h2>
        <p className="text-sm text-blue-600 mt-1">
          비지도학습의 핵심 개념 6가지를 마스터해보세요. 각 카드를 읽고 '이해했어요'를 누르면 점수가 올라갑니다!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((concept) => {
          const isCompleted = completedIds.includes(concept.id);
          const isOpen = activeId === concept.id;

          return (
            <div 
              key={concept.id} 
              className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
                isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => setActiveId(isOpen ? null : concept.id)}
              >
                <div className="flex items-center space-x-3">
                  {isCompleted ? (
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                  ) : (
                    <Circle className="text-gray-300 flex-shrink-0" size={24} />
                  )}
                  <h3 className="font-bold text-gray-800">{concept.title}</h3>
                </div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {isOpen ? '닫기' : '열기'}
                </span>
              </div>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 text-sm animate-fade-in">
                  <p className="font-medium text-gray-900 mb-2 text-lg">"{concept.definition}"</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {concept.keywords.map(k => (
                      <span key={k} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">#{k}</span>
                    ))}
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-3 text-gray-700">
                    <strong>💡 예시:</strong> {concept.example}
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-4 text-gray-700">
                    {concept.misconception}
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onComplete(concept.id);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors"
                    >
                      이해했어요! (+5점)
                    </button>
                  )}
                  {isCompleted && (
                    <div className="text-center text-green-600 font-medium py-1">
                      학습 완료!
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConceptTab;