import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import RouterSettingsTab from './components/RouterSettingsTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';
import TipCard from './components/TipCard';
import { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [resolvedCount, setResolvedCount] = useState(0);
  const [collectedTips, setCollectedTips] = useState<string[]>([]);

  const handleSolve = () => {
    setResolvedCount(prev => prev + 1);
  };

  const handleCollectTip = (tip: string) => {
    if (!collectedTips.includes(tip)) {
      setCollectedTips(prev => [...prev, tip]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'theory':
        return <TheoryTab />;
      case 'simulation':
        return <SimulationTab onSolve={handleSolve} onCollectTip={handleCollectTip} />;
      case 'router':
        return <RouterSettingsTab />;
      case 'quiz':
        return <QuizTab />;
      case 'discussion':
        return <DiscussionTab />;
      default:
        return <TheoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} resolvedCount={resolvedCount} />
      
      <main className="mt-6 container mx-auto px-4">
        {renderContent()}
      </main>

      {/* Persistent Tip Collection Footer */}
      {collectedTips.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-none">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-slate-200 pointer-events-auto max-w-sm w-full">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">수집한 꿀팁 ({collectedTips.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
              {collectedTips.map((tip, idx) => (
                <TipCard key={idx} tip={tip} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;