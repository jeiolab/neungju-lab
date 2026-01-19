import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "선형 회귀 식 'y = ax + b'에서 a가 의미하는 것은?",
    options: ["절편 (Intercept)", "기울기 (Slope)", "잔차 (Residual)", "평균 (Mean)"],
    correctAnswer: 1,
    explanation: "a는 기울기를 나타내며, x가 1 변할 때 y가 얼마나 변하는지를 의미합니다."
  },
  {
    id: 2,
    question: "데이터 포인트와 회귀선 사이의 수직 거리를 무엇이라고 하나요?",
    options: ["오차 (Error) 혹은 잔차 (Residual)", "거리 (Distance)", "분산 (Variance)", "표준편차 (Standard Deviation)"],
    correctAnswer: 0,
    explanation: "관측값과 예측값의 차이를 잔차(Residual)라고 합니다."
  },
  {
    id: 3,
    question: "상관관계 계수(r)가 1에 가까울수록 의미하는 바는?",
    options: ["관계가 없다", "강한 음의 상관관계", "강한 양의 상관관계", "데이터가 흩어져 있다"],
    correctAnswer: 2,
    explanation: "1에 가까울수록 강한 양의 상관관계(직선에 매우 가깝게 분포)를 의미합니다."
  },
  {
    id: 4,
    question: "공부 시간이 늘어날수록 성적이 떨어지는 그래프가 있다면, 기울기(a)의 부호는?",
    options: ["양수 (+)", "음수 (-)", "0", "알 수 없다"],
    correctAnswer: 1,
    explanation: "한 변수가 증가할 때 다른 변수가 감소하면 음의 상관관계이며, 기울기는 음수입니다."
  },
  {
    id: 5,
    question: "단순 선형 회귀 분석에 필요한 변수의 개수는?",
    options: ["독립변수 1개, 종속변수 1개", "독립변수 2개 이상", "종속변수 2개 이상", "변수 필요 없음"],
    correctAnswer: 0,
    explanation: "단순 선형 회귀는 하나의 독립변수(x)와 하나의 종속변수(y) 간의 관계를 다룹니다."
  },
  {
    id: 6,
    question: "MSE(Mean Squared Error)가 작을수록 모델의 성능은?",
    options: ["나쁘다", "좋다", "상관없다", "알 수 없다"],
    correctAnswer: 1,
    explanation: "MSE는 오차의 제곱의 평균이므로, 작을수록 예측이 실제값에 가깝다는 뜻입니다."
  },
  {
    id: 7,
    question: "다음 중 선형 회귀 분석을 사용하기 가장 적합한 예시는?",
    options: ["동전 던지기 확률", "키와 몸무게의 관계", "복권 당첨 번호 예측", "가위바위보 승률"],
    correctAnswer: 1,
    explanation: "키와 몸무게는 연속적인 수치형 데이터이며 뚜렷한 양의 상관관계를 가지므로 선형 회귀에 적합합니다."
  },
  {
    id: 8,
    question: "'y = 3x + 10'일 때, x가 0이면 y의 값은?",
    options: ["0", "3", "10", "13"],
    correctAnswer: 2,
    explanation: "x에 0을 대입하면 y = 3(0) + 10 = 10 입니다. 이것이 y절편입니다."
  },
  {
    id: 9,
    question: "데이터가 직선 형태가 아니라 곡선 형태를 띌 때 적합한 방법은?",
    options: ["무시하고 직선을 긋는다", "다항 회귀 (Polynomial Regression)", "데이터를 지운다", "평균만 구한다"],
    correctAnswer: 1,
    explanation: "데이터가 비선형(곡선) 패턴을 보이면 다항 회귀 등을 사용해야 합니다."
  },
  {
    id: 10,
    question: "y절편(b)이 의미하는 바는?",
    options: ["x가 증가할 때 y의 증가량", "x가 0일 때 y의 예측값", "데이터의 평균", "오차의 합"],
    correctAnswer: 1,
    explanation: "y절편은 직선이 y축과 만나는 지점으로, 독립변수 x가 0일 때의 값을 의미합니다."
  }
];

const QuizTab: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    const isCorrect = idx === QUESTIONS[currentQuestionIdx].correctAnswer;
    if (isCorrect) setScore(score + 1);
    
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 mb-4">
          {score} / {QUESTIONS.length}
        </div>
        <p className="text-xl text-gray-600">
          {score === 10 ? "완벽합니다! 데이터 마스터시군요! 🎓" : 
           score >= 7 ? "훌륭해요! 조금만 더 노력하면 마스터! 👍" : 
           "괜찮아요, 다시 한번 복습해볼까요? 🌱"}
        </p>
        
        <div className="bg-gray-50 p-6 rounded-xl text-left">
           <h3 className="font-bold text-gray-700 mb-4">오답 노트</h3>
           <ul className="space-y-2">
              {answers.map((isCorrect, idx) => (
                 !isCorrect && (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                       <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                       <span>{idx + 1}번: {QUESTIONS[idx].question}</span>
                    </li>
                 )
              ))}
              {score === 10 && <li className="text-gray-500">틀린 문제가 없습니다.</li>}
           </ul>
        </div>

        <button 
          onClick={handleRetry}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="w-5 h-5" /> 다시 도전하기
        </button>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentQuestionIdx];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
         <span className="font-bold text-gray-500">Question {currentQuestionIdx + 1} / {QUESTIONS.length}</span>
         <span className="text-indigo-600 font-bold">Score: {score}</span>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-8 leading-relaxed">
            {currentQ.question}
          </h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition font-medium relative ";
              if (isAnswered) {
                if (idx === currentQ.correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-800";
                else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-800";
                else btnClass += "border-gray-100 text-gray-400";
              } else {
                btnClass += "border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  {option}
                  {isAnswered && idx === currentQ.correctAnswer && <CheckCircle className="absolute right-4 top-4 w-5 h-5 text-green-600" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="absolute right-4 top-4 w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <div className="mt-8 animate-fade-in-up">
            <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800">
               <span className="font-bold">해설:</span> {currentQ.explanation}
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              {currentQuestionIdx === QUESTIONS.length - 1 ? "결과 보기" : "다음 문제"} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;