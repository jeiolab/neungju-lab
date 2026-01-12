import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, UPGRADES, Upgrade } from '../types';
import SimpleChart from './SimpleChart';
import { AlertTriangle, TrendingUp, Users, Wallet, Zap } from 'lucide-react';

const INITIAL_STATE: GameState = {
  money: 5000,
  productivity: 20,
  labor: 90,
  pigsHealth: 100,
  pigsCount: 10,
  installedUpgrades: [],
  day: 1,
  history: [{ day: 1, money: 5000 }],
  lastEvent: null,
};

const SimulationTab: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isRunning, setIsRunning] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Audio refs for simple effects could go here, but sticking to visual for now due to constraints.

  // Helper to add notification
  const notify = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Game Tick Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setGameState((prev) => {
          // 1. Calculate Income
          // Base income per pig * productivity multiplier
          const income = Math.floor(prev.pigsCount * (prev.productivity * 0.5));
          const maintenanceCost = Math.floor(prev.labor * 0.5) + (prev.pigsCount * 2);
          const netProfit = Math.max(0, income - maintenanceCost); // No negative profit for simplicity

          let newHealth = prev.pigsHealth;
          let newEvent = null;
          let newProductivity = prev.productivity;

          // 2. Random Events (Disease)
          // 5% chance of disease per tick
          const eventRoll = Math.random();
          const hasAIDiagnosis = prev.installedUpgrades.includes('ai_diagnosis');
          const hasSensors = prev.installedUpgrades.includes('temp_sensor');

          if (eventRoll < 0.05) {
            if (hasAIDiagnosis) {
              newEvent = "⚠️ 전염병 경보! -> AI 시스템이 조기 차단했습니다.";
              notify("AI가 질병을 조기 발견하여 피해를 막았습니다!", "success");
            } else {
              newEvent = "🚨 전염병 발생! 돼지 건강이 악화됩니다.";
              newHealth = Math.max(0, prev.pigsHealth - 30);
              newProductivity = Math.max(10, prev.productivity - 20); // Temp drop
              notify("전염병 발생! 생산성이 떨어지고 돼지가 아픕니다.", "error");
            }
          } else {
            // Recover health slowly if sensors exist
            if (hasSensors && newHealth < 100) {
                newHealth = Math.min(100, newHealth + 5);
            } else if (newHealth < 100) {
                newHealth = Math.min(100, newHealth + 1);
            }
          }

          const newMoney = prev.money + netProfit;
          const newDay = prev.day + 1;
          
          // Limit history size for chart
          const newHistory = [...prev.history, { day: newDay, money: newMoney }];
          if (newHistory.length > 20) newHistory.shift();

          return {
            ...prev,
            money: newMoney,
            day: newDay,
            pigsHealth: newHealth,
            productivity: newProductivity, // In a real game, we'd want to restore productivity over time if it dropped
            history: newHistory,
            lastEvent: newEvent ? newEvent : prev.lastEvent,
          };
        });
      }, 1500); // 1.5 seconds per day
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  // Buy Upgrade
  const buyUpgrade = (upgrade: Upgrade) => {
    if (gameState.installedUpgrades.includes(upgrade.id)) return;
    if (gameState.money < upgrade.cost) {
      notify("자금이 부족합니다!", "error");
      return;
    }

    setGameState((prev) => ({
      ...prev,
      money: prev.money - upgrade.cost,
      installedUpgrades: [...prev.installedUpgrades, upgrade.id],
      productivity: prev.productivity + upgrade.productivityBonus,
      labor: Math.max(0, prev.labor - upgrade.laborReduction),
      history: [...prev.history, { day: prev.day, money: prev.money - upgrade.cost }], // Log the purchase dip
    }));
    notify(`${upgrade.name} 설치 완료!`, "success");
  };

  // Render Helpers
  const getPigEmoji = (health: number) => {
    if (health > 80) return '🐷'; // Happy
    if (health > 40) return '🐽'; // Okay
    return '🥓'; // Sick/Sad (A bit dark, but visually distinct)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Money Card */}
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-400 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">자금</p>
            <p className="text-2xl font-bold text-gray-800 tabular-nums">
                {gameState.money.toLocaleString()}원
            </p>
          </div>
          <Wallet className="text-yellow-400 w-8 h-8" />
        </div>

        {/* Productivity Card */}
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-400 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">생산성</p>
            <p className="text-2xl font-bold text-gray-800 tabular-nums">{gameState.productivity}%</p>
          </div>
          <TrendingUp className="text-blue-400 w-8 h-8" />
        </div>

        {/* Labor Card */}
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-400 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">필요 노동력</p>
            <p className="text-2xl font-bold text-gray-800 tabular-nums">{gameState.labor}%</p>
          </div>
          <Users className="text-red-400 w-8 h-8" />
        </div>

         {/* Health Card */}
         <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-400 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">돼지 건강</p>
            <p className="text-2xl font-bold text-gray-800 tabular-nums">{gameState.pigsHealth}%</p>
          </div>
          <span className="text-3xl">{getPigEmoji(gameState.pigsHealth)}</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Simulation Visuals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Farm View */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md min-h-[250px] relative overflow-hidden">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center">
                <span className="mr-2">🏠</span> 나의 스마트 팜 (Day {gameState.day})
            </h3>
            
            {/* Visual representation of upgrades */}
            <div className="absolute top-2 right-2 flex gap-2">
                {gameState.installedUpgrades.includes('temp_sensor') && <span title="센서 작동중" className="bg-white p-1 rounded-full shadow text-xl">🌡️</span>}
                {gameState.installedUpgrades.includes('auto_feeder') && <span title="자동급식기 작동중" className="bg-white p-1 rounded-full shadow text-xl">🤖</span>}
                {gameState.installedUpgrades.includes('ai_diagnosis') && <span title="AI 감시중" className="bg-white p-1 rounded-full shadow text-xl">🧠</span>}
            </div>

            {/* Pigs Grid */}
            <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
                {Array.from({ length: gameState.pigsCount }).map((_, i) => (
                    <div key={i} className={`text-4xl transition-transform duration-500 ${isRunning ? 'animate-bounce' : ''}`} style={{ animationDuration: `${1 + Math.random()}s` }}>
                        {getPigEmoji(gameState.pigsHealth)}
                    </div>
                ))}
            </div>

            {/* Event Overlay */}
            {notification && (
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-lg shadow-lg font-bold text-white z-20 transition-all ${
                    notification.type === 'error' ? 'bg-red-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                    {notification.message}
                </div>
            )}
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow">
             <h3 className="text-gray-700 font-bold mb-4">📈 수익 성장 그래프</h3>
             <SimpleChart 
                data={gameState.history.map(h => ({ label: `Day ${h.day}`, value: h.money }))} 
                color="bg-blue-600 hover:bg-blue-700"
             />
          </div>
        </div>

        {/* Right: Controls */}
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">시설 투자</h3>
                    <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`px-4 py-2 rounded-lg font-bold text-white transition-colors ${isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isRunning ? '일시정지' : '농장 운영 시작'}
                    </button>
                </div>

                <div className="space-y-4">
                    {UPGRADES.map(upgrade => {
                        const isInstalled = gameState.installedUpgrades.includes(upgrade.id);
                        const canAfford = gameState.money >= upgrade.cost;

                        return (
                            <div key={upgrade.id} className={`border rounded-lg p-4 transition-all ${isInstalled ? 'bg-blue-50 border-blue-200 opacity-70' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{upgrade.icon}</span>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{upgrade.name}</h4>
                                            <span className="text-xs text-blue-600 font-semibold">
                                                +{upgrade.productivityBonus}% 생산성, -{upgrade.laborReduction}% 노동력
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{upgrade.description}</p>
                                <button
                                    onClick={() => buyUpgrade(upgrade)}
                                    disabled={isInstalled || !canAfford}
                                    className={`w-full py-2 rounded font-bold text-sm ${
                                        isInstalled 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : canAfford 
                                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isInstalled ? '설치됨' : `${upgrade.cost.toLocaleString()}원 투자하기`}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <div className="flex items-center gap-2 font-bold mb-1">
                    <Zap className="w-4 h-4"/>
                    <span>TIP</span>
                </div>
                기술을 도입하면 농장 주인이 직접 일하는 시간(노동력)은 줄어들고, 생산성은 올라가 더 많은 수익을 낼 수 있어요! 이것이 바로 스마트 팜의 핵심입니다.
            </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;