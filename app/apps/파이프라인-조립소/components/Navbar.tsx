import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, BookOpen, Puzzle, GraduationCap, PenTool } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: '홈' },
    { view: AppView.THEORY, icon: BookOpen, label: '이론 학습' },
    { view: AppView.PUZZLE, icon: Puzzle, label: '조립 퍼즐' },
    { view: AppView.QUIZ, icon: GraduationCap, label: '퀴즈' },
    { view: AppView.REFLECTION, icon: PenTool, label: '적용하기' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg md:relative md:border-t-0 md:w-20 md:h-screen md:flex-col md:border-r z-50">
      <div className="flex justify-around md:flex-col md:justify-start md:h-full md:pt-6">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center justify-center p-3 md:py-6 md:px-2 w-full transition-colors ${
              currentView === item.view
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
