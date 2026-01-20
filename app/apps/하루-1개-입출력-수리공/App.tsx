import React, { useState, useEffect, useMemo } from 'react';
import { Book, Hammer, MessageSquare, Brain, HelpCircle, Trophy, RotateCcw, AlertTriangle } from 'lucide-react';
import { ConceptCard } from './components/ConceptCard';
import { DailyMission } from './components/DailyMission';
import { MissionCalendar } from './components/MissionCalendar';
import { 
    TabType, 
    UserProgress, 
    INITIAL_PROGRESS, 
    DailyMission as MissionType 
} from './types';
import { CONCEPTS, MISSION_POOL, QUIZ_DATA } from './data';
import { getTodayString, seededRandom } from './utils';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('mission');
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('io_mechanic_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure merged with defaults in case of new fields
        setProgress({ ...INITIAL_PROGRESS, ...parsed });
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    setLoading(false);
  }, []);

  // Save progress on change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('io_mechanic_progress', JSON.stringify(progress));
    }
  }, [progress, loading]);

  // Daily Logic
  const todayStr = getTodayString();
  
  // Select daily mission deterministically based on date
  const todaysMission: MissionType = useMemo(() => {
    const rng = seededRandom(todayStr);
    const index = Math.floor(rng() * MISSION_POOL.length);
    return MISSION_POOL[index];
  }, [todayStr]);

  const isTodayCompleted = !!progress.completedMissions[todayStr];

  const handleMissionComplete = () => {
    if (isTodayCompleted) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if streak continues (if completed yesterday)
    // For simplicity, we just check if lastLoginDate was yesterday or today
    // Ideally, we check completedMissions[yesterdayStr]
    
    const wasCompletedYesterday = !!progress.completedMissions[yesterdayStr];
    const newStreak = wasCompletedYesterday ? progress.streak + 1 : 1;

    // Check for badges
    const newBadges = [...progress.badges];
    if (newStreak === 7 && !newBadges.includes('week_streak')) newBadges.push('week_streak');
    if (progress.xp >= 100 && !newBadges.includes('novice_mechanic')) newBadges.push('novice_mechanic');

    setProgress(prev => ({
      ...prev,
      xp: prev.xp + 50,
      streak: newStreak,
      lastLoginDate: todayStr,
      badges: newBadges,
      completedMissions: {
        ...prev.completedMissions,
        [todayStr]: true
      }
    }));
  };

  const handleReset = () => {
    localStorage.removeItem('io_mechanic_progress');
    setProgress(INITIAL_PROGRESS);
    setShowResetConfirm(false);
    window.location.reload();
  };

  // Quiz Handling
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  const handleQuizSubmit = () => {
    let correctCount = 0;
    const wrongIds: number[] = [];
    
    QUIZ_DATA.forEach(q => {
        if (quizAnswers[q.id] === q.correctIndex) {
            correctCount++;
        } else {
            wrongIds.push(q.id);
        }
    });

    setQuizSubmitted(true);
    // Update wrong answers history
    const uniqueWrongs = Array.from(new Set([...progress.quizHistory.wrongQuestionIds, ...wrongIds]));
    
    setProgress(prev => ({
        ...prev,
        xp: prev.xp + (correctCount * 10),
        quizHistory: {
            totalAttempts: prev.quizHistory.totalAttempts + 1,
            wrongQuestionIds: uniqueWrongs
        }
    }));
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Top Navigation / Header */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Hammer className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-gray-800 text-lg sm:text-xl tracking-tight hidden sm:block">하루 1개 입출력 수리공</h1>
            <h1 className="font-bold text-gray-800 text-lg sm:text-xl tracking-tight sm:hidden">입출력 수리공</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
                 <div className="flex items-center gap-1 text-orange-600 font-bold text-sm">
                    <span className="text-xs text-gray-400 font-normal">STREAK</span>
                    🔥 {progress.streak}
                 </div>
                 <div className="text-xs text-gray-500 font-mono">XP: {progress.xp}</div>
             </div>
             <button 
                onClick={() => setShowResetConfirm(true)}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Reset Data"
             >
                <RotateCcw className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* TAB 1: Concepts */}
        {activeTab === 'concepts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">입출력 핵심 개념</h2>
                <div className="grid gap-6 md:grid-cols-1">
                    {CONCEPTS.map(concept => (
                        <ConceptCard key={concept.id} concept={concept} />
                    ))}
                </div>
            </div>
        )}

        {/* TAB 2: Daily Mission */}
        {activeTab === 'mission' && (
             <div className="animate-in fade-in duration-300">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2 py-1 rounded">Today's Job</span>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{todayStr} 미션</h2>
                    </div>
                </div>
                <DailyMission 
                    mission={todaysMission}
                    isCompleted={isTodayCompleted}
                    onComplete={handleMissionComplete}
                    streak={progress.streak}
                    completedMissions={progress.completedMissions}
                />
            </div>
        )}

        {/* TAB 3: Scenario */}
        {activeTab === 'scenario' && (
            <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">현실 시나리오</h2>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center p-6">
                        <MessageSquare className="text-white w-16 h-16 opacity-80" />
                    </div>
                    <div className="p-8">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">학교 방송부</span>
                        <h3 className="text-xl font-bold mt-4 mb-3">사라진 사연들</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            학교 축제 때 라디오 부스에서 학생들의 신청곡과 사연을 받고 있습니다. 
                            방송부원인 지수는 노트북으로 사연을 텍스트 파일에 저장하는 프로그램을 짰습니다.
                            <br/><br/>
                            그런데, 프로그램을 껐다가 다시 켜서 새 사연을 입력했더니 
                            <strong> 이전에 입력했던 모든 사연이 사라졌습니다!</strong>
                            <br/><br/>
                            학생들이 항의하기 시작했습니다. 지수는 패닉에 빠졌습니다.
                            원인은 파일을 열 때 <code>mode='w'</code>를 썼기 때문입니다.
                            'w' 모드는 파일을 열 때마다 내용을 백지화합니다.
                            <br/><br/>
                            <strong>해결책:</strong> <code>mode='a'</code> (Append)를 사용하여 기존 내용 뒤에 덧붙여야 합니다.
                        </p>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800">
                            <strong>Tip:</strong> 로그(Log) 파일이나 누적 데이터는 반드시 'a' 모드를 사용하세요.
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB 4: Quiz */}
        {activeTab === 'quiz' && (
            <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">개념 퀴즈</h2>
                    <span className="text-sm text-gray-500">누적 시도: {progress.quizHistory.totalAttempts}회</span>
                </div>
                
                <div className="space-y-8">
                    {QUIZ_DATA.map((q, idx) => {
                        const isWrongHistory = progress.quizHistory.wrongQuestionIds.includes(q.id);
                        return (
                            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg text-gray-800">Q{idx+1}. {q.question}</h3>
                                    {isWrongHistory && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">오답 노트</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {q.options.map((opt, oIdx) => (
                                        <label key={oIdx} className={`
                                            flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                                            ${quizSubmitted && q.correctIndex === oIdx ? 'bg-green-50 border-green-500 ring-1 ring-green-500' : ''}
                                            ${quizSubmitted && quizAnswers[q.id] === oIdx && q.correctIndex !== oIdx ? 'bg-red-50 border-red-300' : 'hover:bg-gray-50'}
                                        `}>
                                            <input 
                                                type="radio" 
                                                name={`q-${q.id}`} 
                                                className="w-4 h-4 text-blue-600"
                                                disabled={quizSubmitted}
                                                onChange={() => setQuizAnswers(prev => ({...prev, [q.id]: oIdx}))}
                                                checked={quizAnswers[q.id] === oIdx}
                                            />
                                            <span className="ml-3 text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                                {quizSubmitted && (
                                    <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg">
                                        <strong>해설:</strong> {q.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {!quizSubmitted ? (
                    <button 
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < QUIZ_DATA.length}
                        className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        제출하고 채점하기
                    </button>
                ) : (
                    <button 
                        onClick={() => {
                            setQuizSubmitted(false);
                            setQuizAnswers({});
                            window.scrollTo({top:0, behavior: 'smooth'});
                        }}
                        className="w-full mt-8 bg-gray-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-900 transition-colors"
                    >
                        다시 풀기
                    </button>
                )}
            </div>
        )}

        {/* TAB 5: Thinking */}
        {activeTab === 'thinking' && (
             <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">생각해보기</h2>
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-start gap-3 mb-4">
                        <Brain className="w-8 h-8 text-purple-500 shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">데이터 영속성 (Data Persistence)</h3>
                            <p className="text-gray-600 text-sm mt-1">프로그램이 종료되어도 데이터가 사라지지 않게 하려면 어떻게 해야 할까요?</p>
                        </div>
                    </div>
                    <textarea 
                        className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700"
                        placeholder="변수는 프로그램이 끝나면 메모리에서 사라집니다. 이를 막기 위해 우리는 무엇을 사용해야 할까요? 자유롭게 적어보세요."
                        value={progress.thinkingAnswers[1] || ''}
                        onChange={(e) => setProgress(p => ({
                            ...p, 
                            thinkingAnswers: {...p.thinkingAnswers, 1: e.target.value}
                        }))}
                    />
                    <div className="mt-4 flex justify-end">
                        <button className="text-sm text-purple-600 font-semibold hover:underline">
                            저장됨 (자동)
                        </button>
                    </div>
                 </div>
                 
                 <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>생각 문제는 정답이 없습니다. 나만의 논리를 만들어보세요.</span>
                 </div>
             </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar py-3">
            <NavButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<Book size={18} />} label="개념 학습" />
            <NavButton active={activeTab === 'mission'} onClick={() => setActiveTab('mission')} icon={<Hammer size={18} />} label="오늘의 미션" />
            <NavButton active={activeTab === 'scenario'} onClick={() => setActiveTab('scenario')} icon={<MessageSquare size={18} />} label="시나리오" />
            <NavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<Trophy size={18} />} label="퀴즈" />
            <NavButton active={activeTab === 'thinking'} onClick={() => setActiveTab('thinking')} icon={<Brain size={18} />} label="생각 문제" />
          </div>
        </div>
      </nav>

      {/* Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-2 text-red-600 mb-4">
                    <AlertTriangle />
                    <h3 className="font-bold text-lg">데이터 초기화</h3>
                </div>
                <p className="text-gray-600 mb-6">
                    모든 학습 기록과 스트릭, XP가 삭제됩니다.<br/>
                    정말 초기화하시겠습니까?
                </p>
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={() => setShowResetConfirm(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                        취소
                    </button>
                    <button 
                        onClick={handleReset}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                    >
                        초기화
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${active ? 'text-blue-600 bg-blue-50 font-bold border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
    >
        {icon}
        <span className="text-sm">{label}</span>
    </button>
);

export default App;
