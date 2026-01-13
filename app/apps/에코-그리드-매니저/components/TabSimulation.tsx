import React, { useState, useEffect, useCallback } from 'react';
import { Cell, PathNode, SimStats } from '../types';
import RadarScore from './RadarScore';
import { RefreshCw, Play, Trash2, Truck, MessageSquareQuote } from 'lucide-react';
import { getStrategicCoachTip } from '../services/geminiService';

const ROWS = 5;
const COLS = 5;

interface Props {
  onScoreUpdate: (xp: number) => void;
}

const TabSimulation: React.FC<Props> = ({ onScoreUpdate }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [path, setPath] = useState<PathNode[]>([]);
  const [stats, setStats] = useState<SimStats>({ environment: 0, time: 100, accuracy: 100 });
  const [feedback, setFeedback] = useState<string>("셀을 선택하여 수거 경로를 계획하세요.");
  const [isSimulating, setIsSimulating] = useState(false);
  const [recycleMode, setRecycleMode] = useState(false);
  const [coachTip, setCoachTip] = useState<string>("");

  // Initialize Grid
  const initGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let i = 0; i < ROWS; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < COLS; j++) {
        row.push({
          row: i,
          col: j,
          amount: Math.floor(Math.random() * 5), // 0 to 4 trash units
          type: Math.random() > 0.7 ? 'recyclable' : 'general',
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setPath([]);
    setStats({ environment: 0, time: 100, accuracy: 100 });
    setFeedback("그리드가 초기화되었습니다. 셀을 클릭하여 경로를 만드세요.");
    setCoachTip("");
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // Handle Cell Click
  const toggleCell = (r: number, c: number) => {
    if (isSimulating) return;

    setPath(prev => {
      const existsIndex = prev.findIndex(p => p.row === r && p.col === c);
      let newPath = [...prev];
      
      if (existsIndex >= 0) {
        // Remove and everything after it (simulate rethinking route)
        newPath = newPath.slice(0, existsIndex);
      } else {
        newPath.push({ row: r, col: c });
      }
      return newPath;
    });
  };

  // Calculate Scores Live
  useEffect(() => {
    if (grid.length === 0) return;

    let totalTrashOnMap = 0;
    grid.forEach(row => row.forEach(cell => totalTrashOnMap += cell.amount));

    let collected = 0;
    let wrongBinPenalty = 0;

    path.forEach(node => {
      const cell = grid[node.row][node.col];
      collected += cell.amount;
      // Simple rule: If Recycle Mode is OFF, but we pick up Recycle items, slight penalty for not separating?
      // Or: If Recycle Mode is ON, we get bonus for Recyclables, penalty for General.
      if (recycleMode) {
        if (cell.type === 'general') wrongBinPenalty += 1; // Contamination
      } else {
         // Standard mode, no penalty, just collecting.
      }
    });

    const maxSteps = ROWS * COLS;
    const steps = path.length;
    
    // Calculations
    const envScore = totalTrashOnMap > 0 ? Math.round((collected / totalTrashOnMap) * 100) : 0;
    const timeScore = Math.max(0, 100 - Math.round((steps / maxSteps) * 100)); // Fewer steps = higher time score
    const accuracyScore = Math.max(0, 100 - (wrongBinPenalty * 10));

    setStats({
      environment: envScore,
      time: timeScore,
      accuracy: accuracyScore
    });

    // Micro Feedback
    if (path.length > 0) {
      const last = path[path.length - 1];
      const val = grid[last.row][last.col].amount;
      setFeedback(`방문 위치 [${last.row}][${last.col}]. ${val}개 수거. 시간 점수 변동됨.`);
    } else {
      setFeedback("시작점을 선택하세요.");
    }

  }, [path, grid, recycleMode]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setFeedback("경로 시뮬레이션 중...");
    
    // Simulate API call for coach tip
    const totalTrash = grid.flat().reduce((acc, c) => acc + c.amount, 0);
    const collected = path.reduce((acc, p) => acc + grid[p.row][p.col].amount, 0);
    const tip = await getStrategicCoachTip({rows: ROWS, cols: COLS}, path.length, collected, totalTrash);
    setCoachTip(tip);

    setTimeout(() => {
      setIsSimulating(false);
      onScoreUpdate(10 + Math.floor(stats.environment / 10)); // Grant XP
      setFeedback("시뮬레이션 완료! 결과를 확인하세요.");
    }, 1500);
  };

  const isSelected = (r: number, c: number) => path.some(p => p.row === r && p.col === c);
  const getOrder = (r: number, c: number) => path.findIndex(p => p.row === r && p.col === c) + 1;

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full p-2">
      {/* Left Panel: Grid */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-700 flex items-center gap-2">
                    <Truck size={20}/> 구역 지도 (2D)
                </h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setRecycleMode(!recycleMode)}
                        className={`px-3 py-1 text-xs rounded-full border ${recycleMode ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-300 text-gray-500'}`}
                    >
                        {recycleMode ? '재활용 모드 ON' : '재활용 모드 OFF'}
                    </button>
                    <button onClick={initGrid} className="p-2 hover:bg-gray-100 rounded-full" title="그리드 초기화">
                        <RefreshCw size={16} className="text-gray-500" />
                    </button>
                </div>
            </div>

            <div 
                className="grid gap-1 mx-auto"
                style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
                {grid.map((row, r) => (
                    row.map((cell, c) => {
                        const active = isSelected(r, c);
                        const order = getOrder(r, c);
                        return (
                            <div 
                                key={`${r}-${c}`}
                                onClick={() => toggleCell(r, c)}
                                className={`
                                    aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative
                                    ${active ? 'border-blue-500 bg-blue-50 shadow-inner' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                                `}
                            >
                                {active && (
                                    <span className="absolute top-1 left-1 text-[10px] font-bold text-blue-600 bg-white px-1 rounded shadow-sm">
                                        {order}
                                    </span>
                                )}
                                <span className="text-xs text-gray-400 absolute bottom-1 right-1 font-mono">[{r},{c}]</span>
                                {cell.amount > 0 ? (
                                    <div className="flex flex-col items-center">
                                        <Trash2 
                                            size={20} 
                                            className={`${cell.type === 'recyclable' ? 'text-green-500' : 'text-gray-600'}`} 
                                        />
                                        <span className="text-xs font-bold text-gray-700">{cell.amount}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-300 text-xs">빈 곳</span>
                                )}
                            </div>
                        );
                    })
                ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-2">
                <MessageSquareQuote size={16} className="mt-1 shrink-0"/>
                <p>{feedback}</p>
            </div>
            {coachTip && (
                 <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg flex items-start gap-2 border border-yellow-200">
                    <span className="font-bold">코치:</span>
                    <p>{coachTip}</p>
                </div>
            )}
        </div>
      </div>

      {/* Right Panel: Controls & Viz */}
      <div className="md:w-80 flex flex-col gap-4">
        <RadarScore stats={stats} />
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-2">트레이드오프 분석</h3>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>쓰레기 수거량</span>
                        <span className="font-bold">{stats.environment}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${stats.environment}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>속도 (효율성)</span>
                        <span className="font-bold">{stats.time}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${stats.time}%` }}></div>
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>분리수거 정확도</span>
                        <span className="font-bold">{stats.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${stats.accuracy}%` }}></div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSimulate}
                disabled={path.length === 0 || isSimulating}
                className={`
                    w-full mt-6 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all
                    ${path.length === 0 || isSimulating ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg active:scale-95'}
                `}
            >
                {isSimulating ? '처리 중...' : (
                    <>
                        <Play size={18} /> 경로 실행
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;