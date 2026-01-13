import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Props {
  onComplete: (score: number) => void;
}

const QuizTab: React.FC<Props> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return correct * 10; // 10 points per question
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < QUIZ_QUESTIONS.length) {
      alert("모든 문제를 풀어주세요!");
      return;
    }
    setSubmitted(true);
    const score = calculateScore();
    onComplete(score);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {submitted && (
        <div className="bg-indigo-600 text-white rounded-xl p-8 mb-8 text-center shadow-lg animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">
            당신의 점수는 {calculateScore()}점!
          </h2>
          <p className="text-indigo-100 mb-6">
            {calculateScore() >= 80 ? "와우! 에이전트 마스터시군요! 🎓" : "조금 더 학습하고 다시 도전해보세요!"}
          </p>
          <button 
            onClick={handleRetry}
            className="px-6 py-2 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 도전하기
          </button>
        </div>
      )}

      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, index) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          const userAnswer = answers[q.id];

          return (
            <div key={q.id} className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-colors ${
              submitted 
                ? isCorrect 
                  ? 'border-green-200 bg-green-50/30' 
                  : 'border-red-200 bg-red-50/30'
                : 'border-slate-100'
            }`}>
              <div className="flex items-start mb-4">
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold mr-3 mt-1">
                  Q{index + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-800">{q.question}</h3>
              </div>

              <div className="space-y-2 pl-10">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(q.id, oIdx)}
                    disabled={submitted}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all flex justify-between items-center ${
                      userAnswer === oIdx
                        ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                    } ${
                      submitted && q.correctAnswer === oIdx 
                        ? '!bg-green-100 !text-green-800 !border-green-300' 
                        : ''
                    } ${
                      submitted && userAnswer === oIdx && !isCorrect
                        ? '!bg-red-100 !text-red-800'
                        : ''
                    }`}
                  >
                    <span>{opt}</span>
                    {submitted && q.correctAnswer === oIdx && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {submitted && userAnswer === oIdx && !isCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                  </button>
                ))}
              </div>

              {submitted && !isCorrect && (
                <div className="mt-4 ml-10 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  <strong>💡 해설:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            className="w-full md:w-auto px-12 py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-700 transform transition active:scale-95"
          >
            답안 제출하기
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;