import React, { useState } from 'react';
import { evaluateReflection } from '../services/geminiService';

const Reflection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [evaluations, setEvaluations] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);

  const prompts = [
    {
      title: "조건 바꾸기",
      desc: "만약 학교 축제가 아니라 '화재 현장 구조 로봇'이라면, 자율성과 협력성 설정은 어떻게 달라져야 할까요?",
      placeholder: "예: 화재 현장은 통신이 끊길 수 있으므로 자율성이 더 중요할 것 같습니다..."
    },
    {
      title: "반례 찾기",
      desc: "자율성이 너무 높아서 문제가 생기는 구체적인 상황을 상상해서 적어보세요.",
      placeholder: "예: 안내 로봇이 자율적으로 판단해서 금지 구역인 교무실로 외부인을 안내해버리는 상황..."
    },
    {
      title: "적용 설계하기",
      desc: "우리 집을 관리하는 '스마트 홈 AI'를 만든다면 어떤 목표를 최우선으로 삼고 싶나요?",
      placeholder: "예: 전기세 절약이 목표라면..."
    }
  ];

  const handleEvaluate = async () => {
    if (!answers[activeTab].trim()) return;
    setLoading(true);
    const result = await evaluateReflection(prompts[activeTab].title, answers[activeTab]);
    const newEvaluations = [...evaluations];
    newEvaluations[activeTab] = result;
    setEvaluations(newEvaluations);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold">🤔 생각해볼 문제</h2>
        <p className="opacity-90">지능 에이전트 개념을 더 깊이 이해하기 위해 서술형 질문에 답해보세요.</p>
      </div>

      <div className="flex border-b">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === idx 
                ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{prompts[activeTab].title}</h3>
        <p className="text-gray-600 mb-4">{prompts[activeTab].desc}</p>
        
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-32 resize-none mb-4"
          placeholder={prompts[activeTab].placeholder}
          value={answers[activeTab]}
          onChange={(e) => {
            const newAnswers = [...answers];
            newAnswers[activeTab] = e.target.value;
            setAnswers(newAnswers);
          }}
        />

        <div className="flex justify-end mb-6">
          <button
            onClick={handleEvaluate}
            disabled={loading || !answers[activeTab]}
            className={`px-6 py-2 rounded-lg text-white font-bold transition-all ${
              loading || !answers[activeTab]
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
            }`}
          >
            {loading ? "AI가 채점 중..." : "AI 코치에게 제출 및 평가받기"}
          </button>
        </div>

        {evaluations[activeTab] && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 animate-fade-in">
            <h4 className="font-bold text-yellow-800 mb-2">📝 AI 코치 평가서</h4>
            <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {evaluations[activeTab]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflection;