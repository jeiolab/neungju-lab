import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { QuizQuestion, QuizDifficulty } from '../types';
import { AlertCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface Props {
  onCorrect: (questionId: number, difficulty: QuizDifficulty) => void;
  onWrong: (questionId: number) => void;
  wrongNotes: number[];
}

export default function Quiz({ onCorrect, onWrong, wrongNotes }: Props) {
  const [difficulty, setDifficulty] = useState<QuizDifficulty | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [essayAnswer, setEssayAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const filteredQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
  const currentQuestion = filteredQuestions[currentQIndex];

  const handleDifficultySelect = (diff: QuizDifficulty) => {
    setDifficulty(diff);
    setCurrentQIndex(0);
    setIsSubmitted(false);
    setSelectedAnswer('');
    setEssayAnswer('');
  };

  const checkAnswer = () => {
    setIsSubmitted(true);
    let isCorrect = false;

    if (currentQuestion.type === 'essay') {
      // Very basic length check for MVP, in real app, might use more sophisticated check
      isCorrect = essayAnswer.length > 10; 
    } else if (Array.isArray(currentQuestion.correctAnswer)) {
        // Simple string match for short answer
        isCorrect = currentQuestion.correctAnswer.some(ans => selectedAnswer.trim().includes(ans));
    } else {
        isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }

    if (isCorrect) {
      onCorrect(currentQuestion.id, currentQuestion.difficulty);
    } else {
      onWrong(currentQuestion.id);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < filteredQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setIsSubmitted(false);
      setSelectedAnswer('');
      setEssayAnswer('');
    } else {
      setDifficulty(null); // Return to menu
    }
  };

  if (!difficulty) {
    return (
      <div className="space-y-6 pb-20">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2">퀴즈 챌린지 🧐</h2>
            <p className="opacity-90">난이도를 선택하여 지식을 테스트해보세요!</p>
        </div>
        
        <div className="grid gap-4">
            <button onClick={() => handleDifficultySelect('easy')} className="p-6 bg-white rounded-xl border-2 border-green-100 hover:border-green-400 shadow-sm transition-all text-left">
                <div className="text-green-600 font-bold text-lg mb-1">쉬움 (Easy)</div>
                <p className="text-gray-500 text-sm">기본 개념을 확인하는 몸풀기 문제 4문항</p>
            </button>
            <button onClick={() => handleDifficultySelect('medium')} className="p-6 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-400 shadow-sm transition-all text-left">
                <div className="text-blue-600 font-bold text-lg mb-1">보통 (Medium)</div>
                <p className="text-gray-500 text-sm">실생활 적용 능력을 키우는 문제 4문항</p>
            </button>
            <button onClick={() => handleDifficultySelect('hard')} className="p-6 bg-white rounded-xl border-2 border-purple-100 hover:border-purple-400 shadow-sm transition-all text-left">
                <div className="text-purple-600 font-bold text-lg mb-1">도전 (Hard)</div>
                <p className="text-gray-500 text-sm">복합적인 사고가 필요한 심화 문제 2문항</p>
            </button>
        </div>

        {wrongNotes.length > 0 && (
            <div className="mt-8 bg-red-50 p-4 rounded-xl border border-red-100">
                <h3 className="font-bold text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    오답 노트 ({wrongNotes.length})
                </h3>
                <p className="text-sm text-red-600 mt-1">틀린 문제를 다시 확인하면 마스터리가 올라갑니다.</p>
            </div>
        )}
      </div>
    );
  }

  // Quiz Interface
  return (
    <div className="pb-20">
        <div className="mb-4 flex justify-between items-center">
            <button onClick={() => setDifficulty(null)} className="text-sm text-gray-500 underline">나가기</button>
            <div className="text-sm font-bold text-indigo-600">
                {currentQIndex + 1} / {filteredQuestions.length}
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-3">
                {currentQuestion.type === 'ox' ? 'O/X 퀴즈' : currentQuestion.type === 'essay' ? '서술형' : '객관식'}
            </span>
            <h3 className="text-lg font-bold text-gray-800 leading-snug">{currentQuestion.question}</h3>
        </div>

        <div className="space-y-4 mb-8">
            {currentQuestion.type === 'choice' && currentQuestion.options?.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => !isSubmitted && setSelectedAnswer(opt)}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                        selectedAnswer === opt 
                        ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    } ${isSubmitted && selectedAnswer !== opt ? 'opacity-50' : ''}`}
                    disabled={isSubmitted}
                >
                    {opt}
                </button>
            ))}

            {currentQuestion.type === 'ox' && (
                <div className="flex gap-4">
                     {['O', 'X'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => !isSubmitted && setSelectedAnswer(opt)}
                            className={`flex-1 p-8 rounded-xl font-black text-2xl transition-all ${
                                selectedAnswer === opt 
                                ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                                : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
                            }`}
                            disabled={isSubmitted}
                        >
                            {opt}
                        </button>
                     ))}
                </div>
            )}

            {currentQuestion.type === 'short' && (
                 <input 
                    type="text" 
                    value={selectedAnswer}
                    onChange={(e) => !isSubmitted && setSelectedAnswer(e.target.value)}
                    placeholder="정답 입력..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={isSubmitted}
                 />
            )}
             
             {currentQuestion.type === 'essay' && (
                 <textarea
                    value={essayAnswer}
                    onChange={(e) => !isSubmitted && setEssayAnswer(e.target.value)}
                    placeholder="생각을 서술해주세요 (10자 이상)"
                    rows={4}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    disabled={isSubmitted}
                 />
            )}
        </div>

        {!isSubmitted ? (
            <button 
                onClick={checkAnswer}
                disabled={(currentQuestion.type === 'essay' ? !essayAnswer : !selectedAnswer)}
                className="w-full py-4 bg-indigo-600 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
            >
                제출하기
            </button>
        ) : (
            <div className="animate-fade-in-up">
                <div className={`p-5 rounded-xl border-2 mb-4 ${
                    // Logic to display correct/wrong visually
                    (currentQuestion.type === 'essay' ? essayAnswer.length > 10 : 
                    (Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(selectedAnswer) : selectedAnswer === currentQuestion.correctAnswer))
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}>
                     <div className="flex items-center gap-2 font-bold mb-2">
                        {(currentQuestion.type === 'essay' ? essayAnswer.length > 10 : 
                        (Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(selectedAnswer) : selectedAnswer === currentQuestion.correctAnswer)) ? (
                            <><CheckCircle2 className="text-green-600"/> <span className="text-green-800">정답입니다!</span></>
                        ) : (
                             <><XCircle className="text-red-600"/> <span className="text-red-800">아쉬워요!</span></>
                        )}
                     </div>
                     <p className="text-sm font-bold text-gray-700 mb-1">왜 그럴까요?</p>
                     <p className="text-sm text-gray-600 mb-2">{currentQuestion.feedback.reason}</p>
                     <div className="bg-white/50 p-2 rounded text-xs text-gray-500">
                        <span className="font-bold">👉 교정:</span> {currentQuestion.feedback.correction}
                     </div>
                     {currentQuestion.type !== 'essay' && (
                        <div className="mt-2 text-sm font-bold">정답: {Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.join(', ') : currentQuestion.correctAnswer}</div>
                     )}
                </div>
                <button 
                    onClick={nextQuestion}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                    {currentQIndex < filteredQuestions.length - 1 ? '다음 문제' : '결과 보기'} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        )}
    </div>
  );
}