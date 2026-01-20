import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Trophy, BookOpen, Brain, Calendar as CalendarIcon, 
  CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Zap, ChevronRight, Star, AlertCircle, Library, School, Users
} from 'lucide-react';

import { Mission, UserStats, MissionType, ContextType, QuizQuestion } from './types';
import { SeededRNG, dateToSeed, getTodayString, calculateLevel, getBadgeList } from './utils';
import { SORTING_CONCEPTS, QUIZ_BANK } from './data';
import { Card, Button, Badge, Calendar } from './components/UI';

// --- Global Constants ---
const STORAGE_KEY = 'sorting-mission-v1';

const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  maxStreak: 0,
  lastCompletedDate: null,
  badges: [],
  history: {},
  weaknesses: []
};

// --- App Component ---

const App: React.FC = () => {
  const [currentDate] = useState<string>(getTodayString());
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [view, setView] = useState<'DASHBOARD' | 'MISSION' | 'QUIZ' | 'THINK' | 'DONE'>('DASHBOARD');
  
  // Mission State
  const [mission, setMission] = useState<Mission | null>(null);
  const [missionAnswer, setMissionAnswer] = useState<string>('');
  const [missionFeedback, setMissionFeedback] = useState<{correct: boolean, text: string} | null>(null);
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]); // User selected indices
  const [quizStep, setQuizStep] = useState(0);
  
  // Reflection State
  const [reflection, setReflection] = useState('');

  // --- Initialization & Storage ---
  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (stats !== INITIAL_STATS) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  // --- Logic Generators ---

  const generateDailyMission = (date: string): Mission => {
    const seed = dateToSeed(date);
    const rng = new SeededRNG(seed);
    
    // 1. Pick Type and Context
    const mTypes: MissionType[] = ['COMPARE_COUNT', 'ALGO_SELECT', 'TRUE_FALSE'];
    const contexts: ContextType[] = ['SCHOOL_NOTICE', 'CLUB_APPLICANT', 'LIBRARY_BOOK'];
    
    const type = rng.pick(mTypes);
    const context = rng.pick(contexts);
    
    // Context Flavor Text
    let contextIntro = "";
    if (context === 'SCHOOL_NOTICE') contextIntro = "학교 홈페이지 공지사항을 최신 날짜 순으로 정렬하려 합니다.";
    if (context === 'CLUB_APPLICANT') contextIntro = "동아리 신입 부원 100명의 지원서를 이름 순으로 정리 중입니다.";
    if (context === 'LIBRARY_BOOK') contextIntro = "도서관 반납 도서 카트를 청구 기호 순서대로 서가에 꽂아야 합니다.";

    let m: Partial<Mission> = {
      id: `${date}-${type}`,
      date: date,
      type,
      context,
    };

    // 2. Generate Specific Question
    if (type === 'COMPARE_COUNT') {
      const n = rng.nextInt(5, 8);
      m.title = "비교 횟수 추정 챌린지";
      m.question = `${contextIntro} 데이터가 ${n}개일 때, '버블 정렬'의 최악의 경우 총 비교 횟수는?`;
      m.answer = (n * (n - 1)) / 2;
      m.explanation = `버블 정렬의 비교 횟수는 1부터 n-1까지의 합입니다. ${n}개일 경우 1부터 ${n-1}까지 더하면 ${(n * (n - 1)) / 2}회입니다.`;
      m.concepts = [SORTING_CONCEPTS.BUBBLE, SORTING_CONCEPTS.COMPARE];
    } 
    else if (type === 'TRUE_FALSE') {
      m.title = "정렬 O/X 퀴즈";
      const isTrue = rng.next() > 0.5;
      
      if (context === 'LIBRARY_BOOK') {
        m.question = `${contextIntro} 책을 하나씩 꺼내 정렬된 서가의 알맞은 위치에 끼워넣는 방식은 '선택 정렬'이다.`;
        m.answer = "거짓";
        m.explanation = "이미 정렬된 데이터 사이에 새로운 데이터를 끼워 넣는 방식은 '삽입 정렬(Insertion Sort)'입니다.";
        m.concepts = [SORTING_CONCEPTS.INSERTION, SORTING_CONCEPTS.SELECTION];
      } else {
        m.question = `퀵 정렬(Quick Sort)은 피벗(Pivot)을 어떻게 선택하더라도 항상 O(n log n) 성능을 보장한다.`;
        m.answer = "거짓";
        m.explanation = "피벗이 최솟값이나 최댓값으로 계속 선택되는 최악의 경우 O(n^2)의 시간이 걸립니다.";
        m.concepts = [SORTING_CONCEPTS.QUICK, SORTING_CONCEPTS.COMPARE];
      }
    } 
    else { // ALGO_SELECT
      m.title = "최적의 알고리즘 선택";
      m.question = `${contextIntro} 이미 데이터가 99% 정렬되어 있는 상태입니다. 가장 효율적인 정렬 알고리즘은?`;
      m.options = ["퀵 정렬", "합병 정렬", "삽입 정렬", "선택 정렬"];
      m.answer = "삽입 정렬";
      m.explanation = "데이터가 거의 정렬된 경우, 삽입 정렬은 비교만 하고 교환이 거의 일어나지 않아 O(n)에 가까운 속도를 냅니다.";
      m.concepts = [SORTING_CONCEPTS.INSERTION, SORTING_CONCEPTS.COMPARE];
    }

    return m as Mission;
  };

  const startMission = () => {
    // Check if done already? (Allow retry if failed, or just view)
    // For this app, we generate fresh
    const m = generateDailyMission(currentDate);
    setMission(m);
    
    // Generate Quiz (Random 10 from bank seeded by date)
    const seed = dateToSeed(currentDate);
    const rng = new SeededRNG(seed + 1); // diff seed
    // Simple shuffle using RNG
    const shuffledQuiz = [...QUIZ_BANK].sort(() => rng.next() - 0.5);
    setQuizQuestions(shuffledQuiz);
    setQuizAnswers(new Array(shuffledQuiz.length).fill(-1));
    
    setView('MISSION');
  };

  // --- Handlers ---

  const handleMissionSubmit = () => {
    if (!mission) return;
    
    let isCorrect = false;
    const cleanAnswer = missionAnswer.toString().trim();
    
    if (mission.type === 'COMPARE_COUNT') {
      isCorrect = parseInt(cleanAnswer) === mission.answer;
    } else {
      isCorrect = cleanAnswer === mission.answer;
    }

    setMissionFeedback({
      correct: isCorrect,
      text: isCorrect ? "정답입니다! 정확한 판단이네요." : `아쉽네요. 정답은 '${mission.answer}'입니다.`
    });
  };

  const finishMissionPhase = () => {
    setView('QUIZ');
  };

  const handleQuizSubmit = (optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[quizStep] = optionIndex;
    setQuizAnswers(newAnswers);
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Quiz Done
      setView('THINK');
    }
  };

  const completeDay = () => {
    if (!mission) return;

    // Calculate Scores
    let totalScore = 0;
    const missionCorrect = missionFeedback?.correct || false;
    if (missionCorrect) totalScore += 50;

    let quizCorrectCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) quizCorrectCount++;
    });
    const quizScore = quizCorrectCount * 5; // 50 pts max
    totalScore += quizScore;

    // Reflection Bonus
    if (reflection.length > 10) totalScore += 10;

    // Update Stats
    const newStats = { ...stats };
    const todayStr = currentDate;
    
    if (!newStats.history[todayStr]) {
      // First time completing today
      newStats.history[todayStr] = {
        completed: true,
        score: totalScore,
        missionCorrect,
        quizScore,
        recovered: false
      };
      
      newStats.xp += totalScore;
      
      // Streak Logic
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      
      if (newStats.lastCompletedDate === yStr) {
        newStats.currentStreak += 1;
      } else if (newStats.lastCompletedDate !== todayStr) {
        newStats.currentStreak = 1; // Reset or Start
      }
      
      newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
      newStats.lastCompletedDate = todayStr;
    }

    // Level Calc
    newStats.level = calculateLevel(newStats.xp);
    
    // Identify Weaknesses (Quiz)
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] !== q.correctIndex) {
        if (!newStats.weaknesses.includes(q.tag)) {
          newStats.weaknesses.push(q.tag);
        }
      }
    });

    setStats(newStats);
    setView('DONE');
  };

  // --- Render Helpers ---

  const renderContextIcon = (ctx: ContextType) => {
    if (ctx === 'SCHOOL_NOTICE') return <School className="text-indigo-500" />;
    if (ctx === 'CLUB_APPLICANT') return <Users className="text-orange-500" />;
    return <Library className="text-emerald-500" />;
  };

  const renderDashboard = () => {
    const todayDone = !!stats.history[currentDate];
    const badges = getBadgeList(stats);

    return (
      <div className="space-y-6 animate-fade-in">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">오늘의 정렬 미션</h1>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Lv.{stats.level}</div>
            <div className="text-indigo-600 font-bold">{stats.xp} XP</div>
          </div>
        </header>

        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-indigo-100 text-sm font-medium mb-1">현재 스트릭</div>
              <div className="text-4xl font-bold flex items-center gap-2">
                {stats.currentStreak}일 <span className="text-2xl">🔥</span>
              </div>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Trophy className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
          <div className="mt-6">
            {todayDone ? (
              <Button disabled className="w-full bg-white/20 text-white cursor-not-allowed">
                <CheckCircle2 className="w-5 h-5" /> 오늘의 미션 완료
              </Button>
            ) : (
              <Button onClick={startMission} className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-lg">
                <Brain className="w-5 h-5" /> 미션 시작하기
              </Button>
            )}
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card title="내 배지">
             <div className="flex flex-wrap gap-2">
               {badges.length > 0 ? badges.map(b => (
                 <Badge key={b.id} {...b} />
               )) : <span className="text-gray-400 text-xs">아직 획득한 배지가 없습니다.</span>}
             </div>
          </Card>
          <Card title="취약 개념">
            <div className="flex flex-wrap gap-2">
               {stats.weaknesses.slice(0, 3).map(w => (
                 <span key={w} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">{SORTING_CONCEPTS[w]?.title || w}</span>
               ))}
               {stats.weaknesses.length === 0 && <span className="text-gray-400 text-xs">완벽합니다!</span>}
            </div>
          </Card>
        </div>

        {/* Calendar */}
        <Card title="월간 기록">
          <Calendar history={stats.history} currentDate={currentDate} />
          <div className="mt-2 text-xs text-gray-400 flex justify-end gap-3">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>완료</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 rounded-sm"></div>미완료</span>
          </div>
        </Card>
      </div>
    );
  };

  const renderMission = () => {
    if (!mission) return null;
    
    return (
      <div className="space-y-6 max-w-xl mx-auto pb-20">
        <div className="flex items-center gap-2 text-gray-500 mb-4 cursor-pointer" onClick={() => setView('DASHBOARD')}>
          <ArrowRight className="w-4 h-4 rotate-180" /> 돌아가기
        </div>

        {/* Concept Cards */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">오늘의 개념</h3>
          <div className="grid gap-3">
            {mission.concepts.map((c, i) => (
              <div key={i} className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500">
                  {/* Icon mapping would go here, simplified for brevity */}
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">{c.title}</h4>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Mission */}
        <Card className="border-indigo-200 shadow-indigo-100">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-indigo-100 p-2 rounded-full">{renderContextIcon(mission.context)}</span>
             <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">미션</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{mission.title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
            {mission.question}
          </p>

          <div className="space-y-4">
            {!missionFeedback ? (
              <>
                {mission.type === 'ALGO_SELECT' ? (
                  <div className="grid grid-cols-1 gap-2">
                    {mission.options?.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setMissionAnswer(opt)}
                        className={`p-3 rounded-lg border text-left transition-colors ${missionAnswer === opt ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : mission.type === 'TRUE_FALSE' ? (
                  <div className="flex gap-4">
                    <button onClick={() => setMissionAnswer("참")} className={`flex-1 p-4 rounded-xl border-2 font-bold ${missionAnswer === '참' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200'}`}>O (참)</button>
                    <button onClick={() => setMissionAnswer("거짓")} className={`flex-1 p-4 rounded-xl border-2 font-bold ${missionAnswer === '거짓' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200'}`}>X (거짓)</button>
                  </div>
                ) : (
                  <input 
                    type="number" 
                    placeholder="숫자를 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={missionAnswer}
                    onChange={(e) => setMissionAnswer(e.target.value)}
                  />
                )}
                <Button onClick={handleMissionSubmit} disabled={!missionAnswer} className="w-full mt-4">제출하기</Button>
              </>
            ) : (
              <div className="animate-fade-in">
                <div className={`p-4 rounded-lg flex items-start gap-3 mb-4 ${missionFeedback.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {missionFeedback.correct ? <CheckCircle2 className="shrink-0" /> : <XCircle className="shrink-0" />}
                  <div>
                    <div className="font-bold mb-1">{missionFeedback.text}</div>
                    <div className="text-sm opacity-90">{mission.explanation}</div>
                  </div>
                </div>
                <Button onClick={finishMissionPhase} variant="secondary" className="w-full">다음 단계: 퀴즈 도전 <ChevronRight size={16} /></Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const renderQuiz = () => {
    const currentQ = quizQuestions[quizStep];
    const progress = ((quizStep) / 10) * 100;

    return (
      <div className="space-y-6 max-w-xl mx-auto h-[90vh] flex flex-col">
        <div className="mb-4">
           <div className="flex justify-between text-xs text-gray-500 mb-1">
             <span>문제 {quizStep + 1}/10</span>
             <span>진행률 {Math.round(progress)}%</span>
           </div>
           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
           </div>
        </div>

        <Card className="flex-1 flex flex-col justify-center">
          <div className="mb-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs text-gray-500 font-mono">
             #{currentQ.tag}
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-6">{currentQ.question}</h2>
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuizSubmit(idx)}
                className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all active:scale-[0.98]"
              >
                {opt}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderThink = () => {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <Card title="🤔 생각해볼 문제">
          <p className="text-gray-600 mb-4">
            오늘 배운 정렬 알고리즘이 <strong>실제 스마트폰의 연락처 앱</strong>에서는 어떻게 쓰일까요?
            연락처는 수시로 추가되고 삭제됩니다. 이때 가장 적절한 정렬 전략은 무엇일지 100자 내외로 적어보세요.
          </p>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="여기에 생각을 적어주세요..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          ></textarea>
          <div className="text-right text-xs text-gray-400 mt-1">작성 시 경험치 보너스 +10XP</div>
          <Button onClick={completeDay} className="w-full mt-4">오늘의 미션 최종 완료</Button>
        </Card>
      </div>
    );
  };

  const renderDone = () => {
    const record = stats.history[currentDate];
    return (
      <div className="max-w-xl mx-auto text-center pt-12 space-y-8 animate-fade-in">
        <div className="relative inline-block">
           <Trophy className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-lg" />
           <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
             +{record.score} XP
           </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-800">오늘의 챌린지 성공!</h2>
          <p className="text-gray-500 mt-2">꾸준함이 최고의 알고리즘입니다.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-xs text-gray-400">미션 결과</div>
            <div className={`font-bold ${record.missionCorrect ? 'text-green-600' : 'text-red-500'}`}>
              {record.missionCorrect ? '성공' : '실패'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="text-xs text-gray-400">퀴즈 점수</div>
             <div className="font-bold text-indigo-600">{record.quizScore}점</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="text-xs text-gray-400">총 획득 XP</div>
             <div className="font-bold text-yellow-600">{record.score}</div>
          </div>
        </div>

        <Button onClick={() => setView('DASHBOARD')} variant="outline" className="w-full">
          홈으로 돌아가기
        </Button>

        {stats.weaknesses.length > 0 && (
           <div className="bg-orange-50 p-4 rounded-lg text-left text-sm text-orange-800 flex items-start gap-2">
             <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
             <div>
               <strong>복습 필요:</strong> {stats.weaknesses.slice(-2).map(w => SORTING_CONCEPTS[w].title).join(', ')} 개념을 다시 확인해보세요!
             </div>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-10">
      {view === 'DASHBOARD' && renderDashboard()}
      {view === 'MISSION' && renderMission()}
      {view === 'QUIZ' && renderQuiz()}
      {view === 'THINK' && renderThink()}
      {view === 'DONE' && renderDone()}
    </div>
  );
};

// Root rendering
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}

export default App;
