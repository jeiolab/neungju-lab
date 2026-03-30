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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Status Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Shield className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
                  암호 해독가
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">The Code Breaker</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-500 uppercase">해킹 숙련도</div>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full transition-all duration-500 ${mastery > 80 ? 'bg-green-500' : mastery > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${mastery}%` }}
                  />
                </div>
                <div className="text-xs text-right mt-1 font-bold text-slate-700">{mastery}%</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="bg-white w-full md:w-20 md:border-r border-slate-200 flex md:flex-col items-center justify-around md:justify-start py-4 gap-2 md:gap-6 z-10 shrink-0 shadow-sm md:shadow-none">
             <NavButton id="ops" icon={<Cpu />} label="작전본부" active={activeTab} set={setActiveTab} />
             <NavButton id="codebook" icon={<Book />} label="코드북" active={activeTab} set={setActiveTab} />
             <NavButton id="security" icon={<FileText />} label="보안문서" active={activeTab} set={setActiveTab} />
             <NavButton id="defense" icon={<Crosshair />} label="방어훈련" active={activeTab} set={setActiveTab} />
             <NavButton id="cipher" icon={<Lock />} label="암호생성" active={activeTab} set={setActiveTab} />
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative bg-slate-50">
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
            ${active === id ? 'bg-indigo-600 text-white shadow-md scale-110' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'}
        `}
    >
        {icon}
        <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
);

export default App;