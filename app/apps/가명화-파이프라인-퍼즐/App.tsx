import React, { useState } from 'react';
import TabConcepts from './components/TabConcepts';
import TabPuzzle from './components/TabPuzzle';
import TabMetadata from './components/TabMetadata';
import TabQuiz from './components/TabQuiz';
import TabDesign from './components/TabDesign';
import { TabType } from './types';
import { BookOpen, Puzzle, FileJson, GraduationCap, PenTool, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('puzzle');

  const renderContent = () => {
    switch (activeTab) {
      case 'concepts': return <TabConcepts />;
      case 'puzzle': return <TabPuzzle />;
      case 'metadata': return <TabMetadata />;
      case 'quiz': return <TabQuiz />;
      case 'design': return <TabDesign />;
      default: return <TabPuzzle />;
    }
  };

  const navItems = [
    { id: 'concepts', label: '개념 학습', icon: BookOpen },
    { id: 'puzzle', label: '파이프라인 퍼즐', icon: Puzzle },
    { id: 'metadata', label: '메타데이터', icon: FileJson },
    { id: 'quiz', label: '퀴즈', icon: GraduationCap },
    { id: 'design', label: '프로젝트 설계', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
              가명화 파이프라인 퍼즐
            </h1>
          </div>
          
          <nav className="flex gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                <item.icon size={16} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <div className="animate-in fade-in zoom-in duration-300">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;