import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "테스트 세트(Test Set)의 주된 목적은 무엇인가요?",
    options: ["모델의 파라미터를 훈련시키기 위해", "모델이 새로운 데이터에 얼마나 잘 적응(일반화)하는지 평가하기 위해", "훈련 속도를 높이기 위해", "데이터의 오류를 고치기 위해"],
    correctIndex: 1,
    explanation: "학교 시험과 비슷합니다. 테스트 세트는 교과서(훈련 세트)를 단순히 외운 것인지, 아니면 내용을 진짜 이해했는지 확인하는 용도입니다."
  },
  {
    id: 2,
    question: "훈련 정확도는 99%인데 테스트 정확도가 50%라면, 이 상태를 무엇이라고 부르나요?",
    options: ["과소적합 (Underfitting)", "적절한 적합 (Good Fit)", "과적합 (Overfitting)", "데이터 누수 (Data Leakage)"],
    correctIndex: 2,
    explanation: "훈련 점수는 높지만 테스트 점수가 낮은 것은 '과적합'입니다. 모델이 실제 세상에 없는 패턴까지 '환각'을 보거나 암기해버린 상태입니다."
  },
  {
    id: 3,
    question: "과적합(Overfitting)을 줄이는 가장 일반적인 방법은?",
    options: ["모델을 더 복잡하게 만든다", "훈련 데이터의 양을 줄인다", "모델을 단순화한다 (예: 트리 깊이 제한)", "테스트 세트를 없앤다"],
    correctIndex: 2,
    explanation: "모델을 단순하게 만들면 노이즈(잡음)까지 외우는 것을 방지할 수 있습니다. 데이터를 더 많이 모으는 것도 도움이 됩니다!"
  },
  {
    id: 4,
    question: "지도 학습(Supervised Learning)에서 훈련 데이터는 무엇을 포함해야 하나요?",
    options: ["특성(문제)만 (X)", "정답 레이블(답안)만 (y)", "특성과 정답 레이블 모두 (문제와 답안)", "둘 다 필요 없다"],
    correctIndex: 2,
    explanation: "지도 학습은 선생님이 문제(특성)와 정답(레이블)을 모두 주고 가르치는 것과 같습니다."
  },
  {
    id: 5,
    question: "데이터에 '노이즈(오류)'가 너무 많으면 어떤 일이 발생하나요?",
    options: ["모델이 완벽하게 학습한다", "모델이 진짜 패턴 대신 우연한 오류를 학습할 수 있다", "테스트 점수가 항상 100%가 된다", "훈련 속도가 빨라진다"],
    correctIndex: 1,
    explanation: "노이즈는 라디오 잡음과 같습니다. 잡음이 너무 크면 모델이 진짜 음악(패턴)을 듣지 못하고 잡음을 따라하게 됩니다."
  }
];

export const QuizSection: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
    if (index === QUESTIONS[currentQ].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      onComplete(score + (selected === QUESTIONS[currentQ].correctIndex ? 1 : 0)); // Add last point if correct
    }
  };

  const question = QUESTIONS[currentQ];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">지식 확인 퀴즈</h2>
        <span className="text-indigo-600 font-semibold">문제 {currentQ + 1} / {QUESTIONS.length}</span>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium text-gray-800 mb-4">{question.question}</p>
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                showFeedback
                  ? idx === question.correctIndex
                    ? 'border-green-500 bg-green-50'
                    : idx === selected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                  : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {showFeedback && idx === question.correctIndex && <Check className="text-green-600" />}
                {showFeedback && idx === selected && idx !== question.correctIndex && <X className="text-red-600" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6 border-l-4 border-indigo-500 animate-fade-in">
          <p className="font-bold text-indigo-900 mb-1">코치 해설:</p>
          <p className="text-indigo-800">{question.explanation}</p>
        </div>
      )}

      {showFeedback && (
        <button
          onClick={nextQuestion}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          {currentQ < QUESTIONS.length - 1 ? "다음 문제" : "퀴즈 완료"}
        </button>
      )}
    </div>
  );
};