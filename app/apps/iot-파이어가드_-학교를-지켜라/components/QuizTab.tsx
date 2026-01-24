import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, HelpCircle, RefreshCw } from 'lucide-react';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "교실에서 난로 옆에 '차동식 감지기'를 설치하면 오작동이 일어날 확률이 높다.",
    answer: true,
    explanation: "맞습니다! 난로 근처는 온도가 급격히 변할 수 있어, 온도 변화율을 감지하는 차동식보다는 정해진 온도에서 울리는 정온식이 적합할 수 있습니다. (물론 화기 근처엔 열감지기 설치에 주의해야 합니다!)"
  },
  {
    id: 2,
    question: "화재 경보 시스템에서 '출력 장치'에 해당하는 것은?",
    options: ["온도 센서", "CPU (제어 장치)", "사이렌/경광등", "전원 공급 장치"],
    answer: "사이렌/경광등",
    explanation: "센서는 입력, CPU는 처리, 사이렌은 결과를 알리는 출력을 담당합니다."
  },
  {
    id: 3,
    question: "시뮬레이션에서 임계값(Threshold)을 너무 낮게 설정하면(예: 10도) 어떤 문제가 생길까요?",
    options: ["화재를 감지하지 못한다", "아무 일도 일어나지 않는다", "평소에도 경보가 울린다(오작동)", "센서가 고장난다"],
    answer: "평소에도 경보가 울린다(오작동)",
    explanation: "실내 온도가 보통 20도 이상이므로, 임계값이 10도라면 항상 화재로 인식하여 '양치기 소년' 효과를 낳습니다."
  }
];

const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQ = questions[currentQIndex];

  const handleAnswer = (answer: string | boolean) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQ.answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-200">
          <div className="mb-6">
            {score === questions.length ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 size={48} />
              </div>
            ) : (
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600">
                <HelpCircle size={48} />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
          <p className="text-slate-600 mb-6">
            총 {questions.length}문제 중 <span className="text-blue-600 font-bold text-xl">{score}</span>문제를 맞혔습니다.
          </p>
          <button 
            onClick={resetQuiz}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <RefreshCw size={20} /> 다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-slate-400">Question {currentQIndex + 1}/{questions.length}</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
              {currentQ.options ? '객관식' : 'OX 퀴즈'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {!currentQ.options ? (
              // OX Options
              <div className="flex gap-4">
                <button
                  onClick={() => !selectedAnswer && handleAnswer(true)}
                  disabled={selectedAnswer !== null}
                  className={`flex-1 py-8 rounded-xl text-2xl font-black border-2 transition-all ${
                    selectedAnswer === true 
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600')
                      : 'border-slate-200 hover:border-blue-400 text-slate-700'
                  }`}
                >
                  O
                </button>
                <button
                  onClick={() => !selectedAnswer && handleAnswer(false)}
                  disabled={selectedAnswer !== null}
                  className={`flex-1 py-8 rounded-xl text-2xl font-black border-2 transition-all ${
                    selectedAnswer === false
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600')
                      : 'border-slate-200 hover:border-blue-400 text-slate-700'
                  }`}
                >
                  X
                </button>
              </div>
            ) : (
              // Multiple Choice
              currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !selectedAnswer && handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === option
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                      : 'border-slate-100 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  {option}
                </button>
              ))
            )}
          </div>

          {/* Explanation Area */}
          {selectedAnswer !== null && (
            <div className={`mt-8 p-6 rounded-xl animate-fade-in ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? <CheckCircle2 className="text-green-600" /> : <XCircle className="text-red-600" />}
                <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? "정답입니다!" : "아쉽네요!"}
                </span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {currentQ.explanation}
              </p>
              <button 
                onClick={nextQuestion}
                className="mt-4 bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors ml-auto block"
              >
                {currentQIndex < questions.length - 1 ? "다음 문제" : "결과 보기"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;
