'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Trophy, CheckCircle2, XCircle, ChevronRight, HelpCircle, MapPin, Sparkles, BrainCircuit, RotateCcw } from 'lucide-react';
import { IoTObject, ViewMode } from './types';
import { INITIAL_OBJECTS, QUIZ_QUESTIONS, ICON_MAP } from './constants';
import { fetchDetailedExplanation } from './services/geminiService';
import ConnectionDiagram from './components/ConnectionDiagram';
import Confetti from './components/Confetti';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

// Icon Component Helper
const IconComponent = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon size={size} className={className} /> : null;
};

const IoTExplorerApp: React.FC = () => {
  const [objects, setObjects] = useState<IoTObject[]>(INITIAL_OBJECTS);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('simulation');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const selectedObject = objects.find(o => o.id === selectedObjectId);
  const upgradedCount = objects.filter(o => o.isUpgraded).length;
  const allFound = upgradedCount === objects.length;

  useEffect(() => {
    if (allFound && !showLevelUp) {
      setShowLevelUp(true);
      // Wait a bit then auto-hide confetti if desired, but we keep modal open
    }
  }, [allFound]);

  const handleObjectClick = (id: string) => {
    setSelectedObjectId(id);
    setAiExplanation(""); // Reset AI text on new selection
  };

  const handleUpgrade = (id: string) => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, isUpgraded: true } : obj
    ));
  };

  const handleReset = () => {
    setObjects(INITIAL_OBJECTS);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setViewMode('simulation');
    setShowLevelUp(false);
    setSelectedObjectId(null);
    setAiExplanation("");
  };

  const handleAskAI = async () => {
    if (!selectedObject) return;
    setIsLoadingAi(true);
    const explanation = await fetchDetailedExplanation(
      selectedObject.name,
      selectedObject.isUpgraded ? selectedObject.iotDescription : selectedObject.normalDescription
    );
    setAiExplanation(explanation);
    setIsLoadingAi(false);
  };

  const handleQuizAnswer = (answer: boolean) => {
    const currentQ = QUIZ_QUESTIONS[quizIndex];
    if (currentQ.isCorrect === answer) {
      setQuizScore(prev => prev + 1);
      alert("정답입니다! " + currentQ.explanation);
    } else {
      alert("틀렸습니다. " + currentQ.explanation);
    }

    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-6 pb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setObjects(INITIAL_OBJECTS);
                  setViewMode('simulation');
                  setSelectedObjectId(null);
                  setQuizIndex(0);
                  setQuizScore(0);
                  setQuizCompleted(false);
                  setShowLevelUp(false);
                }} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">IoT 스마트 시티</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">스마트 시티로 업그레이드하며 사물 인터넷(IoT)을 배우는 인터랙티브 교육 게임입니다.</p>
                </div>
              </button>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
              <button 
                onClick={() => setViewMode('simulation')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'simulation' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                탐색 모드
              </button>
              <button 
                onClick={() => setViewMode('quiz')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'quiz' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                퀴즈
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex relative min-h-[600px]">
            
            {viewMode === 'simulation' && (
                <>
                    {/* Visual Area (Map/Scene) */}
                    <div className="flex-1 relative bg-slate-50 overflow-hidden group border border-slate-200 rounded-lg min-h-[600px]">

                    {/* Objects */}
                    {objects.map((obj) => (
                        <button
                            key={obj.id}
                            onClick={() => handleObjectClick(obj.id)}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 active:scale-95 flex flex-col items-center group/marker ${selectedObjectId === obj.id ? 'z-20 scale-110' : 'z-10'}`}
                            style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
                        >
                            <div className={`
                                p-3 rounded-full shadow-lg border-4 transition-colors
                                ${obj.isUpgraded 
                                    ? 'bg-blue-500 border-blue-200 text-white shadow-blue-500/50' 
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'
                                }
                                ${selectedObjectId === obj.id ? 'ring-4 ring-blue-400/30' : ''}
                            `}>
                                <IconComponent name={obj.iconName} />
                            </div>
                            
                            {/* Label */}
                            <span className={`
                                mt-2 px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-all
                                ${obj.isUpgraded ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}
                                ${selectedObjectId === obj.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover/marker:opacity-100 group-hover/marker:translate-y-0'}
                            `}>
                                {obj.name}
                            </span>

                            {/* Ripple Effect for Unfound */}
                            {!obj.isUpgraded && (
                                <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20 h-full w-full -z-10"></span>
                            )}
                        </button>
                    ))}
                    
                    {/* Instructions Overlay if nothing selected */}
                    {!selectedObjectId && (
                         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-slate-900 px-6 py-3 rounded-full border border-slate-200 shadow-xl flex items-center space-x-2 pointer-events-none">
                            <MapPin size={18} className="animate-bounce text-blue-600" />
                            <span className="font-medium">화면 속의 사물들을 찾아 클릭해보세요! ({upgradedCount}/{objects.length})</span>
                        </div>
                    )}
                </div>

                    {/* Side Panel (Details) */}
                    <div className={`
                        absolute md:relative bottom-0 w-full md:w-96 bg-white shadow-lg md:shadow-none border-l border-slate-200 
                        transform transition-transform duration-300 ease-in-out z-30
                        ${selectedObjectId ? 'translate-y-0' : 'translate-y-full md:translate-x-full md:translate-y-0'}
                        flex flex-col h-[60vh] md:h-full min-h-[600px]
                    `}>
                    {selectedObject ? (
                        <div className="flex flex-col h-full overflow-y-auto p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center space-x-2 text-blue-600 mb-1">
                                        <IconComponent name={selectedObject.iconName} size={20} />
                                        <span className="text-xs font-bold uppercase tracking-wider">{selectedObject.type} IoT</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedObject.name}</h2>
                                </div>
                                <button 
                                    onClick={() => setSelectedObjectId(null)}
                                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            {/* Status Card */}
                            <div className={`p-4 rounded-xl mb-6 border ${selectedObject.isUpgraded ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                <h3 className="text-sm font-bold mb-2 flex items-center">
                                    {selectedObject.isUpgraded ? <Sparkles size={16} className="mr-2 text-blue-500" /> : <HelpCircle size={16} className="mr-2 text-slate-400" />}
                                    {selectedObject.isUpgraded ? "스마트 IoT 상태" : "일반 상태"}
                                </h3>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    {selectedObject.isUpgraded ? selectedObject.iotDescription : selectedObject.normalDescription}
                                </p>
                            </div>

                            {/* Educational Content */}
                            {!selectedObject.isUpgraded ? (
                                <div className="mt-auto">
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-4">
                                        <p className="text-amber-800 text-sm font-medium mb-2">💡 IoT 아이디어</p>
                                        <p className="text-amber-700 text-xs">
                                            이 사물에 센서와 통신 기능을 연결하면 더 똑똑해질 수 있어요!
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleUpgrade(selectedObject.id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
                                    >
                                        <Sparkles size={20} />
                                        <span>IoT 기술로 업그레이드 하기</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Upgrade Success Message */}
                                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center">
                                        <CheckCircle2 size={16} className="mr-2" />
                                        {selectedObject.upgradeMessage}
                                    </div>

                                    {/* Data Flow */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 mb-3">데이터 흐름 (Data Flow)</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm">
                                                <span className="w-16 text-xs font-bold text-slate-500 uppercase">Input</span>
                                                <div className="flex-1 bg-slate-100 p-2 rounded border border-slate-200 text-slate-700">
                                                    {selectedObject.sensorData.input}
                                                </div>
                                            </div>
                                            <div className="flex justify-center text-slate-300">↓</div>
                                            <div className="flex items-center text-sm">
                                                <span className="w-16 text-xs font-bold text-slate-500 uppercase">Process</span>
                                                <div className="flex-1 bg-blue-50 p-2 rounded border border-blue-100 text-blue-700 font-medium">
                                                    {selectedObject.sensorData.processing}
                                                </div>
                                            </div>
                                            <div className="flex justify-center text-slate-300">↓</div>
                                            <div className="flex items-center text-sm">
                                                <span className="w-16 text-xs font-bold text-slate-500 uppercase">Output</span>
                                                <div className="flex-1 bg-slate-100 p-2 rounded border border-slate-200 text-slate-700">
                                                    {selectedObject.sensorData.output}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <ConnectionDiagram />

                                    {/* AI Tutor */}
                                    <div className="border-t border-slate-100 pt-6">
                                        <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center">
                                            <BrainCircuit size={16} className="mr-2 text-blue-600" />
                                            AI 튜터에게 물어보기
                                        </h4>
                                        {aiExplanation ? (
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {aiExplanation}
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={handleAskAI}
                                                disabled={isLoadingAi}
                                                className="w-full py-3 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center"
                                            >
                                                {isLoadingAi ? (
                                                    <span className="flex items-center"><span className="animate-spin mr-2">⏳</span> 선생님이 생각중이에요...</span>
                                                ) : (
                                                    "이 기술의 원리에 대해 더 자세히 알려줘!"
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400">
                            <MapPin size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">지도에서 사물을 클릭해<br/>상세 정보를 확인하세요.</p>
                        </div>
                    )}
                </div>
            </>
        )}

            {viewMode === 'quiz' && (
                <div className="flex-1 bg-slate-50 p-6 overflow-y-auto flex justify-center items-start border border-slate-200 rounded-lg">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-8">
                    <div className="text-center mb-8">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                            FINAL TEST
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">사물인터넷(IoT) 개념 퀴즈</h2>
                        <p className="text-slate-500">배운 내용을 확인해보세요!</p>
                    </div>

                    {!quizCompleted ? (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center text-sm font-medium text-slate-400">
                                <span>Question {quizIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                                <span>Score: {quizScore}</span>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 min-h-[160px] flex items-center justify-center">
                                <h3 className="text-xl font-bold text-slate-800 text-center leading-relaxed">
                                    {QUIZ_QUESTIONS[quizIndex].question}
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handleQuizAnswer(true)}
                                    className="h-32 rounded-xl bg-blue-50 border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-100 transition-all flex flex-col items-center justify-center group"
                                >
                                    <span className="text-6xl font-bold text-blue-300 group-hover:text-blue-600 transition-colors">O</span>
                                    <span className="text-blue-600 font-medium mt-2">그렇다</span>
                                </button>
                                <button 
                                    onClick={() => handleQuizAnswer(false)}
                                    className="h-32 rounded-xl bg-red-50 border-2 border-red-100 hover:border-red-500 hover:bg-red-100 transition-all flex flex-col items-center justify-center group"
                                >
                                    <span className="text-6xl font-bold text-red-300 group-hover:text-red-600 transition-colors">X</span>
                                    <span className="text-red-600 font-medium mt-2">아니다</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full mb-6">
                                <Trophy size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">퀴즈 완료!</h3>
                            <p className="text-lg text-slate-600 mb-8">
                                당신의 점수는 <strong className="text-blue-600">{quizScore} / {QUIZ_QUESTIONS.length}</strong> 점입니다.
                            </p>
                            
                            {allFound ? (
                                <>
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
                                        <h4 className="font-bold text-blue-800 mb-2">🎉 완벽합니다!</h4>
                                        <p className="text-blue-700 text-sm">
                                            모든 사물을 찾고 퀴즈까지 완료하셨군요.<br/>
                                            당신은 이제 진정한 IoT 전문가입니다!
                                        </p>
                                    </div>
                                    <button 
                                        onClick={handleReset}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center justify-center mx-auto shadow-md"
                                    >
                                        <RotateCcw size={20} className="mr-2" />
                                        처음부터 다시 시작하기
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                                    <button 
                                        onClick={() => {
                                            setQuizCompleted(false);
                                            setQuizIndex(0);
                                            setQuizScore(0);
                                            setViewMode('simulation');
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md"
                                    >
                                        탐색 모드로 돌아가 나머지 사물 찾기
                                    </button>
                                    <button 
                                        onClick={handleReset}
                                        className="text-slate-600 hover:bg-slate-100 hover:text-slate-700 font-medium py-3 px-8 rounded-full transition-all flex items-center justify-center"
                                    >
                                        <RotateCcw size={16} className="mr-2" />
                                        초기화하고 처음으로
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}

          </div>
        </div>
      </main>

      {/* Level Up / Completion Modal */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <Confetti />
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center transform animate-[scale-in_0.3s_ease-out]">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-200">
                    <Trophy size={48} className="text-white drop-shadow-md" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">명예 IoT 탐정 배지 획득!</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    축하합니다! 스마트 시티의 숨겨진<br/>
                    <strong className="text-blue-600">5개의 IoT 사물</strong>을 모두 찾았습니다.
                </p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => {
                            setShowLevelUp(false);
                            setViewMode('quiz');
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center"
                    >
                        <span>퀴즈 풀러 가기</span>
                        <ChevronRight size={20} className="ml-1" />
                    </button>
                    <button 
                        onClick={() => setShowLevelUp(false)}
                        className="w-full py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                    >
                        조금 더 둘러볼게요
                    </button>
                </div>
            </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default IoTExplorerApp;