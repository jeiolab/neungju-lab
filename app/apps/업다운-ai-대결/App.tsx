import React, { useState } from 'react';
import { Tab } from './types';
import { APP_NAME } from './constants';
import Tabs from './components/Tabs';
import Theory from './components/Theory';
import Simulation from './components/Simulation';
import LearnMore from './components/LearnMore';
import Quiz from './components/Quiz';
import Think from './components/Think';
import { Binary } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Binary size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{APP_NAME}</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="transition-all duration-300">
          {activeTab === Tab.THEORY && <Theory />}
          {activeTab === Tab.SIMULATION && <Simulation />}
          {activeTab === Tab.LEARN_MORE && <LearnMore />}
          {activeTab === Tab.QUIZ && <Quiz />}
          {activeTab === Tab.THINK && <Think />}
        </div>
      </main>
    </div>
  );
};

export default App;