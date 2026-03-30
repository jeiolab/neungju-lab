import React, { useState } from 'react';
import { THEORY_CARDS } from '../constants';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [quizAnswer, setQuizAnswer] = useState<boolean | null>(null);

  const handleQuiz = (cardIndex: number, answer: boolean, correctAnswer: boolean) => {
    setQuizAnswer(answer === correctAnswer);
    // Auto reset after 2 seconds
    setTimeout(() => setQuizAnswer(null), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <BookOpen className="text-blue-600 shrink-0 mt-1" />
        <div>
          <h2 className="font-bold text-blue-900">오늘의 코칭</h2>
          <p className="text-blue-800 text-sm">
            분류(Classification)는 지도학습의 가장 기본입니다. 
            <br/>"이게 뭐지?" 하고 이름을 붙여주는 과정이라고 생각해보세요!
          </p>
        </div>
      </div>

      {THEORY_CARDS.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all">
          <button 
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
          >
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <span className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">{idx + 1}</span>
              {card.title}
            </h3>
            {expandedIndex === idx ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          {expandedIndex === idx && (
            <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-indigo-500 pl-3">
                {card.content}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Keywords</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {card.keywords.map(k => (
                      <span key={k} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-700">{k}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Example</span>
                  <p className="text-sm font-medium text-gray-800 mt-1">{card.example}</p>
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold text-sm shrink-0">🤔 흔한 오해:</span>
                  <p className="text-sm text-gray-700 font-medium">"{card.misconception.wrong}"</p>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-green-600 font-bold text-sm shrink-0">✅ 교정:</span>
                  <p className="text-sm text-gray-700">{card.misconception.right}</p>
                </div>
              </div>

              {/* 10s Check */}
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-1">
                  ⏱ 10초 체크
                </h4>
                <div className="bg-indigo-50 p-4 rounded-xl text-center">
                  <p className="font-bold text-indigo-900 mb-4 text-lg">"{card.checkQuestion.q}"</p>
                  
                  {quizAnswer === null ? (
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => handleQuiz(idx, true, card.checkQuestion.a)}
                        className="bg-white hover:bg-indigo-100 text-indigo-600 border border-indigo-200 px-6 py-2 rounded-lg font-bold shadow-sm transition-colors"
                      >
                        네 (O)
                      </button>
                      <button 
                         onClick={() => handleQuiz(idx, false, card.checkQuestion.a)}
                        className="bg-white hover:bg-indigo-100 text-indigo-600 border border-indigo-200 px-6 py-2 rounded-lg font-bold shadow-sm transition-colors"
                      >
                        아니요 (X)
                      </button>
                    </div>
                  ) : (
                    <div className={`flex flex-col items-center animate-in zoom-in duration-200 ${quizAnswer ? 'text-green-600' : 'text-red-500'}`}>
                      {quizAnswer ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                      <p className="font-bold mt-1">{quizAnswer ? "정답입니다!" : "아쉽네요!"}</p>
                      <p className="text-sm text-gray-600 mt-1">{card.checkQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};