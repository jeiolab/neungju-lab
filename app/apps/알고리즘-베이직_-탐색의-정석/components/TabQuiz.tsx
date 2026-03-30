import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Question, Difficulty } from '../types';
import { QUIZ_DATA } from '../constants';

interface TabQuizProps {
  onQuizComplete: (score: number, wrongIds: number[]) => void;
  wrongAnswerIds: number[];
}

const TabQuiz: React.FC<TabQuizProps> = ({ onQuizComplete, wrongAnswerIds }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [viewMode, setViewMode] = useState<'quiz' | 'review'>('quiz');

  // Filter questions based on difficulty or review mode
  const getQuestions = () => {
    if (viewMode === 'review') {
        return QUIZ_DATA.filter(q => wrongAnswerIds.includes(q.id));
    }
    if (difficulty === 'all') return QUIZ_DATA;
    return QUIZ_DATA.filter(q => q.difficulty === difficulty);
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWrongIds(prev => [...prev, currentQuestion.id]);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      if (viewMode === 'quiz') {
          onQuizComplete(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0), wrongIds);
      }
    }
  };

  if (viewMode === 'review' && questions.length === 0) {
      return (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800">오답 노트가 비어있습니다!</h2>
              <p className="text-slate-600 mt-2">틀린 문제가 없거나 아직 퀴즈를 풀지 않았습니다.</p>
              <button onClick={() => setViewMode('quiz')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">퀴즈 풀러 가기</button>
          </div>
      )
  }

  if (isFinished) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-sm animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 완료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">
            {Math.round((score / questions.length) * 100)}점
        </div>
        <p className="text-slate-600 mb-8">
          총 {questions.length}문제 중 {score}문제를 맞혔습니다.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => {
                setIsFinished(false);
                setCurrentQuestionIndex(0);
                setScore(0);
                setWrongIds([]);
                setViewMode('quiz');
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            다시 풀기
          </button>
          {wrongIds.length > 0 && (
             <button
                onClick={() => {
                    setViewMode('review');
                    setIsFinished(false);
                    setCurrentQuestionIndex(0);
                    setScore(0);
                }}
                className="px-6 py-3 bg-rose-100 text-rose-700 rounded-lg font-bold hover:bg-rose-200 transition-colors"
             >
                 오답 노트 확인 ({wrongIds.length})
             </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
        {!isFinished && viewMode === 'quiz' && !showFeedback && currentQuestionIndex === 0 && (
            <div className="mb-6 flex justify-center space-x-2">
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
                    <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-1 rounded-full text-sm capitalize ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                    >
                        {d === 'all' ? '전체' : d}
                    </button>
                ))}
            </div>
        )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 min-h-[400px] flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div 
            className="bg-indigo-500 h-2 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
            }`}>
                {currentQuestion.difficulty}
            </span>
            <span className="text-slate-400 font-medium">
                {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3 mb-8">
            {currentQuestion.options ? (
                currentQuestion.options.map((option, idx) => (
                    <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => setSelectedAnswer(option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                            selectedAnswer === option 
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                                : 'border-slate-100 hover:border-indigo-200 text-slate-700'
                        } ${showFeedback ? 'cursor-default opacity-80' : ''}`}
                    >
                        {option}
                    </button>
                ))
            ) : (
                <input 
                    type="text" 
                    disabled={showFeedback}
                    placeholder="답을 입력하세요"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="w-full p-4 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-lg"
                />
            )}
          </div>

          {showFeedback && (
            <div className={`p-4 rounded-lg mb-6 flex items-start ${
                selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
                {selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                ) : (
                    <XCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
                )}
                <div>
                    <h4 className={`font-bold mb-1 ${
                        selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? 'text-green-800' : 'text-red-800'
                    }`}>
                        {selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? "정답입니다!" : "오답입니다."}
                    </h4>
                    <p className="text-slate-700 text-sm">{currentQuestion.explanation}</p>
                    {selectedAnswer.trim().toLowerCase() !== currentQuestion.correctAnswer.toLowerCase() && (
                         <p className="mt-2 font-bold text-slate-900">정답: {currentQuestion.correctAnswer}</p>
                    )}
                </div>
            </div>
          )}
          
          <div className="mt-auto">
            {!showFeedback ? (
                <button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                    정답 확인
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold text-lg hover:bg-slate-900 transition-colors"
                >
                    {currentQuestionIndex < questions.length - 1 ? "다음 문제" : "결과 보기"}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabQuiz;