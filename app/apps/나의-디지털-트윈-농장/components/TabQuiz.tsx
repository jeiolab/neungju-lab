import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = QUIZ_DATA[currentQuestionIdx];
  const isCorrect = selectedOption === currentQuiz.correctAnswer;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === currentQuiz.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_DATA.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      alert(`퀴즈 종료! 총 ${score} / ${QUIZ_DATA.length} 점입니다.`);
      // Reset
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setShowResult(false);
      setScore(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <HelpCircle className="mx-auto mb-2 w-10 h-10 opacity-80" />
          <h2 className="text-2xl font-bold">스마트팜 운영 퀴즈</h2>
          <p className="text-indigo-200">Question {currentQuestionIdx + 1} / {QUIZ_DATA.length}</p>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {currentQuiz.question}
          </h3>

          <div className="space-y-3">
            {currentQuiz.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center
                  ${showResult 
                    ? idx === currentQuiz.correctAnswer 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : idx === selectedOption 
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-slate-100 text-slate-400'
                    : 'border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700'
                  }
                `}
              >
                <span>{opt}</span>
                {showResult && idx === currentQuiz.correctAnswer && <CheckCircle className="text-green-500" />}
                {showResult && idx === selectedOption && idx !== currentQuiz.correctAnswer && <XCircle className="text-red-500" />}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-8 animate-fade-in-up">
              <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-bold mb-1">{isCorrect ? "정답입니다! 🎉" : "오답입니다. 😅"}</p>
                <p className="text-sm opacity-90">{currentQuiz.explanation}</p>
              </div>
              <button 
                onClick={nextQuestion}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
              >
                {currentQuestionIdx < QUIZ_DATA.length - 1 ? "다음 문제" : "결과 보기"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabQuiz;