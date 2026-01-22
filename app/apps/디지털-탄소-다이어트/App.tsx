import React, { useState } from 'react';
import { Tab, UserStats } from './types';
import { CO2_PER_GB_GRAMS, CO2_PER_TREE_LEVEL_GRAMS } from './constants';
import Dashboard from './components/Dashboard';
import FileCleaner from './components/FileCleaner';
import EcoLibrary from './components/EcoLibrary';
import EcoQuiz from './components/EcoQuiz';
import CampaignGenerator from './components/CampaignGenerator';
import { LayoutDashboard, Trash2, BookOpen, BrainCircuit, Megaphone } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [stats, setStats] = useState<UserStats>({
    totalSavedMB: 0,
    points: 0,
    treeLevel: 0,
    co2SavedGrams: 0,
    weeklyData: [
      { name: '월', savedMB: 120 },
      { name: '화', savedMB: 45 },
      { name: '수', savedMB: 200 },
      { name: '목', savedMB: 10 },
      { name: '금', savedMB: 0 },
      { name: '토', savedMB: 0 },
      { name: '일', savedMB: 0 },
    ],
  });

  const updateStats = (savedMB: number, points: number) => {
    setStats(prev => {
      const newSaved = prev.totalSavedMB + savedMB;
      const newCo2 = newSaved * (CO2_PER_GB_GRAMS / 1000); // MB to GB factor handled roughly here
      const newLevel = Math.floor(newCo2 / CO2_PER_TREE_LEVEL_GRAMS);
      
      // Update Friday data for demo purposes (simulating "Today")
      const newWeekly = [...prev.weeklyData];
      newWeekly[4].savedMB += savedMB;

      return {
        totalSavedMB: newSaved,
        points: prev.points + points,
        co2SavedGrams: newCo2,
        treeLevel: newLevel,
        weeklyData: newWeekly
      };
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard stats={stats} />;
      case Tab.ACTION:
        return <FileCleaner onUpdateStats={updateStats} />;
      case Tab.LIBRARY:
        return <EcoLibrary />;
      case Tab.QUIZ:
        return <EcoQuiz />;
      case Tab.CAMPAIGN:
        return <CampaignGenerator />;
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-green-50/50 text-gray-800 font-sans selection:bg-green-200">
      {/* Navbar */}
      <nav className="fixed bottom-0 md:bottom-auto md:top-0 w-full bg-white border-t md:border-b border-gray-200 z-50 px-4 md:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <h1 className="hidden md:block text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            디지털 탄소 다이어트
          </h1>
          
          <div className="flex w-full md:w-auto justify-between md:gap-8">
            <NavButton 
              active={activeTab === Tab.DASHBOARD} 
              onClick={() => setActiveTab(Tab.DASHBOARD)} 
              icon={<LayoutDashboard size={20} />} 
              label="상황실" 
            />
            <NavButton 
              active={activeTab === Tab.ACTION} 
              onClick={() => setActiveTab(Tab.ACTION)} 
              icon={<Trash2 size={20} />} 
              label="실천하기" 
            />
            <NavButton 
              active={activeTab === Tab.LIBRARY} 
              onClick={() => setActiveTab(Tab.LIBRARY)} 
              icon={<BookOpen size={20} />} 
              label="도서관" 
            />
            <NavButton 
              active={activeTab === Tab.QUIZ} 
              onClick={() => setActiveTab(Tab.QUIZ)} 
              icon={<BrainCircuit size={20} />} 
              label="퀴즈" 
            />
            <NavButton 
              active={activeTab === Tab.CAMPAIGN} 
              onClick={() => setActiveTab(Tab.CAMPAIGN)} 
              icon={<Megaphone size={20} />} 
              label="캠페인" 
            />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-6 pb-24 md:pt-24 md:pb-12 px-4 md:px-8 max-w-5xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

const NavButton: React.FC<{active: boolean; onClick: () => void; icon: React.ReactNode; label: string}> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 rounded-lg transition-all ${
      active ? 'text-green-600 md:bg-green-50' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    {icon}
    <span className="text-[10px] md:text-sm font-medium">{label}</span>
  </button>
);

export default App;