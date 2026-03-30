import React, { useState } from 'react';
import { Tab, UserStats } from './types';
import { CO2_PER_GB_GRAMS, CO2_PER_TREE_LEVEL_GRAMS } from './constants';
import Dashboard from './components/Dashboard';
import FileCleaner from './components/FileCleaner';
import EcoLibrary from './components/EcoLibrary';
import EcoQuiz from './components/EcoQuiz';
import CampaignGenerator from './components/CampaignGenerator';
import { LayoutDashboard, Trash2, BookOpen, BrainCircuit, Megaphone, Menu, X, Leaf } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navItems = [
    { id: Tab.DASHBOARD, label: '상황실', icon: <LayoutDashboard size={18} /> },
    { id: Tab.ACTION, label: '실천하기', icon: <Trash2 size={18} /> },
    { id: Tab.LIBRARY, label: '도서관', icon: <BookOpen size={18} /> },
    { id: Tab.QUIZ, label: '퀴즈', icon: <BrainCircuit size={18} /> },
    { id: Tab.CAMPAIGN, label: '캠페인', icon: <Megaphone size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600">
                  디지털 탄소 다이어트
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">데이터 청소로 탄소 발자국 줄이기</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;