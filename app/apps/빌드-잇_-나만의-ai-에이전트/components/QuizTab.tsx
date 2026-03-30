import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, Award, Loader2 } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const data = await generateQuiz();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuiz();
  }, []);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResult) return;
    setUserAnswers(prev => ({...prev, [qId]: optionIdx}));
  };

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setShowResult(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p>퀴즈를 생성하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">에이전트 마스터 퀴즈</h2>
        <p className="text-slate-500">학습한 내용을 확인해보세요!</p>
      </div>

      {questions.map((q, idx) => {
        const isAnswered = userAnswers[q.id] !== undefined;
        const isCorrect = userAnswers[q.id] === q.correctAnswer;
        
        return (
          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex">
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-sm mr-3 h-fit">Q{idx + 1}</span>
              {q.question}
            </h3>
            
            <div className="space-y-3">
              {q.options.map((opt, oIdx) => {
                let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                
                if (showResult) {
                  if (oIdx === q.correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-700 font-bold ";
                  else if (userAnswers[q.id] === oIdx) btnClass += "border-red-500 bg-red-50 text-red-700 ";
                  else btnClass += "border-slate-100 text-slate-400 ";
                } else {
                  if (userAnswers[q.id] === oIdx) btnClass += "border-blue-500 bg-blue-50 text-blue-700 font-bold ";
                  else btnClass += "border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-700 ";
                }

                return (
                  <button 
                    key={oIdx}
                    onClick={() => handleSelect(q.id, oIdx)}
                    className={btnClass}
                    disabled={showResult}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {showResult && (
              <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-bold mb-1">{isCorrect ? '정답입니다! 🎉' : '오답입니다. 😅'}</p>
                <p>{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}

      {!showResult ? (
        <button 
          onClick={submitQuiz}
          disabled={Object.keys(userAnswers).length < questions.length}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          제출하기
        </button>
      ) : (
        <div className="bg-slate-800 text-white p-6 rounded-2xl text-center">
          <Award className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{score} / {questions.length}점</h3>
          <p className="text-slate-300 mb-4">
            {score === questions.length ? "완벽합니다! 미래의 CTO감이네요!" : "다시 한 번 도전해보세요!"}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-white text-slate-800 rounded-full font-bold hover:bg-slate-100"
          >
            다시 풀기
          </button>
        </div>
      )}
    </div>
  );
};