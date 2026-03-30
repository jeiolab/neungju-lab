import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, FastForward, Settings, MousePointerClick, Save } from 'lucide-react';
import { CellType, Position, QTable, Action, SimulationStats } from '../../types';
import { ACTIONS, GRID_ROWS, GRID_COLS, REWARDS, MAX_STEPS_PER_EPISODE, INITIAL_EPSILON, MIN_EPSILON, EPSILON_DECAY, LEARNING_RATE, DISCOUNT_FACTOR } from '../../constants';
import { Badge } from '../ui/Badge';

// Helper to create key for Q-Table
const getKey = (pos: Position) => `${pos.row},${pos.col}`;

const SimulationTab: React.FC = () => {
  // --- State ---
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [agentPos, setAgentPos] = useState<Position>({ row: 0, col: 0 });
  const [stats, setStats] = useState<SimulationStats>({
    episode: 0,
    totalReward: 0,
    steps: 0,
    epsilon: INITIAL_EPSILON,
    wins: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState<number>(1); // 1 = slow (visual), 10 = fast, 100 = warp
  const [editMode, setEditMode] = useState<CellType | null>(null);
  const [showQValues, setShowQValues] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);

  // Refs for logic that doesn't need immediate re-render or avoids stale closures
  const qTableRef = useRef<QTable>({});
  const agentPosRef = useRef<Position>({ row: 0, col: 0 });
  const statsRef = useRef<SimulationStats>(stats);
  const intervalRef = useRef<number | null>(null);

  // --- Initialization ---
  const initGrid = useCallback(() => {
    const newGrid = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(CellType.EMPTY));
    newGrid[0][0] = CellType.START;
    newGrid[GRID_ROWS - 1][GRID_COLS - 1] = CellType.GOAL;
    newGrid[1][1] = CellType.WALL;
    newGrid[2][1] = CellType.WALL;
    newGrid[1][3] = CellType.DANGER;
    newGrid[3][2] = CellType.BONUS;
    
    setGrid(newGrid);
    setAgentPos({ row: 0, col: 0 });
    agentPosRef.current = { row: 0, col: 0 };
    qTableRef.current = {};
    
    // Reset stats
    const newStats = {
      episode: 0,
      totalReward: 0,
      steps: 0,
      epsilon: INITIAL_EPSILON,
      wins: 0,
    };
    setStats(newStats);
    statsRef.current = newStats;
    setHasBadge(false);
  }, []);

  useEffect(() => {
    initGrid();
    return () => stopSimulation();
  }, [initGrid]);

  // --- Q-Learning Engine ---

  const getBestAction = (pos: Position): Action => {
    const key = getKey(pos);
    if (!qTableRef.current[key]) {
      qTableRef.current[key] = { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };
    }
    const actions = qTableRef.current[key];
    return Object.keys(actions).reduce((a, b) => actions[a as Action] > actions[b as Action] ? a : b) as Action;
  };

  const chooseAction = (pos: Position, epsilon: number): Action => {
    // Exploration
    if (Math.random() < epsilon) {
      return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    }
    // Exploitation
    return getBestAction(pos);
  };

  const step = (action: Action, currentPos: Position): { nextPos: Position, reward: number, done: boolean, win: boolean } => {
    let { row, col } = currentPos;
    
    if (action === 'UP') row--;
    if (action === 'DOWN') row++;
    if (action === 'LEFT') col--;
    if (action === 'RIGHT') col++;

    // Boundary check & Wall check
    if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS || grid[row][col] === CellType.WALL) {
      return { nextPos: currentPos, reward: REWARDS[CellType.WALL], done: false, win: false };
    }

    const type = grid[row][col];
    const reward = REWARDS[type] || REWARDS[CellType.EMPTY];
    const done = type === CellType.GOAL || type === CellType.DANGER;
    const win = type === CellType.GOAL;

    return { nextPos: { row, col }, reward, done, win };
  };

  const updateQTable = (prevPos: Position, action: Action, reward: number, nextPos: Position) => {
    const prevKey = getKey(prevPos);
    const nextKey = getKey(nextPos);

    if (!qTableRef.current[prevKey]) qTableRef.current[prevKey] = { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };
    if (!qTableRef.current[nextKey]) qTableRef.current[nextKey] = { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };

    const oldQ = qTableRef.current[prevKey][action];
    const maxNextQ = Math.max(...(Object.values(qTableRef.current[nextKey]) as number[]));

    const newQ = (1 - LEARNING_RATE) * oldQ + LEARNING_RATE * (reward + DISCOUNT_FACTOR * maxNextQ);
    qTableRef.current[prevKey][action] = newQ;
  };

  const runEpisodeStep = () => {
    const currentStats = statsRef.current;
    
    // Reset if episode ended previously
    if (currentStats.steps >= MAX_STEPS_PER_EPISODE || 
        (grid[agentPosRef.current.row][agentPosRef.current.col] === CellType.GOAL) ||
        (grid[agentPosRef.current.row][agentPosRef.current.col] === CellType.DANGER)) {
        
        // Start new episode
        agentPosRef.current = { row: 0, col: 0 }; // Find START
        // Find actual start position if user moved it
        for(let r=0; r<GRID_ROWS; r++) {
            for(let c=0; c<GRID_COLS; c++) {
                if(grid[r][c] === CellType.START) agentPosRef.current = {row: r, col: c};
            }
        }

        statsRef.current = {
            ...currentStats,
            episode: currentStats.episode + 1,
            epsilon: Math.max(MIN_EPSILON, currentStats.epsilon * EPSILON_DECAY),
            steps: 0,
            totalReward: 0 // Reset for new episode display
        };
        
        if (currentStats.wins > 10 && !hasBadge) setHasBadge(true);
        setAgentPos(agentPosRef.current);
        setStats({...statsRef.current});
        return;
    }

    const pos = agentPosRef.current;
    const action = chooseAction(pos, currentStats.epsilon);
    const { nextPos, reward, done, win } = step(action, pos);

    updateQTable(pos, action, reward, nextPos);

    agentPosRef.current = nextPos;
    statsRef.current = {
        ...statsRef.current,
        steps: statsRef.current.steps + 1,
        totalReward: statsRef.current.totalReward + reward,
        wins: win ? statsRef.current.wins + 1 : statsRef.current.wins
    };

    setAgentPos(nextPos);
    setStats({...statsRef.current});
  };

  const runBatchEpisodes = (count: number) => {
    let loops = 0;
    while(loops < count) {
        // Run logic without React state updates for speed
        // This is a simplified version of runEpisodeStep for batch processing
        // We just run until one episode finishes
        
        let batchPos = agentPosRef.current;
        // Find start if needed
        if (grid[batchPos.row][batchPos.col] === CellType.GOAL || grid[batchPos.row][batchPos.col] === CellType.DANGER) {
             for(let r=0; r<GRID_ROWS; r++) {
                for(let c=0; c<GRID_COLS; c++) {
                    if(grid[r][c] === CellType.START) batchPos = {row: r, col: c};
                }
            }
        }

        let steps = 0;
        let epReward = 0;
        let epDone = false;

        while (!epDone && steps < MAX_STEPS_PER_EPISODE) {
            const action = chooseAction(batchPos, statsRef.current.epsilon);
            const { nextPos, reward, done, win } = step(action, batchPos);
            updateQTable(batchPos, action, reward, nextPos);
            batchPos = nextPos;
            epReward += reward;
            steps++;
            epDone = done;
            if (win) statsRef.current.wins++;
        }
        
        statsRef.current.episode++;
        statsRef.current.epsilon = Math.max(MIN_EPSILON, statsRef.current.epsilon * EPSILON_DECAY);
        statsRef.current.totalReward = epReward; // Show last ep reward
        
        agentPosRef.current = batchPos; // Update global ref position
        loops++;
    }
    
    // Check for badge
    if (statsRef.current.wins > 10 && !hasBadge) setHasBadge(true);

    // Sync state once after batch
    setAgentPos(agentPosRef.current);
    setStats({...statsRef.current});
  };


  // --- Game Loop ---
  useEffect(() => {
    if (isRunning) {
      if (speed >= 50) {
        // Warp speed: Run batch every tick
        intervalRef.current = window.setInterval(() => {
            runBatchEpisodes(10);
        }, 100);
      } else {
        // Visual speed
        const ms = speed === 1 ? 300 : 50;
        intervalRef.current = window.setInterval(() => {
          runEpisodeStep();
        }, ms);
      }
    } else {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning, speed, grid]); // depend on grid to ensure step function sees current grid

  const toggleSimulation = () => setIsRunning(!isRunning);
  const stopSimulation = () => setIsRunning(false);
  const resetSimulation = () => {
    stopSimulation();
    initGrid();
  };

  const handleCellClick = (r: number, c: number) => {
    if (isRunning) return;
    if (editMode) {
      const newGrid = [...grid];
      // Prevent removing Start/Goal if there's only one, but simplified here: allow replacement
      // Ensure logic: only one start/goal ideally, but for simplicity let's just toggle
      newGrid[r][c] = editMode;
      setGrid(newGrid);
    }
  };

  const getCellColor = (type: CellType) => {
    switch (type) {
      case CellType.WALL: return 'bg-slate-800';
      case CellType.START: return 'bg-blue-200';
      case CellType.GOAL: return 'bg-green-200';
      case CellType.DANGER: return 'bg-red-200';
      case CellType.BONUS: return 'bg-yellow-200';
      default: return 'bg-white';
    }
  };

  const getCellIcon = (type: CellType) => {
    switch (type) {
        case CellType.WALL: return '';
        case CellType.START: return '🏁';
        case CellType.GOAL: return '⛳️';
        case CellType.DANGER: return '🔥';
        case CellType.BONUS: return '⚡️';
        default: return '';
    }
  };

  // Render Arrow for Best Policy
  const renderPolicyArrow = (r: number, c: number) => {
    if (!showQValues || grid[r][c] === CellType.WALL || grid[r][c] === CellType.GOAL || grid[r][c] === CellType.DANGER) return null;
    const key = `${r},${c}`;
    const q = qTableRef.current[key];
    if (!q) return null;

    // Find best action
    const bestAction = Object.keys(q).reduce((a, b) => q[a as Action] > q[b as Action] ? a : b) as Action;
    const rotation = { UP: '0deg', RIGHT: '90deg', DOWN: '180deg', LEFT: '270deg' }[bestAction];
    
    // Only show if there is some learning (values aren't all 0)
    if(Object.values(q).every(v => v === 0)) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none" style={{ transform: `rotate(${rotation})` }}>
            <span className="text-2xl font-bold text-slate-800">↑</span>
        </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full animate-fadeIn">
      {/* --- Left Panel: Visuals --- */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 rounded-xl p-4 shadow-inner relative overflow-hidden">
        
        {hasBadge && (
            <div className="absolute top-4 left-4 animate-bounce">
                <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500 shadow-lg px-3 py-1 text-sm">
                    🏆 보상 설계자 배지 획득!
                </Badge>
            </div>
        )}

        <div className="grid gap-1 mb-6 p-4 bg-white rounded-lg shadow-xl" 
             style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(3rem, 1fr))` }}>
          {grid.map((row, r) => (
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`
                  w-12 h-12 sm:w-16 sm:h-16 border-2 rounded-lg flex items-center justify-center text-2xl relative transition-all duration-200 cursor-pointer
                  ${getCellColor(cell)}
                  ${r === agentPos.row && c === agentPos.col ? 'border-brand-600 ring-4 ring-brand-200 z-10' : 'border-slate-200'}
                  ${editMode && !isRunning ? 'hover:opacity-75 hover:scale-105' : ''}
                `}
              >
                {/* Background Icon */}
                <span className="z-0">{getCellIcon(cell)}</span>
                
                {/* Policy Arrow */}
                {renderPolicyArrow(r, c)}

                {/* Agent Overlay */}
                {r === agentPos.row && c === agentPos.col && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 animate-pulse">
                    <span className="text-4xl drop-shadow-md">🤖</span>
                  </div>
                )}
              </div>
            ))
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center max-w-md">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider w-full text-center mb-1">맵 편집 도구</span>
            {[
                { label: '지우기', type: CellType.EMPTY, icon: '⬜️' },
                { label: '벽', type: CellType.WALL, icon: '⬛️' },
                { label: '위험', type: CellType.DANGER, icon: '🔥' },
                { label: '보상', type: CellType.BONUS, icon: '⚡️' },
            ].map(tool => (
                <button
                    key={tool.label}
                    onClick={() => setEditMode(tool.type)}
                    disabled={isRunning}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors
                        ${editMode === tool.type ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    <span>{tool.icon}</span> {tool.label}
                </button>
            ))}
        </div>
      </div>

      {/* --- Right Panel: Controls & Stats --- */}
      <div className="w-full lg:w-80 space-y-6">
        
        {/* Stats Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Settings size={20} /> 학습 현황
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-slate-500">에피소드 (반복)</span>
                    <span className="font-mono font-bold">{stats.episode}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">현재 보상 합계</span>
                    <span className={`font-mono font-bold ${stats.totalReward >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.totalReward}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">성공 횟수</span>
                    <span className="font-mono font-bold text-blue-600">{stats.wins}</span>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">탐험률 (Epsilon)</span>
                        <span className="font-mono">{stats.epsilon.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                            className="bg-purple-500 h-full transition-all duration-300" 
                            style={{ width: `${stats.epsilon * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 text-right">
                        {stats.epsilon > 0.3 ? "새로운 길 찾는 중..." : "아는 길로 가는 중..."}
                    </p>
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">제어 패널</h3>
            
            <div className="flex gap-2">
                {!isRunning ? (
                    <button 
                        onClick={toggleSimulation}
                        className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Play size={18} /> 시작
                    </button>
                ) : (
                    <button 
                        onClick={toggleSimulation}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Pause size={18} /> 일시정지
                    </button>
                )}
                <button 
                    onClick={resetSimulation}
                    className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    title="초기화"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex justify-between">
                    <span>학습 속도</span>
                    <span className="text-brand-600 font-bold">{speed >= 50 ? '초고속 (Batch)' : `${speed}x`}</span>
                </label>
                <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1" // simplified step, handled in logic
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input 
                    type="checkbox" 
                    id="showQ"
                    checked={showQValues}
                    onChange={(e) => setShowQValues(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <label htmlFor="showQ" className="text-sm text-slate-600 cursor-pointer select-none">
                    학습된 경로 화살표 보기
                </label>
            </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <p>💡 <strong>팁:</strong> '초고속'으로 설정하면 로봇이 순식간에 수백 번 훈련하여 최적 경로를 찾아냅니다.</p>
        </div>

      </div>
    </div>
  );
};

export default SimulationTab;