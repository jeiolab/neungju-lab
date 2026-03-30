import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Pause, RefreshCw, Zap, Shield } from 'lucide-react';

const Simulation: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [strategy, setStrategy] = useState<'risky' | 'safe'>('safe');
  const [data, setData] = useState<{ step: number; reward: number }[]>([]);
  const [totalReward, setTotalReward] = useState(0);
  const [agentPos, setAgentPos] = useState(0); // 0 to 100
  const [message, setMessage] = useState("시뮬레이션을 시작해보세요.");
  const stepRef = useRef(0);

  // Simulation parameters
  const GOAL = 90;
  const TRAP_START = 40;
  const TRAP_END = 60;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        stepRef.current += 1;
        let move = 0;
        let reward = 0;
        let nextPos = agentPos;

        if (strategy === 'risky') {
          // Risky: Moves fast, big penalty risk
          move = 10;
          nextPos = Math.min(agentPos + move, 100);
          
          if (nextPos >= TRAP_START && nextPos <= TRAP_END) {
             // 40% chance of falling in trap
             if (Math.random() < 0.4) {
               reward = -50;
               setMessage("앗! 함정에 빠져 큰 감점을 받았습니다! 😱");
               nextPos = 0; // Reset
             } else {
               reward = 1; // Small step reward
               setMessage("함정 구간을 빠르게 통과 중입니다! 🚀");
             }
          } else if (nextPos >= GOAL) {
            reward = 100;
            setMessage("목표 도착! 대박 보상 획득! 💎");
            nextPos = 0; // Loop
          } else {
            reward = 1;
            setMessage("빠르게 이동 중...");
          }
        } else {
          // Safe: Moves slow, no penalty
          move = 2;
          nextPos = Math.min(agentPos + move, 100);
          
          if (nextPos >= GOAL) {
            reward = 20; // Smaller goal reward
            setMessage("안전하게 목표 도착. 소소한 보상 획득. 🛡️");
            nextPos = 0; // Loop
          } else {
            reward = 0.5;
            setMessage("천천히 안전하게 이동 중...");
          }
        }

        setAgentPos(nextPos);
        setTotalReward(prev => prev + reward);
        setData(prev => {
          const newData = [...prev, { step: stepRef.current, reward: totalReward + reward }];
          if (newData.length > 50) newData.shift(); // Keep chart clean
          return newData;
        });

      }, 500); // Game tick
    }
    return () => clearInterval(interval);
  }, [isPlaying, agentPos, strategy, totalReward]);

  const handleReset = () => {
    setIsPlaying(false);
    setData([]);
    setTotalReward(0);
    setAgentPos(0);
    stepRef.current = 0;
    setMessage("시뮬레이션이 초기화되었습니다.");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Zap className="w-6 h-6 text-yellow-400 mr-2" />
        강화학습 미니 실험실
      </h2>
      <p className="text-gray-400 mb-6">
        에이전트(로봇)가 보상 규칙에 따라 행동을 어떻게 바꾸는지 관찰해보세요.
        <br/>
        <span className="text-sm text-gray-500">*강화학습의 핵심: "보상을 최대화하는 행동을 스스로 선택한다"</span>
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
          <button
            onClick={() => setStrategy('safe')}
            className={`px-4 py-2 rounded-md flex items-center transition-all ${
              strategy === 'safe' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            안전 제일 (작은 보상)
          </button>
          <button
            onClick={() => setStrategy('risky')}
            className={`px-4 py-2 rounded-md flex items-center transition-all ${
              strategy === 'risky' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 mr-2" />
            점수 대박 (위험 감수)
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-white transition-colors"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Visualizer */}
      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mb-6 relative h-32 flex flex-col justify-center">
        <div className="absolute top-2 right-2 text-xs text-gray-500">World View</div>
        
        {/* Track */}
        <div className="w-full h-4 bg-gray-700 rounded-full relative overflow-hidden">
          {/* Trap Zone */}
          <div 
            className="absolute h-full bg-red-900/50 striped-bg" 
            style={{ left: `${TRAP_START}%`, width: `${TRAP_END - TRAP_START}%` }} 
          />
           {/* Goal Zone */}
           <div 
            className="absolute h-full bg-green-900/50" 
            style={{ left: `${GOAL}%`, width: `${100 - GOAL}%` }} 
          />
          {/* Agent */}
          <div 
            className="absolute top-0 w-4 h-4 rounded-full shadow-lg transition-all duration-300 ease-linear transform -translate-x-1/2"
            style={{ 
              left: `${agentPos}%`, 
              backgroundColor: strategy === 'risky' ? '#ef4444' : '#22c55e'
            }}
          >
             <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-lg">🤖</div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
          <span>Start</span>
          <span className="text-red-400">함정 구간 (위험!)</span>
          <span className="text-green-400">목표</span>
        </div>
        
        <div className="mt-4 text-center text-yellow-300 font-medium animate-pulse">
            {message}
        </div>
      </div>

      {/* Graph */}
      <div className="h-64 w-full bg-gray-900 rounded-xl border border-gray-700 p-4">
        <h3 className="text-sm text-gray-400 mb-2">누적 보상 그래프</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="step" hide />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="reward" 
              stroke={strategy === 'risky' ? '#ef4444' : '#22c55e'} 
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg text-sm text-blue-200">
        <strong>3줄 요약:</strong>
        <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><strong>안전 전략:</strong> 보상은 작지만 꾸준히 증가합니다. (위험 회피)</li>
            <li><strong>위험 전략:</strong> 보상이 급격히 늘 수 있지만, 함정에 빠지면 크게 잃습니다.</li>
            <li><strong>강화학습:</strong> 에이전트는 이런 경험을 반복하며 상황에 맞는 <strong>최적의 정책</strong>을 학습합니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default Simulation;