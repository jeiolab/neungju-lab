import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, HelpCircle, Trophy } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "공유기를 보호하기 위해 금속 상자 안에 넣는 것이 좋다.",
    answer: 'X',
    explanation: "금속은 전파를 차단하는 '패러데이 새장' 역할을 합니다. 와이파이 신호가 거의 잡히지 않게 됩니다."
  },
  {
    id: 2,
    question: "5GHz 와이파이는 무조건 2.4GHz보다 좋다.",
    answer: 'X',
    explanation: "속도는 빠르지만 도달 거리가 짧고 벽 투과율이 낮습니다. 넓은 집이나 장애물이 많은 곳에서는 2.4GHz가 더 유리할 수 있습니다."
  },
  {
    id: 3,
    question: "SSID(네트워크 이름)를 숨기면 해커로부터 완전히 안전하다.",
    answer: 'X',
    explanation: "해커는 숨겨진 네트워크도 쉽게 찾을 수 있습니다. 진정한 보안은 WPA2/3와 같은 강력한 암호화 방식입니다."
  },
  {
    id: 4,
    question: "공공 장소 무료 와이파이를 사용할 때 VPN을 쓰지 않고 뱅킹을 하는 것은 위험하다.",
    answer: 'O',
    explanation: "공공 와이파이는 암호화되지 않은 경우가 많아 해커가 데이터를 가로챌 수 있습니다(중간자 공격)."
  }
];

const QuizTab: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'O' | 'X' | null>(null);

  const handleAnswer = (ans: 'O' | 'X') => {
    setSelectedAnswer(ans);
    setShowResult(true);
    if (ans === QUESTIONS[currentIndex].answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      // Finished
      setShowResult(true); // Keep showing result of last question
      // Maybe show summary screen
    }
  };

  const resetQuiz = () => {
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
  };

  const isFinished = currentIndex === QUESTIONS.length - 1 && showResult;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <HelpCircle /> 네트워크 OX 퀴즈
            </h2>
            <div className="text-indigo-200 font-mono">
                {currentIndex + 1} / {QUESTIONS.length}
            </div>
        </div>

        <div className="p-8 text-center">
            {!isFinished ? (
                 <>
                    <h3 className="text-xl font-medium text-slate-800 mb-8 min-h-[80px] flex items-center justify-center break-keep">
                        {QUESTIONS[currentIndex].question}
                    </h3>
                    
                    {!showResult ? (
                        <div className="flex gap-6 justify-center">
                            <button 
                                onClick={() => handleAnswer('O')}
                                className="w-32 h-32 rounded-full border-4 border-green-500 text-green-600 text-5xl font-bold hover:bg-green-50 transition-colors flex items-center justify-center"
                            >
                                O
                            </button>
                            <button 
                                onClick={() => handleAnswer('X')}
                                className="w-32 h-32 rounded-full border-4 border-red-500 text-red-600 text-5xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center"
                            >
                                X
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className={`text-4xl font-bold mb-4 ${selectedAnswer === QUESTIONS[currentIndex].answer ? 'text-green-500' : 'text-red-500'}`}>
                                {selectedAnswer === QUESTIONS[currentIndex].answer ? "정답입니다!" : "오답입니다!"}
                            </div>
                            <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-lg break-keep">
                                {QUESTIONS[currentIndex].explanation}
                            </p>
                            <button 
                                onClick={nextQuestion}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105"
                            >
                                다음 문제
                            </button>
                        </div>
                    )}
                 </>
            ) : (
                <div className="py-10">
                    <Trophy className="mx-auto text-yellow-400 w-24 h-24 mb-4" />
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">퀴즈 완료!</h3>
                    <p className="text-lg text-slate-600 mb-8">
                        총 {QUESTIONS.length}문제 중 <span className="text-indigo-600 font-bold">{score}</span>점을 획득했습니다.
                    </p>
                    <button 
                        onClick={resetQuiz}
                        className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900"
                    >
                        다시 도전하기
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;