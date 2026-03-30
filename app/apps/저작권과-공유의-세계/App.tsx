import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabLearnMore from './components/TabLearnMore';
import TabQuiz from './components/TabQuiz';
import TabDiscussion from './components/TabDiscussion';
import { TabType } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('simulation');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
        {currentTab === 'theory' && <TabTheory />}
        {currentTab === 'simulation' && <TabSimulation />}
        {currentTab === 'learnMore' && <TabLearnMore />}
        {currentTab === 'quiz' && <TabQuiz />}
        {currentTab === 'discussion' && <TabDiscussion />}
      </main>
    </div>
  );
};

export default App;