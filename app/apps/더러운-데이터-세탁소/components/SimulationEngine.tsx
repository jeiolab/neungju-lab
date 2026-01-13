import React, { useState, useEffect, useCallback } from 'react';
import { DataRow, GameLevel } from '../types';
import { Trash2, AlertTriangle, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SimulationEngineProps {
  level: GameLevel;
  onComplete: (score: number) => void;
}

const FIRST_NAMES = ["민지", "현", "지우", "준", "서연", "도현", "하은", "시우", "지민", "유준"];
const LAST_NAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];

const generateData = (level: GameLevel): DataRow[] => {
  const data: DataRow[] = [];
  
  // 1. Generate clean base data
  for (let i = 0; i < level.rows; i++) {
    data.push({
      id: `row-${i}-${Date.now()}`,
      studentId: 20240001 + i,
      name: `${LAST_NAMES[i % LAST_NAMES.length]}${FIRST_NAMES[i % FIRST_NAMES.length]}`,
      age: 20 + Math.floor(Math.random() * 5),
      satisfaction: 1 + Math.floor(Math.random() * 5),
      attendance: 70 + Math.floor(Math.random() * 30),
    });
  }

  // 2. Inject Defects
  
  // NaN (Missing Values)
  for (let i = 0; i < level.defects.nan; i++) {
    const rowIdx = Math.floor(Math.random() * level.rows);
    const colKey = Math.random() > 0.5 ? 'satisfaction' : 'attendance';
    // @ts-ignore - explicitly setting dirty type
    data[rowIdx][colKey] = null;
  }

  // Outliers
  for (let i = 0; i < level.defects.outliers; i++) {
    const rowIdx = Math.floor(Math.random() * level.rows);
    const type = Math.random();
    if (type < 0.33) {
      // Age outlier
      data[rowIdx].age = 200 + Math.floor(Math.random() * 50);
    } else if (type < 0.66) {
      // Satisfaction outlier
      data[rowIdx].satisfaction = 50 + Math.floor(Math.random() * 50);
    } else {
        // Negative attendance
        data[rowIdx].attendance = -10;
    }
  }

  // Duplicates
  if (level.defects.duplicates > 0) {
    const sourceIdx = Math.floor(Math.random() * (level.rows - 2));
    const duplicate = { ...data[sourceIdx], id: `dup-${Date.now()}` };
    data.splice(sourceIdx + 1, 0, duplicate);
  }

  return data;
};

