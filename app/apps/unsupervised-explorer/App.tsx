import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import ConceptView from './components/ConceptView';
import SimulationView from './components/SimulationView';
import QuizView from './components/QuizView';
import ThoughtView from './components/ThoughtView';
import { Compass, BookOpen, Layers, HelpCircle, MessageSquare, Award, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONCEPT);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [progress, setProgress] = useState({
    concept: false,
    simulation: false,
    quizScore: 0
  });

  // Load persistence
  useEffect(() => {
    const savedStreak = localStorage.getItem('streak');
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();

    if (savedStreak && lastLogin) {
      if (lastLogin !== today) {
        // Simple logic: if login was yesterday, increment. If older, reset? 
        // For simplicity, we just increment if it's a new day visit.
        const newStreak = parseInt(savedStreak) + 1;
        setStreak(newStreak);
        localStorage.setItem('streak', newStreak.toString());
        localStorage.setItem('lastLogin', today);
      } else {
        setStreak(parseInt(savedStreak));
      }
    } else {
      setStreak(1);
      localStorage.setItem('streak', '1');
      localStorage.setItem('lastLogin', today);
    }
  }, []);

  const handleConceptComplete = () => {
    setProgress(prev => {
      const newProgress = { ...prev, concept: true };
      checkBadge(newProgress);
      return newProgress;
    });
  };

  const handleSimulationInteract = () => {
    if (!progress.simulation) {
      setProgress(prev => {
        const newProgress = { ...prev, simulation: true };
        checkBadge(newProgress);
        return newProgress;
      });
    }
  };

  const handleQuizProgress = (score: number) => {
    setProgress(prev => {
       const newProgress = { ...prev, quizScore: score };
       // Maybe award badge for perfect score?
       if (score >= 5 && !badges.includes('QuizMaster')) {
         setBadges(b => [...b, 'QuizMaster']);
         alert("축하합니다! '퀴즈 마스터' 배지를 획득했습니다! 🏆");
       }
       return newProgress;
    });
  };

  const checkBadge = (currentProgress: typeof progress) => {
    if (currentProgress.concept && currentProgress.simulation && !badges.includes('Explorer')) {
      setBadges(prev => [...prev, 'Explorer']);
      // Small delay to let UI update
      setTimeout(() => alert("축하합니다! '탐험가 배지'를 획득했습니다! 🧭"), 500);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CONCEPT:
        return <ConceptView onComplete={handleConceptComplete} />;
      case Tab.SIMULATION:
        return <SimulationView onInteract={handleSimulationInteract} />;
      case Tab.QUIZ:
        return <QuizView onProgress={handleQuizProgress} />;
      case Tab.THOUGHT:
        return <ThoughtView />;
      default:
        return <ConceptView onComplete={handleConceptComplete} />;
    }
  };

  const NavButton = ({ tab, label, icon: Icon }: { tab: Tab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-medium text-sm md:text-base
        ${activeTab === tab 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-white hover:text-indigo-600'}
      `}
    >
      <Icon className={`w-5 h-5 ${activeTab === tab ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-2 rounded-lg">
                <Compass className="w-5 h-5 text-white" />
             </div>
             <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
               Unsupervised Explorer
             </h1>
          </div>

          <div className="flex items-center gap-4">
             {/* Streak */}
             <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
               <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
               <span className="text-sm font-bold text-orange-700">{streak}일째</span>
             </div>

             {/* Badges */}
             <div className="flex gap-1">
               {badges.includes('Explorer') && (
                 <div className="group relative">
                   <Award className="w-6 h-6 text-yellow-500" />
                   <span className="absolute top-8 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                     탐험가 배지
                   </span>
                 </div>
               )}
               {badges.includes('QuizMaster') && (
                 <div className="group relative">
                   <Award className="w-6 h-6 text-purple-500" />
                    <span className="absolute top-8 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                     퀴즈 마스터
                   </span>
                 </div>
               )}
               {badges.length === 0 && <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200" />}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-2 flex gap-1 z-20">
        <NavButton tab={Tab.CONCEPT} label="개념 학습" icon={BookOpen} />
        <NavButton tab={Tab.SIMULATION} label="시뮬레이션" icon={Layers} />
        <NavButton tab={Tab.QUIZ} label="핵심 퀴즈" icon={HelpCircle} />
        <NavButton tab={Tab.THOUGHT} label="생각 노트" icon={MessageSquare} />
      </div>
    </div>
  );
};

export default App;
