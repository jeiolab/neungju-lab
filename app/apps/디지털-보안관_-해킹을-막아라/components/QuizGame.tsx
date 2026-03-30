import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, Award } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 가장 안전한 비밀번호는 무엇인가요?",
    options: ["12345678", "password123!", "dh8#2!kL9$ (랜덤)", "mybirthday1999"],
    correctIndex: 2,
    explanation: "특수문자, 대소문자, 숫자가 혼합된 랜덤 문자열이 가장 강력합니다."
  },
  {
    id: 2,
    question: "피싱(Phishing) 사이트를 구별하는 가장 좋은 방법은?",
    options: ["디자인이 예쁜지 확인한다", "URL(주소)을 꼼꼼히 확인한다", "팝업창을 닫는다", "친구에게 물어본다"],
    correctIndex: 1,
    explanation: "해커들은 naver.com 대신 naver-login.com 처럼 교묘한 URL을 사용합니다."
  },
  {
    id: 3,
    question: "2단계 인증(2FA)의 장점은?",
    options: ["로그인이 더 빨라진다", "비밀번호를 몰라도 로그인할 수 있다", "비밀번호가 털려도 계정을 보호할 수 있다", "데이터 사용량을 줄여준다"],
    correctIndex: 2,
    explanation: "비밀번호 외에 추가적인 인증 수단(문자, 앱 등)이 있어야 하므로 훨씬 안전합니다."
  },
  {
    id: 4,
    question: "랜섬웨어(Ransomware)에 감염되면 발생하는 일은?",
    options: ["컴퓨터 속도가 빨라진다", "파일이 암호화되고 돈을 요구한다", "화면이 거꾸로 뒤집힌다", "마우스가 움직이지 않는다"],
    correctIndex: 1,
    explanation: "랜섬웨어는 파일을 인질로 잡고 몸값(Ransom)을 요구하는 악성 프로그램입니다."
  },
  {
    id: 5,
    question: "공용 PC 사용 후 반드시 해야 할 행동은?",
    options: ["모니터 끄기", "바탕화면 정리", "로그아웃", "의자 정리"],
    correctIndex: 2,
    explanation: "로그아웃하지 않으면 다음 사용자가 내 계정에 접근할 수 있습니다."
  }
];

export const QuizGame: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === QUESTIONS[currentQIndex].correctIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md mx-auto text-center">
        <Award className="w-20 h-20 text-yellow-400 mb-6 animate-bounce" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">퀴즈 완료!</h2>
        <p className="text-slate-500 mb-6">수고하셨습니다. 당신의 점수는?</p>
        <div className="text-6xl font-black text-blue-600 mb-6">{score} / {QUESTIONS.length}</div>
        <button 
          onClick={() => {
            setIsFinished(false);
            setCurrentQIndex(0);
            setScore(0);
            setSelectedOption(null);
            setShowResult(false);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentQIndex];

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="flex justify-between items-center mb-6 text-sm text-slate-500 font-mono">
        <span>QUESTION {currentQIndex + 1} / {QUESTIONS.length}</span>
        <span>SCORE: {score}</span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl min-h-[400px] flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 flex-1">
          {question.options.map((option, idx) => {
            let buttonClass = "w-full text-left p-4 rounded-xl border transition-all text-sm font-medium ";
            
            if (selectedOption === null) {
              buttonClass += "bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700";
            } else {
               if (idx === question.correctIndex) {
                 buttonClass += "bg-green-100 border-green-500 text-green-900";
               } else if (idx === selectedOption) {
                 buttonClass += "bg-red-100 border-red-500 text-red-900";
               } else {
                 buttonClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
               }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedOption !== null}
                className={buttonClass}
              >
                <div className="flex justify-between items-center">
                   <span>{option}</span>
                   {selectedOption !== null && idx === question.correctIndex && <Check className="w-5 h-5 text-green-600" />}
                   {selectedOption !== null && idx === selectedOption && idx !== question.correctIndex && <X className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2">
            <p className={`font-bold mb-2 ${selectedOption === question.correctIndex ? 'text-green-600' : 'text-red-600'}`}>
               {selectedOption === question.correctIndex ? "정답입니다!" : "오답입니다."}
            </p>
            <p className="text-sm text-slate-600 mb-4">{question.explanation}</p>
            <button 
              onClick={nextQuestion}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
            >
              {currentQIndex < QUESTIONS.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};