import React, { useState, useEffect } from 'react';
import MicrobitDisplay from './MicrobitDisplay';
import { GameOutcome, UserStats } from '../types';
import { Play, RotateCcw, Award, Zap, Target } from 'lucide-react';

interface GameTabProps {
  stats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
}

const GameTab: React.FC<GameTabProps> = ({ stats, updateStats }) => {
  const [mode, setMode] = useState<'experiment' | 'game'>('game');
  
  // Experiment State
  const [expSenderGroup, setExpSenderGroup] = useState(1);
  const [expReceiverGroup, setExpReceiverGroup] = useState(1);
  const [expTemp, setExpTemp] = useState(25);
  const [expThreshold, setExpThreshold] = useState(30);
  const [expResult, setExpResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Game State
  const [round, setRound] = useState(1);
  const [scenario, setScenario] = useState<any>(null);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [isCorrectLastRound, setIsCorrectLastRound] = useState<boolean | null>(null);

  // Generate new scenario
  const generateScenario = () => {
    const matchGroup = Math.random() > 0.4; // 60% chance groups match
    const senderG = Math.floor(Math.random() * 20) + 1;
    const receiverG = matchGroup ? senderG : Math.floor(Math.random() * 20) + 21;
    
    const threshold = Math.floor(Math.random() * 15) + 20; // 20-35
    const temp = Math.floor(Math.random() * 20) + 15; // 15-35
    
    let outcome = GameOutcome.FAIL_RX;
    if (senderG === receiverG) {
      if (temp >= threshold) outcome = GameOutcome.ALARM;
      else outcome = GameOutcome.RX_NO_ALARM; // Normal Rx
    }

    setScenario({
      senderGroup: senderG,
      receiverGroup: receiverG,
      temperature: temp,
      threshold: threshold,
      correctOutcome: outcome
    });
    setGameFeedback(null);
    setIsCorrectLastRound(null);
  };

  useEffect(() => {
    generateScenario();
  }, []);

  const runExperiment = () => {
    setIsAnimating(true);
    setExpResult(null);
    setTimeout(() => {
      setIsAnimating(false);
      if (expSenderGroup !== expReceiverGroup) {
        setExpResult("수신 실패 (그룹 불일치)");
      } else if (expTemp >= expThreshold) {
        setExpResult("경보 발동! (온도 >= 임계값)");
      } else {
        setExpResult("정상 수신 (경보 없음)");
      }
    }, 1500);
  };

  const handleGameGuess = (guess: GameOutcome) => {
    if (!scenario) return;

    let isCorrect = false;
    // Map simplified buttons to outcomes
    // A: Normal Rx (Safe) covers RX_NO_ALARM
    // B: Fail Rx covers FAIL_RX
    // C: Alarm covers ALARM
    // Wait, the prompt asked for A, B, C, D classification. Let's map exactly.
    
    if (guess === scenario.correctOutcome) {
      isCorrect = true;
      const newStreak = stats.streak + 1;
      let newBadges = [...stats.badges];
      
      if (newStreak === 3 && !newBadges.includes("그룹 마스터")) newBadges.push("그룹 마스터");
      if (scenario.correctOutcome === GameOutcome.ALARM && !newBadges.includes("임계값 설계자")) newBadges.push("임계값 설계자");

      updateStats({
        xp: stats.xp + 10 + (newStreak * 2),
        streak: newStreak,
        correctCount: stats.correctCount + 1,
        badges: newBadges
      });
      setGameFeedback(`정답입니다! (+${10 + (newStreak * 2)} XP)`);
    } else {
      updateStats({ streak: 0 });
      let reason = "";
      if (scenario.correctOutcome === GameOutcome.FAIL_RX) reason = "그룹 번호가 달라서 수신할 수 없습니다.";
      else if (scenario.correctOutcome === GameOutcome.ALARM) reason = `온도(${scenario.temperature})가 임계값(${scenario.threshold}) 이상이므로 경보가 울려야 합니다.`;
      else reason = `온도(${scenario.temperature})가 임계값(${scenario.threshold})보다 낮아서 경보는 울리지 않습니다.`;
      
      setGameFeedback(`오답입니다. 이유: ${reason}`);
    }
    setIsCorrectLastRound(isCorrect);
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    generateScenario();
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center bg-gray-200 p-1 rounded-lg w-fit mx-auto">
        <button
          onClick={() => setMode('game')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${mode === 'game' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
        >
          판별 게임 (Challenge)
        </button>
        <button
          onClick={() => setMode('experiment')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${mode === 'experiment' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
        >
          실험실 (Lab)
        </button>
      </div>

      {mode === 'experiment' ? (
        <div className="bg-white rounded-xl shadow-lg border p-6 animate-fadeIn">
          <h2 className="text-xl font-bold mb-6 flex items-center text-indigo-800">
            <Zap className="mr-2" /> 마이크로비트 실험실
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sender */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col items-center">
              <h3 className="font-bold text-blue-700 mb-2">송신 (Sender)</h3>
              <MicrobitDisplay 
                text={`${expTemp}°C`} 
                label={`Group: ${expSenderGroup}`}
                color="bg-blue-800"
              />
              <div className="w-full mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Radio Group</span>
                  <input 
                    type="number" 
                    value={expSenderGroup} 
                    onChange={(e) => setExpSenderGroup(Number(e.target.value))}
                    className="w-16 p-1 border rounded text-center"
                    min={0} max={255}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>온도 설정</span>
                  <input 
                    type="range" 
                    min="0" max="50" 
                    value={expTemp} 
                    onChange={(e) => setExpTemp(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="w-8 text-right">{expTemp}</span>
                </div>
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex flex-col items-center">
              <h3 className="font-bold text-green-700 mb-2">수신 (Receiver)</h3>
              <MicrobitDisplay 
                 icon={expResult?.includes('경보') ? 'skull' : (expResult?.includes('실패') ? 'x' : (expResult ? 'check' : 'none'))}
                 label={`Group: ${expReceiverGroup}`}
                 color="bg-green-800"
              />
               <div className="w-full mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Radio Group</span>
                  <input 
                    type="number" 
                    value={expReceiverGroup} 
                    onChange={(e) => setExpReceiverGroup(Number(e.target.value))}
                    className="w-16 p-1 border rounded text-center"
                    min={0} max={255}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>임계값 (Threshold)</span>
                  <input 
                    type="number" 
                    value={expThreshold} 
                    onChange={(e) => setExpThreshold(Number(e.target.value))}
                    className="w-16 p-1 border rounded text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={runExperiment}
              disabled={isAnimating}
              className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all ${isAnimating ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'}`}
            >
              {isAnimating ? "전송 중..." : "실험 실행 (Send)"}
            </button>
          </div>

          {expResult && !isAnimating && (
            <div className="mt-6 p-4 bg-slate-800 text-white rounded-lg text-center font-mono animate-fadeIn">
              &gt; {expResult}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border p-6 animate-fadeIn">
          {/* Game Header */}
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Round {round} / 10</h2>
              <p className="text-sm text-gray-500">설정을 보고 결과를 예측하세요!</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-orange-500 font-bold">
                <Zap className="w-4 h-4 mr-1" /> {stats.streak} Streak
              </div>
              <div className="flex items-center text-blue-600 font-bold">
                <Award className="w-4 h-4 mr-1" /> {stats.xp} XP
              </div>
            </div>
          </div>

          {scenario && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border text-center">
                <h4 className="font-bold text-gray-600 mb-2">송신 (Sender)</h4>
                <div className="text-sm">Group: <span className="font-mono font-bold text-lg text-blue-600">{scenario.senderGroup}</span></div>
                <div className="text-sm">Temp: <span className="font-mono font-bold text-lg text-red-600">{scenario.temperature}°C</span></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border text-center">
                <h4 className="font-bold text-gray-600 mb-2">수신 (Receiver)</h4>
                <div className="text-sm">Group: <span className="font-mono font-bold text-lg text-blue-600">{scenario.receiverGroup}</span></div>
                <div className="text-sm">Threshold: <span className="font-mono font-bold text-lg text-orange-600">{scenario.threshold}°C</span></div>
              </div>
            </div>
          )}

          {!gameFeedback ? (
            <div className="grid grid-cols-1 gap-3">
               <button onClick={() => handleGameGuess(GameOutcome.FAIL_RX)} className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all font-semibold text-left">
                (B) 수신 실패 <span className="text-xs font-normal text-gray-500 ml-2">그룹 번호가 다름</span>
              </button>
              <button onClick={() => handleGameGuess(GameOutcome.RX_NO_ALARM)} className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all font-semibold text-left">
                (A/C) 정상 수신 (안전) <span className="text-xs font-normal text-gray-500 ml-2">수신됨, 온도 &lt; 임계값</span>
              </button>
              <button onClick={() => handleGameGuess(GameOutcome.ALARM)} className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all font-semibold text-left">
                (D) 경보 발동 <span className="text-xs font-normal text-gray-500 ml-2">수신됨, 온도 ≥ 임계값</span>
              </button>
            </div>
          ) : (
            <div className={`p-6 rounded-lg text-center ${isCorrectLastRound ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} animate-fadeIn`}>
              <div className="text-2xl mb-2">{isCorrectLastRound ? "🎉" : "🤔"}</div>
              <p className="font-bold text-lg mb-4">{gameFeedback}</p>
              <button 
                onClick={nextRound}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-bold shadow-md flex items-center mx-auto"
              >
                다음 라운드 <Target className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameTab;