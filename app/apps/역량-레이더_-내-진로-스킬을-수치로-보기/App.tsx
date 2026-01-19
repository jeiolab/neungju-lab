'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid
} from 'recharts';
import { 
  Brain, Cpu, Lightbulb, Users, Globe, 
  CheckCircle, Zap, Award, BookOpen, AlertCircle, Edit3, Target
} from 'lucide-react';
import { COMPETENCY_DATA, JOB_PROFILES, QUIZ_DATA, SCENARIOS, ACTION_PLAN_TEMPLATES } from './constants';
import { UserData, CompetencyType, COMPETENCIES } from './types';
import { loadUserData, saveUserData, calculateMastery, checkBadges } from './services/storageService';
import { getReflectionFeedback, generatePersuasiveText } from './services/geminiService';

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
      active 
        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }`}
  >
    <Icon size={18} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [userData, setUserData] = useState<UserData>(loadUserData());
  const [activeTab, setActiveTab] = useState<'intro' | 'diagnosis' | 'dashboard' | 'training' | 'reflection'>('intro');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [reflectionFeedback, setReflectionFeedback] = useState<string | null>(null);
  const [persuasiveText, setPersuasiveText] = useState<string | null>(null);

  // Sync with local storage
  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  // Check badges & Login streak on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (userData.lastLoginDate !== today) {
        const isConsecutive = new Date(userData.lastLoginDate).getTime() === new Date(today).getTime() - 86400000;
        const newStreak = isConsecutive ? userData.streak + 1 : 1;
        
        setUserData(prev => ({
            ...prev,
            lastLoginDate: today,
            streak: newStreak
        }));
    }
  }, []);

  // Check for new badges whenever stats change
  useEffect(() => {
    const newBadges = checkBadges(userData);
    if (newBadges.length > 0) {
        setUserData(prev => ({
            ...prev,
            badges: [...prev.badges, ...newBadges]
        }));
        // Could show a toast here
    }
  }, [userData.actionPlanChecks, userData.streak]);

  const handleScoreChange = (comp: CompetencyType, val: number) => {
    setUserData(prev => ({
      ...prev,
      baselineScores: { ...prev.baselineScores, [comp]: val }
    }));
  };

  const handleJobSelect = (jobId: string) => {
    setUserData(prev => ({ ...prev, selectedJobId: jobId }));
  };

  const toggleActionCheck = (comp: CompetencyType) => {
    const today = new Date().toISOString().split('T')[0];
    const key = `${today}_${comp}`;
    const exists = !!userData.actionPlanChecks[key];
    
    setUserData(prev => {
        const newChecks = { ...prev.actionPlanChecks };
        if (exists) {
            delete newChecks[key];
            return { ...prev, actionPlanChecks: newChecks, xp: Math.max(0, prev.xp - 10) };
        } else {
            newChecks[key] = true;
            return { ...prev, actionPlanChecks: newChecks, xp: prev.xp + 10 };
        }
    });
  };

  const handleQuizAnswer = (questionId: number, isCorrect: boolean, comp: CompetencyType, errorType: any) => {
    setUserData(prev => {
        const stats = { ...prev.quizStats };
        stats[comp] = {
            correct: stats[comp].correct + (isCorrect ? 1 : 0),
            total: stats[comp].total + 1
        };

        const newWrongNotes = isCorrect ? prev.wrongNotes : [
            ...prev.wrongNotes,
            { 
                id: Date.now().toString(), 
                questionId, 
                userAnswer: -1, // Simplified for this view
                timestamp: Date.now(),
                errorType
            }
        ];

        return {
            ...prev,
            quizStats: stats,
            wrongNotes: newWrongNotes,
            xp: prev.xp + (isCorrect ? 20 : 5)
        };
    });
  };

  const handleScenarioAnswer = (isCorrect: boolean, comp: CompetencyType) => {
    setUserData(prev => {
        const stats = { ...prev.scenarioStats };
        stats[comp] = {
            correct: stats[comp].correct + (isCorrect ? 1 : 0),
            total: stats[comp].total + 1
        };
        return {
            ...prev,
            scenarioStats: stats,
            xp: prev.xp + (isCorrect ? 30 : 5)
        };
    });
  };

  const chartData = COMPETENCIES.map(comp => ({
    subject: COMPETENCY_DATA[comp].name.split(' ')[0],
    fullMark: 100,
    A: calculateMastery(userData, comp)
  }));

  // --- Views ---

  const IntroView = () => (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800">역량 레이더 <span className="text-blue-600">Growth Coach</span></h1>
        <p className="text-slate-600">디지털 사회에 필요한 나의 핵심 역량을 진단하고 키워보세요.</p>
      </div>

      <Card>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="text-blue-500"/> 관심 분야 설정</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {JOB_PROFILES.map(job => (
            <button
              key={job.id}
              onClick={() => handleJobSelect(job.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                userData.selectedJobId === job.id 
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="font-bold text-slate-800">{job.name}</div>
              <div className="text-xs text-slate-500 mt-1">{job.category}</div>
            </button>
          ))}
        </div>
      </Card>

      <div className="text-center">
        <button 
          onClick={() => setActiveTab('diagnosis')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          시작하기
        </button>
      </div>
    </div>
  );

  const DiagnosisView = () => (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
       <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-bold text-blue-800">자기 진단</h3>
          <p className="text-sm text-blue-700">현재 자신이 생각하는 역량 수준을 솔직하게 체크해주세요 (1~5점)</p>
       </div>
       
       <div className="grid gap-6">
         {COMPETENCIES.map(comp => (
           <Card key={comp} className="flex flex-col sm:flex-row gap-4 items-center">
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-2xl">{COMPETENCY_DATA[comp].icon}</span>
                 <h4 className="font-bold text-lg">{COMPETENCY_DATA[comp].name}</h4>
               </div>
               <p className="text-slate-600 text-sm">{COMPETENCY_DATA[comp].description}</p>
             </div>
             <div className="w-full sm:w-1/3">
               <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>부족</span>
                  <span>탁월</span>
               </div>
               <input 
                type="range" min="1" max="5" 
                value={userData.baselineScores[comp]}
                onChange={(e) => handleScoreChange(comp, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
               <div className="text-center font-bold text-blue-600 mt-1">
                 {userData.baselineScores[comp]} / 5
               </div>
             </div>
           </Card>
         ))}
       </div>

       <div className="flex justify-end">
         <button 
           onClick={() => setActiveTab('dashboard')}
           className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
         >
           진단 완료 및 대시보드 이동
         </button>
       </div>
    </div>
  );

  const DashboardView = () => (
    <div className="max-w-6xl mx-auto py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Stats & Radar */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-indigo-50 to-white">
            <span className="text-slate-500 text-xs uppercase font-bold">Level</span>
            <span className="text-3xl font-black text-indigo-600">{userData.level}</span>
          </Card>
          <Card className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-amber-50 to-white">
            <span className="text-slate-500 text-xs uppercase font-bold">Streak</span>
            <span className="text-3xl font-black text-amber-600 flex items-center gap-1">
              {userData.streak} <Zap size={20} className="fill-current"/>
            </span>
          </Card>
          <Card className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-emerald-50 to-white">
            <span className="text-slate-500 text-xs uppercase font-bold">XP</span>
            <span className="text-3xl font-black text-emerald-600">{userData.xp}</span>
          </Card>
        </div>

        <Card className="h-96 relative">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Brain size={18} /> 역량 레이더 차트
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="My Skill"
                dataKey="A"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
          <div className="absolute top-4 right-4 text-xs text-slate-400 bg-white/80 p-2 rounded backdrop-blur-sm border">
            * 퀴즈와 미션 수행으로<br/>영역을 확장하세요!
          </div>
        </Card>

        <Card>
            <h3 className="font-bold text-slate-700 mb-4">오늘의 실천 (Daily Routine)</h3>
            <div className="space-y-3">
                {COMPETENCIES.map(comp => {
                    const today = new Date().toISOString().split('T')[0];
                    const isChecked = !!userData.actionPlanChecks[`${today}_${comp}`];
                    // Only show top 2 weakest or all? Let's show all for now but highlight weak ones.
                    const mastery = calculateMastery(userData, comp);
                    const isWeak = mastery < 40;

                    return (
                        <div key={comp} className={`flex items-center justify-between p-3 rounded-lg border ${isWeak ? 'border-red-200 bg-red-50' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isWeak ? 'bg-white text-red-500' : 'bg-slate-100 text-slate-600'}`}>
                                    {isWeak ? <AlertCircle size={16}/> : <CheckCircle size={16}/>}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{COMPETENCY_DATA[comp].name}</div>
                                    <div className="text-xs text-slate-500">
                                        {isWeak ? '집중 관리가 필요해요!' : '꾸준히 유지해보세요.'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleActionCheck(comp)}
                                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                                    isChecked ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300'
                                }`}
                            >
                                {isChecked && <CheckCircle size={14} />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </Card>
      </div>

      {/* Right Column: Badges & Info */}
      <div className="space-y-6">
        <Card>
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Award size={18}/> 획득 배지</h3>
            <div className="grid grid-cols-4 gap-2">
                {userData.badges.length === 0 && <p className="col-span-4 text-center text-xs text-slate-400 py-4">아직 획득한 배지가 없습니다.</p>}
                {userData.badges.map(badge => (
                    <div key={badge} className="aspect-square bg-yellow-100 rounded-full flex items-center justify-center text-xl shadow-sm" title={badge}>
                        🏆
                    </div>
                ))}
            </div>
        </Card>
        
        {userData.selectedJobId && (
            <Card className="bg-slate-800 text-white border-none">
                <div className="text-xs text-slate-400 mb-1">나의 목표 직업</div>
                <h3 className="font-bold text-xl mb-4">{JOB_PROFILES.find(j => j.id === userData.selectedJobId)?.name}</h3>
                <div className="space-y-2">
                    <p className="text-sm text-slate-300">필요 핵심 역량:</p>
                    <div className="flex flex-wrap gap-2">
                        {JOB_PROFILES.find(j => j.id === userData.selectedJobId)?.requiredCompetencies.map(c => (
                            <span key={c} className="text-xs bg-slate-700 px-2 py-1 rounded border border-slate-600">
                                {COMPETENCY_DATA[c].name.split(' ')[0]}
                            </span>
                        ))}
                    </div>
                </div>
            </Card>
        )}

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-700 mb-3 text-sm">트레이드오프 주의</h3>
             <p className="text-xs text-slate-500 leading-relaxed">
               특정 역량(예: 컴퓨팅 사고)만 과도하게 높이고 공동체 역량을 소홀히 하면, 
               기술적으로는 뛰어나지만 사회적 책임을 다하지 못하는 '기술 만능주의'에 빠질 수 있습니다. 
               균형 잡힌 성장이 중요합니다.
             </p>
        </div>
      </div>
    </div>
  );

  const TrainingView = () => {
    const [mode, setMode] = useState<'quiz' | 'scenario'>('quiz');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    // Filter valid indices
    const currentQuestion = QUIZ_DATA[currentQIndex % QUIZ_DATA.length];
    const currentScenario = SCENARIOS[currentQIndex % SCENARIOS.length];

    const handleAnswer = (idx: number) => {
        if (mode === 'quiz') {
            const isCorrect = idx === currentQuestion.correctIndex;
            handleQuizAnswer(currentQuestion.id, isCorrect, currentQuestion.competency, currentQuestion.errorType);
            setFeedback(isCorrect ? "정답입니다! +20 XP" : `오답입니다. 정답은 ${currentQuestion.options[currentQuestion.correctIndex]}입니다.\n${currentQuestion.explanation}`);
            setShowResult(true);
        } else {
            // Scenario mode: idx is mapped to competency index in dropdown? 
            // Simplified: User picks from list of Competency Names
        }
    };

    const handleScenarioChoice = (comp: CompetencyType) => {
        const isCorrect = comp === currentScenario.correctCompetency;
        handleScenarioAnswer(isCorrect, currentScenario.correctCompetency);
        setFeedback(isCorrect ? "탁월한 선택입니다! 상황에 딱 맞는 역량이네요. +30 XP" : `아쉽네요. 이 상황에서는 [${COMPETENCY_DATA[currentScenario.correctCompetency].name}]이 더 중요합니다.\n${currentScenario.feedback}`);
        setShowResult(true);
    }

    const next = () => {
        setCurrentQIndex(prev => prev + 1);
        setShowResult(false);
        setFeedback(null);
    }

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-6">
            <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => { setMode('quiz'); setShowResult(false); }} className={`px-4 py-2 rounded-full text-sm font-bold ${mode === 'quiz' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border'}`}>개념 퀴즈</button>
                <button onClick={() => { setMode('scenario'); setShowResult(false); }} className={`px-4 py-2 rounded-full text-sm font-bold ${mode === 'scenario' ? 'bg-purple-600 text-white' : 'bg-white text-slate-500 border'}`}>상황 시뮬레이션</button>
            </div>

            <Card className="min-h-[400px] flex flex-col justify-between">
                {mode === 'quiz' ? (
                    <>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className={`text-xs px-2 py-1 rounded font-bold ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' : currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {currentQuestion.difficulty.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-400">문제 {currentQuestion.id}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-6">{currentQuestion.question}</h3>
                            <div className="space-y-3">
                                {currentQuestion.options.map((opt, idx) => (
                                    <button 
                                        key={idx}
                                        disabled={showResult}
                                        onClick={() => handleAnswer(idx)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                                            showResult 
                                                ? idx === currentQuestion.correctIndex 
                                                    ? 'bg-green-50 border-green-500 ring-1 ring-green-500'
                                                    : 'bg-slate-50 opacity-50'
                                                : 'hover:bg-slate-50 hover:border-blue-300'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                         <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs px-2 py-1 rounded font-bold bg-purple-100 text-purple-700">SCENARIO</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">"{currentScenario.situation}"</h3>
                            <p className="text-sm text-slate-500 mb-4">이 상황을 해결하기 위해 가장 필요한 핵심 역량은 무엇인가요?</p>
                            <div className="grid grid-cols-1 gap-2">
                                {COMPETENCIES.map((comp) => (
                                    <button 
                                        key={comp}
                                        disabled={showResult}
                                        onClick={() => handleScenarioChoice(comp)}
                                        className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 ${
                                            showResult && comp === currentScenario.correctCompetency
                                                ? 'bg-green-50 border-green-500'
                                                : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="text-xl">{COMPETENCY_DATA[comp].icon}</span>
                                        <span className="font-medium text-sm">{COMPETENCY_DATA[comp].name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {showResult && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{feedback}</p>
                        <button onClick={next} className="mt-4 w-full py-2 bg-slate-800 text-white rounded font-bold">다음 문제</button>
                    </div>
                )}
            </Card>

            {userData.wrongNotes.length > 0 && (
                <div className="mt-8">
                    <h4 className="font-bold text-slate-700 mb-2">오답 노트 ({userData.wrongNotes.length})</h4>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-500">
                        최근 틀린 문제의 유형을 분석해보니 <span className="font-bold text-red-500">
                            {userData.wrongNotes[userData.wrongNotes.length-1].errorType === 'definition_confusion' ? '개념 정의 혼동' : '사례 적용 오류'}
                        </span> 유형이 많습니다. 이론 카드를 다시 확인해보세요!
                    </div>
                </div>
            )}
        </div>
    );
  };

  const ReflectionView = () => {
    const [selectedComp, setSelectedComp] = useState<CompetencyType>('communication');
    const [reflectionText, setReflectionText] = useState('');

    const handleFeedbackRequest = async () => {
        if(!reflectionText) return;
        setFeedbackLoading(true);
        const feedback = await getReflectionFeedback(
            COMPETENCY_DATA[selectedComp].name,
            reflectionText,
            calculateMastery(userData, selectedComp)
        );
        setReflectionFeedback(feedback);
        setFeedbackLoading(false);
    };

    const handlePersuasiveRequest = async () => {
        if(!userData.selectedJobId) return;
        setFeedbackLoading(true);
        const masteryMap: Record<string, number> = {};
        COMPETENCIES.forEach(c => masteryMap[COMPETENCY_DATA[c].name] = calculateMastery(userData, c));
        
        const text = await generatePersuasiveText(
            masteryMap,
            JOB_PROFILES.find(j => j.id === userData.selectedJobId)?.name || ''
        );
        setPersuasiveText(text);
        setFeedbackLoading(false);
    }

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-8">
            <Card>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Edit3 className="text-blue-600"/> 성장 계획 세우기
                </h2>
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">1. 역량 선택</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {COMPETENCIES.map(comp => (
                            <button
                                key={comp}
                                onClick={() => setSelectedComp(comp)}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                                    selectedComp === comp 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {COMPETENCY_DATA[comp].name}
                            </button>
                        ))}
                    </div>

                    <label className="block text-sm font-bold text-slate-700">2. 학교 생활 적용 계획 (2문장)</label>
                    <textarea 
                        className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32 resize-none"
                        placeholder={`예: 다음 모둠 활동에서 친구들의 의견을 끝까지 듣고 요약해서 말해주겠다. 이를 통해 ${COMPETENCY_DATA[selectedComp].name}을 키우겠다.`}
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                    />

                    <div className="flex justify-end">
                        <button 
                            onClick={handleFeedbackRequest}
                            disabled={feedbackLoading || !reflectionText}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {feedbackLoading ? 'AI 코치가 생각 중...' : '코치 피드백 받기'} <Lightbulb size={16}/>
                        </button>
                    </div>

                    {reflectionFeedback && (
                        <div className="mt-6 bg-indigo-50 p-6 rounded-lg border border-indigo-100 animate-fade-in">
                            <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">🤖 AI 코치의 피드백</h4>
                            <p className="text-indigo-900 text-sm leading-relaxed whitespace-pre-wrap">{reflectionFeedback}</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="text-emerald-600"/> 자기소개서/포트폴리오 도우미
                </h2>
                <p className="text-sm text-slate-600 mb-4">내 현재 역량 점수를 바탕으로, 희망 직업({JOB_PROFILES.find(j => j.id === userData.selectedJobId)?.name || '선택 안함'})에 적합한 이유를 설명하는 문장을 만들어보세요.</p>
                
                <button 
                    onClick={handlePersuasiveRequest}
                    disabled={!userData.selectedJobId || feedbackLoading}
                    className="w-full border-2 border-dashed border-slate-300 rounded-lg p-4 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                    {feedbackLoading ? '생성 중...' : '✨ 내 점수로 설득력 있는 문장 자동 생성하기'}
                </button>

                {persuasiveText && (
                    <div className="mt-4 p-4 bg-emerald-50 rounded border border-emerald-100 text-sm text-emerald-900">
                        {persuasiveText}
                    </div>
                )}
            </Card>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <Radar className="text-blue-600" />
            <span className="hidden sm:inline">Skill Radar</span>
          </div>
          <nav className="hidden md:flex gap-1">
             <TabButton active={activeTab === 'intro'} onClick={() => setActiveTab('intro')} icon={Lightbulb} label="소개" />
             <TabButton active={activeTab === 'diagnosis'} onClick={() => setActiveTab('diagnosis')} icon={Edit3} label="진단" />
             <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={Brain} label="대시보드" />
             <TabButton active={activeTab === 'training'} onClick={() => setActiveTab('training')} icon={Cpu} label="트레이닝" />
             <TabButton active={activeTab === 'reflection'} onClick={() => setActiveTab('reflection')} icon={Users} label="성찰&계획" />
          </nav>
          <div className="text-sm font-medium text-slate-500">
            LV.{userData.level} <span className="text-blue-600">{userData.name}</span>
          </div>
        </div>
      </header>

      <main className="px-4">
        {activeTab === 'intro' && <IntroView />}
        {activeTab === 'diagnosis' && <DiagnosisView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'training' && <TrainingView />}
        {activeTab === 'reflection' && <ReflectionView />}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 z-50 safe-area-bottom">
         <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
            <Brain size={20}/>
            <span className="text-[10px] mt-1">홈</span>
         </button>
         <button onClick={() => setActiveTab('training')} className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'training' ? 'text-blue-600' : 'text-slate-400'}`}>
            <Cpu size={20}/>
            <span className="text-[10px] mt-1">퀴즈</span>
         </button>
         <button onClick={() => setActiveTab('reflection')} className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'reflection' ? 'text-blue-600' : 'text-slate-400'}`}>
            <Edit3 size={20}/>
            <span className="text-[10px] mt-1">계획</span>
         </button>
      </div>
    </div>
  );
}