export const SimulationEngine: React.FC<SimulationEngineProps> = ({ level, onComplete }) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedCell, setSelectedCell] = useState<{id: string, field: keyof DataRow} | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [message, setMessage] = useState<string>("Analyze the table below. Find red cells and odd numbers.");
  const [cleanliness, setCleanliness] = useState(0);

  useEffect(() => {
    setData(generateData(level));
    setMessage(`레벨 ${level.level}: ${level.description}`);
  }, [level]);

  // Calculate score in real-time
  useEffect(() => {
    if (data.length === 0) return;
    
    let totalIssues = 0;
    let fixedIssues = 0; // This logic is simplified; we measure cleanliness based on current state vs ideal rules

    // Rules:
    // 1. No Nulls
    // 2. Age < 100
    // 3. Satisfaction 1-5
    // 4. Attendance 0-100
    // 5. Unique Student IDs

    let currentDefects = 0;
    const studentIds = new Set();

    data.forEach(row => {
      // Check Duplicates
      if (studentIds.has(row.studentId)) currentDefects++;
      studentIds.add(row.studentId);

      // Check Fields
      if (row.age === null || Number(row.age) > 100 || Number(row.age) < 15) currentDefects++;
      if (row.satisfaction === null || Number(row.satisfaction) > 5 || Number(row.satisfaction) < 1) currentDefects++;
      if (row.attendance === null || Number(row.attendance) > 100 || Number(row.attendance) < 0) currentDefects++;
    });

    const totalCells = data.length * 3; // Approx active cells to check
    const score = Math.max(0, Math.round(((totalCells - currentDefects) / totalCells) * 100));
    setCleanliness(score);
    
  }, [data]);

  const handleCellClick = (row: DataRow, field: keyof DataRow) => {
    if (field === 'id' || field === 'name' || field === 'studentId') return;
    setSelectedCell({ id: row.id, field });
    setEditValue(row[field] === null ? '' : String(row[field]));
  };

  const handleSaveEdit = () => {
    if (!selectedCell) return;
    
    const updatedData = data.map(row => {
      if (row.id === selectedCell.id) {
        return { ...row, [selectedCell.field]: Number(editValue) };
      }
      return row;
    });
    setData(updatedData);
    setSelectedCell(null);
  };

  const handleImputeMean = () => {
    if (!selectedCell) return;

    // Calculate mean of the column (filtering out nulls and obvious outliers for calculation)
    const values = data
        .map(r => Number(r[selectedCell.field]))
        .filter(v => !isNaN(v) && v !== 0 && v < 150); // Simple heuristic
    
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = values.length ? Math.round(sum / values.length) : 0;

    const updatedData = data.map(row => {
        if (row.id === selectedCell.id) {
            return { ...row, [selectedCell.field]: mean };
        }
        return row;
    });
    setData(updatedData);
    setSelectedCell(null);
  };

  const handleDeleteRow = (id: string) => {
    setData(data.filter(row => row.id !== id));
    if (selectedCell?.id === id) setSelectedCell(null);
  };

  const isInvalid = (val: any, type: 'age' | 'sat' | 'att') => {
    if (val === null || val === '') return true;
    const num = Number(val);
    if (isNaN(num)) return true;
    if (type === 'age' && (num > 100 || num < 10)) return true;
    if (type === 'sat' && (num > 5 || num < 1)) return true;
    if (type === 'att' && (num > 100 || num < 0)) return true;
    return false;
  };

  const getCellClass = (val: any, type: 'age' | 'sat' | 'att') => {
    const invalid = isInvalid(val, type);
    if (val === null || val === '') return "bg-red-100 text-red-600 animate-pulse font-bold";
    if (invalid) return "bg-amber-100 text-amber-700 font-bold border-amber-300";
    return "hover:bg-slate-50";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
           <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">청결도 점수</div>
           <div className="text-2xl font-mono font-bold text-blue-600 flex items-center gap-2">
             {cleanliness}%
             {cleanliness === 100 && <Sparkles className="w-5 h-5 text-yellow-500" />}
           </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setData(generateData(level))}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <RotateCcw className="w-4 h-4" /> 초기화
            </button>
            <button 
                onClick={() => onComplete(cleanliness)}
                disabled={cleanliness < 100}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-lg transition-all shadow-sm
                    ${cleanliness === 100 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
                <Check className="w-4 h-4" /> 제출
            </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6 relative">
        <div className="mb-4 text-sm text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
                <strong>미션:</strong> {message}
                <div className="mt-1 text-xs">팁: 빨간색 셀(결측치)을 클릭하거나, 말도 안 되는 숫자(이상치)를 수정하세요.</div>
            </div>
        </div>
        <table className="w-full text-sm text-left text-slate-600 border-collapse">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0 z-10">
                <tr>
                    <th className="px-4 py-3 rounded-tl-lg">작업</th>
                    <th className="px-4 py-3">학번</th>
                    <th className="px-4 py-3">이름</th>
                    <th className="px-4 py-3">나이</th>
                    <th className="px-4 py-3">만족도 (1-5)</th>
                    <th className="px-4 py-3 rounded-tr-lg">출석률 (%)</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 group transition-colors">
                        <td className="px-4 py-3">
                             <button 
                                onClick={() => handleDeleteRow(row.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                title="행 삭제 (중복/오류)"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">{row.studentId}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                        <td 
                            onClick={() => handleCellClick(row, 'age')}
                            className={`px-4 py-3 cursor-pointer border border-transparent transition-all ${getCellClass(row.age, 'age')}`}
                        >
                            {row.age === null ? '없음' : row.age}
                        </td>
                        <td 
                             onClick={() => handleCellClick(row, 'satisfaction')}
                             className={`px-4 py-3 cursor-pointer border border-transparent transition-all ${getCellClass(row.satisfaction, 'sat')}`}
                        >
                            {row.satisfaction === null ? '없음' : row.satisfaction}
                        </td>
                        <td 
                             onClick={() => handleCellClick(row, 'attendance')}
                             className={`px-4 py-3 cursor-pointer border border-transparent transition-all ${getCellClass(row.attendance, 'att')}`}
                        >
                            {row.attendance === null ? '없음' : row.attendance + '%'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Interactive Modal/Panel for selected cell */}
      {selectedCell && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-slate-800">값 수정</h3>
                <button onClick={() => setSelectedCell(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="flex gap-2 mb-3">
                 <input 
                    type="number" 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="값 입력..."
                    autoFocus
                 />
                 <button 
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                 >
                    적용
                 </button>
            </div>

            <div className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">빠른 작업</div>
            <div className="flex gap-2">
                <button 
                    onClick={handleImputeMean}
                    className="flex-1 py-2 px-3 bg-indigo-50 text-indigo-700 text-sm rounded-lg hover:bg-indigo-100 transition-colors text-center"
                >
                    평균값 대치
                </button>
                <button 
                    onClick={() => handleDeleteRow(selectedCell.id)}
                    className="flex-1 py-2 px-3 bg-red-50 text-red-700 text-sm rounded-lg hover:bg-red-100 transition-colors text-center"
                >
                    행 삭제
                </button>
            </div>
        </div>
      )}
    </div>
  );
};