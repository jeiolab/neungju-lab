'use client'

import React, { useState, useEffect } from 'react';
import { Book, Layout, Brain, CheckSquare, MessageCircle, User } from 'lucide-react';
import { UserState, Badge } from './types';
import { BADGES } from './constants';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabDeepDive from './components/TabDeepDive';
import TabQuiz from './components/TabQuiz';
import TabReflection from './components/TabReflection';
import BadgeModal from './components/BadgeModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('algo_user');
    return saved ? JSON.parse(saved) : {
      name: '',
      mastery: 0,
      badges: [],
      quizHistory: { totalQuestions: 0, correctCount: 0, wrongAnswers: [] }
    };
  });
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  useEffect(() => {
    localStorage.setItem('algo_user', JSON.stringify(user));
  }, [user]);

  // Check for badges whenever user state changes
  useEffect(() => {
    const checkBadges = () => {
        const earnedBadges = new Set(user.badges);
        let badgeToAdd: string | null = null;

        if (user.name && !earnedBadges.has('newbie')) {
            badgeToAdd = 'newbie';
        }
        // Logic for other badges handles within specific completion handlers
        // But let's check score here too just in case
        if (user.quizHistory.totalQuestions >= 10 && (user.quizHistory.correctCount / user.quizHistory.totalQuestions) >= 0.8 && !earnedBadges.has('binary_wizard')) {
             badgeToAdd = 'binary_wizard';
        }

        if (badgeToAdd) {
             const badgeDef = BADGES.find(b => b.id === badgeToAdd);
             if (badgeDef) {
                 setNewBadge(badgeDef);
                 setUser(prev => ({...prev, badges: [...prev.badges, badgeToAdd!]}));
             }
        }
    };
    checkBadges();
  }, [user.name, user.quizHistory, user.badges]);


  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('username') as string;
    if (name.trim()) {
        setUser(prev => ({ ...prev, name }));
    }
  };

  const handleTheoryComplete = () => {
     // Increase mastery if not maxed, award badge
     if (!user.badges.includes('concept_master')) {
         const badgeDef = BADGES.find(b => b.id === 'concept_master');
         if (badgeDef) setNewBadge(badgeDef);
         setUser(prev => ({
             ...prev, 
             mastery: Math.min(prev.mastery + 30, 100),
             badges: [...prev.badges, 'concept_master']
         }));
     }
  };

  const handleQuizComplete = (score: number, wrongIds: number[]) => {
      setUser(prev => {
          const newTotal = prev.quizHistory.totalQuestions + 10; // Assuming 10 question batches
          const newCorrect = prev.quizHistory.correctCount + score;
          const newWrong = Array.from(new Set([...prev.quizHistory.wrongAnswers, ...wrongIds]));
          
          let masteryGain = score * 5; // Max 50 points from quiz
          
          return {
              ...prev,
              mastery: Math.min(prev.mastery + masteryGain, 100),
              quizHistory: {
                  totalQuestions: newTotal,
                  correctCount: newCorrect,
                  wrongAnswers: newWrong
              }
          };
      });
  };

  if (!user.name) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Brain className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">알고리즘 베이직: 탐색의 정석</h1>
                  <p className="text-slate-500 mb-8">고1 정보 교과 멘토와 함께하는<br/>이해 중심 알고리즘 학습</p>
                  
                  <form onSubmit={handleNameSubmit} className="space-y-4">
                      <input 
                        name="username"
                        type="text" 
                        placeholder="이름을 입력하세요" 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        required
                      />
                      <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                          학습 시작하기
                      </button>
                  </form>
              </div>
          </div>
      )
  }

  const tabs = [
    { title: '이론 개념', icon: <Book className="w-4 h-4"/>, component: <TabTheory onComplete={handleTheoryComplete} /> },
    { title: '시뮬레이션', icon: <Layout className="w-4 h-4"/>, component: <TabSimulation /> },
    { title: '더 알아보기', icon: <Brain className="w-4 h-4"/>, component: <TabDeepDive /> },
    { title: '퀴즈/확인', icon: <CheckSquare className="w-4 h-4"/>, component: <TabQuiz onQuizComplete={handleQuizComplete} wrongAnswerIds={user.quizHistory.wrongAnswers} /> },
    { title: '생각해볼 문제', icon: <MessageCircle className="w-4 h-4"/>, component: <TabReflection /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <Brain className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">탐색의 정석</h1>
            </div>
            
            <div className="flex items-center space-x-6">
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">이해도(Mastery)</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${user.mastery}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-indigo-700">{user.mastery}%</span>
                    </div>
                </div>
                <div className="flex items-center text-slate-600 font-medium">
                    <User className="w-5 h-5 mr-2 text-slate-400" />
                    {user.name}
                </div>
            </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto px-4 mt-2">
            <div className="flex space-x-1 overflow-x-auto no-scrollbar">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                            activeTab === idx 
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.title}</span>
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="animate-fade-in">
            {tabs[activeTab].component}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        <p>© 2025 알고리즘 베이직. 고1 정보 교과 멘토링.</p>
      </footer>

      <BadgeModal badge={newBadge} onClose={() => setNewBadge(null)} />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .preserve-3d {
            transform-style: preserve-3d;
        }
        .backface-hidden {
            backface-visibility: hidden;
        }
        .rotate-y-180 {
            transform: rotateY(180deg);
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;