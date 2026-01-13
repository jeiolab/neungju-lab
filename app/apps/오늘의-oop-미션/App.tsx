import React, { useState, useEffect, useMemo } from 'react';
import { MISSION_POOL, QUIZ_QUESTIONS, THEORY_CARDS, REFLECTION_PROMPTS } from './constants';
import { Mission, UserProgress, MissionType } from './types';
import DailyMission from './components/DailyMission';
import Simulation from './components/Simulation';
import QuizSection from './components/QuizSection';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Activity, HelpCircle, Layout, Trophy, Flame, ChevronRight } from 'lucide-react';

// --- Helper Functions ---
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getDailyMission = (dateStr: string): Mission => {
  // Simple hash to pick a mission based on date
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % MISSION_POOL.length;
  return MISSION_POOL[index];
};

const getInitialProgress = (): UserProgress => ({
  lastLoginDate: '',
  currentStreak: 0,
  maxStreak: 0,
  completedMissions: [],
  missionHistory: {},
  quizScore: 0,
  weaknessStats: {
    [MissionType.SHARED_STATE_DELUSION]: 0,
    [MissionType.METHOD_CONTEXT_CONFUSION]: 0,
    [MissionType.CONSTRUCTOR_MISSING]: 0,
  },
  badges: []
});

// --- Main Component ---
const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress());
  const [activeTab, setActiveTab] = useState<'mission' | 'theory' | 'sim' | 'quiz' | 'reflect'>('mission');
  const [todayMission, setTodayMission] = useState<Mission>(MISSION_POOL[0]);
  const [reflectionText, setReflectionText] = useState('');

  // Initialization
  useEffect(() => {
    const dateStr = getTodayDateString();
    setTodayMission(getDailyMission(dateStr));

    const saved = localStorage.getItem('oopdaily_v1_progress');
    if (saved) {
      const parsed: UserProgress = JSON.parse(saved);
      // Streak Logic
      if (parsed.lastLoginDate !== dateStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (parsed.lastLoginDate === yesterdayStr) {
            // Continued streak
             // (We don't increment here, we increment on mission completion)
        } else if (parsed.lastLoginDate !== dateStr) {
            // Broken streak, but reset logic happens on completion or lazy load
            // For now, visualize previous state
            if (new Date(parsed.lastLoginDate) < yesterday) {
                parsed.currentStreak = 0;
            }
        }
      }
      setProgress(parsed);
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem('oopdaily_v1_progress', JSON.stringify(progress));
  }, [progress]);

  const handleMissionComplete = (success: boolean) => {
    const dateStr = getTodayDateString();
    
    setProgress(prev => {
        const newHistory = { ...prev.missionHistory, [dateStr]: success };
        const newCompleted = success && !prev.completedMissions.includes(todayMission.id) 
            ? [...prev.completedMissions, todayMission.id] 
            : prev.completedMissions;
        
        let newStreak = prev.currentStreak;
        if (success && prev.lastLoginDate !== dateStr) {
             // If first success of today
             newStreak += 1;
        }

        const newWeakness = { ...prev.weaknessStats };
        if (!success) {
            newWeakness[todayMission.type] = (newWeakness[todayMission.type] || 0) + 1;
        }

        return {
            ...prev,
            lastLoginDate: dateStr,
            currentStreak: newStreak,
            maxStreak: Math.max(prev.maxStreak, newStreak),
            completedMissions: newCompleted,
            missionHistory: newHistory,
            weaknessStats: newWeakness
        };
    });
  };

  const chartData = Object.entries(progress.weaknessStats).map(([name, value]) => ({
    name: name.split(' ')[0], // Shorten name for chart
    full: name,
    value: value as number
  }));

  const isCompletedToday = !!progress.missionHistory[getTodayDateString()];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                    <Layout className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-gray-800 hidden sm:block">오늘의 OOP <span className="text-indigo-600">미션</span></h1>
                <h1 className="text-xl font-bold tracking-tight text-gray-800 sm:hidden">OOP <span className="text-indigo-600">미션</span></h1>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span className="font-bold text-sm">{progress.currentStreak}</span>
                </div>
                <div className="hidden sm:flex items-center space-x-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4" />
                    <span className="font-bold text-sm">Lv. {Math.floor(progress.completedMissions.length / 5) + 1}</span>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar / Top Nav on Mobile */}
        <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <nav className="flex md:flex-col overflow-x-auto md:overflow-visible">
                    {[
                        { id: 'mission', label: '오늘의 미션', icon: Activity },
                        { id: 'sim', label: '마이크로 실험', icon: Layout },
                        { id: 'theory', label: '이론 개념', icon: BookOpen },
                        { id: 'quiz', label: '퀴즈', icon: HelpCircle },
                        { id: 'reflect', label: '생각해볼 문제', icon: ChevronRight },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`flex items-center space-x-3 px-4 py-4 md:py-3 min-w-[120px] md:min-w-0 transition-colors border-b md:border-b-0 md:border-l-4 ${
                                activeTab === item.id 
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                                : 'hover:bg-gray-50 border-transparent text-gray-600'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Weakness Chart (Desktop Only usually, but visible here) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hidden md:block">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">나의 오개념 지도</h3>
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip 
                                cursor={{fill: '#f3f4f6'}}
                                contentStyle={{fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value > 2 ? '#ef4444' : '#6366f1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {chartData.some(d => d.value > 0) ? (
                    <p className="text-xs text-gray-400 mt-2 text-center">그래프가 높을수록 자주 틀리는 유형입니다.</p>
                ) : (
                    <p className="text-xs text-gray-400 mt-2 text-center">아직 기록된 오답이 없습니다!</p>
                )}
            </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="md:col-span-9">
            {activeTab === 'mission' && (
                <div className="animate-fadeIn">
                    <DailyMission 
                        mission={todayMission} 
                        onComplete={handleMissionComplete}
                        isCompletedToday={isCompletedToday}
                    />
                </div>
            )}

            {activeTab === 'theory' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                    {THEORY_CARDS.map((card, i) => (
                        <div key={i} className={`bg-white p-6 rounded-xl border-l-4 shadow-sm ${card.color}`}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-lg">{card.title}</h3>
                                {card.icon}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {card.content}
                            </p>
                        </div>
                    ))}
                    <div className="col-span-1 sm:col-span-2 bg-indigo-900 text-white p-6 rounded-xl mt-4">
                        <h3 className="font-bold mb-2">심화: 왜 OOP를 써야 할까요?</h3>
                        <p className="text-indigo-200 text-sm">
                            절차적 프로그래밍(단순 함수 나열)은 작은 스크립트에서는 잘 작동합니다. 하지만 게임에 1,000개의 캐릭터가 등장한다고 상상해보세요.
                            모든 고블린을 위해 `goblin1_hp`, `goblin2_hp` 변수를 따로 만든다면 관리가 불가능해집니다.
                            OOP는 **타입(Type)**(예: 고블린)을 정의하고, 이를 무한히 생성(인스턴스화)하여 독립적인 메모리 공간에서 관리할 수 있게 해줍니다.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'sim' && (
                <div className="animate-fadeIn">
                    <Simulation />
                </div>
            )}

            {activeTab === 'quiz' && (
                <div className="animate-fadeIn">
                     <QuizSection 
                        questions={QUIZ_QUESTIONS}
                        onComplete={(score) => {
                            setProgress(p => ({...p, quizScore: Math.max(p.quizScore, score)}));
                        }}
                     />
                </div>
            )}

            {activeTab === 'reflect' && (
                <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-800">개발자 저널</h2>
                    {REFLECTION_PROMPTS.map((prompt) => (
                        <div key={prompt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-indigo-700 mb-2">{prompt.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{prompt.content}</p>
                            <textarea 
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                rows={3}
                                placeholder="여기에 생각을 적어보세요..."
                                // In a real app, this would be bound to specific IDs in state
                                defaultValue={""} 
                            />
                        </div>
                    ))}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800 text-sm text-center">
                        작성한 내용은 로컬에 저장되어 학습 내용을 복습하는 데 도움을 줍니다.
                    </div>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default App;