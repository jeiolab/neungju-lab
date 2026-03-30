import React, { useState } from 'react';
import { CONCEPT_CARDS } from '../../constants';
import { updateMastery, updateXP, addBadge } from '../../services/storageService';
import { UserProgress } from '../../types';
import { CheckCircle, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react';

interface Props {
  progress: UserProgress;
  onUpdate: () => void;
}

const TheoryTab: React.FC<Props> = ({ progress, onUpdate }) => {
  const [activeCardId, setActiveCardId] = useState<string>(CONCEPT_CARDS[0].id);
  const [showCheck, setShowCheck] = useState(false);
  const [checkResult, setCheckResult] = useState<'correct' | 'incorrect' | null>(null);

  const activeCard = CONCEPT_CARDS.find(c => c.id === activeCardId) || CONCEPT_CARDS[0];
  const mastery = progress.conceptMastery[activeCard.id] || 0;

  const handleAnswer = (index: number) => {
    if (index === activeCard.checkQuestion.correctIndex) {
      setCheckResult('correct');
      updateMastery(activeCard.id, 20);
      updateXP(10);
      if (mastery + 20 >= 100) addBadge('개념 마스터: ' + activeCard.title);
      onUpdate();
    } else {
      setCheckResult('incorrect');
      updateMastery(activeCard.id, -5); // Penalty for guessing
      onUpdate();
    }
  };

  const getRecommendedCard = () => {
    // Simple logic: find lowest mastery
    return CONCEPT_CARDS.sort((a, b) => (progress.conceptMastery[a.id] || 0) - (progress.conceptMastery[b.id] || 0))[0].id;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CONCEPT_CARDS.map(card => {
          const m = progress.conceptMastery[card.id] || 0;
          return (
            <button
              key={card.id}
              onClick={() => { setActiveCardId(card.id); setShowCheck(false); setCheckResult(null); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${activeCardId === card.id 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {card.title} 
              <span className={`ml-2 text-xs ${m === 100 ? 'text-green-300' : 'text-slate-400'}`}>
                {m}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-indigo-600" />
              {activeCard.title}
            </h2>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-600">
              마스터리: {mastery}%
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-lg text-indigo-900 leading-relaxed font-medium">
              {activeCard.definition}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">핵심 키워드</h3>
              <div className="flex flex-wrap gap-2">
                {activeCard.keywords.map(k => (
                  <span key={k} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">
                    #{k}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">예시</h3>
               <div className="text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                 {activeCard.example}
               </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3">
             <AlertTriangle className="text-orange-500 flex-shrink-0 mt-1" size={20} />
             <div>
               <h4 className="font-bold text-orange-800 mb-1">흔한 오해(Misconception)</h4>
               <p className="text-sm text-orange-900 mb-2">❌ <span className="line-through">{activeCard.misconception.myth}</span></p>
               <p className="text-sm text-green-700 font-medium">✅ {activeCard.misconception.truth}</p>
             </div>
          </div>
        </div>

        {/* 10s Check Section */}
        <div className="border-t border-slate-100 bg-slate-50 p-6">
          {!showCheck ? (
            <button 
              onClick={() => setShowCheck(true)}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Lightbulb size={18} />
              10초 개념 체크 (XP 획득)
            </button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-slate-800">Q. {activeCard.checkQuestion.question}</h3>
              <div className="grid gap-2">
                {activeCard.checkQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={checkResult !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`p-3 text-left rounded border transition-all
                      ${checkResult === null 
                        ? 'bg-white hover:bg-indigo-50 border-slate-200' 
                        : idx === activeCard.checkQuestion.correctIndex
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : checkResult === 'incorrect' && 'opacity-50'
                      }
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {checkResult === 'correct' && (
                <div className="text-green-600 font-bold flex items-center gap-2">
                  <CheckCircle size={16} /> 정답입니다! 마스터리가 상승했습니다.
                </div>
              )}
              {checkResult === 'incorrect' && (
                <div className="text-red-500 font-bold">
                  오답입니다. 개념을 다시 읽어보세요.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {getRecommendedCard() !== activeCardId && (
        <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center text-blue-900 text-sm">
          <span>💡 다음 추천 학습: <strong>{CONCEPT_CARDS.find(c => c.id === getRecommendedCard())?.title}</strong></span>
          <button 
             onClick={() => { setActiveCardId(getRecommendedCard()); setShowCheck(false); setCheckResult(null); }}
             className="text-blue-600 font-bold hover:underline"
          >
            이동하기 &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default TheoryTab;
