import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { UserState } from '../types';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  userState: UserState;
  onUpdateMastery: (id: string, delta: number) => void;
}

const ConceptTab: React.FC<Props> = ({ userState, onUpdateMastery }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<Record<string, 'unanswered' | 'correct' | 'wrong'>>({});

  const handleQuizCheck = (conceptId: string, option: string, answer: string) => {
    if (quizState[conceptId]) return; // Already answered

    const isCorrect = option === answer;
    setQuizState(prev => ({ ...prev, [conceptId]: isCorrect ? 'correct' : 'wrong' }));
    
    if (isCorrect) {
      onUpdateMastery(conceptId, 15); // Bonus for checking knowledge
    } else {
        onUpdateMastery(conceptId, 5); // Consolation points for trying
    }
  };

  const masteryData = CONCEPTS.map(c => ({
    name: c.title.split('(')[0],
    score: userState.mastery[c.id] || 0,
    fill: (userState.mastery[c.id] || 0) === 100 ? '#10b981' : '#3b82f6'
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">나의 개념 마스터리 현황</h2>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={15} data={masteryData}>
                <RadialBar
                background
                dataKey="score"
                cornerRadius={10}
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{right: 0}} />
            </RadialBarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map(concept => (
          <div key={concept.id} className={`bg-white rounded-xl border transition-all duration-300 ${expandedId === concept.id ? 'ring-2 ring-blue-500 shadow-lg' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
            <div 
                className="p-5 cursor-pointer flex justify-between items-center"
                onClick={() => setExpandedId(expandedId === concept.id ? null : concept.id)}
            >
              <div>
                <h3 className="font-bold text-lg text-slate-800">{concept.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{concept.definition}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className={`text-xs font-bold px-2 py-1 rounded-full ${ (userState.mastery[concept.id] || 0) >= 100 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {(userState.mastery[concept.id] || 0)}%
                 </span>
                 <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${expandedId === concept.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {expandedId === concept.id && (
              <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                    {concept.keywords.map(k => (
                        <span key={k} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">#{k}</span>
                    ))}
                </div>
                
                <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700">
                    <span className="font-bold text-slate-900 block mb-1">🏫 학교 생활 예시</span>
                    {concept.example}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="font-bold text-red-700 block mb-1">❌ 흔한 오해</span>
                        {concept.misconception.wrong}
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <span className="font-bold text-green-700 block mb-1">✅ 팩트 체크</span>
                        {concept.misconception.right}
                    </div>
                </div>

                <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        ⏱️ 10초 체크
                        {quizState[concept.id] === 'correct' && <span className="text-green-600 text-xs">정답입니다! (+15점)</span>}
                        {quizState[concept.id] === 'wrong' && <span className="text-red-500 text-xs">다시 공부해보세요. (+5점)</span>}
                    </h4>
                    <p className="text-sm text-slate-700 mb-3">{concept.checkQuestion.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                        {concept.checkQuestion.options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleQuizCheck(concept.id, opt, concept.checkQuestion.answer)}
                                disabled={!!quizState[concept.id]}
                                className={`text-sm py-2 px-3 rounded-md border text-left transition-colors
                                    ${quizState[concept.id] 
                                        ? (opt === concept.checkQuestion.answer 
                                            ? 'bg-green-100 border-green-300 text-green-800' 
                                            : opt === quizState[concept.id] && quizState[concept.id] !== 'correct' ? 'bg-red-50 border-red-200' : 'bg-slate-50 text-slate-400')
                                        : 'hover:bg-blue-50 hover:border-blue-200 border-slate-200'
                                    }
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-slate-400">이 개념이 이해가 되나요?</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onUpdateMastery(concept.id, -5)}
                            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                            헷갈려요 🤔
                        </button>
                        <button 
                             onClick={() => onUpdateMastery(concept.id, 10)}
                            className="text-xs px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium"
                        >
                            이해했어요 😎
                        </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConceptTab;
