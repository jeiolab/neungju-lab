import React, { useState, useEffect } from 'react';
import { Student, CellPosition, Subject } from '../types';
import { INITIAL_STUDENTS, SUBJECTS } from '../constants';
import { Download, Calculator, Filter, Trophy, Eye, RefreshCw } from 'lucide-react';

export const SimulationTab: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [highlightedCell, setHighlightedCell] = useState<CellPosition | null>(null);
  const [filterHighScores, setFilterHighScores] = useState(false);
  const [showAverages, setShowAverages] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Helper to show toast
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Add badge logic
  const unlockBadge = (badgeName: string) => {
    if (!badges.includes(badgeName)) {
      setBadges(prev => [...prev, badgeName]);
      showToast(`🏆 배지 획득: ${badgeName}!`);
    }
  };

  const handleScoreChange = (studentIndex: number, subjectIndex: number, val: string) => {
    const newStudents = [...students];
    const numVal = parseInt(val) || 0;
    newStudents[studentIndex].scores[subjectIndex] = numVal;
    setStudents(newStudents);
  };

  const calculateClassAverage = (subjectIndex: number) => {
    const sum = students.reduce((acc, student) => acc + student.scores[subjectIndex], 0);
    return (sum / students.length).toFixed(1);
  };

  const handleAnalyze = () => {
    setShowAverages(!showAverages);
    if (!showAverages) unlockBadge("알고리즘 마스터");
  };

  const handleFilter = () => {
    setFilterHighScores(!filterHighScores);
    if (!filterHighScores) unlockBadge("독수리의 눈");
  };

  const exportCSV = () => {
    const headers = ["이름,국어,영어,수학"];
    const rows = students.map(s => `${s.name},${s.scores.join(',')}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grades.csv");
    document.body.appendChild(link);
    link.click();
    showToast("CSV 파일이 생성되었습니다.");
  };

  const resetData = () => {
    setStudents(INITIAL_STUDENTS);
    setBadges([]);
    setShowAverages(false);
    setFilterHighScores(false);
    showToast("데이터가 초기화되었습니다.");
  };

  // Styling for highlighted code
  const getCodeStyle = (rIdx: number, cIdx: number) => {
    if (highlightedCell?.rowIndex === rIdx && highlightedCell?.colIndex === cIdx) {
      return "bg-yellow-300 text-black font-bold transform scale-110 px-1 rounded transition-all";
    }
    if (filterHighScores && students[rIdx].scores[cIdx] >= 90) {
      return "bg-green-200 text-green-900 font-bold px-1 rounded";
    }
    return "text-blue-400";
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">성적 데이터 시뮬레이션</h2>
           <p className="text-sm text-slate-500">표를 클릭하여 코드 인덱스를 확인하세요.</p>
        </div>
        <div className="flex space-x-2">
            <button onClick={resetData} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg tooltip" title="초기화">
                <RefreshCw size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button 
                onClick={handleFilter}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${filterHighScores ? 'bg-green-100 text-green-700' : 'bg-white hover:bg-slate-50 border border-slate-200'}`}
            >
                <Filter size={18} />
                <span className="text-sm">90점 이상 강조</span>
            </button>
            <button 
                onClick={handleAnalyze}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${showAverages ? 'bg-purple-100 text-purple-700' : 'bg-white hover:bg-slate-50 border border-slate-200'}`}
            >
                <Calculator size={18} />
                <span className="text-sm">평균 계산</span>
            </button>
            <button 
                onClick={exportCSV}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
                <Download size={18} />
                <span className="text-sm">내보내기</span>
            </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6 h-full overflow-hidden">
        
        {/* Left: Interactive Table (Excel View) */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-xs font-mono text-slate-500 ml-2">grades.xlsx</span>
            </div>
            <div className="p-4 overflow-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="p-3 text-slate-400 font-medium w-16">No.</th>
                            <th className="p-3 text-slate-600 font-bold">이름</th>
                            {SUBJECTS.map((sub) => (
                                <th key={sub} className="p-3 text-slate-600 font-bold">{sub}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, rIdx) => (
                            <tr key={student.id} className="group hover:bg-slate-50 transition-colors">
                                <td className="p-3 text-slate-400 font-mono">{rIdx}</td>
                                <td className="p-3 font-medium text-slate-700">{student.name}</td>
                                {student.scores.map((score, cIdx) => (
                                    <td key={`${rIdx}-${cIdx}`} className="p-1">
                                        <input 
                                            type="number"
                                            value={score}
                                            onChange={(e) => handleScoreChange(rIdx, cIdx, e.target.value)}
                                            onFocus={() => setHighlightedCell({ rowIndex: rIdx, colIndex: cIdx })}
                                            className={`w-full p-2 rounded border text-center transition-all outline-none focus:ring-2 focus:ring-blue-400 
                                                ${highlightedCell?.rowIndex === rIdx && highlightedCell?.colIndex === cIdx ? 'bg-yellow-100 border-yellow-400' : 'border-slate-200'}
                                                ${filterHighScores && score >= 90 ? 'text-green-600 font-bold bg-green-50' : ''}
                                            `}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        
                        {/* Averages Row */}
                        {showAverages && (
                            <tr className="bg-purple-50 border-t-2 border-purple-100 animate-fade-in">
                                <td className="p-3 text-purple-400 font-mono">Avg</td>
                                <td className="p-3 font-bold text-purple-700">전체 평균</td>
                                {SUBJECTS.map((_, idx) => (
                                    <td key={`avg-${idx}`} className="p-3 text-center font-bold text-purple-700">
                                        {calculateClassAverage(idx)}
                                    </td>
                                ))}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Right: Code View (Python) */}
        <div className="bg-slate-900 rounded-xl shadow-md border border-slate-700 flex flex-col overflow-hidden text-slate-300 font-mono text-sm relative">
            <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between items-center">
                <span className="text-xs text-blue-300">main.py</span>
                {highlightedCell && (
                    <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded font-bold">
                        scores[{highlightedCell.rowIndex}][{highlightedCell.colIndex}] selected
                    </span>
                )}
            </div>
            <div className="p-6 overflow-auto flex-1 leading-relaxed">
                <div className="mb-4 text-slate-500"># 2차원 리스트 데이터 구조</div>
                <div>
                    <span className="text-purple-400">scores</span> <span className="text-white">=</span> [
                </div>
                <div className="pl-4 flex flex-col space-y-1 my-1">
                    {students.map((student, rIdx) => (
                        <div key={rIdx} className="flex items-center group">
                            <span className="text-slate-500 select-none mr-4 w-4 text-right opacity-50">{rIdx}</span>
                            <span>[</span>
                            {student.scores.map((score, cIdx) => (
                                <span key={`${rIdx}-${cIdx}`}>
                                    <span 
                                        className={`cursor-pointer inline-block ${getCodeStyle(rIdx, cIdx)}`}
                                        onMouseEnter={() => setHighlightedCell({ rowIndex: rIdx, colIndex: cIdx })}
                                    >
                                        {score}
                                    </span>
                                    {cIdx < student.scores.length - 1 && <span className="text-white mr-2">,</span>}
                                </span>
                            ))}
                            <span>]</span>
                            <span className="text-white">,</span>
                            <span className="text-green-600 ml-4 opacity-0 group-hover:opacity-100 transition-opacity"># {student.name}</span>
                        </div>
                    ))}
                </div>
                <div>]</div>

                {/* Dynamic Logic Visualization */}
                {showAverages && (
                    <div className="mt-8 border-t border-slate-700 pt-6 animate-pulse-once">
                         <div className="text-slate-500 mb-2"># 평균 계산 로직 실행 중...</div>
                         <div className="text-blue-300">for <span className="text-white">subject_idx</span> in <span className="text-yellow-300">range(3)</span>:</div>
                         <div className="pl-4">
                            <span className="text-white">total = 0</span>
                         </div>
                         <div className="pl-4 text-blue-300">for <span className="text-white">student</span> in <span className="text-purple-400">scores</span>:</div>
                         <div className="pl-8 text-white">
                             total += student[subject_idx]
                         </div>
                    </div>
                )}
            </div>
            
            {/* Badges Overlay */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
                {badges.map((b, i) => (
                    <div key={i} className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-lg flex items-center animate-bounce-short">
                        <Trophy size={12} className="mr-1" /> {b}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 animate-slide-up z-50">
            <Trophy className="text-yellow-400" />
            <span>{toast}</span>
        </div>
      )}
    </div>
  );
};