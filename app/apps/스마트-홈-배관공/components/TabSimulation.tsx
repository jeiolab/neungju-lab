import React, { useState, useEffect } from 'react';
import { GameItem, LevelConfig, Rank } from '../types';
import { LEVELS } from '../constants';
import { Play, RotateCcw, CheckCircle2, AlertTriangle, Wrench, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Dynamic Icon Component
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : <div className={className} />;
};

const TabSimulation: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [slots, setSlots] = useState<(GameItem | null)[]>([]);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [playerRank, setPlayerRank] = useState<Rank>(Rank.BRONZE);
  const [score, setScore] = useState(0);

  const level = LEVELS[currentLevelIdx];

  useEffect(() => {
    resetLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelIdx]);

  useEffect(() => {
    if (score >= 200) setPlayerRank(Rank.GOLD);
    else if (score >= 100) setPlayerRank(Rank.SILVER);
    else setPlayerRank(Rank.BRONZE);
  }, [score]);

  const resetLevel = () => {
    setSlots(Array(level.slots).fill(null));
    setIsRunning(false);
    setMessage({ text: '부품을 알맞은 순서대로 배치해보세요.', type: 'info' });
    setSelectedItem(null);
  };

  const handleSlotClick = (index: number) => {
    if (isRunning) return;
    
    if (selectedItem) {
      // Place item
      const newSlots = [...slots];
      newSlots[index] = selectedItem;
      setSlots(newSlots);
      setSelectedItem(null);
    } else {
      // Remove item if clicked and empty hand
      if (slots[index]) {
        const newSlots = [...slots];
        newSlots[index] = null;
        setSlots(newSlots);
      }
    }
  };

  const handleTestConnection = () => {
    // Check if all slots are filled
    if (slots.some(s => s === null)) {
      setMessage({ text: '모든 슬롯을 채워주세요!', type: 'error' });
      return;
    }

    setIsRunning(true);

    // Validate sequence
    let isValid = true;
    let errorMsg = '';

    for (let i = 0; i < level.slots; i++) {
      const item = slots[i];
      const requiredType = level.requiredSequence[i];
      
      if (item?.type !== requiredType) {
        isValid = false;
        errorMsg = `${i + 1}번째 단계는 '${requiredType}' 장치가 필요합니다.`;
        break;
      }
    }

    if (isValid) {
      setTimeout(() => {
        setMessage({ text: '연결 성공! 시스템이 정상 작동합니다.', type: 'success' });
        setScore(prev => prev + 50);
      }, 1500); // Wait for animation
    } else {
      setTimeout(() => {
        setIsRunning(false);
        setMessage({ text: `연결 실패: ${errorMsg}`, type: 'error' });
      }, 1500);
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
        alert("모든 레벨을 완료했습니다!");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto fade-in">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{level.title}</h2>
          <p className="text-sm text-slate-500">{level.scenario}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${level.difficulty === '초보 기사' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {level.difficulty}
            </span>
            <span className="text-xs text-slate-400">목표: {level.description}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400">현재 등급</p>
            <p className={`font-bold flex items-center gap-1 ${
              playerRank === Rank.GOLD ? 'text-yellow-600' : 
              playerRank === Rank.SILVER ? 'text-slate-400' : 'text-amber-700'
            }`}>
              <Wrench className="w-4 h-4" /> {playerRank}
            </p>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-lg">
             <span className="text-slate-500 text-xs">점수</span>
             <p className="text-xl font-bold text-blue-600">{score}</p>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left: Inventory */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-lg border border-slate-200 h-fit">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>🧰</span> 부품 상자
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {level.availableItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                  selectedItem?.id === item.id 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <DynamicIcon name={item.icon} className="w-8 h-8 text-slate-600 mb-2" />
                <span className="text-xs font-medium text-center text-slate-700">{item.name}</span>
                <span className="text-[10px] text-slate-400 text-center mt-1">{item.type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Pipeline Slots */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-800 rounded-xl p-6 md:p-8 min-h-[300px] relative flex flex-col justify-center items-center shadow-inner overflow-hidden">
            
            {/* Connection Pipes Background */}
            <div className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 bg-slate-700 z-0" />
            
            {/* Animated Flow */}
            {isRunning && message?.type !== 'error' && (
              <div className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 z-0 pipe-flow opacity-80" />
            )}

            {/* Slots */}
            <div className="relative z-10 flex w-full justify-between items-center gap-2 overflow-x-auto pb-4 md:pb-0">
              {slots.map((slot, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="text-slate-400 text-xs mb-1 font-mono">STEP {idx + 1}</div>
                    <button
                      onClick={() => handleSlotClick(idx)}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-xl border-4 flex items-center justify-center relative bg-slate-100 transition-all ${
                        slot 
                          ? 'border-blue-500 shadow-lg scale-100' 
                          : 'border-slate-600 border-dashed hover:border-slate-400 opacity-60'
                      }`}
                    >
                      {slot ? (
                         <div className="flex flex-col items-center p-2">
                           <DynamicIcon name={slot.icon} className="w-8 h-8 text-blue-600" />
                           <span className="text-[10px] text-center font-bold mt-1 leading-tight">{slot.name}</span>
                         </div>
                      ) : (
                        <div className="text-slate-400 text-xs text-center px-1">
                            {selectedItem ? '클릭하여 배치' : '빈 슬롯'}
                        </div>
                      )}
                    </button>
                  </div>
                  {idx < slots.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-slate-500 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Status Message */}
            <div className="absolute bottom-4 left-0 w-full text-center px-4">
               {message && (
                 <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce ${
                   message.type === 'success' ? 'bg-green-500 text-white' : 
                   message.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-200'
                 }`}>
                   {message.type === 'success' && <CheckCircle2 className="w-4 h-4"/>}
                   {message.type === 'error' && <AlertTriangle className="w-4 h-4"/>}
                   {message.text}
                 </div>
               )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
             <button 
               onClick={resetLevel}
               className="flex items-center gap-2 text-slate-500 hover:text-slate-800 px-4 py-2"
             >
               <RotateCcw className="w-4 h-4" /> 다시 하기
             </button>

             <div className="flex gap-3">
               {!isRunning || message?.type === 'error' ? (
                 <button
                    onClick={handleTestConnection}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-md transition-colors"
                 >
                   <Play className="w-5 h-5 fill-current" /> 연결 테스트
                 </button>
               ) : (
                  currentLevelIdx < LEVELS.length - 1 && (
                    <button
                        onClick={nextLevel}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-md animate-pulse"
                    >
                        다음 레벨로 이동 <ArrowRight className="w-5 h-5" />
                    </button>
                  )
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;