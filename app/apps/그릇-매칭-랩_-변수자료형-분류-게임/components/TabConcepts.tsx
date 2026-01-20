import React, { useState } from 'react';
import { Concept } from '../types';
import { CONCEPTS } from '../constants';
import { BookOpen, CheckCircle, HelpCircle, XCircle, Clock } from 'lucide-react';

const ConceptCard: React.FC<{ concept: Concept }> = ({ concept }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleCheck = () => {
    if (userAnswer.trim() === concept.checkAnswer) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all hover:shadow-lg">
      <div 
        className="p-5 cursor-pointer bg-slate-50 border-b border-slate-100 flex justify-between items-center"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <h3 className="font-bold text-lg text-slate-800">{concept.title}</h3>
        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
          {isFlipped ? '접기' : '펼치기'}
        </span>
      </div>
      
      {isFlipped && (
        <div className="p-5 space-y-4 animate-fadeIn">
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">정의</span>
            <p className="text-slate-700 mt-1 leading-relaxed">{concept.definition}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">핵심 키워드</span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {concept.keywords.map(k => (
                <span key={k} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                  #{k}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-indigo-500">
            <span className="text-xs font-bold text-slate-500">예시 Code</span>
            <code className="block mt-1 font-mono text-sm text-slate-800">{concept.example}</code>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm text-amber-900">
            <div className="flex items-center gap-2 font-bold mb-1">
              <XCircle size={14} className="text-amber-600" />
              <span>흔한 오해</span>
            </div>
            {concept.misconception}
          </div>

          {/* 10 Sec Check */}
          <div className="pt-4 border-t border-slate-100">
             <button 
               onClick={() => setShowCheck(!showCheck)}
               className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
             >
               <Clock size={16} /> 10초 체크 질문 {showCheck ? '닫기' : '열기'}
             </button>
             
             {showCheck && (
               <div className="mt-3 bg-indigo-50 p-4 rounded-lg">
                 <p className="text-sm font-medium mb-3">{concept.checkQuestion}</p>
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="답 입력..." 
                     className="flex-1 border border-indigo-200 rounded px-3 py-1 text-sm focus:outline-none focus:border-indigo-500"
                     value={userAnswer}
                     onChange={(e) => setUserAnswer(e.target.value)}
                   />
                   <button 
                     onClick={handleCheck}
                     className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-indigo-700"
                   >
                     확인
                   </button>
                 </div>
                 {feedback === 'correct' && <p className="text-xs text-green-600 font-bold mt-2">정답입니다! 🎉</p>}
                 {feedback === 'wrong' && <p className="text-xs text-red-500 font-bold mt-2">다시 생각해보세요. 정답: {concept.checkAnswer}</p>}
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

const TabConcepts: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-indigo-200" />
          개념 익히기
        </h2>
        <p className="mt-2 text-indigo-100">
          프로그래밍의 기초 재료인 변수와 자료형을 알아봅시다.<br/>
          카드를 눌러 내용을 확인하고 '10초 체크'로 점검하세요.
        </p>
      </div>

      <div className="grid gap-4">
        {CONCEPTS.map(concept => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </div>
    </div>
  );
};

export default TabConcepts;