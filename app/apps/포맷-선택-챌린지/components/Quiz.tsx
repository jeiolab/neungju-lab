import React, { useState, useEffect } from 'react';
import { Mission, UserProgress } from '../types';
import { MISSIONS } from '../constants';
import { getRandomMissions } from '../utils';
import { Check, X, RefreshCw } from 'lucide-react';

interface QuizProps {
  progress: UserProgress;
  onComplete: (score: number, wrongIds: string[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ progress, onComplete }) => {
  const [questions, setQuestions] = useState<Mission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    // Strategy: Prioritize previously wrong questions (50%), then randoms (50%)
    const previousWrongs = MISSIONS.filter(m => progress.wrongNotes.includes(m.id));
    const others = MISSIONS.filter(m => !progress.wrongNotes.includes(m.id));
    
    let quizSet: Mission[] = [];
    const wrongCount = Math.min(previousWrongs.length, 5);
    
    if (wrongCount > 0) {
      quizSet = [...getRandomMissions(previousWrongs, wrongCount)];
    }
    
    const fillCount = 10 - quizSet.length;
    const fillers = getRandomMissions(others, fillCount);
    
    // Combine and shuffle again
    const finalSet = [...quizSet, ...fillers].sort(() => 0.5 - Math.random());
    setQuestions(finalSet);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (format: string) => {
    if (isAnswered) return;
    
    setSelectedFormat(format);
    setIsAnswered(true);

    const isCorrect = format === questions[currentIndex].correctFormat;
    if (isCorrect) {
      setScore(s => s + 10);
    } else {
      setWrongIds(prev => [...prev, questions[currentIndex].id]);
    }

    setTimeout(() => {
      if (currentIndex < 9) {
        setCurrentIndex(c => c + 1);
        setSelectedFormat(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (questions.length === 0) return <div className="p-10 text-center">퀴즈 생성 중...</div>;

  if (showResult) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in mt-10">
        <h2 className="text-2xl font-bold mb-4">퀴즈 결과</h2>
        <div className="text-5xl font-black text-indigo-600 mb-4">{score}점</div>
        <p className="text-slate-600 mb-8">
          {score >= 80 ? '훌륭합니다! 마스터 등급에 가까워졌어요.' : '오답노트를 확인하고 다시 도전해보세요!'}
        </p>
        <button
          onClick={() => onComplete(score, wrongIds)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 w-full"
        >
          완료 및 저장
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  // Generate options: correct answer + 3 random distractors from same category
  const options = Array.from(new Set([
    currentQ.correctFormat,
    ...getRandomMissions(MISSIONS.filter(m => m.category === currentQ.category && m.id !== currentQ.id), 3).map(m => m.correctFormat)
  ])).slice(0, 4).sort();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-slate-500">문제 {currentIndex + 1}/10</span>
        <span className="font-bold text-indigo-600">{score} 점</span>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 min-h-[200px] flex items-center justify-center flex-col">
        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold mb-3">{currentQ.category}</span>
        <p className="text-xl font-medium text-center leading-relaxed">{currentQ.scenario}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, idx) => {
          let btnClass = "p-4 rounded-lg border-2 font-medium text-left transition-all flex justify-between items-center ";
          if (isAnswered) {
             if (opt === currentQ.correctFormat) btnClass += "bg-green-100 border-green-500 text-green-700";
             else if (opt === selectedFormat) btnClass += "bg-red-100 border-red-500 text-red-700";
             else btnClass += "bg-slate-50 border-slate-200 opacity-50";
          } else {
             btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50";
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleAnswer(opt)}
              className={btnClass}
            >
              <span>{opt}</span>
              {isAnswered && opt === currentQ.correctFormat && <Check className="w-5 h-5" />}
              {isAnswered && opt === selectedFormat && opt !== currentQ.correctFormat && <X className="w-5 h-5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
