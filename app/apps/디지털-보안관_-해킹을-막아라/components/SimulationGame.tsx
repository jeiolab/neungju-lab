import React, { useState, useEffect, useCallback } from 'react';
import { generateScenarios, generateFailureNews } from '../services/geminiService';
import { Scenario, SecurityRank, NewsReport } from '../types';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw, Trophy, Siren } from 'lucide-react';

export const SimulationGame: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animationClass, setAnimationClass] = useState('');
  const [newsReport, setNewsReport] = useState<NewsReport | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    const data = await generateScenarios();
    setScenarios(data);
    setCurrentIndex(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const getRank = (score: number) => {
    if (score >= 2000) return SecurityRank.WHITE_HACKER;
    if (score >= 1500) return SecurityRank.EXPERT;
    if (score >= 1000) return SecurityRank.SENIOR;
    if (score >= 500) return SecurityRank.JUNIOR;
    return SecurityRank.ROOKIE;
  };

  const handleAction = async (action: 'BLOCK' | 'ALLOW') => {
    if (feedback || newsReport) return; // Prevent double clicks

    const currentScenario = scenarios[currentIndex];
    
    // Logic:
    // If Scenario is Safe (isSafe: true) -> Correct action is ALLOW
    // If Scenario is Risky (isSafe: false) -> Correct action is BLOCK
    
    const isCorrect = (currentScenario.isSafe && action === 'ALLOW') || 
                      (!currentScenario.isSafe && action === 'BLOCK');

    if (action === 'BLOCK') {
        setAnimationClass('animate-slide-out-left');
    } else {
        setAnimationClass('animate-slide-out-right');
    }

    if (isCorrect) {
        const streakBonus = streak * 50;
        setScore(prev => prev + 100 + streakBonus);
        setStreak(prev => prev + 1);
        setFeedback({ isCorrect: true, message: "정확한 판단입니다! +100점" });
        
        setTimeout(() => {
            advanceCard();
        }, 1000);
    } else {
        setStreak(0);
        setFeedback({ isCorrect: false, message: "잘못된 판단입니다!" });
        
        // Generate Fail News
        const news = await generateFailureNews(currentScenario);
        setNewsReport(news);
    }
  };

  const advanceCard = () => {
    setAnimationClass('');
    setFeedback(null);
    setNewsReport(null);
    
    if (currentIndex >= scenarios.length - 1) {
        // Fetch more scenarios endlessly for the game
        setLoading(true);
        generateScenarios().then(newScenarios => {
            setScenarios(newScenarios);
            setCurrentIndex(0);
            setLoading(false);
        });
    } else {
        setCurrentIndex(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    fetchScenarios();
    setNewsReport(null);
    setFeedback(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-blue-500">
        <RefreshCw className="w-12 h-12 animate-spin mb-4" />
        <p className="text-lg font-medium text-slate-600">보안 시나리오 분석 중...</p>
      </div>
    );
  }

  const currentScenario = scenarios[currentIndex];

  return (
    <div className="flex flex-col items-center max-w-md mx-auto w-full relative">
      {/* HUD */}
      <div className="w-full flex justify-between items-center bg-white p-4 rounded-xl mb-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col">
           <span className="text-xs text-slate-500 font-bold tracking-wider">등급</span>
           <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
             <Shield className="w-4 h-4 text-blue-600" /> {getRank(score)}
           </span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold tracking-wider">연속</span>
            <span className="text-lg font-black text-blue-600">x{streak}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-bold tracking-wider">점수</span>
            <span className="text-xl font-mono text-slate-900">{score}</span>
        </div>
      </div>

      {/* Card Container */}
      <div className="relative w-full h-[450px] perspective-1000">
        {/* Failure Overlay / News Report */}
        {newsReport && (
            <div className="absolute inset-0 z-50 bg-slate-900/95 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 border-2 border-red-600 shadow-2xl">
                <div className="bg-red-600 text-white px-4 py-1 font-bold tracking-widest text-sm mb-4 animate-pulse flex items-center gap-2">
                    <Siren className="w-4 h-4" /> 속보
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                    {newsReport.headline}
                </h3>
                <p className="text-gray-300 mb-6 text-sm border-l-4 border-red-600 pl-4 text-left">
                    {newsReport.content}
                </p>
                <div className="bg-slate-800 p-4 rounded-lg mb-6 w-full text-left">
                     <p className="text-xs text-gray-400 uppercase mb-1">동아리 회장의 조언:</p>
                     <p className="text-sm text-blue-400 font-medium">{currentScenario.reasoning}</p>
                </div>
                <button 
                    onClick={advanceCard}
                    className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
                >
                    다음 상황 해결하기
                </button>
            </div>
        )}

        {/* Feedback Overlay (Success) */}
        {!newsReport && feedback && feedback.isCorrect && (
             <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                 <div className="bg-green-500/90 text-white px-6 py-4 rounded-xl font-bold text-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" /> {feedback.message}
                 </div>
             </div>
        )}

        {/* The Card */}
        <div className={`w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col ${animationClass} transition-transform`}>
           {/* Header Image Placeholder */}
           <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                {currentScenario.isSafe ? (
                    <Shield className="w-20 h-20 text-blue-500 opacity-80" />
                ) : (
                    <AlertTriangle className="w-20 h-20 text-orange-500 opacity-80" />
                )}
                <div className="absolute bottom-2 right-3 text-xs text-slate-400 font-mono">ID: {currentScenario.id}</div>
           </div>
           
           {/* Content */}
           <div className="flex-1 p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{currentScenario.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6 flex-1 flex items-center justify-center font-medium">
                "{currentScenario.description}"
              </p>
              
              <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 font-bold">
                디지털 보안관 판단 필요
              </div>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8 w-full px-4">
        <button 
            onClick={() => handleAction('BLOCK')}
            disabled={!!feedback || !!newsReport}
            className="flex-1 flex flex-col items-center justify-center p-4 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-500 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2 group-hover:bg-red-500 group-hover:text-white transition-colors text-red-500">
                <XCircle className="w-6 h-6" />
            </div>
            <span className="font-bold text-red-600 group-hover:text-red-700">차단 / 거절</span>
        </button>

        <button 
            onClick={() => handleAction('ALLOW')}
            disabled={!!feedback || !!newsReport}
            className="flex-1 flex flex-col items-center justify-center p-4 bg-white hover:bg-green-50 border border-slate-200 hover:border-green-500 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2 group-hover:bg-green-500 group-hover:text-white transition-colors text-green-500">
                <CheckCircle className="w-6 h-6" />
            </div>
            <span className="font-bold text-green-600 group-hover:text-green-700">허용 / 수락</span>
        </button>
      </div>
      
      <p className="mt-6 text-xs text-slate-500 text-center max-w-xs">
          정보 보안 동아리 회장 Tip: 상황을 신중하게 읽고, 조금이라도 의심스러우면 차단하세요.
      </p>
    </div>
  );
};