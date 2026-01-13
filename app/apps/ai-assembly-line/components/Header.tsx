import React from 'react';
import { Bot, FileText, Settings, PlayCircle, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'manual', label: '공정 매뉴얼', icon: FileText },
    { id: 'assembly', label: '조립 라인', icon: Settings },
    { id: 'simulation', label: '실전 예측', icon: PlayCircle },
    { id: 'quiz', label: '오개념 수리공', icon: GraduationCap },
  ];

  return (
    <header className="bg-factory-900 text-white shadow-lg z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight leading-none">AI PROCESS</h1>
            <span className="text-xs text-factory-400 font-medium tracking-widest">ASSEMBLY LINE</span>
          </div>
        </div>

        <nav className="hidden md:flex gap-1 bg-factory-800 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${currentTab === tab.id 
                  ? 'bg-factory-600 text-white shadow-sm' 
                  : 'text-factory-400 hover:text-white hover:bg-factory-700'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        
        {/* Mobile View Tab Indicators (Simplified) */}
        <div className="md:hidden text-xs text-factory-400">
           {tabs.find(t => t.id === currentTab)?.label}
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto bg-factory-800 border-t border-factory-700">
        {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-xs
                ${currentTab === tab.id ? 'text-blue-400 bg-factory-700' : 'text-factory-500'}
              `}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              {tab.label.split(' ')[0]}
            </button>
          ))}
      </div>
    </header>
  );
};

export default Header;