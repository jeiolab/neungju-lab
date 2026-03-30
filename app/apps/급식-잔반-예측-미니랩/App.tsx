'use client';

import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Simulation from './pages/Simulation';
import Concepts from './pages/Concepts';
import Quiz from './pages/Quiz';
import Reflection from './pages/Reflection';
import { LayoutDashboard, BookOpen, Beaker, BrainCircuit, UserCheck } from 'lucide-react';

type TabType = 'home' | 'concepts' | 'simulation' | 'quiz' | 'reflection';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const tabs = [
    { id: 'home' as TabType, label: '홈', icon: LayoutDashboard },
    { id: 'concepts' as TabType, label: '개념', icon: BookOpen },
    { id: 'simulation' as TabType, label: '실험실', icon: Beaker },
    { id: 'quiz' as TabType, label: '퀴즈', icon: BrainCircuit },
    { id: 'reflection' as TabType, label: '성찰', icon: UserCheck },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'concepts':
        return <Concepts />;
      case 'simulation':
        return <Simulation />;
      case 'quiz':
        return <Quiz />;
      case 'reflection':
        return <Reflection />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}>
      {renderContent()}
    </Layout>
  );
};

export default App;
