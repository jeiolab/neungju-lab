import React, { useState, useEffect } from 'react';
import SimulationPanel from './components/SimulationPanel';
import QuizModule from './components/QuizModule';
import ConceptLibrary from './components/ConceptLibrary';
import ThoughtLab from './components/ThoughtLab';
import { loadProgress, saveProgress, updateStreak } from './services/storageService';
import { UserProgress, Badge, SimulationResult, DailyMission } from './types';
import { BADGES } from './constants';
import { Trophy, Flame, Menu, X, Router, GraduationCap, BrainCircuit, FlaskConical } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sim' | 'concept' | 'quiz' | 'thought'>('sim');
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [dailyMission, setDailyMission] = useState<DailyMission | null>(null);

  // Initialize mission and check streak
  useEffect(() => {
    // Determine daily mission based on date
    const today = new Date().getDate();
    const missions: DailyMission[] = [
        { id: 'm1', targetFault: 'DNS', description: 'DNS 서버가 응답하지 않습니다. 올바른 주소를 찾아보세요.' },
        { id: 'm2', targetFault: 'WEAK_PW', description: '보안 경고! 와이파이 비밀번호를 더 강력하게 변경하세요.' },
        { id: 'm3', targetFault: 'IP_MISMATCH', description: '게이트웨이와 통신이 안됩니다. IP 대역을 확인하세요.' },
    ];
    setDailyMission(missions[today % missions.length]);

    // Update streak logic
    const updated = updateStreak(progress);
    if (updated.streak !== progress.streak) {
        setProgress(updated);
        saveProgress(updated);
    }
  }, []);

  const handleExperimentComplete = (result: SimulationResult) => {
    // Logic to unlock badges or update high score could go here
    if (result.connectionScore === 100 && result.speedScore === 100 && result.securityScore >= 80) {
       if (!progress.badges.includes('master_engineer')) {
           const newBadges = [...progress.badges, 'master_engineer'];
           const newProgress = { ...progress, badges: newBadges };
           setProgress(newProgress);
           saveProgress(newProgress);
           alert("🎖️ '네트워크 마스터' 배지를 획득했습니다!");
       }
    }
  };

  const handleQuizComplete = (score: number) => {
    if (score > progress.highScore) {
        const newProgress = { ...progress, highScore: score };
        setProgress(newProgress);
        saveProgress(newProgress);
    }
  };

  const getBadgeIcon = (id: string) => {
      return BADGES.find(b => b.id === id)?.icon || '🏅';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <Router size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-slate-800 text-lg leading-tight">교실 공유기 실험실</h1>
                    <p className="text-xs text-slate-500">연결·IP·보안 마이크로 시뮬레이션</p>
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
                 <div className="hidden sm:flex items-center gap-1 text-orange-500 font-medium bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    <Flame size={16} className="fill-current"/>
                    <span>{progress.streak}일째 실험 중</span>
                 </div>
                 <div className="hidden sm:flex items-center gap-2">
                    {progress.badges.map(bid => (
                        <span key={bid} title={BADGES.find(b=>b.id===bid)?.name} className="text-xl cursor-help filter drop-shadow-sm grayscale-0 hover:scale-110 transition-transform">
                            {getBadgeIcon(bid)}
                        </span>
                    ))}
                    {progress.badges.length === 0 && <span className="text-slate-400 text-xs">획득한 배지가 없습니다</span>}
                 </div>
            </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab('sim')}
                    className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'sim' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <FlaskConical size={18}/> 실험실
                </button>
                <button 
                    onClick={() => setActiveTab('concept')}
                    className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'concept' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <GraduationCap size={18}/> 개념 카드
                </button>
                <button 
                    onClick={() => setActiveTab('quiz')}
                    className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'quiz' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <Trophy size={18}/> 퀴즈 도전
                </button>
                <button 
                    onClick={() => setActiveTab('thought')}
                    className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'thought' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <BrainCircuit size={18}/> AI 생각 연구소
                </button>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {activeTab === 'sim' && (
            <div className="animate-fade-in">
                <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    👋 <strong>환영합니다!</strong> DHCP 설정을 켜거나 끄고, IP와 DNS를 직접 입력하며 네트워크 변화를 관찰해보세요.
                </div>
                <SimulationPanel onExperimentComplete={handleExperimentComplete} dailyMission={dailyMission} />
            </div>
        )}
        {activeTab === 'concept' && <div className="animate-fade-in"><ConceptLibrary /></div>}
        {activeTab === 'quiz' && <div className="animate-fade-in"><QuizModule onQuizComplete={handleQuizComplete} /></div>}
        {activeTab === 'thought' && <div className="animate-fade-in"><ThoughtLab /></div>}
      </main>
    </div>
  );
};

export default App;