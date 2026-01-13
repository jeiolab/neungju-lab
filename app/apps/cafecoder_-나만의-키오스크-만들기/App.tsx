import React, { useState, useEffect } from 'react';
import { Coffee, Terminal, PenTool, FolderOpen, Award } from 'lucide-react';
import { BADGES } from './constants';
import { FileSystem, Badge, TabType } from './types';

// Components
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabEscapeTest from './components/TabEscapeTest';
import TabQuiz from './components/TabQuiz';
import TabExplorer from './components/TabExplorer';
import BadgeDisplay from './components/BadgeDisplay';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  
  // Persistent File System using State (could use localStorage in real effect)
  const [fileSystem, setFileSystem] = useState<FileSystem>(() => {
    const saved = localStorage.getItem('cafe_fs');
    return saved ? JSON.parse(saved) : {};
  });

  // Save FS to localStorage
  useEffect(() => {
    localStorage.setItem('cafe_fs', JSON.stringify(fileSystem));
  }, [fileSystem]);

  // Unlock badge helper
  const unlockBadge = (id: string) => {
    setBadges(prev => prev.map(b => 
      b.id === id && !b.earned ? { ...b, earned: true } : b
    ));
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '이론 학습', icon: <Terminal size={18} /> },
    { id: 'simulation', label: '키오스크 실습', icon: <Coffee size={18} /> },
    { id: 'escape', label: '포매팅 실험', icon: <PenTool size={18} /> },
    { id: 'quiz', label: '퀴즈', icon: <Award size={18} /> },
    { id: 'explorer', label: '파일 탐색기', icon: <FolderOpen size={18} /> },
  ];

  return (
    <div className="h-screen flex flex-col bg-coffee-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-coffee-200 shadow-sm z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-coffee-600 text-white p-2 rounded-lg">
              <Coffee size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">CafeCoder</h1>
              <p className="text-xs text-coffee-600 font-medium">System Engineer Mode</p>
            </div>
          </div>
          
          <BadgeDisplay badges={badges} />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar Nav (Desktop) */}
        <nav className="hidden md:flex flex-col w-64 bg-white border-r border-coffee-200 p-4 gap-2">
           <div className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Project Modules</div>
           {navItems.map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                 activeTab === item.id 
                   ? 'bg-coffee-100 text-coffee-800 shadow-sm ring-1 ring-coffee-200' 
                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
               }`}
             >
               {item.icon}
               {item.label}
             </button>
           ))}
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative bg-white md:bg-transparent">
          {activeTab === 'theory' && <TabTheory />}
          {activeTab === 'simulation' && (
            <TabSimulation 
              fileSystem={fileSystem}
              setFileSystem={setFileSystem}
              onOrderComplete={() => unlockBadge('best_employee')}
              onFileSave={() => unlockBadge('data_manager')}
            />
          )}
          {activeTab === 'escape' && <TabEscapeTest />}
          {activeTab === 'quiz' && (
            <TabQuiz 
              onAllCorrect={() => unlockBadge('python_master')}
              badges={badges} 
            />
          )}
          {activeTab === 'explorer' && (
            <TabExplorer 
              fileSystem={fileSystem} 
              setFileSystem={setFileSystem}
            />
          )}
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden bg-white border-t border-gray-200 shrink-0">
        <div className="flex justify-around p-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium ${
                 activeTab === item.id 
                   ? 'text-coffee-600 bg-coffee-50' 
                   : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;