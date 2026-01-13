import React, { useState, useEffect } from 'react';
import { BookOpen, PenTool, Activity, HelpCircle, Layers, Shield } from 'lucide-react';
import { TheoryTab } from './components/TheoryTab';
import { WizardTab } from './components/WizardTab';
import { SimulationPreview } from './components/SimulationPreview';
import { QuizTab } from './components/QuizTab';
import { DeepDiveTab } from './components/DeepDiveTab';
import { AppliedDesignTab } from './components/AppliedDesignTab';
import { getProfile } from './services/storageService';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'wizard' | 'deepdive' | 'quiz' | 'applied'>('theory');
  const [profile, setProfile] = useState<UserProfile>(getProfile());

  // Periodically refresh profile data to update badges/xp in UI
  useEffect(() => {
    const interval = setInterval(() => {
      setProfile(getProfile());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'theory', label: '이론 개념', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'wizard', label: '설계 위저드', icon: <PenTool className="w-5 h-5" /> },
    { id: 'deepdive', label: '심화 탐구', icon: <Layers className="w-5 h-5" /> },
    { id: 'quiz', label: '퀴즈', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'applied', label: '적용 설계', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight hidden sm:block">3버튼 긴급신고 위저드</h1>
              <p className="text-xs text-gray-500 hidden sm:block">IoT 시스템 설계 코치</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
               <div className="text-xs font-bold text-gray-500 uppercase">레벨 {profile.level} 엔지니어</div>
               <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                 <div 
                   className="h-full bg-green-500" 
                   style={{ width: `${Math.min(100, (profile.xp % 100))}%` }}
                 ></div>
               </div>
             </div>
             <div className="flex gap-1">
               {profile.badges.map((b, i) => (
                 <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200" title={b}>
                   {b.split(' ')[0]}
                 </span>
               ))}
             </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="border-t border-gray-100 bg-white overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === item.id 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 animate-fade-in px-4">
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'wizard' && (
          <div className="space-y-12">
            <WizardTab onComplete={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">인터랙티브 프로토타입 시뮬레이션</h2>
              <SimulationPreview />
            </div>
          </div>
        )}
        {activeTab === 'deepdive' && <DeepDiveTab />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'applied' && <AppliedDesignTab />}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 mt-12 text-center text-sm">
        <p>© 2024 Edu-IoT 프로젝트 코치. 시스템 아키텍처 학습을 위해 설계되었습니다.</p>
      </footer>
    </div>
  );
};

export default App;
