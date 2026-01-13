import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Gamepad2, 
  BookOpen, 
  BrainCircuit, 
  MessageSquare, 
  Flame, 
  Trophy,
  ChevronRight,
  Database,
  AlertTriangle,
  Sparkles,
  Check
} from 'lucide-react';
import { Tab, UserStats, GameLevel } from './types';
import { LEVELS, INITIAL_STATS, STATIC_QUIZ } from './constants';
import { SimulationEngine } from './components/SimulationEngine';
import { generateQuizQuestion, evaluateDiscussionAnswer } from './services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- Tab Components ---

const TheoryTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
        <Database className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">GIGO 원칙</h3>
      <p className="text-slate-600 leading-relaxed mb-4">
        "Garbage In, Garbage Out". AI 모델이 아무리 뛰어나도, 입력 데이터가 엉망이면(누락, 불일치, 오류) 결과도 쓸모가 없다는 뜻입니다.
      </p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-500">
        <strong>비유:</strong> 상한 재료로 요리를 한다고 상상해보세요. 아무리 훌륭한 요리사라도 맛있는 음식을 만들 수는 없습니다.
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">흔한 더러운 데이터</h3>
      <ul className="space-y-3 text-slate-600">
        <li className="flex items-start gap-2">
          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold mt-1">결측치 (NaN)</span>
          <span>값이 비어있습니다. 평균값/중앙값으로 채우거나(대치) 삭제하여 해결합니다.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-xs font-bold mt-1">이상치 (Outlier)</span>
          <span>극단적인 값(예: 나이 200세). 평균을 심각하게 왜곡할 수 있습니다.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs font-bold mt-1">중복 (Duplicate)</span>
          <span>똑같은 데이터가 반복되어 통계적 유의성을 해칩니다.</span>
        </li>
      </ul>
    </div>
  </div>
);

const InsightsTab = () => {
    const timeData = [
        { name: '수집', value: 10 },
        { name: '정제 (80%)', value: 80 },
        { name: '모델링', value: 5 },
        { name: '배포', value: 5 },
    ];
    const COLORS = ['#94a3b8', '#3b82f6', '#64748b', '#cbd5e1'];

    return (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-[500px] flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">데이터 과학의 80/20 법칙</h3>
            <p className="text-slate-500 mb-6">현업 데이터 과학자들은 업무 시간의 대부분을 데이터 준비에 사용합니다.</p>
            
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {timeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <div className="mt-4 text-center text-sm text-slate-400 italic">출처: CrowdFlower 데이터 과학 보고서</div>
        </div>
    );
};

const QuizTab = () => {
  const [questions, setQuestions] = useState(STATIC_QUIZ);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (idx: number) => {
    if (idx === questions[currentQ].correctAnswer) {
      setScore(s => s + 1);
    }
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      setShowResult(true);
    }
  };

  const loadAiQuestion = async () => {
    setLoading(true);
    const newQ = await generateQuizQuestion("Imputing Missing Values");
    if (newQ) {
        setQuestions(prev => [...prev, { ...newQ, id: prev.length + 1 }]);
    }
    setLoading(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">퀴즈 완료!</h3>
        <p className="text-slate-600 mb-6">{questions.length}문제 중 {score}점을 맞췄습니다.</p>
        <button 
          onClick={() => { setShowResult(false); setCurrentQ(0); setScore(0); }}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">문제 {currentQ + 1} / {questions.length}</span>
                {process.env.API_KEY && (
                   <button 
                     onClick={loadAiQuestion} 
                     disabled={loading}
                     className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200 disabled:opacity-50"
                   >
                     {loading ? '생성 중...' : '+ AI 문제 추가'}
                   </button>
                )}
            </div>
            <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">{q.question}</h3>
                <div className="space-y-3">
                    {q.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-700"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            {currentQ > 0 && (
                <div className="p-4 bg-blue-50 text-blue-800 text-sm border-t border-blue-100">
                    <strong>이전 문제 해설:</strong> {questions[currentQ-1].explanation}
                </div>
            )}
        </div>
    </div>
  );
};

