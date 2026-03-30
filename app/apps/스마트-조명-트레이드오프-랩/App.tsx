import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Beaker, BookOpen, User, Menu, X, Lightbulb } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import Theory from './components/Theory';
import { storageService } from './services/storageService';
import { Design, QuizResult, UserProgress } from './types';
import { BADGES } from './constants';

type Tab = 'dashboard' | 'theory' | 'simulation' | 'quiz';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    badges: [],
    streak: 0,
    lastLogin: new Date().toISOString(),
    designsCount: 0
  });
  const [wrongNotes, setWrongNotes] = useState<number[]>([]);

  // Load initial data
  useEffect(() => {
    setDesigns(storageService.getDesigns());
    setProgress(storageService.getProgress());
    setWrongNotes(storageService.getWrongNotes());
  }, []);

  const handleSaveDesign = (design: Design) => {
    storageService.saveDesign(design);
    setDesigns(prev => [design, ...prev]);
    
    // Update progress
    const newProgress = { ...progress };
    newProgress.designsCount += 1;
    newProgress.xp += 50;
    
    // Check Badges
    const earnedBadges = new Set(newProgress.badges);
    
    // Badge: Prolific Designer
    if (newProgress.designsCount >= 5 && !earnedBadges.has('prolific_designer')) {
        earnedBadges.add('prolific_designer');
        alert("배지 획득: 다작 설계가!");
    }
    
    // Badge: Energy Saver
    if (design.scores.energy >= 90 && !earnedBadges.has('energy_saver')) {
        earnedBadges.add('energy_saver');
        alert("배지 획득: 절전왕!");
    }

    // Badge: Balance Master
    if (design.scores.energy >= 70 && design.scores.convenience >= 70 && design.scores.privacy >= 70 && !earnedBadges.has('balance_master')) {
        earnedBadges.add('balance_master');
        alert("배지 획득: 균형 설계자!");
    }

    // Badge: Privacy Guardian
    if (design.scores.privacy >= 95 && !earnedBadges.has('privacy_guardian')) {
        earnedBadges.add('privacy_guardian');
        alert("배지 획득: 사생활 수호자!");
    }
    
    // Level Up logic
    const neededXP = newProgress.level * 200;
    if (newProgress.xp >= neededXP) {
        newProgress.level += 1;
        alert(`레벨 업! 현재 레벨: ${newProgress.level}`);
    }

    newProgress.badges = Array.from(earnedBadges);
    setProgress(newProgress);
    storageService.saveProgress(newProgress);
  };

  const handleQuizComplete = (result: QuizResult) => {
    storageService.saveQuizResult(result);
    
    // Update Wrong Notes
    const currentWrongs = new Set(storageService.getWrongNotes());
    // Remove correct answers from wrong notes if retrying
    // (Assuming logic: if answered correctly now, remove from wrong list)
    // Actually, simple logic: just add new wrongs. User can clear them by answering correctly in 'Wrong Mode'
    // But for this MVP, let's just merge unique wrong IDs.
    result.wrongAnswers.forEach(id => currentWrongs.add(id));
    const newWrongIds = Array.from(currentWrongs);
    setWrongNotes(newWrongIds);
    storageService.saveWrongNotes(newWrongIds);

    // Update Progress
    const newProgress = { ...progress };
    newProgress.xp += result.score; // XP based on score
    if (result.score === 100 && !newProgress.badges.includes('quiz_whiz')) {
        newProgress.badges.push('quiz_whiz');
        alert("배지 획득: 이론 마스터!");
    }
    setProgress(newProgress);
    storageService.saveProgress(newProgress);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard progress={progress} designs={designs} />;
      case 'theory':
        return <Theory />;
      case 'simulation':
        return <Simulation onSave={handleSaveDesign} />;
      case 'quiz':
        return <Quiz onComplete={handleQuizComplete} wrongNotes={wrongNotes} />;
      default:
        return <Dashboard progress={progress} designs={designs} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'theory', label: '핵심 이론', icon: BookOpen },
    { id: 'simulation', label: '설계 랩(Lab)', icon: Beaker },
    { id: 'quiz', label: '퀴즈 & 오답', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-bold text-lg text-indigo-700">SmartLight Lab</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold tracking-tight">Trade-off Lab</h1>
            <p className="text-xs text-slate-400 mt-1">스마트 조명 설계 프로젝트</p>
          </div>
          
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-6 border-t border-slate-700 bg-slate-800">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                    {progress.level}
                </div>
                <div>
                    <div className="text-sm font-bold text-white">학생 설계자</div>
                    <div className="text-xs text-slate-400">Lv.{progress.level} ({progress.xp} XP)</div>
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen scroll-smooth">
          <div className="max-w-6xl mx-auto">
             <header className="mb-8 hidden lg:block">
                <h2 className="text-3xl font-bold text-slate-800">
                    {navItems.find(i => i.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500 mt-1">
                    {activeTab === 'simulation' ? '변수를 조절하여 최적의 설계를 찾아보세요.' : 
                     activeTab === 'dashboard' ? '나의 학습 현황과 설계 기록을 확인하세요.' :
                     activeTab === 'theory' ? 'IoT 센서와 트레이드오프 개념을 학습합니다.' : '문제를 풀고 부족한 부분을 복습하세요.'}
                </p>
             </header>
            
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;
