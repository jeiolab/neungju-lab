import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, INITIAL_RULES } from '../constants';
import { CellType, GridCell, RobotState, Direction, LogicRule, RobotAction } from '../types';
import { Play, Pause, RotateCw, RotateCcw, Trash2, MapPin, Grid as GridIcon, Zap, ArrowRight, Save, Cpu, Settings } from 'lucide-react';

const getNextPosition = (x: number, y: number, dir: Direction): { x: number; y: number } => {
  let nx = x;
  let ny = y;
  if (dir === 0) ny -= 1; // Up
  if (dir === 1) nx += 1; // Right
  if (dir === 2) ny += 1; // Down
  if (dir === 3) nx -= 1; // Left
  return { x: nx, y: ny };
};

const TabSimulation: React.FC = () => {
  // Grid State: 5x5
  const [grid, setGrid] = useState<CellType[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'))
  );

  // Robot State
  const [robot, setRobot] = useState<RobotState>({
    x: 0,
    y: 0,
    direction: 1, // Start facing Right
    score: 0,
    log: [],
    lastThought: "명령을 기다리는 중...",
    isActive: false,
  });

  // Rules State
  const [rules, setRules] = useState<LogicRule[]>(INITIAL_RULES);
  const [editMode, setEditMode] = useState<CellType>('wall');

  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper to check boundaries
  const isValidPos = (x: number, y: number) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;

  // Sensor: What is in front?
  const getFrontCell = useCallback((): CellType => {
    const { x, y } = getNextPosition(robot.x, robot.y, robot.direction);
    if (!isValidPos(x, y)) return 'wall'; // Treat edges as walls
    return grid[y][x];
  }, [grid, robot.x, robot.y, robot.direction]);

  // Main Simulation Step
  const step = useCallback(() => {
    setRobot(prev => {
      // 1. Perception
      const { x, y, direction } = prev;
      const frontPos = getNextPosition(x, y, direction);
      let percept: CellType = 'empty';

      if (!isValidPos(frontPos.x, frontPos.y)) {
        percept = 'wall';
      } else {
        percept = grid[frontPos.y][frontPos.x];
      }

      // 2. Reasoning (Match rules)
      const matchedRule = rules.find(r => r.condition === percept) || { condition: 'empty', action: 'stop' };
      const action = matchedRule.action;

      let nextX = x;
      let nextY = y;
      let nextDir = direction;
      let thought = `인식: [${percept === 'wall' ? '장애물' : percept === 'dust' ? '먼지' : '빈 공간'}] -> 판단: `;
      let logEntry = '';
      let scoreToAdd = 0;

      // 3. Action
      switch (action) {
        case 'move':
          thought += "전진!";
          if (percept !== 'wall') {
             nextX = frontPos.x;
             nextY = frontPos.y;
          } else {
             thought += " (충돌!)";
          }
          break;
        case 'turnLeft':
          thought += "좌회전";
          nextDir = (direction + 3) % 4 as Direction;
          break;
        case 'turnRight':
          thought += "우회전";
          nextDir = (direction + 1) % 4 as Direction;
          break;
        case 'clean':
          thought += "청소 시작";
          // Logic for cleaning handled below in side-effect
          break;
        case 'stop':
          thought += "정지";
          break;
      }

      // Check for cleaning side effect
      if (action === 'clean' && percept === 'dust' && isValidPos(frontPos.x, frontPos.y)) {
         // We need to update grid state. We can't do it inside setRobot easily without effect or combining state.
         // For simplicity, we'll queue a grid update via a ref or secondary state, but here we can just do it next render?
         // No, we need to do it now. We'll use a functional update on Grid if needed, or update it here.
         // React state updates are batched.
         // Let's trigger grid update separately.
         setTimeout(() => {
             setGrid(currentGrid => {
                 const newGrid = [...currentGrid.map(row => [...row])];
                 newGrid[frontPos.y][frontPos.x] = 'empty';
                 return newGrid;
             });
         }, 0);
         scoreToAdd = 10;
         thought += " (먼지 제거 성공! +10점)";
      }

      return {
        ...prev,
        x: nextX,
        y: nextY,
        direction: nextDir,
        score: prev.score + scoreToAdd,
        lastThought: thought,
        log: [thought, ...prev.log].slice(0, 10)
      };
    });
  }, [grid, rules]);

  // Timer Effect
  useEffect(() => {
    if (robot.isActive) {
      simulationInterval.current = setInterval(step, 1000);
    } else {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    }
    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, [robot.isActive, step]);

  const toggleSimulation = () => {
    setRobot(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetSimulation = () => {
    setRobot({
      x: 0,
      y: 0,
      direction: 1,
      score: 0,
      log: [],
      lastThought: "리셋 완료. 준비됨.",
      isActive: false
    });
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty')));
  };

  const handleCellClick = (rIndex: number, cIndex: number) => {
    // Don't allow modifying robot pos directly in this simple version
    if (rIndex === robot.y && cIndex === robot.x) return;

    setGrid(prev => {
      const newGrid = [...prev.map(row => [...row])];
      // Toggle logic or set based on editMode? Let's do set based on editMode.
      // If clicking same type, clear it.
      if (newGrid[rIndex][cIndex] === editMode) {
        newGrid[rIndex][cIndex] = 'empty';
      } else {
        newGrid[rIndex][cIndex] = editMode;
      }
      return newGrid;
    });
  };

  const updateRule = (condition: CellType, newAction: RobotAction) => {
    setRules(prev => prev.map(r => r.condition === condition ? { ...r, action: newAction } : r));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-y-auto">
      {/* Left: Simulation View */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
          
          {/* Header Stats */}
          <div className="w-full flex justify-between items-center mb-6 px-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 text-lg">점수:</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-mono font-bold text-xl">{robot.score}</span>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold transition-colors ${robot.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {robot.isActive ? '작동 중 (Running)' : '대기 중 (Idle)'}
            </div>
          </div>

          {/* Grid Render */}
          <div 
            className="grid gap-2 bg-slate-100 p-4 rounded-xl shadow-inner border border-slate-300"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          >
            {grid.map((row, rIndex) => (
              row.map((cell, cIndex) => {
                const isRobot = robot.y === rIndex && robot.x === cIndex;
                return (
                  <div
                    key={`${rIndex}-${cIndex}`}
                    onClick={() => handleCellClick(rIndex, cIndex)}
                    className={`
                      w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 border-2
                      ${isRobot ? 'bg-blue-50 border-blue-400 z-10 scale-105 shadow-lg' : ''}
                      ${!isRobot && cell === 'empty' ? 'bg-white border-slate-200 hover:bg-slate-50' : ''}
                      ${cell === 'wall' ? 'bg-slate-700 border-slate-600' : ''}
                      ${cell === 'dust' ? 'bg-amber-100 border-amber-300' : ''}
                    `}
                  >
                    {isRobot && (
                      <div className="relative">
                        {/* Thought Bubble */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-800 text-xs px-2 py-1 rounded shadow-md border border-slate-200 opacity-90 pointer-events-none z-20">
                           {robot.isActive ? 'Thinking...' : 'Ready'}
                           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-slate-200"></div>
                        </div>
                        {/* Robot Icon */}
                        <div 
                          className="text-blue-600 transition-transform duration-300"
                          style={{ transform: `rotate(${robot.direction * 90}deg)` }}
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md relative">
                              <div className="absolute -top-1 w-2 h-4 bg-red-400 rounded-full"></div> {/* Sensor visual */}
                              <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {!isRobot && cell === 'wall' && <div className="w-full h-full bg-slate-600 rounded opacity-80" />}
                    {!isRobot && cell === 'dust' && <Zap className="text-amber-500 w-8 h-8 animate-pulse" />}
                  </div>
                );
              })
            ))}
          </div>

          {/* Map Editing Tools */}
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setEditMode('wall')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${editMode === 'wall' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-700 border-slate-300'}`}
            >
              <div className="w-4 h-4 bg-slate-700 border border-white"></div> 장애물 배치
            </button>
            <button 
              onClick={() => setEditMode('dust')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${editMode === 'dust' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-slate-700 border-slate-300'}`}
            >
              <Zap className="w-4 h-4" /> 먼지 배치
            </button>
          </div>
        </div>

        {/* Thought Log */}
        <div className="bg-slate-800 text-green-400 p-4 rounded-xl shadow-sm h-40 overflow-y-auto font-mono text-sm border border-slate-700">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2 text-slate-300">
            <Cpu className="w-4 h-4" /> System Log
          </div>
          <div className="flex flex-col gap-1">
             <div className="text-white font-bold">{'>'} {robot.lastThought}</div>
             {robot.log.slice(0, 5).map((l, i) => (
               <div key={i} className="opacity-70"> - {l}</div>
             ))}
          </div>
        </div>
      </div>

      {/* Right: Controls & Logic */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Playback Controls */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" /> 시뮬레이션 제어
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={toggleSimulation}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white shadow-sm transition-all ${robot.isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {robot.isActive ? <><Pause className="w-5 h-5"/> 일시정지</> : <><Play className="w-5 h-5"/> 실행하기</>}
            </button>
            <button 
              onClick={resetSimulation}
              className="px-4 py-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold border border-slate-300"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Logic Editor */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-600" /> 로봇 판단 로직 (AI Brain)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            로봇이 특정 상황(Condition)을 만났을 때 어떤 행동(Action)을 할지 규칙을 설정하세요.
          </p>

          <div className="flex flex-col gap-3">
            {rules.map((rule, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    IF <span className={`px-2 py-0.5 rounded text-xs ${rule.condition === 'wall' ? 'bg-slate-700 text-white' : rule.condition === 'dust' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {rule.condition === 'wall' ? '장애물' : rule.condition === 'dust' ? '먼지' : '빈 공간'}
                    </span> 감지
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-mono">THEN</span>
                  <select 
                    value={rule.action}
                    onChange={(e) => updateRule(rule.condition, e.target.value as RobotAction)}
                    className="flex-1 bg-white border border-slate-300 text-slate-800 text-sm rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="move">전진 (Move)</option>
                    <option value="turnLeft">좌회전 (Turn Left)</option>
                    <option value="turnRight">우회전 (Turn Right)</option>
                    <option value="clean">청소 (Clean)</option>
                    <option value="stop">정지 (Stop)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
            <strong>팁:</strong> 장애물 앞에서는 회전하고, 먼지 앞에서는 청소하도록 설정해보세요!
          </div>
        </div>

      </div>
    </div>
  );
};

export default TabSimulation;