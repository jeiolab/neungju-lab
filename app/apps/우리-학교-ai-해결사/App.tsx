import React, { useState, useEffect } from 'react';
import { UserStats, PortfolioItem, Problem, MLType } from './types';
import LevelBadge from './components/LevelBadge';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabDeepDive from './components/TabDeepDive';
import TabQuiz from './components/TabQuiz';
import TabThink from './components/TabThink';
import Portfolio from './components/Portfolio';
import { Layout, PenTool, BookOpen, BrainCircuit, Lightbulb, FolderKanban } from 'lucide-react';

const TABS = [
  { id: 'theory', label: '개념 학습', icon: BookOpen },
  { id: 'simulation', label: '프로젝트 설계', icon: PenTool },
  { id: 'deepdive', label: '더 알아보기', icon: BrainCircuit },
  { id: 'quiz', label: '퀴즈', icon: Layout },
  { id: 'think', label: '생각해보기', icon: Lightbulb },
  { id: 'portfolio', label: '나의 연구 노트', icon: FolderKanban },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [stats, setStats] = useState<UserStats>({
    level: '인턴',
    points: 0,
    projectsCompleted: 0
  });
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('aiSolver_stats');
    const savedPortfolio = localStorage.getItem('aiSolver_portfolio');
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('aiSolver_stats', JSON.stringify(stats));
    localStorage.setItem('aiSolver_portfolio', JSON.stringify(portfolio));
  }, [stats, portfolio]);

  const updateStats = (pointsToAdd: number, projectCompleted: boolean) => {
    setStats(prev => {
      const newPoints = prev.points + pointsToAdd;
      const newProjects = projectCompleted ? prev.projectsCompleted + 1 : prev.projectsCompleted;
      
      let newLevel = prev.level;
      if (newProjects >= 6) newLevel = '소장';
      else if (newProjects >= 3) newLevel = '연구원';

      return {
        level: newLevel,
        points: newPoints,
        projectsCompleted: newProjects
      };
    });
  };

  const handleSimulationComplete = (
    problem: Problem, 
    type: MLType, 
    features: string, 
    score: number, 
    feedback: string
  ) => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      problemTitle: problem.title,
      selectedType: type,
      features,
      score,
      feedback
    };

    setPortfolio(prev => [newItem, ...prev]);
    updateStats(score > 50 ? 20 : 5, true);
  };

  const handleQuizCorrect = () => {
    updateStats(10, false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <BrainCircuit size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">우리 학교 AI 해결사</h1>
          </div>
          <LevelBadge stats={stats} />
        </div>
        
        {/* Navigation */}
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <nav className="flex space-x-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'theory' && <TabTheory />}
        {activeTab === 'simulation' && <TabSimulation onComplete={handleSimulationComplete} />}
        {activeTab === 'deepdive' && <TabDeepDive />}
        {activeTab === 'quiz' && <TabQuiz onCorrectAnswer={handleQuizCorrect} />}
        {activeTab === 'think' && <TabThink />}
        {activeTab === 'portfolio' && <Portfolio items={portfolio} />}
      </main>
    </div>
  );
};

export default App;