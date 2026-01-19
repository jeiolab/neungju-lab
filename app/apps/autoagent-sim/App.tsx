import React, { useState } from 'react';
import { Car } from 'lucide-react';
import { TabId } from './types';
import TabNavigation from './components/TabNavigation';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import InfoTab from './components/InfoTab';
import QuizTab from './components/QuizTab';
import EthicsTab from './components/EthicsTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Car size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AutoAgent Sim</h1>
              <p className="text-xs text-gray-500 font-medium">자율주행 의사결정 시뮬레이터</p>
            </div>
          </div>
          <div className="hidden md:block">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
        <div className="md:hidden px-4 pb-4">
           <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="min-h-[600px]">
          {activeTab === 'theory' && <TheoryTab />}
          {activeTab === 'simulation' && <SimulationTab />}
          {activeTab === 'info' && <InfoTab />}
          {activeTab === 'quiz' && <QuizTab />}
          {activeTab === 'ethics' && <EthicsTab />}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-gray-400 border-t border-gray-200 mt-12">
        <p>© 2024 AutoAgent Sim. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
