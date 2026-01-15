import React from 'react';
import { AppTab, ResearchState } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';
import { BookOpen, FlaskConical, ThermometerSun, GraduationCap, Info } from 'lucide-react';

interface HeaderProps {
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  researchState: ResearchState;
  onOpenGlossary: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, setTab, researchState, onOpenGlossary }) => {
  const progressPercent = Math.min(100, (researchState.xp / LEVEL_THRESHOLDS[researchState.level]) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <div className="bg-sky-500 p-2 rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">펭귄과 기후 연구소</h1>
              <p className="text-xs text-gray-500 font-medium">데이터 생태학 연구팀</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {[
              { id: AppTab.Guide, label: '가이드', icon: BookOpen },
              { id: AppTab.DataLab, label: '데이터 랩', icon: FlaskConical },
              { id: AppTab.Climate, label: '기후 타임머신', icon: ThermometerSun },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === item.id
                    ? 'bg-white text-sky-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Stats */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-gray-500 uppercase">연구원 레벨 {researchState.level}</div>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            <button 
              onClick={onOpenGlossary}
              className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
              title="용어 사전"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav (Simple strip) */}
      <div className="md:hidden flex justify-around border-t border-gray-100 py-2">
        <button onClick={() => setTab(AppTab.Guide)} className={`p-2 ${currentTab === AppTab.Guide ? 'text-sky-600' : 'text-gray-400'}`}><BookOpen size={20}/></button>
        <button onClick={() => setTab(AppTab.DataLab)} className={`p-2 ${currentTab === AppTab.DataLab ? 'text-sky-600' : 'text-gray-400'}`}><FlaskConical size={20}/></button>
        <button onClick={() => setTab(AppTab.Climate)} className={`p-2 ${currentTab === AppTab.Climate ? 'text-sky-600' : 'text-gray-400'}`}><ThermometerSun size={20}/></button>
      </div>
    </header>
  );
};

export default Header;