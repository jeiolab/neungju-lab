import React, { useState, useEffect } from 'react';
import { AppView, AgentDesign, Badge } from './types';
import { INITIAL_BADGES } from './constants';
import { LayoutDashboard, BookOpen, PenTool, PlayCircle, HelpCircle, FileText, Award, Menu, X, Droplet } from 'lucide-react';
import Theory from './components/Theory';
import Simulation from './components/Simulation';
import Wizard from './components/Wizard';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import { getDailyMission } from './services/geminiService';

const DEFAULT_DESIGN: AgentDesign = {
  name: '',
  perception: { sensors: [], dataTypes: [], location: '' },
  analysis: { threshold: '', logic: '' },
  reasoning: { decision: '', strategy: '' },
  action: { actuators: [], feedback: '' },
  characteristics: []
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [design, setDesign] = useState<AgentDesign>(DEFAULT_DESIGN);
  const [simRuns, setSimRuns] = useState(0);
  const [dailyMission, setDailyMission] = useState<string>("미션 로딩 중...");

  // Load state from local storage on mount
  useEffect(() => {
    const savedDesign = localStorage.getItem('water_agent_wizard_draft');
    if (savedDesign) setDesign(JSON.parse(savedDesign));
    
    const savedBadges = localStorage.getItem('water_agent_badges');
    if (savedBadges) setBadges(JSON.parse(savedBadges));

    // Fetch daily mission
    getDailyMission().then(setDailyMission);
  }, []);

  const saveDesign = (newDesign: AgentDesign) => {
    setDesign(newDesign);
    localStorage.setItem('water_agent_wizard_draft', JSON.stringify(newDesign));
    unlockBadge('b1'); // Rookie Architect
  };

  const unlockBadge = (id: string) => {
    setBadges(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, unlocked: true } : b);
      localStorage.setItem('water_agent_badges', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSimRun = () => {
    setSimRuns(r => r + 1);
    if (simRuns + 1 >= 5) unlockBadge('b2');
  };

  const handleWizardComplete = () => {
    unlockBadge('b3');
    alert("축하합니다! 설계를 완료했습니다. '공인 엔지니어' 배지를 획득했습니다.");
  };

  const handleQuizScore = (score: number) => {
    if (score >= 8) unlockBadge('b4');
  };

  const navItems = [
    { id: AppView.DASHBOARD, label: '대시보드', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: AppView.THEORY, label: '개념 학습', icon: <BookOpen className="w-5 h-5" /> },
    { id: AppView.WIZARD, label: '설계 위저드', icon: <PenTool className="w-5 h-5" /> },
    { id: AppView.SIMULATION, label: '시뮬레이션', icon: <PlayCircle className="w-5 h-5" /> },
    { id: AppView.QUIZ, label: '퀴즈', icon: <HelpCircle className="w-5 h-5" /> },
    { id: AppView.REFLECTION, label: '성찰하기', icon: <FileText className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return (
          <div className="animate-fadeIn space-y-8">
            <header className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
               <h1 className="text-3xl font-bold mb-2">환영합니다, 미래의 엔지니어님!</h1>
               <p className="opacity-90 max-w-2xl">
                 여러분의 임무: 우리 동네 하천의 수질을 감시하는 지능형 에이전트를 설계하세요. 
                 "감지-생각-행동(Sense-Think-Act)" 주기를 마스터하고 환경을 보호하세요.
               </p>
               <div className="mt-6 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium border border-white/30">
                 🎯 {dailyMission}
               </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map(badge => (
                 <div key={badge.id} className={`p-4 rounded-xl border-2 flex flex-col items-center text-center gap-2 transition-all ${badge.unlocked ? 'bg-white border-yellow-400 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60 grayscale'}`}>
                    <div className={`p-3 rounded-full ${badge.unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-400'}`}>
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800">{badge.name}</h3>
                    <p className="text-xs text-slate-500">{badge.description}</p>
                 </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">진행 상황</h2>
              <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span>설계 완성도</span>
                     <span className="font-bold">
                        {Math.round(Object.values(design.perception).filter(Boolean).length / 3 * 25 + (design.analysis.logic ? 25 : 0) + (design.reasoning.decision ? 25 : 0) + (design.action.actuators.length > 0 ? 25 : 0))}%
                     </span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                      className="h-full bg-blue-500" 
                      style={{width: `${Math.round(Object.values(design.perception).filter(Boolean).length / 3 * 25 + (design.analysis.logic ? 25 : 0) + (design.reasoning.decision ? 25 : 0) + (design.action.actuators.length > 0 ? 25 : 0))}%`}} 
                     />
                   </div>
                 </div>
                 <button 
                  onClick={() => setView(AppView.WIZARD)}
                  className="text-blue-600 text-sm font-bold hover:underline"
                 >
                   설계 계속하기 &rarr;
                 </button>
              </div>
            </div>
          </div>
        );
      case AppView.THEORY:
        return <Theory />;
      case AppView.SIMULATION:
        return <Simulation onRun={handleSimRun} />;
      case AppView.WIZARD:
        return <Wizard onComplete={handleWizardComplete} savedDesign={design} onSave={saveDesign} />;
      case AppView.QUIZ:
        return <Quiz onScoreUpdate={handleQuizScore} />;
      case AppView.REFLECTION:
        return <Reflection />;
      default:
        return <div>페이지를 찾을 수 없습니다</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
           <div className="bg-blue-500 p-2 rounded-lg">
             <Droplet className="w-6 h-6 text-white" />
           </div>
           <span className="font-bold text-lg tracking-tight">프로젝트 위저드</span>
           <button onClick={() => setMobileMenuOpen(false)} className="md:hidden ml-auto">
             <X className="w-6 h-6" />
           </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-800">
          <div className="text-xs text-slate-500">
             학생 모드 • v1.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 border-b flex justify-between items-center sticky top-0 z-40">
           <span className="font-bold text-slate-800">수질 관리 에이전트</span>
           <button onClick={() => setMobileMenuOpen(true)}>
             <Menu className="w-6 h-6 text-slate-600" />
           </button>
        </div>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;