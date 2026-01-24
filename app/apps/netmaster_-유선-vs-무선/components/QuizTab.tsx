import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { UserStats } from '../types';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface QuizTabProps {
  stats: UserStats;
  onQuizComplete: (score: number, wrongIds: string[]) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ stats, onQuizComplete }) => {
  const [mode, setMode] = useState<'intro' | 'quiz' | 'review'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sessionWrongIds, setSessionWrongIds] = useState<string[]>([]);

  // If Review Mode, filter questions
  const questionsToPlay = mode === 'review' 
    ? QUIZ_DATA.filter(q => stats.wrongQuestionIds.includes(q.id))
    : QUIZ_DATA;

  const currentQuestion = questionsToPlay[currentQIndex];

  const handleStart = () => {
    setMode('quiz');
    setCurrentQIndex(0);
    setScore(0);
    setSessionWrongIds([]);
    setShowExplanation(false);
    setSelectedOption(null);
  };

  const handleStartReview = () => {
    setMode('review');
    setCurrentQIndex(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedOption(null);
  };

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setSelectedOption(idx);
    const isCorrect = idx === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setSessionWrongIds(prev => [...prev, currentQuestion.id]);
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQIndex < questionsToPlay.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      // End of quiz
      onQuizComplete(score, sessionWrongIds);
      setMode('intro'); // Reset to intro (stats will be updated in parent)
    }
  };

  // --- Intro View ---
  if (mode === 'intro') {
    return (
      <div className="p-8 flex flex-col h-full items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">실전 퀴즈 테스트</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full mb-6">
          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            현재 내 실력
          </h3>
          <p className="text-gray-600">총 문제: {QUIZ_DATA.length}문제</p>
          <p className="text-gray-600">오답 노트: <span className="text-red-500 font-bold">{stats.wrongQuestionIds.length}</span>문제</p>
        </div>

        <button 
          onClick={handleStart}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 mb-4 hover:bg-blue-700 transition"
        >
          모든 문제 풀기
        </button>

        {stats.wrongQuestionIds.length > 0 && (
          <button 
            onClick={handleStartReview}
            className="w-full bg-orange-100 text-orange-700 py-4 rounded-xl font-bold border border-orange-200 hover:bg-orange-200 transition"
          >
            틀린 문제만 다시 풀기 ({stats.wrongQuestionIds.length})
          </button>
        )}
      </div>
    );
  }

  // --- Empty Review Case ---
  if (!currentQuestion) {
    return (
      <div className="p-8 text-center">
        <p>복습할 문제가 없거나 오류가 발생했습니다.</p>
        <button onClick={() => setMode('intro')} className="text-blue-500 mt-4 underline">돌아가기</button>
      </div>
    );
  }

  // --- Quiz View ---
  return (
    <div className="p-4 max-w-2xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-gray-400">
          Question {currentQIndex + 1} / {questionsToPlay.length}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-bold
          ${currentQuestion.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
            currentQuestion.difficulty === '보통' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
          {currentQuestion.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-8 leading-relaxed">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          let stateStyle = "bg-white border-gray-200 hover:bg-gray-50";
          if (selectedOption !== null) {
            if (idx === currentQuestion.correctAnswer) stateStyle = "bg-green-100 border-green-500 text-green-800";
            else if (idx === selectedOption) stateStyle = "bg-red-100 border-red-500 text-red-800";
            else stateStyle = "bg-gray-50 border-gray-100 text-gray-400";
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${stateStyle}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedOption !== null && idx === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl animate-fade-in border border-blue-100">
           <div className="flex gap-2 items-start mb-2">
             <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
             <p className="font-bold text-blue-800">선생님 해설</p>
           </div>
           <p className="text-blue-900 text-sm leading-relaxed mb-4 pl-7">
             {currentQuestion.explanation}
           </p>
           <button 
             onClick={handleNext}
             className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
           >
             {currentQIndex < questionsToPlay.length - 1 ? '다음 문제' : '결과 보기'}
           </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;