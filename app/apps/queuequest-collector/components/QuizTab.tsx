import React, { useState } from 'react';
import { QUIZ_POOL } from '../constants';
import { getFilteredQuestions, checkAnswers, calculateXP, saveProfile } from '../utils';
import { UserProfile, Difficulty, QuizQuestion } from '../types';
import { Play, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  difficulty: Difficulty;
}

const QuizTab: React.FC<Props> = ({ profile, setProfile, difficulty }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | number>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    const q = getFilteredQuestions(QUIZ_POOL, difficulty, 5); // 5 questions for quick play
    setQuestions(q);
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer('');
    setFeedback(null);
    setIsPlaying(true);
  };

  const handleAnswerSubmit = () => {
    if (!userAnswer && userAnswer !== 0) return;

    const currentQ = questions[currentIndex];
    const isCorrect = checkAnswers(currentQ, userAnswer);
    
    setFeedback({
        isCorrect,
        msg: isCorrect ? "정답입니다! 완벽해요." : `오답입니다. \n${currentQ.explanation}`
    });

    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
        // Finish Quiz
        finishQuiz();
    } else {
        setCurrentIndex(c => c + 1);
        setUserAnswer('');
        setFeedback(null);
    }
  };

  const finishQuiz = () => {
    setIsPlaying(false);
    // XP Calculation: 10 per correct answer + 20 bonus for perfect score
    let xpGain = score * 10;
    if (score === questions.length) xpGain += 20;

    // Badge logic for perfect score
    const badges = [...profile.badges];
    if (score === questions.length && !badges.includes('quiz_whiz')) {
        badges.push('quiz_whiz');
    }

    const newProfile = calculateXP({ ...profile, badges }, xpGain);
    setProfile(newProfile);
    saveProfile(newProfile);
    alert(`퀴즈 종료! ${score}/${questions.length} 맞췄습니다. +${xpGain} XP 획득!`);
  };

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-md p-8 text-center">
        <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mb-4">
            <Play size={40} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">지식 확인 퀴즈</h2>
        <p className="text-slate-500 mb-6">난이도: <span className="uppercase font-bold text-indigo-600">{difficulty}</span> (5문제)</p>
        
        <button 
            onClick={startQuiz}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
            퀴즈 시작하기
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
            <span className="font-bold text-slate-500">Q{currentIndex + 1} / {questions.length}</span>
            <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded capitalize">{currentQ.difficulty}</span>
        </div>

        {/* Content */}
        <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
                {currentQ.question}
            </h3>

            {/* Answer Input Area */}
            <div className="mb-6">
                {currentQ.type === 'multiple' && currentQ.options && (
                    <div className="space-y-3">
                        {currentQ.options.map((opt, idx) => (
                            <button
                                key={idx}
                                disabled={!!feedback}
                                onClick={() => setUserAnswer(idx)}
                                className={`w-full text-left p-4 rounded-lg border transition ${
                                    userAnswer === idx 
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                                    : 'hover:bg-slate-50 border-slate-200'
                                }`}
                            >
                                <span className="inline-block w-6 font-bold text-slate-400">{idx + 1}.</span> {opt}
                            </button>
                        ))}
                    </div>
                )}

                {(currentQ.type === 'short' || currentQ.type === 'descriptive') && (
                    <input 
                        type="text" 
                        disabled={!!feedback}
                        value={userAnswer as string}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="정답을 입력하세요"
                        className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                )}
            </div>

            {/* Feedback Area */}
            {feedback && (
                <div className={`p-4 rounded-lg mb-6 flex gap-3 items-start ${feedback.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {feedback.isCorrect ? <CheckCircle className="shrink-0" /> : <XCircle className="shrink-0" />}
                    <div className="whitespace-pre-wrap text-sm font-medium">{feedback.msg}</div>
                </div>
            )}

            {/* Controls */}
            {!feedback ? (
                <button 
                    onClick={handleAnswerSubmit}
                    disabled={userAnswer === ''}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    정답 확인
                </button>
            ) : (
                <button 
                    onClick={nextQuestion}
                    className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition flex justify-center items-center gap-2"
                >
                    {currentIndex + 1 === questions.length ? '결과 보기' : '다음 문제'} <RefreshCw size={18} />
                </button>
            )}
        </div>
    </div>
  );
};

export default QuizTab;