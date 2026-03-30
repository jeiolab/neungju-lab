import React, { useState } from 'react';
import { Tab, WizardData, UserProgress, ProjectTheme } from './types';
import Wizard from './components/Wizard';
import TheoryCards from './components/TheoryCards';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import CriticalThinking from './components/CriticalThinking';
import ReportPreview from './components/ReportPreview';
import { BookOpen, PenTool, Activity, FileText, CheckSquare, Coffee, Trophy, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('theory');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    score: 0,
    badges: [],
    streak: 1,
    completedSteps: 0
  });
  const [wizardData, setWizardData] = useState<WizardData | null>(null);

  const handleStepComplete = (points: number) => {
    setUserProgress(prev => ({
        ...prev,
        score: prev.score + points,
        completedSteps: Math.min(prev.completedSteps + 1, 5)
    }));
  };

  const handleWizardComplete = (data: WizardData) => {
    setWizardData(data);
    setActiveTab('gallery'); // Jump to report view
    setUserProgress(prev => {
        const newBadges = [...prev.badges];
        if (!newBadges.includes("설계자")) newBadges.push("설계자");
        return { ...prev, score: prev.score + 50, badges: newBadges };
    });
  };

  const menuItems = [
    { id: 'theory', label: '이론 학습', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'wizard', label: '프로젝트 설계', icon: <PenTool className="w-5 h-5" /> },
    { id: 'simulation', label: '시뮬레이션', icon: <Activity className="w-5 h-5" /> },
    { id: 'gallery', label: '내 보고서', icon: <FileText className="w-5 h-5" /> },
    { id: 'quiz', label: '퀴즈', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'critical', label: '생각해보기', icon: <Coffee className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 z-10 md:h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Unsupervised AI
            </h1>
            <p className="text-xs text-slate-500 mt-1">고교 데이터 탐구 위저드</p>
        </div>
        
        <nav className="p-4 space-y-1">
            {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium
                        ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}
                    `}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>

        {/* Gamification Status in Sidebar */}
        <div className="p-6 mt-auto border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-orange-500 font-bold">
                    <Trophy className="w-5 h-5" />
                    <span>{userProgress.score} P</span>
                </div>
                <div className="flex items-center space-x-1 text-red-500 text-sm font-semibold">
                    <Flame className="w-4 h-4" />
                    <span>{userProgress.streak}일째</span>
                </div>
            </div>
            <div className="space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">획득 뱃지</div>
                <div className="flex flex-wrap gap-2">
                    {userProgress.badges.length === 0 && <span className="text-xs text-slate-400">아직 획득한 뱃지가 없습니다.</span>}
                    {userProgress.badges.map(b => (
                        <span key={b} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-bold shadow-sm">
                            🏅 {b}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">
                    {menuItems.find(i => i.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    {activeTab === 'theory' && "비지도 학습의 핵심 개념을 알아봅시다."}
                    {activeTab === 'wizard' && "나만의 탐구 프로젝트를 단계별로 설계합니다."}
                    {activeTab === 'simulation' && "파라미터 조정을 통해 결과를 예측해봅시다."}
                </p>
            </div>
        </header>

        <div className="max-w-5xl mx-auto">
            {activeTab === 'theory' && <TheoryCards />}
            {activeTab === 'wizard' && (
                <Wizard 
                    onComplete={handleWizardComplete} 
                    onStepComplete={handleStepComplete}
                    userProgress={userProgress}
                />
            )}
            {activeTab === 'simulation' && (
                <Simulation theme={wizardData?.theme || ProjectTheme.STUDY} />
            )}
            {activeTab === 'gallery' && (
                <ReportPreview data={wizardData || {
                    theme: ProjectTheme.STUDY,
                    problem: '',
                    attributes: [],
                    method: 'Clustering' as any,
                    successCriteria: [],
                    interpretation: ''
                }} />
            )}
            {activeTab === 'quiz' && (
                <Quiz onComplete={(score) => setUserProgress(prev => ({ ...prev, score: prev.score + score }))} />
            )}
            {activeTab === 'critical' && <CriticalThinking />}
        </div>
      </main>
    </div>
  );
};

export default App;
