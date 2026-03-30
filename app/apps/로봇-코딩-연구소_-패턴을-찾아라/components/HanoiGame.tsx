import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RotateCcw, Play } from 'lucide-react';

export const HanoiGame: React.FC = () => {
  const [diskCount, setDiskCount] = useState(3);
  const [towers, setTowers] = useState<number[][]>([[], [], []]);
  const [moves, setMoves] = useState(0);
  const [selectedDisk, setSelectedDisk] = useState<{ towerIdx: number, disk: number } | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [history, setHistory] = useState<{move: number, optimal: number}[]>([]);

  // Initialize game
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diskCount]);

  const resetGame = () => {
    const initialTower = Array.from({ length: diskCount }, (_, i) => diskCount - i); // [3, 2, 1]
    setTowers([initialTower, [], []]);
    setMoves(0);
    setHistory([{move: 0, optimal: 0}]);
    setSelectedDisk(null);
    setIsAutoPlaying(false);
  };

  const handleTowerClick = (towerIdx: number) => {
    if (isAutoPlaying) return;

    if (selectedDisk) {
      // Try to move
      const targetTower = towers[towerIdx];
      const topDisk = targetTower[targetTower.length - 1];

      if (topDisk === undefined || topDisk > selectedDisk.disk) {
        // Valid move
        const newTowers = [...towers];
        newTowers[selectedDisk.towerIdx].pop();
        newTowers[towerIdx].push(selectedDisk.disk);
        setTowers(newTowers);
        
        const newMoveCount = moves + 1;
        setMoves(newMoveCount);
        setHistory(prev => [...prev, {move: newMoveCount, optimal: Math.pow(2, diskCount) - 1}]);
        setSelectedDisk(null);
      } else {
        // Invalid move
        if (selectedDisk.towerIdx === towerIdx) {
            setSelectedDisk(null); // Deselect
        } else {
            alert("큰 원판을 작은 원판 위에 올릴 수 없습니다!");
        }
      }
    } else {
      // Select
      if (towers[towerIdx].length > 0) {
        setSelectedDisk({
          towerIdx,
          disk: towers[towerIdx][towers[towerIdx].length - 1]
        });
      }
    }
  };

  const autoSolve = async () => {
    if (isAutoPlaying) return;
    resetGame();
    setIsAutoPlaying(true);
    
    // Slight delay to show reset state
    await new Promise(r => setTimeout(r, 500));

    // Recursive generator
    const movesList: {from: number, to: number}[] = [];
    const solve = (n: number, from: number, to: number, aux: number) => {
      if (n === 0) return;
      solve(n - 1, from, aux, to);
      movesList.push({ from, to });
      solve(n - 1, aux, to, from);
    };

    solve(diskCount, 0, 2, 1);

    // Execute animation
    // We can't use the generator directly to update state in a loop easily with React state batching
    // So we rebuild the state locally for the loop, but we need visual updates.
    
    // Better: Iterate the pre-calculated moves list
    // Need to manage state carefully. We will use a local representation and update state each step.
    
    let currentTowers = [
        Array.from({ length: diskCount }, (_, i) => diskCount - i),
        [],
        []
    ] as number[][]; // Re-init local state to match reset

    for (let i = 0; i < movesList.length; i++) {
        const { from, to } = movesList[i];
        
        // Logic
        const disk = currentTowers[from].pop()!;
        currentTowers[to].push(disk);
        
        // Render
        setTowers(currentTowers.map(t => [...t])); // New ref
        setMoves(i + 1);
        
        await new Promise(r => setTimeout(r, 500));
    }
    
    setIsAutoPlaying(false);
  };

  const optimalMoves = Math.pow(2, diskCount) - 1;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg text-slate-800">하노이의 탑</h3>
            <div className="flex items-center gap-2 text-sm bg-slate-100 px-3 py-1 rounded-full">
                <span>원판 개수:</span>
                <input 
                    type="range" 
                    min="3" 
                    max="6" 
                    value={diskCount} 
                    onChange={(e) => setDiskCount(parseInt(e.target.value))}
                    disabled={isAutoPlaying}
                    className="cursor-pointer"
                />
                <span className="font-bold">{diskCount}개</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-xs text-slate-500">현재 이동</p>
                <p className="text-xl font-mono font-bold text-blue-600">{moves}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-500">최소 이동</p>
                <p className="text-xl font-mono font-bold text-green-600">{optimalMoves}</p>
            </div>
            <button onClick={resetGame} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600">
                <RotateCcw size={20}/>
            </button>
            <button onClick={autoSolve} disabled={isAutoPlaying} className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full text-purple-600 disabled:opacity-50">
                <Play size={20}/>
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-indigo-50 min-h-[400px]">
        <div className="flex items-end justify-center gap-8 lg:gap-16 w-full max-w-4xl h-64">
            {[0, 1, 2].map((idx) => (
                <div 
                    key={idx} 
                    onClick={() => handleTowerClick(idx)}
                    className={`relative w-1/3 max-w-[200px] h-full flex flex-col-reverse items-center cursor-pointer group rounded-xl transition-colors
                        ${selectedDisk?.towerIdx === idx ? 'bg-blue-100/50' : 'hover:bg-slate-200/50'}
                    `}
                >
                    {/* Pole */}
                    <div className="absolute bottom-0 w-4 h-full bg-slate-300 rounded-t-lg z-0"></div>
                    
                    {/* Base */}
                    <div className="absolute bottom-0 w-full h-4 bg-slate-400 rounded-lg z-10"></div>
                    
                    {/* Disks */}
                    <div className="flex flex-col-reverse items-center w-full mb-4 z-20">
                        {towers[idx].map((diskSize) => {
                             const isSelected = selectedDisk?.disk === diskSize;
                             return (
                                <div 
                                    key={diskSize}
                                    className={`h-8 rounded-lg shadow-sm border border-white/20 transition-all duration-300
                                        ${diskSize === 1 ? 'bg-red-400 w-[30%]' : ''}
                                        ${diskSize === 2 ? 'bg-orange-400 w-[50%]' : ''}
                                        ${diskSize === 3 ? 'bg-yellow-400 w-[70%]' : ''}
                                        ${diskSize === 4 ? 'bg-green-400 w-[85%]' : ''}
                                        ${diskSize === 5 ? 'bg-blue-400 w-[95%]' : ''}
                                        ${diskSize === 6 ? 'bg-purple-400 w-full' : ''}
                                        ${isSelected ? '-translate-y-4 shadow-xl brightness-110' : ''}
                                    `}
                                >
                                </div>
                             )
                        })}
                    </div>
                </div>
            ))}
        </div>
        <p className="mt-8 text-slate-500 text-sm">기둥을 클릭하여 원판을 선택하고 이동하세요.</p>
      </div>
      
      {/* Complexity Graph */}
      <div className="h-48 bg-white p-4 border-t border-slate-200">
         <h4 className="text-sm font-bold text-slate-600 mb-2">복잡도 분석 (이동 횟수 vs 원판 개수)</h4>
         <div className="w-full h-full pb-6">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                    {n: 1, moves: 1},
                    {n: 2, moves: 3},
                    {n: 3, moves: 7},
                    {n: 4, moves: 15},
                    {n: 5, moves: 31},
                    {n: 6, moves: 63},
                ]}>
                    <XAxis dataKey="n" name="원판 개수" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="moves" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};
