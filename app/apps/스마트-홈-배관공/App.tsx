import React, { useState } from 'react';
import { BookOpen, Gamepad2, Radio, CheckSquare, MessageCircle, Hammer } from 'lucide-react';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabLearnMore from './components/TabLearnMore';
import TabQuiz from './components/TabQuiz';
import TabDiscussion from './components/TabDiscussion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <TabTheory />;
      case 1: return <TabSimulation />;
      case 2: return <TabLearnMore />;
      case 3: return <TabQuiz />;
      case 4: return <TabDiscussion />;
      default: return <TabSimulation />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                스마트 홈 배관공
              </span>
            </div>
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex space-x-1">
              {[
                { id: 0, label: '이론 학습', icon: BookOpen },
                { id: 1, label: '시뮬레이션', icon: Gamepad2 },
                { id: 2, label: '더 알아보기', icon: Radio },
                { id: 3, label: '퀴즈', icon: CheckSquare },
                { id: 4, label: '토론', icon: MessageCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center px-4 border-b-2 text-sm font-medium transition-colors h-16 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto border-t border-slate-100 no-scrollbar">
           {[
                { id: 0, label: '이론', icon: BookOpen },
                { id: 1, label: '실습', icon: Gamepad2 },
                { id: 2, label: '심화', icon: Radio },
                { id: 3, label: '퀴즈', icon: CheckSquare },
                { id: 4, label: '토론', icon: MessageCircle },
            ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] py-3 text-xs flex flex-col items-center justify-center border-b-2 ${
                 activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              {tab.label}
            </button>
            ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-6 px-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;