import React, { useState } from 'react';
import { Header } from './components/Header';
import { GridCanvas } from './components/GridCanvas';
import { AnalysisPanel } from './components/AnalysisPanel';
import { QuizPanel } from './components/QuizPanel';
import { createEmptyGrid, PRESET_CHECKERBOARD, PRESET_STRIPES, PRESET_FLAG_STYLE } from './utils/rle';
import { GridData, ColorType } from './types';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');
  const [grid, setGrid] = useState<GridData>(createEmptyGrid(10));
  const [selectedColor, setSelectedColor] = useState<ColorType>('black');

  const handlePreset = (type: 'stripe' | 'check' | 'flag') => {
    if (type === 'stripe') setGrid(PRESET_STRIPES(10));
    else if (type === 'check') setGrid(PRESET_CHECKERBOARD(10));
    else if (type === 'flag') setGrid(PRESET_FLAG_STYLE(10));
  };

  const handleReset = () => {
    setGrid(createEmptyGrid(10));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header currentTab={activeTab} setTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'learn' ? (
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left Column: Interactive Grid */}
            <div className="w-full lg:w-1/2 min-h-[500px] lg:h-[600px]">
              <GridCanvas
                grid={grid}
                setGrid={setGrid}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                onPresetSelect={handlePreset}
                onReset={handleReset}
              />
            </div>

            {/* Right Column: Analysis & Visualization */}
            <div className="w-full lg:w-1/2 min-h-[500px] lg:h-[600px]">
              <AnalysisPanel grid={grid} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-start py-8">
            <QuizPanel />
          </div>
        )}
      </main>

      {/* Footer / Learning Card */}
      <footer className="bg-white border-t border-slate-200 p-6 mt-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
             <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600">
                <Info size={24} />
             </div>
             <div>
                <h4 className="font-bold text-indigo-900 text-sm mb-1">오늘의 학습 핵심</h4>
                <ul className="text-sm text-indigo-800 space-y-1 list-disc list-inside">
                    <li><strong>Run-Length Encoding (RLE)</strong>는 연속되는 데이터를 (개수, 값) 쌍으로 표현합니다.</li>
                    <li>데이터의 색깔이 자주 바뀌지 않고 뭉쳐있을수록 압축 효율이 좋아집니다.</li>
                    <li>체크무늬처럼 색이 계속 바뀌면 오히려 데이터 크기가 커지는 <strong>역효과(Negative Compression)</strong>가 발생할 수 있습니다.</li>
                </ul>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;