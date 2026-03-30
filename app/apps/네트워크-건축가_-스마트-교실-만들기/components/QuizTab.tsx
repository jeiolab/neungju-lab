import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return correct;
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">네트워크 마스터 퀴즈</h2>
        <p className="text-slate-600">스위치, 라우터, 프로토콜에 대한 지식을 테스트해보세요.</p>
      </div>

      {showResults && (
        <div className="mb-8 p-6 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold flex items-center mb-2">
                    <Trophy className="w-8 h-8 mr-3 text-yellow-300" />
                    점수: {calculateScore()} / {QUIZ_QUESTIONS.length}
                </h3>
                <p className="opacity-90">
                    {calculateScore() > 7 ? "훌륭합니다! 당신은 공인 네트워크 건축가입니다." : "수고하셨습니다! 이론 탭에서 다시 복습해보세요."}
                </p>
            </div>
            <button 
                onClick={resetQuiz}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center"
            >
                <RefreshCw className="w-4 h-4 mr-2" /> 다시 풀기
            </button>
        </div>
      )}

      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, index) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCorrect = answers[q.id] === q.correctIndex;
          
          return (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h4 className="text-lg font-bold text-slate-800 mb-4">
                <span className="text-indigo-500 mr-2">Q{index + 1}.</span>
                {q.question}
              </h4>
              <div className="grid gap-3">
                {q.options.map((opt, optIdx) => {
                   let btnClass = "w-full text-left p-3 rounded-lg border-2 transition-all ";
                   if (showResults) {
                       if (optIdx === q.correctIndex) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 font-medium";
                       else if (answers[q.id] === optIdx) btnClass += "bg-red-50 border-red-500 text-red-800";
                       else btnClass += "border-slate-100 opacity-50";
                   } else {
                       if (answers[q.id] === optIdx) btnClass += "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium";
                       else btnClass += "border-slate-100 hover:border-slate-300 hover:bg-slate-50";
                   }

                   return (
                    <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={btnClass}
                    >
                        <div className="flex justify-between items-center">
                            {opt}
                            {showResults && optIdx === q.correctIndex && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                            {showResults && answers[q.id] === optIdx && optIdx !== q.correctIndex && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                    </button>
                   );
                })}
              </div>
              {showResults && (
                  <div className="mt-4 p-3 bg-slate-50 rounded text-slate-600 text-sm">
                      <strong>해설:</strong> {q.explanation}
                  </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResults && Object.keys(answers).length > 0 && (
        <div className="mt-8 text-center">
            <button 
                onClick={() => setShowResults(true)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all"
            >
                제출하기
            </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;