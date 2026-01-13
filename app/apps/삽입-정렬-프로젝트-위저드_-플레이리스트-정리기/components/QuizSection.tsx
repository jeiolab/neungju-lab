import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.includes(-1)) {
      alert('모든 문제에 답해주세요!');
      return;
    }
    setIsSubmitted(true);
    const score = answers.reduce((acc, curr, idx) => {
      return curr === questions[idx].correctIndex ? acc + 1 : acc;
    }, 0);
    onComplete(score);
  };

  const handleRetry = () => {
    setAnswers(new Array(questions.length).fill(-1));
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">삽입 정렬 마스터 퀴즈</h2>
          {isSubmitted && (
             <div className="text-right">
                <span className="text-3xl font-bold text-indigo-600">
                    {answers.reduce((acc, curr, idx) => curr === questions[idx].correctIndex ? acc + 1 : acc, 0)}
                </span>
                <span className="text-slate-400"> / {questions.length}</span>
             </div>
          )}
      </div>

      {questions.map((q, idx) => {
        const isCorrect = answers[idx] === q.correctIndex;
        
        return (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 flex gap-2">
              <span className="text-indigo-500">Q{idx + 1}.</span> {q.question}
            </h3>
            
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                 let itemClass = "p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ";
                 
                 if (isSubmitted) {
                    if (optIdx === q.correctIndex) itemClass += "bg-green-50 border-green-500 text-green-900 ";
                    else if (answers[idx] === optIdx && !isCorrect) itemClass += "bg-red-50 border-red-500 text-red-900 ";
                    else itemClass += "bg-slate-50 border-slate-200 text-slate-400 ";
                 } else {
                    if (answers[idx] === optIdx) itemClass += "bg-indigo-50 border-indigo-500 text-indigo-900 ";
                    else itemClass += "hover:bg-slate-50 border-slate-200 ";
                 }

                 return (
                   <div key={optIdx} onClick={() => handleSelect(idx, optIdx)} className={itemClass}>
                     <span>{opt}</span>
                     {isSubmitted && optIdx === q.correctIndex && <CheckCircle2 size={20} className="text-green-600" />}
                     {isSubmitted && answers[idx] === optIdx && !isCorrect && <XCircle size={20} className="text-red-600" />}
                   </div>
                 );
              })}
            </div>

            {isSubmitted && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700">
                    <span className="font-bold text-slate-900">해설: </span>
                    {q.explanation}
                </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-center pt-6 pb-12">
        {!isSubmitted ? (
            <button 
                onClick={handleSubmit}
                className="px-8 py-3 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95"
            >
                제출하고 결과 확인하기
            </button>
        ) : (
            <button 
                onClick={handleRetry}
                className="px-8 py-3 bg-slate-200 text-slate-700 text-lg font-bold rounded-xl hover:bg-slate-300 flex items-center gap-2"
            >
                <RefreshCw size={20} /> 다시 풀기
            </button>
        )}
      </div>
    </div>
  );
};