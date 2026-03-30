import React, { useState, useEffect, useCallback } from 'react';
import { GameStats, Scenario, Choice, LogEntry, HistoryPoint, Tab } from './types';
import { INITIAL_STATS, FALLBACK_SCENARIOS, MAX_WEEKS } from './constants';
import { generateDynamicScenario } from './services/geminiService';
import StatsBar from './components/StatsBar';
import SimulationView from './components/SimulationView';
import StockChart from './components/StockChart';
import OfficeView from './components/OfficeView';
import AuditView from './components/AuditView';
import ReportView from './components/ReportView';
import { Briefcase, Activity, BarChart2, ShieldCheck, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [week, setWeek] = useState(1);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [history, setHistory] = useState<HistoryPoint[]>([
    { week: 1, value: 1000000, security: 50, users: 1000 }
  ]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OFFICE);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [loading, setLoading] = useState(false);

  // Initialize first scenario
  useEffect(() => {
    // Only set initial scenario if we haven't started (week 1 and no scenario)
    if (week === 1 && !currentScenario && gameStatus === 'playing') {
      setCurrentScenario(FALLBACK_SCENARIOS[0]);
    }
  }, [week, currentScenario, gameStatus]);

  // Handle Game Over Conditions
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    if (stats.budget <= 0) {
      setLogs(prev => [...prev, { week, message: "파산: 자금이 바닥났습니다.", type: 'danger' }]);
      setGameStatus('lost');
    } else if (stats.security <= 0) {
      setLogs(prev => [...prev, { week, message: "치명적 해킹: 회사가 회복 불가능한 타격을 입었습니다.", type: 'danger' }]);
      setGameStatus('lost');
    } else if (week > MAX_WEEKS) {
      setLogs(prev => [...prev, { week, message: "IPO 성공: 기업 공개에 성공했습니다!", type: 'success' }]);
      setGameStatus('won');
      setActiveTab(Tab.REPORT); // Auto switch to report
    }
  }, [stats, week, gameStatus]);

  const loadNextScenario = useCallback(async (currentWeek: number, currentStats: GameStats) => {
    if (currentWeek >= MAX_WEEKS) {
      setWeek(currentWeek + 1); // Trigger end game
      return;
    }

    setLoading(true);
    const historyText = logs.slice(-3).map(l => l.message).join("; ");
    
    // Try AI generation, fallback to hardcoded list if needed (or simple random logic)
    // For demo stability, we check if we have a fallback for this specific week logic, 
    // otherwise try AI.
    let nextScenario: Scenario | null = null;
    
    if (currentWeek === 1) {
       // already handled by initial fallback
       nextScenario = FALLBACK_SCENARIOS[1]; 
    } else {
       nextScenario = await generateDynamicScenario(currentWeek + 1, currentStats, historyText);
    }
    
    // Safety fallback if AI fails
    if (!nextScenario) {
      const fallbackIndex = (currentWeek) % FALLBACK_SCENARIOS.length;
      nextScenario = { 
        ...FALLBACK_SCENARIOS[fallbackIndex], 
        id: `fallback-${currentWeek}`,
        title: `${currentWeek + 1}주차 운영`,
        description: "시스템 유지보수 및 유저 확보에 관한 일상적인 의사결정이 필요합니다."
      };
    }

    setCurrentScenario(nextScenario);
    setWeek(w => w + 1);
    setLoading(false);
  }, [logs]);

  const handleChoice = async (choice: Choice) => {
    if (gameStatus !== 'playing') return;

    // Apply effects
    const newStats = {
      security: Math.max(0, Math.min(100, stats.security + (choice.effect.security || 0))),
      users: Math.max(0, stats.users + (choice.effect.users || 0)),
      budget: stats.budget + (choice.effect.budget || 0),
      happiness: Math.max(0, Math.min(100, stats.happiness + (choice.effect.happiness || 0))),
    };

    setStats(newStats);

    // Calculate Valuation (Simplified Logic)
    const valuation = (newStats.users * 1000) + newStats.budget;
    
    setHistory(prev => [...prev, {
      week: week + 1,
      value: valuation,
      security: newStats.security,
      users: newStats.users
    }]);

    // Log Event
    const logType = (choice.effect.security || 0) < 0 ? 'danger' : 'info';
    setLogs(prev => [...prev, {
      week,
      message: `${choice.feedback}`,
      type: logType
    }]);

    // Random Event Logic (Ransomware chance if security is low)
    if (newStats.security < 30 && Math.random() > 0.7) {
      setLogs(prev => [...prev, {
        week: week + 1,
        message: "⚠️ 보안 경고: 낮은 보안 수준으로 인해 랜섬웨어 공격을 받았습니다. 복구 비용이 발생했습니다.",
        type: 'danger'
      }]);
      newStats.budget -= 2000;
      setStats({...newStats}); // Update stats immediately for the random event
    }

    // Proceed to next week
    await loadNextScenario(week, newStats);
  };

  const restartGame = () => {
    setWeek(1);
    setStats(INITIAL_STATS);
    setHistory([{ week: 1, value: 1000000, security: 50, users: 1000 }]);
    setLogs([]);
    setGameStatus('playing');
    setCurrentScenario(FALLBACK_SCENARIOS[0]);
    setActiveTab(Tab.SIMULATION);
  };

  const TabButton = ({ id, icon, label }: { id: Tab; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors font-medium text-sm md:text-base ${
        activeTab === id 
          ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500' 
          : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded text-white">
               <Briefcase size={20} />
             </div>
             <div>
               <h1 className="font-bold text-lg text-white leading-tight">스타트업 CEO</h1>
               <p className="text-xs text-slate-400">보안 vs 성장 시뮬레이터</p>
             </div>
          </div>
          <div className="bg-slate-800 px-4 py-1 rounded-full border border-slate-700">
            <span className="text-xs font-mono text-slate-400">WEEK</span>
            <span className="ml-2 font-bold text-white text-lg">{week > MAX_WEEKS ? '종료' : week}/{MAX_WEEKS}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-6">
        <StatsBar stats={stats} />

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-6 overflow-x-auto">
          <TabButton id={Tab.OFFICE} icon={<Briefcase size={18} />} label="CEO 집무실" />
          <TabButton id={Tab.SIMULATION} icon={<Activity size={18} />} label="경영 시뮬레이션" />
          <TabButton id={Tab.CHART} icon={<BarChart2 size={18} />} label="주가 차트" />
          <TabButton id={Tab.AUDIT} icon={<ShieldCheck size={18} />} label="보안 감사" />
          <TabButton id={Tab.REPORT} icon={<FileText size={18} />} label="리포트" />
        </div>

        {/* Content Area */}
        <div className="min-h-[400px] animate-in fade-in duration-300">
          {activeTab === Tab.OFFICE && <OfficeView />}
          {activeTab === Tab.SIMULATION && (
            <SimulationView 
              scenario={currentScenario} 
              loading={loading}
              onChoice={handleChoice} 
              logs={logs}
              gameOver={gameStatus !== 'playing'}
              onRestart={restartGame}
            />
          )}
          {activeTab === Tab.CHART && <StockChart data={history} />}
          {activeTab === Tab.AUDIT && <AuditView />}
          {activeTab === Tab.REPORT && <ReportView stats={stats} logs={logs} week={week} />}
        </div>
      </main>
    </div>
  );
};

export default App;