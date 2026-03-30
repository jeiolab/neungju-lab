import React, { useState } from 'react';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { QuizQuestion } from '../types';

interface ExamProps {
  onEarnSubscribers: (amount: number) => void;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다른 프레임의 도움 없이 스스로 완전한 이미지 정보를 가지고 있는 프레임은 무엇인가요?",
    options: ["P-프레임", "B-프레임", "I-프레임", "Z-프레임"],
    correctAnswer: 2,
    explanation: "I-프레임(Intra-coded)은 독립적인 이미지입니다. 탐색(Seek)의 기준이 되며 용량이 가장 큽니다."
  },
  {
    id: 2,
    question: "화면 전환이 매우 빠른 게임 방송(움직임 많음)을 할 때 P-프레임은 어떻게 되나요?",
    options: [
      "움직임 때문에 흐릿해져서 용량이 줄어든다.",
      "변화하는 픽셀이 많아져서 용량이 커진다.",
      "아예 사라진다.",
      "자동으로 B-프레임으로 변한다."
    ],
    correctAnswer: 1,
    explanation: "P-프레임은 '변화된 부분'을 저장합니다. 화면이 많이 움직이면 변화된 부분이 많으므로 용량이 I-프레임만큼 커질 수 있습니다."
  },
  {
    id: 3,
    question: "내 인터넷 업로드 속도(5000 kbps)보다 더 높은 비트레이트(6000 kbps)로 방송을 송출하면 무슨 일이 생길까요?",
    options: [
      "화질이 획기적으로 좋아진다.",
      "시청자들에게 버퍼링과 렉이 발생한다.",
      "FPS가 자동으로 올라간다.",
      "컴퓨터가 폭발한다."
    ],
    correctAnswer: 1,
    explanation: "인터넷 파이프 크기(대역폭)보다 더 많은 물(데이터)을 억지로 넣으면 병목 현상이 발생하여 버퍼링이 생깁니다."
  },
  {
    id: 4,
    question: "호환성이 좋아 현재 웹 스트리밍의 표준으로 쓰이는 가장 대중적인 코덱은 무엇인가요?",
    options: ["H.264", "H.269", "MP3", "JPEG"],
    correctAnswer: 0,
    explanation: "H.264 (AVC)는 거의 모든 기기와 브라우저에서 지원하므로 스트리밍 표준으로 쓰입니다."
  }
];

const Exam: React.FC<ExamProps> = ({ onEarnSubscribers }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(idx);
    
    const correct = idx === QUESTIONS[currentQuestionIdx].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
      onEarnSubscribers(100); // Earn subs per correct answer immediately
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setCompleted(true);
    }
  };

  const resetExam = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setCompleted(false);
    setScore(0);
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-t-8 border-yellow-400">
          <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">시험 종료!</h2>
          <p className="text-xl text-gray-600 mb-6">{QUESTIONS.length}문제 중 {score}점 획득</p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-green-800 font-bold">획득한 구독자: +{score * 100}명</p>
          </div>
          <button 
            onClick={resetExam}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            재시험 보기
          </button>
        </div>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentQuestionIdx];

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2">
          <div 
            className="bg-indigo-600 h-2 transition-all duration-300" 
            style={{ width: `${((currentQuestionIdx) / QUESTIONS.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <h2 className="text-sm uppercase tracking-wide text-indigo-500 font-bold mb-2">문제 {currentQuestionIdx + 1} / {QUESTIONS.length}</h2>
          <h3 className="text-xl font-bold text-gray-900 mb-6">{currentQ.question}</h3>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              if (selectedOption === null) {
                btnClass += "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer";
              } else if (idx === currentQ.correctAnswer) {
                btnClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                btnClass += "border-gray-200 text-gray-400 opacity-50";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {selectedOption !== null && idx === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {selectedOption === idx && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in-up">
              <p className="font-bold text-slate-700 mb-1">해설:</p>
              <p className="text-slate-600">{currentQ.explanation}</p>
              <div className="mt-4 text-right">
                <button 
                  onClick={handleNext}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                >
                  {currentQuestionIdx === QUESTIONS.length - 1 ? "결과 보기" : "다음 문제"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam;