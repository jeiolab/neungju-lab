import React, { useState } from 'react';
import { QuizQuestion, UserProgress } from '../types';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { saveProgress } from '../services/storageService';

interface QuizProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onGoToWizard: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ progress, onUpdateProgress, onGoToWizard }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]);

  const question = QUIZ_DATA[currentIdx];

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setSelectedOption(optionIdx);
    const correct = optionIdx === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    } else {
      setMistakes((prev) => [...prev, question.relatedTopic]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
    const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / QUIZ_DATA.length) * 100); // Fix score calc logic
    // Actually score state is behind by one render when called here if relying on state directly without adjustment,
    // so let's just recalculate properly.
    
    // Recalculating score simply:
    // The score state updates correctly before this finish call if nextQuestion is used properly? 
    // Ah, wait. Inside handleAnswer I updated score.
    // If I answer last question, I click "Next" (or "Finish").
    
    const finalCalculatedScore = (score / QUIZ_DATA.length) * 100;

    const newBadges = [...progress.badges];
    if (finalCalculatedScore === 100 && !newBadges.includes('마스터')) {
      newBadges.push('마스터');
    } else if (finalCalculatedScore >= 80 && !newBadges.includes('우등생')) {
      newBadges.push('우등생');
    }

    const uniqueMistakes = Array.from(new Set([...progress.quizMistakes, ...mistakes]));

    onUpdateProgress({
      ...progress,
      quizScore: Math.max(progress.quizScore, finalCalculatedScore),
      badges: newBadges,
      quizMistakes: uniqueMistakes,
    });
    saveProgress({
        ...progress,
        quizScore: Math.max(progress.quizScore, finalCalculatedScore),
        badges: newBadges,
        quizMistakes: uniqueMistakes,
    });
  };

  const retry = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
    setMistakes([]);
  };

  if (showResult) {
    const finalPercentage = Math.round((score / QUIZ_DATA.length) * 100);
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{finalPercentage}점</div>
        
        <div className="space-y-4 mb-8">
          {finalPercentage >= 80 ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg">
              <p className="font-bold">훌륭해요! 공유 전문가시군요.</p>
              <p>이제 헌장을 만들러 가볼까요?</p>
            </div>
          ) : (
            <div className="p-4 bg-orange-50 text-orange-700 rounded-lg">
              <p className="font-bold">조금 더 공부가 필요해요.</p>
              <p>틀린 문제를 바탕으로 헌장 내용을 보완해보세요.</p>
            </div>
          )}
        </div>

        {mistakes.length > 0 && (
           <div className="mb-8 text-left">
             <h3 className="font-bold text-slate-700 mb-2">집중 점검이 필요한 단계:</h3>
             <div className="flex flex-wrap gap-2">
               {Array.from(new Set(mistakes)).map(m => (
                 <span key={m} className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                   {/* Map topic code to readable name if needed, assuming simple mapping */}
                   {m === 'permissions' ? '권한 설정' : m === 'security' ? '보안' : m === 'copyright' ? '저작권' : '기타'}
                 </span>
               ))}
             </div>
           </div>
        )}

        <div className="flex justify-center gap-4">
          <button onClick={retry} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition">
            <RefreshCw className="w-5 h-5" /> 다시 풀기
          </button>
          <button onClick={onGoToWizard} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
            헌장 만들러 가기 <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-slate-500">Q.{currentIdx + 1} / {QUIZ_DATA.length}</span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
          {question.relatedTopic.toUpperCase()}
        </span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{question.question}</h2>
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedOption === null 
                  ? 'border-slate-100 hover:border-indigo-300 hover:bg-indigo-50'
                  : selectedOption === idx
                    ? idx === question.correctIndex
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : idx === question.correctIndex
                      ? 'border-green-500 bg-green-50' // Show correct answer even if wrong selected
                      : 'border-slate-100 opacity-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {selectedOption !== null && idx === question.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {selectedOption === idx && idx !== question.correctIndex && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedOption !== null && (
        <div className="animate-fade-in-up">
          <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            <p className="font-bold flex items-center gap-2 mb-1">
              {isCorrect ? '정답입니다!' : '아쉽네요!'}
            </p>
            <p className="text-sm">{question.explanation}</p>
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
          >
            {currentIdx === QUIZ_DATA.length - 1 ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
};