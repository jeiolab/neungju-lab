import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizTabProps {
  onSuccess: (xp: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onSuccess }) => {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleSelect = (qId: number, optionIdx: number) => {
    if (results[qId] !== undefined) return; // Locked after answer
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const submitAnswer = (qId: number) => {
    const question = QUIZZES.find(q => q.id === qId);
    if (!question || answers[qId] === null) return;

    const isCorrect = answers[qId] === question.correctIdx;
    setResults(prev => ({ ...prev, [qId]: isCorrect }));

    if (isCorrect) onSuccess(15);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-0 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">개념 확인 퀴즈</h2>
        <p className="text-gray-600">오답 노트를 통해 완벽하게 이해해보세요.</p>
      </div>

      {QUIZZES.map((q, idx) => {
        const isAnswered = results[q.id] !== undefined;
        const isCorrect = results[q.id] === true;
        const isWrong = results[q.id] === false;

        return (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded mb-2">
                문제 {idx + 1}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{q.question}</h3>
              
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                  if (isAnswered) {
                    if (optIdx === q.correctIdx) btnClass += "bg-green-100 border-green-500 text-green-800 font-bold ";
                    else if (answers[q.id] === optIdx && optIdx !== q.correctIdx) btnClass += "bg-red-50 border-red-300 text-red-700 ";
                    else btnClass += "bg-gray-50 text-gray-400 border-gray-100 ";
                  } else {
                    if (answers[q.id] === optIdx) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-700 ";
                    else btnClass += "hover:bg-gray-50 border-gray-200 ";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={isAnswered}
                      className={btnClass}
                    >
                      {opt}
                      {isAnswered && optIdx === q.correctIdx && <CheckCircle size={16} className="float-right mt-1" />}
                      {isAnswered && answers[q.id] === optIdx && optIdx !== q.correctIdx && <XCircle size={16} className="float-right mt-1" />}
                    </button>
                  );
                })}
              </div>

              {!isAnswered && answers[q.id] !== undefined && (
                 <button 
                  onClick={() => submitAnswer(q.id)}
                  className="mt-4 w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700"
                 >
                   채점하기
                 </button>
              )}

              {/* Feedback Section */}
              {isWrong && (
                <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4 animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-red-800 mb-2 flex items-center">
                    <XCircle size={18} className="mr-2" /> 오답 클리닉
                  </h4>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li><strong>Why?</strong> {q.explanation.reason}</li>
                    <li><strong>Correction:</strong> {q.explanation.correction}</li>
                    <li className="bg-white/50 p-2 rounded mt-2 border border-red-100 text-gray-700">
                      <strong>💡 재도전:</strong> {q.explanation.challenge}
                    </li>
                  </ul>
                </div>
              )}
              {isCorrect && (
                <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm text-center font-bold animate-in slide-in-from-top-2">
                   완벽합니다! +15 XP
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizTab;
