import React, { useState } from 'react';
import { QUIZ_POOL } from '../constants';
import { QuizQuestion, UserState, Difficulty, ConceptId } from '../types';
import { updateMastery, saveState, calculateLevel } from '../services/storageService';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  userState: UserState;
  onUpdateState: (newState: UserState) => void;
}

const QuizTab: React.FC<Props> = ({ userState, onUpdateState }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  
  // Select 5 random questions for a session
  const [sessionQuestions] = useState<QuizQuestion[]>(() => {
    return [...QUIZ_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
  });

  const currentQuestion = sessionQuestions[currentQuestionIndex];

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    // Update Score
    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
    }

    // Update Mastery & XP immediately
    const newMastery = updateMastery(
      userState.mastery, 
      currentQuestion.conceptId, 
      isCorrect, 
      currentQuestion.difficulty
    );

    const xpGain = isCorrect ? 10 : 2; // Participation XP
    const newXp = userState.xp + xpGain;
    const newLevel = calculateLevel(newXp);
    
    // Update State
    const newState: UserState = {
      ...userState,
      mastery: newMastery,
      xp: newXp,
      level: newLevel,
      wrongNotes: !isCorrect 
        ? [...userState.wrongNotes, currentQuestion.id]
        : userState.wrongNotes
    };
    
    onUpdateState(newState);
    saveState(newState);
  };

  const handleNext = () => {
    if (currentQuestionIndex < sessionQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRetry = () => {
    // Reload page or reset state logic (simplified here)
    window.location.reload(); 
  };

  if (quizComplete) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg mx-auto mt-10">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">퀴즈 완료!</h2>
        <p className="text-gray-600 mb-6">총 5문제 중 <span className="text-indigo-600 font-bold">{correctCount}문제</span>를 맞췄습니다.</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-500">획득 XP</p>
          <p className="text-2xl font-bold text-indigo-600">+{score + (correctCount * 2)} XP</p>
        </div>

        <button 
          onClick={handleRetry}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center mx-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
        <span>Question {currentQuestionIndex + 1} / {sessionQuestions.length}</span>
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
          currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {currentQuestion.difficulty}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              if (!isAnswered) {
                btnClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer";
              } else {
                if (idx === currentQuestion.correctAnswer) {
                  btnClass += "border-green-500 bg-green-50 text-green-800";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  btnClass += "border-gray-100 text-gray-400 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold border ${
                      isAnswered && idx === currentQuestion.correctAnswer ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
              <div className={`p-4 rounded-lg mb-4 ${
                selectedOption === currentQuestion.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-amber-50 text-amber-800'
              }`}>
                <p className="font-bold flex items-center mb-1">
                  {selectedOption === currentQuestion.correctAnswer ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                  {selectedOption === currentQuestion.correctAnswer ? '정답입니다!' : '아쉽네요!'}
                </p>
                <p className="text-sm mt-1">{currentQuestion.explanation}</p>
              </div>
              
              <button 
                onClick={handleNext}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow flex items-center justify-center"
              >
                {currentQuestionIndex < sessionQuestions.length - 1 ? '다음 문제' : '결과 보기'} <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;
