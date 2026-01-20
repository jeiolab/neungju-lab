import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import Layout from './components/Layout';
import GamificationBar from './components/GamificationBar';
import ConceptTab from './components/ConceptTab';
import WizardTab from './components/WizardTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';
import CareerTab from './components/CareerTab';
import { BookOpen, Wand2, CheckCircle2, BrainCircuit, Briefcase, ChevronRight, Trophy, Flame, Star } from 'lucide-react';

const TABS = [
  { id: 'concepts', label: '개념 카드', icon: BookOpen },
  { id: 'wizard', label: '설계 위저드', icon: Wand2 },
  { id: 'quiz', label: '퀴즈', icon: CheckCircle2 },
  { id: 'thinking', label: '생각 넓히기', icon: BrainCircuit },
  { id: 'career', label: '진로 연결', icon: Briefcase },
];

const INITIAL_PROFILE: UserProfile = {
  xp: 0,
  level: 1,
  badges: [],
  streak: 1,
  lastLoginDate: new Date().toDateString(),
  completedQuizzes: [],
  designsCreated: 0
};

export default function App() {
  const [activeTab, setActiveTab] = useState('concepts');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [showRubric, setShowRubric] = useState(false);
  
  // Load Profile
  useEffect(() => {
    const saved = localStorage.getItem('wizard_userProfile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Streak Logic
      const today = new Date().toDateString();
      if (parsed.lastLoginDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (parsed.lastLoginDate === yesterday.toDateString()) {
          parsed.streak += 1;
        } else {
          parsed.streak = 1;
        }
        parsed.lastLoginDate = today;
        saveProfile(parsed);
      }
      setProfile(parsed);
    } else {
      localStorage.setItem('wizard_userProfile', JSON.stringify(INITIAL_PROFILE));
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    localStorage.setItem('wizard_userProfile', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  const addXp = (amount: number) => {
    const newProfile = { ...profile, xp: profile.xp + amount };
    // Level up logic handled in display or here simply:
    // (Real logic would verify thresholds)
    if (newProfile.xp >= 100 && profile.level === 1) newProfile.level = 2;
    
    // Add badges
    if (newProfile.xp >= 50 && !newProfile.badges.includes("설계 입문")) {
      newProfile.badges.push("설계 입문");
      alert("배지 획득: 설계 입문!");
    }

    saveProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              <Wand2 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">나만의 학생 데이터 카드</h1>
              <p className="text-xs text-gray-500">변수와 자료형 설계</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1 text-indigo-600">
              <Trophy className="w-4 h-4" />
              <span>Lv.{profile.level}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span>{profile.streak}일</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-4 h-4" />
              <span>{profile.xp} XP</span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="max-w-6xl mx-auto px-4 border-t border-gray-200 bg-white">
          <div className="flex overflow-x-auto no-scrollbar gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md font-bold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 relative">
          {/* Rubric Toggle */}
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => setShowRubric(!showRubric)}
              className="text-xs font-bold text-gray-400 hover:text-indigo-600 flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-200"
            >
              평가 기준 {showRubric ? '숨기기' : '보기'} <ChevronRight className={`w-3 h-3 transition-transform ${showRubric ? 'rotate-90' : ''}`} />
            </button>
            {showRubric && (
               <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl rounded-lg p-4 border border-indigo-100 text-xs text-gray-600 z-20">
                 <h4 className="font-bold text-indigo-800 mb-2 border-b pb-1">수행평가 루브릭</h4>
                 <ul className="space-y-2 list-disc list-inside">
                   <li><span className="font-bold">적합성:</span> 데이터 성격에 맞는 자료형(int, float 등)을 선택했는가?</li>
                   <li><span className="font-bold">가독성:</span> 변수명 규칙(Snake Case)을 준수했는가?</li>
                   <li><span className="font-bold">정확성:</span> 오개념(문자열 따옴표 누락 등)이 없는가?</li>
                 </ul>
               </div>
            )}
          </div>

          <div className="mt-2">
            {activeTab === 'concepts' && <ConceptTab />}
            {activeTab === 'wizard' && <WizardTab onComplete={addXp} />}
            {activeTab === 'quiz' && <QuizTab onComplete={addXp} />}
            {activeTab === 'thinking' && <ThinkingTab />}
            {activeTab === 'career' && <CareerTab />}
          </div>
        </div>
      </main>
    </div>
  );
}