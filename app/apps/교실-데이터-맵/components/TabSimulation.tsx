import React, { useState, useEffect } from 'react';
import { MISSIONS, BADGES } from '../constants';
import { UserStats, Mission, Feedback } from '../types';
import { MousePointer2, Settings, Edit3, CheckCircle2, RotateCcw } from 'lucide-react';

interface TabSimulationProps {
  userStats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
}

type Mode = 'cell' | 'row' | 'col' | 'slice';

const TabSimulation: React.FC<TabSimulationProps> = ({ userStats, updateStats }) => {
  // Grid State
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [gridData, setGridData] = useState<number[][]>([]);
  
  // Interaction State
  const [mode, setMode] = useState<Mode>('cell');
  const [selected, setSelected] = useState({ r: -1, c: -1 }); // Single cell
  const [selectedRow, setSelectedRow] = useState(-1);
  const [selectedCol, setSelectedCol] = useState(-1);
  const [sliceRange, setSliceRange] = useState({ rStart: 0, rEnd: 1, cStart: 0, cEnd: 1 });
  
  // Mission State
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    action: "그리드를 조작해보세요.",
    reason: "좌석이나 점수를 클릭하면 인덱스를 확인할 수 있습니다.",
    next: "위의 미션을 확인하고 따라해보세요!"
  });

  const [editValue, setEditValue] = useState<string>('');

  // Initialize Grid
  useEffect(() => {
    const newGrid = Array.from({ length: rows }, () => 
      Array.from({ length: cols }, () => Math.floor(Math.random() * 50) + 50)
    );
    setGridData(newGrid);
  }, [rows, cols]);

  const currentMission = MISSIONS[currentMissionIdx];

  // Logic to handle cell click based on mode
  const handleCellClick = (r: number, c: number) => {
    // Reset previous feedback
    setMissionCompleted(false);

    if (mode === 'cell') {
      setSelected({ r, c });
      setEditValue(gridData[r][c].toString());
      updateFeedback('cell', r, c);
      checkMission({ r, c });
    } else if (mode === 'row') {
      setSelectedRow(r);
      updateFeedback('row', r, c);
      checkMission({ r, mode: 'row' });
    } else if (mode === 'col') {
      setSelectedCol(c);
      updateFeedback('col', r, c);
      checkMission({ c, mode: 'col' });
    }
    // Slice mode is handled via controls for simplicity in this version
  };

  const updateFeedback = (type: string, r: number, c: number) => {
    if (type === 'cell') {
      setFeedback({
        action: `[${r}][${c}] 셀 선택됨 (값: ${gridData[r][c]})`,
        reason: `행 인덱스 ${r}, 열 인덱스 ${c}에 접근했습니다.`,
        next: currentMission ? "미션 조건을 만족하는지 확인해보세요." : "자유롭게 탐색하세요."
      });
    } else if (type === 'row') {
      setFeedback({
        action: `행 [${r}] 전체 선택`,
        reason: `grid[${r}] 명령은 ${r}번째 리스트 전체를 가져옵니다.`,
        next: "다른 행도 선택해보세요."
      });
    } else if (type === 'col') {
      setFeedback({
        action: `열 [${c}] 전체 선택`,
        reason: `각 행의 ${c}번째 요소를 모아서 봅니다.`,
        next: "2차원 리스트에서 열만 떼어내는 건 반복문이 필요해요."
      });
    }
  };

  const checkMission = (selection: any) => {
    if (!currentMission) return;

    // Construct a context object for the checker
    const context = {
      r: selection.r,
      c: selection.c,
      mode: mode,
      rStart: sliceRange.rStart,
      rEnd: sliceRange.rEnd,
      cStart: sliceRange.cStart,
      cEnd: sliceRange.cEnd
    };

    if (currentMission.targetCondition(selection.r, selection.c, gridData, context)) {
      setMissionCompleted(true);
      
      // Award Logic
      const newBadges = [...userStats.badges];
      if (currentMission.id === 2 && !newBadges.includes(BADGES.ROW_MASTER.id)) newBadges.push(BADGES.ROW_MASTER.id);
      if (currentMission.id === 3 && !newBadges.includes(BADGES.COL_HUNTER.id)) newBadges.push(BADGES.COL_HUNTER.id);
      if (currentMission.id === 5 && !newBadges.includes(BADGES.SLICE_SENSE.id)) newBadges.push(BADGES.SLICE_SENSE.id);

      updateStats({
        xp: userStats.xp + 15,
        streak: userStats.streak + 1,
        badges: newBadges
      });

      setFeedback({
        action: "🎉 미션 성공!",
        reason: "정확한 인덱스/범위를 선택했습니다.",
        next: "다음 미션으로 넘어갑니다."
      });
    }
  };

  const nextMission = () => {
    if (currentMissionIdx < MISSIONS.length - 1) {
      setCurrentMissionIdx(prev => prev + 1);
      setMissionCompleted(false);
      // Reset selections
      setSelected({r: -1, c: -1});
      setSelectedRow(-1);
      setSelectedCol(-1);
      setMode('cell');
    }
  };

  const handleEdit = () => {
    if (selected.r === -1) return;
    const newVal = parseInt(editValue);
    if (isNaN(newVal)) return;

    const newGrid = [...gridData];
    newGrid[selected.r] = [...newGrid[selected.r]];
    newGrid[selected.r][selected.c] = newVal;
    setGridData(newGrid);

    if (currentMission.targetType === 'edit' && currentMission.targetCondition(selected.r, selected.c, newGrid, {})) {
       setMissionCompleted(true);
       updateStats({ xp: userStats.xp + 20 });
       setFeedback({
         action: "값 수정 완료!",
         reason: "변수 할당을 통해 데이터가 변경되었습니다.",
         next: "잘했습니다!"
       });
    }
  };

  const handleSliceCheck = () => {
    if (mode !== 'slice') return;
    checkMission({r: -1, c: -1}); // Dummy coords, logic uses state
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left: Controls & Grid */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-600">모드:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setMode('cell')}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${mode === 'cell' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
              >
                셀 선택
              </button>
              <button 
                onClick={() => setMode('row')}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${mode === 'row' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
              >
                행 선택
              </button>
              <button 
                onClick={() => setMode('col')}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${mode === 'col' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
              >
                열 선택
              </button>
              <button 
                onClick={() => setMode('slice')}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${mode === 'slice' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
              >
                슬라이싱
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
             <span className="text-slate-500">크기:</span>
             <button onClick={() => { setRows(r => Math.max(2, r-1)); }} className="w-6 h-6 bg-slate-100 rounded hover:bg-slate-200">-</button>
             <span className="font-mono">{rows}x{cols}</span>
             <button onClick={() => { setRows(r => Math.min(8, r+1)); }} className="w-6 h-6 bg-slate-100 rounded hover:bg-slate-200">+</button>
          </div>
        </div>

        {/* The Grid */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 overflow-x-auto min-h-[300px] flex items-center justify-center relative">
          
          {/* Column Indices */}
          <div className="absolute top-2 left-6 right-6 flex" style={{ paddingLeft: '2rem' }}> {/* 2rem for row index width */}
             {gridData[0]?.map((_, i) => (
                <div key={i} className={`flex-1 text-center text-xs font-mono font-bold ${mode === 'col' && selectedCol === i ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {i}
                </div>
             ))}
          </div>

          <div className="flex flex-col gap-2 w-full max-w-2xl mt-4">
            {gridData.map((row, rIndex) => (
              <div key={rIndex} className="flex gap-2 items-center">
                {/* Row Index */}
                <div className={`w-8 text-right pr-2 text-xs font-mono font-bold ${mode === 'row' && selectedRow === rIndex ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {rIndex}
                </div>
                
                {/* Cells */}
                <div className={`flex-1 flex gap-2 p-1 rounded-lg transition-colors ${mode === 'row' && selectedRow === rIndex ? 'bg-indigo-100/50 ring-2 ring-indigo-400' : ''}`}>
                  {row.map((val, cIndex) => {
                    const isSelected = selected.r === rIndex && selected.c === cIndex;
                    const isColSelected = mode === 'col' && selectedCol === cIndex;
                    const isInSlice = mode === 'slice' && 
                                      rIndex >= sliceRange.rStart && rIndex <= sliceRange.rEnd &&
                                      cIndex >= sliceRange.cStart && cIndex <= sliceRange.cEnd;

                    return (
                      <button
                        key={`${rIndex}-${cIndex}`}
                        onClick={() => handleCellClick(rIndex, cIndex)}
                        className={`
                          flex-1 aspect-[4/3] rounded shadow-sm border text-sm font-medium transition-all relative overflow-hidden group
                          ${isSelected ? 'bg-indigo-500 text-white border-indigo-600 scale-105 z-10' : 
                            (isColSelected || isInSlice) ? 'bg-indigo-100 border-indigo-300 text-indigo-900' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}
                        `}
                      >
                        {val}
                        <span className="absolute bottom-0.5 right-1 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                          [{rIndex}][{cIndex}]
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slicing Controls (Only visible in slice mode) */}
        {mode === 'slice' && (
          <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm animate-fadeIn">
            <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Settings size={14} /> 슬라이싱 범위 설정
            </h4>
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border">
                <span className="text-xs text-slate-500">행(Row)</span>
                <input type="number" value={sliceRange.rStart} onChange={(e) => setSliceRange({...sliceRange, rStart: parseInt(e.target.value)})} className="w-12 text-center text-sm border rounded" />
                <span>~</span>
                <input type="number" value={sliceRange.rEnd} onChange={(e) => setSliceRange({...sliceRange, rEnd: parseInt(e.target.value)})} className="w-12 text-center text-sm border rounded" />
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border">
                <span className="text-xs text-slate-500">열(Col)</span>
                <input type="number" value={sliceRange.cStart} onChange={(e) => setSliceRange({...sliceRange, cStart: parseInt(e.target.value)})} className="w-12 text-center text-sm border rounded" />
                <span>~</span>
                <input type="number" value={sliceRange.cEnd} onChange={(e) => setSliceRange({...sliceRange, cEnd: parseInt(e.target.value)})} className="w-12 text-center text-sm border rounded" />
              </div>
              <button 
                onClick={handleSliceCheck}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 font-bold"
              >
                범위 확인
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-400 font-mono">
              code: grid[{sliceRange.rStart}:{sliceRange.rEnd + 1}][{sliceRange.cStart}:{sliceRange.cEnd + 1}] (파이썬 기준)
            </div>
          </div>
        )}
      </div>

      {/* Right: Info & Feedback Panel */}
      <div className="space-y-6">
        
        {/* Mission Card */}
        <div className={`p-5 rounded-xl border-2 transition-colors ${missionCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-indigo-100 shadow-md'}`}>
          <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Mission {currentMissionIdx + 1}/{MISSIONS.length}</span>
             {missionCompleted && <CheckCircle2 className="text-emerald-500 animate-bounce" size={20} />}
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{currentMission.title}</h3>
          <p className="text-slate-600 text-sm mb-4">{currentMission.description}</p>
          
          <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 mb-4">
             💡 힌트: {currentMission.hint}
          </div>

          {missionCompleted ? (
            <button onClick={nextMission} className="w-full py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
              다음 미션 도전 <RotateCcw size={16} />
            </button>
          ) : (
             <div className="h-10 flex items-center justify-center text-xs text-slate-400 italic">
               미션을 완료하면 버튼이 나타납니다.
             </div>
          )}
        </div>

        {/* Inspector Panel */}
        <div className="bg-slate-900 text-slate-200 p-5 rounded-xl font-mono text-sm shadow-inner">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
            <MousePointer2 size={16} className="text-indigo-400" />
            <span className="font-bold text-white">Inspector</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-slate-500 block text-xs">선택(Index)</span>
              <span className="text-lg text-emerald-400">
                {selected.r >= 0 ? `grid[${selected.r}][${selected.c}]` : '선택 없음'}
              </span>
            </div>
            
            <div>
              <span className="text-slate-500 block text-xs">현재 값(Value)</span>
              <div className="flex gap-2 items-center">
                 <span className="text-2xl font-bold text-white">
                    {selected.r >= 0 ? gridData[selected.r][selected.c] : '-'}
                 </span>
                 {selected.r >= 0 && (
                   <div className="flex gap-1">
                      <input 
                        type="text" 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
                      />
                      <button onClick={handleEdit} className="bg-indigo-600 p-1 rounded hover:bg-indigo-500"><Edit3 size={12}/></button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Console */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-3 text-sm">시스템 피드백</h4>
          <div className="space-y-3 text-sm">
             <div className="flex gap-2">
               <span className="text-indigo-500 font-bold min-w-[3rem]">동작:</span>
               <span className="text-slate-700">{feedback.action}</span>
             </div>
             <div className="flex gap-2">
               <span className="text-indigo-500 font-bold min-w-[3rem]">원리:</span>
               <span className="text-slate-700">{feedback.reason}</span>
             </div>
             <div className="flex gap-2 bg-indigo-50 p-2 rounded">
               <span className="text-indigo-600 font-bold min-w-[3rem]">다음:</span>
               <span className="text-indigo-800">{feedback.next}</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TabSimulation;