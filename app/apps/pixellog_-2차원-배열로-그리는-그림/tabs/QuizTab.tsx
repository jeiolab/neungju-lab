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
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex flex-col text-left">
           <span className="text-xs text-slate-400 font-mono">SCORE</span>
           <span className="text-2xl font-bold text-yellow-400">{score}</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs text-slate-400 font-mono">STREAK</span>
           <div className="flex gap-1">
             {Array(streak).fill(0).map((_, i) => (
                <div key={i} className="w-2 h-6 bg-orange-500 rounded-sm animate-pulse" />
             ))}
             {streak === 0 && <span className="text-slate-600">-</span>}
           </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
        {question.grid && (
           <div className="mb-6 flex justify-center scale-90">
             <PixelGrid data={question.grid} readonly showLabels />
           </div>
        )}
        
        <h3 className="text-xl text-white font-bold mb-6">{question.question}</h3>
        
        <div className="grid grid-cols-1 gap-3">
          {question.options?.map((opt, idx) => {
            let btnClass = "p-4 rounded-lg border-2 text-left font-mono transition-all duration-200 ";
            if (selectedOption === null) {
                btnClass += "border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 text-slate-300";
            } else if (selectedOption === opt) {
                btnClass += isCorrect 
                  ? "border-green-500 bg-green-900/30 text-green-400" 
                  : "border-red-500 bg-red-900/30 text-red-400";
            } else {
                btnClass += "border-slate-800 bg-slate-800/50 text-slate-500 opacity-50";
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
          <div className={`mt-6 p-4 rounded-lg text-left animate-fade-in-up ${isCorrect ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'}`}>
            <div className="flex items-center gap-2 font-bold mb-2">
              {isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
              <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                {isCorrect ? '정답입니다!' : '오답입니다.'}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
            
            {!isLast && (
              <button 
                onClick={nextQuestion}
                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                다음 문제 <ArrowRight size={18} />
              </button>
            )}
            {isLast && (
                 <div className="mt-4 text-center text-yellow-400 font-bold">
                    퀴즈 완료! 최종 점수: {score}
                 </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};