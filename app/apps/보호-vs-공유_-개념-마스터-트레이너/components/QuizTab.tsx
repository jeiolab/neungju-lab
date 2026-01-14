import React, { useState } from 'react';
import { QuizQuestion, WrongNote, Difficulty } from '../types';
import { QUIZZES } from '../constants';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface QuizTabProps {
  onCorrectAnswer: (xp: number) => void;
  onWrongAnswer: (note: WrongNote) => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ onCorrectAnswer, onWrongAnswer }) => {
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Filter questions based on difficulty
  const questions = QUIZZES.filter(q => q.difficulty === activeDifficulty);
  const currentQuestion = isRetrying 
    ? questions[currentQuestionIndex].retryQuestion! 
    : questions[currentQuestionIndex];

  const handleStart = (diff: Difficulty) => {
    setActiveDifficulty(diff);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    resetState();
  };

  const resetState = () => {
    setSelectedOption(null);
    setTextAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsRetrying(false);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    let correct = false;
    const q = currentQuestion;

    if (q.type === 'multiple-choice') {
      correct = selectedOption === q.correctAnswerIndex;
    } else if (q.type === 'short-answer') {
      // Check if answer contains at least one keyword
      correct = q.answerKeywords.some(k => textAnswer.includes(k));
    } else if (q.type === 'descriptive') {
      // Check if answer contains at least 2 keywords (simple rubric)
      const matchCount = q.answerKeywords.filter(k => textAnswer.includes(k)).length;
      correct = matchCount >= 1; // Lenient for demo, usually require 2
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setScore(s => s + 10); // Simple scoring
      onCorrectAnswer(isRetrying ? 5 : 10); // Less XP for retry
    } else {
      // Record wrong note
      const note: WrongNote = {
        id: Date.now().toString(),
        qid: q.id,
        conceptTitle: '정보보호 개념', // Simplified mapping
        question: q.question,
        userAnswer: q.type === 'multiple-choice' && q.options ? q.options[selectedOption || 0] : textAnswer,
        misconceptionType: '개념 미숙',
        difficulty: q.difficulty,
        timestamp: Date.now()
      };
      onWrongAnswer(note);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetState();
    } else {
      setQuizFinished(true);
    }
  };

  const handleRetry = () => {
    if (questions[currentQuestionIndex].retryQuestion) {
      setIsRetrying(true);
      // Reset input states but keep isSubmitted false to allow new submission
      setSelectedOption(null);
      setTextAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
    } else {
      // No retry question available, just go next
      handleNext();
    }
  };

  if (quizFinished) {
    return (
      <div className="max-w-md mx-auto text-center pt-10">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-indigo-100">
          <Award size={64} className="mx-auto text-indigo-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
          <p className="text-slate-600 mb-6">수고했어요! 오늘의 결과를 확인해보세요.</p>
          <div className="text-4xl font-black text-indigo-600 mb-8">
            {score} <span className="text-lg font-normal text-slate-400">/ {questions.length * 10}점</span>
          </div>
          <button 
            onClick={() => setActiveDifficulty(null)}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            난이도 선택으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!activeDifficulty) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">도전! 실전 퀴즈</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['쉬움', '보통', '도전'].map((diff) => (
            <button
              key={diff}
              onClick={() => handleStart(diff as Difficulty)}
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  diff === '쉬움' ? 'bg-green-100 text-green-600' :
                  diff === '보통' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-rose-100 text-rose-600'
                }`}>{diff}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600">Level {diff}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {diff === '쉬움' ? '기본 개념 확인' : diff === '보통' ? '응용 문제 풀이' : '심화 서술형 도전'}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4 text-sm text-slate-500 font-medium">
        <span>Level: {activeDifficulty}</span>
        <span>문제 {currentQuestionIndex + 1} / {questions.length}</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full mb-8">
        <div 
          className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mb-6">
        {isRetrying && (
          <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-3">
            <RotateCcw size={12} className="mr-1" /> 재도전 문제
          </div>
        )}
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQuestion?.question}
        </h3>

        {/* Input Area */}
        <div className="space-y-3">
          {currentQuestion?.type === 'multiple-choice' && currentQuestion.options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !isSubmitted && setSelectedOption(idx)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedOption === idx 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium ring-1 ring-indigo-600' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              } ${isSubmitted && currentQuestion.correctAnswerIndex === idx ? 'bg-green-100 border-green-500 !text-green-800' : ''}
                ${isSubmitted && selectedOption === idx && !isCorrect ? 'bg-rose-100 border-rose-500' : ''}
              `}
            >
              <span className="mr-3 font-bold text-slate-400">{idx + 1}.</span>
              {opt}
            </button>
          ))}

          {(currentQuestion?.type === 'short-answer' || currentQuestion?.type === 'descriptive') && (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={isSubmitted}
              placeholder={currentQuestion.type === 'short-answer' ? '핵심 단어를 입력하세요.' : '서술형 답안을 작성하세요.'}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none h-32 text-slate-800"
            />
          )}
        </div>
      </div>

      {/* Action / Feedback Area */}
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={(currentQuestion?.type === 'multiple-choice' && selectedOption === null) || (currentQuestion?.type !== 'multiple-choice' && !textAnswer.trim())}
          className="w-full py-4 bg-indigo-600 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:bg-indigo-700 transition-all"
        >
          정답 확인하기
        </button>
      ) : (
        <div className={`p-6 rounded-2xl border mb-6 ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'}`}>
          <div className="flex items-center mb-3">
            {isCorrect ? (
              <CheckCircle className="text-green-600 mr-2" size={24} />
            ) : (
              <XCircle className="text-rose-600 mr-2" size={24} />
            )}
            <span className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-rose-800'}`}>
              {isCorrect ? '정답입니다!' : '아쉽네요, 틀렸습니다.'}
            </span>
          </div>
          
          <div className="text-sm text-slate-700 mb-4 leading-relaxed">
            <span className="font-bold mr-1">해설:</span>
            {currentQuestion?.explanation}
          </div>

          {!isCorrect && !isRetrying && questions[currentQuestionIndex].retryQuestion && (
             <button
             onClick={handleRetry}
             className="w-full py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors mb-2"
           >
             <RotateCcw size={18} className="inline mr-2" />
             비슷한 문제로 재도전하기
           </button>
          )}

          <button
            onClick={handleNext}
            className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors flex items-center justify-center"
          >
            {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'} <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};