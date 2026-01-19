import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, RefreshCw } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "회귀(Regression)의 주된 목적은?",
    options: ["데이터를 그룹으로 나누기", "연속적인 수치값 예측하기", "이상치 제거하기", "데이터 개수 세기"],
    correctIndex: 1,
    explanation: "회귀는 공부시간→점수 처럼 연속된 값을 예측하는 데 사용됩니다."
  },
  {
    id: 2,
    question: "다음 중 회귀 문제가 아닌 것은?",
    options: ["아파트 가격 예측", "내일 기온 예측", "이메일이 스팸인지 아닌지 판별", "택시 요금 예측"],
    correctIndex: 2,
    explanation: "스팸/햄 판별은 '분류(Classification)' 문제입니다."
  },
  {
    id: 3,
    question: "RMSE(평균 제곱근 오차)가 작을수록 모델의 성능은?",
    options: ["좋다", "나쁘다", "상관없다", "알 수 없다"],
    correctIndex: 0,
    explanation: "오차가 작다는 것은 예측값이 실제값과 비슷하다는 뜻이므로 성능이 좋은 것입니다."
  },
  {
    id: 4,
    question: "단순 회귀 분석에서 사용하는 변수(특성)의 개수는?",
    options: ["0개", "1개", "2개 이상", "무한대"],
    correctIndex: 1,
    explanation: "단순 회귀는 하나의 독립변수(x)로 종속변수(y)를 설명합니다."
  },
  {
    id: 5,
    question: "데이터에 이상치(Outlier)가 많으면 일반적으로 어떤 일이 발생하나요?",
    options: ["모델 성능이 좋아진다", "오차가 커진다", "계산 속도가 빨라진다", "변화 없다"],
    correctIndex: 1,
    explanation: "이상치는 전체적인 경향성을 왜곡시켜 모델의 오차를 키울 수 있습니다."
  }
];

interface QuizTabProps {
    onScoreUpdate: (score: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    onScoreUpdate(score * 20); // 5 questions, 20 xp each
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">🎓 회귀 분석 퀴즈</h2>
        <p className="text-slate-600">5문제를 모두 맞히면 높은 XP를 얻을 수 있어요!</p>
      </div>

      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => {
          const isCorrect = userAnswers[q.id] === q.correctIndex;
          const isSelected = userAnswers[q.id] !== undefined;

          return (
            <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                <span className="text-brand-500 mr-2">Q{idx + 1}.</span>
                {q.question}
              </h3>
              <div className="grid gap-2">
                {q.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(q.id, optIdx)}
                    disabled={submitted}
                    className={`p-3 text-left rounded-lg transition-all border ${
                      submitted
                        ? optIdx === q.correctIndex
                          ? 'bg-green-100 border-green-500 text-green-900 font-bold'
                          : userAnswers[q.id] === optIdx
                          ? 'bg-red-100 border-red-500 text-red-900'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                        : userAnswers[q.id] === optIdx
                        ? 'bg-brand-50 border-brand-500 text-brand-900 ring-1 ring-brand-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                    {submitted && optIdx === q.correctIndex && <Check className="inline w-4 h-4 ml-2" />}
                    {submitted && userAnswers[q.id] === optIdx && optIdx !== q.correctIndex && <X className="inline w-4 h-4 ml-2" />}
                  </button>
                ))}
              </div>
              
              {submitted && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <strong>해설:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-6 flex justify-center">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length < QUESTIONS.length}
            className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            채점하기
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-5 h-5" /> 다시 풀기
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTab;