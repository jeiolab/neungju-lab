import React, { useState, useEffect, useCallback } from 'react';
import { Scenario, MethodType, UserStats } from '../types';
import { generateScenario } from '../services/geminiService';
import { Wifi, Bluetooth, Nfc, Cloud, Smartphone, Cable, ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface GameModeProps {
  stats: UserStats;
  updateStats: (newStats: UserStats) => void;
}

const GameMode: React.FC<GameModeProps> = ({ stats, updateStats }) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'feedback'>('playing');
  const [selectedMethod, setSelectedMethod] = useState<MethodType | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const methods: MethodType[] = ['Wi-Fi', 'Bluetooth', 'NFC', 'Cloud', 'Mobile', 'Wired'];

  const loadNewScenario = useCallback(async () => {
    setLoading(true);
    setGameState('playing');
    setSelectedMethod(null);
    setIsCorrect(false);
    
    // In a real app, we might mix static scenarios with dynamic ones to save API costs
    // For this demo, we try Gemini first, falling back to a mock if key is missing/error
    const newScenario = await generateScenario('easy');
    
    if (newScenario) {
      setScenario(newScenario);
    } else {
        // Fallback scenario
        setScenario({
            id: 'fallback-1',
            description: "친구와 카페에 있다. 3GB 짜리 여행 동영상을 친구의 노트북으로 가장 빨리 옮기고 싶다. 둘 다 외장하드는 없지만 C-to-C 케이블은 가지고 있다.",
            correctMethod: 'Wired',
            reasoning: "대용량 파일(3GB)을 가장 빠르고 안정적으로 전송하는 방법은 유선 연결입니다. 무선은 시간이 오래 걸릴 수 있습니다.",
            tags: ['capacity', 'speed']
        });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!scenario) loadNewScenario();
  }, [scenario, loadNewScenario]);

  const handleSelection = (method: MethodType) => {
    if (!scenario) return;
    
    const correct = method === scenario.correctMethod;
    setSelectedMethod(method);
    setIsCorrect(correct);
    setGameState('feedback');

    // Update Stats
    const newStats = { ...stats };
    newStats.totalPlayed += 1;
    
    if (correct) {
      newStats.score += 10;
      newStats.streak += 1;
      newStats.correctCount += 1;
      
      // Badges
      if (newStats.streak === 5 && !newStats.badges.includes('근거왕')) {
          newStats.badges.push('근거왕');
      }
      if (newStats.totalPlayed >= 10 && !newStats.badges.includes('성실한 플레이어')) {
          newStats.badges.push('성실한 플레이어');
      }
    } else {
      newStats.streak = 0;
      // Track weakness
      scenario.tags.forEach(tag => {
          newStats.weaknesses[tag] = (newStats.weaknesses[tag] || 0) + 1;
      });
    }

    newStats.history.push({
        scenarioId: scenario.id,
        userChoice: method,
        isCorrect: correct,
        timestamp: Date.now()
    });
    
    // Save to local storage
    localStorage.setItem('transfer_classifier_v1', JSON.stringify(newStats));
    updateStats(newStats);
  };

  if (loading || !scenario) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
        <p>새로운 상황을 생성 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Scenario Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 overflow-hidden mb-6 relative">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Situation Card</h3>
          <span className="bg-indigo-500 px-2 py-0.5 rounded text-xs">Round {stats.totalPlayed + 1}</span>
        </div>
        <div className="p-8">
            <p className="text-xl font-medium leading-relaxed text-slate-800">
                "{scenario.description}"
            </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {methods.map((method) => (
          <button
            key={method}
            disabled={gameState === 'feedback'}
            onClick={() => handleSelection(method)}
            className={`
                h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all
                ${gameState === 'feedback' 
                    ? (method === scenario.correctMethod 
                        ? 'bg-green-100 border-green-500 text-green-700' 
                        : (method === selectedMethod ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 border-gray-200 opacity-50')
                      )
                    : 'bg-white border-slate-200 hover:border-indigo-500 hover:shadow-md hover:bg-indigo-50 text-slate-600'
                }
            `}
          >
            <span className="font-bold text-lg">{method}</span>
          </button>
        ))}
      </div>

      {/* Feedback Modal / Section */}
      {gameState === 'feedback' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 animate-fade-in-up">
            <div className={`flex items-center mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? <CheckCircle2 className="w-8 h-8 mr-2" /> : <XCircle className="w-8 h-8 mr-2" />}
                <h2 className="text-2xl font-bold">{isCorrect ? '정답입니다! (+10점)' : '아쉽네요!'}</h2>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <p className="text-slate-700 mb-2 font-bold">정답 해설:</p>
                <p className="text-slate-600 leading-relaxed">{scenario.reasoning}</p>
            </div>

            <button 
                onClick={loadNewScenario}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors"
            >
                다음 라운드 도전 <ArrowRight className="w-5 h-5 ml-2" />
            </button>
        </div>
      )}
    </div>
  );
};

export default GameMode;
