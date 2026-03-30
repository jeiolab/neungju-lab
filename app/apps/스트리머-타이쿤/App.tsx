import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Studio from './components/Studio';
import Archive from './components/Archive';
import Manual from './components/Manual';
import Exam from './components/Exam';
import FutureTech from './components/FutureTech';
import { Tab, GameResult } from './types';
import { X, Trophy, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.STUDIO);
  const [subscribers, setSubscribers] = useState<number>(0);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // Load subscribers from local storage on mount
  useEffect(() => {
    const savedSubs = localStorage.getItem('streamTycoon_subs');
    if (savedSubs) {
      setSubscribers(parseInt(savedSubs));
    }
  }, []);

  // Save subscribers when they change
  useEffect(() => {
    localStorage.setItem('streamTycoon_subs', subscribers.toString());
  }, [subscribers]);

  const handleEarnSubscribers = (amount: number) => {
    setSubscribers(prev => prev + amount);
  };

  const handleGameEnd = (result: GameResult) => {
    setGameResult(result);
    if (result.success && result.subscribersGained > 0) {
      handleEarnSubscribers(result.subscribersGained);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        subscribers={subscribers} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden flex flex-col">
        <div className="flex-1 bg-white/50 rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden relative">
          
          {currentTab === Tab.STUDIO && <Studio onGameEnd={handleGameEnd} />}
          {currentTab === Tab.ARCHIVE && <Archive />}
          {currentTab === Tab.MANUAL && <Manual />}
          {currentTab === Tab.EXAM && <Exam onEarnSubscribers={handleEarnSubscribers} />}
          {currentTab === Tab.FUTURE && <FutureTech />}

          {/* Game Result Modal */}
          {gameResult && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 transition-transform">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${gameResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  {gameResult.success ? <Trophy className="w-8 h-8 text-green-600" /> : <AlertTriangle className="w-8 h-8 text-red-600" />}
                </div>
                
                <h2 className={`text-2xl font-bold mb-2 ${gameResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {gameResult.success ? '방송 성공!' : '방송 실패'}
                </h2>
                
                <p className="text-slate-600 mb-6">{gameResult.message}</p>
                
                {gameResult.subscribersGained > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-6">
                    <p className="font-bold text-green-800 text-lg">구독자 +{gameResult.subscribersGained}명 획득</p>
                  </div>
                )}

                <button 
                  onClick={() => setGameResult(null)}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> 닫기
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;