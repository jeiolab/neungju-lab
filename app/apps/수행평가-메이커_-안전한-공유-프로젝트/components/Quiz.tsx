import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCw, ChevronRight } from 'lucide-react';

export const Quiz: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    setShowResult(true);
  };

  const nextQuestion = () => {
    const isCorrect = selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].correctIndex;
    if (isCorrect) setScore(score + 1);
    else setWrongAnswers([...wrongAnswers, QUIZ_QUESTIONS[currentQuestionIdx].id]);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setWrongAnswers([]);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 mb-4">{score * 10}점</div>
        <p className="text-xl text-gray-600 mb-8">
          {score === 10 ? "완벽합니다! 정보 보호 전문가시군요!" : "수고하셨습니다! 틀린 문제를 복습해보세요."}
        </p>

        {wrongAnswers.length > 0 && (
          <div className="bg-red-50 p-6 rounded-xl text-left mb-8 border border-red-100">
            <h3 className="font-bold text-red-800 mb-4 text-lg">오답 노트</h3>
            <ul className="space-y-4">
              {wrongAnswers.map(qid => {
                const q = QUIZ_QUESTIONS.find(q => q.id === qid);
                if (!q) return null;
                return (
                  <li key={qid} className="border-b border-red-200 pb-2 last:border-0">
                    <p className="font-semibold text-gray-800 mb-1">Q. {q.question}</p>
                    <p className="text-sm text-red-600 bg-white p-2 rounded inline-block">💡 {q.explanation}</p>
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                      관련 개념: {q.category === 'privacy' ? '개인정보' : q.category === 'copyright' ? '저작권' : q.category === 'security' ? '보안' : '균형'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button 
          onClick={resetQuiz}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 flex items-center mx-auto transition-colors"
        >
          <RefreshCw className="mr-2" /> 다시 도전하기
        </button>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">보안 퀴즈 ({currentQuestionIdx + 1}/{QUIZ_QUESTIONS.length})</h2>
        <span className="text-sm font-mono text-gray-500">현재 점수: {score}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIdx) / QUIZ_QUESTIONS.length) * 100}%` }}></div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg min-h-[400px] flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-6 leading-relaxed">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showResult && handleAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all
                  ${showResult 
                    ? idx === question.correctIndex 
                      ? 'border-green-500 bg-green-50 text-green-900' 
                      : idx === selectedOption 
                        ? 'border-red-500 bg-red-50 text-red-900' 
                        : 'border-gray-100 text-gray-400'
                    : selectedOption === idx 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3
                    ${showResult && idx === question.correctIndex ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 text-gray-500'}
                  `}>
                    {showResult && idx === question.correctIndex ? <CheckCircle size={14}/> : showResult && idx === selectedOption ? <XCircle size={14}/> : <span className="text-xs">{idx + 1}</span>}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showResult && (
          <div className="mt-6 pt-6 border-t animate-fade-in">
            <div className={`p-4 rounded-lg mb-4 ${selectedOption === question.correctIndex ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-bold flex items-center mb-1">
                {selectedOption === question.correctIndex ? <CheckCircle className="mr-2" size={18}/> : <XCircle className="mr-2" size={18}/>}
                {selectedOption === question.correctIndex ? '정답입니다!' : '오답입니다.'}
              </p>
              <p className="text-sm opacity-90">{question.explanation}</p>
            </div>
            <button 
              onClick={nextQuestion}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center items-center"
            >
              다음 문제 <ChevronRight className="ml-1" size={18}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};