import React, { useState, useEffect } from 'react';
import { 
  Layout, PenTool, Lightbulb, Puzzle, BookOpen, 
  Menu, X, Briefcase
} from 'lucide-react';
import DesignWizard from './components/DesignWizard';
import { TheoryTab, GalleryTab, QuizTab, ThinkingTab } from './components/AdditionalTabs';
import { Project } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('design');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('school_hackathon_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
  }, []);

  const handleSaveProject = (project: Project) => {
    const newProjects = [project, ...projects];
    setProjects(newProjects);
    localStorage.setItem('school_hackathon_projects', JSON.stringify(newProjects));
    setActiveTab('thinking'); // Encourage critical thinking after design
  };

  const navItems = [
    { id: 'theory', label: '이론', icon: BookOpen },
    { id: 'design', label: '설계 실습', icon: PenTool },
    { id: 'gallery', label: '갤러리', icon: Layout },
    { id: 'quiz', label: '퀴즈', icon: Puzzle },
    { id: 'thinking', label: '생각해보기', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-600">
             <div className="bg-indigo-600 text-white p-2 rounded-lg">
               <PenTool size={20} />
             </div>
             <span className="font-bold text-xl tracking-tight hidden sm:block">스쿨 해커톤</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
             <button 
               onClick={() => setShowPortfolio(true)}
               className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-bold transition-colors"
             >
               <Briefcase size={18} />
               <span className="hidden sm:inline">포트폴리오 ({projects.length})</span>
             </button>
             <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               {mobileMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 space-y-1">
           {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        <div className="mb-6">
           <h1 className="text-3xl font-bold text-slate-800">
             {navItems.find(i => i.id === activeTab)?.label}
           </h1>
           <p className="text-slate-500">
             {activeTab === 'design' && "나만의 IoT 해결책을 단계별로 만들어보세요."}
             {activeTab === 'theory' && "컴퓨터가 문제를 해결하는 방법을 배워보세요."}
             {activeTab === 'thinking' && "기술이 가져올 변화와 영향에 대해 토론해보세요."}
             {activeTab === 'gallery' && "다른 친구들의 멋진 아이디어를 구경하세요."}
             {activeTab === 'quiz' && "배운 내용을 퀴즈로 확인해보세요."}
           </p>
        </div>

        <div className="bg-white/50 rounded-3xl min-h-[600px]">
          {activeTab === 'design' && <DesignWizard onSave={handleSaveProject} />}
          {activeTab === 'theory' && <TheoryTab />}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'quiz' && <QuizTab />}
          {activeTab === 'thinking' && <ThinkingTab projects={projects} />}
        </div>
      </main>

      {/* Portfolio Modal */}
      {showPortfolio && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">나의 혁신 포트폴리오</h3>
              <button onClick={() => setShowPortfolio(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
                  <p>아직 프로젝트가 없어요. '설계 실습'에서 만들어보세요!</p>
                </div>
              ) : (
                projects.map(p => (
                  <div key={p.id} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-lg text-slate-800">{p.title}</h4>
                       <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">
                         점수: {p.score || '-'}
                       </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{p.problem}</p>
                    <div className="text-xs text-slate-400">
                      센서: {p.sensors.map(s => s.name).join(', ')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
