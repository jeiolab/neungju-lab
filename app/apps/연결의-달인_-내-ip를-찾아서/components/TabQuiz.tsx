import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { HelpCircle, Check, X, Trophy } from 'lucide-react';

const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "가정집 공유기 설정에서 192.168.0.1이 게이트웨이라면, 컴퓨터의 올바른 IP 주소는?",
    options: ["192.168.1.5", "192.168.0.1 (게이트웨이와 동일)", "192.168.0.10", "10.0.0.5"],
    correctAnswer: 2,
    explanation: "컴퓨터 IP는 게이트웨이와 같은 네트워크 대역(192.168.0.x)이어야 하며, 중복되지 않아야 합니다."
  },
  {
    id: 2,
    question: "IP 주소를 자동으로 받아오게 해주는 기술의 이름은 무엇인가요?",
    options: ["DNS", "DHCP", "HTTP", "FTP"],
    correctAnswer: 1,
    explanation: "DHCP(Dynamic Host Configuration Protocol)가 IP 자동 할당을 담당합니다."
  },
  {
    id: 3,
    question: "옆집 와이파이 신호가 잡히는데 비밀번호가 없습니다. 몰래 써도 될까요?",
    options: ["네, 공짜니까요.", "아니요, 보안 문제 및 무단 접속 문제가 발생할 수 있습니다.", "속도만 빠르면 상관없습니다.", "밤에만 쓰면 됩니다."],
    correctAnswer: 1,
    explanation: "남의 와이파이를 무단으로 사용하는 것은 해킹 위험이 있고 윤리적/법적 문제가 될 수 있습니다."
  },
  {
    id: 4,
    question: "다음 중 '공인 IP'가 아닌 것은? (사설 IP 대역)",
    options: ["203.252.x.x", "8.8.8.8", "192.168.0.5", "1.1.1.1"],
    correctAnswer: 2,
    explanation: "192.168.x.x 대역은 전 세계적으로 약속된 사설 IP 대역입니다."
  },
  {
    id: 5,
    question: "서브넷 마스크 255.255.255.0의 의미는?",
    options: ["IP 주소 앞 3자리가 같아야 같은 네트워크다.", "모든 IP를 다 허용한다.", "인터넷 속도를 빠르게 한다.", "IP 주소를 숨긴다."],
    correctAnswer: 0,
    explanation: "255로 표시된 부분은 네트워크 ID로, 서로 일치해야 통신이 가능함을 의미합니다."
  }
];

export const TabQuiz: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_DATA[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_DATA.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl shadow-xl mt-10">
        <Trophy className="mx-auto text-yellow-500 mb-6" size={64} />
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 완료!</h2>
        <p className="text-xl text-slate-600 mb-8">
          당신의 점수는 <span className="font-bold text-blue-600">{score}</span> / {QUIZ_DATA.length} 점입니다.
        </p>
        <button 
          onClick={restartQuiz}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-slate-500">
        <span>Question {currentQIndex + 1} / {QUIZ_DATA.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let itemClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ";
            
            if (isAnswered) {
              if (idx === currentQuestion.correctAnswer) {
                itemClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                itemClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                itemClass += "border-slate-100 text-slate-400";
              }
            } else {
              itemClass += "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleOptionClick(idx)}
                className={itemClass}
                disabled={isAnswered}
              >
                <span>{option}</span>
                {isAnswered && idx === currentQuestion.correctAnswer && <Check size={20} />}
                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && <X size={20} />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-slate-100 animate-fade-in">
            <div className="flex gap-2 items-start text-slate-600">
              <HelpCircle className="shrink-0 text-blue-500 mt-1" size={20} />
              <div>
                <span className="font-bold text-slate-800 block mb-1">해설</span>
                <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>
            <button 
              onClick={handleNext}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              {currentQIndex < QUIZ_DATA.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};