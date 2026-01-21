import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Since we can't use external libs without npm, I'll simulate a random ID
import { motion, AnimatePresence } from 'framer-motion';
import { DATA_ITEMS, MISSIONS, JOB_TITLES, LEVEL_THRESHOLDS, QUIZ_DATA } from './constants';
import { DataItemDef, FloatingItemInstance, GameState, Mission, DataCategory } from './types';
import FloatingIcon from './components/FloatingIcon';
import Dashboard from './components/Dashboard';
import ConceptModal from './components/ConceptModal';
import { CheckCircle2, AlertTriangle, Play, HelpCircle, Trophy } from 'lucide-react';

// Simple UUID generator since we can't depend on 'uuid' package being available in all prompt environments without explicit instructions
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // Game State
  const [items, setItems] = useState<FloatingItemInstance[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 0,
    volume: 0,
    velocity: 0,
    variety: 0,
    isGameActive: false,
    currentMissionIndex: 0,
    showConcept: true, // Show concepts on load
    showQuiz: false,
    feedback: null,
  });

  const timerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  // --- Logic Helpers ---

  const spawnItem = useCallback(() => {
    const randomDef = DATA_ITEMS[Math.floor(Math.random() * DATA_ITEMS.length)];
    const newItem: FloatingItemInstance = {
      ...randomDef,
      instanceId: generateId(),
      x: Math.random() * 80 + 10, // Avoid edges
      y: Math.random() * 60 + 20, // Keep within viewable area mostly
      duration: Math.random() * 2 + 3, // 3-5s float duration
      delay: Math.random(),
    };
    
    setItems((prev) => {
      const newItems = [...prev, newItem];
      if (newItems.length > 15) newItems.shift(); // Increased limit from 8 to 15
      return newItems;
    });
  }, []);

  const handleLevelUp = (newScore: number) => {
    let newLevel = gameState.level;
    if (newScore >= LEVEL_THRESHOLDS[2] && gameState.level < 2) newLevel = 2;
    else if (newScore >= LEVEL_THRESHOLDS[1] && gameState.level < 1) newLevel = 1;

    if (newLevel !== gameState.level) {
      // Trigger Quiz on level up or end game
      if (newLevel === 2) {
         setGameState(prev => ({ ...prev, level: newLevel, showQuiz: true, isGameActive: false }));
      } else {
         setGameState(prev => ({ ...prev, level: newLevel }));
      }
    }
  };

  const onItemClick = (item: FloatingItemInstance) => {
    // Modified: Allow clicking even if feedback is visible
    if (!gameState.isGameActive) return;

    const currentMission = MISSIONS[gameState.currentMissionIndex];
    const isTarget = item.category.includes(currentMission.target);
    const isSmallData = item.category.includes('SmallData');

    let feedbackMsg = "";
    let isCorrect = false;

    if (isSmallData) {
      isCorrect = false;
      feedbackMsg = "이건 엑셀 파일이라 용량이 작아서 기존 방식(PC)으로도 처리가 가능해요. 빅데이터가 아닙니다!";
      // Penalty? Maybe just no points.
    } else if (isTarget) {
      isCorrect = true;
      if (currentMission.target === 'Volume') feedbackMsg = "맞아요! 테라바이트급 이상의 거대한 데이터는 규모(Volume)가 핵심이죠!";
      else if (currentMission.target === 'Velocity') feedbackMsg = "정답! 실시간으로 생성되는 센서 데이터는 속도(Velocity)가 중요해요!";
      else if (currentMission.target === 'Variety') feedbackMsg = "훌륭해요! 영상이나 텍스트같은 비정형 데이터는 다양성(Variety)이 특징이죠!";
    } else {
      isCorrect = false;
      feedbackMsg = `아쉬워요! 이 데이터는 ${currentMission.target} 특징보다는 다른 특징이 더 강해요.`;
    }

    // Update State
    setGameState(prev => {
      const newScore = isCorrect ? prev.score + 10 : Math.max(0, prev.score - 5);
      
      // Update specific stats based on item category for visuals
      let dVolume = prev.volume;
      let dVelocity = prev.velocity;
      let dVariety = prev.variety;

      if (isCorrect) {
        if (item.category.includes('Volume')) dVolume += 10;
        if (item.category.includes('Velocity')) dVelocity += 50;
        if (item.category.includes('Variety')) dVariety += 10;
      }

      return {
        ...prev,
        score: newScore,
        volume: dVolume,
        velocity: dVelocity,
        variety: dVariety,
        feedback: { visible: true, isCorrect, message: feedbackMsg }
      };
    });

    handleLevelUp(gameState.score + (isCorrect ? 10 : -5));
    
    // Remove item
    setItems(prev => prev.filter(i => i.instanceId !== item.instanceId));

    // Force spawn a new item immediately (Immediate Gratification)
    spawnItem();
    
    // Clear previous timer if exists to reset the duration
    if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
    }

    // Auto-hide feedback
    feedbackTimerRef.current = window.setTimeout(() => {
      setGameState(prev => ({ ...prev, feedback: null }));
    }, 1200);

    // Switch mission occasionally
    if (isCorrect && Math.random() > 0.6) {
        setGameState(prev => ({
            ...prev,
            currentMissionIndex: (prev.currentMissionIndex + 1) % MISSIONS.length
        }));
    }
  };

  // --- Effects ---

  // Game Loop
  useEffect(() => {
    if (gameState.isGameActive && !gameState.showConcept && !gameState.showQuiz) {
      timerRef.current = window.setInterval(spawnItem, 800); // Increased speed: 2000ms -> 800ms
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isGameActive, gameState.showConcept, gameState.showQuiz, spawnItem]);

  // --- Handlers ---

  const startGame = () => {
    // Spawn 5 items initially so user doesn't wait
    const initialItems = Array.from({ length: 5 }).map(() => {
        const randomDef = DATA_ITEMS[Math.floor(Math.random() * DATA_ITEMS.length)];
        return {
          ...randomDef,
          instanceId: generateId(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          duration: Math.random() * 2 + 3,
          delay: Math.random(),
        };
    });

    setGameState(prev => ({ ...prev, isGameActive: true, showConcept: false, showQuiz: false, score: 0, level: 0, volume: 0, velocity: 0, variety: 0 }));
    setItems(initialItems);
  };

  const handleQuizAnswer = (idx: number) => {
      const isCorrect = idx === QUIZ_DATA.answerIndex;
      if (isCorrect) {
          alert("정답입니다! 당신은 진정한 데이터 마스터!");
      } else {
          alert("틀렸습니다. 다시 한번 생각해보세요.");
      }
      setGameState(prev => ({...prev, showQuiz: false, isGameActive: false})); // End game state
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden font-sans">
      {/* Background Effect: Cyber Ocean */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] z-0"></div>
      
      {/* Dashboard */}
      <Dashboard 
        score={gameState.score}
        level={gameState.level}
        title={JOB_TITLES[gameState.level]}
        volume={gameState.volume}
        velocity={gameState.velocity}
        variety={gameState.variety}
      />

      {/* Main Game Stage */}
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-24">
        
        {/* Mission Banner */}
        {gameState.isGameActive && !gameState.showQuiz && (
            <motion.div 
                key={gameState.currentMissionIndex}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-cyan-900/80 border border-cyan-500/50 backdrop-blur-md px-8 py-3 rounded-full mb-8 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
                <h2 className="text-xl font-bold text-cyan-100 flex items-center gap-3">
                    <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                    {MISSIONS[gameState.currentMissionIndex].title}
                </h2>
                <p className="text-xs text-cyan-300 text-center mt-1">{MISSIONS[gameState.currentMissionIndex].description}</p>
            </motion.div>
        )}

        {/* Floating Items Area */}
        <div className="relative w-full h-[60vh]">
            <AnimatePresence>
                {items.map(item => (
                    <FloatingIcon key={item.instanceId} item={item} onClick={onItemClick} />
                ))}
            </AnimatePresence>
        </div>

        {/* Start Button (if inactive and not showing modals) */}
        {!gameState.isGameActive && !gameState.showConcept && !gameState.showQuiz && (
            <div className="absolute z-20 flex flex-col items-center gap-4">
                 <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 drop-shadow-2xl">
                    BIG DATA MASTER
                </h1>
                <p className="text-slate-400 mb-8">데이터의 바다를 탐험하며 3V를 마스터하세요!</p>
                <button 
                    onClick={startGame}
                    className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(8,145,178,0.5)] flex items-center gap-3"
                >
                    <Play className="fill-current" />
                    탐험 시작
                </button>
                <button 
                    onClick={() => setGameState(prev => ({...prev, showConcept: true}))}
                    className="text-slate-400 hover:text-white flex items-center gap-2 mt-4 text-sm"
                >
                    <HelpCircle size={16} /> 게임 방법 다시보기
                </button>
            </div>
        )}

        {/* Feedback Popup */}
        <AnimatePresence>
          {gameState.feedback && gameState.feedback.visible && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute bottom-10 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-l-4 max-w-lg ${
                gameState.feedback.isCorrect 
                  ? 'bg-slate-800 border-green-500 text-green-100' 
                  : 'bg-slate-800 border-red-500 text-red-100'
              }`}
            >
              {gameState.feedback.isCorrect ? <CheckCircle2 size={32} className="text-green-500" /> : <AlertTriangle size={32} className="text-red-500" />}
              <p className="font-medium text-lg leading-snug">{gameState.feedback.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <ConceptModal isOpen={gameState.showConcept} onClose={() => setGameState(prev => ({ ...prev, showConcept: false }))} />

      {/* Quiz Modal */}
      <AnimatePresence>
        {gameState.showQuiz && (
            <motion.div 
                className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-xl w-full text-center">
                    <Trophy className="mx-auto text-yellow-400 mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-white mb-2">승진 심사: CTO 자격 시험</h2>
                    <p className="text-slate-400 mb-6">마지막 관문입니다. 다음 문제를 맞춰주세요.</p>
                    
                    <div className="bg-slate-800 p-6 rounded-xl mb-6">
                        <h3 className="text-xl font-bold text-cyan-300">{QUIZ_DATA.question}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {QUIZ_DATA.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuizAnswer(idx)}
                                className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-left font-medium"
                            >
                                {idx + 1}. {option}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;