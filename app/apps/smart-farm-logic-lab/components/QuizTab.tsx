import React, { useState } from 'react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "온도가 30도 이상일 때 팬을 켜고 싶습니다. 올바른 조건문은?",
    options: ["if (temp < 30)", "if (temp > 30)", "while (temp == 30)", "if (temp = 30)"],
    correctAnswer: 1,
    difficulty: "Low",
    explanation: "> 기호는 '크다'를 의미합니다. = 는 대입 연산자이므로 비교에는 == 또는 ===를 써야 합니다."
  },
  {
    id: 2,
    question: "창문이 열려있지 '않을' 때만 히터를 켜야 합니다. 빈칸에 알맞은 논리 연산자는? if (!windowOpen ___ temp < 10)",
    options: ["|| (OR)", "&& (AND)", "! (NOT)", "== (EQUAL)"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "창문이 닫혀있고(AND) 온도가 낮아야 하므로 && 연산자가 필요합니다."
  },
  {
    id: 3,
    question: "센서 값을 1초마다 계속 확인하려면 어떤 구조가 가장 적절한가요?",
    options: ["If-Else 문", "Switch 문", "While 루프 (무한 반복)", "변수 선언"],
    correctAnswer: 2,
    difficulty: "Low",
    explanation: "지속적인 모니터링을 위해서는 반복문(Loop)이 필요합니다. 실제 임베디드 시스템에서는 void loop() 등을 사용합니다."
  },
  {
    id: 4,
    question: "다음 코드의 실행 결과로 올바른 것은? (temp=35, hum=80)\nif(temp > 30) { fan_on() } else if(hum > 70) { dehumidifier_on() }",
    options: ["팬과 제습기 둘 다 켜짐", "팬만 켜짐", "제습기만 켜짐", "아무것도 안 켜짐"],
    correctAnswer: 1,
    difficulty: "High",
    explanation: "if-else if 구조에서는 앞의 조건(temp > 30)이 참이면 뒤의 조건은 검사하지 않고 넘어갑니다."
  },
  {
    id: 5,
    question: "작물이 말라죽지 않게 하려면 히터와 팬을 동시에 켜면 안 됩니다. 이를 방지하는 로직은?",
    options: ["if(heater) { fan = true }", "if(heater && fan) { alert('Error') }", "while(heater) { fan = true }", "if(heater || fan) { stop() }"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Heater와 Fan이 모두 True(참)인 경우를 감지하여 에러를 내거나 상태를 수정해야 합니다."
  }
];

const QuizTab: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const currentQ = QUESTIONS[isReviewMode ? wrongAnswers[currentQuestionIndex] : currentQuestionIndex];
  // Safe guard if review mode is on but index is out of bounds (though handled by logic)
  const displayQ = currentQ || QUESTIONS[0];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === displayQ.correctAnswer) {
      if (!isReviewMode) setScore(score + 1);
    } else {
      if (!isReviewMode && !wrongAnswers.includes(displayQ.id - 1)) {
        setWrongAnswers([...wrongAnswers, currentQuestionIndex]);
      }
    }

    setSelectedOption(null);

    const nextIdx = currentQuestionIndex + 1;
    const maxIdx = isReviewMode ? wrongAnswers.length : QUESTIONS.length;

    if (nextIdx < maxIdx) {
      setCurrentQuestionIndex(nextIdx);
    } else {
      setShowResult(true);
    }
  };

  const startReview = () => {
    setIsReviewMode(true);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const resetQuiz = () => {
    setIsReviewMode(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setWrongAnswers([]);
    setSelectedOption(null);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-800">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-emerald-500">{isReviewMode ? '복습 완료' : `${score} / ${QUESTIONS.length}`}</div>
        <p className="text-gray-600">
          {score === QUESTIONS.length ? "완벽합니다! 스마트팜 마스터시군요! 🎉" : "조금 더 노력해볼까요?"}
        </p>
        
        <div className="flex gap-4">
          <button onClick={resetQuiz} className="px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold transition">
            처음부터 다시 풀기
          </button>
          {!isReviewMode && wrongAnswers.length > 0 && (
            <button onClick={startReview} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition shadow-lg">
              오답 노트 ({wrongAnswers.length} 문제)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          {isReviewMode ? '오답 복습 모드' : `난이도: ${displayQ.difficulty}`}
        </span>
        <span className="text-slate-400 font-mono text-sm">
          Q {currentQuestionIndex + 1} / {isReviewMode ? wrongAnswers.length : QUESTIONS.length}
        </span>
      </div>

      <div className="flex-grow">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
          {displayQ.question.split('\n').map((line, i) => <div key={i}>{line}</div>)}
        </h3>

        <div className="space-y-4">
          {displayQ.options.map((option, idx) => {
            let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium ";
            
            if (selectedOption === null) {
              btnClass += "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 bg-white";
            } else {
              if (idx === displayQ.correctAnswer) {
                btnClass += "border-emerald-500 bg-emerald-100 text-emerald-800";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-100 text-red-800";
              } else {
                btnClass += "border-slate-100 bg-slate-50 opacity-50";
              }
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleOptionClick(idx)}
                disabled={selectedOption !== null}
                className={btnClass}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {selectedOption !== null && (
        <div className="mt-6 animate-fade-in-up">
          <div className={`p-4 rounded-lg mb-4 ${selectedOption === displayQ.correctAnswer ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-bold mb-1">{selectedOption === displayQ.correctAnswer ? '정답입니다!' : '아쉽네요!'}</p>
            <p className="text-sm">{displayQ.explanation}</p>
          </div>
          <button 
            onClick={handleNext} 
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition transform active:scale-95"
          >
            {currentQuestionIndex + 1 === (isReviewMode ? wrongAnswers.length : QUESTIONS.length) ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;