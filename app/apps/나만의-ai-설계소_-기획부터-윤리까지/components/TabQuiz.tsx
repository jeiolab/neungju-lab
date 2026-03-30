import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "채용 AI 모델 학습 시, 가장 주의해서 제외하거나 처리해야 할 데이터는?",
    options: ["지원자의 학점", "지원자의 성별", "지원자의 기술 스택", "지원자의 프로젝트 경험"],
    correctAnswer: 1,
    explanation: "성별은 직무 능력과 관계없는 민감 정보로, 포함 시 성차별적 편향을 학습할 위험이 매우 높습니다."
  },
  {
    id: 2,
    question: "주택 가격을 예측하는 AI를 만들 때 가장 적합한 모델 유형은?",
    options: ["분류 (Classification)", "회귀 (Regression)", "군집화 (Clustering)", "강화학습 (Reinforcement Learning)"],
    correctAnswer: 1,
    explanation: "주택 가격은 연속적인 숫자 값이므로 회귀 분석이 적합합니다."
  },
  {
    id: 3,
    question: "AI가 '스팸 메일'인지 아닌지 판별하는 것은 어떤 문제인가?",
    options: ["회귀 문제", "이진 분류 문제", "생성형 AI 문제", "비지도 학습"],
    correctAnswer: 1,
    explanation: "스팸(Yes) 또는 정상(No) 두 가지 중 하나로 나누는 이진 분류 문제입니다."
  },
  {
    id: 4,
    question: "모델 성능 평가 지표 중, '실제 암 환자를 암 환자라고 맞춘 비율'을 뜻하는 것은?",
    options: ["정확도 (Accuracy)", "정밀도 (Precision)", "재현율 (Recall)", "F1 Score"],
    correctAnswer: 2,
    explanation: "실제 Positive(암 환자) 중에서 모델이 Positive라고 예측한 비율은 재현율(Recall)입니다."
  },
  {
    id: 5,
    question: "다음 중 AI 윤리 원칙에 어긋나는 행동은?",
    options: ["AI 판단의 근거를 사용자에게 설명한다.", "개인정보를 비식별화하여 학습한다.", "성능을 높이기 위해 편향된 데이터를 그대로 쓴다.", "AI의 한계점을 명시한다."],
    correctAnswer: 2,
    explanation: "편향된 데이터를 그대로 사용하는 것은 공정성을 해치며 윤리적으로 문제가 됩니다."
  },
  // Added 5 more concise questions for variety
  { id: 6, question: "트롤리 딜레마와 같이 정답이 없는 도덕적 상황을 AI가 결정해야 할 때 중요한 것은?", options: ["무조건 다수를 살린다", "사회적 합의와 투명한 알고리즘 공개", "랜덤으로 결정한다", "개발자의 직관을 따른다"], correctAnswer: 1, explanation: "윤리적 딜레마는 사회적 합의와 알고리즘의 투명성이 필수적입니다." },
  { id: 7, question: "Overfitting(과적합)이란?", options: ["학습 데이터에만 너무 잘 맞아서 새로운 데이터 예측력이 떨어지는 현상", "데이터가 너무 적은 현상", "학습이 덜 된 상태", "윤리적으로 완벽한 상태"], correctAnswer: 0, explanation: "과적합은 모델이 훈련 데이터의 잡음까지 암기해버려 일반화 성능이 떨어지는 것을 말합니다." },
  { id: 8, question: "XAI(Explainable AI)의 목적은?", options: ["AI의 속도를 높이는 것", "AI의 결정 과정을 사람이 이해할 수 있게 설명하는 것", "데이터 양을 줄이는 것", "비용을 절감하는 것"], correctAnswer: 1, explanation: "XAI는 블랙박스인 AI 모델의 판단 근거를 설명 가능하게 만드는 기술입니다." },
  { id: 9, question: "딥페이크(Deepfake) 기술의 윤리적 문제점은?", options: ["화질이 너무 좋다", "허위 정보 유포 및 초상권 침해", "제작 비용이 비싸다", "용량이 크다"], correctAnswer: 1, explanation: "딥페이크는 악의적인 허위 정보 생성이나 명예훼손 등 심각한 윤리적 문제를 야기할 수 있습니다." },
  { id: 10, question: "Chatbot이 인종차별적 발언을 배웠을 때 개발자의 올바른 대응은?", options: ["사용자들의 자유이므로 둔다", "즉시 서비스를 중단하거나 필터링 로직을 강화한다", "더 많은 데이터를 넣어 희석시킨다", "책임을 회피한다"], correctAnswer: 1, explanation: "MS 테이(Tay) 사건처럼 즉각적인 조치와 윤리적 가이드라인 적용이 필요합니다." }
];

const TabQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.keys(answers).reduce((acc, qId) => {
    const q = QUESTIONS.find(q => q.id === parseInt(qId));
    return q && q.correctAnswer === answers[parseInt(qId)] ? acc + 1 : acc;
  }, 0);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert("모든 문제를 풀어주세요!");
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">AI 아키텍트 자격 시험</h2>
        {submitted && score === QUESTIONS.length && (
          <div className="animate-bounce flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-sm border border-yellow-200">
            <Award className="w-5 h-5 text-yellow-600" /> 공정한 개발자 배지 획득!
          </div>
        )}
      </div>

      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          
          return (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex gap-3">
                <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded h-fit">Q{idx + 1}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-4">{q.question}</h3>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        disabled={submitted}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          submitted
                            ? optIdx === q.correctAnswer
                              ? 'bg-green-100 border-green-500 text-green-900 font-medium'
                              : answers[q.id] === optIdx
                                ? 'bg-red-100 border-red-500 text-red-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            : answers[q.id] === optIdx
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {submitted && (
                    <div className={`mt-4 p-4 rounded-lg text-sm flex gap-3 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      <div className="shrink-0 mt-0.5">
                        {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </div>
                      <div>
                        <span className="font-bold block mb-1">{isCorrect ? '정답입니다!' : '오답입니다.'}</span>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center pb-12">
        {!submitted ? (
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg transition-transform transform hover:scale-105"
          >
            답안 제출하기
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-slate-800">
              총점: <span className={score >= 8 ? "text-green-600" : "text-red-500"}>{score}</span> / {QUESTIONS.length}
            </p>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 mx-auto px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <RotateCcw size={18} /> 다시 풀기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;