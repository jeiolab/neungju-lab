import React, { useState, useEffect } from 'react';
import { Wizard } from './components/Wizard';
import { Dashboard } from './components/Dashboard';
import { Quiz } from './components/Quiz';
import { ProjectDraft, UserStats } from './types';
import { Layout, BookOpen, User, PenTool, ExternalLink } from 'lucide-react';

type View = 'dashboard' | 'wizard' | 'quiz' | 'learn';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    badges: [],
    streak: 1,
    projectsCompleted: 0,
    quizScore: 0
  });

  // Load stats from local storage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('sdgs_wizard_stats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    localStorage.setItem('sdgs_wizard_stats', JSON.stringify(userStats));
  }, [userStats]);

  const handleProjectComplete = (project: ProjectDraft) => {
    const newBadges = [...userStats.badges];
    if (!newBadges.includes("기획서 완성")) newBadges.push("기획서 완성");
    if (project.ethicsCheck.privacy && project.ethicsCheck.bias && !newBadges.includes("윤리 체크 통과")) {
        newBadges.push("윤리 체크 통과");
    }

    setUserStats(prev => ({
        ...prev,
        projectsCompleted: prev.projectsCompleted + 1,
        level: prev.level + 1,
        badges: newBadges
    }));
    alert("축하합니다! 프로젝트 기획서가 저장되었습니다.");
    setView('dashboard');
  };

  const handleQuizComplete = (score: number) => {
      if (score >= 8) {
          const newBadges = [...userStats.badges];
          if (!newBadges.includes("퀴즈 마스터")) newBadges.push("퀴즈 마스터");
           setUserStats(prev => ({ ...prev, badges: newBadges, quizScore: Math.max(prev.quizScore, score) }));
      }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: View, icon: any, label: string }) => (
    <button 
        onClick={() => setView(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-2 ${view === id ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
    >
        <Icon size={20} />
        <span className="md:inline hidden">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Mobile Responsive: Bottom Nav or Hidden */}
      <aside className="w-16 md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col justify-between fixed h-full z-10 md:relative no-print">
        <div className="p-4">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                <span className="font-bold text-xl hidden md:block">SDGs Wizard</span>
            </div>
            <nav>
                <SidebarItem id="dashboard" icon={Layout} label="대시보드" />
                <SidebarItem id="wizard" icon={PenTool} label="새 프로젝트" />
                <SidebarItem id="quiz" icon={BookOpen} label="퀴즈 & 학습" />
            </nav>
        </div>
        <div className="p-4 border-t hidden md:block">
             <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-500"/>
                </div>
                <div className="text-sm">
                    <p className="font-bold">학생 연구원</p>
                    <p className="text-gray-400">Lv. {userStats.level}</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto w-full md:pl-0 pl-16">
        <div className="max-w-5xl mx-auto py-8 px-4 md:px-8">
            {view === 'dashboard' && <Dashboard stats={userStats} onStartNew={() => setView('wizard')} />}
            {view === 'wizard' && <Wizard onComplete={handleProjectComplete} />}
            {view === 'quiz' && (
                <div className="space-y-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-2">지식 충전소 🔋</h2>
                        <p className="opacity-90">머신러닝 개념을 익히고 퀴즈를 풀어보세요.</p>
                        <div className="mt-4 flex gap-4">
                             <a href="#" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                <ExternalLink size={14}/> Teachable Machine 가기
                             </a>
                              <a href="#" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                <ExternalLink size={14}/> 공공데이터포털 가기
                             </a>
                        </div>
                    </div>
                    <Quiz onComplete={handleQuizComplete} />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;