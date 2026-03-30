import React, { useState, useEffect } from 'react';
import { Tab, GalleryItem } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ThinkTab from './components/ThinkTab';
import LearnMoreTab from './components/LearnMoreTab';
import GalleryTab from './components/GalleryTab';
import { Sparkles, BookOpen, PenTool, Layout, Lightbulb, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Load gallery from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('graphWizardGallery');
    if (saved) {
      setGalleryItems(JSON.parse(saved));
    }
  }, []);

  // Save gallery to localStorage on update
  useEffect(() => {
    localStorage.setItem('graphWizardGallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  const addToGallery = (item: GalleryItem) => {
    setGalleryItems(prev => [item, ...prev]);
  };

  const removeFromGallery = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const navItems = [
    { id: Tab.THEORY, label: '시각화 도감', icon: <BookOpen size={18} /> },
    { id: Tab.SIMULATION, label: '실습(Wizard)', icon: <Sparkles size={18} /> },
    { id: Tab.LEARN_MORE, label: '더 알아보기', icon: <Layout size={18} /> },
    { id: Tab.QUIZ, label: '퀴즈', icon: <PenTool size={18} /> },
    { id: Tab.THINK, label: '생각해볼 문제', icon: <Lightbulb size={18} /> },
    { id: Tab.GALLERY, label: '갤러리', icon: <ImageIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-purple-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(Tab.THEORY)}>
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 p-2 rounded-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              Graph Wizard
            </h1>
          </div>
          
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Icon could go here */}
        </div>
        
        {/* Mobile Nav Scrollable */}
        <div className="md:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-t border-slate-800 bg-slate-900 no-scrollbar">
          <div className="flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  activeTab === item.id
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden">
        {/* Magical Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[128px]"></div>
        </div>

        <div className="relative z-10 py-6 animate-fade-in">
          {activeTab === Tab.THEORY && <TheoryTab />}
          {activeTab === Tab.SIMULATION && <SimulationTab onSaveGallery={addToGallery} />}
          {activeTab === Tab.QUIZ && <QuizTab />}
          {activeTab === Tab.THINK && <ThinkTab />}
          {activeTab === Tab.LEARN_MORE && <LearnMoreTab />}
          {activeTab === Tab.GALLERY && <GalleryTab items={galleryItems} onDelete={removeFromGallery} />}
        </div>
      </main>
    </div>
  );
};

export default App;
