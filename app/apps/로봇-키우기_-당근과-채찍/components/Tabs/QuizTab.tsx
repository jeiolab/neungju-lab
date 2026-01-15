import React, { useState } from 'react';
import { generateQuizQuestion } from '../../services/geminiService';
import { HelpCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QuizTab: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const fetchNewQuiz = async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    const data = await generateQuizQuestion();
    if (data) {
      setQuiz(data);
    } else {
      // Fallback if API fails
      setQuiz({
        question: "로봇이 벽에 부딪혔을 때 어떤 값을 주어야 벽을 피하는 법을 배울까요?",
        options: ["+10점 (보상)", "-10점 (벌칙)", "0점 (무시)", "초기화"],
        correctIndex: 1,
        explanation: "원하지 않는 행동을 줄이려면 벌칙(음수 보상)을 주어야 합니다."
      });
    }
    setLoading(false);
  };

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null || !quiz) return;
    setSelectedOption(index);
    setIsCorrect(index === quiz.correctIndex);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
      {!quiz && !loading && (
        <div className="text-center space-y-6">
          <HelpCircle size={64} className="mx-auto text-brand-500" />
          <h2 className="text-2xl font-bold text-slate-800">강화 학습 퀴즈</h2>
          <p className="text-slate-600">AI가 생성하는 문제를 풀어보며 개념을 확실히 익혀보세요!</p>
          <button 
            onClick={fetchNewQuiz}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
          >
            퀴즈 시작하기
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 className="animate-spin" size={48} />
          <p>새로운 문제를 만들고 있어요...</p>
        </div>
      )}

      {quiz && !loading && (
        <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <div className="mb-6">
            <span className="text-brand-600 font-bold text-sm tracking-wider uppercase mb-2 block">Quiz</span>
            <h3 className="text-xl font-bold text-slate-900">{quiz.question}</h3>
          </div>

          <div className="space-y-3">
            {quiz.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={selectedOption !== null}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all
                  ${selectedOption === null 
                    ? 'border-slate-100 hover:border-brand-200 hover:bg-brand-50' 
                    : idx === quiz.correctIndex 
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : idx === selectedOption 
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-slate-100 opacity-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedOption !== null && idx === quiz.correctIndex && <CheckCircle size={20} className="text-green-600" />}
                  {selectedOption !== null && idx === selectedOption && idx !== quiz.correctIndex && <XCircle size={20} className="text-red-600" />}
                </div>
              </button>
            ))}
          </div>

          {selectedOption !== null && (
            <div className={`mt-6 p-4 rounded-lg animate-fadeIn ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-bold mb-1">{isCorrect ? "정답입니다! 🎉" : "아쉽네요! 😅"}</p>
              <p className="text-sm">{quiz.explanation}</p>
              <button 
                onClick={fetchNewQuiz}
                className="mt-4 text-sm font-bold underline hover:no-underline"
              >
                다음 문제 풀기 &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizTab;
