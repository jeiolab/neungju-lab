import React, { useState, useEffect } from 'react';
import { DailyMission, TabType, UserState } from './types';
import { generateDailyMission, getThinkContent } from './services/geminiService';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import { BookOpen, Code2, BrainCircuit, Lightbulb, Trophy, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [userState, setUserState] = useState<UserState>({
    streak: 0,
    lastPlayedDate: null,
    completedToday: false,
    score: 0
  });
  const [loading, setLoading] = useState(true);
  const [thinkContent, setThinkContent] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      // Load user state from local storage
      const savedState = localStorage.getItem('searchDrillState');
      let currentStreak = 0;
      let lastDate = null;
      
      if (savedState) {
        const parsed = JSON.parse(savedState);
        currentStreak = parsed.streak;
        lastDate = parsed.lastPlayedDate;
        setUserState(parsed);
      }

      const today = new Date().toDateString();
      const dailyMission = await generateDailyMission(today);
      setMission(dailyMission);
      
      // Check if already completed today
      if (lastDate === today && savedState) {
         setUserState(prev => ({ ...prev, completedToday: JSON.parse(savedState).completedToday }));
      } else {
         // Reset daily completion status if new day
         setUserState(prev => ({ ...prev, completedToday: false }));
      }
      
      setLoading(false);

      // Pre-fetch 'Think' content
      const think = await getThinkContent("컴퓨터는 왜 사람처럼 '대충 이쯤'을 짐작하지 못할까?");
      setThinkContent(think);
    };

    init();
  }, []);

  const handleComplete = (score: number) => {
    if (userState.completedToday) return;

    const today = new Date().toDateString();
    const newStreak = userState.lastPlayedDate && 
      new Date(userState.lastPlayedDate).getTime() === new Date(today).getTime() - 86400000 
      ? userState.streak + 1 
      : 1; // Simple streak logic

    const newState = {
      streak: userState.streak + 1, // Simply increment for demo purposes
      lastPlayedDate: today,
      completedToday: true,
      score: userState.score + score
    };

    setUserState(newState);
    localStorage.setItem('searchDrillState', JSON.stringify(newState));
  };

  if (loading || !mission) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-700">오늘의 미션 데이터 생성 중...</h2>
        <p className="text-slate-500 mt-2">Gemini AI가 오늘의 탐색 시나리오를 만들고 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Code2 size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">일일 탐색 드릴</h1>
              <p className="text-xs text-slate-500">{mission.date} - 오늘의 미션</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <Flame size={18} fill="currentColor" />
              <span>{userState.streak}일 연속</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full">
              <Trophy size={18} />
              <span>점수: {userState.score}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'theory' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <BookOpen size={16} /> 이론 개념
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'simulation' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Code2 size={16} /> 시뮬레이션
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Lightbulb size={16} /> 퀴즈
          </button>
          <button
            onClick={() => setActiveTab('think')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'think' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <BrainCircuit size={16} /> 생각해보기
          </button>
        </div>

        {/* Tab Content */}
        <div className="h-full">
          {activeTab === 'theory' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fadeIn">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">오늘의 개념: {mission.optimalAlgorithm === 'binary' ? '이진 탐색 (Binary Search)' : '순차 탐색 (Linear Search)'}</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-slate-700">{mission.theoryContent}</p>
                <div className="mt-6 bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2">의사코드(Pseudo-code) 읽는 법</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-600">
                    <li><strong>While (조건):</strong> 조건이 참인 동안 계속 반복합니다.</li>
                    <li><strong>If / Else:</strong> 상황에 따라 다른 행동을 합니다.</li>
                    <li><strong>Return:</strong> 값을 찾았을 때 결과를 반환하고 종료합니다.</li>
                    <li><strong>Mid = (Low + High) / 2:</strong> 탐색 범위를 반으로 쪼개는 핵심 로직입니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'simulation' && (
            <SimulationTab 
              mission={mission} 
              onComplete={handleComplete} 
              isCompleted={userState.completedToday}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizTab mission={mission} />
          )}

          {activeTab === 'think' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                  <BrainCircuit size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">오늘의 생각거리</h2>
                  <p className="text-lg font-medium text-slate-900 mb-6">"컴퓨터는 왜 사람처럼 '대충 이쯤'을 짐작하지 못할까?"</p>
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line">
                    {thinkContent}
                  </div>
                  <div className="mt-6 text-sm text-slate-500">
                    * 힌트: 이것은 '보간 탐색(Interpolation Search)'이라는 더 발전된 개념과 관련이 있습니다. 데이터의 분포를 알면 더 빨리 찾을 수 있죠!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;