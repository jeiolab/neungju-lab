import React, { useState } from 'react';
import { ComparisonTable } from './components/ComparisonTable';
import { TextAnalyzer } from './components/TextAnalyzer';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { WordCloudView } from './components/WordCloudView';
import { RecommendationEngine } from './components/RecommendationEngine';
import { AnalysisType, HistoryItem } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType>(AnalysisType.TEXT);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [allTokens, setAllTokens] = useState<string[]>([]);

  const handleTextAnalyze = (text: string) => {
    setHistory(prev => [...prev, { type: 'text', content: text, timestamp: Date.now() }]);
    // In a real app, we would get tokens from the result. 
    // Here we'll do a simple split to populate the word cloud for demo purposes if not using the deep result passed up.
    // However, let's keep it simple: approximate tokens for the cloud.
    const newTokens = text.split(' ').filter(t => t.length > 1);
    setAllTokens(prev => [...prev, ...newTokens]);
  };

  const handleImageAnalyze = (label: string) => {
    setHistory(prev => [...prev, { type: 'image', content: label, timestamp: Date.now() }]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                D
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Unstructured Data Lab
              </h1>
            </div>
            
            <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: AnalysisType.TEXT, label: '텍스트 분석', icon: '📝' },
                { id: AnalysisType.IMAGE, label: '이미지 분석', icon: '🖼️' },
                { id: AnalysisType.COMPARE, label: '개념 비교', icon: '📊' },
                { id: AnalysisType.DASHBOARD, label: '워드 클라우드', icon: '☁️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2
                    ${activeTab === tab.id 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-full min-h-[600px]">
          {activeTab === AnalysisType.TEXT && (
            <div className="h-full animate-fade-in">
              <TextAnalyzer onAnalyze={handleTextAnalyze} />
            </div>
          )}
          
          {activeTab === AnalysisType.IMAGE && (
            <div className="h-full animate-fade-in">
              <ImageAnalyzer onAnalyze={handleImageAnalyze} />
            </div>
          )}
          
          {activeTab === AnalysisType.COMPARE && (
            <div className="h-full flex items-center justify-center animate-fade-in">
              <ComparisonTable />
            </div>
          )}

          {activeTab === AnalysisType.DASHBOARD && (
             <div className="h-full animate-fade-in flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-slate-800">☁️ 누적 데이터 워드 클라우드</h2>
                <p className="mb-6 text-slate-500">
                   지금까지 분석한 텍스트 데이터의 빈도수를 시각화합니다. 비정형 텍스트 데이터에서 주요 키워드를 한눈에 파악하는 방법입니다.
                </p>
                <div className="flex-1 min-h-[400px]">
                    <WordCloudView words={allTokens} />
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          © 2024 Unstructured Data Educational Lab. Powered by React, Tailwind & Gemini API.
        </div>
      </footer>

      {/* Recommendation Toast/Widget */}
      <RecommendationEngine history={history} />
    </div>
  );
};

export default App;
