'use client';

import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "다음 중 가장 안전한 비밀번호는?",
    options: ["password123", "iloveyou", "K!mch1Jjigae@2024", "12345678"],
    correctAnswer: 2,
    explanation: "대소문자, 숫자, 특수문자가 섞이고 길이가 긴 비밀번호가 안전합니다."
  },
  {
    id: 2,
    question: "2단계 인증(2FA)에 대한 설명으로 틀린 것은?",
    options: ["보안을 한 층 더 강화한다.", "비밀번호를 몰라도 로그인할 수 있게 해준다.", "OTP, 문자 인증 등이 있다.", "비밀번호가 유출되어도 방어할 수 있다."],
    correctAnswer: 1,
    explanation: "2단계 인증은 비밀번호를 입력한 '후'에 추가로 인증하는 절차입니다. 비밀번호는 여전히 필요합니다."
  },
  {
    id: 3,
    question: "PC방이나 공용 컴퓨터 사용 후 해야 할 행동은?",
    options: ["그냥 끄고 나온다.", "로그아웃하고 사용 기록을 삭제한다.", "바탕화면에 파일을 저장해둔다.", "비밀번호 저장을 누른다."],
    correctAnswer: 1,
    explanation: "공용 PC에서는 반드시 로그아웃하고, 브라우저 종료 시 쿠키/기록 삭제 옵션을 사용하는 것이 좋습니다."
  },
  {
    id: 4,
    question: "출처를 알 수 없는 이메일의 첨부파일은 어떻게 해야 할까요?",
    options: ["궁금하니까 열어본다.", "친구에게 전달한다.", "백신 검사를 하거나 삭제한다.", "답장을 보내 물어본다."],
    correctAnswer: 2,
    explanation: "랜섬웨어나 바이러스일 가능성이 높으므로 절대 열지 말고 삭제하거나 검사해야 합니다."
  },
  {
    id: 5,
    question: "보이스피싱 예방을 위해 올바른 행동은?",
    options: ["검찰청이라고 하면 무조건 돈을 보낸다.", "출처 불명의 앱 설치 요구를 거절한다.", "가족의 급한 연락에는 확인 없이 송금한다.", "비밀번호를 알려준다."],
    correctAnswer: 1,
    explanation: "공공기관은 절대 앱 설치나 자금 이체를 요구하지 않습니다."
  },
  {
    id: 6,
    question: "HTTPS에서 'S'는 무엇을 의미할까요?",
    options: ["Speed (속도)", "Secure (보안)", "Service (서비스)", "Super (최고)"],
    correctAnswer: 1,
    explanation: "HTTPS는 통신 내용을 암호화하여 전송하므로 중간에 가로채더라도 내용을 알 수 없습니다."
  },
  {
    id: 7,
    question: "운영체제 업데이트 알림이 뜨면 어떻게 해야 할까요?",
    options: ["즉시 업데이트한다.", "계속 미룬다.", "알림을 끈다.", "무시한다."],
    correctAnswer: 0,
    explanation: "업데이트에는 보안 취약점을 해결하는 패치가 포함되어 있어 즉시 하는 것이 좋습니다."
  },
  {
    id: 8,
    question: "다음 중 개인정보에 해당하지 않는 것은?",
    options: ["주민등록번호", "오늘 날씨", "지문 정보", "핸드폰 번호"],
    correctAnswer: 1,
    explanation: "오늘 날씨는 누구에게나 공개된 일반 정보이며 개인을 식별할 수 없습니다."
  },
  {
    id: 9,
    question: "스마트폰 분실 시 가장 먼저 해야 할 일은?",
    options: ["새 폰을 산다.", "통신사에 분실 신고를 하고 정지시킨다.", "SNS에 올린다.", "친구에게 자랑한다."],
    correctAnswer: 1,
    explanation: "분실 신고를 통해 기기 사용을 막고 소액결제 등의 피해를 예방해야 합니다."
  },
  {
    id: 10,
    question: "공용 와이파이(Wi-Fi) 사용 시 주의점은?",
    options: ["금융 거래 등 중요 업무는 자제한다.", "비밀번호 없는 와이파이가 최고다.", "항상 켜둔다.", "아무거나 연결한다."],
    correctAnswer: 0,
    explanation: "공용 와이파이는 해킹 위험이 있으므로 금융 거래나 로그인이 필요한 작업은 LTE/5G 데이터를 쓰는 것이 안전합니다."
  }
];

const Quiz: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    if (idx === QUESTIONS[currentQuestionIdx].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in py-10">
        <h2 className="text-3xl font-bold text-blue-900">퀴즈 결과</h2>
        <div className="text-6xl font-black text-blue-600 mb-4">
          {score} / {QUESTIONS.length}
        </div>
        <p className="text-xl text-slate-700">
          {score === 10 ? "완벽합니다! 당신은 보안 전문가 수준이네요!" : 
           score >= 7 ? "훌륭해요! 조금만 더 공부하면 완벽해질 거예요." : 
           "조금 더 보안에 관심을 가져주세요. 다시 도전해볼까요?"}
        </p>
        <button 
          onClick={restartQuiz}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <RefreshCcw size={20} /> 다시 풀기
        </button>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentQuestionIdx];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-slate-500 text-sm font-mono">
        <span>Question {currentQuestionIdx + 1} / {QUESTIONS.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let baseClass = "w-full p-4 text-left rounded-lg border transition-all flex justify-between items-center group ";
            if (!isAnswered) {
              baseClass += "hover:bg-blue-50 hover:border-blue-300 cursor-pointer border-slate-200";
            } else {
              if (idx === currentQ.correctAnswer) {
                baseClass += "bg-emerald-100 border-emerald-500 text-emerald-800";
              } else if (idx === selectedAnswer) {
                baseClass += "bg-red-100 border-red-500 text-red-800";
              } else {
                baseClass += "bg-slate-50 border-slate-200 opacity-50";
              }
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={baseClass}
              >
                <span>{option}</span>
                {isAnswered && idx === currentQ.correctAnswer && <CheckCircle size={20} className="text-emerald-600" />}
                {isAnswered && idx === selectedAnswer && idx !== currentQ.correctAnswer && <XCircle size={20} className="text-red-600" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
            <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
              <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded">해설</span>
            </h4>
            <p className="text-blue-800 text-sm">{currentQ.explanation}</p>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={nextQuestion}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                다음 문제 <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;