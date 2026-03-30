import React, { useState, useEffect } from 'react';
import { TabType, UserState } from './types';
import { loadUserState, saveUserState, calculateLevel } from './utils';
import { Layout, Brain, ShieldCheck, PenTool, BookOpen, User, Search } from 'lucide-react';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabQuiz from './components/TabQuiz';
import TabReflection from './components/TabReflection';
import TabMoreInfo from './components/TabMoreInfo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.THEORY);
  const [userState, setUserState] = useState<UserState>({
    xp: 0,
    level: 1,
    streak: 1,
    lastLogin: '',
    badges: [],
    quizHistory: {},
    wrongNotes: [],
    completedReflections: 0
  });

  useEffect(() => {
    const loaded = loadUserState();
    setUserState(loaded);
  }, []);

  const updateXP = (points: number) => {
    setUserState(prev => {
      const newXP = prev.xp + points;
      const newLevel = calculateLevel(newXP);
      const newState = { ...prev, xp: newXP, level: newLevel };
      saveUserState(newState);
      return newState;
    });
  };

  const handleWrongAnswer = (qId: number) => {
    setUserState(prev => {
        const newWrong = prev.wrongNotes.includes(qId) ? prev.wrongNotes : [...prev.wrongNotes, qId];
        const newState = { ...prev, wrongNotes: newWrong };
        saveUserState(newState);
        return newState;
    });
  }

  const earnBadge = (badgeName: string) => {
    if (!userState.badges.includes(badgeName)) {
        setUserState(prev => {
            const newState = { ...prev, badges: [...prev.badges, badgeName] };
            saveUserState(newState);
            alert(`🎉 배지 획득! [${badgeName}]`);
            return newState;
        });
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case TabType.THEORY: return <TabTheory />;
      case TabType.SIMULATION: return <TabSimulation onScoreUpdate={updateXP} onBadgeEarn={earnBadge} />;
      case TabType.QUIZ: return <TabQuiz onScoreUpdate={updateXP} onWrongAnswer={handleWrongAnswer} />;
      case TabType.REFLECTION: return <TabReflection onScoreUpdate={updateXP} />;
      case TabType.MORE_INFO: return <TabMoreInfo />;
      default: return <TabTheory />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 hidden md:block">공유해도 될까? 3분류 챌린지</h1>
            <h1 className="text-lg font-bold text-slate-800 md:hidden">3분류 챌린지</h1>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                <span className="text-xs font-bold text-slate-500">LV.{userState.level}</span>
                <div className="w-px h-3 bg-slate-300 mx-1"></div>
                <span className="text-sm font-black text-blue-600">{userState.xp} XP</span>
             </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <nav className="flex space-x-1 min-w-max">
            {[
              { id: TabType.THEORY, label: '이론 학습', icon: BookOpen },
              { id: TabType.SIMULATION, label: '실전 챌린지', icon: Layout },
              { id: TabType.MORE_INFO, label: '더 알아보기', icon: Search },
              { id: TabType.QUIZ, label: '퀴즈 확인', icon: Brain },
              { id: TabType.REFLECTION, label: '생각 정리', icon: PenTool },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-slate-400">
          <p>고등학교 정보 보호 교육용 웹 애플리케이션</p>
          <p className="mt-1">개인정보는 기기에만 저장됩니다 (LocalStorage)</p>
        </div>
      </footer>
    </div>
  );
};

export default App;