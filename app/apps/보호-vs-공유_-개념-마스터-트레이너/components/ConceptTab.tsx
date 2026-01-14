import React, { useState } from 'react';
import { Concept, MasteryState, MasteryStatus } from '../types';
import { CONCEPTS } from '../constants';
import { Check, HelpCircle, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';

interface ConceptTabProps {
  mastery: MasteryState;
  updateMastery: (id: string, status: MasteryStatus) => void;
}

export const ConceptTab: React.FC<ConceptTabProps> = ({ mastery, updateMastery }) => {
  const [filter, setFilter] = useState<'all' | 'confused'>('all');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const filteredConcepts = CONCEPTS.filter(c => 
    filter === 'all' ? true : mastery[c.id] === 'confused'
  );

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">이론 개념 학습</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => setFilter('confused')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'confused' ? 'bg-rose-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            헷갈림만 ({Object.values(mastery).filter(s => s === 'confused').length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredConcepts.map(concept => {
          const status = mastery[concept.id] || 'unknown';
          const isOpen = activeCardId === concept.id;

          return (
            <div 
              key={concept.id} 
              className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
                status === 'known' ? 'border-green-200' : 
                status === 'confused' ? 'border-rose-200' : 'border-slate-100'
              }`}
            >
              {/* Card Header */}
              <div 
                className="p-5 flex justify-between items-start cursor-pointer hover:bg-slate-50"
                onClick={() => setActiveCardId(isOpen ? null : concept.id)}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Concept {concept.id.toUpperCase()}
                    </span>
                    {status === 'known' && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">마스터완료</span>}
                    {status === 'confused' && <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">복습필요</span>}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{concept.title}</h3>
                  <p className="text-slate-600 text-sm mt-1">{concept.definition}</p>
                </div>
                <button className="text-slate-400 hover:text-indigo-600">
                  <BookOpen size={20} />
                </button>
              </div>

              {/* Expanded Content */}
              {isOpen && (
                <div className="px-5 pb-5 bg-slate-50/50 border-t border-slate-100">
                  <div className="mt-4 space-y-4">
                    {/* Keywords */}
                    <div className="flex flex-wrap gap-2">
                      {concept.keywords.map(k => (
                        <span key={k} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 shadow-sm">
                          #{k}
                        </span>
                      ))}
                    </div>

                    {/* Example & Misconception Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-800 mb-2 flex items-center">
                          <Lightbulb size={16} className="mr-1.5" /> 실제 예시
                        </h4>
                        <p className="text-sm text-indigo-900 leading-relaxed">{concept.example}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center">
                          <AlertTriangle size={16} className="mr-1.5" /> 흔한 오해
                        </h4>
                        <p className="text-xs text-orange-700 font-semibold mb-1">🚫 {concept.misconception.myth}</p>
                        <p className="text-sm text-orange-900">✅ {concept.misconception.correction}</p>
                      </div>
                    </div>

                    {/* 10-sec Check */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-700 mb-2">⚡ 10초 체크!</h4>
                      <p className="text-sm text-slate-800 mb-3">{concept.checkQuestion.question}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(concept.checkQuestion.answer ? "정답입니다! 🎉" : "틀렸습니다. 다시 생각해보세요.");
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600"
                        >
                          O (그렇다)
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(!concept.checkQuestion.answer ? "정답입니다! 🎉" : "틀렸습니다. 다시 생각해보세요.");
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600"
                        >
                          X (아니다)
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-slate-400 text-center cursor-help" title={concept.checkQuestion.explanation}>
                        (마우스를 올리면 해설 확인)
                      </p>
                    </div>

                    {/* Mastery Action Buttons */}
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => updateMastery(concept.id, 'known')}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold transition-all ${
                          status === 'known' 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                            : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        <Check size={18} className="mr-2" />
                        완벽 이해!
                      </button>
                      <button
                        onClick={() => updateMastery(concept.id, 'confused')}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold transition-all ${
                          status === 'confused' 
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                            : 'bg-white border border-rose-200 text-rose-500 hover:bg-rose-50'
                        }`}
                      >
                        <HelpCircle size={18} className="mr-2" />
                        아직 헷갈려요
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredConcepts.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            해당하는 카드가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};