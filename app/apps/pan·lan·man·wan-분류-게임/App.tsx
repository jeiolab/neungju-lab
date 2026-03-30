import React, { useState, useEffect } from 'react';
import { BookOpen, Gamepad2, Globe, CheckSquare, PenTool, Award, Map, Trophy, Flame, Menu } from 'lucide-react';
import TabTheory from './components/TabTheory';
import TabGame from './components/TabGame';
import TabStory from './components/TabStory';
import TabQuiz from './components/TabQuiz';
import TabEssay from './components/TabEssay';
import DailyMissionModal from './components/DailyMissionModal';
import { BADGES } from './constants';
import { Badge, WrongNoteItem } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [wrongNotes, setWrongNotes] = useState<WrongNoteItem[]>([]);
  const [streak, setStreak] = useState(1);
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);
  const [showMission, setShowMission] = useState(false);
  const [notification, setNotification] = useState<Badge | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedBadges = localStorage.getItem('net_app3_badges');
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    
    const savedStreak = localStorage.getItem('net_app3_streak');
    if (savedStreak) setStreak(Number(savedStreak));

    const savedPoints = localStorage.getItem('net_app3_points');
    if (savedPoints) setPoints(Number(savedPoints));
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('net_app3_badges', JSON.stringify(badges));
    localStorage.setItem('net_app3_streak', streak.toString());
    localStorage.setItem('net_app3_points', points.toString());
    
    // Simple level logic
    setLevel(Math.floor(points / 500) + 1);
  }, [badges, streak, points]);

  const unlockBadge = (id: string) => {
    const badgeIndex = badges.findIndex(b => b.id === id);
    if (badgeIndex !== -1 && !badges[badgeIndex].unlocked) {
      const newBadges = [...badges];
      newBadges[badgeIndex].unlocked = true;
      setBadges(newBadges);
      setNotification(newBadges[badgeIndex]);
      setTimeout(() => setNotification(null), 3000);
      setPoints(prev => prev + 100); // Badge bonus
    }
  };

  const handleGameComplete = (accuracy: number, correctCount: number) => {
    setPoints(prev => prev + (correctCount * 10)); // 10 points per correct answer
    unlockBadge('start');
    if (accuracy === 100) unlockBadge('accuracy_100');
  };

  const handleQuizComplete = (score: number) => {
    setPoints(prev => prev + score);
    if (score === 100) unlockBadge('quiz_master');
  };

  const handleWrongAnswer = (item: WrongNoteItem) => {
    setWrongNotes(prev => [...prev, item]);
    // Save to local storage in real app
  };

  const handleMissionComplete = () => {
    unlockBadge('mission_complete');
    setPoints(prev => prev + 50);
  };

  const handleEssaySubmit = () => {
    unlockBadge('writer');
    setPoints(prev => prev + 30);
  };

  const TabContent = () => {
    switch(activeTab) {
      case 0: return <TabTheory />;
      case 1: return <TabGame onGameComplete={handleGameComplete} onWrongAnswer={handleWrongAnswer} />;
      case 2: return <TabStory />;
      case 3: return <TabQuiz onQuizComplete={handleQuizComplete} />;
      case 4: return <TabEssay onEssaySubmit={handleEssaySubmit} />;
      default: return <TabTheory />;
    }
  };

  const NavItem = ({ index, icon: Icon, label }: { index: number, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(index)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1 ${
        activeTab === index 
          ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={20} className={activeTab === index ? 'text-indigo-600' : 'text-slate-400'} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shadow-lg z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Globe className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-tight">네트워크 분류 게임</h1>
            <p className="text-xs text-slate-500">PAN·LAN·MAN·WAN</p>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 px-4 mb-2 uppercase tracking-wider">학습 메뉴</div>
          <NavItem index={0} icon={BookOpen} label="개념 학습" />
          <NavItem index={1} icon={Gamepad2} label="분류 게임" />
          <NavItem index={2} icon={Globe} label="스토리 모드" />
          <NavItem index={3} icon={CheckSquare} label="확인 퀴즈" />
          <NavItem index={4} icon={PenTool} label="서술형 평가" />
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 flex items-center gap-1"><Trophy size={14} /> 레벨</span>
              <span className="font-bold text-slate-800">Lv.{level}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 flex items-center gap-1"><Flame size={14} /> 연속 학습</span>
              <span className="font-bold text-orange-500">{streak}일째</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 flex items-center gap-1"><Award size={14} /> 포인트</span>
              <span className="font-bold text-indigo-600">{points} P</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="font-bold text-indigo-800 flex items-center gap-2">
            <Globe size={20} /> 네트워크 게임
          </div>
          <div className="flex items-center gap-3 text-sm font-medium">
             <span className="text-indigo-600">{points} P</span>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-5 justify-between items-center sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 0 && "핵심 개념 학습"}
              {activeTab === 1 && "실전 분류 게임"}
              {activeTab === 2 && "데이터의 이동 스토리"}
              {activeTab === 3 && "최종 확인 퀴즈"}
              {activeTab === 4 && "심화 서술형 평가"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === 0 && "네트워크의 범위를 이해하고 정의를 학습합니다."}
              {activeTab === 1 && "다양한 상황을 보고 올바른 네트워크를 선택하세요."}
              {activeTab === 2 && "데이터가 전 세계로 이동하는 과정을 따라가봅니다."}
              {activeTab === 3 && "학습한 내용을 문제를 통해 확인합니다."}
              {activeTab === 4 && "AI 선생님과 함께 사고력을 확장해보세요."}
            </p>
          </div>
          <button 
            onClick={() => setShowMission(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-bold"
          >
            <Map size={18} /> 
            <span>내 하루 지도 만들기</span>
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          <TabContent />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom z-30 flex justify-around p-2">
          {[
            { icon: BookOpen, label: '개념' },
            { icon: Gamepad2, label: '게임' },
            { icon: Globe, label: '스토리' },
            { icon: CheckSquare, label: '퀴즈' },
            { icon: PenTool, label: '서술' }
          ].map((item, idx) => (
             <button 
               key={idx}
               onClick={() => setActiveTab(idx)} 
               className={`flex flex-col items-center justify-center p-2 rounded-lg ${activeTab === idx ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
             >
               <item.icon size={20} />
               <span className="text-[10px] font-medium mt-1">{item.label}</span>
             </button>
          ))}
          <button 
             onClick={() => setShowMission(true)} 
             className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-400"
           >
             <Map size={20} />
             <span className="text-[10px] font-medium mt-1">미션</span>
           </button>
        </nav>
      </div>

      {/* Daily Mission Modal */}
      <DailyMissionModal 
        isOpen={showMission} 
        onClose={() => setShowMission(false)} 
        onComplete={handleMissionComplete}
      />

      {/* Badge Notification */}
      {notification && (
        <div className="fixed bottom-24 md:bottom-10 right-4 md:right-10 bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-bounce-small max-w-sm border border-slate-700">
          <div className="bg-yellow-400 p-3 rounded-full text-slate-900 shadow-lg">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-bold text-yellow-400 text-sm mb-0.5">배지 획득!</h4>
            <p className="font-bold text-lg leading-tight">{notification.name}</p>
            <p className="text-xs text-slate-400 mt-1">{notification.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;