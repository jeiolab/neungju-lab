import React from 'react';
import { Search, BookOpen, Brain, Lightbulb } from 'lucide-react';

interface NavbarProps {
    currentTab: string;
    setTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
    const tabs = [
        { id: 'simulation', label: '탐정 모드', icon: Search },
        { id: 'theory', label: '사건 파일', icon: BookOpen },
        { id: 'quiz', label: '적성 검사', icon: Brain },
        { id: 'think', label: '싱크 탱크', icon: Lightbulb },
    ];

    return (
        <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                             <Search className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight hidden sm:block">정렬 탐정</span>
                    </div>
                    
                    <div className="flex space-x-1 sm:space-x-4">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = currentTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setTab(tab.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium
                                        ${isActive 
                                            ? 'bg-slate-900 text-blue-400 shadow-inner' 
                                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;