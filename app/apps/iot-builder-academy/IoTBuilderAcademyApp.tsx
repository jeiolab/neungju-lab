'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { LEVELS, COMPONENTS } from './constants';
import { IoTComponent, Level, ComponentType } from './types';
import { IconMap } from './components/IconMap';
import { Confetti } from './components/Confetti';
import { getAiFeedback } from './services/geminiService';
import { Loader2, Play, RefreshCcw, Info, CheckCircle2, AlertCircle, Box, Home } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const TYPE_LABELS: Record<ComponentType, string> = {
  [ComponentType.SENSOR]: '센서 (입력)',
  [ComponentType.NETWORK]: '네트워크 (통신)',
  [ComponentType.PLATFORM]: '플랫폼 (처리)',
  [ComponentType.ACTUATOR]: '액추에이터 (출력/서비스)',
};

const IoTBuilderAcademyApp: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [placedComponents, setPlacedComponents] = useState<Record<string, string | null>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [draggedItem, setDraggedItem] = useState<IoTComponent | null>(null);

  const currentLevel = LEVELS[currentLevelIdx];

  // Reset state when level changes
  useEffect(() => {
    const initialPlaced: Record<string, string | null> = {};
    currentLevel.slots.forEach(slot => {
      initialPlaced[slot.id] = null;
    });
    setPlacedComponents(initialPlaced);
    setIsSuccess(false);
    setFeedback(null);
  }, [currentLevelIdx]);

  const handleDragStart = (component: IoTComponent) => {
    setDraggedItem(component);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (slotId: string, acceptedTypes: ComponentType[]) => {
    if (!draggedItem) return;

    // Check type compatibility
    if (!acceptedTypes.includes(draggedItem.type)) {
      const typeNames = acceptedTypes.map(t => TYPE_LABELS[t]).join(', ');
      setFeedback(`'${draggedItem.name}'은(는) 여기에 놓을 수 없어요! 이곳엔 [${typeNames}]만 들어갈 수 있습니다.`);
      return;
    }

    setPlacedComponents(prev => ({
      ...prev,
      [slotId]: draggedItem.id
    }));
    setFeedback(null); // Clear previous errors on successful drop
    setDraggedItem(null);
  };

  const handleCheckSolution = async () => {
    let isCorrect = true;
    
    // Local Verification first
    Object.entries(currentLevel.solution).forEach(([slotId, correctId]) => {
      const userChoice = placedComponents[slotId];
      if (userChoice !== correctId) {
        isCorrect = false;
      }
    });

    // Also check if all slots are filled
    const allFilled = Object.values(placedComponents).every(val => val !== null);

    if (!allFilled) {
      setFeedback("시스템을 가동하기 전에 빈 슬롯을 모두 채워주세요!");
      return;
    }

    if (isCorrect) {
      setIsSuccess(true);
      setFeedback("시스템 정상 작동! 아주 잘했어요!");
    } else {
      setIsSuccess(false);
      setIsLoadingAi(true);
      // Fallback message while loading
      setFeedback("시스템 점검 실패. 원인 분석 중...");

      // Call Gemini for detailed feedback
      const aiMsg = await getAiFeedback(currentLevel, placedComponents as Record<string, string>, COMPONENTS);
      setFeedback(aiMsg);
      setIsLoadingAi(false);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      alert("모든 레벨을 완료했습니다! 처음으로 돌아갑니다.");
      setCurrentLevelIdx(0);
    }
  };

  const handleGoHome = () => {
    if (window.confirm("정말 처음으로 돌아가시겠습니까? 현재 진행 상황이 초기화됩니다.")) {
      setCurrentLevelIdx(0);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      {isSuccess && <Confetti />}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-6 pb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleGoHome} 
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
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">IoT 빌더 아카데미</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">드래그 앤 드롭으로 사물 인터넷(IoT) 시스템을 만들며 학습하는 인터랙티브 교육용 앱입니다.</p>
                </div>
              </button>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:block bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-medium border border-blue-100">
                  미션: {currentLevel.mission}
                </div>
                <button
                  onClick={handleGoHome}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  title="처음으로 (홈)"
                >
                  <Home size={20} className="text-slate-500" />
                </button>
                <button
                  onClick={() => setCurrentLevelIdx(currentLevelIdx)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  title="현재 레벨 초기화"
                >
                  <RefreshCcw size={20} className="text-slate-500" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Game Area */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* Canvas / Workspace */}
        <div className="flex-1 p-6 relative flex flex-col">
          
          {/* Mission Banner for Mobile */}
          <div className="md:hidden mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
            <strong>미션:</strong> {currentLevel.mission}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            {/* Connection Lines (Visual only, positioned absolutely behind) */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block" />

            {/* Slots Container */}
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl">
              {currentLevel.slots.map((slot, index) => {
                const filledComponentId = placedComponents[slot.id];
                const componentData = filledComponentId ? COMPONENTS.find(c => c.id === filledComponentId) : null;
                
                // Get display names for accepted types
                const acceptedLabels = slot.acceptedTypes.map(t => TYPE_LABELS[t].split(' ')[0]).join('/');

                return (
                  <div key={slot.id} className="flex flex-col items-center gap-2 group">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      {index + 1}. {slot.label}
                    </div>
                    
                    <div
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(slot.id, slot.acceptedTypes)}
                      className={`
                        w-32 h-32 md:w-40 md:h-40 rounded-xl border-2 flex items-center justify-center transition-all duration-300 relative
                        ${componentData 
                          ? 'bg-white border-blue-500 shadow-md scale-105' 
                          : 'bg-slate-100 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
                        }
                      `}
                    >
                      {componentData ? (
                        <div className="flex flex-col items-center text-center p-2 animate-in fade-in zoom-in duration-200">
                          <div className={`
                            p-3 rounded-full mb-2 
                            ${componentData.type === ComponentType.SENSOR ? 'bg-blue-100 text-blue-600' : ''}
                            ${componentData.type === ComponentType.NETWORK ? 'bg-blue-100 text-blue-600' : ''}
                            ${componentData.type === ComponentType.PLATFORM ? 'bg-blue-100 text-blue-600' : ''}
                            ${componentData.type === ComponentType.ACTUATOR ? 'bg-emerald-100 text-emerald-600' : ''}
                          `}>
                             <IconMap name={componentData.iconName} size={32} />
                          </div>
                          <span className="text-sm font-semibold leading-tight break-keep">{componentData.name}</span>
                          <button 
                            onClick={() => setPlacedComponents(prev => ({ ...prev, [slot.id]: null }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            title="제거"
                          >
                            <span className="sr-only">제거</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-center px-2 pointer-events-none">
                          <p className="text-xs break-keep">여기에 {acceptedLabels} 드래그</p>
                        </div>
                      )}
                    </div>

                    {/* Arrow for next step (except last) */}
                    {index < currentLevel.slots.length - 1 && (
                      <div className="md:hidden text-slate-300">↓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex justify-center">
             {!isSuccess ? (
               <button
                onClick={handleCheckSolution}
                disabled={isLoadingAi}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-md transition-all
                  ${isLoadingAi 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                  }
                `}
               >
                 {isLoadingAi ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />}
                 {isLoadingAi ? '시스템 분석 중...' : '시스템 가동'}
               </button>
             ) : (
                <button
                  onClick={handleNextLevel}
                  className="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white bg-green-500 hover:bg-green-600 shadow-md animate-bounce"
                >
                  다음 레벨 →
                </button>
             )}
          </div>

          {/* Feedback Area */}
          {feedback && (
            <div className={`
              mt-6 max-w-2xl mx-auto p-4 rounded-xl border flex gap-4 items-start shadow-sm
              ${isSuccess ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}
            `}>
              <div className="mt-1 shrink-0">
                {isSuccess ? <CheckCircle2 /> : <AlertCircle />}
              </div>
              <div>
                <h3 className="font-bold mb-1">{isSuccess ? "성공!" : "시스템 알림"}</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">{feedback}</p>
                {!isSuccess && !isLoadingAi && (
                    <div className="mt-2 text-xs text-red-500/70 font-mono uppercase tracking-wider">
                        AI 튜터 분석
                    </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar / Tray */}
        <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col h-[300px] md:h-auto overflow-hidden shadow-sm z-20">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Box size={18} /> 부품 보관함
            </h2>
            <p className="text-xs text-slate-500 mt-1">부품을 드래그하여 슬롯에 놓으세요.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            {Object.values(ComponentType).map(type => (
              <div key={type} className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">{TYPE_LABELS[type]}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {COMPONENTS.filter(c => c.type === type).map(comp => (
                    <div
                      key={comp.id}
                      draggable
                      onDragStart={() => handleDragStart(comp)}
                      className="
                        bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing
                        hover:border-blue-300 hover:shadow-md transition-all
                        flex flex-col items-center text-center gap-2
                      "
                    >
                      <div className={`
                        p-2 rounded-full 
                        ${type === ComponentType.SENSOR ? 'bg-blue-50 text-blue-600' : ''}
                        ${type === ComponentType.NETWORK ? 'bg-blue-50 text-blue-600' : ''}
                        ${type === ComponentType.PLATFORM ? 'bg-blue-50 text-blue-600' : ''}
                        ${type === ComponentType.ACTUATOR ? 'bg-emerald-50 text-emerald-500' : ''}
                      `}>
                         <IconMap name={comp.iconName} size={20} />
                      </div>
                      <span className="text-xs font-medium text-slate-700 break-keep">{comp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IoTBuilderAcademyApp;