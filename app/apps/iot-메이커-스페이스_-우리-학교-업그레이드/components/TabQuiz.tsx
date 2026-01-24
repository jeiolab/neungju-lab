import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, Trophy, RefreshCw } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "도서관의 빈 자리가 있는지 확인하려면 어떤 센서가 가장 적절할까요?",
    options: ["온도 센서", "압력 센서", "미세먼지 센서", "자이로 센서"],
    answer: 1, // 0-indexed
    explanation: "의자에 사람이 앉았는지 확인하려면 무게를 감지하는 '압력 센서'가 적합합니다."
  },
  {
    id: 2,
    question: "밤에 사람이 지나갈 때만 복도 불을 켜고 싶습니다. 필요한 센서는?",
    options: ["조도 센서", "인체 감지(PIR) 센서", "소리 센서", "가스 센서"],
    answer: 1,
    explanation: "사람의 움직임(적외선)을 감지하는 PIR 센서가 효율적입니다."
  },
  {
    id: 3,
    question: "급식실이 너무 시끄러우면 '조용히 하세요' 경고등을 켜려 합니다. 입력 장치는?",
    options: ["소리 센서", "스피커", "LED", "온도 센서"],
    answer: 0,
    explanation: "소리의 크기를 입력받아야 하므로 '소리 센서'가 필요합니다. 스피커와 LED는 출력 장치입니다."
  },
  {
    id: 4,
    question: "화분에 물을 줄 시기를 알고 싶습니다. 어떤 센서를 써야 할까요?",
    options: ["토양 수분 센서", "수위 센서", "기울기 센서", "터치 센서"],
    answer: 0,
    explanation: "흙 속의 수분량을 측정하는 토양 수분 센서가 필요합니다."
  }
];

const TabQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return; // Prevent double click

    setSelectedOption(optionIdx);
    const correct = optionIdx === QUESTIONS[currentIdx].answer;
    setIsCorrect(correct);
    if (correct) setScore((prev) => prev + 1);

    // Wait for explanation then move next
    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 2500);
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-sm border border-slate-100 text-center animate-scale-in">
        <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 종료!</h2>
        <p className="text-xl text-slate-600 mb-6">당신의 점수는 <span className="text-indigo-600 font-bold">{score} / {QUESTIONS.length}</span> 점입니다.</p>
        <button 
          onClick={restartQuiz}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw size={20} /> 다시 도전하기
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentIdx];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
          <span className="font-bold">센서 스피드 퀴즈</span>
          <span className="text-sm bg-indigo-800 px-3 py-1 rounded-full">Q{currentIdx + 1} / {QUESTIONS.length}</span>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-snug">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                  selectedOption === null 
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    : idx === question.answer 
                      ? 'bg-green-100 text-green-800 ring-2 ring-green-400'
                      : selectedOption === idx
                        ? 'bg-red-100 text-red-800 ring-2 ring-red-400'
                        : 'bg-slate-50 text-slate-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {selectedOption !== null && idx === question.answer && <Check size={20} />}
                  {selectedOption !== null && selectedOption === idx && idx !== question.answer && <X size={20} />}
                </div>
              </button>
            ))}
          </div>

          {selectedOption !== null && (
            <div className={`mt-6 p-4 rounded-lg animate-fade-in ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-bold mb-1">{isCorrect ? '정답입니다!' : '오답입니다.'}</p>
              <p className="text-sm">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabQuiz;