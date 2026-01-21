import React, { useState, useEffect } from 'react';
import { UserProfile, Difficulty } from './types';
import { getInitialProfile } from './utils';
import { BADGES } from './constants';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { Trophy, Book, PenTool, Layout, Star, Menu, X, Flame } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'quiz' | 'reflect'>('sim');
  const [profile, setProfile] = useState<UserProfile>(getInitialProfile());
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Basic streak check logic (simplified)
    const today = new Date().toDateString();
    const lastLogin = new Date(profile.lastLogin).toDateString();
    if (today !== lastLogin) {
       // Should update in real app, simplified here
    }
  }, []);

  const TABS = [
    { id: 'theory', label: '개념 학습', icon: <Book size={18} /> },
    { id: 'sim', label: '수집 설계 (Wizard)', icon: <Layout size={18} /> },
    { id: 'quiz', label: '퀴즈', icon: <PenTool size={18} /> },
    { id: 'reflect', label: '생각 노트', icon: <Star size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Q</div>
                <h1 className="font-bold text-lg md:text-xl text-slate-800 tracking-tight">QueueQuest <span className="text-indigo-600 font-extrabold">Collector</span></h1>
            </div>

            {/* Desktop Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    <Trophy size={14} className="text-yellow-500" /> 
                    <span>Lv.{profile.level}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    <span className="text-indigo-600 font-bold">{profile.xp} XP</span>
                </div>
                 <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    <Flame size={14} className="text-orange-500" />
                    <span>{profile.streak}일 연속</span>
                </div>
                
                <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                    <option value="easy">쉬움</option>
                    <option value="medium">보통</option>
                    <option value="hard">도전</option>
                </select>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
             <div className="md:hidden bg-white border-t p-4 space-y-3 shadow-lg">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2"><Trophy size={16} className="text-yellow-500"/> Lv.{profile.level}</div>
                    <div className="font-bold text-indigo-600">{profile.xp} XP</div>
                </div>
                 <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                >
                    <option value="easy">난이도: 쉬움</option>
                    <option value="medium">난이도: 보통</option>
                    <option value="hard">난이도: 도전</option>
                </select>
                <div className="border-t pt-2">
                     {TABS.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setIsMobileMenuOpen(false); }}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
             </div>
        )}
      </header>

      {/* Tabs (Desktop) */}
      <div className="hidden md:block bg-white border-b">
         <div className="max-w-5xl mx-auto px-4 flex gap-8">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        {activeTab === 'theory' && <TheoryTab profile={profile} setProfile={setProfile} />}
        {activeTab === 'sim' && <SimulationTab profile={profile} setProfile={setProfile} difficulty={difficulty} />}
        {activeTab === 'quiz' && <QuizTab profile={profile} setProfile={setProfile} difficulty={difficulty} />}
        {activeTab === 'reflect' && <ReflectionTab />}
      </main>

      {/* Footer / Badge Showcase */}
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">나의 배지 컬렉션</h3>
            <div className="flex flex-wrap gap-4">
                {BADGES.map(badge => {
                    const hasBadge = profile.badges.includes(badge.id);
                    return (
                        <div key={badge.id} className={`flex items-center gap-2 p-2 rounded-lg border ${hasBadge ? 'bg-indigo-50 border-indigo-200 opacity-100' : 'bg-slate-50 border-slate-100 opacity-40 grayscale'}`}>
                            <span className="text-2xl">{badge.icon}</span>
                            <div>
                                <div className="text-xs font-bold text-slate-800">{badge.name}</div>
                                <div className="text-[10px] text-slate-500">{badge.desc}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </footer>
    </div>
  );
}