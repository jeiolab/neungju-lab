import React, { useState, useEffect } from 'react';
import { Layout, PenTool, Book, BrainCircuit, GraduationCap, Download, AlertCircle } from 'lucide-react';
import { TheorySection } from './components/TheorySection';
import { WizardSection } from './components/WizardSection';
import { DeepDiveSection } from './components/DeepDiveSection';
import { QuizSection } from './components/QuizSection';
import { ThinkingSection } from './components/ThinkingSection';
import { WizardData, UserProgress } from './types';
import { INITIAL_PROGRESS } from './constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'wizard' | 'deepdive' | 'quiz' | 'thinking'>('theory');
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [showExportToast, setShowExportToast] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('wizard_oop_v1_data');
    const storedProgress = localStorage.getItem('wizard_oop_v1_progress');
    
    if (storedData) setWizardData(JSON.parse(storedData));
    if (storedProgress) {
      const parsedProgress = JSON.parse(storedProgress);
      // Simple streak logic
      const last = new Date(parsedProgress.lastLogin).toDateString();
      const today = new Date().toDateString();
      if (last !== today) {
        parsedProgress.streak += 1;
        parsedProgress.lastLogin = new Date().toISOString();
      }
      setProgress(parsedProgress);
    } else {
        localStorage.setItem('wizard_oop_v1_progress', JSON.stringify(INITIAL_PROGRESS));
    }
  }, []);

  // Persist Data
  useEffect(() => {
    if (wizardData) localStorage.setItem('wizard_oop_v1_data', JSON.stringify(wizardData));
  }, [wizardData]);

  useEffect(() => {
    localStorage.setItem('wizard_oop_v1_progress', JSON.stringify(progress));
  }, [progress]);

  const handleExport = () => {
    if (process.env.NEXT_PUBLIC_ENABLE_EXPORT === 'true') {
        alert("PDF 다운로드를 시작합니다.");
    } else {
        setShowExportToast(true);
        setTimeout(() => setShowExportToast(false), 3000);
    }
  };

  const masteryData = [
    { subject: '설계', A: wizardData?.instances.length === 2 ? 100 : 50, fullMark: 100 },
    { subject: '이론', A: progress.quizScore * 10, fullMark: 100 },
    { subject: '응용', A: Math.min(progress.quizScore * 5 + (wizardData?.selectedMethods.length || 0) * 10, 100), fullMark: 100 },
    { subject: '실험', A: wizardData?.instances.length === 2 ? 90 : 20, fullMark: 100 },
    { subject: '심화', A: 60, fullMark: 100 }, // Placeholder for thinking completion
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Layout size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">수행평가 위저드: 우리 반 출석부</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 text-sm font-medium text-slate-600">
               <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">🔥 Streak: {progress.streak}일</span>
               <span className="bg-green-100 text-green-700 px-2 py-1 rounded">🏆 Score: {progress.quizScore}/10</span>
            </div>
            <button 
                onClick={handleExport}
                className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors"
            >
                <Download size={20} />
                <span className="text-sm hidden sm:inline">내보내기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar / Navigation */}
        <aside className="lg:col-span-3 space-y-6">
           <nav className="space-y-1">
             {[
               { id: 'theory', label: '1. 이론 개념', icon: Book },
               { id: 'wizard', label: '2. 설계 위저드', icon: PenTool },
               { id: 'deepdive', label: '3. 더 알아보기', icon: BrainCircuit },
               { id: 'quiz', label: '4. 개념 퀴즈', icon: GraduationCap },
               { id: 'thinking', label: '5. 생각해볼 문제', icon: Layout },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as any)}
                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                   activeTab === item.id 
                     ? 'bg-blue-600 text-white shadow-md' 
                     : 'text-slate-600 hover:bg-slate-100'
                 }`}
               >
                 <item.icon size={20} />
                 <span className="font-medium">{item.label}</span>
               </button>
             ))}
           </nav>

           {/* Mastery Chart */}
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hidden lg:block">
             <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase text-center">나의 OOP 마스터리</h3>
             <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748b'}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="My Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
           </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 min-h-[600px]">
          {activeTab === 'theory' && <TheorySection />}
          {activeTab === 'wizard' && (
            <WizardSection 
              savedData={wizardData} 
              updateData={setWizardData} 
              onComplete={() => setProgress({...progress, completedWizard: true})}
            />
          )}
          {activeTab === 'deepdive' && <DeepDiveSection />}
          {activeTab === 'quiz' && (
            <QuizSection onScoreUpdate={(score) => setProgress({...progress, quizScore: score})} />
          )}
          {activeTab === 'thinking' && <ThinkingSection />}
        </div>

      </main>

      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-8 right-8 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce-in flex items-center space-x-2">
           <AlertCircle className="text-yellow-400" size={20} />
           <span>제출용 내보내기 기능은 현재 비활성화되어 있습니다.</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>© 2024 OOP Wizard Project. Educational Purpose Only.</p>
      </footer>
    </div>
  );
};

export default App;