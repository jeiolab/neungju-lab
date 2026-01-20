import React, { useState } from 'react';
import { QuizQuestion, UserStats } from '../types';
import { QUIZ_QUESTIONS } from '../services/gameLogic';
import { saveStats, saveWrongNote, removeWrongNote } from '../services/storageService';
import { Check, X, BookOpen, RotateCcw } from 'lucide-react';

interface QuizTabProps {
  stats: UserStats;
  onStatsUpdate: (s: UserStats) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ stats, onStatsUpdate }) => {
  const [activeMode, setActiveMode] = useState<'quiz' | 'notes'>('quiz');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Filter wrong notes questions
  const wrongQuestions = QUIZ_QUESTIONS.filter(q => stats.wrongNotes.includes(q.id));

  const questionsToUse = activeMode === 'quiz' ? QUIZ_QUESTIONS : wrongQuestions;
  const currentQ = questionsToUse[currentQIndex];

  const handleAnswer = () => {
    if (!selectedOption) return;
    
    // Simple normalization check for short answer
    const check = selectedOption.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    
    setIsCorrect(check);
    setIsAnswered(true);

    if (activeMode === 'quiz') {
      const newStats = { ...stats };
      if (check) {
        newStats.points += 5;
      } else {
        saveWrongNote(currentQ.id);
        newStats.wrongNotes = [...newStats.wrongNotes, currentQ.id].filter((v, i, a) => a.indexOf(v) === i); // unique
      }
      onStatsUpdate(newStats);
      saveStats(newStats);
    } else {
        // In notes mode, if correct, remove from notes
        if (check) {
            const newStats = removeWrongNote(currentQ.id);
            onStatsUpdate(newStats);
        }
    }
  };

  const nextQuestion = () => {
    setIsAnswered(false);
    setSelectedOption('');
    if (currentQIndex < questionsToUse.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      alert(activeMode === 'quiz' ? '모든 문제를 풀었습니다!' : '오답노트 복습 완료!');
      setCurrentQIndex(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-4 mb-6 border-b pb-4">
        <button 
          onClick={() => { setActiveMode('quiz'); setCurrentQIndex(0); setIsAnswered(false); setSelectedOption(''); }}
          className={`px-4 py-2 rounded-lg font-bold ${activeMode === 'quiz' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          오늘의 퀴즈
        </button>
        <button 
          onClick={() => { setActiveMode('notes'); setCurrentQIndex(0); setIsAnswered(false); setSelectedOption(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${activeMode === 'notes' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <BookOpen className="w-4 h-4" /> 오답 노트 ({wrongQuestions.length})
        </button>
      </div>

      {questionsToUse.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
          {activeMode === 'notes' ? "오답 노트가 비어있습니다. 훌륭해요!" : "풀 문제가 없습니다."}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-bold px-2 py-1 rounded ${currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' : currentQ.difficulty === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
              {currentQ.difficulty.toUpperCase()}
            </span>
            <span className="text-gray-400 text-sm">{currentQIndex + 1} / {questionsToUse.length}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 leading-snug">
            {currentQ.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQ.type === 'multiple' && currentQ.options?.map((opt, idx) => (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => setSelectedOption(opt)}
                className={`w-full text-left p-4 rounded-xl border-2 transition ${
                  selectedOption === opt 
                    ? 'border-blue-500 bg-blue-50 text-blue-800' 
                    : 'border-gray-100 hover:border-gray-300'
                } ${isAnswered && opt === currentQ.correctAnswer ? 'bg-green-100 border-green-400' : ''} ${isAnswered && selectedOption === opt && !isCorrect ? 'bg-red-100 border-red-400' : ''}`}
              >
                {opt}
              </button>
            ))}

            {(currentQ.type === 'short' || currentQ.type === 'essay') && (
              <input 
                type="text" 
                disabled={isAnswered}
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                placeholder="답을 입력하세요"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            )}
          </div>

          {!isAnswered ? (
            <button 
              onClick={handleAnswer}
              disabled={!selectedOption}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              제출하기
            </button>
          ) : (
            <div className="animate-fade-in">
              <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                    {isCorrect ? <Check className="w-5 h-5"/> : <X className="w-5 h-5"/>}
                    {isCorrect ? "정답입니다!" : `오답입니다. 정답: ${currentQ.correctAnswer}`}
                </div>
                <p className="text-sm opacity-90">{currentQ.explanation}</p>
              </div>
              <button 
                onClick={nextQuestion}
                className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition flex items-center justify-center gap-2"
              >
                {activeMode === 'notes' && isCorrect ? '목록에서 삭제 후 다음' : '다음 문제'} <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizTab;