import React, { useState } from 'react';
import { TIMELINE_EVENTS } from '../constants';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const TabTimeline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<{id: number, answered: boolean, correct: boolean} | null>(null);

  const toggleEvent = (idx: number) => {
    if (expandedId === idx) {
      setExpandedId(null);
      setQuizState(null);
    } else {
      setExpandedId(idx);
      setQuizState(null);
    }
  };

  const handleQuizAnswer = (eventIdx: number, answer: string, correct: string) => {
    const isCorrect = answer === correct; // Simplified strict comparison for this mini-quiz
    setQuizState({
        id: eventIdx,
        answered: true,
        correct: isCorrect
    });
  };

  return (
    <div className="pb-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 px-2">🕵️‍♂️ 디지털 범죄 연대기</h2>
      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
        {TIMELINE_EVENTS.map((event, idx) => (
          <div key={idx} className="relative pl-8 pr-2">
            {/* Dot on timeline */}
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${
                expandedId === idx ? 'bg-indigo-600 border-indigo-200 scale-125' : 'bg-white border-slate-400'
            }`}></div>
            
            <div 
                onClick={() => toggleEvent(idx)}
                className={`cursor-pointer transition-all duration-300 rounded-xl border ${
                    expandedId === idx ? 'bg-white border-indigo-200 shadow-md p-6' : 'bg-transparent border-transparent hover:bg-white hover:p-6 hover:shadow-sm p-0'
                }`}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-indigo-600 font-bold text-base">{event.year}</span>
                    <span className="text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded-full font-medium">#{event.category}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                
                {expandedId !== idx && (
                     <p className="text-slate-500 text-sm line-clamp-1">{event.description}</p>
                )}

                {expandedId === idx && (
                    <div className="animate-fade-in mt-4">
                        <p className="text-slate-600 mb-6 text-base leading-relaxed">{event.description}</p>
                        
                        {/* Mini Quiz Section */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                            <h4 className="flex items-center text-sm font-bold text-slate-700 mb-3">
                                <HelpCircle size={18} className="mr-2 text-indigo-500" />
                                깜짝 퀴즈
                            </h4>
                            <p className="text-base text-slate-800 mb-4 font-medium">{event.quizQuestion}</p>
                            
                            {!quizState?.answered ? (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleQuizAnswer(idx, event.quizAnswer, event.quizAnswer)}
                                        className="flex-1 py-3 bg-white border border-slate-300 rounded-lg text-sm font-bold hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 transition-colors shadow-sm"
                                    >
                                        {event.quizAnswer}
                                    </button>
                                     <button 
                                        onClick={() => handleQuizAnswer(idx, 'Wrong', event.quizAnswer)}
                                        className="flex-1 py-3 bg-white border border-slate-300 rounded-lg text-sm font-bold hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 transition-colors shadow-sm"
                                    >
                                        {event.quizAnswer === 'O' ? 'X' : '기타'}
                                    </button>
                                </div>
                            ) : (
                                <div className={`text-sm font-bold p-3 rounded-lg text-center ${quizState.correct ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                    {quizState.correct ? '정답입니다! (+5 XP)' : `틀렸습니다. 정답: ${event.quizAnswer}`}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabTimeline;