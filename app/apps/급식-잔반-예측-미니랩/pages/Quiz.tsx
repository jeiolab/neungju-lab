import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { getStats, saveStats } from '../utils/storageUtils';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "회귀분석(Regression)의 주된 목적은 무엇인가요?",
    options: ["데이터를 그룹별로 분류하기", "연속적인 숫자(값)를 예측하기", "이미지의 물체 찾기", "데이터 압축하기"],
    correct: 1,
    explanation: "회귀는 과거 데이터를 바탕으로 '잔반량'이나 '판매량' 같은 연속적인 수치를 예측하는 기법입니다.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "다음 중 '노이즈(Noise)'에 대한 설명으로 옳은 것은?",
    options: ["데이터의 패턴을 명확하게 해준다.", "항상 제거해야만 하는 데이터다.", "예측을 방해하는 무작위적인 오차나 잡음이다.", "데이터의 양을 의미한다."],
    correct: 2,
    explanation: "노이즈는 측정 오류나 예외적인 상황 등으로 인해 발생하는 무작위적인 변동을 말합니다.",
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "데이터를 '학습셋(Train)'과 '검증셋(Test)'으로 나누는 이유는?",
    options: ["데이터 양을 줄이기 위해서", "모델이 새로운 데이터에서도 잘 작동하는지 확인하기 위해", "계산을 빠르게 하기 위해", "컴퓨터 메모리를 아끼기 위해"],
    correct: 1,
    explanation: "학습한 문제(Train)를 그대로 시험(Test)보면 실력을 알 수 없죠? 새로운 데이터로 평가해야 진짜 성능(일반화 능력)을 알 수 있습니다.",
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "모델이 학습 데이터는 완벽하게 맞추지만, 새로운 데이터에서는 예측력이 떨어지는 현상은?",
    options: ["과소적합(Underfitting)", "과적합(Overfitting)", "정규화(Normalization)", "최적화(Optimization)"],
    correct: 1,
    explanation: "과적합은 모델이 학습 데이터의 노이즈까지 과도하게 외워버려 일반적인 패턴을 놓치는 현상입니다.",
    difficulty: 'hard'
  },
  {
    id: 5,
    question: "MAE(평균절대오차)가 0에 가까울수록 의미하는 바는?",
    options: ["모델의 예측이 매우 정확하다.", "모델이 완전히 틀렸다.", "데이터가 너무 적다.", "과적합이 발생했다."],
    correct: 0,
    explanation: "MAE는 실제값과 예측값의 차이(오차)의 평균이므로, 작을수록 예측이 정확하다는 뜻입니다.",
    difficulty: 'medium'
  }
];

const Quiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    if (idx === QUESTIONS[currentIdx].correct) {
        setScore(prev => prev + 20);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelected(null);
        setIsAnswered(false);
    } else {
        finishQuiz();
    }
  };

  const finishQuiz = () => {
    setFinished(true);
    const stats = getStats();
    stats.quizScore = Math.max(stats.quizScore, score);
    stats.points += score;
    saveStats(stats);
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelected(null);
    setIsAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-slate-800">퀴즈 완료!</h2>
            <div className="text-center">
                <p className="text-slate-500 mb-2">당신의 점수는</p>
                <p className="text-4xl font-bold text-indigo-600">{score}점</p>
            </div>
            <p className="text-sm text-slate-400">포인트가 적립되었습니다.</p>
            <button 
                onClick={resetQuiz}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
                다시 도전하기
            </button>
        </div>
    );
  }

  const question = QUESTIONS[currentIdx];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm text-slate-500 font-medium">
        <span>Question {currentIdx + 1} / {QUESTIONS.length}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
        }`}>
            {question.difficulty === 'easy' ? '쉬움' : question.difficulty === 'medium' ? '보통' : '어려움'}
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {question.question}
        </h3>

        <div className="space-y-3">
            {question.options.map((opt, idx) => (
                <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                        isAnswered 
                            ? idx === question.correct 
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : idx === selected 
                                    ? 'border-red-500 bg-red-50 text-red-800' 
                                    : 'border-slate-100 text-slate-400'
                            : 'border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span>{opt}</span>
                        {isAnswered && idx === question.correct && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {isAnswered && idx === selected && idx !== question.correct && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                </button>
            ))}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-fade-in bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <div className="flex gap-2 items-start mb-2">
                <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                <span className="font-bold text-indigo-800">해설</span>
            </div>
            <p className="text-indigo-900 text-sm leading-relaxed">{question.explanation}</p>
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={nextQuestion}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                >
                    다음 문제 <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;