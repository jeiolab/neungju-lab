import React, { useState } from 'react';
import { evaluateThinkingAnswer } from '../services/geminiService';
import { MessageSquare, Send, Sparkles, Loader2 } from 'lucide-react';

export const ThinkingSection: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [feedback, setFeedback] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);

  const questions = [
    "왜 모든 학생의 지각 횟수를 전역 변수(Global Variable) 하나로 관리하지 않고, 학생마다 각각 인스턴스를 만들어서 관리할까요?",
    "만약 '학교' 클래스가 있다면, 어떤 속성과 메서드가 필요할까요? 상상해서 적어보세요.",
    "내가 만든 클래스에서 '반장' 속성이 true인 학생만 수행할 수 있는 특별한 메서드를 만든다면 무엇이 좋을까요?"
  ];

  const handleSubmit = async () => {
    if (!answers[activeQuestion].trim()) return;
    
    setLoading(true);
    const result = await evaluateThinkingAnswer(questions[activeQuestion], answers[activeQuestion]);
    
    const newFeedback = [...feedback];
    newFeedback[activeQuestion] = result;
    setFeedback(newFeedback);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800">생각해볼 문제</h2>
        <p className="text-slate-500">AI 선생님이 여러분의 생각을 피드백해줍니다.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveQuestion(idx)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg ${
              activeQuestion === idx 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            질문 {idx + 1}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md min-h-[400px]">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{questions[activeQuestion]}</h3>
        
        <textarea
          value={answers[activeQuestion]}
          onChange={(e) => {
            const newAnswers = [...answers];
            newAnswers[activeQuestion] = e.target.value;
            setAnswers(newAnswers);
          }}
          placeholder="자신의 생각을 자유롭게 적어보세요..."
          className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none mb-4"
        />

        <div className="flex justify-end mb-6">
          <button
            onClick={handleSubmit}
            disabled={loading || !answers[activeQuestion].trim()}
            className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
            <span>AI 피드백 받기</span>
          </button>
        </div>

        {feedback[activeQuestion] && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-3 text-indigo-800 font-bold">
              <Sparkles className="w-5 h-5" />
              <span>AI 선생님의 피드백</span>
            </div>
            <div className="prose prose-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {feedback[activeQuestion]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
