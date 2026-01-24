import React, { useState, useEffect } from 'react';
import { UserState, SimulationResult } from './types';
import { QUIZ_QUESTIONS, BADGES } from './constants';
import { evaluatePolicy } from './services/geminiService';
import TheorySection from './components/TheorySection';
import Simulation from './components/Simulation';
import CloudLearn from './components/CloudLearn';
import { LayoutDashboard, CheckSquare, BrainCircuit, Share2, Award, BookOpen, PenTool } from 'lucide-react';

const STORAGE_KEY = 'tradeoff_share_v1';

const INITIAL_STATE: UserState = {
  level: 1,
  exp: 0,
  badges: [],
  history: [],
  quizScore: 0,
  policies: []
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'sim' | 'learn' | 'quiz' | 'reflect'>('sim');
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [policyText, setPolicyText] = useState('');
  const [policyFeedback, setPolicyFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUserState(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
  }, [userState]);

  const handleSimComplete = (result: SimulationResult) => {
    setUserState(prev => {
      const newHistory = [...prev.history, result];
      const newExp = prev.exp + 20;
      const newLevel = Math.floor(newExp / 100) + 1;
      
      const newBadges = [...prev.badges];
      if (newHistory.length >= 5 && !newBadges.includes(BADGES.MASTER)) {
          newBadges.push(BADGES.MASTER);
      }
      // Simple logic for badges based on weights
      if (result.weights.security > 8 && !newBadges.includes(BADGES.SECURITY)) newBadges.push(BADGES.SECURITY);
      if (result.weights.speed > 8 && !newBadges.includes(BADGES.SPEED)) newBadges.push(BADGES.SPEED);

      return {
        ...prev,
        history: newHistory,
        exp: newExp,
        level: newLevel,
        badges: newBadges
      };
    });
  };

  const handleQuizSubmit = (questionId: number, optionIndex: number) => {
    setQuizAnswers(prev => ({...prev, [questionId]: optionIndex}));
  };

  const submitPolicy = async () => {
    if(!policyText.trim()) return;
    setFeedbackLoading(true);
    const feedback = await evaluatePolicy(policyText);
    setPolicyFeedback(feedback);
    setFeedbackLoading(false);
    setUserState(prev => ({
        ...prev,
        policies: [...prev.policies, policyText]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Share2 />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-slate-800 leading-tight">공유 선택의 기술</h1>
                    <p className="text-xs text-slate-500">속도·보안·편의 균형게임</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-2">
                    {userState.badges.map((b, i) => (
                        <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200 shadow-sm animate-fade-in">
                            {b}
                        </span>
                    ))}
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400">DECISION COACH</div>
                    <div className="font-bold text-indigo-600">LV.{userState.level}</div>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button 
                onClick={() => setActiveTab('sim')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'sim' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                <LayoutDashboard size={18} /> 시뮬레이션
            </button>
            <button 
                onClick={() => setActiveTab('learn')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'learn' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                <BookOpen size={18} /> 클라우드 학습
            </button>
            <button 
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                <CheckSquare size={18} /> 퀴즈
            </button>
            <button 
                onClick={() => setActiveTab('reflect')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'reflect' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                <PenTool size={18} /> 적용 설계
            </button>
        </div>

        {activeTab === 'sim' && (
            <div className="animate-slide-up">
                <TheorySection />
                <Simulation userState={userState} onComplete={handleSimComplete} />
            </div>
        )}

        {activeTab === 'learn' && (
            <div className="animate-slide-up">
                <CloudLearn />
            </div>
        )}

        {activeTab === 'quiz' && (
            <div className="animate-slide-up max-w-3xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-2">지식 점검 퀴즈</h2>
                    <p className="text-gray-600">올바른 공유 방식과 네트워크 지식을 확인해보세요.</p>
                </div>
                {QUIZ_QUESTIONS.map((q) => {
                    const selected = quizAnswers[q.id];
                    const isCorrect = selected === q.correctIndex;
                    const isAnswered = selected !== undefined;

                    return (
                        <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg mb-4 flex gap-2">
                                <span className="text-indigo-500">Q{q.id}.</span> {q.question}
                            </h3>
                            <div className="grid gap-2">
                                {q.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuizSubmit(q.id, idx)}
                                        disabled={isAnswered}
                                        className={`p-3 text-left rounded-lg border-2 transition-all ${
                                            isAnswered 
                                                ? idx === q.correctIndex 
                                                    ? 'bg-green-100 border-green-500 text-green-800' 
                                                    : idx === selected 
                                                        ? 'bg-red-100 border-red-500 text-red-800' 
                                                        : 'bg-gray-50 border-transparent opacity-50'
                                                : 'hover:border-indigo-200 border-slate-100'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            {isAnswered && (
                                <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    <strong>{isCorrect ? '정답입니다! 🎉' : '아쉽네요. 다시 생각해보세요.'}</strong>
                                    <p className="mt-1">{q.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        )}

        {activeTab === 'reflect' && (
            <div className="animate-slide-up max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <BrainCircuit className="text-indigo-600" />
                        우리 모둠 공유 정책 설계
                    </h2>
                    <p className="text-gray-600 mb-6">
                        프로젝트 수행 시 우리 모둠이 지킬 데이터 공유 규칙 5줄을 작성해보세요.
                        <br/><span className="text-sm text-gray-400">예시: 기밀 문서는 절대 카카오톡으로 보내지 않고 암호화된 USB를 사용한다.</span>
                    </p>

                    <textarea 
                        className="w-full h-40 p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 resize-none mb-4"
                        placeholder="정책을 자유롭게 작성하세요..."
                        value={policyText}
                        onChange={(e) => setPolicyText(e.target.value)}
                    />

                    <button 
                        onClick={submitPolicy}
                        disabled={feedbackLoading || !policyText.trim()}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed w-full flex justify-center items-center gap-2"
                    >
                        {feedbackLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> AI 검토 중...</> : '정책 제출 및 AI 피드백 받기'}
                    </button>

                    {policyFeedback && (
                        <div className="mt-8 bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-fade-in">
                            <h3 className="font-bold text-indigo-900 mb-2">🤖 AI 코치 피드백</h3>
                            <p className="text-indigo-800 leading-relaxed">{policyFeedback}</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
