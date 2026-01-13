import React, { useState } from 'react';
import { Question, UserStats, AlgorithmType } from '../types';
import { INITIAL_QUESTIONS } from '../constants';
import { generateQuizHint } from '../services/geminiService';
import { Check, X, HelpCircle, ArrowRight, Brain } from 'lucide-react';

interface QuizArenaProps {
  userStats: UserStats;
  updateStats: (isCorrect: boolean, category: AlgorithmType | 'General') => void;
}

const QuizArena: React.FC<QuizArenaProps> = ({ userStats, updateStats }) => {
  const [mode, setMode] = useState<'menu' | 'exam' | 'flashcard'>('menu');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hint, setHint] = useState<string>('');
  const [examScore, setExamScore] = useState(0);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [userInput, setUserInput] = useState('');

  // Prioritize weaknesses in question shuffling
  const getWeightedQuestions = () => {
    const questions = [...INITIAL_QUESTIONS];
    // Simple shuffle
    return questions.sort(() => Math.random() - 0.5);
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  const startExam = () => {
    setQuestions(getWeightedQuestions());
    setMode('exam');
    setCurrentQIndex(0);
    setExamScore(0);
    setIsExamFinished(false);
    resetState();
  };

  const startFlashcards = () => {
    setQuestions(getWeightedQuestions());
    setMode('flashcard');
    setCurrentQIndex(0);
    resetState();
  };

  const resetState = () => {
    setShowAnswer(false);
    setSelectedOption(null);
    setFeedback(null);
    setHint('');
    setUserInput('');
  };

  const handleHint = async () => {
    const q = questions[currentQIndex];
    const h = await generateQuizHint(q.question);
    setHint(h);
  };

  const handleAnswer = (answer: string) => {
    if (feedback) return; // Prevent multiple submissions
    setSelectedOption(answer);
    
    const q = questions[currentQIndex];
    // Simple normalization for text inputs
    const isCorrect = answer.trim().toLowerCase() === q.answer.toLowerCase();
    
    if (isCorrect) {
      setFeedback('correct');
      if (mode === 'exam') setExamScore(prev => prev + 1);
      updateStats(true, q.category);
    } else {
      setFeedback('wrong');
      updateStats(false, q.category);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      resetState();
    } else {
      setIsExamFinished(true);
    }
  };

  if (mode === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={startExam}
          className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 cursor-pointer hover:shadow-xl hover:border-indigo-300 transition group"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition">
             <Brain className="text-indigo-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">실전 모의고사</h3>
          <p className="text-slate-600">랜덤 10문제. 취약 유형을 집중 공략합니다. 실제 시험처럼 풀어보세요.</p>
        </div>

        <div 
          onClick={startFlashcards}
          className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 cursor-pointer hover:shadow-xl hover:border-indigo-300 transition group"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition">
             <ArrowRight className="text-emerald-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">플래시카드</h3>
          <p className="text-slate-600">카드 뒤집기로 개념을 암기하세요. 자투리 시간에 최적화된 학습.</p>
        </div>
      </div>
    );
  }

  const q = questions[currentQIndex];

  if (mode === 'flashcard') {
    return (
      <div className="max-w-2xl mx-auto p-6 flex flex-col items-center h-[600px] justify-center">
         <div 
           onClick={() => setShowAnswer(!showAnswer)}
           className={`
             w-full h-80 rounded-2xl shadow-xl flex items-center justify-center p-8 text-center cursor-pointer transition-all duration-500 transform style-preserve-3d
             ${showAnswer ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 border-2 border-indigo-100'}
           `}
         >
           <div>
             <h3 className="text-sm uppercase tracking-wider opacity-70 mb-4">
               {showAnswer ? '정답' : '문제'} ({currentQIndex + 1}/{questions.length})
             </h3>
             <p className="text-2xl font-bold leading-relaxed">
               {showAnswer ? q.answer : q.question}
             </p>
             {showAnswer && <p className="mt-4 text-indigo-200 text-sm">{q.explanation}</p>}
           </div>
         </div>
         <button 
           onClick={nextQuestion}
           className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition"
         >
           다음 카드
         </button>
         <button onClick={() => setMode('menu')} className="mt-4 text-slate-500 underline">메뉴로 돌아가기</button>
      </div>
    );
  }

  if (isExamFinished) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center bg-white rounded-3xl shadow-xl mt-10">
        <h2 className="text-3xl font-bold mb-4">시험 종료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{examScore} / {questions.length}</div>
        <p className="text-slate-600 mb-8">
          {examScore === questions.length ? '완벽합니다! 정렬 마스터시군요! 🎉' : 
           examScore > questions.length / 2 ? '잘했습니다! 조금만 더 노력하면 완벽해요.' : 
           '오답 노트를 확인하고 다시 도전해보세요!'}
        </p>
        <button 
          onClick={() => setMode('menu')}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center text-slate-500 text-sm">
        <span>Question {currentQIndex + 1} / {questions.length}</span>
        <span className="px-2 py-1 bg-slate-200 rounded text-slate-700 font-semibold">{q.category}</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">{q.question}</h2>

        {q.type === 'multiple-choice' && q.options && (
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={!!feedback}
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center
                  ${selectedOption === opt 
                    ? (feedback === 'correct' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-rose-50 border-rose-500 text-rose-900')
                    : 'bg-white border-slate-200 hover:border-indigo-400'
                  }
                  ${selectedOption && opt === q.answer && feedback === 'wrong' ? 'bg-emerald-50 border-emerald-500' : ''}
                `}
              >
                <span>{opt}</span>
                {selectedOption === opt && feedback === 'correct' && <Check className="text-emerald-600" />}
                {selectedOption === opt && feedback === 'wrong' && <X className="text-rose-600" />}
              </button>
            ))}
          </div>
        )}

        {(q.type === 'fill-in-blank' || q.type === 'flashcard') && (
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="정답을 입력하세요"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={!!feedback}
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && !feedback && handleAnswer(userInput)}
            />
            {!feedback && (
               <button 
                onClick={() => handleAnswer(userInput)}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition"
               >
                 제출하기
               </button>
            )}
            {feedback && (
              <div className={`p-4 rounded-xl ${feedback === 'correct' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                {feedback === 'correct' ? '정답입니다!' : `오답입니다. 정답: ${q.answer}`}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <button 
             onClick={handleHint}
             className="flex items-center text-sm text-indigo-500 hover:text-indigo-700 font-medium"
          >
            <HelpCircle size={16} className="mr-1" /> AI 힌트 보기
          </button>
          {feedback && (
            <button 
              onClick={nextQuestion}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition"
            >
              다음 문제
            </button>
          )}
        </div>
        
        {hint && (
          <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm animate-fade-in border border-yellow-200">
            💡 <b>Hint:</b> {hint}
          </div>
        )}
        
        {feedback && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-200">
            📘 <b>해설:</b> {q.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizArena;
