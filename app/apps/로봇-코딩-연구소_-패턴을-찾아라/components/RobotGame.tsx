import React, { useState, useEffect, useCallback } from 'react';
import { Command, CommandType, Direction, Level, RobotState } from '../types';
import { Play, RotateCcw, Plus, Trash2, RotateCw, ArrowUp, Repeat } from 'lucide-react';

const LEVELS: Level[] = [
  {
    id: 1,
    name: "직진 패턴",
    gridSize: 5,
    start: { x: 0, y: 2, dir: Direction.EAST },
    end: { x: 4, y: 2 },
    obstacles: [],
    optimalMoves: 1 // Using a loop or just moving forward
  },
  {
    id: 2,
    name: "계단식 패턴 (지그재그)",
    gridSize: 5,
    start: { x: 0, y: 4, dir: Direction.EAST },
    end: { x: 4, y: 0 },
    obstacles: [
        {x:1, y:4}, {x:2, y:4}, {x:3, y:4}, {x:4, y:4},
        {x:0, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:3},
        {x:0, y:2}, {x:1, y:2}, {x:3, y:2}, {x:4, y:2},
        {x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:4, y:1},
    ], // Simplified: Just need to move Up, Right, Up, Right...
    optimalMoves: 4 // Loop (Up, Right)
  }
];

// Helper to check wall/obstacle collisions
const isValidMove = (pos: { x: number, y: number }, level: Level) => {
  if (pos.x < 0 || pos.x >= level.gridSize || pos.y < 0 || pos.y >= level.gridSize) return false;
  return !level.obstacles.some(o => o.x === pos.x && o.y === pos.y);
};

