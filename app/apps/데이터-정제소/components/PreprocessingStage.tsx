import React, { useState, useEffect } from 'react';
import { DataRow, DatasetStats, ScenarioType } from '../types';
import { generateReviewDataset, generateSmartFarmDataset } from '../constants';
import { AlertTriangle, Trash2, Wand2, Timer, ArrowLeft } from 'lucide-react';

interface Props {
  scenarioType: ScenarioType;
  onComplete: (stats: DatasetStats) => void;
  onBack: () => void;
}

const TOTAL_ERRORS = 5;

// Define Schemas for different scenarios
interface ColumnDef {
  key: string;
  label: string;
  type: 'text' | 'number';
}

interface ScenarioConfig {
  columns: ColumnDef[];
  generator: () => DataRow[];
  validate: (row: DataRow, field: string) => 'MISSING' | 'OUTLIER' | 'DUPLICATE' | null;
  fixes: Record<string, 'DELETE' | 'MEAN' | 'CAP' | 'DEFAULT'>; // Simplified fix mapping
}

const CONFIGS: Record<ScenarioType, ScenarioConfig> = {
  REVIEWS: {
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'restaurant', label: '식당', type: 'text' },
      { key: 'rating', label: '평점 (0-5)', type: 'number' },
      { key: 'age', label: '작성자 나이', type: 'number' },
      { key: 'review', label: '리뷰 내용', type: 'text' },
    ],
    generator: generateReviewDataset,
    validate: (row, field) => {
      // Duplicates are checked globally in component, this is field level
      if (row[field] === null) return 'MISSING';
      if (field === 'age' && typeof row.age === 'number' && row.age > 100) return 'OUTLIER';
      if (field === 'rating' && typeof row.rating === 'number' && (row.rating > 5 || row.rating < 0)) return 'OUTLIER';
      return null;
    },
    fixes: {
      rating: 'CAP',
      age: 'MEAN',
    }
  },
  SMART_FARM: {
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'location', label: '구역 위치', type: 'text' },
      { key: 'temperature', label: '온도 (°C)', type: 'number' },
      { key: 'humidity', label: '습도 (%)', type: 'number' },
      { key: 'status', label: '상태', type: 'text' },
    ],
    generator: generateSmartFarmDataset,
    validate: (row, field) => {
      if (row[field] === null) return 'MISSING';
      if (field === 'temperature' && typeof row.temperature === 'number' && row.temperature > 100) return 'OUTLIER';
      if (field === 'humidity' && typeof row.humidity === 'number' && (row.humidity > 100 || row.humidity < 0)) return 'OUTLIER';
      return null;
    },
    fixes: {
      temperature: 'MEAN',
      humidity: 'MEAN',
    }
  }
};

