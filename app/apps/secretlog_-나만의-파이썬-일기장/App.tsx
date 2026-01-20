import React, { useState, useEffect } from 'react';
import { Terminal, BookOpen, Cpu, Brain, Lock, ShieldCheck, Award } from 'lucide-react';
import ConceptView from './components/ConceptView';
import SimulationView from './components/SimulationView';
import AdvancedView from './components/AdvancedView';
import QuizView from './components/QuizView';
import AddonsView from './components/AddonsView';
import { TabType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [fileContent, setFileContent] = useState<string>("");
  const [streak, setStreak] = useState<number>(0);
  const [badges, setBadges] = useState<string[]>([]);
  
  // Game state shared across components
  const [hasSimulatedWrite, setHasSimulatedWrite] = useState(false);

  useEffect(() => {
    // Check for "Data Guardian" badge: File content length > 50 characters without reset
    if (fileContent.length > 100 && !badges.includes('데이터 수호자')) {
      setBadges(prev => [...prev, '데이터 수호자']);
    }
  }, [fileContent, badges]);

  const handleUpdateFile = (newContent: string, isAppend: boolean) => {
    setFileContent(newContent);
    if (isAppend) {
        setStreak(prev => prev + 1);
        if (!hasSimulatedWrite) setHasSimulatedWrite(true);
    } else {
        // Reset streak on overwrite if it wasn't empty
        if (fileContent.length > 0) {
           // A harsh lesson on 'w' mode!
        }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'concept':
        return <ConceptView />;
      case 'simulation':
        return (
          <SimulationView 
            fileContent={fileContent} 
            onUpdateFile={handleUpdateFile} 
          />
        );
      case 'advanced':
        return <AdvancedView />;
      case 'quiz':
        return <QuizView />;
      case 'addons':
        return <AddonsView fileContent={fileContent} setFileContent={setFileContent} />;
      default:
        return <SimulationView fileContent={fileContent} onUpdateFile={handleUpdateFile} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Terminal className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">SecretLog <span className="text-emerald-400 text-sm font-normal">v1.0</span></h1>
              <p className="text-xs text-slate-400">White Hat Hacker's Python Console</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-mono text-emerald-400">SYSTEM ONLINE</span>
            </div>
            {streak > 0 && (
                <div className="hidden sm:flex items-center space-x-1 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    <span className="text-xs font-bold">🔥 {streak} Day Streak</span>
                </div>
            )}
            {badges.map(badge => (
                 <div key={badge} className="hidden sm:flex items-center space-x-1 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                    <Award className="w-3 h-3" />
                    <span className="text-xs font-bold">{badge}</span>
                </div>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto no-scrollbar">
            <NavButton 
              active={activeTab === 'concept'} 
              onClick={() => setActiveTab('concept')} 
              icon={<BookOpen className="w-4 h-4" />} 
              label="이론 학습" 
            />
            <NavButton 
              active={activeTab === 'simulation'} 
              onClick={() => setActiveTab('simulation')} 
              icon={<Cpu className="w-4 h-4" />} 
              label="시뮬레이션" 
            />
            <NavButton 
              active={activeTab === 'advanced'} 
              onClick={() => setActiveTab('advanced')} 
              icon={<Brain className="w-4 h-4" />} 
              label="심화 학습" 
            />
            <NavButton 
              active={activeTab === 'quiz'} 
              onClick={() => setActiveTab('quiz')} 
              icon={<ShieldCheck className="w-4 h-4" />} 
              label="보안 퀴즈" 
            />
             <NavButton 
              active={activeTab === 'addons'} 
              onClick={() => setActiveTab('addons')} 
              icon={<Lock className="w-4 h-4" />} 
              label="추가 기능" 
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
      active
        ? 'border-emerald-500 text-emerald-400 bg-slate-800'
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
