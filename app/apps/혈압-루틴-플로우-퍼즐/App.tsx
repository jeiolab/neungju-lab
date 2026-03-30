import React, { useState, useEffect } from 'react';
import { TabView, UserProgress } from './types';
import TheorySection from './components/TheorySection';
import PuzzleSection from './components/PuzzleSection';
import QuizSection from './components/QuizSection';
import ReflectionSection from './components/ReflectionSection';
import AdvancedTab from './components/AdvancedTab';
import { BookOpen, Puzzle, HelpCircle, PenTool, Layers, Activity, Trophy } from 'lucide-react';

const STORAGE_KEY = 'bpflow_v1_data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('theory');
  const [progress, setProgress] = useState<UserProgress>({
    completedLevels: [],
    quizScore: 0,
    hintsUsed: 0,
    reflections: {}
  });

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load save data", e);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const handleLevelComplete = (id: number) => {
    if (!progress.completedLevels.includes(id)) {
      setProgress(prev => ({
        ...prev,
        completedLevels: [...prev.completedLevels, id]
      }));
    }
  };

  const handleHintUse = () => {
    setProgress(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  };

  const handleScoreUpdate = (points: number) => {
    setProgress(prev => ({ ...prev, quizScore: prev.quizScore + points }));
  };

  const handleReflectionSave = (id: string, text: string) => {
    setProgress(prev => ({
      ...prev,
      reflections: { ...prev.reflections, [id]: text }
    }));
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabView; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-medium text-sm md:text-base
        ${activeTab === id 
          ? 'bg-slate-900 text-white shadow-lg transform scale-105' 
          : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }
      `}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-6 px-4">
      
      {/* Header */}
      <header className="w-full max-w-5xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500">
             <Activity size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">혈압 루틴 플로우 퍼즐</h1>
            <p className="text-xs text-slate-500 font-medium">Topic 3: 제어 구조의 응용</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
           <div className="flex flex-col items-center px-2">
             <span className="text-[10px] uppercase text-slate-400 font-bold">퍼즐 완료</span>
             <span className="font-bold text-slate-800">{progress.completedLevels.length} / 3</span>
           </div>
           <div className="w-px h-8 bg-slate-100"></div>
           <div className="flex flex-col items-center px-2">
             <span className="text-[10px] uppercase text-slate-400 font-bold">퀴즈 점수</span>
             <div className="flex items-center gap-1 text-indigo-600 font-bold">
               <Trophy size={14} /> {progress.quizScore}
             </div>
           </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="w-full max-w-5xl mb-6 flex justify-between md:justify-start gap-2 overflow-x-auto pb-2 md:pb-0">
        <TabButton id="theory" label="이론 학습" icon={BookOpen} />
        <TabButton id="puzzle" label="퍼즐 & 시뮬" icon={Puzzle} />
        <TabButton id="advanced" label="심화 학습" icon={Layers} />
        <TabButton id="quiz" label="퀴즈" icon={HelpCircle} />
        <TabButton id="reflection" label="생각 정리" icon={PenTool} />
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex-grow">
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'puzzle' && (
          <PuzzleSection 
            completedLevels={progress.completedLevels}
            onComplete={handleLevelComplete}
            onHintUse={handleHintUse}
          />
        )}
        {activeTab === 'advanced' && <AdvancedTab />}
        {activeTab === 'quiz' && (
          <QuizSection 
            onScoreUpdate={handleScoreUpdate}
            quizScore={progress.quizScore}
          />
        )}
        {activeTab === 'reflection' && (
          <ReflectionSection 
            savedReflections={progress.reflections}
            onSave={handleReflectionSave}
          />
        )}
      </main>


    </div>
  );
};

export default App;