import React, { useState, useEffect } from 'react';
import { DailyMission } from './components/DailyMission';
import { TheoryTab } from './components/TheoryTab';
import { TemplatesTab } from './components/TemplatesTab';
import { QuizTab } from './components/QuizTab';
import { ReflectionTab } from './components/ReflectionTab';
import { loadProfile, saveProfile } from './utils/storage';
import { UserProfile } from './types';
import { BookOpen, Activity, ClipboardCheck, Lightbulb, MessageSquare, Trophy } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'mission' | 'templates' | 'quiz' | 'reflection'>('mission');
  const [profile, setProfile] = useState<UserProfile>({
    streak: 0,
    lastCompletedDate: null,
    totalCompleted: 0,
    badges: []
  });

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'mission': return <DailyMission profile={profile} setProfile={setProfile} />;
      case 'templates': return <TemplatesTab />;
      case 'quiz': return <QuizTab />;
      case 'reflection': return <ReflectionTab />;
      default: return <DailyMission profile={profile} setProfile={setProfile} />;
    }
  };

  const navItems = [
    { id: 'theory', label: '이론', icon: BookOpen },
    { id: 'mission', label: '오늘의 미션', icon: Activity },
    { id: 'templates', label: '더 알아보기', icon: ClipboardCheck },
    { id: 'quiz', label: '퀴즈', icon: Lightbulb },
    { id: 'reflection', label: '생각하기', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0">
      
      {/* Header / StatusBar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Viz Daily Mission
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">하루 1개 시각화 챌린지</p>
            </div>

            <div className="flex items-center gap-4">
               {/* Streak Display */}
               <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                 <Trophy className="w-4 h-4 text-orange-500" />
                 <span className="text-sm font-bold text-indigo-900">{profile.streak}일 연속</span>
               </div>
            </div>
          </div>

          {/* Navigation - Fixed at top */}
          <nav className="flex space-x-1 bg-slate-100/50 p-1.5 rounded-xl border border-slate-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'fill-current opacity-20' : ''}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-30">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'text-indigo-600 font-bold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce-short' : ''}`} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
