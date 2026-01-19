import React, { useState, useEffect } from 'react';
import { BookOpen, PenTool, Layout as LayoutIcon, HelpCircle, BrainCircuit } from 'lucide-react';
import Layout from './components/Layout';
import TabTheory from './components/TabTheory';
import TabGenerator from './components/TabGenerator';
import TabGallery from './components/TabGallery';
import TabQuiz from './components/TabQuiz';
import TabThink from './components/TabThink';
import { Agent, TabConfig } from './types';
import { MOCK_AGENTS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [agents, setAgents] = useState<Agent[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('agent_architect_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAgents([...MOCK_AGENTS, ...parsed]);
      } catch (e) {
        setAgents(MOCK_AGENTS);
      }
    } else {
      setAgents(MOCK_AGENTS);
    }
  }, []);

  const saveAgent = (newAgent: Agent) => {
    // Filter out mocks when saving to local storage
    const userAgents = agents.filter(a => !a.id.startsWith('mock-'));
    const updatedUserAgents = [...userAgents, newAgent];
    
    setAgents([...MOCK_AGENTS, ...updatedUserAgents]);
    localStorage.setItem('agent_architect_data', JSON.stringify(updatedUserAgents));
    setActiveTab('gallery');
  };

  const deleteAgent = (id: string) => {
    if (id.startsWith('mock-')) return;
    const userAgents = agents.filter(a => !a.id.startsWith('mock-') && a.id !== id);
    setAgents([...MOCK_AGENTS, ...userAgents]);
    localStorage.setItem('agent_architect_data', JSON.stringify(userAgents));
  };

  const tabs: TabConfig[] = [
    { id: 'theory', label: '이론 (Theory)', icon: <BookOpen size={16} /> },
    { id: 'generator', label: '제작 (Simulation)', icon: <PenTool size={16} /> },
    { id: 'gallery', label: '갤러리 (Gallery)', icon: <LayoutIcon size={16} /> },
    { id: 'quiz', label: '퀴즈 (Quiz)', icon: <HelpCircle size={16} /> },
    { id: 'think', label: '생각해보기 (Think)', icon: <BrainCircuit size={16} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TabTheory />;
      case 'generator': return <TabGenerator onSave={saveAgent} />;
      case 'gallery': return <TabGallery agents={agents} onDelete={deleteAgent} />;
      case 'quiz': return <TabQuiz />;
      case 'think': return <TabThink agents={agents} />;
      default: return <TabTheory />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs}>
      {renderContent()}
    </Layout>
  );
};

export default App;