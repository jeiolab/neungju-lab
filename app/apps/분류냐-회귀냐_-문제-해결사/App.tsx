import React, { useState } from 'react';
import Header from './components/Header';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabDeepDive from './components/TabDeepDive';
import TabQuiz from './components/TabQuiz';
import TabReflection from './components/TabReflection';
import MasteryChart from './components/MasteryChart';
import { TabType, AlgorithmType, MasteryStats } from './types';
import { BookOpen, Gamepad2, Search, CheckSquare, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.THEORY);
  const [mastery, setMastery] = useState<MasteryStats>({
    classificationCorrect: 0,
    classificationTotal: 0,
    regressionCorrect: 0,
    regressionTotal: 0,
  });

  const updateMastery = (type: AlgorithmType, isCorrect: boolean) => {
    setMastery(prev => ({
        ...prev,
        classificationTotal: type === AlgorithmType.CLASSIFICATION ? prev.classificationTotal + 1 : prev.classificationTotal,
        classificationCorrect: (type === AlgorithmType.CLASSIFICATION && isCorrect) ? prev.classificationCorrect + 1 : prev.classificationCorrect,
        regressionTotal: type === AlgorithmType.REGRESSION ? prev.regressionTotal + 1 : prev.regressionTotal,
        regressionCorrect: (type === AlgorithmType.REGRESSION && isCorrect) ? prev.regressionCorrect + 1 : prev.regressionCorrect,
    }));
  };

  const tabs = [
    { id: TabType.THEORY, label: '이론', icon: BookOpen },
    { id: TabType.SIMULATION, label: '게임', icon: Gamepad2 },
    { id: TabType.DEEP_DIVE, label: '심화', icon: Search },
    { id: TabType.QUIZ, label: '퀴즈', icon: CheckSquare },
    { id: TabType.REFLECTION, label: '생각', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      
      {/* Top Tab Navigation */}
      <div className="sticky top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 z-40">
        <div className="max-w-4xl mx-auto flex justify-around items-center">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                        activeTab === tab.id 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? 'stroke-2' : 'stroke-1.5'}`} />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
            ))}
        </div>
      </div>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
        {/* Mastery Chart - Always visible for quick feedback */}
        <div className="mb-6">
            <MasteryChart stats={mastery} />
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[500px]">
            {activeTab === TabType.THEORY && <TabTheory />}
            {activeTab === TabType.SIMULATION && <TabSimulation updateMastery={updateMastery} />}
            {activeTab === TabType.DEEP_DIVE && <TabDeepDive />}
            {activeTab === TabType.QUIZ && <TabQuiz updateMastery={updateMastery} />}
            {activeTab === TabType.REFLECTION && <TabReflection />}
        </div>
      </main>
    </div>
  );
};

export default App;
