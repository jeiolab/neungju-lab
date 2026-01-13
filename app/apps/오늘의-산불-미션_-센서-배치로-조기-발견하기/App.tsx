import React, { useState, useEffect } from 'react';
import { BookOpen, Map, Edit3, Award, BarChart2, Flame, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { UserState, DailyRecord, SimulationResult, GridCell, LEVEL_THRESHOLDS } from './types';
import { THEORY_CARDS, QUIZ_DATA } from './constants';
import { getTodaySeed } from './utils';
import SimulationTab from './components/SimulationTab';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// --- Sub-components for other tabs (kept in App.tsx for file count constraint) ---

// 1. Theory Tab
const TheoryTab = () => (
  <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
    {THEORY_CARDS.map((card, idx) => (
      <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
          {card.icon === 'Grid' && <Map size={24} />}
          {card.icon === 'Radio' && <RadioIcon size={24} />}
          {card.icon === 'AlertTriangle' && <AlertTriangle size={24} />}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{card.content}</p>
      </div>
    ))}
    <div className="md:col-span-3 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg mt-4">
      <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lightbulb /> 심화 학습: 데이터 기반 의사결정</h3>
      <p className="text-indigo-100 text-sm">
        산불 감지는 단순히 '불'만 보는 것이 아닙니다. 
        <br/> 
        1. <strong>환경 데이터:</strong> 온도, 습도, 풍향
        <br/> 
        2. <strong>과거 데이터:</strong> 자주 불이 나는 곳(Hotspot) 분석
        <br/>
        이 두 가지를 결합해 센서를 배치하는 것이 진정한 엔지니어의 역할입니다.
      </p>
    </div>
  </div>
);

// 2. Quiz Tab
const QuizTab: React.FC<{ 
  completedQuizzes: number[], 
  onAnswer: (id: number, correct: boolean) => void 
}> = ({ completedQuizzes, onAnswer }) => {
  const [activeId, setActiveId] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQ = QUIZ_DATA.find(q => q.id === activeId) || QUIZ_DATA[0];
  const isCorrect = selectedOption === currentQ.correctIndex;
  const isAlreadySolved = completedQuizzes.includes(currentQ.id);

  const handleCheck = () => {
    setShowResult(true);
    if (selectedOption !== null) {
       onAnswer(currentQ.id, selectedOption === currentQ.correctIndex);
    }
  };

  const handleNext = () => {
    if (activeId < 10) {
      setActiveId(activeId + 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between mb-4 text-sm font-bold text-gray-500">
        <span>Question {activeId} / 10</span>
        <span className={isAlreadySolved ? "text-green-500" : "text-gray-400"}>
          {isAlreadySolved ? "해결 완료" : "도전 중"}
        </span>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-4 font-medium">
          {currentQ.category}
        </span>
        <h3 className="text-xl font-bold text-gray-800 mb-6">{currentQ.question}</h3>
        
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !showResult && !isAlreadySolved && setSelectedOption(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedOption === idx 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-100 hover:border-gray-200'
              } ${showResult && idx === currentQ.correctIndex ? '!border-green-500 !bg-green-50' : ''}
                ${showResult && selectedOption === idx && idx !== currentQ.correctIndex ? '!border-red-500 !bg-red-50' : ''}
              `}
              disabled={showResult || isAlreadySolved}
            >
              {opt}
            </button>
          ))}
        </div>

        {!isAlreadySolved && !showResult && (
          <button 
            onClick={handleCheck}
            disabled={selectedOption === null}
            className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            정답 확인하기
          </button>
        )}

        {(showResult || isAlreadySolved) && (
          <div className="mt-8 bg-gray-50 p-6 rounded-xl animate-fade-in">
             <div className="flex items-center gap-2 font-bold mb-2">
               {(isCorrect || isAlreadySolved) ? <span className="text-green-600">정답입니다! 👏</span> : <span className="text-red-600">아쉽네요... 😅</span>}
             </div>
             <p className="text-gray-700 text-sm leading-relaxed">{currentQ.explanation}</p>
             <button 
                onClick={handleNext}
                className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900"
             >
                {activeId < 10 ? "다음 문제" : "모든 문제 완료"}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Application Design Tab
const DesignTab = () => {
  const [text, setText] = useState("");
  const handleSave = () => {
    localStorage.setItem('iot_app6_design', text);
    alert("저장되었습니다!");
  };

  useEffect(() => {
    const saved = localStorage.getItem('iot_app6_design');
    if (saved) setText(saved);
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Edit3 size={20} className="text-orange-500"/> 적용 설계: 우리 지역 지킴이
        </h3>
        <p className="text-gray-600 mb-6 text-sm">
          학교 뒷산이나 우리 동네 공원을 떠올려보세요. <br/>
          <strong>"어디에 센서를 두어야 가장 안전할까요?"</strong><br/>
          사람들이 자주 다니는 등산로 입구? 아니면 바람이 강하게 부는 정상?
        </p>
        <textarea 
          className="w-full h-48 p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none bg-orange-50/30"
          placeholder="예: 우리 학교 뒷산에는 정자가 하나 있는데, 그곳은 사람들이 몰래 담배를 피울 수 있어 위험합니다. 그 주변에 연기 감지 센서를 집중 배치하고..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button onClick={handleSave} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700">
            내 생각 저장하기
          </button>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h4 className="font-bold text-indigo-800 mb-2">🤔 생각해볼 문제 (심화)</h4>
        <ul className="list-disc pl-5 space-y-2 text-indigo-700 text-sm">
          <li><strong>조건 변경:</strong> 만약 센서 하나가 배터리가 다 되어서 꺼졌다면, 시스템은 어떻게 대처해야 할까요?</li>
          <li><strong>반례 찾기:</strong> 온도가 갑자기 40도로 올랐습니다. 산불이 아닐 가능성은 무엇이 있을까요? (힌트: 한여름 직사광선이 센서에 직접 닿음)</li>
        </ul>
      </div>
    </div>
  );
};

// 4. Stats Component
const StatsView: React.FC<{ history: DailyRecord[] }> = ({ history }) => {
  const data = history.slice(-7).map(h => ({
    name: h.date.slice(4), // MMDD
    score: h.score,
    success: h.metrics.success ? 1 : 0
  }));

  const pieData = [
    { name: '성공', value: history.filter(h => h.metrics.success).length },
    { name: '실패', value: history.filter(h => !h.metrics.success).length },
  ];
  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
        <h3 className="font-bold text-gray-700 mb-4">최근 7일 점수 추이</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12}/>
            <YAxis domain={[0, 100]} fontSize={12}/>
            <RechartsTooltip />
            <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col items-center">
        <h3 className="font-bold text-gray-700 mb-4 text-left w-full">미션 성공률</h3>
        <div className="w-full h-full flex items-center justify-center">
            {history.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <RechartsTooltip />
                 </PieChart>
               </ResponsiveContainer>
            ) : (
                <div className="text-gray-400">데이터가 없습니다.</div>
            )}
        </div>
      </div>
    </div>
  );
};

const RadioIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </svg>
);


// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'THEORY' | 'SIMULATION' | 'QUIZ' | 'DESIGN' | 'STATS'>('THEORY');
  const [user, setUser] = useState<UserState>({
    level: 1,
    exp: 0,
    streak: 0,
    lastLoginDate: '',
    history: [],
    wrongAnswers: []
  });

  // Load User Data
  useEffect(() => {
    const saved = localStorage.getItem('iot_app6_user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      // Initialize if new
      setUser(prev => ({ ...prev, lastLoginDate: getTodaySeed() }));
    }
  }, []);

  // Save User Data whenever it changes
  useEffect(() => {
    localStorage.setItem('iot_app6_user', JSON.stringify(user));
  }, [user]);

  const handleSimulationComplete = (result: SimulationResult, layout: GridCell[]) => {
    const today = getTodaySeed();
    const existingIndex = user.history.findIndex(h => h.seed === today);
    
    // Only add points if better score or first time today
    const newRecord: DailyRecord = {
      date: today,
      seed: today,
      completed: true,
      score: result.score,
      metrics: result,
      reflection: ""
    };

    let newExp = user.exp;
    let newStreak = user.streak;

    if (existingIndex === -1) {
       // First time today
       newExp += result.score;
       if (user.lastLoginDate !== today) { // Should implement stricter yesterday check for streak, simplified here
          newStreak += 1; 
       }
    } else {
       // Replay: Update record if score is better
       if (result.score > user.history[existingIndex].score) {
          newExp += (result.score - user.history[existingIndex].score);
       }
    }
    
    // Level Up Logic
    let newLevel = user.level;
    while(newExp >= LEVEL_THRESHOLDS[newLevel]) {
        newLevel++;
    }

    const newHistory = existingIndex === -1 
      ? [...user.history, newRecord] 
      : user.history.map((h, i) => i === existingIndex ? (result.score > h.score ? newRecord : h) : h);

    setUser({
      ...user,
      exp: newExp,
      level: newLevel,
      streak: newStreak,
      lastLoginDate: today,
      history: newHistory
    });
    
    setActiveTab('STATS');
  };

  const handleQuizAnswer = (id: number, correct: boolean) => {
    if (!correct) {
       if (!user.wrongAnswers.includes(id)) {
          setUser(prev => ({ ...prev, wrongAnswers: [...prev.wrongAnswers, id] }));
       }
    } else {
        // Correct answer reward
        if (user.wrongAnswers.includes(id)) {
            // Remove from wrong answers if solved correctly now
            setUser(prev => ({ ...prev, wrongAnswers: prev.wrongAnswers.filter(w => w !== id) }));
        }
    }
  };

  // Check if today's mission is done
  const todaySeed = getTodaySeed();
  const todayRecord = user.history.find(h => h.seed === todaySeed);
  const isMissionDone = !!todayRecord;

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg text-white">
              <Flame size={20} fill="currentColor" />
            </div>
            <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-tight">
              오늘의 산불 미션 <span className="text-xs font-normal text-gray-400 ml-1">Beta</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
             <div className="flex items-center gap-1 text-gray-600">
               <Award size={16} className="text-yellow-500" />
               <span className="font-bold">Lv.{user.level}</span>
             </div>
             <div className="hidden md:flex items-center gap-1 text-gray-600">
               <span className="font-bold text-orange-500">{user.streak}일</span> 연속
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
          {[
            { id: 'THEORY', label: '1. 개념 학습', icon: BookOpen },
            { id: 'SIMULATION', label: '2. 오늘의 미션', icon: Map },
            { id: 'STATS', label: '3. 결과 리포트', icon: BarChart2 },
            { id: 'QUIZ', label: '4. 퀴즈', icon: CheckCircle },
            { id: 'DESIGN', label: '5. 적용 설계', icon: Edit3 },
          ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium text-sm border ${
                 activeTab === tab.id
                   ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                   : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
               }`}
             >
               <tab.icon size={16} />
               {tab.label}
               {tab.id === 'SIMULATION' && isMissionDone && (
                 <span className="w-2 h-2 bg-green-500 rounded-full ml-1"></span>
               )}
             </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up">
           {activeTab === 'THEORY' && <TheoryTab />}
           {activeTab === 'SIMULATION' && (
             <SimulationTab onComplete={handleSimulationComplete} initialCompleted={isMissionDone} />
           )}
           {activeTab === 'STATS' && (
             <StatsView history={user.history} />
           )}
           {activeTab === 'QUIZ' && (
             <QuizTab completedQuizzes={[]} onAnswer={handleQuizAnswer} />
           )}
           {activeTab === 'DESIGN' && <DesignTab />}
        </div>
      </main>
    </div>
  );
};

export default App;
