import React, { useState } from 'react';
import { Tab } from './types';
import { TabTheory } from './components/TabTheory';
import { TabSimulation } from './components/TabSimulation';
import { TabMoreInfo } from './components/TabMoreInfo';
import { TabQuiz } from './components/TabQuiz';
import { TabDiscussion } from './components/TabDiscussion';
import { Wordbook } from './components/Wordbook';
import { Book, Activity, BrainCircuit, MessageSquare, Menu, BookOpen, Trophy, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('theory');
  const [wordbook, setWordbook] = useState<string[]>([]);
  const [isWordbookOpen, setIsWordbookOpen] = useState(false);
  const [combo, setCombo] = useState(0);
  const [mastery, setMastery] = useState<Record<string, number>>({});
  
  // Mobile menu state could be added here, but keeping it simple for now

  const toggleWordbookItem = (id: string) => {
    setWordbook(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleQuizAnswer = (correct: boolean, techId: string) => {
    if (correct) {
      setCombo(prev => prev + 1);
      setMastery(prev => ({
        ...prev,
        [techId]: Math.min((prev[techId] || 0) + 20, 100)
      }));
    } else {
      setCombo(0);
      setMastery(prev => ({
        ...prev,
        [techId]: Math.max((prev[techId] || 0) - 10, 0)
      }));
      // Auto add to wordbook if wrong
      if (!wordbook.includes(techId)) {
        toggleWordbookItem(techId);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'theory':
        return <TabTheory onToggleWordbook={toggleWordbookItem} wordbook={wordbook} />;
      case 'simulation':
        return <TabSimulation onSuccess={() => setCombo(c => c + 1)} />;
      case 'more':
        return <TabMoreInfo />;
      case 'quiz':
        return <TabQuiz onAnswer={handleQuizAnswer} mastery={mastery} />;
      case 'discussion':
        return <TabDiscussion />;
      default:
        return <TabTheory onToggleWordbook={toggleWordbookItem} wordbook={wordbook} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-indigo-400" />
            넷 커넥트
          </h1>
          <p className="text-xs text-slate-400 mt-1">네트워크 완전 정복</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-x-auto md:overflow-visible flex md:block">
          <button 
            onClick={() => setActiveTab('theory')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition ${activeTab === 'theory' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Book className="w-5 h-5" />
            <span>학습하기</span>
          </button>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition ${activeTab === 'simulation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Zap className="w-5 h-5" />
            <span>시뮬레이션</span>
          </button>
          <button 
            onClick={() => setActiveTab('more')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition ${activeTab === 'more' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Activity className="w-5 h-5" />
            <span>더 보기 (5G)</span>
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition ${activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <BrainCircuit className="w-5 h-5" />
            <span>퀴즈 도전</span>
          </button>
          <button 
            onClick={() => setActiveTab('discussion')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition ${activeTab === 'discussion' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>생각해보기 (AI)</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-700 bg-slate-800 md:block hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-300">연속 정답 (Combo)</span>
            <span className="bg-yellow-500 text-slate-900 px-2 py-0.5 rounded text-xs font-bold">{combo}</span>
          </div>
          <button 
            onClick={() => setIsWordbookOpen(true)}
            className="w-full mt-4 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition"
          >
            <BookOpen className="w-4 h-4" />
            나만의 단어장 ({wordbook.length})
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        {/* Mobile Header Stats */}
        <div className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center sticky top-0 z-40">
           <div className="flex items-center gap-2">
             <Trophy className="w-4 h-4 text-yellow-400" />
             <span className="font-bold">{combo} Combo</span>
           </div>
           <button onClick={() => setIsWordbookOpen(true)} className="p-2">
             <BookOpen className="w-5 h-5" />
           </button>
        </div>

        {renderContent()}
      </main>

      <Wordbook 
        isOpen={isWordbookOpen} 
        onClose={() => setIsWordbookOpen(false)} 
        savedIds={wordbook}
        onRemove={toggleWordbookItem}
      />
    </div>
  );
}
