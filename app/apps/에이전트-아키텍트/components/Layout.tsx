import React from 'react';
import { TabConfig } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  tabs: TabConfig[];
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, tabs }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4F8]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 md:h-20 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Agent<span className="text-indigo-600">Architect</span></h1>
           </div>
           
           <nav className="hidden md:flex gap-2">
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-5 py-2.5 rounded-xl text-base font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                 >
                    {tab.label}
                 </button>
              ))}
           </nav>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto scrollbar-hide border-t border-slate-100 bg-white">
           {tabs.map(tab => (
              <button
                 key={tab.id}
                 onClick={() => onTabChange(tab.id)}
                 className={`flex-shrink-0 px-5 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500'}`}
              >
                 <span className="flex items-center gap-2">
                    {tab.icon} {tab.label}
                 </span>
              </button>
           ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-10">
        {children}
      </main>
      
      <footer className="bg-slate-800 text-slate-400 py-8 text-center text-sm">
        <p>© 2025 Agent Architect. 미래의 혁신가들을 위해 만들어졌습니다.</p>
      </footer>
    </div>
  );
};

export default Layout;