import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { UserProgress, Snack, DistanceType } from './types';
import { INITIAL_SNACKS, BADGES } from './constants';
import { loadProgress, saveProgress, updateStreak } from './services/storageService';
import { BookOpen, Activity, HelpCircle, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'simulation' | 'quiz' | 'reflection'>('concepts');
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [snacks, setSnacks] = useState<Snack[]>(INITIAL_SNACKS);

  // Initialize and Streak
  useEffect(() => {
    const updated = updateStreak(progress);
    setProgress(updated);
    saveProgress(updated);
  }, []); // Run once on mount

  const updateScore = (points: number) => {
    setProgress(prev => {
        const newProgress = { ...prev, score: prev.score + points };
        saveProgress(newProgress);
        return newProgress;
    });
  };

  const unlockBadge = (badgeId: string) => {
    if (!progress.badges.includes(badgeId)) {
      setProgress(prev => {
        const newProgress = { ...prev, badges: [...prev.badges, badgeId] };
        saveProgress(newProgress);
        alert(`🎉 배지 획득: ${BADGES.find(b => b.id === badgeId)?.name}`);
        return newProgress;
      });
    }
  };

  // Handlers
  const handleConceptComplete = (id: string) => {
    if (!progress.completedConcepts.includes(id)) {
        setProgress(prev => {
            const next = { ...prev, completedConcepts: [...prev.completedConcepts, id] };
            saveProgress(next);
            return next;
        });
        updateScore(5);
    }
  };

  const handleRunExperiment = (k: number, dist: DistanceType) => {
    updateScore(10); // +10 per run
    
    // Check Badges
    if (k === 3) unlockBadge('k3_master');
    if (dist === 'manhattan') unlockBadge('dist_explorer');

    // Daily mission check (simplified: run any experiment)
    if (!progress.dailyMissionCompleted) {
         setProgress(prev => ({...prev, dailyMissionCompleted: true}));
         // Could add bonus points here
    }
  };

  const handleAddSnack = (snack: Snack) => {
    setSnacks(prev => [...prev, snack]);
    updateScore(5);
    const userAddedCount = snacks.filter(s => s.isUserAdded).length + 1;
    if (userAddedCount >= 1) unlockBadge('data_adder');
  };

  const handleQuizSolve = (isCorrect: boolean, quizId: string) => {
    if (isCorrect) {
        if (!progress.solvedQuizzes.includes(quizId)) {
            setProgress(prev => {
                const next = { ...prev, solvedQuizzes: [...prev.solvedQuizzes, quizId] };
                saveProgress(next);
                return next;
            });
            updateScore(20);
            
            // Check full score badge
            // Simplified logic: just check if solved count > 9
            if (progress.solvedQuizzes.length + 1 >= 10) unlockBadge('quiz_whiz');
        }
    } else {
        // Add to incorrect list for review logic (not fully implemented visually but stored)
        if (!progress.incorrectQuizzes.includes(quizId)) {
             setProgress(prev => ({...prev, incorrectQuizzes: [...prev.incorrectQuizzes, quizId]}));
        }
    }
  };

  const handleSaveReflection = (field: keyof UserProgress['reflections'], value: string) => {
    setProgress(prev => {
        const next = { 
            ...prev, 
            reflections: { ...prev.reflections, [field]: value } 
        };
        saveProgress(next);
        return next;
    });
  };

  return (
    <div className="min-h-screen pb-16">
      <Header progress={progress} />

      <main className="max-w-4xl mx-auto px-4 pt-6">
        {/* Daily Mission Banner */}
        {!progress.dailyMissionCompleted && (
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white p-3 rounded-lg shadow-md mb-6 flex justify-between items-center text-sm font-bold animate-pulse">
                <span>🔥 오늘의 미션: 아무 실험이나 1번 실행하기!</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">보상: 스트릭 유지</span>
            </div>
        )}

        {activeTab === 'concepts' && (
            <ConceptTab 
                completedIds={progress.completedConcepts} 
                onComplete={handleConceptComplete} 
            />
        )}
        {activeTab === 'simulation' && (
            <SimulationTab 
                snacks={snacks} 
                onAddSnack={handleAddSnack} 
                onRunExperiment={handleRunExperiment} 
            />
        )}
        {activeTab === 'quiz' && (
            <QuizTab 
                solvedIds={progress.solvedQuizzes} 
                onSolve={handleQuizSolve} 
            />
        )}
        {activeTab === 'reflection' && (
            <ReflectionTab 
                reflections={progress.reflections} 
                onSave={handleSaveReflection} 
                deepDiveData={null} 
            />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
        <div className="max-w-4xl mx-auto flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab('concepts')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'concepts' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <BookOpen size={20} />
            <span className="text-[10px] font-bold">개념</span>
          </button>
          <button 
             onClick={() => setActiveTab('simulation')}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'simulation' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <Activity size={20} />
            <span className="text-[10px] font-bold">실험실</span>
          </button>
          <button 
             onClick={() => setActiveTab('quiz')}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'quiz' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <HelpCircle size={20} />
            <span className="text-[10px] font-bold">퀴즈</span>
          </button>
          <button 
             onClick={() => setActiveTab('reflection')}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'reflection' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px] font-bold">생각</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;