import React, { useState } from 'react';
import Simulation from './components/Simulation';
import SecurityCenter from './components/SecurityCenter';
import ThreatEncyclopedia from './components/ThreatEncyclopedia';
import SecurityQuiz from './components/SecurityQuiz';
import Discussion from './components/Discussion';
import { ThreatRecord } from './types';
import { Shield, Smartphone, Book, BrainCircuit, MessageSquare, AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(2); // Default to Simulation
  const [score, setScore] = useState(0);
  const [infectionLevel, setInfectionLevel] = useState(0);
  const [threatRecords, setThreatRecords] = useState<ThreatRecord[]>([]);

  const handleRecordThreat = (record: ThreatRecord) => {
    setThreatRecords(prev => [record, ...prev]);
  };

  const updateScore = (points: number) => {
    setScore(prev => Math.max(0, prev + points));
  };

  const updateInfection = (amount: number) => {
    // If amount is negative (reset), set to 0. Otherwise clamp between 0 and 100.
    if (amount === -100) {
        setInfectionLevel(0);
    } else {
        setInfectionLevel(prev => Math.min(100, Math.max(0, prev + amount)));
    }
  };

  const navItems = [
    { id: 1, label: '보안 센터', icon: <Shield size={20} /> },
    { id: 2, label: '실전 방어', icon: <Smartphone size={20} /> },
    { id: 3, label: '위협 도감', icon: <Book size={20} /> },
    { id: 4, label: '보안 퀴즈', icon: <BrainCircuit size={20} /> },
    { id: 5, label: '생각해보기', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <Shield size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Smishing Defense</h1>
                    <p className="text-xs text-slate-400">내 폰을 지켜라!</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center space-x-6 bg-slate-900 px-6 py-2 rounded-full border border-slate-700">
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400">보안 점수</span>
                    <span className="font-mono font-bold text-emerald-400 text-lg">{score} pts</span>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div className="flex flex-col w-32">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">감염도</span>
                        <span className={`${infectionLevel > 50 ? 'text-red-500' : 'text-blue-400'} font-bold`}>{infectionLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${infectionLevel > 80 ? 'bg-red-600 animate-pulse' : infectionLevel > 40 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                            style={{ width: `${infectionLevel}%` }}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 overflow-x-auto">
        <div className="container mx-auto px-4 flex space-x-1 min-w-max">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-200 ${
                        activeTab === item.id 
                        ? 'border-indigo-500 text-indigo-400 bg-slate-800' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        {activeTab === 1 && <SecurityCenter />}
        {activeTab === 2 && (
            <Simulation 
                onRecordThreat={handleRecordThreat}
                onUpdateScore={updateScore}
                onUpdateInfection={updateInfection}
                infectionLevel={infectionLevel}
            />
        )}
        {activeTab === 3 && <ThreatEncyclopedia records={threatRecords} />}
        {activeTab === 4 && <SecurityQuiz />}
        {activeTab === 5 && <Discussion />}
      </main>

      {/* Footer / Emergency Banner */}
      <div className="bg-black/40 border-t border-slate-800 py-2">
        <div className="container mx-auto px-4 flex justify-center items-center text-xs text-slate-500 gap-4">
            <span className="flex items-center gap-1 text-red-900/50 hover:text-red-500 cursor-help transition">
                <AlertOctagon size={14} /> 실제 해킹 의심 시: KISA 118
            </span>
            <span>&copy; 2024 Smishing Defense Simulation. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default App;