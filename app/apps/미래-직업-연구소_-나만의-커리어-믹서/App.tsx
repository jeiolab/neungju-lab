import React, { useState, useEffect } from 'react';
import { Briefcase, Zap, Book, HelpCircle, LayoutTemplate } from 'lucide-react';
import TabEvolution from './components/TabEvolution';
import TabMixer from './components/TabMixer';
import TabDictionary from './components/TabDictionary';
import TabQuiz from './components/TabQuiz';
import TabBusinessCard from './components/TabBusinessCard';
import { TabType, JobResult } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('evolution');
  const [savedJobs, setSavedJobs] = useState<JobResult[]>([]);

  useEffect(() => {
    // Load saved jobs from local storage on mount
    const stored = localStorage.getItem('future_jobs');
    if (stored) {
      setSavedJobs(JSON.parse(stored));
    }
  }, []);

  const handleJobCreated = (job: JobResult) => {
    const updated = [job, ...savedJobs];
    setSavedJobs(updated);
    localStorage.setItem('future_jobs', JSON.stringify(updated));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'evolution': return <TabEvolution />;
      case 'mixer': return <TabMixer onJobCreated={handleJobCreated} />;
      case 'dictionary': return <TabDictionary />;
      case 'quiz': return <TabQuiz />;
      case 'card': return <TabBusinessCard savedJobs={savedJobs} />;
      default: return <TabEvolution />;
    }
  };

  const NavItem = ({ id, label, icon }: { id: TabType, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center gap-1 p-2 min-w-[60px] md:min-w-[80px] rounded-xl transition-all ${
        activeTab === id 
          ? 'text-indigo-600 bg-indigo-50 font-bold' 
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span className="text-[10px] md:text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => setActiveTab('evolution')}>
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight cursor-pointer">
              미래 직업 연구소
            </h1>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1">
            <button 
              onClick={() => setActiveTab('evolution')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'evolution' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900'}`}
            >
              직업의 변화
            </button>
            <button 
              onClick={() => setActiveTab('mixer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'mixer' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900'}`}
            >
              커리어 믹서
            </button>
            <button 
              onClick={() => setActiveTab('dictionary')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dictionary' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900'}`}
            >
              직업 사전
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'quiz' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900'}`}
            >
              진로 퀴즈
            </button>
            <button 
              onClick={() => setActiveTab('card')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'card' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900'}`}
            >
              내 명함
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:py-8">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center z-50">
        <NavItem id="evolution" label="변화" icon={<Briefcase className="w-5 h-5" />} />
        <NavItem id="mixer" label="믹서" icon={<Zap className="w-5 h-5" />} />
        <NavItem id="dictionary" label="사전" icon={<Book className="w-5 h-5" />} />
        <NavItem id="quiz" label="퀴즈" icon={<HelpCircle className="w-5 h-5" />} />
        <NavItem id="card" label="명함" icon={<LayoutTemplate className="w-5 h-5" />} />
      </nav>
    </div>
  );
};

export default App;