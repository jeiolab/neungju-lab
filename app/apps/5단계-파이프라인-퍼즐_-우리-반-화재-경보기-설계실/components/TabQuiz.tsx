import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { UserProgress, WrongNote } from '../types';
import { addWrongNote } from '../services/storage';

interface Props {
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

const TabQuiz: React.FC<Props> = ({ userProgress, onUpdateProgress }) => {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUIZ_QUESTIONS[currentQIdx];

  const handleAnswer = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === question.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(s => s + 1);
    } else {
      // Save wrong answer
      const note: WrongNote = {
        qid: question.id,
        conceptId: question.conceptId,
        misconceptionType: question.misconceptionType,
        difficulty: question.difficulty,
        userAns: selectedOption,
        correctAns: question.answer,
        ts: Date.now()
      };
      addWrongNote(note);
    }
  };

  const nextQuestion = () => {
    if (currentQIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      // Update XP based on score
      const xpGained = score * 10;
      onUpdateProgress({ ...userProgress, xp: userProgress.xp + xpGained });
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm text-center">
        <h2 className="text-2xl font-bold mb-4">퀴즈 완료!</h2>
        <div className="text-6xl mb-6">📝</div>
        <p className="text-xl mb-4">
          당신의 점수는 <span className="text-blue-600 font-bold">{score} / {QUIZ_QUESTIONS.length}</span> 입니다.
        </p>
        <p className="text-gray-500 mb-8">
          +{score * 10} XP를 획득했습니다.
        </p>
        <button 
          onClick={() => {
            setCompleted(false);
            setCurrentQIdx(0);
            setScore(0);
            setSelectedOption(null);
            setShowResult(false);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
        <span>Question {currentQIdx + 1} / {QUIZ_QUESTIONS.length}</span>
        <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {question.difficulty}
        </span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>
        
        <div className="space-y-3 mb-8">
          {question.options?.map((opt) => (
            <button
              key={opt}
              onClick={() => !showResult && setSelectedOption(opt)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedOption === opt
                  ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:bg-gray-50'
              } ${showResult && opt === question.answer ? 'bg-green-100 border-green-500' : ''}
                ${showResult && selectedOption === opt && opt !== question.answer ? 'bg-red-100 border-red-500' : ''}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {!showResult ? (
          <button
            onClick={handleAnswer}
            disabled={!selectedOption}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
              selectedOption ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            정답 확인하기
          </button>
        ) : (
          <div className="animate-fade-in">
            <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-bold mb-2">{isCorrect ? '정답입니다! 👏' : '오답입니다. 😅'}</p>
              <div className="text-sm bg-white/50 p-3 rounded">
                <strong>왜 그럴까요?</strong><br/>
                {question.explanation}
              </div>
              {!isCorrect && (
                 <div className="mt-2 text-xs text-gray-500">
                    오답노트에 자동 저장되었습니다. (유형: {question.misconceptionType})
                 </div>
              )}
            </div>
            <button
              onClick={nextQuestion}
              className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900"
            >
              다음 문제 &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;