import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "버블 정렬에서 한 번의 전체 회전(Pass)이 끝나면 보장되는 것은?",
    options: ["가장 작은 값이 맨 앞에 온다.", "가장 큰 값이 맨 뒤에 온다.", "전체 배열이 정렬된다.", "중간 값이 결정된다."],
    correctAnswer: 1,
    explanation: "버블 정렬은 인접한 값을 비교하며 큰 값을 뒤로 보냅니다. 따라서 1회전 후에는 가장 큰 값이 맨 뒤에 위치하게 됩니다."
  },
  {
    id: 2,
    question: "다음 중 이미 데이터가 거의 정렬되어 있을 때 가장 효율적인 알고리즘은?",
    options: ["버블 정렬", "선택 정렬", "삽입 정렬", "모두 같다"],
    correctAnswer: 2,
    explanation: "삽입 정렬은 정렬된 부분과 비교하다가 자기 자리를 찾으면 바로 멈춥니다. 이미 정렬되어 있다면 비교만 하고 이동하지 않으므로 매우 빠릅니다."
  },
  {
    id: 3,
    question: "선택 정렬의 가장 큰 특징은?",
    options: ["교환 횟수가 적다.", "비교 횟수가 적다.", "메모리를 많이 사용한다.", "가장 빠르다."],
    correctAnswer: 0,
    explanation: "선택 정렬은 매 회전마다 최솟값을 찾기 위해 비교는 많이 하지만, 교환(Swap)은 딱 한 번만 일어납니다."
  },
  {
    id: 4,
    question: "데이터 [5, 3, 8, 1]을 오름차순으로 버블 정렬할 때, 첫 번째 교환은 어떤 숫자들 사이에서 일어날까요?",
    options: ["5와 3", "3과 8", "8과 1", "5와 1"],
    correctAnswer: 0,
    explanation: "맨 앞의 5와 그 다음 3을 비교합니다. 5가 더 크므로 바로 교환합니다."
  },
  {
    id: 5,
    question: "삽입 정렬 과정 중, 새로운 데이터를 끼워 넣기 위해 기존 데이터들은 어떻게 되나요?",
    options: ["사라진다.", "맨 뒤로 이동한다.", "한 칸씩 뒤로 밀려난다.", "랜덤하게 섞인다."],
    correctAnswer: 2,
    explanation: "삽입할 공간을 만들기 위해, 해당 위치보다 큰 값들은 오른쪽으로 한 칸씩 이동(Shift)합니다."
  }
];

const QuizTab: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === QUESTIONS[currentQuestionIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
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
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm h-96">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">
          {score} / {QUESTIONS.length}
        </div>
        <p className="text-slate-500 mb-8">
          {score === QUESTIONS.length ? "완벽합니다! 정렬 마스터시군요! 🎉" : "조금 더 연습해볼까요? 💪"}
        </p>
        <button 
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <RefreshCw size={20} /> 다시 풀기
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestionIdx];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-slate-400">Question {currentQuestionIdx + 1}/{QUESTIONS.length}</span>
        <span className="text-sm font-bold text-indigo-600">점수: {score}</span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 min-h-[300px] flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
              if (!isAnswered) {
                btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50";
              } else {
                if (idx === question.correctAnswer) {
                  btnClass += "border-green-500 bg-green-50 text-green-700 font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                   btnClass += "border-slate-100 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center">
                    <span>{idx + 1}. {option}</span>
                    {isAnswered && idx === question.correctAnswer && <CheckCircle2 className="text-green-600" size={20}/>}
                    {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="text-red-500" size={20}/>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-fadeIn">
            <div className="bg-slate-50 p-4 rounded-lg mb-4 text-slate-700 text-sm">
              <span className="font-bold block mb-1">💡 해설</span>
              {question.explanation}
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
            >
              {currentQuestionIdx < QUESTIONS.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;