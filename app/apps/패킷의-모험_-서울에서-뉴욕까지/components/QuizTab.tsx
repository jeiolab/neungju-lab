import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, Trophy } from 'lucide-react';

const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "도메인 이름(www.google.com)을 IP 주소로 변환해주는 시스템은?",
    options: ["HTTP", "DNS", "FTP", "DHCP"],
    correctAnswer: 1,
    explanation: "DNS(Domain Name System)는 사람이 읽을 수 있는 도메인 이름을 컴퓨터가 이해하는 IP 주소로 변환합니다."
  },
  {
    id: 2,
    question: "데이터를 목적지까지 가장 효율적인 경로로 전달하는 장비는?",
    options: ["스위치(Switch)", "허브(Hub)", "라우터(Router)", "케이블"],
    correctAnswer: 2,
    explanation: "라우터는 네트워크 간의 경로를 설정하고 패킷을 최적의 경로로 전달하는 역할을 합니다."
  },
  {
    id: 3,
    question: "데이터 통신에서 정보를 작은 단위로 쪼갠 것을 무엇이라 하는가?",
    options: ["박스", "패킷(Packet)", "비트", "파일"],
    correctAnswer: 1,
    explanation: "네트워크 상에서 데이터는 '패킷'이라는 작은 단위로 분할되어 전송됩니다."
  },
  {
    id: 4,
    question: "웹사이트 주소 끝에 붙는 .kr, .com 등을 무엇이라 하는가?",
    options: ["최상위 도메인(TLD)", "서브 도메인", "프로토콜", "경로"],
    correctAnswer: 0,
    explanation: "Top-Level Domain(TLD)는 도메인 이름의 가장 마지막 부분을 말하며 국가(.kr)나 성격(.com)을 나타냅니다."
  },
  {
    id: 5,
    question: "IP 주소 중에서 '127.0.0.1'이 의미하는 것은?",
    options: ["구글 서버", "게이트웨이", "로컬호스트(내 컴퓨터)", "브로드캐스트"],
    correctAnswer: 2,
    explanation: "127.0.0.1은 자기 자신을 가리키는 루프백(Loopback) 주소입니다."
  },
    {
    id: 6,
    question: "OSI 7계층 중 물리적 연결을 담당하는 1계층은?",
    options: ["물리 계층", "전송 계층", "응용 계층", "네트워크 계층"],
    correctAnswer: 0,
    explanation: "물리 계층(Physical Layer)은 케이블, 전기 신호 등 하드웨어적인 전송을 담당합니다."
  },
  {
    id: 7,
    question: "IPv4 주소는 몇 비트로 구성되어 있나요?",
    options: ["32비트", "64비트", "128비트", "16비트"],
    correctAnswer: 0,
    explanation: "IPv4는 32비트 주소 체계를 사용하며, 약 43억 개의 주소를 가질 수 있습니다."
  },
  {
    id: 8,
    question: "다음 중 사설 IP 대역이 아닌 것은?",
    options: ["192.168.x.x", "10.x.x.x", "172.16.x.x", "8.8.8.8"],
    correctAnswer: 3,
    explanation: "8.8.8.8은 구글의 Public DNS 주소입니다. 나머지는 사설망에서 쓰는 대역입니다."
  },
  {
    id: 9,
    question: "인터넷 연결이 안 될 때, 연결 상태를 확인하기 위해 사용하는 명령어는?",
    options: ["ping", "cd", "ls", "mkdir"],
    correctAnswer: 0,
    explanation: "ping 명령어는 대상 호스트와의 네트워크 연결 상태와 응답 시간을 확인하는 도구입니다."
  },
  {
    id: 10,
    question: "HTTP 요청 시 '성공'을 의미하는 상태 코드는?",
    options: ["404", "500", "200", "403"],
    correctAnswer: 2,
    explanation: "200 OK는 요청이 성공적으로 처리되었음을 의미합니다."
  }
];

interface QuizTabProps {
  onScoreUpdate: (newScore: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === QUIZ_DATA[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_DATA.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      onScoreUpdate(score + (selectedOption === QUIZ_DATA[currentQuestionIndex].correctAnswer ? 1 : 0));
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
        <Trophy size={64} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-slate-900">퀴즈 완료!</h2>
        <p className="text-slate-600 mb-6">당신의 점수는 <span className="text-blue-600 font-bold text-xl">{score} / {QUIZ_DATA.length}</span> 입니다.</p>
        <button 
          onClick={resetQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors shadow-md"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  const currentQuestion = QUIZ_DATA[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex) / QUIZ_DATA.length) * 100}%` }}
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
        <h3 className="text-lg text-slate-500 mb-2">문제 {currentQuestion.id} / {QUIZ_DATA.length}</h3>
        <h2 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 rounded-lg border transition-all ";
            
            if (isAnswered) {
              if (index === currentQuestion.correctAnswer) {
                buttonClass += "bg-green-50 border-green-500 text-green-800 shadow-sm";
              } else if (index === selectedOption) {
                buttonClass += "bg-red-50 border-red-500 text-red-800 shadow-sm";
              } else {
                buttonClass += "bg-white border-slate-200 opacity-50 text-slate-400";
              }
            } else {
              buttonClass += "bg-white border-slate-200 hover:bg-slate-50 hover:border-blue-400 text-slate-700 shadow-sm";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && index === currentQuestion.correctAnswer && <Check size={20} />}
                  {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && <X size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {isAnswered && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-fadeIn">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <span className="font-bold text-blue-700 block mb-1">해설:</span>
              <p className="text-slate-700 text-sm">{currentQuestion.explanation}</p>
            </div>
            <button 
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
            >
              {currentQuestionIndex === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;