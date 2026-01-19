import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RLSimulation from './components/RLSimulation';
import { 
  APP_STORAGE_KEYS, 
  THEME_ROTATION, 
  SYSTEM_INSTRUCTION 
} from './constants';
import { 
  getDailyDateStr, 
  getThemeForDate, 
  calculateStreak, 
  generateSeed 
} from './utils';
import { 
  UserProgress, 
  ViewState, 
  DailyTheme, 
  MLType, 
  QuizQuestion 
} from './types';
import { 
  generateQuizQuestions, 
  evaluateDesignMission, 
  generateReflectionQuestions 
} from './services/geminiService';
import { 
  BrainCircuit, 
  CheckCircle, 
  ChevronRight, 
  BookOpen, 
  Lightbulb, 
  RefreshCcw,
  Calendar as CalendarIcon,
  Home,
  Trophy
} from 'lucide-react';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewState>('HOME');
  const [progress, setProgress] = useState<UserProgress>({
    streak: 0,
    lastCompletedDate: null,
    totalPoints: 0,
    frozenStreakAvailable: true, // Gifted initially for demo
    history: {},
    badges: []
  });
  const [dailyTheme, setDailyTheme] = useState<DailyTheme>(THEME_ROTATION[0]);
  const [dateStr, setDateStr] = useState<string>('');
  
  // Mission Inputs
  const [designInputs, setDesignInputs] = useState({ data: '', label: '', eval: '' });
  const [designFeedback, setDesignFeedback] = useState<string>('');
  const [isDesignSubmitting, setIsDesignSubmitting] = useState(false);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reflection State
  const [reflectionQs, setReflectionQs] = useState<string[]>([]);
  const [reflectionLoading, setReflectionLoading] = useState(false);

  // Initial Load
  useEffect(() => {
    const today = getDailyDateStr();
    setDateStr(today);
    
    // Load Progress
    const savedHistory = localStorage.getItem(APP_STORAGE_KEYS.HISTORY);
    const savedStreak = localStorage.getItem(APP_STORAGE_KEYS.STREAK);
    const savedLastDate = localStorage.getItem('daily_ml_v1_lastDate');
    const savedPoints = localStorage.getItem(APP_STORAGE_KEYS.POINTS);
    const savedFrozen = localStorage.getItem(APP_STORAGE_KEYS.FROZEN);

    let currentStreak = parseInt(savedStreak || '0');
    const history = savedHistory ? JSON.parse(savedHistory) : {};
    const isFrozenAvailable = savedFrozen === 'true';

    // Calculate Streak Logic on Load
    if (savedLastDate && savedLastDate !== today) {
      const { streak: calcStreak, isFrozenUsed } = calculateStreak(savedLastDate, isFrozenAvailable);
      
      if (calcStreak === -999) {
         currentStreak = 0; // Reset
      } else if (isFrozenUsed) {
         // Notify user used freeze
         alert("❄️ 스트릭 보호권이 사용되어 연속 기록이 유지되었습니다!");
         localStorage.setItem(APP_STORAGE_KEYS.FROZEN, 'false');
      } else if (calcStreak === 0) {
         // Continue streak (will increment on completion)
      }
    }

    setProgress({
      streak: currentStreak,
      lastCompletedDate: savedLastDate || null,
      totalPoints: parseInt(savedPoints || '0'),
      frozenStreakAvailable: isFrozenAvailable,
      history,
      badges: []
    });

    // Determine Theme
    const theme = getThemeForDate(today);
    setDailyTheme(theme);

  }, []);

  // Handlers
  const startMission = async () => {
    if (progress.history[dateStr]) {
       // Already done logic if needed, for now just allow re-view
    }
    setView('MISSION');
  };

  const submitDesign = async () => {
    if (!designInputs.data || !designInputs.label || !designInputs.eval) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    setIsDesignSubmitting(true);
    const feedback = await evaluateDesignMission(dailyTheme.type, designInputs);
    setDesignFeedback(feedback);
    setIsDesignSubmitting(false);
  };

  const startQuiz = async () => {
    setQuizLoading(true);
    setView('QUIZ');
    const seed = generateSeed(dateStr);
    const questions = await generateQuizQuestions(dailyTheme.type, seed);
    setQuizQuestions(questions);
    setQuizLoading(false);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    if (optionIndex === quizQuestions[currentQuestionIndex].answer) {
      setQuizScore(prev => prev + 10);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeDailyChallenge();
    }
  };

  const completeDailyChallenge = async () => {
    // 1. Update State
    const today = dateStr;
    const isFirstTimeToday = !progress.history[today];
    
    let newStreak = progress.streak;
    let newPoints = progress.totalPoints + quizScore;
    
    if (isFirstTimeToday) {
      newStreak += 1;
      newPoints += 50; // Completion Bonus
    }

    const newHistory = { ...progress.history, [today]: true };

    const newProgress = {
      ...progress,
      streak: newStreak,
      totalPoints: newPoints,
      lastCompletedDate: today,
      history: newHistory
    };

    setProgress(newProgress);

    // 2. Save to LocalStorage
    localStorage.setItem(APP_STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    localStorage.setItem(APP_STORAGE_KEYS.STREAK, newStreak.toString());
    localStorage.setItem('daily_ml_v1_lastDate', today);
    localStorage.setItem(APP_STORAGE_KEYS.POINTS, newPoints.toString());
    if (!newProgress.frozenStreakAvailable) {
       localStorage.setItem(APP_STORAGE_KEYS.FROZEN, 'false');
    }

    // 3. Load Reflection
    setReflectionLoading(true);
    setView('REFLECTION');
    const questions = await generateReflectionQuestions(dailyTheme.type);
    setReflectionQs(questions);
    setReflectionLoading(false);
  };

  // Render Helpers
  const renderHome = () => (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">{dateStr}의 미션</p>
          <h2 className="text-2xl font-bold mb-2">{dailyTheme.title}</h2>
          <p className="text-indigo-100 text-sm opacity-90 line-clamp-2">{dailyTheme.description}</p>
        </div>
        <div className="absolute -right-4 -bottom-8 opacity-20 rotate-12">
          <BrainCircuit size={120} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={startMission}
          disabled={!!progress.history[dateStr]}
          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
            progress.history[dateStr] 
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default' 
            : 'border-indigo-100 bg-white hover:border-indigo-500 text-indigo-700 shadow-sm'
          }`}
        >
          {progress.history[dateStr] ? <CheckCircle size={32} /> : <BookOpen size={32} />}
          <span className="font-bold">{progress.history[dateStr] ? '완료함' : '미션 시작'}</span>
        </button>
        
        <button 
           onClick={() => setView('CALENDAR')}
           className="p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-slate-300 text-slate-600 flex flex-col items-center justify-center gap-2 shadow-sm transition-all"
        >
          <CalendarIcon size={32} />
          <span className="font-bold">기록 보기</span>
        </button>
      </div>

      {progress.history[dateStr] && (
         <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
            <p className="text-slate-600 mb-2">오늘의 학습을 완료했습니다!</p>
            <button 
              onClick={() => setView('MISSION')} 
              className="text-indigo-600 text-sm font-bold underline"
            >
              내용 다시 복습하기
            </button>
         </div>
      )}
    </div>
  );

  const renderMission = () => (
    <div className="p-4 max-w-md mx-auto pb-20">
      {/* Phase 1: Concepts */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-500" />
          오늘의 핵심 카드
        </h2>
        <div className="space-y-3">
          {dailyTheme.keyConcepts.map((concept, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-indigo-900 mb-1">{concept.title}</h3>
              <p className="text-slate-600 text-sm">{concept.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Phase 2: Simulation (Only if RL or relevant, but for demo we show RL Sim always or if Type is RL) */}
      {dailyTheme.type === MLType.REINFORCEMENT && <RLSimulation />}
      {/* For other types, we could have different mini-sims, but reusing RL sim as a 'bonus' or generic interactive element for this code constraint */}
      {dailyTheme.type !== MLType.REINFORCEMENT && (
        <div className="bg-slate-50 p-4 rounded-xl mb-6 text-sm text-slate-500">
            💡 오늘은 {dailyTheme.type} 날입니다. 시뮬레이션은 강화학습 날에만 활성화됩니다.
        </div>
      )}

      {/* Phase 3: Mini Design */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <BrainCircuit className="text-indigo-500" />
          3줄 설계 미션
        </h2>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <p className="text-sm text-slate-600 mb-2">
            오늘 배운 <strong>{dailyTheme.type}</strong>을(를) 활용해 해결하고 싶은 문제를 정의해보세요.
          </p>
          
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">사용 데이터</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              placeholder="예: 고양이/강아지 사진 1만장"
              value={designInputs.data}
              onChange={e => setDesignInputs({...designInputs, data: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">목표(레이블/결과)</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              placeholder="예: 사진 속 동물의 종 분류"
              value={designInputs.label}
              onChange={e => setDesignInputs({...designInputs, label: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">평가 방법</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              placeholder="예: 정확도 95% 이상"
              value={designInputs.eval}
              onChange={e => setDesignInputs({...designInputs, eval: e.target.value})}
            />
          </div>

          <button
            onClick={submitDesign}
            disabled={isDesignSubmitting || !!designFeedback}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold text-sm hover:bg-slate-900 transition-colors disabled:bg-slate-300"
          >
            {isDesignSubmitting ? 'AI 코치가 분석 중...' : designFeedback ? '제출 완료' : '피드백 받기'}
          </button>
          
          {designFeedback && (
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900 animate-fade-in">
              <span className="font-bold block mb-1">🤖 AI 코치 피드백:</span>
              {designFeedback}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
         <div className="max-w-md mx-auto">
            <button
               onClick={startQuiz}
               disabled={!designFeedback} // Enforce mission completion first
               className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                 designFeedback 
                 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                 : 'bg-slate-200 text-slate-400 cursor-not-allowed'
               }`}
            >
               <span>퀴즈 풀고 완료하기</span>
               <ChevronRight />
            </button>
         </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (quizLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen pb-20">
          <RefreshCcw className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-slate-600 font-medium">오늘의 맞춤 퀴즈 생성 중...</p>
        </div>
      );
    }

    const currentQ = quizQuestions[currentQuestionIndex];

    return (
      <div className="p-4 max-w-md mx-auto h-[calc(100vh-60px)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <span className="text-sm font-bold text-slate-500">Q{currentQuestionIndex + 1}/{quizQuestions.length}</span>
           <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
             currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
             currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
             'bg-red-100 text-red-700'
           }`}>
             {currentQ.difficulty}
           </span>
        </div>

        <div className="flex-grow">
          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  selectedAnswer === null 
                    ? 'border-slate-200 hover:border-indigo-400 bg-white'
                    : idx === currentQ.answer 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : selectedAnswer === idx 
                        ? 'border-red-400 bg-red-50 text-red-800'
                        : 'border-slate-100 bg-slate-50 opacity-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-slate-100 rounded-xl animate-fade-in">
              <p className="font-bold text-slate-700 mb-1">
                {selectedAnswer === currentQ.answer ? '🎉 정답입니다!' : '🤔 아쉽네요.'}
              </p>
              <p className="text-sm text-slate-600">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {showExplanation && (
          <button
            onClick={nextQuestion}
            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold mt-4 hover:bg-slate-900"
          >
            {currentQuestionIndex < quizQuestions.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        )}
      </div>
    );
  };

  const renderReflection = () => (
     <div className="p-4 max-w-md mx-auto text-center pt-10">
        <Trophy size={64} className="mx-auto text-yellow-400 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">오늘의 미션 완료!</h2>
        <p className="text-slate-600 mb-8">
           스트릭이 <span className="text-orange-500 font-bold">{progress.streak}일</span>로 연장되었습니다.<br/>
           획득 점수: <span className="text-indigo-600 font-bold">+{50 + quizScore}점</span>
        </p>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 text-left mb-8">
           <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
             <BrainCircuit size={20} /> 생각 더하기
           </h3>
           {reflectionLoading ? (
             <p className="text-sm text-slate-400">생각해볼 주제를 가져오는 중...</p>
           ) : (
             <ul className="space-y-4">
               {reflectionQs.map((q, i) => (
                 <li key={i} className="text-sm text-slate-700 leading-relaxed border-b border-slate-50 pb-2 last:border-0">
                   Question {i+1}. {q}
                 </li>
               ))}
             </ul>
           )}
        </div>

        <button 
          onClick={() => setView('HOME')}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          메인으로 돌아가기
        </button>
     </div>
  );

  const renderCalendar = () => (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setView('HOME')} className="p-2 hover:bg-slate-100 rounded-full">
          <Home size={20} />
        </button>
        <h2 className="text-xl font-bold">학습 캘린더</h2>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d} className="text-center text-xs text-slate-400 font-bold">{d}</div>
        ))}
        {Array.from({length: 30}).map((_, i) => {
          // Mock calendar visuals for current month 
          // (In a real app, logic to map specific dates to grid cells is needed)
          const dayNum = i + 1;
          const checkDate = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
          const isDone = progress.history[checkDate];
          const isToday = checkDate === dateStr;

          return (
            <div 
              key={i} 
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium relative
                ${isDone ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}
                ${isToday ? 'ring-2 ring-indigo-300 ring-offset-2' : ''}
              `}
            >
              {dayNum}
              {isDone && <CheckCircle size={10} className="absolute bottom-1 right-1 text-indigo-200" />}
            </div>
          );
        })}
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-slate-200">
         <h3 className="font-bold text-slate-800 mb-2">통계</h3>
         <div className="flex justify-between text-sm text-slate-600">
            <span>총 학습일</span>
            <span className="font-bold">{Object.keys(progress.history).length}일</span>
         </div>
         <div className="flex justify-between text-sm text-slate-600 mt-2">
            <span>현재 스트릭</span>
            <span className="font-bold text-orange-500">{progress.streak}일</span>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-10">
      <Header progress={progress} />
      
      <main>
        {view === 'HOME' && renderHome()}
        {view === 'MISSION' && renderMission()}
        {view === 'QUIZ' && renderQuiz()}
        {view === 'REFLECTION' && renderReflection()}
        {view === 'CALENDAR' && renderCalendar()}
      </main>
    </div>
  );
};

export default App;