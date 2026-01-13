import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface TabQuizProps {
  onQuizComplete: (score: number) => void;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "AI가 학습 데이터의 편향을 그대로 배워, 특정 집단에 차별적인 결과를 내놓는 현상은?",
    options: ["알고리즘 투명성", "알고리즘 편향성", "특이점", "튜링 테스트"],
    correctIndex: 1,
    explanation: "알고리즘 편향성(Bias)은 AI가 편향된 데이터로 학습하여 공정하지 못한 판단을 내리는 문제입니다."
  },
  {
    id: 2,
    question: "AI의 판단 근거와 과정을 사람이 이해할 수 있도록 설명 가능해야 한다는 원칙은?",
    options: ["책임성", "안전성", "투명성", "창의성"],
    correctIndex: 2,
    explanation: "투명성(Transparency)은 AI의 결정 과정이 블랙박스처럼 감춰져 있지 않고 설명 가능해야(XAI) 함을 의미합니다."
  },
  {
    id: 3,
    question: "자율주행차 사고 시 책임 소재를 가리기 위해 필요한 AI 윤리 원칙은?",
    options: ["책임성", "다양성", "효율성", "초지능"],
    correctIndex: 0,
    explanation: "책임성(Accountability)은 AI 시스템으로 인한 결과에 대해 누가 법적, 도덕적 책임을 질 것인지 명확히 하는 것입니다."
  },
  {
    id: 4,
    question: "다음 중 '강인공지능(Strong AI)'에 대한 설명으로 가장 적절한 것은?",
    options: ["바둑이나 체스만 잘하는 AI", "인간처럼 자아를 가지고 모든 지적 업무를 수행하는 AI", "현재 우리가 스마트폰에서 쓰는 AI", "계산기 프로그램"],
    correctIndex: 1,
    explanation: "강인공지능(AGI)은 인간과 대등하거나 그 이상의 지능을 가지고 자율적인 사고가 가능한 AI를 말합니다."
  },
  {
    id: 5,
    question: "EU 인공지능 법(AI Act)에서 '사회적 점수' 매기기 등 인권 침해 소지가 큰 AI는 어떤 등급인가?",
    options: ["저위험(Low Risk)", "제한적 위험(Limited Risk)", "고위험(High Risk)", "허용 불가능(Unacceptable Risk)"],
    correctIndex: 3,
    explanation: "인간의 행동을 조종하거나 기본권을 침해하는 AI는 '허용 불가능한 위험'으로 분류되어 사용이 금지됩니다."
  }
];

export const TabQuiz: React.FC<TabQuizProps> = ({ onQuizComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    
    if (idx === QUESTIONS[currentIndex].correctIndex) {
      setScore(prev => prev + 20); // 5 questions, 100 points total
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
      onQuizComplete(score + (selectedOption === QUESTIONS[currentIndex].correctIndex ? 20 : 0));
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-fade-in text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-law-blue mb-6">{score}점</div>
        <p className="text-gray-600 mb-8">
          {score === 100 ? "완벽합니다! AI 윤리 마스터시군요." : 
           score >= 60 ? "훌륭합니다! 조금만 더 공부하면 전문가가 될 수 있어요." : 
           "다시 한 번 '이론 개념' 탭을 읽어보시는 건 어떨까요?"}
        </p>
        <button 
          onClick={resetQuiz}
          className="flex items-center gap-2 px-6 py-3 bg-law-gold text-law-blue font-bold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          <RefreshCw size={20} /> 다시 풀기
        </button>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentIndex];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">윤리 개념 확인 퀴즈</h2>
        <span className="text-sm font-bold text-gray-500">{currentIndex + 1} / {QUESTIONS.length}</span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-law-blue">
        <h3 className="text-xl font-bold text-gray-800 mb-8 leading-snug">
          Q. {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full p-4 text-left rounded-lg border-2 transition-all font-medium ";
            
            if (showResult) {
              if (idx === currentQ.correctIndex) {
                btnClass += "bg-green-50 border-green-500 text-green-700";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-700";
              } else {
                btnClass += "border-gray-100 text-gray-400";
              }
            } else {
              btnClass += "border-gray-200 hover:border-law-blue hover:bg-slate-50 text-gray-700";
            }

            return (
              <button 
                key={idx}
                disabled={showResult}
                onClick={() => handleOptionClick(idx)}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {showResult && idx === currentQ.correctIndex && <CheckCircle className="text-green-600" size={20} />}
                  {showResult && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="text-red-600" size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-900 mb-6">
              <span className="font-bold mr-2">해설:</span>
              {currentQ.explanation}
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-3 bg-law-blue text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              {currentIndex < QUESTIONS.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
