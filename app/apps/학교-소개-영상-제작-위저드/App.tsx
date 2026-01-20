import React, { useState, useEffect } from 'react';
import { Layout, BookOpen, Cpu, BrainCircuit, Trophy, Flame } from 'lucide-react';
import SimulationTab from './components/SimulationTab';
import TheoryTab from './components/TheoryTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { GameState, ProjectConfig, Task } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    badges: [],
    streak: 1,
    lastLogin: new Date().toISOString().split('T')[0],
    completedWizardSteps: 0
  });
  
  // Persisted Simulation State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [config, setConfig] = useState<ProjectConfig | null>(null);

  useEffect(() => {
    // Load state from localStorage on mount
    const savedGame = localStorage.getItem('vsw_gamestate');
    if (savedGame) {
      setGameState(JSON.parse(savedGame));
    }
    const savedProject = localStorage.getItem('vsw_project');
    if (savedProject) {
        const { tasks, config } = JSON.parse(savedProject);
        setTasks(tasks);
        setConfig(config);
    }
  }, []);

  const updateScore = (points: number, badge?: string) => {
    setGameState(prev => {
      const newBadges = badge && !prev.badges.includes(badge) ? [...prev.badges, badge] : prev.badges;
      const newState = {
        ...prev,
        score: prev.score + points,
        badges: newBadges
      };
      localStorage.setItem('vsw_gamestate', JSON.stringify(newState));
      return newState;
    });
  };

  const saveProjectData = (newTasks: Task[], newConfig: ProjectConfig) => {
    setTasks(newTasks);
    setConfig(newConfig);
    localStorage.setItem('vsw_project', JSON.stringify({ tasks: newTasks, config: newConfig }));
  };

  const tabs = [
    { id: 0, name: '개념 학습', icon: <BookOpen size={18} /> },
    { id: 1, name: '시뮬레이션', icon: <Cpu size={18} /> },
    { id: 2, name: '더 알아보기', icon: <BrainCircuit size={18} /> },
    { id: 3, name: '퀴즈', icon: <Trophy size={18} /> },
    { id: 4, name: '성찰 및 피드백', icon: <Layout size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                V
            </div>
            <h1 className="font-bold text-lg tracking-tight hidden md:block">학교 소개 영상 제작 위저드</h1>
            <h1 className="font-bold text-lg tracking-tight md:hidden">Video Sprint Wizard</h1>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                <Flame size={16} fill="currentColor" />
                <span>{gameState.streak}일 연속</span>
            </div>
            <div className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                <Trophy size={16} />
                <span>{gameState.score} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    {tab.icon}
                    {tab.name}
                </button>
            ))}
          </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        {activeTab === 0 && <TheoryTab />}
        {activeTab === 1 && (
            <SimulationTab 
                onScoreUpdate={updateScore} 
                saveData={saveProjectData} 
                savedTasks={tasks}
                savedConfig={config}
            />
        )}
        {activeTab === 2 && <DeepDiveTab />}
        {activeTab === 3 && <QuizTab onScoreUpdate={updateScore} />}
        {activeTab === 4 && <ReflectionTab tasks={tasks} config={config} />}
      </main>
    </div>
  );
};

export default App;