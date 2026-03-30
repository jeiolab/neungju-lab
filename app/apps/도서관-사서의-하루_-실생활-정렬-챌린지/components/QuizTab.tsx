import React, { useState } from 'react';
import { Button } from './Button';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "이미 정리된 책들 사이에 새로운 책 한 권을 순서에 맞춰 끼워 넣으려고 합니다. 가장 적합한 정렬 방식은?",
    options: ["선택 정렬", "삽입 정렬", "버블 정렬", "퀵 정렬"],
    correctAnswer: 1,
    explanation: "이미 정렬된 데이터에 새로운 데이터를 추가할 때는 올바른 위치를 찾아 '삽입'하는 것이 효율적입니다."
  },
  {
    id: 2,
    question: "운동장에 학생들이 무작위로 서 있습니다. 키가 가장 작은 학생부터 차례대로 앞으로 불러내어 줄을 세우는 방식은?",
    options: ["선택 정렬", "삽입 정렬", "병합 정렬", "기수 정렬"],
    correctAnswer: 0,
    explanation: "전체 목록 중 최솟값(가장 작은 키)을 '선택'해서 맨 앞으로 보내는 과정을 반복하므로 선택 정렬입니다."
  },
  {
    id: 3,
    question: "도서관 청구기호 '813.6 김15소'와 '813.6 김15가' 중 서가에 먼저 꽂혀야 하는 책은?",
    options: ["813.6 김15소", "813.6 김15가", "상관 없다", "알 수 없다"],
    correctAnswer: 1,
    explanation: "한글 자모 순서상 '가'가 '소'보다 앞서므로 '김15가'가 먼저 옵니다."
  },
  {
    id: 4,
    question: "다음 중 정렬이 되어있지 않아서 발생하는 문제는?",
    options: ["사전에서 단어 찾기가 빠르다", "쇼핑몰에서 싼 물건부터 보기 쉽다", "도서관에서 책 찾기가 매우 어렵다", "출석부에서 이름 찾기가 쉽다"],
    correctAnswer: 2,
    explanation: "정렬이 되어있지 않으면 원하는 데이터를 찾기 위해 모든 데이터를 다 뒤져야 하므로(순차 탐색) 매우 비효율적입니다."
  },
  {
    id: 5,
    question: "선택 정렬을 사용하여 5개의 숫자를 정렬할 때, 첫 번째 단계에서 하는 일은?",
    options: ["두 번째 숫자와 세 번째 숫자를 비교한다", "전체 숫자 중 가장 작은 숫자를 찾아 맨 앞과 바꾼다", "맨 뒤의 숫자를 맨 앞으로 가져온다", "무작위로 섞는다"],
    correctAnswer: 1,
    explanation: "선택 정렬의 1단계는 전체 데이터 중 최솟값을 찾아 첫 번째 위치의 데이터와 교환하는 것입니다."
  }
];

export const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = QUESTIONS[currentQIndex];

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 mb-4">{score} / {QUESTIONS.length}</div>
        <p className="text-gray-600 mb-8">
          {score === QUESTIONS.length ? "완벽합니다! 당신은 정렬 마스터입니다." : 
           score >= 3 ? "훌륭합니다! 조금만 더 공부하면 수석 사서가 될 수 있어요." : 
           "괜찮습니다. 이론 탭에서 내용을 복습하고 다시 도전해보세요!"}
        </p>
        <Button onClick={resetQuiz}>다시 도전하기</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300" 
          style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase">Question {currentQIndex + 1}</span>
          <HelpCircle className="w-5 h-5 text-gray-300" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let itemClass = "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between ";
            
            if (isSubmitted) {
              if (idx === currentQuestion.correctAnswer) {
                itemClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                itemClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                itemClass += "border-gray-200 text-gray-400 opacity-50";
              }
            } else {
              if (idx === selectedOption) {
                itemClass += "border-indigo-600 bg-indigo-50 text-indigo-800 shadow-md";
              } else {
                itemClass += "border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-600";
              }
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleSelect(idx)}
                disabled={isSubmitted}
                className={itemClass}
              >
                <span>{option}</span>
                {isSubmitted && idx === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                {isSubmitted && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 animate-fade-in">
            <span className="font-bold block mb-1">해설:</span>
            {currentQuestion.explanation}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={selectedOption === null}>정답 확인</Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQIndex < QUESTIONS.length - 1 ? "다음 문제" : "결과 보기"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
