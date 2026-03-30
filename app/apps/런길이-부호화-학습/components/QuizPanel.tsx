import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "다음 중 RLE(런길이 부호화)로 압축했을 때 가장 효과적인 그림은?",
    options: [
      { id: 'a', text: "체크무늬 셔츠 (색이 계속 바뀜)", isCorrect: false },
      { id: 'b', text: "푸른 하늘 사진 (같은 색이 넓게 펼쳐짐)", isCorrect: true },
      { id: 'c', text: "모래사장 확대 사진 (점들이 불규칙함)", isCorrect: false },
      { id: 'd', text: "노이즈 화면 (지지직 거림)", isCorrect: false },
    ],
    explanation: "RLE는 '연속된 데이터'가 많을수록 압축률이 높습니다. 하늘처럼 같은 색이 길게 이어지는 이미지가 가장 적합해요!"
  },
  {
    id: 2,
    text: "데이터 'WWBBWW'를 RLE로 변환하면?",
    options: [
      { id: 'a', text: "2W 2B 2W", isCorrect: true },
      { id: 'b', text: "6WB", isCorrect: false },
      { id: 'c', text: "W2 B2 W2", isCorrect: false },
      { id: 'd', text: "W B W", isCorrect: false },
    ],
    explanation: "W가 2개, B가 2개, 다시 W가 2개이므로 '2W 2B 2W'가 됩니다."
  },
  {
    id: 3,
    text: "RLE 압축의 단점으로 올바른 것은?",
    options: [
      { id: 'a', text: "데이터 손실이 발생한다.", isCorrect: false },
      { id: 'b', text: "계산이 너무 복잡하다.", isCorrect: false },
      { id: 'c', text: "반복 패턴이 없으면 용량이 더 커질 수 있다.", isCorrect: true },
      { id: 'd', text: "흑백 이미지만 처리가 가능하다.", isCorrect: false },
    ],
    explanation: "'WBWBWB' 같은 경우 '1W1B1W1B1W1B'가 되어 글자 수가 6개에서 12개로 오히려 2배 늘어날 수 있습니다."
  }
];

export const QuizPanel: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = QUESTIONS[currentQIndex];

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
        <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="mb-6"
        >
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mx-auto">
                {score === QUESTIONS.length ? '🎉' : '👏'}
            </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
        <p className="text-slate-600 mb-8">
           {QUESTIONS.length}문제 중 <span className="text-indigo-600 font-bold">{score}</span>개를 맞췄습니다.
        </p>
        <button 
            onClick={restartQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
        >
            <RefreshCw size={20} />
            다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6 flex justify-between items-center text-sm text-slate-500">
        <span>Question {currentQIndex + 1} / {QUESTIONS.length}</span>
        <span>Score: {score}</span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
        {currentQuestion.text}
      </h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option) => {
          let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all relative ";
          if (isAnswered) {
             if (option.isCorrect) btnClass += "border-green-500 bg-green-50 text-green-800";
             else if (selectedOption === option.id) btnClass += "border-red-500 bg-red-50 text-red-800";
             else btnClass += "border-slate-100 text-slate-400";
          } else {
             btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-slate-50";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id, option.isCorrect)}
              disabled={isAnswered}
              className={btnClass}
            >
              <span className="font-semibold mr-2">{option.id.toUpperCase()}.</span>
              {option.text}
              {isAnswered && option.isCorrect && (
                  <CheckCircle2 className="absolute right-4 top-4 text-green-600" size={20} />
              )}
              {isAnswered && selectedOption === option.id && !option.isCorrect && (
                  <XCircle className="absolute right-4 top-4 text-red-500" size={20} />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100"
        >
            <p className="font-bold text-indigo-900 mb-1">해설</p>
            <p className="text-indigo-700 text-sm">{currentQuestion.explanation}</p>
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                    다음 문제
                </button>
            </div>
        </motion.div>
      )}
    </div>
  );
};