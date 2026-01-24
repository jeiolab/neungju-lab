import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, AlertTriangle, RefreshCcw } from 'lucide-react';

interface TabQuizProps {
  onQuizComplete: (score: number, wrongIds: number[]) => void;
  previousScore: number;
}

const TabQuiz: React.FC<TabQuizProps> = ({ onQuizComplete, previousScore }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showMistakeNote, setShowMistakeNote] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleAnswer = (answer: string | number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === question.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [...prev, question.id]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onQuizComplete(score + (selectedAnswer === question.correctAnswer ? 1 : 0), wrongAnswers);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setWrongAnswers([]);
    setIsFinished(false);
    setShowMistakeNote(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg">
        <div className="mb-6">
          {score === QUIZ_QUESTIONS.length ? (
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-4xl">🏆</span>
            </div>
          ) : (
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-4xl">📝</span>
            </div>
          )}
          <h2 className="text-2xl font-bold text-slate-800">탐정 자격 시험 종료!</h2>
          <p className="text-lg text-slate-600 mt-2">
            당신의 점수는 <span className="font-bold text-indigo-600 text-2xl">{score}</span> / {QUIZ_QUESTIONS.length} 점 입니다.
          </p>
          {score === QUIZ_QUESTIONS.length && (
            <p className="text-green-600 font-bold mt-2 animate-bounce">축하합니다! '수석 탐정' 배지를 획득했습니다!</p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={restartQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            <RefreshCcw className="w-5 h-5" /> 다시 풀기
          </button>
          
          {wrongAnswers.length > 0 && (
            <button 
              onClick={() => setShowMistakeNote(!showMistakeNote)}
              className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
            >
              <AlertTriangle className="w-5 h-5" /> 오답 노트 확인 ({wrongAnswers.length})
            </button>
          )}
        </div>

        {showMistakeNote && (
          <div className="mt-8 text-left space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-700 border-b pb-2">❌ 틀린 문제 다시보기</h3>
            {QUIZ_QUESTIONS.filter(q => wrongAnswers.includes(q.id)).map((q, idx) => (
              <div key={q.id} className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="font-bold text-slate-800 mb-2">Q. {q.question}</p>
                <p className="text-sm text-slate-600 bg-white p-2 rounded">
                  <span className="font-bold text-green-600">정답: {typeof q.correctAnswer === 'number' && q.options ? q.options[q.correctAnswer] : q.correctAnswer}</span>
                  <br/>
                  <span className="text-slate-500 mt-1 block">💡 {q.explanation}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-slate-500">
          Question {currentIdx + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <div className="h-2 flex-1 mx-4 bg-slate-200 rounded-full">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 min-h-[400px] flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
          {question.question}
        </h3>

        <div className="flex-1 space-y-3">
          {question.type === 'OX' ? (
            <div className="flex gap-4 h-32">
              {['O', 'X'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={`flex-1 text-4xl font-bold rounded-xl border-2 transition-all flex items-center justify-center
                    ${selectedAnswer === option 
                      ? (option === question.correctAnswer ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700')
                      : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-400'
                    }
                    ${isAnswered && option !== selectedAnswer ? 'opacity-50' : ''}
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            question.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium
                  ${selectedAnswer === idx
                    ? (idx === question.correctAnswer ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800')
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700'
                  }
                   ${isAnswered && idx !== selectedAnswer && idx === question.correctAnswer ? 'border-green-300 bg-green-50' : ''}
                `}
              >
                {idx + 1}. {option}
              </button>
            ))
          )}
        </div>

        {isAnswered && (
          <div className={`mt-6 p-4 rounded-lg animate-fade-in ${selectedAnswer === question.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-start gap-2">
              {selectedAnswer === question.correctAnswer ? <CheckCircle className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
              <div>
                <p className="font-bold text-lg mb-1">{selectedAnswer === question.correctAnswer ? '정답입니다!' : '틀렸습니다.'}</p>
                <p className="text-sm">{question.explanation}</p>
              </div>
            </div>
            <button 
              onClick={nextQuestion}
              className="mt-4 w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition"
            >
              {currentIdx === QUIZ_QUESTIONS.length - 1 ? '결과 보기' : '다음 문제'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;