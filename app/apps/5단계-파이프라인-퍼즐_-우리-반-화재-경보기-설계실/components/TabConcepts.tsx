import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { ConceptMastery } from '../types';

interface Props {
  mastery: ConceptMastery;
  onMasteryUpdate: (id: string, correct: boolean) => void;
}

const TabConcepts: React.FC<Props> = ({ mastery, onMasteryUpdate }) => {
  const [activeConceptId, setActiveConceptId] = useState<string>(CONCEPTS[0].id);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeConcept = CONCEPTS.find(c => c.id === activeConceptId) || CONCEPTS[0];

  const handleCheck = (idx: number) => {
    setQuizAnswer(idx);
    const isCorrect = idx === activeConcept.checkQuestion.a;
    if (isCorrect) {
      setFeedback("정답입니다! 핵심을 잘 이해했네요. 🎉");
      onMasteryUpdate(activeConcept.id, true);
    } else {
      setFeedback("아쉽네요. 다시 한 번 개념을 읽어보세요. 💡");
      onMasteryUpdate(activeConcept.id, false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar List */}
      <div className="md:col-span-1 space-y-2">
        {CONCEPTS.map(c => (
          <button
            key={c.id}
            onClick={() => {
              setActiveConceptId(c.id);
              setQuizAnswer(null);
              setFeedback(null);
            }}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              activeConceptId === c.id
                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-bold text-gray-800">{c.title}</div>
            <div className="text-xs text-gray-500 mt-1">
              숙련도: {mastery[c.id] || 0}%
            </div>
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="text-xl font-bold">{activeConcept.title}</h2>
            <p className="text-blue-100 mt-1 text-sm">{activeConcept.definition}</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Keywords</h3>
              <div className="flex gap-2">
                {activeConcept.keywords.map(k => (
                  <span key={k} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <span className="text-green-600 font-bold block mb-1">예시 (Example)</span>
                <p className="text-gray-700 text-sm">{activeConcept.example}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <span className="text-amber-600 font-bold block mb-1">오개념 주의</span>
                <p className="text-gray-700 text-sm">{activeConcept.misconception}</p>
                <p className="text-gray-900 text-sm font-medium mt-2">👉 {activeConcept.correction}</p>
              </div>
            </div>

            {/* 10 Second Check */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs mr-2">Q</span>
                10초 개념 체크
              </h3>
              <p className="text-gray-700 mb-4">{activeConcept.checkQuestion.q}</p>
              <div className="space-y-2">
                {activeConcept.checkQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCheck(idx)}
                    disabled={feedback !== null}
                    className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                      quizAnswer === idx
                        ? idx === activeConcept.checkQuestion.a
                          ? 'bg-green-100 border-green-400 text-green-800'
                          : 'bg-red-100 border-red-400 text-red-800'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && (
                <div className={`mt-3 text-sm font-medium animate-pulse ${quizAnswer === activeConcept.checkQuestion.a ? 'text-green-600' : 'text-red-500'}`}>
                  {feedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabConcepts;