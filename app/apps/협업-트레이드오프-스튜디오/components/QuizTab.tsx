import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { saveQuizScore, getWrongNoteIds } from '../utils/storage';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, BookOpen } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);

  const prevWrongIds = getWrongNoteIds();

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setWrongIds([]);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === QUIZ_DATA[currentQIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 10);
    } else {
      setWrongIds(prev => [...prev, QUIZ_DATA[currentQIndex].id]);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_DATA.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
    // Combine old wrong notes with new ones, remove duplicates
    const updatedWrongIds = Array.from(new Set([...prevWrongIds, ...wrongIds]));
    saveQuizScore(score + (isAnswered && selectedOption === QUIZ_DATA[currentQIndex].correctAnswer ? 10 : 0), updatedWrongIds);
  };

  if (!quizStarted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-10 h-10 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">협업 마스터 퀴즈</h2>
          <p className="text-slate-500 mt-2">총 {QUIZ_DATA.length}문항 | 100점 만점</p>
          {prevWrongIds.length > 0 && (
            <p className="text-sm text-red-500 mt-2">📝 이전에 틀린 문제가 {prevWrongIds.length}개 있습니다.</p>
          )}
        </div>
        <button
          onClick={startQuiz}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          퀴즈 시작하기
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-800">퀴즈 결과</h2>
        <div className="text-5xl font-black text-indigo-600 my-8">{score}점</div>
        
        <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-4 rounded-xl">
           <div>
             <span className="block text-xs text-slate-400">정답 수</span>
             <span className="font-bold text-slate-700">{score / 10} / {QUIZ_DATA.length}</span>
           </div>
           <div>
             <span className="block text-xs text-slate-400">획득 배지</span>
             <span className="font-bold text-slate-700">{score >= 90 ? '🏆 협업 마스터' : '-'}</span>
           </div>
        </div>

        {wrongIds.length > 0 && (
          <div className="text-left mt-6">
            <h3 className="font-bold text-red-500 mb-2">오답 노트 (취약 개념)</h3>
            <ul className="space-y-2">
              {wrongIds.map(id => {
                const q = QUIZ_DATA.find(x => x.id === id);
                return q ? (
                  <li key={id} className="text-sm bg-red-50 p-2 rounded text-slate-700">
                     <span className="font-bold mr-2">Q{q.id}.</span> {q.tags.map(t => `#${t}`).join(' ')}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}

        <button
          onClick={startQuiz}
          className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> 다시 도전하기
        </button>
      </div>
    );
  }

  const currentQ = QUIZ_DATA[currentQIndex];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-slideUp">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-indigo-600">Q{currentQIndex + 1} / {QUIZ_DATA.length}</span>
        <div className="flex gap-1">
            {currentQ.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full">#{tag}</span>
            ))}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-6 min-h-[3.5rem]">{currentQ.question}</h3>

      <div className="space-y-3 mb-6">
        {currentQ.options.map((opt, idx) => {
          let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
          if (isAnswered) {
             if (idx === currentQ.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800 font-bold";
             else if (idx === selectedOption) btnClass += "bg-red-100 border-red-500 text-red-800";
             else btnClass += "bg-slate-50 border-slate-200 text-slate-400";
          } else {
             btnClass += "bg-white border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isAnswered}
              className={btnClass}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="animate-fadeIn">
          <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-600 border border-slate-200">
            <span className="font-bold block mb-1">💡 해설</span>
            {currentQ.explanation}
          </div>
          <button
            onClick={nextQuestion}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
          >
            {currentQIndex === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;