export const RobotGame: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [robot, setRobot] = useState<RobotState>(LEVELS[0].start);
  const [commands, setCommands] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  
  const level = LEVELS[currentLevelIdx];

  // Reset level
  const resetLevel = useCallback(() => {
    setRobot(level.start);
    setIsRunning(false);
    setMessage("");
  }, [level]);

  useEffect(() => {
    resetLevel();
    setCommands([]);
  }, [currentLevelIdx, resetLevel]);

  const addCommand = (type: CommandType) => {
    const newCmd: Command = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      children: type === CommandType.LOOP ? [] : undefined,
      count: type === CommandType.LOOP ? 2 : undefined
    };
    setCommands([...commands, newCmd]);
  };

  const addToLoop = (parentId: string, type: CommandType) => {
    setCommands(prev => prev.map(cmd => {
      if (cmd.id === parentId && cmd.children) {
        return {
          ...cmd,
          children: [...cmd.children, {
            id: Math.random().toString(36).substr(2, 9),
            type
          }]
        };
      }
      return cmd;
    }));
  };

  const removeCommand = (id: string) => {
    setCommands(commands.filter(c => c.id !== id));
  };
  
  const updateLoopCount = (id: string, delta: number) => {
    setCommands(prev => prev.map(cmd => {
        if(cmd.id === id) {
            return { ...cmd, count: Math.max(2, (cmd.count || 2) + delta) };
        }
        return cmd;
    }));
  };

  const executeCommands = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setMessage("로봇 이동 중...");
    
    // Flatten commands (unroll loops)
    const executionQueue: CommandType[] = [];
    
    const unroll = (cmds: Command[]) => {
      cmds.forEach(cmd => {
        if (cmd.type === CommandType.LOOP && cmd.children) {
          for (let i = 0; i < (cmd.count || 1); i++) {
            unroll(cmd.children);
          }
        } else {
          executionQueue.push(cmd.type);
        }
      });
    };
    unroll(commands);

    let currentState = { ...level.start };
    setRobot(currentState);

    for (const cmdType of executionQueue) {
      await new Promise(r => setTimeout(r, 500));
      
      let nextState = { ...currentState };
      
      if (cmdType === CommandType.FORWARD) {
        if (currentState.dir === Direction.NORTH) nextState.y -= 1;
        if (currentState.dir === Direction.EAST) nextState.x += 1;
        if (currentState.dir === Direction.SOUTH) nextState.y += 1;
        if (currentState.dir === Direction.WEST) nextState.x -= 1;
      } else if (cmdType === CommandType.TURN_LEFT) {
        nextState.dir = (currentState.dir + 3) % 4;
      } else if (cmdType === CommandType.TURN_RIGHT) {
        nextState.dir = (currentState.dir + 1) % 4;
      }

      if (isValidMove(nextState, level)) {
        currentState = nextState;
        setRobot({ ...currentState });
      } else {
        setMessage("충돌! 벽이나 장애물에 부딪혔습니다.");
        setIsRunning(false);
        return;
      }
    }

    if (currentState.x === level.end.x && currentState.y === level.end.y) {
      setMessage("성공! 목표에 도착했습니다!");
    } else {
      setMessage("실패! 목표에 도착하지 못했습니다.");
    }
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-4">
      {/* Game Area */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center relative">
        <div className="mb-4 flex justify-between w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-800">{level.name}</h3>
            <div className="flex gap-2">
                <button 
                    onClick={() => setCurrentLevelIdx(Math.max(0, currentLevelIdx - 1))}
                    disabled={currentLevelIdx === 0}
                    className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
                >이전</button>
                <button 
                    onClick={() => setCurrentLevelIdx(Math.min(LEVELS.length - 1, currentLevelIdx + 1))}
                    disabled={currentLevelIdx === LEVELS.length - 1}
                    className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
                >다음</button>
            </div>
        </div>

        <div className="relative bg-slate-100 border-2 border-slate-300 rounded-lg" 
             style={{ 
                 width: '300px', 
                 height: '300px', 
                 display: 'grid', 
                 gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
                 gridTemplateRows: `repeat(${level.gridSize}, 1fr)` 
             }}>
          
          {/* Grid Cells */}
          {Array.from({ length: level.gridSize * level.gridSize }).map((_, i) => {
            const x = i % level.gridSize;
            const y = Math.floor(i / level.gridSize);
            const isEnd = x === level.end.x && y === level.end.y;
            const isObstacle = level.obstacles.some(o => o.x === x && o.y === y);
            
            return (
              <div key={i} className={`border border-slate-200 flex items-center justify-center
                ${isEnd ? 'bg-green-100' : ''}
                ${isObstacle ? 'bg-slate-800' : ''}
              `}>
                {isEnd && <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />}
              </div>
            );
          })}

          {/* Robot */}
          <div 
            className="absolute transition-all duration-500 ease-in-out flex items-center justify-center text-blue-600"
            style={{
              width: `${100 / level.gridSize}%`,
              height: `${100 / level.gridSize}%`,
              left: `${(robot.x / level.gridSize) * 100}%`,
              top: `${(robot.y / level.gridSize) * 100}%`,
              transform: `rotate(${robot.dir * 90}deg)`
            }}
          >
             <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2L15 8H9L12 2Z" />
               <rect x="7" y="8" width="10" height="12" rx="2" />
               <path d="M5 10H7V14H5V10Z" />
               <path d="M17 10H19V14H17V10Z" />
             </svg>
          </div>
        </div>
        
        <div className="mt-4 h-8 text-lg font-semibold text-blue-600">
            {message}
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-96 bg-slate-50 border-l border-slate-200 p-6 flex flex-col rounded-xl lg:rounded-none lg:rounded-r-xl shadow-lg lg:shadow-none overflow-hidden">
        <h3 className="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-1 rounded">CMD</span> 명령어 블록
        </h3>
        
        {/* Toolbox */}
        <div className="grid grid-cols-4 gap-2 mb-6">
            <button onClick={() => addCommand(CommandType.FORWARD)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex flex-col items-center text-xs">
                <ArrowUp size={20} /> 전진
            </button>
            <button onClick={() => addCommand(CommandType.TURN_LEFT)} className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex flex-col items-center text-xs">
                <RotateCcw size={20} /> 좌회전
            </button>
            <button onClick={() => addCommand(CommandType.TURN_RIGHT)} className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex flex-col items-center text-xs">
                <RotateCw size={20} /> 우회전
            </button>
            <button onClick={() => addCommand(CommandType.LOOP)} className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex flex-col items-center text-xs">
                <Repeat size={20} /> 반복
            </button>
        </div>

        {/* Command List */}
        <div className="flex-1 overflow-y-auto bg-slate-200 rounded-lg p-3 space-y-2 mb-4">
            {commands.length === 0 && <p className="text-slate-500 text-center text-sm py-4">명령어를 추가하세요</p>}
            
            {commands.map((cmd, idx) => (
                <div key={cmd.id} className={`relative p-2 rounded border ${cmd.type === CommandType.LOOP ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-300'}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <span className="text-slate-400 text-xs w-4">{idx + 1}</span>
                            {cmd.type === CommandType.FORWARD && '전진'}
                            {cmd.type === CommandType.TURN_LEFT && '좌회전'}
                            {cmd.type === CommandType.TURN_RIGHT && '우회전'}
                            {cmd.type === CommandType.LOOP && '반복하기'}
                        </span>
                        
                        {cmd.type === CommandType.LOOP && (
                            <div className="flex items-center gap-1">
                                <button onClick={() => updateLoopCount(cmd.id, -1)} className="w-5 h-5 bg-orange-200 rounded text-xs">-</button>
                                <span className="text-xs font-bold w-4 text-center">{cmd.count}</span>
                                <button onClick={() => updateLoopCount(cmd.id, 1)} className="w-5 h-5 bg-orange-200 rounded text-xs">+</button>
                            </div>
                        )}

                        <button onClick={() => removeCommand(cmd.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Nested Loop Area */}
                    {cmd.type === CommandType.LOOP && (
                        <div className="mt-2 pl-2 border-l-2 border-orange-200 ml-2 space-y-1 bg-white/50 p-2 rounded">
                            {cmd.children?.map((child, cIdx) => (
                                <div key={child.id} className="text-xs bg-white border border-slate-200 p-1 rounded px-2 text-slate-600">
                                    {child.type === CommandType.FORWARD && '전진'}
                                    {child.type === CommandType.TURN_LEFT && '좌회전'}
                                    {child.type === CommandType.TURN_RIGHT && '우회전'}
                                </div>
                            ))}
                            <div className="flex gap-1 mt-1">
                                <button onClick={() => addToLoop(cmd.id, CommandType.FORWARD)} className="flex-1 bg-blue-100 text-blue-600 hover:bg-blue-200 text-xs py-1 rounded">전진</button>
                                <button onClick={() => addToLoop(cmd.id, CommandType.TURN_LEFT)} className="flex-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xs py-1 rounded">좌</button>
                                <button onClick={() => addToLoop(cmd.id, CommandType.TURN_RIGHT)} className="flex-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xs py-1 rounded">우</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
            <button onClick={resetLevel} className="flex-1 py-3 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-2">
                <RotateCcw size={18} /> 초기화
            </button>
            <button onClick={executeCommands} disabled={isRunning} className="flex-[2] py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 flex items-center justify-center gap-2 shadow-md disabled:bg-green-300">
                <Play size={18} /> {isRunning ? '실행 중...' : '실행하기'}
            </button>
        </div>

      </div>
    </div>
  );
};
