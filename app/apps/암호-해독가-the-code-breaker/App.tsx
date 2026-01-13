import React, { useState } from 'react';
import { Tab } from './types';
import { OperationCenter } from './components/OperationCenter';
import { Codebook } from './components/Codebook';
import { SecurityDocs } from './components/SecurityDocs';
import { HackingDefense } from './components/HackingDefense';
import { CreateCipher } from './components/CreateCipher';
import { Shield, Book, FileText, Cpu, Lock, Crosshair } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ops');
  const [mastery, setMastery] = useState(50); // Start at 50%

  const renderTab = () => {
    switch (activeTab) {
      case 'ops': return <OperationCenter setMastery={setMastery} mastery={mastery} />;
      case 'codebook': return <Codebook />;
      case 'security': return <SecurityDocs />;
      case 'defense': return <HackingDefense setMastery={setMastery} />;
      case 'cipher': return <CreateCipher />;
      default: return <OperationCenter setMastery={setMastery} mastery={mastery} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono flex flex-col">
      {/* Header / Status Bar */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-lg z-20 sticky top-0">
        <div className="flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-full border border-green-500/30">
                <Shield className="text-green-500" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tighter text-white">THE CODE BREAKER</h1>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    시스템 가동 중 (SYSTEM ONLINE)
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-500 uppercase">해킹 숙련도 (Mastery)</div>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div 
                        className={`h-full transition-all duration-500 ${mastery > 80 ? 'bg-green-400' : mastery > 40 ? 'bg-yellow-400' : 'bg-red-500'}`} 
                        style={{ width: `${mastery}%` }}
                    />
                </div>
                <div className="text-xs text-right mt-1 font-bold">{mastery}%</div>
            </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="bg-slate-900 w-full md:w-20 md:border-r border-slate-800 flex md:flex-col items-center justify-around md:justify-start py-4 gap-2 md:gap-6 z-10 shrink-0">
             <NavButton id="ops" icon={<Cpu />} label="작전본부" active={activeTab} set={setActiveTab} />
             <NavButton id="codebook" icon={<Book />} label="코드북" active={activeTab} set={setActiveTab} />
             <NavButton id="security" icon={<FileText />} label="보안문서" active={activeTab} set={setActiveTab} />
             <NavButton id="defense" icon={<Crosshair />} label="방어훈련" active={activeTab} set={setActiveTab} />
             <NavButton id="cipher" icon={<Lock />} label="암호생성" active={activeTab} set={setActiveTab} />
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative">
            {/* Background decorative elements */}
            <div className="fixed top-20 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="fixed bottom-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div className="p-4 md:p-8 max-w-7xl mx-auto h-full">
                {renderTab()}
            </div>
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ id: Tab, icon: React.ReactNode, label: string, active: Tab, set: (t: Tab) => void }> = ({ id, icon, label, active, set }) => (
    <button 
        onClick={() => set(id)}
        className={`
            flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300
            ${active === id ? 'bg-green-600 text-white shadow-lg scale-110' : 'text-slate-500 hover:text-green-400 hover:bg-slate-800'}
        `}
    >
        {icon}
        <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
);

export default App;