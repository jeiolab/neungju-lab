import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { QuizQuestion, WrongNote } from '../types';
import { Check, X, RefreshCw } from 'lucide-react';

interface Props {
  onCorrect: (question: QuizQuestion) => void;
  onWrong: (note: WrongNote) => void;
  wrongNotes: WrongNote[];
}

export const QuizTab: React.FC<Props> = ({ onCorrect, onWrong, wrongNotes }) => {
  const [currentAnswers, setCurrentAnswers] = useState<{[key: number]: string}>({});
  const [results, setResults] = useState<{[key: number]: boolean | null}>({}); // null: not submitted, true: correct
  const [feedbackMode, setFeedbackMode] = useState<{[key: number]: boolean}>({});

  const checkAnswer = (q: QuizQuestion) => {
    const userAns = currentAnswers[q.id]?.trim() || "";
    if (!userAns) return;

    let isCorrect = false;
    if (q.type === 'multiple') {
      isCorrect = userAns === q.correctAnswer;
    } else {
      // Short/Narrative: check if keywords exist
      const keywords = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      isCorrect = keywords.some(k => userAns.includes(k));
    }

    setResults(prev => ({ ...prev, [q.id]: isCorrect }));
    setFeedbackMode(prev => ({ ...prev, [q.id]: true }));

    if (isCorrect) {
      onCorrect(q);
    } else {
      onWrong({
        questionId: q.id,
        userAnswer: userAns,
        timestamp: Date.now(),
        concept: q.concept
      });
    }
  };

  const retryQuestion = (id: number) => {
    setResults(prev => ({ ...prev, [id]: null }));
    setFeedbackMode(prev => ({ ...prev, [id]: false }));
    setCurrentAnswers(prev => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
        <h2 className="font-bold text-indigo-900">확인 퀴즈 (총 {QUIZ_DATA.length}문항)</h2>
        <span className="text-sm font-medium text-indigo-700">오답노트: {wrongNotes.length}개</span>
      </div>

      <div className="space-y-6">
        {QUIZ_DATA.map((q, index) => {
          const isSubmitted = feedbackMode[q.id];
          const isCorrect = results[q.id] === true;
          const isWrong = results[q.id] === false;

          return (
            <div key={q.id} className={`bg-white p-5 rounded-xl border-2 transition-colors ${isCorrect ? 'border-green-200 bg-green-50/30' : isWrong ? 'border-red-200 bg-red-50/30' : 'border-slate-100'}`}>
              <div className="flex justify-between mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'normal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {q.difficulty}
                </span>
                {isSubmitted && (
                  <span className={`flex items-center gap-1 font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {isCorrect ? <><Check size={16}/> 정답</> : <><X size={16}/> 오답</>}
                  </span>
                )}
              </div>
              
              <h3 className="font-bold text-slate-800 mb-4">{index + 1}. {q.question}</h3>

              {!isSubmitted ? (
                <div className="space-y-3">
                  {q.type === 'multiple' && q.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`q-${q.id}`} 
                        value={opt}
                        checked={currentAnswers[q.id] === opt}
                        onChange={(e) => setCurrentAnswers({...currentAnswers, [q.id]: e.target.value})}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">{opt}</span>
                    </label>
                  ))}
                  {(q.type === 'short' || q.type === 'narrative') && (
                    <input 
                      type="text"
                      placeholder={q.type === 'short' ? "단답형 입력" : "서술형 입력"}
                      value={currentAnswers[q.id] || ''}
                      onChange={(e) => setCurrentAnswers({...currentAnswers, [q.id]: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  )}
                  <button 
                    onClick={() => checkAnswer(q)}
                    className="mt-2 w-full py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 transition-colors"
                  >
                    제출하기
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in space-y-3">
                  {isWrong && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm space-y-2">
                       <p className="font-bold text-red-800">왜 틀렸을까요?</p>
                       <p className="text-red-700">{q.explanation}</p>
                       <p className="text-red-600 text-xs mt-2">입력한 답: {currentAnswers[q.id]}</p>
                    </div>
                  )}
                  {isCorrect && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-sm">
                       <p className="font-bold text-green-800">정확합니다!</p>
                       <p className="text-green-700">{q.explanation}</p>
                    </div>
                  )}
                  
                  {isWrong && (
                    <button 
                      onClick={() => retryQuestion(q.id)}
                      className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <RefreshCw size={14}/> 다시 도전하기
                    </button>
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
