import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Target, PenTool, Lightbulb, User, LayoutDashboard, 
  ChevronRight, Star, AlertTriangle, CheckCircle, Brain, 
  Trophy, Flame, Coins, LogOut, ArrowRight, History, Home
} from 'lucide-react';
import Link from 'next/link';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell 
} from 'recharts';
import { JOB_DATABASE, THEORY_CARDS, QUIZ_DATA, CASE_STUDIES } from './constants';
import { Job, SimulationResult, UserStats, ViewMode } from './types';
import { analyzeReflection, FeedbackResponse } from './services/geminiService';

// --- LocalStorage Helpers ---
const STORAGE_KEY = 'careerBalance_v1_stats';
const LOG_KEY = 'careerBalance_v1_logs';

const getInitialStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return { xp: 0, level: 1, streak: 1, lastLogin: new Date().toISOString(), badges: [] };
};

const getLogs = (): SimulationResult[] => {
  const stored = localStorage.getItem(LOG_KEY);
  if (stored) return JSON.parse(stored);
  return [];
};

// --- Components ---

const Header = ({ stats, setView }: { stats: UserStats, setView: (v: ViewMode) => void }) => (
  <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-slate-800 hidden sm:block">커리어 밸런스</span>
      </div>
      
      <div className="flex items-center gap-3 text-sm font-medium">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-slate-600 transition-colors hover:text-slate-900"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">메인 홈</span>
        </Link>
        <div className="flex items-center text-orange-500 gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
          <Flame className="w-4 h-4 fill-current" />
          <span>{stats.streak}일</span>
        </div>
        <div className="flex items-center text-blue-600 gap-1 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
          <Trophy className="w-4 h-4 fill-current" />
          <span>Lv.{stats.level}</span>
        </div>
        <div className="flex items-center text-yellow-600 gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
          <Coins className="w-4 h-4 fill-current" />
          <span>{stats.xp} XP</span>
        </div>
      </div>
    </div>
  </header>
);

