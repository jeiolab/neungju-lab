import React, { useState, useEffect } from 'react';
import { GameState, SessionStats, TabType, Badge } from './types';
import { BADGES, DAILY_MISSION_SEED } from './constants';
import { GamificationBar } from './components/GamificationBar';
import { TheoryTab } from './components/TheoryTab';
import { SimulationTab } from './components/SimulationTab';
import { LearnMoreTab } from './components/LearnMoreTab';
import { QuizTab } from './components/QuizTab';
import { ThoughtTab } from './components/ThoughtTab';
import { BookOpen, Gamepad2, Lightbulb, GraduationCap, BrainCircuit } from 'lucide-react';

const STORAGE_KEY = 'classification_squad_v1';

const INITIAL_STATE: GameState = {
  xp: 0,
  level: 1,
  badges: [],
  streak: 0,
  lastPlayedDate: null,
  masteryByConcept: {},
  wrongNotes: [],
  dailyMissionCompleted: false
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    binaryWinsStreak: 0,
    multiCorrectCount: 0,
    totalAttempts: 0
  });

  // Settings for Simulation (Lifted up to keep persistence across tabs if needed, though strictly requested local)
  const [noiseLevel, setNoiseLevel] = useState(10);
  const [dataSize, setDataSize] = useState(50);

  // Load Game State
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGameState(parsed);
        checkStreak(parsed);
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  // Save Game State
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const checkStreak = (state: GameState) => {
    const today = new Date().toDateString();
    if (state.lastPlayedDate !== today) {
        // Simple streak logic
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (state.lastPlayedDate === yesterday.toDateString()) {
            setGameState(prev => ({...prev, streak: prev.streak + 1, lastPlayedDate: today}));
        } else if (state.lastPlayedDate !== today) {
            setGameState(prev => ({...prev, streak: 1, lastPlayedDate: today}));
        }
    }
  };

  const handleScoreUpdate = (isCorrect: boolean, xpGain: number) => {
    setSessionStats(prev => {
        const newStats = {
            ...prev,
            totalAttempts: prev.totalAttempts + 1,
            binaryWinsStreak: isCorrect ? prev.binaryWinsStreak + 1 : 0,
            multiCorrectCount: isCorrect ? prev.multiCorrectCount + 1 : prev.multiCorrectCount
        };
        checkBadges(newStats);
        return newStats;
    });

    if (isCorrect) {
        setGameState(prev => ({
            ...prev,
            xp: prev.xp + xpGain,
            level: Math.floor((prev.xp + xpGain) / 100) + 1 // Simplified level logic
        }));
    }
  };

  const checkBadges = (currentSessionStats: SessionStats) => {
     const newBadges: string[] = [];
     BADGES.forEach(badge => {
         if (!gameState.badges.includes(badge.id) && badge.condition(gameState, currentSessionStats)) {
             newBadges.push(badge.id);
             alert(`🏅 배지 획득! [${badge.name}]: ${badge.description}`);
         }
     });

     if (newBadges.length > 0) {
         setGameState(prev => ({...prev, badges: [...prev.badges, ...newBadges]}));
     }
  };

  const handleQuizCorrect = (concept: string) => {
      setGameState(prev => ({
          ...prev,
          xp: prev.xp + 20,
          masteryByConcept: {
              ...prev.masteryByConcept,
              [concept]: Math.min(100, (prev.masteryByConcept[concept] || 0) + 25)
          }
      }));
  };

  const handleQuizWrong = (note: any) => {
      setGameState(prev => ({
          ...prev,
          wrongNotes: [note, ...prev.wrongNotes]
      }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 font-sans text-slate-800">
      <GamificationBar state={gameState} sessionStats={sessionStats} />

      <main className="container mx-auto mt-6 px-2 md:px-4">
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'simulation' && (
            <SimulationTab 
                onScoreUpdate={handleScoreUpdate} 
                noiseLevel={noiseLevel} 
                dataSize={dataSize}
                setNoiseLevel={setNoiseLevel}
                setDataSize={setDataSize}
            />
        )}
        {activeTab === 'learn' && <LearnMoreTab />}
        {activeTab === 'quiz' && <QuizTab onCorrect={handleQuizCorrect} onWrong={handleQuizWrong} />}
        {activeTab === 'thought' && <ThoughtTab />}
      </main>

      {/* Mobile Bottom Navigation (or Desktop Top Nav - using fixed bottom for 'App' feel on mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 md:hidden z-50">
         <div className="flex justify-between items-center">
            <NavButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={20} />} label="이론" />
            <NavButton active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} icon={<Gamepad2 size={20} />} label="실습" />
            <NavButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<Lightbulb size={20} />} label="심화" />
            <NavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<GraduationCap size={20} />} label="퀴즈" />
            <NavButton active={activeTab === 'thought'} onClick={() => setActiveTab('thought')} icon={<BrainCircuit size={20} />} label="생각" />
         </div>
      </nav>

      {/* Desktop Navigation (Floating or integrated) */}
      <div className="hidden md:flex fixed left-1/2 -translate-x-1/2 bottom-8 bg-white/90 backdrop-blur shadow-xl border border-gray-200 rounded-full px-6 py-3 gap-8 z-40">
            <NavButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={20} />} label="이론 개념" />
            <NavButton active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} icon={<Gamepad2 size={20} />} label="분류 게임" />
            <NavButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<Lightbulb size={20} />} label="더 알아보기" />
            <NavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<GraduationCap size={20} />} label="확인 문제" />
            <NavButton active={activeTab === 'thought'} onClick={() => setActiveTab('thought')} icon={<BrainCircuit size={20} />} label="생각해보기" />
      </div>
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-indigo-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
    >
        {icon}
        <span className="text-[10px] md:text-xs">{label}</span>
    </button>
);

export default App;