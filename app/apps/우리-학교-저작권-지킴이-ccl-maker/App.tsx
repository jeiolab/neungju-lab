import React, { useState } from 'react';
import { TabType } from './types';
import CopyrightClassroom from './components/CopyrightClassroom';
import LicenseWizard from './components/LicenseWizard';
import CitationTool from './components/CitationTool';
import CopyrightQuiz from './components/CopyrightQuiz';
import Gallery from './components/Gallery';
import QABot from './components/QABot';
import { Shield, BookOpen, PenTool, HelpCircle, Image, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wizard');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'classroom', label: '저작권 교실', icon: <BookOpen size={18} /> },
    { id: 'wizard', label: '라이선스 만들기', icon: <Shield size={18} /> },
    { id: 'citation', label: '올바른 인용', icon: <PenTool size={18} /> },
    { id: 'quiz', label: '퀴즈', icon: <HelpCircle size={18} /> },
    { id: 'gallery', label: '갤러리', icon: <Image size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'classroom': return <CopyrightClassroom />;
      case 'wizard': return <LicenseWizard />;
      case 'citation': return <CitationTool />;
      case 'quiz': return <CopyrightQuiz />;
      case 'gallery': return <Gallery />;
      default: return <LicenseWizard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 hidden sm:block">
              우리 학교 저작권 지킴이
            </h1>
            <h1 className="text-lg font-bold text-blue-700 sm:hidden">CCL Maker</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Mobile Navigation (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 z-40 safe-area-bottom">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg flex-1 ${
              activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      <QABot />
    </div>
  );
};

export default App;