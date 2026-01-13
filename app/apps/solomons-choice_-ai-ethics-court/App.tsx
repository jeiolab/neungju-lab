import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TabTheory } from './components/TabTheory';
import { TabSimulation } from './components/TabSimulation';
import { TabLearnMore } from './components/TabLearnMore';
import { TabQuiz } from './components/TabQuiz';
import { TabThink } from './components/TabThink';
import { TabId, UserStats, EthicsPropensity } from './types';
import { Book, PlayCircle, Library, PenTool, BrainCircuit } from 'lucide-react';

const INITIAL_STATS: UserStats = {
  safetyScore: 50,
  innovationScore: 50,
  ethicsLevel: 1,
  casesSolved: 0,
  quizScore: 0,
};

function App() {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.THEORY);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [completedCases, setCompletedCases] = useState<number[]>([]);
  const [propensity, setPropensity] = useState<EthicsPropensity>(EthicsPropensity.BALANCED);

  // Recalculate propensity whenever scores change
  useEffect(() => {
    if (stats.safetyScore > stats.innovationScore + 10) {
      setPropensity(EthicsPropensity.SAFETY_FIRST);
    } else if (stats.innovationScore > stats.safetyScore + 10) {
      setPropensity(EthicsPropensity.INNOVATION_FIRST);
    } else {
      setPropensity(EthicsPropensity.BALANCED);
    }
  }, [stats.safetyScore, stats.innovationScore]);

  // Level up logic
  useEffect(() => {
    const totalActivity = stats.casesSolved * 10 + stats.quizScore;
    const newLevel = Math.floor(totalActivity / 50) + 1;
    if (newLevel !== stats.ethicsLevel) {
      setStats(prev => ({ ...prev, ethicsLevel: newLevel }));
    }
  }, [stats.casesSolved, stats.quizScore]);

  const handleDecision = (safetyDelta: number, innovationDelta: number) => {
    setStats(prev => ({
      ...prev,
      safetyScore: Math.max(0, Math.min(100, prev.safetyScore + safetyDelta)),
      innovationScore: Math.max(0, Math.min(100, prev.innovationScore + innovationDelta)),
      casesSolved: prev.casesSolved + 1,
    }));
    
    // Use the length of completedCases array to track ID. 
    // In a real app, we'd pass the specific ID, but here sequential is fine.
    setCompletedCases(prev => [...prev, prev.length + 1]);
  };

  const handleQuizComplete = (score: number) => {
    setStats(prev => ({
      ...prev,
      quizScore: Math.max(prev.quizScore, score) // Keep highest score
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TabId.THEORY:
        return <TabTheory />;
      case TabId.SIMULATION:
        return <TabSimulation onDecision={handleDecision} completedCases={completedCases} />;
      case TabId.LEARN_MORE:
        return <TabLearnMore />;
      case TabId.QUIZ:
        return <TabQuiz onQuizComplete={handleQuizComplete} />;
      case TabId.THINK:
        return <TabThink />;
      default:
        return <TabTheory />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-900 pb-20">
      <Header stats={stats} propensity={propensity} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {[
            { id: TabId.THEORY, label: '이론 개념', icon: <Book size={18} /> },
            { id: TabId.SIMULATION, label: '모의 재판', icon: <PlayCircle size={18} /> },
            { id: TabId.LEARN_MORE, label: '더 알아보기', icon: <Library size={18} /> },
            { id: TabId.QUIZ, label: '퀴즈', icon: <PenTool size={18} /> },
            { id: TabId.THINK, label: '생각해볼 문제', icon: <BrainCircuit size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-law-blue text-white shadow-md'
                  : 'bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-8 text-sm">
        <p>© 2024 AI Ethics Education Platform. Educational Purpose Only.</p>
        <p className="mt-1 text-xs">Based on Visang & Eobooks High School Textbooks</p>
      </footer>
    </div>
  );
}

export default App;
