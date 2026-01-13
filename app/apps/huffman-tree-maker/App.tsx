import React, { useState, useEffect } from 'react';
import { UserStats, Reflection } from './types';
import { APP_KEYS, BADGES } from './constants';
import SimulationSection from './components/SimulationSection';
import QuizSection from './components/QuizSection';
import ReflectionSection from './components/ReflectionSection';
import TheorySection from './components/TheorySection';
import { Trophy, Star, Activity, Award } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [stats, setStats] = useState<UserStats>({
    completedTrees: 0,
    totalSavings: 0,
    mastery: {},
    badges: [],
    streak: 1,
    lastLogin: new Date().toISOString().split('T')[0]
  });

  const [savedReflections, setSavedReflections] = useState<Reflection[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const loadedStats = localStorage.getItem(APP_KEYS.STATS);
    const loadedReflections = localStorage.getItem(APP_KEYS.REFLECTIONS);

    if (loadedStats) {
      const parsed = JSON.parse(loadedStats);
      // Streak Logic
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastLogin !== today) {
         // Logic for streak continuation could go here
         parsed.lastLogin = today;
         // Simplified streak increment for demo
         parsed.streak += 1;
      }
      setStats(parsed);
    }

    if (loadedReflections) {
        setSavedReflections(JSON.parse(loadedReflections));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(APP_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  const handleSimComplete = (savings: number) => {
    setStats(prev => {
        const newBadges = [...prev.badges];
        if (prev.completedTrees + 1 >= 5 && !newBadges.includes('tree_master')) newBadges.push('tree_master');
        if (savings >= 50 && !newBadges.includes('savings_king')) newBadges.push('savings_king');

        return {
            ...prev,
            completedTrees: prev.completedTrees + 1,
            totalSavings: savings, // Just store last for simple demo, or avg
            badges: newBadges
        };
    });
  };

  const handleQuizCorrect = (id: number) => {
      setStats(prev => {
          const newMastery = { ...prev.mastery, [id]: true };
          const newBadges = [...prev.badges];
          if (Object.keys(newMastery).length === 10 && !newBadges.includes('quiz_whiz')) {
              newBadges.push('quiz_whiz');
          }
          return { ...prev, mastery: newMastery, badges: newBadges };
      });
  };

  const handleReflectionSave = (refs: Reflection[]) => {
      setSavedReflections(refs);
      localStorage.setItem(APP_KEYS.REFLECTIONS, JSON.stringify(refs));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header / Stats Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="font-bold text-xl text-indigo-600">Huffman.Lab</h1>
            <div className="flex gap-4 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-1 text-orange-500" title="Streak">
                    <Activity size={16} /> {stats.streak}일
                </div>
                <div className="flex items-center gap-1 text-blue-600" title="Completed Trees">
                    <Trophy size={16} /> {stats.completedTrees}
                </div>
                <div className="flex items-center gap-1 text-purple-600" title="Quiz Mastery">
                    <Star size={16} /> {Object.keys(stats.mastery).length}/10
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        
        {/* Intro */}
        <section className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                빈도수로 만드는 코딩 게임
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
                자주 쓰이는 문자는 짧게, 드물게 쓰이는 문자는 길게. <br/>
                직접 트리를 조립하며 효율적인 압축의 원리를 발견해보세요.
            </p>
        </section>

        {/* Theory Cards */}
        <TheorySection />

        {/* Main Simulation Game */}
        <section id="simulation">
            <SimulationSection onComplete={handleSimComplete} />
        </section>

        {/* Quiz & Reflection Grid */}
        <div className="grid md:grid-cols-2 gap-8">
            <section id="quiz">
                <QuizSection onCorrect={handleQuizCorrect} />
            </section>
            <section id="reflection">
                <ReflectionSection onSave={handleReflectionSave} savedReflections={savedReflections} />
            </section>
        </div>

        {/* Badge Collection */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Award className="text-yellow-500"/> 내 배지 컬렉션
            </h3>
            <div className="flex flex-wrap gap-4">
                {BADGES.map(badge => {
                    const hasBadge = stats.badges.includes(badge.id);
                    return (
                        <div key={badge.id} className={`flex flex-col items-center p-4 rounded-lg border w-24 text-center ${hasBadge ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100 opacity-50 grayscale'}`}>
                            <span className="text-3xl mb-2">{badge.icon}</span>
                            <span className="text-xs font-bold text-slate-800">{badge.name}</span>
                        </div>
                    );
                })}
            </div>
        </section>

      </main>

      <footer className="text-center text-slate-400 text-sm py-8">
        © 2024 Huffman Tree Maker Educational App
      </footer>
    </div>
  );
};

export default App;
