import React, { useState, useEffect } from 'react';
import { TabId, UserProgress, ConceptMastery } from './types';
import { getProgress, saveProgress, updateStreak, getMastery, saveMastery } from './services/storage';
import { BookOpen, Activity, Award, HelpCircle, PenTool } from 'lucide-react';

import TabConcepts from './components/TabConcepts';
import TabSimulation from './components/TabSimulation';
import TabQuiz from './components/TabQuiz';
import TabThoughts from './components/TabThoughts';
import TabMoreInfo from './components/TabMoreInfo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('concepts');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mastery, setMastery] = useState<ConceptMastery>({});

  // Initialize Data
  useEffect(() => {
    const p = getProgress();
    const updatedP = updateStreak(p);
    saveProgress(updatedP);
    setProgress(updatedP);
    setMastery(getMastery());
  }, []);

  const handleProgressUpdate = (newProgress: UserProgress) => {
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const handleMasteryUpdate = (id: string, correct: boolean) => {
    const current = mastery[id] || 0;
    const newVal = correct ? Math.min(100, current + 20) : Math.max(0, current - 10);
    const newMastery = { ...mastery, [id]: newVal };
    setMastery(newMastery);
    saveMastery(newMastery);
  };

  if (!progress) return <div className="p-10 text-center">Loading Classroom...</div>;

  const tabs = [
    { id: 'concepts', label: '1. 개념 학습', icon: BookOpen },
    { id: 'simulation', label: '2. 설계 실습', icon: Activity },
    { id: 'quiz', label: '3. 퀴즈', icon: HelpCircle },
    { id: 'thoughts', label: '4. 생각 넓히기', icon: PenTool },
    { id: 'more', label: '5. 더보기', icon: Award },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">🔥</span> 우리 반 화재 경보기 설계실
          </h1>
          
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex flex-col items-end">
                <span className="text-gray-500 text-xs">Level {Math.floor(progress.xp / 500) + 1}</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(progress.xp % 500) / 5}%` }}
                  />
                </div>
             </div>
             <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                <span>🔥</span> {progress.streak}일 연속
             </div>
          </div>
        </div>
        
        {/* Tab Nav */}
        <nav className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-6">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabId)}
                className={`flex items-center gap-2 py-3 border-b-2 text-sm whitespace-nowrap transition-colors ${
                  activeTab === t.id 
                    ? 'border-blue-600 text-blue-600 font-bold' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'concepts' && (
          <TabConcepts mastery={mastery} onMasteryUpdate={handleMasteryUpdate} />
        )}
        {activeTab === 'simulation' && (
          <TabSimulation userProgress={progress} onUpdateProgress={handleProgressUpdate} />
        )}
        {activeTab === 'quiz' && (
          <TabQuiz userProgress={progress} onUpdateProgress={handleProgressUpdate} />
        )}
        {activeTab === 'thoughts' && (
          <TabThoughts userProgress={progress} onUpdateProgress={handleProgressUpdate} />
        )}
        {activeTab === 'more' && (
          <TabMoreInfo userProgress={progress} />
        )}
      </main>
    </div>
  );
};

export default App;