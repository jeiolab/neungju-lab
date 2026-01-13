import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  BookOpen, Brain, Search, HelpCircle, PenTool, 
  CheckCircle, XCircle, AlertTriangle, ChevronRight, RefreshCw, Lock
} from 'lucide-react';

import Header from './components/Header';
import { SCENARIOS, CONCEPTS, QUIZ_BANK, BADGES } from './constants';
import { UserProgress, EvaluationCriteria, Scenario, DecisionType, QuizQuestion } from './types';
import { containsPII, calculateMLScore, getTodayString } from './utils';

// --- Sub-components (Internal to keep file count low while maintaining modularity) ---

// 1. Concept Tab
const ConceptTab = ({ mastery }: { mastery: Record<string, number> }) => {
  const data = CONCEPTS.map(c => ({
    name: c.label,
    score: mastery[c.key] || 0,
    fullMark: 100
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">나의 진단 능력치</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10b981' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((c) => (
          <div key={c.key} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 transition-colors">
            <h3 className="font-bold text-gray-800 flex items-center">
              <BookOpen size={18} className="mr-2 text-blue-500" />
              {c.label}
            </h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Simulation Tab
const SimulationTab = ({ 
  user, 
  onComplete 
}: { 
  user: UserProgress; 
  onComplete: (points: number, isWin: boolean) => void; 
}) => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [criteria, setCriteria] = useState<EvaluationCriteria>({
    dataQuality: 3, pattern: 3, prediction: 3, automation: 3, creativity: 3, deduction: 3
  });
  const [phase, setPhase] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [userDecision, setUserDecision] = useState<DecisionType | null>(null);

  useEffect(() => {
    // Pick a random scenario seeded by day or just random for gameplay
    // For this demo, just pick random if null
    if (!currentScenario) {
      const random = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
      setCurrentScenario(random);
    }
  }, [currentScenario]);

  const handleSliderChange = (key: keyof EvaluationCriteria, val: number) => {
    setCriteria(prev => ({ ...prev, [key]: val }));
  };

  const submitDecision = (decision: DecisionType) => {
    setUserDecision(decision);
    setPhase('RESULT');
    
    if (!currentScenario) return;

    const isCorrect = decision === currentScenario.correctDecision;
    const score = calculateMLScore(criteria);
    // Simple point logic: Base 10 + 5 if correct
    const points = isCorrect ? 15 : 5;
    onComplete(points, isCorrect);
  };

  const nextRound = () => {
    setCurrentScenario(null);
    setPhase('INPUT');
    setUserDecision(null);
    setCriteria({ dataQuality: 3, pattern: 3, prediction: 3, automation: 3, creativity: 3, deduction: 3 });
  };

  if (!currentScenario) return <div className="p-10 text-center">로딩 중...</div>;

  const totalScore = calculateMLScore(criteria);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-6">
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
          <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded uppercase tracking-wide">
            {currentScenario.category}
          </span>
          <span className="text-sm font-medium opacity-80">No. {currentScenario.id.toUpperCase()}</span>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentScenario.title}</h3>
          <p className="text-gray-600 text-lg leading-relaxed bg-gray-50 p-4 rounded-lg">
            {currentScenario.description}
          </p>
        </div>
      </div>

      {phase === 'INPUT' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-4 flex items-center">
              <PenTool size={18} className="mr-2" />
              진단 척도 평가 (1: 매우 낮음 ~ 5: 매우 높음)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONCEPTS.map((c) => (
                <div key={c.key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label className="font-medium text-gray-700">{c.label}</label>
                    <span className="font-bold text-blue-600">{criteria[c.key as keyof EvaluationCriteria]}점</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" 
                    value={criteria[c.key as keyof EvaluationCriteria]}
                    onChange={(e) => handleSliderChange(c.key as keyof EvaluationCriteria, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-xs text-gray-400">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center bg-blue-50 p-3 rounded-lg">
              <span className="text-sm font-bold text-blue-800">현재 평가 점수</span>
              <span className="text-2xl font-bold text-blue-600">{totalScore} <span className="text-sm text-gray-400">/ 30</span></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => submitDecision('NO_ML')} className="py-4 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-transparent hover:border-gray-400 font-bold text-gray-600 transition-all">
              ML 불필요
            </button>
            <button onClick={() => submitDecision('YES_ML')} className="py-4 rounded-xl bg-blue-100 hover:bg-blue-200 border-2 border-transparent hover:border-blue-400 font-bold text-blue-700 transition-all">
              ML 필요
            </button>
            <button onClick={() => submitDecision('HARD_ML')} className="py-4 rounded-xl bg-purple-100 hover:bg-purple-200 border-2 border-transparent hover:border-purple-400 font-bold text-purple-700 transition-all">
              ML로 어려움
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center animate-fade-in-up">
          <div className="mb-6 flex justify-center">
             {userDecision === currentScenario.correctDecision ? (
               <CheckCircle size={64} className="text-green-500" />
             ) : (
               <XCircle size={64} className="text-red-500" />
             )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {userDecision === currentScenario.correctDecision ? '정확한 진단입니다!' : '진단이 엇갈렸네요.'}
          </h2>
          <p className="text-gray-500 mb-6">
            전문가는 <span className="font-bold text-gray-800">
              {currentScenario.correctDecision === 'NO_ML' ? 'ML 불필요' : 
               currentScenario.correctDecision === 'YES_ML' ? 'ML 적합' : 'ML 한계'}
            </span>라고 판단했습니다.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-xl text-left mb-6 border-l-4 border-blue-500">
            <h5 className="font-bold text-gray-800 mb-1">전문가 코멘트</h5>
            <p className="text-gray-700 text-sm">{currentScenario.expertReasoning}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl text-left mb-8 border-l-4 border-orange-500">
             <h5 className="font-bold text-gray-800 mb-1 flex items-center"><AlertTriangle size={14} className="mr-1"/> 반례 / 주의사항</h5>
             <p className="text-gray-700 text-sm">{currentScenario.counterExample}</p>
          </div>

          <button onClick={nextRound} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center">
            <RefreshCw size={18} className="mr-2" />
            다음 사건 가져오기
          </button>
        </div>
      )}
    </div>
  );
};

// 3. Quiz Tab
const QuizTab = ({ onScore }: { onScore: (score: number, concepts: string[]) => void }) => {
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);
  const [quizState, setQuizState] = useState<'IDLE' | 'ACTIVE' | 'FEEDBACK'>('IDLE');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{isCorrect: boolean, msg: string, retry?: QuizQuestion}>({ isCorrect: false, msg: '' });

  const startQuiz = (diff: string) => {
    // Simple random sampling logic
    const filtered = QUIZ_BANK.filter(q => diff === 'ALL' || q.difficulty === diff);
    const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
    setActiveQuiz(randomQ);
    setQuizState('ACTIVE');
    setUserAnswer('');
    setFeedback({ isCorrect: false, msg: '' });
  };

  const submitAnswer = () => {
    if (!activeQuiz) return;
    
    let correct = false;
    if (activeQuiz.type === 'MULTIPLE') {
      correct = userAnswer === activeQuiz.answer;
    } else {
      // Keyword matching for short answer
      const answers = Array.isArray(activeQuiz.answer) ? activeQuiz.answer : [activeQuiz.answer];
      correct = answers.some(ans => userAnswer.toLowerCase().includes(ans.toLowerCase()));
    }

    setFeedback({
      isCorrect: correct,
      msg: activeQuiz.explanation,
      retry: !correct ? activeQuiz.retryQuestion : undefined
    });
    setQuizState('FEEDBACK');
    onScore(correct ? 10 : -5, [activeQuiz.conceptTag]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {quizState === 'IDLE' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {['EASY', 'MEDIUM', 'HARD'].map(diff => (
             <button key={diff} onClick={() => startQuiz(diff)} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 transition-all text-center group">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                 <Brain size={24} />
               </div>
               <h3 className="font-bold text-gray-800">{diff === 'EASY' ? '초급' : diff === 'MEDIUM' ? '중급' : '고급'}</h3>
               <p className="text-xs text-gray-500 mt-2">랜덤 문제 도전</p>
             </button>
           ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
           <div className="flex justify-between items-center mb-6">
             <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">{activeQuiz?.difficulty}</span>
             <span className="text-xs text-gray-400">문제 해결 능력 평가</span>
           </div>
           
           <h3 className="text-xl font-bold text-gray-800 mb-6">{activeQuiz?.question}</h3>

           {activeQuiz?.type === 'MULTIPLE' ? (
             <div className="space-y-3">
               {activeQuiz?.options?.map((opt, idx) => (
                 <button 
                   key={idx} 
                   onClick={() => setUserAnswer(opt)}
                   disabled={quizState === 'FEEDBACK'}
                   className={`w-full p-4 rounded-xl border text-left transition-all ${
                     userAnswer === opt 
                       ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                       : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                   }`}
                 >
                   {opt}
                 </button>
               ))}
             </div>
           ) : (
             <div className="mb-4">
               <input 
                 type="text" 
                 className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                 placeholder="답변을 입력하세요 (핵심 키워드 포함)"
                 value={userAnswer}
                 onChange={(e) => setUserAnswer(e.target.value)}
                 disabled={quizState === 'FEEDBACK'}
               />
             </div>
           )}

           {quizState === 'ACTIVE' && (
             <button 
               onClick={submitAnswer} 
               disabled={!userAnswer}
               className="w-full mt-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               제출하기
             </button>
           )}

           {quizState === 'FEEDBACK' && (
             <div className="mt-6 animate-fade-in">
               <div className={`p-4 rounded-xl mb-4 ${feedback.isCorrect ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                 <div className="flex items-center font-bold mb-2">
                   {feedback.isCorrect ? <CheckCircle className="mr-2" size={20}/> : <XCircle className="mr-2" size={20}/>}
                   {feedback.isCorrect ? '정답입니다!' : '오답입니다.'}
                 </div>
                 <p className="text-sm">{feedback.msg}</p>
                 {!feedback.isCorrect && (
                    <div className="mt-2 text-xs font-bold">정답: {Array.isArray(activeQuiz?.answer) ? activeQuiz?.answer.join(', ') : activeQuiz?.answer}</div>
                 )}
               </div>

               {feedback.retry && !feedback.isCorrect && (
                 <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-4">
                   <h5 className="font-bold text-yellow-800 text-sm mb-1 flex items-center"><RefreshCw size={14} className="mr-1"/>재도전 기회</h5>
                   <p className="text-sm text-yellow-900 mb-2">{feedback.retry.question}</p>
                   <p className="text-xs text-gray-500">정답을 마음속으로 생각해보세요. (정답: {Array.isArray(feedback.retry.answer) ? feedback.retry.answer[0] : feedback.retry.answer})</p>
                 </div>
               )}

               <button 
                 onClick={() => setQuizState('IDLE')}
                 className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
               >
                 다른 문제 풀기
               </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

// 4. Think Tab
const ThinkTab = () => {
  const [text, setText] = useState('');
  const [piiWarning, setPiiWarning] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (containsPII(val)) {
      setPiiWarning(true);
    } else {
      setPiiWarning(false);
      setText(val);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">오늘의 생각 과제: 데이터가 부족하다면?</h3>
        <p className="text-gray-600 text-sm mb-4">
          우리가 해결하려는 학교 문제 중, "데이터를 모으기 가장 힘든 문제"는 무엇일까요? 
          그 이유는 개인정보 때문일까요, 아니면 기록되지 않는 정보라서 일까요?
        </p>
        <div className="relative">
          <textarea 
            className={`w-full h-32 p-4 border rounded-xl resize-none outline-none focus:ring-2 ${piiWarning ? 'border-red-500 ring-red-200' : 'border-gray-200 focus:ring-blue-500'}`}
            placeholder="자유롭게 작성해보세요. (이름, 전화번호 등 개인정보는 입력 금지)"
            value={text}
            onChange={handleInput}
          />
          {piiWarning && (
            <div className="absolute bottom-4 left-4 text-xs text-red-600 font-bold flex items-center">
              <AlertTriangle size={12} className="mr-1" /> 개인정보가 감지되었습니다. 입력을 제한합니다.
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
           <button disabled={piiWarning || text.length < 10} className="px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold disabled:opacity-50">
             기록 저장 (로컬)
           </button>
        </div>
      </div>
      
      <div className="bg-gray-100 p-6 rounded-2xl text-center">
         <Lock size={24} className="mx-auto text-gray-400 mb-2" />
         <p className="text-xs text-gray-500">작성된 내용은 브라우저 내부에만 저장되며 외부 서버로 전송되지 않습니다.</p>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sim');
  const [user, setUser] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('ml_battle_user');
    return saved ? JSON.parse(saved) : {
      xp: 0, level: 1, streak: 0, lastPlayedDate: '', 
      badges: [], masteryByConcept: {}, wrongNotes: []
    };
  });

  useEffect(() => {
    localStorage.setItem('ml_battle_user', JSON.stringify(user));
  }, [user]);

  const handleSimComplete = (points: number, isWin: boolean) => {
    setUser(prev => {
      const newXp = prev.xp + points;
      const newLevel = Math.floor(newXp / 100) + 1;
      const streakUpdate = prev.streak + (isWin ? 0 : 0); // Logic handled separately for daily
      // Simplified streak logic:
      const today = getTodayString();
      const newStreak = (today !== prev.lastPlayedDate) ? prev.streak + 1 : prev.streak;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastPlayedDate: today,
        badges: isWin && !prev.badges.includes('first_win') ? [...prev.badges, 'first_win'] : prev.badges
      };
    });
  };

  const handleQuizScore = (score: number, concepts: string[]) => {
    setUser(prev => {
      const newMastery = { ...prev.masteryByConcept };
      concepts.forEach(c => {
        const current = newMastery[c] || 0;
        newMastery[c] = Math.min(100, Math.max(0, current + (score > 0 ? 5 : -2)));
      });
      return {
        ...prev,
        xp: prev.xp + (score > 0 ? score : 0),
        masteryByConcept: newMastery
      };
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'concept': return <ConceptTab mastery={user.masteryByConcept} />;
      case 'sim': return <SimulationTab user={user} onComplete={handleSimComplete} />;
      case 'quiz': return <QuizTab onScore={handleQuizScore} />;
      case 'think': return <ThinkTab />;
      case 'learn': return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold mb-4">기계학습으로 해결하기 어려운 문제?</h2>
           <p className="text-gray-600 mb-4">ML은 만능이 아닙니다. 다음과 같은 경우에는 ML 적용이 어렵거나 불필요합니다.</p>
           <ul className="space-y-3">
             <li className="flex items-start"><XCircle className="text-red-500 mr-2 mt-1 min-w-[20px]" /> <span><b>데이터 부족:</b> 학습할 과거 데이터가 없거나, 품질이 매우 낮은 경우</span></li>
             <li className="flex items-start"><XCircle className="text-red-500 mr-2 mt-1 min-w-[20px]" /> <span><b>명확한 규칙:</b> 수학 공식처럼 100% 정답이 정해진 계산 (굳이 예측할 필요 없음)</span></li>
             <li className="flex items-start"><XCircle className="text-red-500 mr-2 mt-1 min-w-[20px]" /> <span><b>고도의 창의/공감:</b> 인간의 미묘한 감정이나 예술적 맥락을 완벽히 이해해야 하는 영역</span></li>
           </ul>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 font-sans text-gray-900">
      <Header user={user} />
      
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Mobile Tab Nav - visible only on small screens, usually sticky bottom or top */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 z-40">
           <button onClick={() => setActiveTab('concept')} className={`flex flex-col items-center ${activeTab==='concept' ? 'text-blue-600' : 'text-gray-400'}`}><BookOpen size={20}/><span className="text-[10px]">개념</span></button>
           <button onClick={() => setActiveTab('sim')} className={`flex flex-col items-center ${activeTab==='sim' ? 'text-blue-600' : 'text-gray-400'}`}><Search size={20}/><span className="text-[10px]">판별</span></button>
           <button onClick={() => setActiveTab('quiz')} className={`flex flex-col items-center ${activeTab==='quiz' ? 'text-blue-600' : 'text-gray-400'}`}><Brain size={20}/><span className="text-[10px]">퀴즈</span></button>
        </div>

        {/* Desktop Tab Nav */}
        <div className="hidden md:flex space-x-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
          {[
            { id: 'concept', label: '이론 개념', icon: BookOpen },
            { id: 'sim', label: '판별 배틀', icon: Search },
            { id: 'learn', label: '더 알아보기', icon: HelpCircle },
            { id: 'quiz', label: '퀴즈', icon: Brain },
            { id: 'think', label: '생각하기', icon: PenTool },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
