'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TABS, SCENARIOS, QUIZ_QUESTIONS, SCHOOL_ACCIDENTS, CHECKLIST, LEVEL_THRESHOLDS } from './constants';
import { Tab, UserStats, ActionType, Scenario, QuizQuestion } from './types';
import * as storageService from './services/storageService';
import * as geminiService from './services/geminiService';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';
import VulnerabilityRadar from './components/VulnerabilityRadar';
import { 
  Shield, 
  Target, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  RefreshCcw,
  ExternalLink,
  Lock,
  MessageSquare,
  // Fix: Import missing icons Smartphone and BrainCircuit
  Smartphone,
  BrainCircuit
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [stats, setStats] = useState<UserStats>(storageService.getStats());
  const [logs, setLogs] = useState(storageService.getLogs());
  
  // Simulation State
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [simulationResult, setSimulationResult] = useState<{success: boolean; message: string; xpChange: number} | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Reflection State
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflectionResponse, setReflectionResponse] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);

  // Load stats on mount
  useEffect(() => {
    setStats(storageService.getStats());
  }, []);

  const handleUpdateXP = (amount: number) => {
    const newStats = storageService.addXP(amount);
    setStats(newStats);
  };

  const startSimulation = () => {
    const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setCurrentScenario(randomScenario);
    setSimulationResult(null);
  };

  const handleAction = (action: ActionType) => {
    if (!currentScenario) return;

    const isCorrect = currentScenario.correctActions.includes(action);
    let message = '';
    let xpChange = 0;
    
    // Logic for result
    if (action === 'CLICK') {
        message = `⚠️ 위험! 악성 링크를 클릭했습니다. [${currentScenario.riskIfClicked}% 위험도] ${currentScenario.explanation}`;
        xpChange = -20;
        storageService.updateVulnerability(currentScenario.tags);
    } else if (isCorrect) {
        if (action === 'REPORT') {
            message = `🛡️ 신고 접수 완료! 다른 피해자를 막았습니다. (+30 XP)`;
            xpChange = 30;
        } else if (action === 'CHECK_FRIEND') {
             message = `👥 확인 완료! 공식 경로나 지인 확인은 가장 확실한 방법입니다. (+20 XP)`;
             xpChange = 20;
        } else {
             message = `✅ 안전하게 대응했습니다. (+10 XP)`;
             xpChange = 10;
        }
    } else {
        // Safe but not optimal or incorrect context
        message = `🤔 적절하지 않은 대응일 수 있습니다. 설명을 확인해보세요.`;
        xpChange = 0;
    }

    setSimulationResult({ success: isCorrect && action !== 'CLICK', message, xpChange });
    handleUpdateXP(xpChange);
    
    // Log
    const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action,
        result: (isCorrect && action !== 'CLICK') ? 'SUCCESS' : action === 'CLICK' ? 'FAILURE' : 'NEUTRAL',
        scenarioId: currentScenario.id
    } as const; // Narrowing type
    
    storageService.addLog(newLog);
    setLogs(storageService.getLogs());

    // Update simulation count
    const updatedStats = storageService.getStats();
    updatedStats.simulationsCompleted += 1;
    storageService.saveStats(updatedStats);
    setStats(updatedStats);
  };

  const submitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) score += 10;
    });
    setQuizSubmitted(true);
    handleUpdateXP(score);
    
    const updatedStats = storageService.getStats();
    updatedStats.quizScore = Math.max(updatedStats.quizScore, score);
    storageService.saveStats(updatedStats);
    setStats(updatedStats);
  };

  const handleReflectionSubmit = async () => {
    if (!reflectionInput.trim()) return;
    setIsReflecting(true);
    const feedback = await geminiService.analyzeReflection(reflectionInput);
    setReflectionResponse(feedback || '');
    setIsReflecting(false);
    handleUpdateXP(50); // Big bonus for reflection
  };

  const renderBadge = () => {
    const levelName = stats.level === 'TRAINEE' ? '보안 훈련생' : stats.level === 'DEFENDER' ? '사이버 수비수' : '보안 캡틴';
    const color = stats.level === 'TRAINEE' ? 'text-gray-400' : stats.level === 'DEFENDER' ? 'text-blue-400' : 'text-purple-400';
    return (
        <div className={`text-sm font-bold ${color} border border-current px-3 py-1 rounded-full uppercase tracking-wider`}>
            {levelName}
        </div>
    )
  };

  // --- UI Components ---

  const renderTheory = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                <Target /> 스미싱(Smishing)이란?
            </h3>
            <p className="text-slate-700 leading-relaxed">
                문자메시지(SMS)와 피싱(Phishing)의 합성어입니다. 
                <br/><br/>
                <span className="text-slate-900 font-bold">"무료쿠폰 제공", "돌잔치 초대장", "택배 배송 불가"</span> 등 
                관심을 끄는 문구와 인터넷 주소(URL)를 보내 클릭을 유도합니다.
                <br/><br/>
                클릭 시 악성 앱(.apk)이 설치되어 개인정보, 금융정보를 탈취하거나 소액결제 피해를 입힙니다.
            </p>
        </div>
        
        <PasswordStrengthMeter />

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <Lock /> 2단계 인증(2FA)의 중요성
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
                비밀번호가 털려도 계정을 지키는 최후의 보루입니다.
                네이버, 구글, 카카오톡, 인스타그램 등 대부분의 서비스에서 설정 가능합니다.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-700 text-sm mb-2">미션: 지금 바로 설정하기</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                    <li>1. 인스타그램 설정 {'>'} 보안 {'>'} 2단계 인증</li>
                    <li>2. 네이버 내정보 {'>'} 보안설정 {'>'} 2단계 인증</li>
                </ul>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                <AlertTriangle /> 개인정보 노출 최소화
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>SNS 프로필에 전화번호, 학교, 생년월일을 전체 공개하지 마세요.</li>
                <li>친구들끼리라도 계정 비밀번호를 공유하지 마세요.</li>
                <li>출처를 알 수 없는 앱은 절대 설치하지 마세요.</li>
            </ul>
        </div>
    </div>
  );

  const renderSimulation = () => (
    <div className="max-w-2xl mx-auto">
        {!currentScenario ? (
             <div className="text-center py-12">
                <div className="inline-block p-6 bg-white rounded-full mb-6 border-2 border-indigo-500 shadow-sm">
                    {/* Fix: Smartphone component is now imported */}
                    <Smartphone size={48} className="text-cyber-primary" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">오늘의 의심 메시지가 도착했습니다</h2>
                <p className="text-slate-600 mb-8">매일 새로운 스미싱/피싱 패턴을 학습하고 방어하세요.</p>
                <button 
                    onClick={startSimulation}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
                >
                    메시지 확인하기
                </button>
             </div>
        ) : (
            <div className="animate-slide-up">
                <div className="bg-white text-black p-4 rounded-3xl shadow-xl max-w-sm mx-auto mb-8 border-4 border-gray-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 flex items-center justify-center text-xs text-gray-500 border-b">
                        메시지
                    </div>
                    <div className="mt-8 mb-4">
                        <div className="text-xs text-gray-500 mb-1">발신자: <span className="font-bold text-black">{currentScenario.sender}</span></div>
                        <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{currentScenario.content}</p>
                        </div>
                    </div>
                </div>

                {!simulationResult ? (
                    <div className="grid grid-cols-2 gap-3">
                         <button onClick={() => handleAction('CLICK')} className="col-span-2 bg-slate-800 hover:bg-slate-700 p-4 rounded-lg font-bold text-indigo-200 border border-slate-700">
                            🔗 링크/첨부파일 클릭
                        </button>
                        <button onClick={() => handleAction('DELETE')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-sm text-white">
                            🗑️ 삭제하기
                        </button>
                        <button onClick={() => handleAction('IGNORE')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-sm text-white">
                            😑 무시하기
                        </button>
                        <button onClick={() => handleAction('CHECK_FRIEND')} className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg text-white text-sm font-bold">
                            📞 지인/공식처 확인
                        </button>
                        <button onClick={() => handleAction('REPORT')} className="bg-red-600 hover:bg-red-700 p-3 rounded-lg text-white text-sm font-bold">
                            🚨 신고하기
                        </button>
                    </div>
                ) : (
                    <div className={`p-6 rounded-xl border ${simulationResult.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} text-center`}>
                        <div className="text-4xl mb-4">{simulationResult.success ? '🎉' : '😱'}</div>
                        <h3 className={`text-xl font-bold mb-2 ${simulationResult.success ? 'text-green-700' : 'text-red-700'}`}>
                            {simulationResult.success ? '방어 성공!' : '피싱 피해 발생!'}
                        </h3>
                        <p className="text-slate-700 mb-4">{simulationResult.message}</p>
                        <div className="text-sm font-bold mb-6">획득 경험치: {simulationResult.xpChange > 0 ? '+' : ''}{simulationResult.xpChange} XP</div>
                        <button 
                            onClick={startSimulation}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                        >
                            <RefreshCcw size={16}/> 다음 훈련
                        </button>
                    </div>
                )}
            </div>
        )}
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-900">정보보호 퀴즈 챌린지</h2>
        {!quizSubmitted && (
             <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                10문제
             </span>
        )}
      </div>

      {QUIZ_QUESTIONS.map((q, index) => (
        <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between mb-4">
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                    q.difficulty === 'EASY' ? 'bg-green-100 text-green-700' : 
                    q.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                    {q.difficulty}
                </span>
                <span className="text-slate-500">Q{index + 1}</span>
           </div>
           <h3 className="text-lg font-bold text-slate-900 mb-4">{q.question}</h3>
           <div className="space-y-2">
                {q.options.map((opt, optIndex) => {
                    let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                    if (quizSubmitted) {
                        if (optIndex === q.correctIndex) btnClass += "bg-green-50 border-green-500 text-green-700";
                        else if (quizAnswers[q.id] === optIndex) btnClass += "bg-red-50 border-red-500 text-red-700";
                        else btnClass += "bg-slate-50 border-slate-200 text-slate-500";
                    } else {
                        if (quizAnswers[q.id] === optIndex) btnClass += "bg-indigo-50 border-indigo-400 text-slate-900";
                        else btnClass += "bg-white border-slate-200 hover:bg-slate-50 text-slate-700";
                    }

                    return (
                        <button 
                            key={optIndex} 
                            onClick={() => !quizSubmitted && setQuizAnswers(prev => ({...prev, [q.id]: optIndex}))}
                            className={btnClass}
                            disabled={quizSubmitted}
                        >
                            {opt}
                        </button>
                    )
                })}
           </div>
           {quizSubmitted && (
               <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 border-l-4 border-indigo-500">
                   💡 <span className="font-bold text-slate-900">해설:</span> {q.explanation}
               </div>
           )}
        </div>
      ))}

      {!quizSubmitted ? (
        <button 
            onClick={submitQuiz}
            disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
            className="w-full bg-indigo-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl text-lg hover:bg-indigo-700 transition-colors"
        >
            제출하고 채점하기
        </button>
      ) : (
          <div className="text-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
               <h3 className="text-2xl font-bold text-slate-900 mb-2">채점 완료!</h3>
               <p className="text-slate-600 mb-6">오답 노트를 확인하고 다시 도전해보세요.</p>
               <button 
                onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg"
               >
                   다시 풀기
               </button>
          </div>
      )}
    </div>
  );

  const renderMoreInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle /> 학교 내 빈출 사고 TOP 5
            </h3>
            {SCHOOL_ACCIDENTS.map((accident, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="bg-red-100 text-red-700 w-6 h-6 flex items-center justify-center rounded-full text-xs">{idx + 1}</span>
                        {accident.title}
                    </h4>
                    <p className="text-sm text-slate-600 pl-8">{accident.desc}</p>
                </div>
            ))}
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit shadow-sm">
            <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <CheckCircle /> 보안 습관 체크리스트
            </h3>
            <div className="space-y-4">
                {CHECKLIST.map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200">
                        <input type="checkbox" className="mt-1 w-5 h-5 accent-indigo-600 rounded bg-white border-slate-300" />
                        <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                    </label>
                ))}
            </div>
            <p className="mt-6 text-xs text-center text-slate-500">
                매달 1일, 체크리스트를 다시 점검해보세요!
            </p>
        </div>
    </div>
  );

  const renderReflection = () => (
      <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                  {/* Fix: BrainCircuit component is now imported */}
                  <BrainCircuit /> 나만의 보안 약점 생각하기
              </h3>
              <p className="text-slate-600 mb-6">
                  "나는 공짜 쿠폰에 약해", "게임 아이템 준다고 하면 흔들려" 처럼<br/>
                  내가 자주 흔들리는 유혹이나 보안 고민을 적어보세요. AI 멘토가 조언해드립니다.
              </p>
              
              <textarea
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder="예: 친구가 급하게 돈 빌려달라고 하면 의심 없이 보내줄 것 같아서 걱정이야."
                className="w-full h-32 bg-white border border-slate-300 rounded-lg p-4 text-slate-900 resize-none focus:border-indigo-500 focus:outline-none mb-4"
              />
              
              <button
                onClick={handleReflectionSubmit}
                disabled={isReflecting || !reflectionInput}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                  {isReflecting ? 'AI가 분석 중입니다...' : 'AI 멘토에게 조언 구하기'}
                  {!isReflecting && <MessageSquare size={18} />}
              </button>
          </div>

          {reflectionResponse && (
              <div className="bg-white p-6 rounded-xl border border-indigo-200 animate-slide-up shadow-sm">
                  <h4 className="font-bold text-indigo-700 mb-4 flex items-center gap-2">
                      🤖 AI 보안 멘토의 답장
                  </h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {reflectionResponse}
                  </p>
              </div>
          )}
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header / Dashboard */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
                 <div className="bg-indigo-600 p-2 rounded-lg">
                     <Shield className="text-white" size={24} />
                 </div>
                 <div>
                     <h1 className="font-bold text-lg leading-tight text-slate-900">스미싱·피싱 방어 훈련장</h1>
                     <div className="flex items-center gap-2 mt-1">
                         {renderBadge()}
                         <span className="text-xs text-slate-500">Streak: {stats.streak}일🔥</span>
                     </div>
                 </div>
             </div>
             
             <div className="flex items-center gap-6 w-full md:w-auto bg-white p-3 rounded-xl border border-slate-200">
                 <div className="flex-1 md:flex-none">
                     <div className="text-xs text-slate-500 mb-1">현재 경험치</div>
                     <div className="font-mono font-bold text-indigo-600">{stats.xp} XP</div>
                 </div>
                 <div className="h-8 w-px bg-slate-200"></div>
                 <div className="flex-1 md:flex-none">
                     <div className="text-xs text-slate-500 mb-1">다음 레벨까지</div>
                     <div className="text-xs text-slate-600">
                         {stats.level === 'CAPTAIN' ? 'MAX' : `${Math.max(0, (stats.level === 'TRAINEE' ? 100 : 300) - stats.xp)} XP 남음`}
                     </div>
                 </div>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                            isActive 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        <Icon size={18} />
                        <span className="font-medium">{tab.label}</span>
                    </button>
                )
            })}
        </div>

        {/* Dynamic Content */}
        <div className="animate-fade-in min-h-[400px]">
            {activeTab === Tab.THEORY && renderTheory()}
            {activeTab === Tab.SIMULATION && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        {renderSimulation()}
                    </div>
                    <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
                        <VulnerabilityRadar stats={stats} />
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold mb-3 text-sm text-slate-500">최근 활동 로그</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {logs.length === 0 && <div className="text-xs text-slate-500 text-center py-4">아직 기록이 없습니다.</div>}
                                {logs.map(log => (
                                    <div key={log.id} className="text-xs flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200">
                                        <span className={`font-bold ${
                                            log.result === 'SUCCESS' ? 'text-green-700' : 
                                            log.result === 'FAILURE' ? 'text-red-700' : 'text-slate-500'
                                        }`}>
                                            {log.result === 'SUCCESS' ? '방어 성공' : log.result === 'FAILURE' ? '피해 발생' : '단순 조치'}
                                        </span>
                                        <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === Tab.QUIZ && renderQuiz()}
            {activeTab === Tab.MORE_INFO && renderMoreInfo()}
            {activeTab === Tab.REFLECTION && renderReflection()}
        </div>
      </main>

      <footer className="text-center text-slate-500 text-xs py-8 border-t border-slate-200 mt-8">
        <p>본 앱은 교육 목적으로 제작된 시뮬레이션이며, 실제 악성 코드가 포함되어 있지 않습니다.</p>
        <p className="mt-1">모든 데이터는 브라우저에만 저장됩니다.</p>
      </footer>
    </div>
  );
};

export default App;