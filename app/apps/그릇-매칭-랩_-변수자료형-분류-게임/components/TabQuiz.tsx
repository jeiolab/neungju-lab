import React, { useState } from 'react';
import { QuizQuestion, UserStats, DataType, WrongNote } from '../types';
import { QUIZ_POOL } from '../constants';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  stats: UserStats;
  updateStats: (s: UserStats) => void;
}

const TabQuiz: React.FC<Props> = ({ stats, updateStats }) => {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'normal' | 'hard'>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [quizSet, setQuizSet] = useState<QuizQuestion[]>([]);

  const startQuiz = () => {
    let filtered = QUIZ_POOL;
    if (difficulty !== 'all') {
      filtered = QUIZ_POOL.filter(q => q.difficulty === difficulty);
    }
    // Shuffle and pick 5 for quick session
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuizSet(shuffled);
    setCurrentQuestionIndex(0);
    setSessionScore(0);
    setQuizStarted(true);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = quizSet[currentQuestionIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      setSessionScore(sessionScore + 1);
      updateStats({ ...stats, xp: stats.xp + 10 }); // 10XP per correct answer
    } else {
      // Add to Wrong Notes
      const note: WrongNote = {
        id: Date.now().toString(),
        questionId: currentQ.id,
        questionText: currentQ.text,
        userAnswer: option,
        correctAnswer: currentQ.correctAnswer,
        concept: currentQ.type,
        timestamp: Date.now()
      };
      updateStats({ 
        ...stats, 
        xp: Math.max(0, stats.xp - 2),
        wrongNotes: [note, ...stats.wrongNotes].slice(0, 50) // Keep last 50
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizSet.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      // End of quiz
      setQuizStarted(false);
      alert(`퀴즈 종료! 점수: ${sessionScore}/${quizSet.length}`);
    }
  };

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">개념 확인 퀴즈</h2>
          <p className="text-slate-500 mb-6">배운 내용을 테스트하고 XP를 획득하세요.</p>
          
          <div className="flex justify-center gap-3 mb-8">
            {(['all', 'easy', 'normal', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {d === 'all' ? '전체' : d}
              </button>
            ))}
          </div>

          <button 
            onClick={startQuiz}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-transform active:scale-95"
          >
            퀴즈 시작하기
          </button>
        </div>

        {/* Wrong Note Preview */}
        {stats.wrongNotes.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
             <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-4">
               <AlertTriangle size={18} /> 최근 오답 노트
             </h3>
             <div className="space-y-3">
               {stats.wrongNotes.slice(0, 3).map(note => (
                 <div key={note.id} className="bg-white p-3 rounded-lg border border-amber-100 text-sm">
                   <p className="font-medium text-slate-800 mb-1">{note.questionText}</p>
                   <div className="flex gap-4 text-xs">
                     <span className="text-red-500 line-through">나의 답: {note.userAnswer}</span>
                     <span className="text-green-600 font-bold">정답: {note.correctAnswer}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    );
  }

  const currentQ = quizSet[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quizSet.length) * 100;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
             <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
               {currentQ.type.toUpperCase()}
             </span>
             <span className="text-xs text-slate-400">
               {currentQuestionIndex + 1} / {quizSet.length}
             </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 leading-snug mb-6">
            {currentQ.text}
          </h3>

          <div className="space-y-3">
            {currentQ.options?.map((option) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
              if (isAnswered) {
                if (option === currentQ.correctAnswer) btnClass += "bg-green-50 border-green-500 text-green-700";
                else if (option === selectedOption) btnClass += "bg-red-50 border-red-500 text-red-700";
                else btnClass += "border-slate-100 text-slate-400 opacity-50";
              } else {
                btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center">
                    {option}
                    {isAnswered && option === currentQ.correctAnswer && <CheckCircle2 size={20} className="text-green-500"/>}
                    {isAnswered && option === selectedOption && option !== currentQ.correctAnswer && <XCircle size={20} className="text-red-500"/>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <div className="bg-slate-50 p-6 border-t border-slate-100 animate-fadeIn">
            <h4 className="font-bold text-sm text-slate-500 mb-1">해설</h4>
            <p className="text-slate-800 mb-4">{currentQ.explanation}</p>
            <button 
              onClick={nextQuestion}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-indigo-700"
            >
              {currentQuestionIndex < quizSet.length - 1 ? '다음 문제' : '결과 보기'} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;