const DiscussionTab = () => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{score: number, feedback: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const result = await evaluateDiscussionAnswer(
        "How should we standardize a dataset where height is mixed between '170cm' and '1.7m'?",
        answer
    );
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                <MessageSquare className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900">토론 챌린지</h3>
                <p className="text-slate-600 mt-1">
                    "학생들의 키 데이터가 '170cm'와 '1.7m'로 섞여 있습니다. 분석을 위해 이 데이터를 어떻게 통일하시겠습니까?"
                </p>
            </div>
        </div>

        <textarea 
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[120px] text-slate-700 mb-4"
            placeholder="해결책을 입력하세요..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
        />

        <div className="flex items-center justify-between">
             <button
                onClick={handleSubmit}
                disabled={loading || !answer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                AI 평가 받기
            </button>
        </div>

        {feedback && (
            <div className={`mt-6 p-6 rounded-lg border animate-in slide-in-from-bottom-2 ${feedback.score > 70 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-slate-800">점수:</span>
                    <span className={`font-mono font-bold ${feedback.score > 70 ? 'text-green-600' : 'text-orange-600'}`}>{feedback.score}/100</span>
                </div>
                <p className="text-slate-700">{feedback.feedback}</p>
            </div>
        )}
    </div>
  );
};


// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  useEffect(() => {
    // Load stats
    const saved = localStorage.getItem('ddl_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Simple streak logic
      const today = new Date().toDateString();
      if (parsed.lastLogin !== today) {
         const newStreak = new Date(parsed.lastLogin).toDateString() === new Date(Date.now() - 86400000).toDateString() 
            ? parsed.streak + 1 
            : 1;
         const newStats = { ...parsed, streak: newStreak, lastLogin: today };
         setStats(newStats);
         localStorage.setItem('ddl_stats', JSON.stringify(newStats));
      } else {
        setStats(parsed);
      }
    } else {
        const newStats = { ...INITIAL_STATS, lastLogin: new Date().toDateString(), streak: 1 };
        setStats(newStats);
        localStorage.setItem('ddl_stats', JSON.stringify(newStats));
    }
  }, []);

  const handleLevelComplete = (score: number) => {
    const newMaxScore = Math.max(stats.maxScore, score);
    const newCleared = Math.max(stats.clearedStages, currentLevel + 1);
    
    const newStats = { ...stats, maxScore: newMaxScore, clearedStages: newCleared };
    setStats(newStats);
    localStorage.setItem('ddl_stats', JSON.stringify(newStats));

    if (currentLevel < LEVELS.length - 1) {
        // Show success animation or modal? For now, just next level
        setTimeout(() => setCurrentLevel(c => c + 1), 500);
    } else {
        alert("모든 레벨 완료! 당신은 데이터 세탁 마스터입니다.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
             </div>
             <h1 className="text-lg font-bold tracking-tight">더러운 데이터 세탁소</h1>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
             <div className="flex items-center gap-1.5" title="Daily Streak">
                <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300'}`} />
                <span className={stats.streak > 0 ? 'text-orange-600' : ''}>{stats.streak}일 연속</span>
             </div>
             <div className="flex items-center gap-1.5" title="Max Cleanliness Score">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>{stats.maxScore}% 최고 점수</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full flex gap-8">
        
        {/* Navigation Sidebar */}
        <nav className="w-64 shrink-0 space-y-2 hidden md:block">
            {[
                { id: Tab.THEORY, label: '개념', icon: BookOpen },
                { id: Tab.SIMULATION, label: '시뮬레이션', icon: Gamepad2 },
                { id: Tab.INSIGHTS, label: '통찰', icon: LayoutDashboard },
                { id: Tab.QUIZ, label: '퀴즈', icon: BrainCircuit },
                { id: Tab.DISCUSSION, label: '토론', icon: MessageSquare },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                        ${activeTab === item.id 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </button>
            ))}

            <div className="pt-8 mt-8 border-t border-slate-200">
                 <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">레벨 진행도</div>
                 <div className="space-y-2 px-2">
                    {LEVELS.map((lvl, idx) => (
                        <div key={lvl.level} className={`flex items-center gap-3 p-2 rounded-lg text-sm ${currentLevel === idx ? 'bg-slate-100' : 'opacity-60'}`}>
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold 
                                ${stats.clearedStages > idx ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                {stats.clearedStages > idx ? <Check className="w-3 h-3" /> : lvl.level}
                            </div>
                            <span className="truncate">{lvl.description.split(':')[0]}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 capitalize">
                    {activeTab === Tab.THEORY && "개념"}
                    {activeTab === Tab.SIMULATION && "시뮬레이션"}
                    {activeTab === Tab.INSIGHTS && "통찰"}
                    {activeTab === Tab.QUIZ && "퀴즈"}
                    {activeTab === Tab.DISCUSSION && "토론"}
                </h2>
                <p className="text-slate-500">
                    {activeTab === Tab.SIMULATION && "데이터셋을 청소하여 점수 100점을 달성하세요."}
                    {activeTab === Tab.THEORY && "데이터 전처리의 기초를 이해합니다."}
                    {activeTab === Tab.INSIGHTS && "이것이 실제 현장에서 중요한 이유입니다."}
                    {activeTab === Tab.QUIZ && "지식을 테스트해보세요."}
                    {activeTab === Tab.DISCUSSION && "애매한 문제를 해결하는 논리를 펼쳐보세요."}
                </p>
             </div>

             {activeTab === Tab.THEORY && <TheoryTab />}
             {activeTab === Tab.SIMULATION && (
                <div className="h-[600px]">
                    <SimulationEngine level={LEVELS[currentLevel]} onComplete={handleLevelComplete} />
                </div>
             )}
             {activeTab === Tab.INSIGHTS && <InsightsTab />}
             {activeTab === Tab.QUIZ && <QuizTab />}
             {activeTab === Tab.DISCUSSION && <DiscussionTab />}
        </div>
      </main>

      {/* Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-40">
           {[Tab.THEORY, Tab.SIMULATION, Tab.QUIZ].map(t => (
               <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`p-2 rounded-lg ${activeTab === t ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
               >
                   {t === Tab.SIMULATION ? <Gamepad2 /> : t === Tab.QUIZ ? <BrainCircuit /> : <BookOpen />}
               </button>
           ))}
      </div>
    </div>
  );
}