import React, { useState, useEffect } from 'react';
import { DataType, GameItem, UserStats } from '../types';
import { GAME_ITEMS } from '../constants';
import { Box, Play, RefreshCw, Beaker, Check, AlertCircle } from 'lucide-react';

interface Props {
  stats: UserStats;
  updateStats: (newStats: UserStats) => void;
}

const TabSimulation: React.FC<Props> = ({ stats, updateStats }) => {
  const [activeTab, setActiveTab] = useState<'game' | 'lab'>('game');
  
  // Game State
  const [currentItem, setCurrentItem] = useState<GameItem | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | null }>({ msg: '', type: null });

  // Lab State
  const [labInput, setLabInput] = useState('');
  const [labGuess, setLabGuess] = useState<DataType | null>(null);
  const [labResult, setLabResult] = useState<{ type: string; reason: string } | null>(null);

  useEffect(() => {
    pickNewItem();
  }, []);

  const pickNewItem = () => {
    const random = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
    setCurrentItem(random);
    setFeedback({ msg: '', type: null });
  };

  const handleDrop = (targetType: DataType) => {
    if (!currentItem) return;

    const isCorrect = currentItem.type === targetType;
    
    // Update Stats
    const currentMastery = stats.mastery[currentItem.type] || 0;
    let newMastery = isCorrect ? Math.min(100, currentMastery + 8) : Math.max(0, currentMastery - 5);
    
    const newStats = {
      ...stats,
      xp: stats.xp + (isCorrect ? 5 : 0),
      mastery: {
        ...stats.mastery,
        [currentItem.type]: newMastery
      }
    };
    updateStats(newStats);

    if (isCorrect) {
      setScore(score + 10);
      setFeedback({ msg: '정확합니다! +5 XP', type: 'success' });
      setTimeout(pickNewItem, 1000);
    } else {
      setFeedback({ msg: `틀렸습니다. ${getErrorHint(currentItem.type)}`, type: 'error' });
    }
  };

  const getErrorHint = (type: DataType) => {
    switch(type) {
      case DataType.INT: return '소수점이 없고 따옴표도 없는 정수입니다.';
      case DataType.FLOAT: return '소수점이 있는 숫자(실수)입니다.';
      case DataType.STR: return '따옴표로 감싸진 문자열입니다.';
      case DataType.BOOL: return '참(True) 혹은 거짓(False)인 불입니다.';
      default: return '';
    }
  };

  const runLabExperiment = () => {
    if (!labGuess) {
      alert("예상되는 자료형을 먼저 선택해주세요!");
      return;
    }

    const val = labInput.trim();
    let detectedType = DataType.STR;
    let reason = "기본적으로 문자로 처리됩니다.";

    // Simple Parser Logic mimicking Python basic literals
    if (/^".*"$/.test(val) || /^'.*'$/.test(val)) {
        detectedType = DataType.STR;
        reason = "따옴표로 감싸져 있어 문자열(str)입니다.";
    } else if (val === 'True' || val === 'False') {
        detectedType = DataType.BOOL;
        reason = "True/False는 불(bool) 키워드입니다.";
    } else if (!isNaN(Number(val)) && val !== '') {
        if (val.includes('.')) {
            detectedType = DataType.FLOAT;
            reason = "소수점이 포함된 숫자라 실수(float)입니다.";
        } else {
            detectedType = DataType.INT;
            reason = "소수점이 없는 숫자라 정수(int)입니다.";
        }
    } else {
        // Variable name or complex string without quotes (in Python strict sense, without quotes it's a variable reference)
        // But for this level, we tell them it's likely a variable name or error if not defined.
        // Let's treat valid identifiers as potential variables, else SyntaxError.
        // For simplicity, we just say: "Without quotes, this looks like a variable name."
         detectedType = DataType.VARIABLE;
         reason = "따옴표가 없으면 변수 이름이나 키워드로 해석됩니다.";
    }

    setLabResult({
        type: detectedType,
        reason: reason
    });

    // Update stats if guess was correct
    if (detectedType === labGuess) {
         updateStats({ ...stats, xp: stats.xp + 2 });
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
        {/* Toggle Header */}
        <div className="flex bg-slate-200 p-1 rounded-lg mb-6">
            <button 
                className={`flex-1 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'game' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('game')}
            >
                분류 게임
            </button>
            <button 
                className={`flex-1 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'lab' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('lab')}
            >
                마이크로 실험실
            </button>
        </div>

        {activeTab === 'game' && (
            <div className="space-y-6">
                <div className="text-center py-8 bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-2 right-4 text-xs font-bold text-slate-400">Score: {score}</div>
                    
                    <h3 className="text-slate-500 text-sm mb-4 font-medium uppercase tracking-wider">이 데이터는 어느 그릇에 갈까요?</h3>
                    
                    {currentItem ? (
                        <div className="inline-block px-8 py-6 bg-slate-800 text-white text-3xl font-mono rounded-xl shadow-lg border-2 border-slate-700">
                            {currentItem.value}
                        </div>
                    ) : (
                        <button onClick={pickNewItem} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">시작하기</button>
                    )}

                    {feedback.msg && (
                        <div className={`mt-4 font-bold ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'} animate-bounce`}>
                            {feedback.msg}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { type: DataType.INT, label: '정수 (int)', color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
                        { type: DataType.FLOAT, label: '실수 (float)', color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' },
                        { type: DataType.STR, label: '문자열 (str)', color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' },
                        { type: DataType.BOOL, label: '불 (bool)', color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
                    ].map(bowl => (
                        <button
                            key={bowl.type}
                            onClick={() => handleDrop(bowl.type)}
                            className={`h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${bowl.color}`}
                        >
                            <Box size={32} className="mb-2 opacity-50"/>
                            <span className="font-bold">{bowl.label}</span>
                        </button>
                    ))}
                </div>
                
                <p className="text-center text-xs text-slate-400">카드를 보고 알맞은 그릇을 클릭하세요.</p>
            </div>
        )}

        {activeTab === 'lab' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold text-lg">
                    <Beaker /> 실험실: 값 분석기
                </div>
                <p className="text-sm text-slate-600 mb-6">값을 입력하고 Python이 어떻게 해석할지 예상해보세요.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">입력값 (Value)</label>
                        <input 
                            type="text" 
                            value={labInput}
                            onChange={(e) => { setLabInput(e.target.value); setLabResult(null); }}
                            className="w-full font-mono text-lg p-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                            placeholder="예: 10, 'hello', 3.14"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">나의 예상 (Prediction)</label>
                        <div className="flex gap-2 flex-wrap">
                            {[DataType.INT, DataType.FLOAT, DataType.STR, DataType.BOOL].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setLabGuess(t)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-bold border ${labGuess === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={runLabExperiment}
                        className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                    >
                        <Play size={18} /> 실행 (Run Type Check)
                    </button>

                    {labResult && (
                        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fadeIn">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-500 font-bold">실행 결과:</span>
                                {labGuess === labResult.type ? (
                                    <span className="text-green-600 font-bold text-sm flex items-center gap-1"><Check size={14}/> 예측 성공 (+2XP)</span>
                                ) : (
                                    <span className="text-amber-600 font-bold text-sm flex items-center gap-1"><AlertCircle size={14}/> 예측 실패</span>
                                )}
                            </div>
                            <div className="font-mono text-xl text-indigo-700 font-bold mb-2">
                                &lt;class '{labResult.type}'&gt;
                            </div>
                            <p className="text-sm text-slate-700 leading-snug bg-white p-3 rounded border border-slate-100">
                                <span className="font-bold text-indigo-500">코치 피드백:</span> {labResult.reason}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default TabSimulation;