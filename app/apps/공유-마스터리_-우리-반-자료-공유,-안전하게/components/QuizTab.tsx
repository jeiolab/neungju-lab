import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { QuizQuestion, Difficulty, WrongNoteItem } from '../types';
import { PlayCircle, AlertCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  onCompleteQuiz: (score: number, difficulty: Difficulty, wrongItems: WrongNoteItem[]) => void;
  wrongNote: WrongNoteItem[];
}

type QuizState = 'menu' | 'playing' | 'result';

const QuizTab: React.FC<Props> = ({ onCompleteQuiz, wrongNote }) => {
  const [state, setState] = useState<QuizState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // User's selected indices
  const [showExplanation, setShowExplanation] = useState(false);

  // 퀴즈 시작
  const startQuiz = (diff: Difficulty) => {
    // 해당 난이도의 문제 필터링 (실제 앱에선 랜덤 셔플 필요)
    const filtered = QUIZZES.filter(q => q.difficulty === diff);
    setCurrentQuestions(filtered);
    setDifficulty(diff);
    setCurrentIndex(0);
    setAnswers(new Array(filtered.length).fill(-1));
    setState('playing');
    setShowExplanation(false);
  };

  const handleAnswer = (optionIndex: number) => {
    if (answers[currentIndex] !== -1) return; // 이미 답함

    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // 점수 계산
    let score = 0;
    const newWrongItems: WrongNoteItem[] = [];

    currentQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        score += 10;
      } else {
        newWrongItems.push({
          questionId: q.id,
          userAnswer: answers[idx],
          timestamp: Date.now(),
          conceptId: q.conceptId,
          difficulty: q.difficulty
        });
      }
    });

    onCompleteQuiz(score, difficulty, newWrongItems);
    setState('result');
  };

  const renderMenu = () => (
    <div className="space-y-6 text-center py-10">
      <h2 className="text-2xl font-bold text-slate-800">도전! 네트워크 퀴즈</h2>
      <p className="text-slate-600">난이도를 선택하고 공유 마스터리에 도전해봐.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          { id: 'easy', label: '쉬움', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
          { id: 'medium', label: '보통', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
          { id: 'hard', label: '도전', color: 'bg-red-100 text-red-700 hover:bg-red-200' }
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => startQuiz(d.id as Difficulty)}
            className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition ${d.color}`}
          >
            <PlayCircle size={32} />
            <span className="font-bold text-lg">{d.label}</span>
          </button>
        ))}
      </div>

      {wrongNote.length > 0 && (
        <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
          <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-orange-500" /> 오답 노트 ({wrongNote.length})
          </h3>
          <p className="text-sm text-slate-600 mb-2">틀린 문제를 다시 확인하고 개념을 복습하자.</p>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {wrongNote.map((item, idx) => {
              const q = QUIZZES.find(q => q.id === item.questionId);
              if (!q) return null;
              return (
                <div key={idx} className="text-sm p-2 bg-white rounded border border-slate-200">
                  <span className="text-red-500 font-bold mr-2">[오답]</span>
                  {q.question}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderPlaying = () => {
    const question = currentQuestions[currentIndex];
    const isAnswered = answers[currentIndex] !== -1;
    const isCorrect = answers[currentIndex] === question.correctIndex;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
          <span>{difficulty.toUpperCase()} 모드</span>
          <span>{currentIndex + 1} / {currentQuestions.length}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all" 
            style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[200px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let btnClass = "w-full p-4 rounded-xl text-left border transition ";
              if (!isAnswered) {
                btnClass += "border-slate-200 hover:bg-slate-50 hover:border-blue-300";
              } else {
                if (idx === question.correctIndex) {
                  btnClass += "bg-green-100 border-green-500 text-green-800 font-bold";
                } else if (idx === answers[currentIndex]) {
                  btnClass += "bg-red-100 border-red-500 text-red-800";
                } else {
                  btnClass += "opacity-50 border-slate-100";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{idx + 1}. {option}</span>
                    {isAnswered && idx === question.correctIndex && <CheckCircle size={20} />}
                    {isAnswered && idx === answers[currentIndex] && idx !== question.correctIndex && <XCircle size={20} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="animate-fade-in space-y-4">
            <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '정답입니다! 🎉' : '아쉽네요. 다시 생각해볼까요?'}
              </h4>
              <p className="text-slate-700 text-sm">{question.explanation}</p>
            </div>
            <button
              onClick={nextQuestion}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              {currentIndex === currentQuestions.length - 1 ? '결과 보기' : '다음 문제'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderResult = () => {
    const score = answers.reduce((acc, ans, idx) => ans === currentQuestions[idx].correctIndex ? acc + 10 : acc, 0);
    return (
      <div className="text-center py-10 space-y-6">
        <h2 className="text-3xl font-bold text-slate-800">퀴즈 완료!</h2>
        <div className="text-6xl font-black text-blue-600 my-4">{score}점</div>
        <p className="text-slate-600">
          총 {currentQuestions.length}문제 중 {answers.filter((a, i) => a === currentQuestions[i].correctIndex).length}문제를 맞혔어!
        </p>
        <button
          onClick={() => setState('menu')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition"
        >
          <RotateCcw size={18} /> 처음으로 돌아가기
        </button>
      </div>
    );
  };

  return (
    <div>
      {state === 'menu' && renderMenu()}
      {state === 'playing' && renderPlaying()}
      {state === 'result' && renderResult()}
    </div>
  );
};

export default QuizTab;