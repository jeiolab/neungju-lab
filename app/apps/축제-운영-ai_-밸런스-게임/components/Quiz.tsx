import React, { useState } from 'react';
import { QuizQuestion } from '../types';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "지능 에이전트의 3대 특성이 아닌 것은?",
    options: ["자율성(Autonomy)", "협력성(Cooperation)", "목표 지향성(Goal-Oriented)", "종속성(Dependency)"],
    correctAnswer: 3,
    explanation: "지능 에이전트는 누군가에게 종속되지 않고 스스로 판단하는 자율성을 가집니다."
  },
  {
    id: 2,
    question: "자율성(Autonomy)에 대한 설명으로 가장 적절한 것은?",
    options: ["무조건 사용자의 명령만 따른다.", "외부 개입 없이 스스로 상태를 제어한다.", "다른 에이전트와 대화하지 않는다.", "목표 없이 랜덤하게 움직인다."],
    correctAnswer: 1,
    explanation: "자율성은 외부의 직접적인 지시 없이 자신의 상태와 행동을 제어하는 능력입니다."
  },
  {
    id: 3,
    question: "학교 축제에서 '안전 관리 봇'에게 가장 필요한 특성 조합은?",
    options: ["높은 자율성, 낮은 협력성", "낮은 자율성, 높은 협력성", "자율성 0, 협력성 0", "무조건 높은 자율성"],
    correctAnswer: 1,
    explanation: "안전 관리는 정해진 규칙을 따라야 하므로 자율성은 적당히 조절하고, 위험 상황 전파를 위해 높은 협력성이 필요합니다."
  },
  {
    id: 4,
    question: "목표 지향성(Goal-Oriented)의 의미는?",
    options: ["단순히 자극에 반응하는 것", "설정된 목표 달성을 위해 계획적으로 행동하는 것", "목표를 수시로 바꾸는 것", "아무 행동도 하지 않는 것"],
    correctAnswer: 1,
    explanation: "반사적(Reflex) 행동과 달리, 목표 지향적 행동은 원하는 상태(Goal)에 도달하기 위한 일련의 행동을 계획합니다."
  },
  {
    id: 5,
    question: "협력성이 높을 때 발생할 수 있는 장점은?",
    options: ["정보 교환을 통해 전체적인 효율이 올라간다.", "혼자서 모든 것을 처리한다.", "다른 봇과 싸운다.", "판단 속도가 무조건 빨라진다."],
    correctAnswer: 0,
    explanation: "협력성은 분산된 정보를 공유하고 조율하여 전체 시스템의 최적화를 돕습니다."
  },
  {
    id: 6,
    question: "다음 중 '자율성'의 오개념인 것은?",
    options: ["스스로 판단한다.", "규칙 내에서 자유롭다.", "사용자의 통제를 완전히 벗어나 마음대로 한다.", "환경 변화에 적응한다."],
    correctAnswer: 2,
    explanation: "자율성은 설계된 목적과 안전 범위 내에서의 자율을 의미하며, 통제 불능 상태를 뜻하지 않습니다."
  },
  {
    id: 7,
    question: "축제 부스 안내 봇이 관람객의 취향에 맞춰 추천을 해주려 한다. 높여야 할 특성은?",
    options: ["자율성", "협력성", "반응성", "수동성"],
    correctAnswer: 0,
    explanation: "개별 상황에 맞춰 유연하게 대처하고 판단하는 것은 자율성과 관련이 깊습니다."
  },
  {
    id: 8,
    question: "트레이드오프(Trade-off) 상황에서 의사결정이란?",
    options: ["모든 특성을 100으로 만드는 것", "하나를 얻으면 하나를 잃을 수 있음을 알고 균형을 맞추는 것", "아무것도 선택하지 않는 것", "랜덤으로 선택하는 것"],
    correctAnswer: 1,
    explanation: "자율성과 안전성 등 상충되는 가치 사이에서 최적의 균형점을 찾는 것이 트레이드오프 의사결정입니다."
  },
  {
    id: 9,
    question: "여러 대의 청소 로봇이 넓은 강당을 청소한다. 구역이 겹치지 않게 하려면?",
    options: ["자율성을 높인다.", "협력성을 높인다.", "목표 지향성을 없앤다.", "전원을 끈다."],
    correctAnswer: 1,
    explanation: "서로의 위치와 청소 구역 정보를 교환(협력)해야 효율적인 청소가 가능합니다."
  },
  {
    id: 10,
    question: "지능 에이전트 설계자가 되어야 할 사용자의 태도는?",
    options: ["특성 간의 균형을 고려하여 목적에 맞게 설계한다.", "무조건 최신 기술만 쓴다.", "AI에게 모든 책임을 떠넘긴다.", "설계를 대충 한다."],
    correctAnswer: 0,
    explanation: "AI의 사용 목적에 맞게 특성 값을 조절하는 설계적 사고가 필요합니다."
  }
];

const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [showResult, setShowResult] = useState(false);

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score += 10;
    });
    return score;
  };

  const handleOptionSelect = (qId: number, optionIdx: number) => {
    if (showResult) return;
    setAnswers(prev => ({...prev, [qId]: optionIdx}));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-800">🕵️ 지능 에이전트 퀴즈</h2>
        <p className="text-gray-600">총 10문제, 문제를 잘 읽고 정답을 골라주세요.</p>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCorrect = answers[q.id] === q.correctAnswer;
          
          return (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-start gap-3 mb-4">
                <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-sm">Q{index + 1}</span>
                <h3 className="text-lg font-medium text-gray-800 pt-1">{q.question}</h3>
              </div>
              
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleOptionSelect(q.id, optIdx)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      answers[q.id] === optIdx 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${
                      showResult && optIdx === q.correctAnswer ? 'bg-green-100 border-green-500 text-green-800' : ''
                    } ${
                      showResult && answers[q.id] === optIdx && optIdx !== q.correctAnswer ? 'bg-red-100 border-red-500 text-red-800' : ''
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <strong>{isCorrect ? "✅ 정답입니다!" : "❌ 오답입니다."}</strong>
                  <p className="mt-1">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center">
        {!showResult ? (
          <button
            onClick={() => setShowResult(true)}
            disabled={Object.keys(answers).length < questions.length}
            className={`px-8 py-3 rounded-xl font-bold text-lg text-white shadow-lg ${
              Object.keys(answers).length < questions.length 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            결과 확인하기
          </button>
        ) : (
          <div className="animate-bounce">
            <p className="text-2xl font-bold text-indigo-900 mb-2">
              당신의 점수는 {calculateScore()}점 / 100점 입니다!
            </p>
            <button 
              onClick={() => { setShowResult(false); setAnswers({}); window.scrollTo(0,0); }}
              className="text-indigo-600 underline text-sm"
            >
              다시 풀기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;