const PreprocessingStage: React.FC<Props> = ({ scenarioType, onComplete, onBack }) => {
  const config = CONFIGS[scenarioType];
  const [data, setData] = useState<DataRow[]>(() => config.generator());
  const [selectedCell, setSelectedCell] = useState<{ id: number; field: string } | null>(null);
  const [fixedCount, setFixedCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Timer
  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const getErrorType = (row: DataRow, field: string): 'MISSING' | 'OUTLIER' | 'DUPLICATE' | null => {
    // 1. Duplicate check (Generic visual check for exact match on key fields)
    // For simplicity, we assume duplicate is if 'restaurant' or 'location' matches another row with same ID
    // Actually our generator creates identical duplicate rows (same ID).
    // So if another row exists with same ID, it's a duplicate.
    const duplicateCount = data.filter(r => r.id === row.id).length;
    if (duplicateCount > 1) return 'DUPLICATE';

    return config.validate(row, field);
  };

  const handleCellClick = (id: number, field: string) => {
    const row = data.find((r) => r.id === id);
    if (!row) return;

    const error = getErrorType(row, field);
    if (error) {
      setSelectedCell({ id, field });
    }
  };

  const applyFix = (action: 'DELETE_ROW' | 'FILL_MEAN' | 'CAP_VALUE') => {
    if (!selectedCell) return;
    const { id, field } = selectedCell;

    setData((prevData) => {
      let newData = [...prevData];
      const rowIndex = newData.findIndex(r => r.id === id); 

      if (action === 'DELETE_ROW') {
         newData.splice(rowIndex, 1);
      } else if (action === 'FILL_MEAN') {
        const validValues = prevData
            .map(r => r[field])
            .filter((v): v is number => typeof v === 'number' && v !== null && v <= 100); 
        const sum = validValues.reduce((a, b) => a + b, 0);
        const mean = validValues.length > 0 ? parseFloat((sum / validValues.length).toFixed(1)) : 0;
        
        newData[rowIndex] = { ...newData[rowIndex], [field]: mean };
      } else if (action === 'CAP_VALUE') {
          // Cap logic is specific, but let's assume 5.0 for rating, 100 for humidity if we had capping logic
          const cap = field === 'rating' ? 5.0 : 100;
          newData[rowIndex] = { ...newData[rowIndex], [field]: cap };
      }

      return newData;
    });

    setFixedCount(prev => prev + 1);
    setSelectedCell(null);
  };
  
  useEffect(() => {
    if (fixedCount >= TOTAL_ERRORS) {
      setIsTimerRunning(false);
      setTimeout(() => {
        onComplete({
            initialErrors: TOTAL_ERRORS,
            fixedErrors: fixedCount,
            remainingErrors: 0,
            qualityScore: 100,
            timeTaken: timeElapsed
        });
      }, 1000);
    }
  }, [fixedCount, onComplete, timeElapsed]);

  const renderModal = () => {
    if (!selectedCell) return null;
    const row = data.find(r => r.id === selectedCell.id);
    if (!row) return null;
    
    const errorType = getErrorType(row, selectedCell.field);
    const fixStrategy = config.fixes[selectedCell.field];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
          <div className="flex items-center space-x-3 mb-4 text-amber-600">
            <AlertTriangle className="w-8 h-8" />
            <h3 className="text-xl font-bold">문제 발견!</h3>
          </div>
          
          <p className="text-gray-600 mb-6 word-keep-all">
            {errorType === 'MISSING' && `"${selectedCell.field}" 값이 누락되었습니다.`}
            {errorType === 'OUTLIER' && `"${row[selectedCell.field]}" 값은 허용 범위를 벗어납니다.`}
            {errorType === 'DUPLICATE' && `ID #${row.id} 행이 중복되어 있습니다.`}
          </p>

          <div className="flex flex-col space-y-3">
            {errorType === 'MISSING' && (
              <>
                <button
                  onClick={() => applyFix('FILL_MEAN')}
                  className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <Wand2 className="w-4 h-4 mr-2" /> 평균값으로 채우기
                </button>
                <button
                  onClick={() => applyFix('DELETE_ROW')}
                  className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> 행 삭제
                </button>
              </>
            )}
            
            {errorType === 'OUTLIER' && (
               <>
                {fixStrategy === 'CAP' ? (
                    <button
                        onClick={() => applyFix('CAP_VALUE')}
                        className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                        <Wand2 className="w-4 h-4 mr-2" /> 정상 범위로 제한
                    </button>
                ) : (
                    <button
                        onClick={() => applyFix('DELETE_ROW')}
                         className="flex items-center justify-center w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                         <Trash2 className="w-4 h-4 mr-2" /> 행 삭제
                    </button>
                )}
               </>
            )}

            {errorType === 'DUPLICATE' && (
              <button
                onClick={() => applyFix('DELETE_ROW')}
                className="flex items-center justify-center w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 mr-2" /> 중복 제거
              </button>
            )}

            <button
              onClick={() => setSelectedCell(null)}
              className="mt-2 text-sm text-gray-400 hover:text-gray-600 underline"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>도구 선택으로 돌아가기</span>
        </button>
      </div>

      {/* HUD */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">2단계: 데이터 전처리</h2>
           <p className="text-gray-500 text-sm">
             {scenarioType === 'REVIEWS' ? '리뷰 데이터' : '센서 데이터'}에서 오류를 찾아 수정하세요.
           </p>
        </div>
        <div className="flex space-x-6">
            <div className="flex items-center space-x-2 text-gray-700">
                <Timer className="w-5 h-5 text-blue-600" />
                <span className="font-mono text-xl font-bold">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="text-right">
                    <span className="block text-xs text-gray-400 uppercase">진행 상황</span>
                    <span className="text-xl font-bold text-blue-600">{fixedCount} / {TOTAL_ERRORS}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  {config.columns.map((col) => (
                    <th key={col.key} className={`p-4 border-r border-gray-200 ${col.key === 'id' ? 'w-16 text-center' : ''}`}>
                      {col.label}
                    </th>
                  ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-mono text-sm text-gray-700">
                {data.map((row, index) => {
                  const duplicateCount = data.filter(r => r.id === row.id).length;
                  const isDuplicateVisual = duplicateCount > 1;
                  
                  return (
                    <tr 
                        key={`${row.id}-${index}`} 
                        className={`
                            hover:bg-blue-50 transition-colors cursor-pointer group
                            ${isDuplicateVisual ? 'bg-red-50/50' : ''}
                        `}
                        onClick={() => {
                            if (isDuplicateVisual) handleCellClick(row.id, config.columns[1].key); // Clicking first data col triggers dup fix
                        }}
                    >
                        {config.columns.map((col) => {
                          const val = row[col.key];
                          // Generic check for visual error style
                          let isError = false;
                          if (val === null) isError = true;
                          else if (config.validate(row, col.key) === 'OUTLIER') isError = true;

                          return (
                            <td 
                              key={col.key}
                              className={`
                                p-4 border-r border-gray-100 transition-colors
                                ${col.key === 'id' ? 'text-center text-gray-400 select-none' : ''}
                                ${isError ? 'bg-red-50 text-red-600 font-bold hover:bg-red-100' : ''}
                              `}
                              onClick={(e) => { 
                                if (col.key !== 'id') {
                                  e.stopPropagation(); 
                                  handleCellClick(row.id, col.key); 
                                }
                              }}
                            >
                              {val === null ? <span className="text-red-400 italic">NULL</span> : val}
                            </td>
                          );
                        })}
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
        
        {data.length === 0 && (
            <div className="p-12 text-center text-gray-500">모든 데이터를 삭제하셨나요? 너무 과감하시네요!</div>
        )}
      </div>
      
      <div className="mt-4 flex items-start space-x-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
        <InfoIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <p className="word-keep-all">팁: 값이 비어있거나 이상한 숫자, 혹은 붉은색으로 표시된 중복 행을 클릭하여 오류를 수정하세요.</p>
      </div>

      {renderModal()}
    </div>
  );
};

const InfoIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

export default PreprocessingStage;
