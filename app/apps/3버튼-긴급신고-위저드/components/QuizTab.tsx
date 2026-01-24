import React, { useState } from 'react';
import { QuizQuestion, UserProfile } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { getProfile, saveProfile, updateXP, awardBadge } from '../services/storageService';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(getProfile());

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswer;
    const newProfile = { ...profile };
    newProfile.quizHistory[currentQ.id] = isCorrect;
    
    if (isCorrect) {
      updateXP(20); // 20 XP per correct answer
    }
    
    saveProfile(newProfile);
    setProfile(getProfile()); // Reload to get updated XP
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Check for mastery
      const allCorrect = QUIZ_QUESTIONS.every(q => profile.quizHistory[q.id]);
      if (allCorrect) {
        awardBadge("MASTER");
        setProfile(getProfile());
      }
    }
  };

  const getScore = () => {
    return Object.values(profile.quizHistory).filter(Boolean).length;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-800">지식 확인 (Quiz)</h2>
          <p className="text-sm text-gray-500">문제 {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-indigo-600">{getScore()} / {QUIZ_QUESTIONS.length}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">정답 수</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h3 className="text-xl font-medium text-gray-800 mb-6 leading-relaxed">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "border-gray-200 hover:bg-gray-50 text-gray-700";
              if (isAnswered) {
                if (idx === currentQ.correctAnswer) btnClass = "bg-green-100 border-green-500 text-green-800 font-medium";
                else if (idx === selectedOption) btnClass = "bg-red-100 border-red-500 text-red-800";
                else btnClass = "border-gray-100 text-gray-400 opacity-50";
              } else if (selectedOption === idx) {
                btnClass = "border-indigo-500 bg-indigo-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${btnClass} flex justify-between items-center`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-900 animate-fade-in">
              <p className="font-bold mb-1">해설:</p>
              <p>{currentQ.explanation}</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 flex justify-end">
             {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? (
                <button 
                  onClick={nextQuestion}
                  disabled={!isAnswered}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  다음 문제
                </button>
             ) : (
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <Award className="w-6 h-6" />
                  퀴즈 완료!
                </div>
             )}
        </div>
      </div>
      
      {profile.badges.includes("MASTER") && (
        <div className="mt-8 text-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
           <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
           <h4 className="text-xl font-bold text-yellow-800">IoT 마스터 뱃지 획득!</h4>
           <p className="text-yellow-700">모든 문제를 정확하게 맞추셨습니다.</p>
        </div>
      )}
    </div>
  );
};
