import React from 'react';
import { TabType } from '../types';
import { Network, BookOpen, MessageSquare, ShieldCheck, Settings, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  resolvedCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, resolvedCount }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '이론 개념', icon: <BookOpen size={18} /> },
    { id: 'simulation', label: '시뮬레이션', icon: <MessageSquare size={18} /> },
    { id: 'router', label: '공유기 설정', icon: <Settings size={18} /> },
    { id: 'quiz', label: 'OX 퀴즈', icon: <HelpCircle size={18} /> },
    { id: 'discussion', label: '토론', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Network size={24} />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">NetFixer</span>
          </div>

          <div className="hidden md:flex space-x-1 h-full items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium
                  ${activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center">
             <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 border border-slate-200">
                해결한 의뢰: <span className="text-blue-600 text-base">{resolvedCount}</span>
             </div>
          </div>
        </div>
        
        {/* Mobile Menu (Simplified for this demo) */}
        <div className="md:hidden flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
           {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-2 text-xs font-medium rounded-md
                  ${activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 bg-slate-50'
                  }`}
              >
                {item.label}
              </button>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;