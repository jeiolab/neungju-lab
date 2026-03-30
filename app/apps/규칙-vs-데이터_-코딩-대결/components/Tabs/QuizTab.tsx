import React, { useState } from 'react';
import { QUIZ_DATA } from '../../constants';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [wrongNote, setWrongNote] = useState<number[]>([]);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    const wrongIds: number[] = [];
    QUIZ_DATA.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      } else {
        wrongIds.push(q.id);
      }
    });
    setWrongNote(wrongIds);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResult(false);
    setWrongNote([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">개념 확인 퀴즈</h2>
        <p className="text-slate-600">배운 내용을 확인해보세요. 틀린 문제는 오답 노트에 저장됩니다.</p>
      </div>

      <div className="space-y-6">
        {QUIZ_DATA.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCorrect = answers[q.id] === q.correctAnswer;
          const userAnswer = answers[q.id];

          return (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800">Q{idx + 1}. {q.question}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {q.difficulty.toUpperCase()}
                </span>
              </div>

              <div className="grid gap-2">
                {q.options.map((opt, optIdx) => {
                  let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                  if (showResult) {
                    if (optIdx === q.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800 font-bold";
                    else if (optIdx === userAnswer && !isCorrect) btnClass += "bg-red-100 border-red-500 text-red-800";
                    else btnClass += "bg-slate-50 border-slate-200 text-slate-400";
                  } else {
                    if (userAnswer === optIdx) btnClass += "bg-blue-100 border-blue-500 text-blue-800 font-bold";
                    else btnClass += "hover:bg-slate-50 border-slate-200";
                  }

                  return (
                    <button 
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={showResult}
                      className={btnClass}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                   {isCorrect ? <CheckCircle className="text-green-600 flex-shrink-0" /> : <XCircle className="text-red-600 flex-shrink-0" />}
                   <div>
                     <p className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                       {isCorrect ? "정답입니다!" : "오답입니다."}
                     </p>
                     <p className="text-sm text-slate-700 mt-1">{q.explanation}</p>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-6 flex justify-center">
        {!showResult ? (
          <button 
            onClick={calculateScore}
            disabled={Object.keys(answers).length < QUIZ_DATA.length}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {Object.keys(answers).length < QUIZ_DATA.length 
              ? `${Object.keys(answers).length} / ${QUIZ_DATA.length} 풀이 중...` 
              : "제출하고 결과 확인하기"}
          </button>
        ) : (
          <div className="bg-white p-4 rounded-full shadow-2xl border flex items-center gap-4 animate-slide-up">
            <div className="font-bold text-xl">
              점수: <span className="text-indigo-600">{Object.keys(answers).filter(id => answers[Number(id)] === QUIZ_DATA.find(q => q.id === Number(id))?.correctAnswer).length * 10}</span>점
            </div>
            <button 
              onClick={resetQuiz}
              className="bg-slate-800 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-slate-900"
            >
              <RefreshCw className="w-4 h-4" /> 다시 풀기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;
