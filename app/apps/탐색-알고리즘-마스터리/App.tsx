import React, { useState, useEffect } from 'react';
import { getStoredState, saveState } from './services/storageService';
import { UserState } from './types';
import GamificationBar from './components/GamificationBar';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import MoreInfoTab from './components/MoreInfoTab';
import QuizTab from './components/QuizTab';
import ThinkTab from './components/ThinkTab';
import { BookOpen, Search, HelpCircle, GraduationCap, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [userState, setUserState] = useState<UserState>(getStoredState());

  useEffect(() => {
    // Save state whenever it changes
    saveState(userState);
  }, [userState]);

  const handleUpdateState = (newState: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...newState }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'theory':
        return <TheoryTab userState={userState} onUpdateState={handleUpdateState} />;
      case 'simulation':
        return <SimulationTab />;
      case 'more':
        return <MoreInfoTab />;
      case 'quiz':
        return <QuizTab userState={userState} onUpdateState={setUserState} />;
      case 'think':
        return <ThinkTab />;
      default:
        return <TheoryTab userState={userState} onUpdateState={handleUpdateState} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <GamificationBar userState={userState} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation for Mobile / Tab Bar for Desktop */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button 
            onClick={() => setActiveTab('theory')}
            className={`flex flex-col items-center py-3 px-2 flex-1 ${activeTab === 'theory' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">개념</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`flex flex-col items-center py-3 px-2 flex-1 ${activeTab === 'simulation' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">실험</span>
          </button>

           <button 
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center py-3 px-2 flex-1 ${activeTab === 'more' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <Layout className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">더보기</span>
          </button>

          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center py-3 px-2 flex-1 ${activeTab === 'quiz' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <HelpCircle className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">퀴즈</span>
          </button>

          <button 
            onClick={() => setActiveTab('think')}
            className={`flex flex-col items-center py-3 px-2 flex-1 ${activeTab === 'think' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <GraduationCap className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">사고력</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
