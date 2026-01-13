import React, { useState } from 'react';
import { INITIAL_QUIZZES } from '../constants';
import { QuizDifficulty } from '../types';
import { gradeSubjectiveAnswer } from '../services/geminiService';
import { CheckCircle, XCircle, BrainCircuit, HelpCircle } from 'lucide-react';

const QuizView: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQ = INITIAL_QUIZZES[currentQIndex];

  const handleSubmit = async () => {
    if (!userAnswer) return;

    setLoading(true);
    let isCorrect = false;
    let msg = "";

    if (currentQ.difficulty === QuizDifficulty.HARD) {
      // Use Gemini
      const result = await gradeSubjectiveAnswer(currentQ.question + (currentQ.scenario ? ` (상황: ${currentQ.scenario})` : ''), userAnswer);
      isCorrect = result.isCorrect;
      msg = result.feedback;
    } else {
      // Local check
      if (currentQ.options && currentQ.answer) {
         isCorrect = userAnswer === currentQ.answer;
         msg = isCorrect ? "정답입니다!" : `틀렸습니다. 정답은 '${currentQ.answer}' 입니다.`;
      }
    }

    setFeedback({ isCorrect, msg });
    setLoading(false);
  };

  const nextQuestion = () => {
    setFeedback(null);
    setUserAnswer('');
    if (currentQIndex < INITIAL_QUIZZES.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      alert("모든 퀴즈를 완료했습니다!");
      setCurrentQIndex(0); // Reset for demo
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      
      {/* Left: Question Area */}
      <div className="md:w-1/2 p-10 bg-slate-50 border-r border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="text-indigo-600"/> 
                도전! 퀴즈
            </h2>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${
                currentQ.difficulty === QuizDifficulty.HARD ? 'bg-red-50 border-red-100 text-red-600' : 
                currentQ.difficulty === QuizDifficulty.MEDIUM ? 'bg-yellow-50 border-yellow-100 text-yellow-600' : 'bg-green-50 border-green-100 text-green-600'
            }`}>
                {currentQ.difficulty} Level
            </span>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <div className="mb-6">
                 <span className="text-slate-400 font-bold text-lg mb-2 block">Question {currentQIndex + 1}</span>
                 <p className="text-2xl font-bold text-slate-800 leading-snug">{currentQ.question}</p>
            </div>
            
            {currentQ.scenario && (
                <div className="bg-white p-6 rounded-2xl text-slate-600 italic border border-slate-200 shadow-sm relative">
                    <span className="absolute -top-3 left-4 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">SITUATION</span>
                    "{currentQ.scenario}"
                </div>
            )}
          </div>
      </div>

      {/* Right: Answer Area */}
      <div className="md:w-1/2 p-10 flex flex-col justify-center">
        {!feedback ? (
            <div className="space-y-6">
                {currentQ.options ? (
                <div className="grid grid-cols-1 gap-3">
                    {currentQ.options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setUserAnswer(opt)}
                        className={`p-5 text-left rounded-xl border-2 transition-all font-medium text-lg ${
                        userAnswer === opt 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md' 
                        : 'border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                    >
                        {opt}
                    </button>
                    ))}
                </div>
                ) : (
                <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">당신의 답변을 서술해주세요</label>
                    <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="이곳에 답변을 입력하세요..."
                        className="w-full p-5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 focus:outline-none min-h-[200px] text-lg resize-none transition-colors"
                    />
                </div>
                )}

                <button 
                    onClick={handleSubmit} 
                    disabled={!userAnswer || loading}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                    {loading && <BrainCircuit className="animate-pulse" />}
                    {loading ? 'AI 선생님 채점 중...' : '제출하기'}
                </button>
            </div>
        ) : (
            <div className="animate-fade-in">
                <div className={`p-8 rounded-2xl flex flex-col gap-4 text-center items-center mb-8 ${feedback.isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                    {feedback.isCorrect ? <CheckCircle size={48} className="text-green-500"/> : <XCircle size={48} className="text-red-500"/>}
                    <div>
                        <p className={`font-bold text-2xl mb-2 ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{feedback.isCorrect ? '정답입니다!' : '아쉽네요'}</p>
                        <p className="text-slate-600 text-lg leading-relaxed">{feedback.msg}</p>
                    </div>
                </div>
                 <button 
                    onClick={nextQuestion}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg"
                >
                    다음 문제 풀기
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;