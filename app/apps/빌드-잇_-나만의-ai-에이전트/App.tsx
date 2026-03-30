import React, { useState, useEffect } from 'react';
import { AgentDesign, DailyChallenge } from './types';
import { getDailyChallenge } from './services/geminiService';
import { TheoryTab } from './components/TheoryTab';
import { SimulationTab } from './components/SimulationTab';
import { QuizTab } from './components/QuizTab';
import { LearnMoreTab } from './components/LearnMoreTab';
import { DiscussionTab } from './components/DiscussionTab';
import { Layout, PenTool, Book, HelpCircle, MessageSquare, Menu, X, Rocket, Award } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'learn' | 'quiz' | 'discuss'>('sim');
  const [savedAgents, setSavedAgents] = useState<AgentDesign[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [showAgentsList, setShowAgentsList] = useState(false);

  useEffect(() => {
    // Load Saved Agents
    const saved = localStorage.getItem('my_agents');
    if (saved) {
      setSavedAgents(JSON.parse(saved));
    }

    // Load Daily Challenge
    const fetchChallenge = async () => {
      const challenge = await getDailyChallenge();
      setDailyChallenge(challenge);
    };
    fetchChallenge();
  }, []);

  const handleSaveAgent = (agent: AgentDesign) => {
    const newAgents = [agent, ...savedAgents];
    setSavedAgents(newAgents);
    localStorage.setItem('my_agents', JSON.stringify(newAgents));
  };

  const menuItems = [
    { id: 'theory', label: '개념 학습', icon: <Book className="w-5 h-5"/> },
    { id: 'sim', label: '에이전트 조립실', icon: <PenTool className="w-5 h-5"/> },
    { id: 'learn', label: '더 알아보기', icon: <Rocket className="w-5 h-5"/> },
    { id: 'quiz', label: '퀴즈', icon: <HelpCircle className="w-5 h-5"/> },
    { id: 'discuss', label: '토론', icon: <MessageSquare className="w-5 h-5"/> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm z-20 relative">
        <h1 className="font-black text-xl text-blue-600 flex items-center">
          <Layout className="w-6 h-6 mr-2" /> BUILD IT
        </h1>
        <button onClick={() => setShowAgentsList(!showAgentsList)} className="p-2">
          {showAgentsList ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto">
        <div className="p-6">
          <h1 className="font-black text-2xl text-blue-600 flex items-center tracking-tight">
            <Layout className="w-8 h-8 mr-2" /> BUILD IT
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium ml-10">나만의 AI 에이전트 연구소</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Saved Agents Mini List */}
        <div className="p-6 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">내 도감 ({savedAgents.length})</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {savedAgents.length === 0 ? (
               <p className="text-xs text-slate-400">아직 만든 에이전트가 없어요.</p>
            ) : (
              savedAgents.map(agent => (
                <div key={agent.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="font-bold text-sm text-slate-700 truncate">{agent.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{agent.goal}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Daily Challenge Banner */}
        {activeTab === 'sim' && dailyChallenge && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Award className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm mr-3">
                  DAILY CHALLENGE
                </span>
                <span className="text-blue-200 text-sm">CTO의 일일 미션</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{dailyChallenge.topic}</h2>
              <p className="text-blue-100 max-w-2xl">{dailyChallenge.description}</p>
              <button 
                onClick={() => { /* Should autofill topic logic here if needed */ }}
                className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
              >
                도전하기
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'theory' && <TheoryTab />}
          {activeTab === 'sim' && (
            <SimulationTab 
              onSaveAgent={handleSaveAgent} 
              initialTopic={dailyChallenge ? dailyChallenge.description : undefined} 
            />
          )}
          {activeTab === 'learn' && <LearnMoreTab />}
          {activeTab === 'quiz' && <QuizTab />}
          {activeTab === 'discuss' && <DiscussionTab />}
        </div>
      </main>

      {/* Mobile Drawer for Saved Agents (Simplified) */}
      {showAgentsList && (
        <div className="fixed inset-0 z-50 bg-white md:hidden p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">내 에이전트 도감</h2>
            <button onClick={() => setShowAgentsList(false)}><X /></button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {savedAgents.map(agent => (
              <div key={agent.id} className="border p-4 rounded-xl shadow-sm">
                <div className="font-bold">{agent.name}</div>
                <div className="text-sm text-slate-500">{agent.goal}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-bold mb-4">메뉴</h3>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setShowAgentsList(false); }}
                className="block w-full text-left py-3 px-4 rounded-lg hover:bg-slate-50 mb-2"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;