import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Calculator, BrainCircuit, Trophy, History, Menu, X } from 'lucide-react';
import Simulation from './components/Simulation';
import ConceptCards from './components/ConceptCards';
import DeepDive from './components/DeepDive';
import Quiz from './components/Quiz';
import CriticalThinking from './components/CriticalThinking';
import { LogEntry, UserStats } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Simple Local State for gamification
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    badges: [],
    streak: 1,
    lastPlayed: new Date().toDateString()
  });
  
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const handleLogDecision = (entry: LogEntry) => {
    setLogs(prev => [entry, ...prev]);
  };

  const updateScore = (addedPoints: number) => {
    setUserStats(prev => {
      const newPoints = prev.points + addedPoints;
      const newBadges = [...prev.badges];
      
      if (newPoints >= 100 && !newBadges.includes('Junior Analyst')) {
        newBadges.push('Junior Analyst');
        alert("🎉 배지 획득! [Junior Analyst]");
      }
      if (newPoints >= 300 && !newBadges.includes('Cluster Master')) {
        newBadges.push('Cluster Master');
        alert("🎉 배지 획득! [Cluster Master]");
      }

      return {
        ...prev,
        points: newPoints,
        badges: newBadges
      };
    });
  };

  const tabs = [
    { id: 'concepts', label: '1. 개념 잡기', icon: <BookOpen size={18} /> },
    { id: 'simulation', label: '2. 시뮬레이션', icon: <Calculator size={18} /> },
    { id: 'deepdive', label: '3. 더 알아보기', icon: <BrainCircuit size={18} /> },
    { id: 'quiz', label: '4. 퀴즈', icon: <LayoutDashboard size={18} /> },
    { id: 'critical', label: '5. 생각해보기', icon: <Trophy size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Calculator size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Cluster Manager</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Choosing K is a Choice</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Gamification Stats */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-gray-500">Total Score</span>
              <span className="font-bold text-indigo-600">{userStats.points} pts</span>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-2">
           {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Content Rendering */}
        <div className="min-h-[500px]">
          {activeTab === 'concepts' && <ConceptCards />}
          {activeTab === 'simulation' && <Simulation onLogDecision={handleLogDecision} updateScore={updateScore} />}
          {activeTab === 'deepdive' && <DeepDive />}
          {activeTab === 'quiz' && <Quiz />}
          {activeTab === 'critical' && <CriticalThinking />}
        </div>

        {/* Logbook Sidebar / Bottom Section */}
        {activeTab === 'simulation' && logs.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
               <History size={20} /> 의사결정 로그북
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {logs.slice(0, 3).map((log) => (
                 <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-sm">
                   <div className="flex justify-between text-gray-400 text-xs mb-2">
                     <span>{log.timestamp}</span>
                     <span className="uppercase">{log.scenario}</span>
                   </div>
                   <div className="font-bold text-gray-800 mb-1">
                     K={log.k} <span className="text-indigo-500">({log.score}점)</span>
                   </div>
                   <p className="text-gray-600 truncate">"{log.feedback}"</p>
                 </div>
               ))}
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;