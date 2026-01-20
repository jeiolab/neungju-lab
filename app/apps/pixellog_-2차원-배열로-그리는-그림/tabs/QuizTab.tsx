import React, { useState, useEffect } from 'react';
import { PixelGrid } from '../components/PixelGrid';
import { GridData, QuizQuestion } from '../types';
import { Trophy, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const SAMPLE_GRID: GridData = [
  [0, 1, 0, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0]
];

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'value',
    question: "위 그림에서 grid[0][1]의 값은 무엇인가요?",
    grid: SAMPLE_GRID,
    answer: 1,
    options: ["0", "1", "null", "undefined"],
    explanation: "grid[0]은 첫 번째 행, 그 안의 [1]은 두 번째 칸입니다. 해당 위치는 검은색이므로 1입니다."
  },
  {
    id: 2,
    type: 'coordinate',
    question: "하트의 가장 아래쪽 뾰족한 끝부분(Tip)의 좌표는 무엇일까요?",
    grid: SAMPLE_GRID,
    answer: "4,2", // handled as custom check
    options: ["grid[3][2]", "grid[4][2]", "grid[2][4]", "grid[5][2]"],
    explanation: "가장 아래 행은 인덱스 4입니다. 가운데 열은 인덱스 2입니다. 따라서 grid[4][2]입니다."
  },
  {
    id: 3,
    type: 'slice',
    question: "grid[0] (첫 번째 행)의 데이터 전체는 무엇일까요?",
    grid: SAMPLE_GRID,
    answer: "[0,1,0,1,0]",
    options: ["[0,1,0,1,0]", "[1,1,1,1,1]", "[0,0,1,0,0]", "[0,1,1,1,0]"],
    explanation: "2차원 배열에서 행 하나를 선택하면 1차원 배열(리스트)이 반환됩니다."
  }
];

export const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const question = QUESTIONS[currentQIndex];
  const isLast = currentQIndex === QUESTIONS.length - 1;

  const handleAnswer = (option: string) => {
    if (selectedOption) return; // Prevent double guessing

    setSelectedOption(option);
    
    // Normalize logic for checking
    let correct = false;
    if (question.type === 'value') {
       correct = parseInt(option) === question.answer;
    } else if (question.type === 'coordinate') {
       correct = option === "grid[4][2]"; 
    } else if (question.type === 'slice') {
        const strAns = JSON.stringify(question.grid?.[0]).replace(/ /g,'');
        const strOpt = option.replace(/ /g,'');
        correct = strAns === strOpt;
    }

    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 100 + (streak * 10));
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (isLast) return;
    setCurrentQIndex(prev => prev + 1);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-2xl border-2 border-gray-200 shadow-lg">
        <div className="flex flex-col text-left">
           <span className="text-xs text-gray-500 font-mono font-semibold">SCORE</span>
           <span className="text-3xl font-bold text-yellow-500">{score}</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs text-gray-500 font-mono font-semibold">STREAK</span>
           <div className="flex gap-1">
             {Array(streak).fill(0).map((_, i) => (
                <div key={i} className="w-2 h-6 bg-orange-500 rounded-sm animate-pulse" />
             ))}
             {streak === 0 && <span className="text-gray-400">-</span>}
           </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-xl relative overflow-hidden">
        {question.grid && (
           <div className="mb-6 flex justify-center scale-90">
             <PixelGrid data={question.grid} readonly showLabels />
           </div>
        )}
        
        <h3 className="text-2xl text-gray-900 font-bold mb-8">{question.question}</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {question.options?.map((opt, idx) => {
            let btnClass = "p-5 rounded-xl border-2 text-left font-mono transition-all duration-200 font-semibold text-base ";
            if (selectedOption === null) {
                btnClass += "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 hover:shadow-md text-gray-800";
            } else if (selectedOption === opt) {
                btnClass += isCorrect 
                  ? "border-green-500 bg-green-50 text-green-700 shadow-lg" 
                  : "border-red-500 bg-red-50 text-red-700 shadow-lg";
            } else {
                btnClass += "border-gray-200 bg-gray-50 text-gray-400 opacity-60";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={selectedOption !== null}
                className={btnClass}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {selectedOption && (
          <div className={`mt-8 p-6 rounded-xl text-left animate-fade-in-up ${isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
            <div className="flex items-center gap-3 font-bold mb-3">
              {isCorrect ? <CheckCircle className="text-green-600" size={24} /> : <XCircle className="text-red-600" size={24} />}
              <span className={`text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '정답입니다!' : '오답입니다.'}
              </span>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">{question.explanation}</p>
            
            {!isLast && (
              <button 
                onClick={nextQuestion}
                className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                다음 문제 <ArrowRight size={20} />
              </button>
            )}
            {isLast && (
                 <div className="mt-6 text-center text-yellow-600 font-bold text-xl bg-yellow-50 py-4 rounded-xl border-2 border-yellow-300">
                    🎉 퀴즈 완료! 최종 점수: {score}
                 </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};