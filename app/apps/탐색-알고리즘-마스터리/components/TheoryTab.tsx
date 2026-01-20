import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { ConceptCard, UserState } from '../types';
import { CheckCircle, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';

interface Props {
  userState: UserState;
  onUpdateState: (newState: Partial<UserState>) => void;
}

const TheoryTab: React.FC<Props> = ({ userState, onUpdateState }) => {
  const [activeCardId, setActiveCardId] = useState<string>(CONCEPTS[0].id);
  const [showAnswer, setShowAnswer] = useState<string | null>(null);

  // Find weakest concept (lowest mastery)
  const weakestConceptId = Object.entries(userState.mastery).sort((a, b) => (a[1] as number) - (b[1] as number))[0][0];
  const weakestConcept = CONCEPTS.find(c => c.id === weakestConceptId);

  const handleCheckAnswer = (conceptId: string, isCorrect: boolean) => {
    setShowAnswer(conceptId);
    // Simple XP boost for interacting with theory checks (only once per session ideal, but simple here)
    // We won't spam XP here, just feedback.
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Weak Concept Banner */}
      {weakestConcept && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="text-orange-500 w-5 h-5 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-orange-700 font-bold uppercase">오늘의 집중 공략</p>
              <h3 className="text-lg font-bold text-gray-800">{weakestConcept.title}</h3>
              <p className="text-sm text-gray-600 mt-1">이 개념의 숙련도가 가장 낮습니다. 한 번 더 확인해보세요!</p>
            </div>
            <div className="ml-auto font-bold text-orange-600 text-xl">
              {userState.mastery[weakestConcept.id as keyof typeof userState.mastery] || 0}%
            </div>
          </div>
        </div>
      )}

      {/* Concept Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {CONCEPTS.map((concept) => (
          <div 
            key={concept.id} 
            className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all ${
              activeCardId === concept.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent hover:border-gray-200'
            }`}
            onClick={() => setActiveCardId(concept.id)}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-gray-900">{concept.title}</h3>
                <div className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Concept
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 font-medium">{concept.definition}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {concept.keywords.map((kw, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">
                    #{kw}
                  </span>
                ))}
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
                <span className="font-bold text-blue-700 block mb-1">💡 예시</span>
                {concept.example}
              </div>

              <div className="bg-amber-50 p-3 rounded-lg mb-4 text-sm border border-amber-100">
                <span className="font-bold text-amber-700 block mb-1 flex items-center">
                  <XCircle className="w-3 h-3 mr-1" /> 흔한 오해
                </span>
                <p className="text-gray-800 mb-1">"{concept.misconception.text}"</p>
                <p className="text-amber-800 font-medium">→ {concept.misconception.correction}</p>
              </div>

              {/* 10 Check Question */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1 text-indigo-500" /> 10초 체크
                </p>
                <p className="text-sm text-gray-600 mb-3">{concept.checkQuestion.question}</p>
                
                {showAnswer === concept.id ? (
                  <div className={`p-3 rounded text-sm ${concept.checkQuestion.answer ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    <span className="font-bold block mb-1">{concept.checkQuestion.answer ? '⭕ 정답: O' : '❌ 정답: X'}</span>
                    {concept.checkQuestion.explanation}
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCheckAnswer(concept.id, true); }}
                      className="flex-1 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 font-bold text-gray-700"
                    >
                      O
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCheckAnswer(concept.id, false); }}
                      className="flex-1 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 font-bold text-gray-700"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mastery Bar at bottom of card */}
            <div className="bg-gray-50 px-5 py-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">나의 숙련도</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    (userState.mastery[concept.id as keyof typeof userState.mastery] || 0) >= 80 ? 'bg-green-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${userState.mastery[concept.id as keyof typeof userState.mastery] || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheoryTab;