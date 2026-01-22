import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, Sparkles, Save, RotateCcw, Trash2, History, School, 
  Plus, Minus, Crown, X, AlertTriangle, CheckCircle, 
  Download, Upload, UserMinus
} from 'lucide-react';

interface ModalConfig {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'history';
  title: string;
  message: string;
  onConfirm: (() => void) | null;
}

const SmartRandomPairMatcher: React.FC = () => {
  // ==========================================
  // 1. 상태 관리 (State Management)
  // ==========================================
  
  const [totalClasses, setTotalClasses] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('totalClasses_v5');
      return saved ? parseInt(saved) : 6;
    }
    return 6;
  });

  const [selectedClass, setSelectedClass] = useState<number>(1);
  const [totalStudents, setTotalStudents] = useState<number>(26);
  const [pairs, setPairs] = useState<number[][]>([]);
  const [joker, setJoker] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [history, setHistory] = useState<Set<string>>(new Set());
  
  // v5.0 신규 기능: 결석생 관리 (Set of numbers)
  const [absentStudents, setAbsentStudents] = useState<Set<number>>(new Set());
  const [isAbsentMode, setIsAbsentMode] = useState<boolean>(false); // 결석 관리 모드 토글

  // 모달 상태
  const [modalConfig, setModalConfig] = useState<ModalConfig>({ 
    isOpen: false, 
    type: 'alert', 
    title: '', 
    message: '', 
    onConfirm: null 
  });

  const isLoaded = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // 파일 업로드용

  // ==========================================
  // 2. 데이터 로드 & 저장 (Data Persistence)
  // ==========================================
  
  useEffect(() => {
    localStorage.setItem('totalClasses_v5', totalClasses.toString());
  }, [totalClasses]);

  const loadClassData = useCallback((classId: number) => {
    const storageKey = `classData_v5_${classId}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTotalStudents(parsed.count || 26);
        setHistory(new Set(parsed.history || []));
        setPairs(parsed.currentPairs || []);
        setJoker(parsed.currentJoker || null);
        setAbsentStudents(new Set(parsed.absent || [])); // 결석생 정보 로드
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    } else {
      // 초기화
      setTotalStudents(26);
      setHistory(new Set());
      setPairs([]);
      setJoker(null);
      setAbsentStudents(new Set());
    }
    isLoaded.current = true;
  }, []);

  useEffect(() => {
    isLoaded.current = false;
    loadClassData(selectedClass);
  }, [selectedClass, loadClassData]);

  // 자동 저장 (결석생 정보도 포함)
  useEffect(() => {
    if (isLoaded.current) {
      const storageKey = `classData_v5_${selectedClass}`;
      const dataToSave = {
        count: totalStudents,
        history: [...history],
        currentPairs: pairs,
        currentJoker: joker,
        absent: [...absentStudents]
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [totalStudents, history, pairs, joker, absentStudents, selectedClass]);


  // 학생 수 조절
  const updateStudentCount = (newCount: number) => {
    setTotalStudents(newCount);
    // 학생 수가 줄어들면, 범위를 벗어난 결석생 정보 제거
    if (newCount < totalStudents) {
      const validAbsents = new Set([...absentStudents].filter(n => n <= newCount));
      setAbsentStudents(validAbsents);
    }
  };

  const adjustClassCount = (delta: number) => {
    setTotalClasses(prev => {
      const newCount = Math.max(1, Math.min(20, prev + delta));
      if (selectedClass > newCount) setSelectedClass(newCount);
      return newCount;
    });
  };

  // ==========================================
  // 3. 백업 및 복구 (Backup & Restore)
  // ==========================================
  
  const showAlert = useCallback((title: string, message: string) => {
    setModalConfig({ isOpen: true, type: 'alert', title, message, onConfirm: null });
  }, []);

  const exportData = () => {
    // 모든 반의 데이터를 하나의 객체로 묶음
    const allData: any = {
      version: 'v5.0',
      timestamp: new Date().toISOString(),
      totalClasses,
      classes: {}
    };

    for (let i = 1; i <= totalClasses; i++) {
      const key = `classData_v5_${i}`;
      const data = localStorage.getItem(key);
      if (data) allData.classes[i] = JSON.parse(data);
    }

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // 파일명 생성: YYYYMMDD_반이름_짝꿍매칭.json
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    a.download = `${dateStr}_${selectedClass}반_짝꿍매칭.json`;
    a.click();
    showAlert('백업 완료', '모든 반의 데이터가 파일로 저장되었습니다.\n이 파일을 잘 보관해주세요.');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        // Strict check to ensure result is a string
        if (typeof result !== 'string') return;

        const data = JSON.parse(result);
        if (!data.version || !data.classes) throw new Error('올바르지 않은 파일 형식');

        if (window.confirm(`[${data.timestamp.slice(0,10)}] 시점의 데이터로 복구하시겠습니까?\n현재 데이터는 덮어씌워집니다.`)) {
          setTotalClasses(data.totalClasses);
          localStorage.setItem('totalClasses_v5', data.totalClasses);

          Object.keys(data.classes).forEach(cls => {
            localStorage.setItem(`classData_v5_${cls}`, JSON.stringify(data.classes[cls]));
          });

          // 현재 화면 새로고침
          loadClassData(selectedClass);
          showAlert('복구 완료', '데이터가 성공적으로 복구되었습니다.');
        }
      } catch (err) {
        showAlert('오류', '파일을 읽는 중 문제가 발생했습니다.\n올바른 백업 파일인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // ==========================================
  // 4. 모달 핸들러
  // ==========================================

  const showConfirm = (title: string, message: string, onConfirmAction: () => void) => {
    setModalConfig({ 
      isOpen: true, 
      type: 'confirm', 
      title, 
      message, 
      onConfirm: () => {
        onConfirmAction();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // ==========================================
  // 5. 스마트 매칭 알고리즘 (결석생 처리 추가)
  // ==========================================
  const generateSmartPairs = useCallback(() => {
    // 결석생 확인
    const activeStudentsCount = totalStudents - absentStudents.size;
    if (activeStudentsCount < 2) {
      showAlert('인원 부족', '최소 2명의 학생이 있어야 추첨이 가능합니다.');
      return;
    }

    setIsShuffling(true);

    setTimeout(() => {
      let bestPairs: number[][] = [];
      let bestJoker: number | null = null;
      let minConflicts = Infinity;

      for (let attempt = 0; attempt < 500; attempt++) {
        // 결석생 제외한 명단 생성
        const students = Array.from({ length: totalStudents }, (_, i) => i + 1)
                            .filter(n => !absentStudents.has(n));
        
        // Shuffle
        for (let i = students.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [students[i], students[j]] = [students[j], students[i]];
        }

        let currentJoker: number | null = null;
        if (students.length % 2 !== 0) {
          currentJoker = students.pop() || null;
        }

        const currentPairs: number[][] = [];
        let conflicts = 0;

        for (let i = 0; i < students.length; i += 2) {
          const s1 = students[i];
          const s2 = students[i+1];
          const pairKey = s1 < s2 ? `${s1}-${s2}` : `${s2}-${s1}`;
          
          if (history.has(pairKey)) conflicts++;
          currentPairs.push([s1, s2]);
        }

        if (conflicts < minConflicts) {
          minConflicts = conflicts;
          bestPairs = currentPairs;
          bestJoker = currentJoker;
        }
        if (minConflicts === 0) break; 
      }

      setPairs(bestPairs);
      setJoker(bestJoker);
      setIsShuffling(false);
      setIsAbsentMode(false); // 추첨 후 결석 관리 모드 종료
    }, 800);
  }, [totalStudents, history, absentStudents, showAlert]);

  // ==========================================
  // 6. 결석생 토글 핸들러
  // ==========================================
  const toggleAbsent = (studentNum: number) => {
    const newAbsents = new Set(absentStudents);
    if (newAbsents.has(studentNum)) {
      newAbsents.delete(studentNum);
    } else {
      newAbsents.add(studentNum);
    }
    setAbsentStudents(newAbsents);
  };

  // ==========================================
  // 7. 액션 버튼 핸들러
  // ==========================================
  const confirmAndSave = () => {
    if (pairs.length === 0) return;
    
    showConfirm(
      '결과 저장',
      '현재 짝꿍 조합을 저장하시겠습니까?\n(다음 추첨 시 중복 방지)',
      () => {
        const newHistory = new Set(history);
        pairs.forEach(pair => {
          const pairKey = pair[0] < pair[1] ? `${pair[0]}-${pair[1]}` : `${pair[1]}-${pair[0]}`;
          newHistory.add(pairKey);
        });
        setHistory(newHistory);
        // Explicit save handled by useEffect, but we force update via state change
        showAlert('저장 완료', `✅ ${selectedClass}반 결과가 저장되었습니다.`);
      }
    );
  };

  const clearClassHistory = () => {
    showConfirm(
      '기록 초기화',
      `정말 [${selectedClass}반]의 기록을 초기화하시겠습니까?\n\n주의: 누적된 매칭 기록이 모두 삭제됩니다.`,
      () => {
        setHistory(new Set());
        // 결석생 정보는 유지할지 여부 -> 보통 초기화면 다 지우는 게 깔끔
        setAbsentStudents(new Set());
        setPairs([]);
        setJoker(null);
        showAlert('초기화 완료', `${selectedClass}반이 초기화되었습니다.`);
      }
    );
  };

  const resetCurrentView = () => {
    if(window.confirm("현재 화면만 지우시겠습니까? (기록은 유지됨)")) {
      setPairs([]);
      setJoker(null);
    }
  };

  // ==========================================
  // 8. UI 렌더링
  // ==========================================
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20 relative">
      {/* Header */}
      <header className="max-w-7xl mx-auto p-4 md:p-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <Sparkles size={28} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                지능형 짝꿍 배치 시스템
              </h1>
              <p className="text-slate-500 text-xs md:text-sm">교사용 지능형 짝꿍 배치 시스템</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => updateStudentCount(Math.max(2, totalStudents - 1))}
              className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xl transition text-slate-500 hover:text-slate-900"
            >-</button>
            <div className="text-center px-4">
              <span className="text-xs text-slate-500 block font-bold mb-1">STUDENTS</span>
              <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
            </div>
            <button 
              onClick={() => updateStudentCount(Math.min(50, totalStudents + 1))}
              className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xl transition text-slate-500 hover:text-slate-900"
            >+</button>
          </div>
        </div>

        {/* Class Tabs & Backup Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide flex-grow">
            {Array.from({ length: totalClasses }, (_, i) => i + 1).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-lg transition-all border-b-4
                  ${selectedClass === cls 
                    ? 'bg-slate-100 text-purple-600 border-purple-500' 
                    : 'bg-white text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'}
                `}
              >
                <School size={18} />
                {cls}반
              </button>
            ))}
            
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-200">
              <button onClick={() => adjustClassCount(-1)} className="p-2 rounded-lg bg-white hover:bg-slate-100 hover:text-red-600 transition text-slate-500" title="반 삭제"><Minus size={16} /></button>
              <button onClick={() => adjustClassCount(1)} className="p-2 rounded-lg bg-white hover:bg-slate-100 hover:text-blue-600 transition text-slate-500" title="반 추가"><Plus size={16} /></button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <input type="file" ref={fileInputRef} onChange={importData} className="hidden" accept=".json" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 text-slate-600 transition shadow-sm" title="데이터 불러오기">
              <Upload size={16} /> 복구
            </button>
            <button onClick={exportData} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 text-slate-600 transition shadow-sm" title="데이터 백업하기">
              <Download size={16} /> 백업
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Info & Absent Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-2 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="bg-purple-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">{selectedClass}</span>
              반 매칭 시스템
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-slate-500 text-sm flex items-center gap-2">
                <History size={14} />
                누적: <span className="text-purple-600 font-bold">{history.size}</span>쌍
              </p>
              {history.size > 0 && (
                <button onClick={() => setModalConfig({ isOpen: true, type: 'history', title: '누적 기록', message: '', onConfirm: null })} className="text-xs bg-white text-slate-600 px-2 py-1 rounded border border-slate-300 hover:bg-slate-50">
                  기록 보기
                </button>
              )}
            </div>
          </div>

          {/* 결석 관리 버튼 */}
          <button 
            onClick={() => setIsAbsentMode(!isAbsentMode)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border
              ${isAbsentMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}
            `}
          >
            {isAbsentMode ? <CheckCircle size={18} /> : <UserMinus size={18} />}
            {isAbsentMode ? '관리 완료' : `결석 관리 (${absentStudents.size}명)`}
          </button>
        </div>

        {/* 결석 관리 모드 화면 (Student Grid) */}
        {isAbsentMode && (
          <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <UserMinus size={20} className="text-red-500" />
              오늘 결석한 학생을 선택해주세요
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
              {Array.from({ length: totalStudents }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => toggleAbsent(num)}
                  className={`
                    h-12 rounded-lg font-bold text-lg transition-all flex items-center justify-center border
                    ${absentStudents.has(num) 
                      ? 'bg-red-100 text-red-700 border-red-300' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 mt-4">선택된 학생은 이번 추첨에서 제외됩니다.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={generateSmartPairs}
            disabled={isShuffling || isAbsentMode}
            className={`
              group relative px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl flex-grow md:flex-grow-0 justify-center
              ${isShuffling || isAbsentMode
                ? 'bg-slate-200 cursor-not-allowed text-slate-400' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-purple-500/30 text-white'}
            `}
          >
            {isShuffling ? (
              <span className="flex items-center gap-3"><RotateCcw className="animate-spin" /> 섞는 중...</span>
            ) : isAbsentMode ? (
              <span className="flex items-center gap-3">👆 결석생 선택 중...</span>
            ) : (
              <span className="flex items-center gap-3">🎲 {selectedClass}반 추첨 시작</span>
            )}
          </button>

          <div className="flex gap-2 flex-grow md:flex-grow-0 justify-center">
            <button
              onClick={confirmAndSave}
              disabled={pairs.length === 0}
              className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-lg flex items-center gap-2 transition-colors shadow-lg"
            >
              <Save size={20} /> 저장
            </button>
            <button
              onClick={clearClassHistory}
              className="px-4 py-4 rounded-2xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 font-bold text-lg flex items-center gap-2 transition-colors border border-slate-200 shadow-sm"
              title="초기화"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Result Area */}
        {pairs.length > 0 && (
          <div className="animate-in fade-in zoom-in duration-500">
            {joker && (
              <div className="flex justify-center mb-10">
                <div className="bg-gradient-to-b from-yellow-400 to-orange-500 p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition duration-300">
                  <div className="bg-white px-10 py-6 rounded-xl flex flex-col items-center">
                    <span className="text-yellow-600 text-xs font-bold mb-2 uppercase tracking-widest border border-yellow-200 bg-yellow-50 px-2 py-1 rounded">Wild Card</span>
                    <div className="text-6xl font-black text-slate-900 mb-2">{joker}</div>
                    <span className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Crown size={24} className="text-yellow-500" /> 깍두기
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {pairs.map((pair, idx) => (
                <div key={idx} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-purple-500 transition-all duration-300 shadow-md relative">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-purple-500 uppercase">Team {idx + 1}</span>
                    <Users size={14} className="text-slate-400" />
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-800 shadow-inner group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">{pair[0]}</div>
                    <div className="h-1 w-4 bg-slate-200 rounded-full"></div>
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-800 shadow-inner group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">{pair[1]}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
               <button onClick={resetCurrentView} className="text-slate-500 text-sm hover:text-slate-700 underline decoration-slate-300">
                 현재 화면만 닫기
               </button>
            </div>
          </div>
        )}

        {pairs.length === 0 && !isShuffling && !isAbsentMode && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
            <Sparkles size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="text-xl text-slate-500">버튼을 눌러 <span className="text-purple-600 font-bold">{selectedClass}반</span>의 새로운 짝을 찾아보세요!</p>
            {absentStudents.size > 0 && <p className="text-red-500 text-sm mt-2 font-bold">⚠️ 현재 {absentStudents.size}명의 결석생이 제외됩니다.</p>}
          </div>
        )}
      </main>

      {/* Universal Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all scale-100">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {modalConfig.type === 'history' ? <History size={20} className="text-purple-500"/> : 
                 modalConfig.type === 'alert' ? <CheckCircle size={20} className="text-emerald-500"/> :
                 <AlertTriangle size={20} className="text-yellow-500"/>}
                {modalConfig.title}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition bg-white border border-slate-200 p-1 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {modalConfig.type === 'history' ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 text-center mb-2">{selectedClass}반 누적 매칭 기록</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[...history].map((pairStr, i) => {
                      const [a, b] = pairStr.split('-');
                      return (
                        <div key={i} className="bg-slate-50 rounded p-2 text-center border border-slate-200 text-slate-700 text-xs font-mono">
                          {a} ↔ {b}
                        </div>
                      )
                    })}
                  </div>
                  {history.size === 0 && <p className="text-center text-slate-400 py-4">기록이 없습니다.</p>}
                </div>
              ) : (
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-center">{modalConfig.message}</p>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-center">
              {modalConfig.type === 'confirm' ? (
                <>
                  <button onClick={closeModal} className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors">취소</button>
                  <button onClick={() => modalConfig.onConfirm?.()} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg">확인</button>
                </>
              ) : (
                <button onClick={closeModal} className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors w-full">닫기</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRandomPairMatcher;