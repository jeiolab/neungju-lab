import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "로그인 기록(Log)을 저장하는 프로그램을 만들려고 합니다. 가장 적절한 파일 모드는?",
    options: ["'w' (Write)", "'r' (Read)", "'a' (Append)", "'wb' (Write Binary)"],
    correctAnswer: 2,
    explanation: "로그는 과거의 기록을 유지하면서 새로운 기록을 쌓아야 하므로, 기존 내용을 지우지 않고 덧붙이는 'a' (append) 모드가 적합합니다."
  },
  {
    id: 2,
    question: "다음 코드 실행 후 'data.txt'의 최종 내용은?\n\nf = open('data.txt', 'w')\nf.write('Apple')\nf.close()\n\nf = open('data.txt', 'w')\nf.write('Banana')\nf.close()",
    options: ["Apple", "Banana", "AppleBanana", "Apple\nBanana"],
    correctAnswer: 1,
    explanation: "두 번째 open('data.txt', 'w')가 실행될 때 기존 내용('Apple')은 모두 삭제되고 'Banana'만 남습니다."
  },
  {
    id: 3,
    question: "파일을 자동으로 닫아주어 close()를 생략할 수 있게 해주는 구문은?",
    options: ["for ... in", "if ... else", "try ... except", "with ... as"],
    correctAnswer: 3,
    explanation: "with open(...) as f: 블록을 사용하면 블록을 벗어날 때 자동으로 close()가 호출됩니다."
  },
  {
      id: 4,
      question: "파일이 없을 때 'r' 모드로 열면 발생하는 에러는?",
      options: ["IndexError", "FileNotFoundError", "KeyError", "SyntaxError"],
      correctAnswer: 1,
      explanation: "읽기 모드('r')는 파일이 존재해야만 열 수 있습니다. 파일이 없으면 FileNotFoundError가 발생합니다."
  }
];

const QuizView: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(questions.length); // End state
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
  };

  // Completion Screen
  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-800 rounded-xl border border-slate-700">
        <h2 className="text-3xl font-bold text-emerald-400 mb-4">Quiz Completed!</h2>
        <p className="text-xl text-white mb-6">
          당신의 점수는 <span className="text-emerald-400 font-bold text-2xl">{score} / {questions.length}</span> 입니다.
        </p>
        <div className="mb-8">
            {score === questions.length ? (
                <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-lg border border-emerald-500/30">
                    완벽합니다! 파일 입출력 마스터 배지를 받을 자격이 충분합니다.
                </div>
            ) : (
                <div className="bg-slate-700 p-4 rounded-lg">
                    조금 더 복습해보면 완벽해질 거예요!
                </div>
            )}
        </div>
        <button 
          onClick={handleRestart}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>다시 도전하기</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-xl font-bold text-white">보안 지식 점검</h2>
        <span className="text-sm text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
      </div>

      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-medium text-slate-200 mb-6 whitespace-pre-wrap">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                showResult
                  ? idx === currentQuestion.correctAnswer
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : idx === selectedOption
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  : 'bg-slate-900 border-slate-700 hover:bg-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && idx === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                {showResult && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-6 pt-6 border-t border-slate-700 animate-in slide-in-from-bottom-2 fade-in">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600 mb-4">
              <p className="text-sm text-slate-300"><span className="font-bold text-emerald-400">해설:</span> {currentQuestion.explanation}</p>
            </div>
            <button 
              onClick={handleNext}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              <span>다음 문제</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