const NavTab = ({ active, setView }: { active: ViewMode, setView: (v: ViewMode) => void }) => {
  const tabs: { id: ViewMode; label: string; icon: React.FC<any> }[] = [
    { id: 'home', label: '홈', icon: LayoutDashboard },
    { id: 'theory', label: '개념', icon: BookOpen },
    { id: 'simulation', label: '밸런스게임', icon: Target },
    { id: 'cases', label: '사례', icon: Lightbulb },
    { id: 'quiz', label: '퀴즈', icon: CheckCircle },
    { id: 'reflection', label: '성찰', icon: PenTool },
    { id: 'profile', label: '기록', icon: User },
  ];

  return (
    <nav className="fixed top-16 left-0 w-full bg-white border-b border-slate-200 z-40">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-14 px-1">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? 'fill-current opacity-20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// --- Sub-Features ---

const TheoryMode = () => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-slate-800">직업의 미래와 나의 기준</h2>
      <p className="text-slate-600">왜 진로 선택이 어려울까요? 변화의 흐름을 먼저 이해해봅시다.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {THEORY_CARDS.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-indigo-600">
               {/* Lucide icons are strictly strictly typed so generic string lookup is hard without a map. 
                   Using a generic icon for simplicity in this generated code block or conditional.
                   In a real app, I'd map string to component. */}
               <Lightbulb size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">{card.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{card.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CaseStudyMode = () => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-slate-800">디지털 기술 활용 사례</h2>
      <p className="text-slate-600">내 관심 분야에서 디지털 기술이 어떻게 쓰이는지 확인해보세요.</p>
      
      <div className="grid grid-cols-1 gap-4">
        {CASE_STUDIES.map((study, idx) => (
          <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
            <div className="bg-slate-800 text-white p-6 md:w-1/3 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{study.domain}</span>
              <h3 className="text-xl font-bold">{study.title}</h3>
              <div className="mt-4 inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                {study.tech}
              </div>
            </div>
            <div className="p-6 md:w-2/3 bg-slate-50">
              <p className="text-slate-700 leading-relaxed">{study.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuizMode = ({ addXP }: { addXP: (amount: number) => void }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === QUIZ_DATA[currentQ].correctIndex;
    setIsCorrect(correct);
    if (correct) {
      addXP(15);
    }
  };

  const nextQ = () => {
    if (currentQ < QUIZ_DATA.length - 1) {
      setCurrentQ(p => p + 1);
      setSelected(null);
      setIsCorrect(null);
    }
  };

  const q = QUIZ_DATA[currentQ];

  return (
    <div className="p-4 pb-20 max-w-2xl mx-auto">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">진로 퀴즈</h2>
        <span className="text-sm font-mono text-slate-500">{currentQ + 1} / {QUIZ_DATA.length}</span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <div className="mb-2">
          <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {q.difficulty}
          </span>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-6">{q.question}</h3>

        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected === null 
                  ? 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50' 
                  : selected === idx 
                    ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                    : idx === q.correctIndex
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-slate-100 text-slate-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="mt-6 animate-fade-in">
            <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-bold flex items-center gap-2">
                {isCorrect ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
                {isCorrect ? '정답입니다! (+15 XP)' : '틀렸습니다.'}
              </p>
              <p className="mt-2 text-sm opacity-90">{q.explanation}</p>
            </div>
            {currentQ < QUIZ_DATA.length - 1 && (
              <button onClick={nextQ} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                다음 문제
              </button>
            )}
            {currentQ === QUIZ_DATA.length - 1 && (
               <div className="text-center py-4 text-slate-500 font-medium">퀴즈 완료!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SimulationMode = ({ addXP, saveLog }: { addXP: (n: number) => void, saveLog: (res: SimulationResult) => void }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [weights, setWeights] = useState({ future: 40, stability: 30, interest: 30 });
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [situation, setSituation] = useState("일반적인 진로 탐색");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const totalPoints = weights.future + weights.stability + weights.interest;
  const isValidWeights = totalPoints === 100;

  const handleSlider = (key: keyof typeof weights, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
  };

  const toggleJob = (id: string) => {
    if (selectedJobs.includes(id)) {
      setSelectedJobs(prev => prev.filter(jid => jid !== id));
    } else {
      if (selectedJobs.length < 3) {
        setSelectedJobs(prev => [...prev, id]);
      }
    }
  };

  const calculateResult = () => {
    const candidates = JOB_DATABASE.filter(j => selectedJobs.includes(j.id));
    // Calculate dot product
    const scored = candidates.map(job => {
      const score = (job.future * weights.future) + (job.stability * weights.stability) + (job.interest * weights.interest);
      return { ...job, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    const top = scored[0];

    const simResult: SimulationResult = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      situation,
      weights,
      selectedJobs,
      topMatchId: top.id,
      score: top.score
    };

    setResult(simResult);
    saveLog(simResult);
    addXP(50);
    setStep(4);
  };

  const SITUATIONS = [
    "대학 전공 선택 고민", "아르바이트와 학업 병행", "창업 동아리 프로젝트", "자격증 취득 준비"
  ];

  // Render Steps
  if (step === 1) return (
    <div className="p-6 max-w-xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">1. 가치관 무게 달기</h2>
        <p className="text-slate-500 mt-2">총 100점을 미래성, 안정성, 흥미에 나눠주세요.</p>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        {[
          { key: 'future', label: '미래성 (성장 가능성)', color: 'text-blue-600', range: 'bg-blue-100' },
          { key: 'stability', label: '안정성 (고용 보장)', color: 'text-green-600', range: 'bg-green-100' },
          { key: 'interest', label: '흥미 (재미/가치)', color: 'text-pink-600', range: 'bg-pink-100' }
        ].map((attr) => (
          <div key={attr.key}>
            <div className="flex justify-between mb-2 font-medium text-sm">
              <span className={attr.color}>{attr.label}</span>
              <span className="font-mono text-slate-700">{(weights as any)[attr.key]}점</span>
            </div>
            <input 
              type="range" min="0" max="100" step="5"
              value={(weights as any)[attr.key]}
              onChange={(e) => handleSlider(attr.key as any, parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        ))}

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-sm text-slate-500">합계</span>
          <span className={`text-xl font-bold ${isValidWeights ? 'text-indigo-600' : 'text-red-500'}`}>
            {totalPoints} / 100
          </span>
        </div>
      </div>

      <button 
        disabled={!isValidWeights}
        onClick={() => setStep(2)}
        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
      >
        다음: 상황 선택
      </button>
    </div>
  );

  if (step === 2) return (
    <div className="p-6 max-w-xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">2. 상황 설정</h2>
        <p className="text-slate-500 mt-2">어떤 상황에서 고민 중인가요?</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {SITUATIONS.map(sit => (
          <button 
            key={sit}
            onClick={() => { setSituation(sit); setStep(3); }}
            className="p-4 text-left border rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all font-medium text-slate-700 bg-white shadow-sm"
          >
            {sit}
          </button>
        ))}
      </div>
    </div>
  );

  if (step === 3) return (
    <div className="p-4 pb-24">
      <div className="sticky top-16 bg-white/95 backdrop-blur py-4 z-30 border-b mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">3. 후보 직업 선택</h2>
          <p className="text-xs text-slate-500">관심 있는 직업 3개를 고르세요 ({selectedJobs.length}/3)</p>
        </div>
        <button 
          disabled={selectedJobs.length !== 3}
          onClick={calculateResult}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold disabled:opacity-50 text-sm shadow-md"
        >
          결과 보기
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {JOB_DATABASE.map(job => {
          const isSelected = selectedJobs.includes(job.id);
          return (
            <div 
              key={job.id}
              onClick={() => toggleJob(job.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white hover:border-indigo-200'
              }`}
            >
              <div className="text-xs text-slate-400 mb-1">{job.category}</div>
              <div className="font-bold text-slate-800 text-sm mb-2">{job.title}</div>
              <div className="flex gap-1">
                {['F', 'S', 'I'].map((l, i) => (
                  <div key={l} className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${i===0 ? 'bg-blue-400' : i===1 ? 'bg-green-400' : 'bg-pink-400'}`} 
                      style={{ width: `${(i===0?job.future:i===1?job.stability:job.interest)*10}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  if (step === 4 && result) {
    const topJob = JOB_DATABASE.find(j => j.id === result.topMatchId)!;
    
    // Logic for feedback
    const maxWeight = Object.entries(weights).sort((a,b) => (b[1] as number) - (a[1] as number))[0];
    const minWeight = Object.entries(weights).sort((a,b) => (a[1] as number) - (b[1] as number))[0];
    const sacrificedAttr = minWeight[0] as keyof typeof weights;
    
    return (
      <div className="p-4 pb-24 max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">분석 결과</h2>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mb-6">
          <div className="bg-indigo-600 p-6 text-white text-center">
            <p className="opacity-80 text-sm mb-1">당신의 가치관에 가장 적합한 직업</p>
            <h1 className="text-3xl font-bold">{topJob.title}</h1>
            <div className="mt-3 flex justify-center gap-2">
              {topJob.skills.slice(0,2).map(s => (
                <span key={s} className="px-2 py-1 bg-white/20 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: '미래성', A: topJob.future * 10, fullMark: 100 },
                  { subject: '안정성', A: topJob.stability * 10, fullMark: 100 },
                  { subject: '흥미', A: topJob.interest * 10, fullMark: 100 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name={topJob.title} dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 flex items-center gap-2">
                  <Star className="w-4 h-4"/> 선정 이유
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  당신은 <strong>{maxWeight[0] === 'future' ? '미래성' : maxWeight[0] === 'stability' ? '안정성' : '흥미'}</strong>({maxWeight[1]}점)을 가장 중요하게 생각합니다. 
                  이 직업은 해당 항목 점수가 10점 만점에 <strong>{(topJob as any)[maxWeight[0]]}점</strong>으로 매우 높습니다.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h4 className="font-bold text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4"/> 주의할 점 (Trade-off)
                </h4>
                <p className="text-sm text-orange-700 mt-1">
                  대신 <strong>{sacrificedAttr === 'future' ? '미래성' : sacrificedAttr === 'stability' ? '안정성' : '흥미'}</strong> 부분에서는 
                  다소 아쉬움이 있을 수 있습니다 ({(topJob as any)[sacrificedAttr]}점). 이를 감수할 준비가 되었나요?
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <Target className="w-4 h-4"/> 추천 액션
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  학교 생활기록부의 '진로활동'란에 이 직업에 필요한 <strong>{topJob.skills[0]}</strong> 역량을 키우기 위해 노력한 구체적인 사례를 만들어보세요.
                </p>
              </div>
            </div>

            <button onClick={() => setStep(1)} className="w-full mt-6 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
              다시 하기
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ReflectionMode = ({ addXP }: { addXP: (n: number) => void }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);

  const handleSubmit = async () => {
    if (text.length < 30) {
      alert("최소 30자 이상 작성해주세요.");
      return;
    }
    setLoading(true);
    // Hardcoded context for demo, normally passed from selected state
    const res = await analyzeReflection("진로 탐색", "관심 직업", text);
    setFeedback(res);
    setLoading(false);
    if (res.score > 70) {
        addXP(30);
    }
  };

  return (
    <div className="p-6 pb-24 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">성찰 노트</h2>
      <p className="text-slate-600">나의 선택을 설득하는 3문장을 작성해보세요.<br/>(근거, 예시, 대안 포함)</p>

      <textarea
        className="w-full h-40 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
        placeholder="예: 나는 OOO 직업을 선택했다. 왜냐하면 나는 안정성보다 변화를 즐기기 때문이다. 예를 들어 동아리 활동에서도..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !!feedback}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:bg-slate-400 flex justify-center items-center"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'AI 피드백 받기'}
      </button>

      {feedback && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-slate-800">코치 피드백</span>
                <span className={`text-xl font-black ${feedback.score >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{feedback.score}점</span>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
                {feedback.feedback}
            </p>
            {feedback.badgeEarned && (
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                    <Trophy className="w-4 h-4" />
                    '논리적인 설계자' 배지 획득!
                </div>
            )}
            <button onClick={() => { setFeedback(null); setText(""); }} className="mt-4 text-sm text-slate-400 underline w-full text-center">
                새로 쓰기
            </button>
        </div>
      )}
    </div>
  );
};

const ProfileMode = ({ stats, logs }: { stats: UserStats, logs: SimulationResult[] }) => {
    return (
        <div className="p-6 pb-24 max-w-xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <User size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">예비 개척자</h2>
                    <p className="text-slate-500">Lv.{stats.level} • {stats.xp} XP</p>
                    <div className="mt-2 text-xs bg-slate-100 px-2 py-1 rounded inline-block">
                        최근 접속: {new Date(stats.lastLogin).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5"/> 결정 로그
                </h3>
                {logs.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        아직 기록이 없습니다. <br/> 밸런스 게임을 시작해보세요!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {logs.slice().reverse().map((log) => {
                             const job = JOB_DATABASE.find(j => j.id === log.topMatchId);
                             return (
                                <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                                    <div>
                                        <div className="text-xs text-indigo-600 font-bold mb-1">{log.situation}</div>
                                        <div className="font-bold text-slate-800">{job?.title}</div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            미래 {log.weights.future}% / 안정 {log.weights.stability}% / 흥미 {log.weights.interest}%
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-slate-700">{Math.round(log.score/10)}점</div>
                                        <div className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</div>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<ViewMode>('home');
  const [stats, setStats] = useState<UserStats>(getInitialStats);
  const [logs, setLogs] = useState<SimulationResult[]>(getLogs);

  // Initial Logic: Check streak, update login time
  useEffect(() => {
    const today = new Date().toDateString();
    const last = new Date(stats.lastLogin).toDateString();
    
    if (today !== last) {
      setStats(prev => {
        const isConsecutive = (new Date().getTime() - new Date(prev.lastLogin).getTime()) < 172800000; // 48 hours approx tolerance
        const newStats = {
          ...prev,
          lastLogin: new Date().toISOString(),
          streak: isConsecutive ? prev.streak + 1 : 1
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        return newStats;
      });
    }
  }, []);

  const addXP = (amount: number) => {
    setStats(prev => {
        const newXP = prev.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1;
        const newStats = { ...prev, xp: newXP, level: newLevel };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        return newStats;
    });
  };

  const saveLog = (result: SimulationResult) => {
      setLogs(prev => {
          const newLogs = [...prev, result];
          localStorage.setItem(LOG_KEY, JSON.stringify(newLogs));
          return newLogs;
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-safe">
      <Header stats={stats} setView={setView} />
      
      <main className={`max-w-4xl mx-auto min-h-screen ${view !== 'home' ? 'pt-[7.5rem]' : 'pt-16'}`}>
        {view === 'home' && (
          <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-fade-in">
             <div className="bg-indigo-100 p-6 rounded-full text-indigo-600 mb-4 animate-bounce-slow">
                <Brain size={64} />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">내 미래를 위한<br/>커리어 밸런스</h1>
                <p className="text-slate-600 max-w-xs mx-auto">
                    무조건 좋은 직업은 없습니다.<br/>
                    나의 가치관에 맞는 최적의 직업을<br/>
                    데이터와 함께 찾아보세요.
                </p>
             </div>
             <button 
                onClick={() => setView('simulation')}
                className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-transform hover:-translate-y-1 flex items-center gap-2"
             >
                시작하기 <ArrowRight size={20}/>
             </button>
             <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-left">
                <div onClick={() => setView('theory')} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm cursor-pointer hover:border-indigo-200">
                    <BookOpen className="text-blue-500 mb-2"/>
                    <div className="font-bold text-slate-800">개념 학습</div>
                    <div className="text-xs text-slate-400">직업 세계 변화</div>
                </div>
                <div onClick={() => setView('quiz')} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm cursor-pointer hover:border-indigo-200">
                    <CheckCircle className="text-green-500 mb-2"/>
                    <div className="font-bold text-slate-800">퀴즈</div>
                    <div className="text-xs text-slate-400">XP 획득 도전</div>
                </div>
             </div>
          </div>
        )}

        {view === 'theory' && <TheoryMode />}
        {view === 'simulation' && <SimulationMode addXP={addXP} saveLog={saveLog} />}
        {view === 'quiz' && <QuizMode addXP={addXP} />}
        {view === 'cases' && <CaseStudyMode />}
        {view === 'reflection' && <ReflectionMode addXP={addXP} />}
        {view === 'profile' && <ProfileMode stats={stats} logs={logs} />}
      </main>

      {view !== 'home' && <NavTab active={view} setView={setView} />}
      
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>
    </div>
  );
}