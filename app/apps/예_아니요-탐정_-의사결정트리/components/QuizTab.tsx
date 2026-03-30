import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizzes: QuizQuestion[] = [
  {
    id: 1,
    question: "의사결정트리의 가장 끝부분에 있으며, 최종적인 분류 결과(정답)를 나타내는 노드의 이름은 무엇인가요?",
    options: ["루트 노드 (Root Node)", "가지 노드 (Branch)", "리프 노드 (Leaf Node)", "줄기 노드 (Stem)"],
    correctAnswer: 2,
    explanation: "리프 노드(Leaf Node)는 더 이상 분기되지 않는 끝단으로, 최종 결정 값을 가집니다."
  },
  {
    id: 2,
    question: "나무가 너무 복잡해져서 학습 데이터는 완벽하게 맞추지만, 새로운 데이터는 잘 맞추지 못하는 현상은?",
    options: ["과적합 (Overfitting)", "가지치기 (Pruning)", "분류 (Classification)", "회귀 (Regression)"],
    correctAnswer: 0,
    explanation: "과적합은 모델이 훈련 데이터의 잡음까지 학습하여 일반화 성능이 떨어지는 현상입니다."
  },
  {
    id: 3,
    question: "다음 중 의사결정트리를 여러 개 모아서 만드는 '앙상블' 모델은?",
    options: ["로지스틱 회귀", "랜덤 포레스트", "K-최근접 이웃", "신경망"],
    correctAnswer: 1,
    explanation: "랜덤 포레스트(Random Forest)는 여러 개의 의사결정트리를 숲처럼 구성하여 다수결로 예측하는 모델입니다."
  }
];

const QuizTab: React.FC = () => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === quizzes[currentQuiz].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuiz = () => {
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 결과</h2>
          <div className="text-6xl font-black text-blue-500 mb-6">{score} / {quizzes.length}</div>
          <p className="text-slate-600 mb-8">
            {score === quizzes.length ? "완벽합니다! 의사결정트리 전문가시네요! 🎓" : "수고하셨습니다! 다시 한번 복습해보세요."}
          </p>
          <button 
            onClick={resetQuiz}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            다시 풀기
          </button>
        </div>
      </div>
    );
  }

  const q = quizzes[currentQuiz];

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-slate-400 font-medium">Question {currentQuiz + 1} / {quizzes.length}</span>
        <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${((currentQuiz + 1) / quizzes.length) * 100}%` }}
            ></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
          {q.question}
        </h3>

        <div className="space-y-3 flex-1">
          {q.options.map((option, idx) => {
            let itemClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-600 ";
            if (isAnswered) {
              if (idx === q.correctAnswer) {
                itemClass += "border-green-500 bg-green-50 text-green-700";
              } else if (idx === selectedOption) {
                itemClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                itemClass += "border-slate-100 opacity-50";
              }
            } else {
              itemClass += "border-slate-100 hover:border-blue-300 hover:bg-blue-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={itemClass}
              >
                <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {isAnswered && idx === q.correctAnswer && <CheckCircle2 className="text-green-500" size={20} />}
                    {isAnswered && idx === selectedOption && idx !== q.correctAnswer && <XCircle className="text-red-500" size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 animate-fade-in-up">
            <div className="bg-slate-50 p-4 rounded-lg mb-4 text-sm text-slate-600">
                <span className="font-bold block mb-1">💡 해설</span>
                {q.explanation}
            </div>
            <button 
                onClick={nextQuiz}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors"
            >
                다음 문제 <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;