import React, { useState } from 'react';
import Header from './components/Header';
import ManualTab from './components/ManualTab';
import AssemblyTab from './components/AssemblyTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('assembly'); // Default to the game

  const renderTab = () => {
    switch (currentTab) {
      case 'manual': return <ManualTab />;
      case 'assembly': return <AssemblyTab />;
      case 'simulation': return <SimulationTab />;
      case 'quiz': return <QuizTab />;
      default: return <AssemblyTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-factory-100 font-sans">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="flex-1 overflow-hidden p-2 md:p-6 relative">
        <div className="h-full max-w-7xl mx-auto w-full">
            {renderTab()}
        </div>
      </main>
      
      <style>{`
        .striped-bg {
          background-image: repeating-linear-gradient(
            45deg,
            #fbbf24,
            #fbbf24 10px,
            #f59e0b 10px,
            #f59e0b 20px
          );
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animation-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;