import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "편의점에서 음료수를 사려고 합니다. 원하는 음료수를 찾기 위해 냉장고를 쳐다보고 있습니다. 이때 당신이 사용하는 알고리즘과 가장 가까운 것은?",
    options: ["이진 탐색 (음료수가 가나다순으로 정렬되어 있다고 가정)", "순차 탐색 (하나씩 훑어봄)", "해시 테이블 (위치를 이미 알고 있음)", "버블 정렬"],
    correctIndex: 1,
    explanation: "편의점 음료수는 보통 브랜드나 종류별로 묶여있을 순 있지만, 엄격한 순서(가나다, 가격순)로 정렬되어 있지 않습니다. 따라서 우리는 눈으로 하나씩 훑어보는 순차 탐색(Linear Search)을 수행합니다."
  },
  {
    id: 2,
    question: "전화번호부 책(가나다순 정렬됨)에서 '홍길동'을 찾으려 합니다. 가장 효율적인 방법은?",
    options: ["첫 페이지부터 한 장씩 넘긴다", "무작위로 펼쳐본다", "책의 중간을 펼치고, 앞/뒤 중 어디에 있을지 판단하여 범위를 좁힌다", "책을 다 찢어서 확인한다"],
    correctIndex: 2,
    explanation: "데이터가 정렬되어 있다면 중간값을 확인하여 탐색 범위를 반으로 줄이는 '이진 탐색'이 가장 효율적입니다."
  },
  {
    id: 3,
    question: "데이터가 10개밖에 없는 작은 리스트가 있습니다. 여기서 검색을 1번만 수행할 예정입니다. 어떤 전략이 가장 좋을까요?",
    options: ["일단 퀵 정렬을 수행한 뒤 이진 탐색을 한다", "그냥 순차 탐색으로 찾는다", "데이터베이스 서버를 구축한다", "슈퍼컴퓨터를 산다"],
    correctIndex: 1,
    explanation: "데이터가 적고 검색 횟수가 적다면, 정렬하는 비용(Overhead)이 더 큽니다. 그냥 찾는 게 가장 빠르고 경제적입니다."
  }
];

const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 animate-fade-in text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-amber-500 mb-6">{score} / {questions.length}</div>
        <p className="text-slate-600 mb-8">
          {score === questions.length ? "완벽합니다! 물류 센터장으로 승진하셔도 되겠어요. 🎉" : "수고하셨습니다! 다시 한 번 개념을 복습해보세요."}
        </p>
        <button 
          onClick={resetQuiz}
          className="px-6 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-bold text-amber-600">QUESTION {currentQIndex + 1} / {questions.length}</span>
        <span className="text-sm text-slate-400">Score: {score}</span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          let styles = "border-slate-200 hover:bg-slate-50";
          if (isAnswered) {
            if (idx === currentQuestion.correctIndex) {
              styles = "bg-green-50 border-green-500 text-green-700 font-bold";
            } else if (idx === selectedOption) {
              styles = "bg-red-50 border-red-500 text-red-700";
            } else {
              styles = "opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${styles}`}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {isAnswered && idx === currentQuestion.correctIndex && <CheckCircle size={20} className="text-green-500" />}
                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && <XCircle size={20} className="text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-8 p-5 bg-slate-100 rounded-xl animate-fade-in">
          <p className="font-bold text-slate-800 mb-2">해설:</p>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{currentQuestion.explanation}</p>
          <button 
            onClick={handleNext}
            className="w-full py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-500 transition-colors flex items-center justify-center"
          >
            {currentQIndex < questions.length - 1 ? "다음 문제" : "결과 보기"} <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;