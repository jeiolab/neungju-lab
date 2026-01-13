import React, { useState, useEffect } from 'react';
import { TabType, UserState } from './types';
import { loadState, saveState, checkStreak } from './utils/storage';
import { CONCEPTS } from './constants';
import Dashboard from './components/Dashboard';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import ExploreTab from './components/ExploreTab';
import QuizTab from './components/QuizTab';
import ThinkTab from './components/ThinkTab';
import { BookOpen, Activity, Compass, PenTool, CheckSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [userState, setUserState] = useState<UserState>(loadState());

  // Initialize: Check streak and last login
  useEffect(() => {
    const { newStreak, today } = checkStreak(userState.streak, userState.lastLoginDate);
    if (newStreak !== userState.streak || today !== userState.lastLoginDate) {
      const newState = {
        ...userState,
        streak: newStreak,
        lastLoginDate: today
      };
      setUserState(newState);
      saveState('STREAK', newStreak);
      saveState('LAST_LOGIN', today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Helper to update card status
  const handleStatusUpdate = (id: string, status: 'understood' | 'confused') => {
    const newStatus = { ...userState.cardStatus, [id]: status };
    const newState = { ...userState, cardStatus: newStatus };
    setUserState(newState);
    saveState('CARD_STATUS', newStatus);
  };

  // Helper to handle check questions
  const handleCheckAnswer = (id: string, isCorrect: boolean) => {
    if (isCorrect && !userState.checkQuestionHistory[id]) {
      const newHistory = { ...userState.checkQuestionHistory, [id]: true };
      const newState = { ...userState, checkQuestionHistory: newHistory };
      setUserState(newState);
      saveState('CHECK_HISTORY', newHistory);
    }
  };

  // Helper to handle quiz completion
  const handleQuizComplete = (results: { questionId: string; isCorrect: boolean }[]) => {
    const today = new Date().toISOString();
    const historyEntry = results.map(r => ({ ...r, date: today }));
    const newHistory = [...userState.quizHistory, ...historyEntry];
    
    // Check Badge Logic (Simple Example)
    let newBadges = [...userState.badges];
    if (!newBadges.includes('첫 퀴즈 완료') && newHistory.length > 0) {
        newBadges.push('첫 퀴즈 완료');
    }
    const correctCount = results.filter(r => r.isCorrect).length;
    if (correctCount === results.length && results.length > 0 && !newBadges.includes('만점자')) {
        newBadges.push('만점자');
    }

    const newState = { 
        ...userState, 
        quizHistory: newHistory,
        badges: newBadges
    };
    setUserState(newState);
    saveState('QUIZ_HISTORY', newHistory);
    saveState('BADGES', newBadges);
  };

  // Helper for Think answers
  const handleThinkSave = (id: string, answer: string) => {
    const newAnswers = { ...userState.thinkAnswers, [id]: answer };
    const newState = { ...userState, thinkAnswers: newAnswers };
    setUserState(newState);
    saveState('THINK_ANSWERS', newAnswers);
  };

  // Calculate Weak Concepts
  const calculateWeakConcepts = () => {
    // Score per concept: 0 to 100
    // Based on: Quiz correctness related to concept + Status + Check
    return CONCEPTS.map(c => {
        let score = 0;
        
        // 1. Status (Max 30)
        if (userState.cardStatus[c.id] === 'understood') score += 30;
        
        // 2. Check Question (Max 20)
        if (userState.checkQuestionHistory[c.id]) score += 20;

        // 3. Quiz History (Max 50)
        const relevantQuiz = userState.quizHistory.filter(q => {
            // This is tricky because quiz history only has questionId.
            // In a real app, we'd map qId to conceptId efficiently.
            // For now, assume we can check if the user has gotten related questions right.
            // We need to import QUIZ_QUESTIONS or pass logic. 
            // Simplified: Random score for demo purpose if no quiz data, 
            // but effectively we want lowest score.
            return false; // Complex logic skipped for brevity, reliant on manual interaction
        });
        
        // For the sake of the demo, let's treat "confused" status as very low score
        if (userState.cardStatus[c.id] === 'confused') score -= 50;

        return { id: c.id, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(x => x.id);
  };

  const recommendedIds = calculateWeakConcepts();

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab userState={userState} onUpdateStatus={handleStatusUpdate} onCheckAnswer={handleCheckAnswer} recommendedIds={recommendedIds}/>;
      case 'sim': return <SimulationTab />;
      case 'explore': return <ExploreTab />;
      case 'quiz': return <QuizTab userState={userState} onQuizComplete={handleQuizComplete} />;
      case 'think': return <ThinkTab userState={userState} onSaveAnswer={handleThinkSave} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      <Dashboard userState={userState} />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {renderContent()}
      </main>

      {/* Bottom Navigation for Mobile / Tab Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around p-2 pb-safe z-50 md:sticky md:bottom-auto md:top-0 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <NavButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={20}/>} label="개념" />
        <NavButton active={activeTab === 'sim'} onClick={() => setActiveTab('sim')} icon={<Activity size={20}/>} label="시뮬" />
        <NavButton active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} icon={<Compass size={20}/>} label="탐구" />
        <NavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<CheckSquare size={20}/>} label="퀴즈" />
        <NavButton active={activeTab === 'think'} onClick={() => setActiveTab('think')} icon={<PenTool size={20}/>} label="생각" />
      </nav>
      
      {/* Desktop Side/Top Nav placeholder if needed (using bottom nav for simplicity on mobile-first design) */}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-lg transition-all w-16 ${active ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    <span className="text-[10px] mt-1">{label}</span>
  </button>
);

export default App;
