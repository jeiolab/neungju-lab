import React, { useState, useEffect } from 'react';
import { WizardData, UserProgress, AppView, Capability } from './types';
import { INITIAL_CAPABILITIES, THEORY_CARDS, RESOURCE_LINKS } from './constants';
import { Dashboard } from './components/Dashboard';
import { Wizard } from './components/Wizard';
import { Quiz } from './components/Quiz';
import { Simulation } from './components/Simulation';
import { Report } from './components/Report';

// LocalStorage Keys
const DATA_KEY = 'careerWizard_v1_data';
const PROGRESS_KEY = 'careerWizard_v1_progress';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // State Initialization
  const [data, setData] = useState<WizardData>(() => {
    const saved = localStorage.getItem(DATA_KEY);
    return saved ? JSON.parse(saved) : {
      targetJob: '',
      jobReason: '',
      capabilities: INITIAL_CAPABILITIES,
      requirements: '',
      duties: '',
      longTermGoal: '',
      searchWhere: '',
      searchWhen: '',
      searchWhat: '',
      failureScenario: '',
      contingencyPlan: ''
    };
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      streak: 1,
      badges: [],
      completedSteps: [],
      quizScore: 0
    };
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  // Handlers
  const handleWizardUpdate = (newData: WizardData) => {
    setData(newData);
  };

  const handleStepComplete = (step: number) => {
    if (!progress.completedSteps.includes(step)) {
      const newXP = progress.xp + 50;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newCompleted = [...progress.completedSteps, step];
      let newBadges = [...progress.badges];
      
      if (newCompleted.length === 4 && !newBadges.includes('completed_wizard')) {
        newBadges.push('completed_wizard');
      }

      setProgress({
        ...progress,
        xp: newXP,
        level: newLevel,
        completedSteps: newCompleted,
        badges: newBadges
      });
    }
  };

  const handleQuizComplete = (score: number) => {
    let newBadges = [...progress.badges];
    if (score >= 3 && !newBadges.includes('quiz_whiz')) {
      newBadges.push('quiz_whiz');
    }
    
    setProgress({
      ...progress,
      xp: progress.xp + (score * 10),
      quizScore: score,
      badges: newBadges
    });
  };

  const renderContent = () => {
    switch(currentView) {
      case AppView.DASHBOARD:
        return <Dashboard progress={progress} onChangeView={setCurrentView} />;
      
      case AppView.WIZARD:
        return (
          <div className="space-y-4">
            <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="text-slate-500 hover:text-blue-600 mb-4 flex items-center text-sm">← 메인으로 돌아가기</button>
            <Wizard 
              data={data} 
              onUpdate={handleWizardUpdate} 
              onCompleteStep={handleStepComplete}
              onFinish={() => setCurrentView(AppView.REPORT)}
            />
          </div>
        );

      case AppView.THEORY:
        return (
          <div className="animate-fade-in">
             <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="text-slate-500 hover:text-blue-600 mb-6 flex items-center text-sm">← 메인으로 돌아가기</button>
             <h2 className="text-2xl font-bold text-slate-800 mb-6">📚 진로 설계 필수 개념</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {THEORY_CARDS.map((card, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <h3 className="font-bold text-lg mb-2 text-slate-800">{card.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{card.content}</p>
                  </div>
                ))}
             </div>
             <div className="mt-8 bg-blue-50 p-6 rounded-xl">
               <h3 className="font-bold text-blue-800 mb-4">🔗 유용한 탐색 채널 (More Info)</h3>
               <div className="flex gap-4 flex-wrap">
                 {RESOURCE_LINKS.map((link, idx) => (
                   <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="block bg-white px-4 py-3 rounded-lg border border-blue-100 shadow-sm hover:border-blue-300 transition-colors">
                     <span className="font-bold text-blue-600 block">{link.name}</span>
                     <span className="text-xs text-slate-500">{link.desc}</span>
                   </a>
                 ))}
               </div>
             </div>
          </div>
        );

      case AppView.QUIZ:
        return (
          <div>
            <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="text-slate-500 hover:text-blue-600 mb-6 flex items-center text-sm">← 메인으로 돌아가기</button>
            <Quiz onComplete={handleQuizComplete} />
          </div>
        );
      
      case AppView.SIMULATION:
        return (
          <div>
             <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="text-slate-500 hover:text-blue-600 mb-6 flex items-center text-sm">← 메인으로 돌아가기</button>
             <Simulation />
          </div>
        );

      case AppView.REPORT:
        return (
          <div>
            <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="no-print text-slate-500 hover:text-blue-600 mb-6 flex items-center text-sm">← 메인으로 돌아가기</button>
            <Report data={data} onUpdate={setData} />
          </div>
        );
      
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600 flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(AppView.DASHBOARD)}>
            <span>🧭</span> 진로 설계 위저드
          </div>
          {currentView !== AppView.DASHBOARD && (
             <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
               Lv.{progress.level}
             </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
