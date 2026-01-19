import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import GlossaryTab from './components/GlossaryTab';
import ReflectionTab from './components/ReflectionTab';
import WeakPointWidget from './components/WeakPointWidget';
import { CONCEPT_CARDS } from './constants';
import { UserProfile, QuizQuestion } from './types';
import { BookOpen, Gamepad2, BookA, GraduationCap, PenTool } from 'lucide-react';

// Initial state
const initialProfile: UserProfile = {
  score: 0,
  level: 1,
  streak: 1,
  lastLoginDate: new Date().toDateString(),
  mastery: {},
  badges: [],
  quizHistory: [],
  userExamples: {},
  reflections: {}
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [showBadgeModal, setShowBadgeModal] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('agent101_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Streak Logic
      const today = new Date().toDateString();
      if (parsed.lastLoginDate !== today) {
         // Simplified streak: if last login was yesterday, +1. Else reset.
         // For demo, just increment if different day.
         parsed.streak += 1;
         parsed.lastLoginDate = today;
      }
      setProfile(parsed);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('agent101_profile', JSON.stringify(profile));
  }, [profile]);

  // Handlers
  const updateMastery = (cardId: string, delta: number) => {
    setProfile(prev => {
      const current = prev.mastery[cardId] || 0;
      const newMastery = Math.min(100, current + delta);
      return {
        ...prev,
        score: prev.score + 10,
        mastery: { ...prev.mastery, [cardId]: newMastery }
      };
    });
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setProfile(prev => ({
      ...prev,
      score: prev.score + score,
      level: Math.floor((prev.score + score) / 100) + 1,
    }));
  };

  const saveWrongNote = (question: QuizQuestion) => {
    const note = { id: question.id, date: Date.now() };
    const notes = JSON.parse(localStorage.getItem('agent101_wrong_notes') || '[]');
    localStorage.setItem('agent101_wrong_notes', JSON.stringify([...notes, note]));
  };

  const saveUserExample = (term: string, example: string) => {
    setProfile(prev => {
        const newExamples = { ...prev.userExamples };
        if (example) newExamples[term] = example;
        else delete newExamples[term];
        return { ...prev, userExamples: newExamples, score: prev.score + 5 };
    });
  };

  const saveReflection = (type: string, content: string) => {
    setProfile(prev => ({
        ...prev,
        reflections: { ...prev.reflections, [type]: content },
        score: prev.score + 20
    }));
  };

  const renderTab = () => {
    switch(activeTab) {
      case 'theory': return <TheoryTab cards={CONCEPT_CARDS} profile={profile} updateMastery={updateMastery} />;
      case 'sim': return <SimulationTab />;
      case 'quiz': return <QuizTab profile={profile} onQuizComplete={handleQuizComplete} saveWrongNote={saveWrongNote} />;
      case 'glossary': return <GlossaryTab profile={profile} saveUserExample={saveUserExample} />;
      case 'reflect': return <ReflectionTab profile={profile} saveReflection={saveReflection} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header profile={profile} />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Recommendation Widget */}
        <WeakPointWidget profile={profile} onSelectCard={(id) => { setActiveTab('theory'); /* Logic to scroll to card could be added */ }} />

        {/* Tab Content */}
        {renderTab()}
      </main>

      {/* Bottom Navigation for Mobile / Fixed Tabs */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 md:sticky md:top-16 md:bottom-auto md:border-none md:bg-transparent md:max-w-4xl md:mx-auto md:justify-start md:gap-4 md:mb-6 z-40">
        <NavButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen />} label="개념" />
        <NavButton active={activeTab === 'sim'} onClick={() => setActiveTab('sim')} icon={<Gamepad2 />} label="시뮬" />
        <NavButton active={activeTab === 'glossary'} onClick={() => setActiveTab('glossary')} icon={<BookA />} label="용어" />
        <NavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<GraduationCap />} label="퀴즈" />
        <NavButton active={activeTab === 'reflect'} onClick={() => setActiveTab('reflect')} icon={<PenTool />} label="생각" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center gap-1 p-2 rounded-lg transition-colors ${active ? 'text-indigo-600 md:bg-white md:shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 20, className: active ? 'fill-indigo-100' : '' })}
    <span className="text-[10px] md:text-sm font-bold">{label}</span>
  </button>
);

export default App;