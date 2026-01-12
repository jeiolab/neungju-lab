'use client'

import React, { useState } from 'react';
import { BookOpen, Gamepad2, Home, Award, ArrowRight, CheckCircle2, AlertCircle, PlayCircle, Info, Router, Network, Share2 } from 'lucide-react';
import { AppView, SimulationLevel } from './types';
import { DEVICES, LEVELS } from './constants';
import { DeviceCard } from './components/DeviceCard';
import { SummaryView } from './components/SummaryView';
import { Certificate } from './components/Certificate';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const NetworkDeviceGuideApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [simulationState, setSimulationState] = useState<'idle' | 'success' | 'failure'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Learn View Handlers
  const handleDeviceSelect = (id: string) => {
    setSelectedDevice(id === selectedDevice ? null : id);
  };

  // Simulation Handlers
  const currentLevelData: SimulationLevel = LEVELS[currentLevelIndex];

  const handleSimulationChoice = (deviceId: string) => {
    const isCorrect = currentLevelData.options.find(opt => opt.deviceId === deviceId)?.isCorrect;
    const feedback = currentLevelData.options.find(opt => opt.deviceId === deviceId)?.feedback || '';
    
    setSimulationState(isCorrect ? 'success' : 'failure');
    setFeedbackMessage(feedback);
  };

  const nextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setSimulationState('idle');
      setFeedbackMessage('');
    } else {
      setCurrentView(AppView.CERTIFICATE);
    }
  };

  const restartSimulation = () => {
    setCurrentLevelIndex(0);
    setSimulationState('idle');
    setFeedbackMessage('');
    setCurrentView(AppView.SIMULATION);
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-4xl mx-auto">
      <div className="mb-8 p-6 bg-blue-50 rounded-full animate-bounce">
        <Gamepad2 size={64} className="text-blue-600" />
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
        네트워크 장비 도감
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl font-medium leading-relaxed">
        복잡한 네트워크 장비, 이제 <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">&apos;택배 시스템&apos;</span>으로 쉽고 재미있게 배워보세요!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
        <button 
          onClick={() => setCurrentView(AppView.LEARN)}
          className="group relative p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all text-left"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold">장비 도감</h3>
          </div>
          <p className="text-slate-500">각 장비의 역할과 특징을 비유를 통해 학습합니다.</p>
        </button>

        <button 
          onClick={() => {
            setCurrentLevelIndex(0);
            setSimulationState('idle');
            setCurrentView(AppView.SIMULATION);
          }}
          className="group relative p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-orange-500 hover:shadow-xl transition-all text-left"
        >
          <div className="flex items-center gap-4 mb-3">
             <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <PlayCircle size={24} />
            </div>
            <h3 className="text-xl font-bold">시뮬레이션</h3>
          </div>
          <p className="text-slate-500">패킷이 되어 데이터를 올바르게 배달해보세요.</p>
        </button>
      </div>
    </div>
  );

  const renderLearn = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 mb-3">네트워크 장비 도감</h2>
        <p className="text-slate-600">장비를 클릭하여 상세 정보를 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Interactive Diagram Area */}
        <div className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-sm min-h-[400px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
          
          <div className="relative z-10 w-full max-w-md aspect-square">
            {/* Visual Connections */}
            <svg className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none" strokeWidth="2">
              <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="currentColor" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="15%" y2="85%" stroke="currentColor" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="currentColor" strokeDasharray="4 4" />
            </svg>

            {/* Central Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-blue-900 font-bold text-center text-sm">NETWORK<br/>WORLD</span>
              </div>
            </div>

            {/* Device Nodes - Positioned absolute */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2">
               <button onClick={() => setSelectedDevice('router')} className={`transition-transform hover:scale-110 p-4 rounded-xl bg-white shadow-lg border-2 ${selectedDevice === 'router' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-indigo-100'}`}>
                 <div className="bg-indigo-100 p-3 rounded-lg mb-2 mx-auto w-fit"><Router className="text-indigo-600" /></div>
                 <span className="text-xs font-bold text-slate-700 block text-center">Router</span>
               </button>
            </div>
            
             <div className="absolute bottom-[10%] left-[5%]">
               <button onClick={() => setSelectedDevice('switch')} className={`transition-transform hover:scale-110 p-4 rounded-xl bg-white shadow-lg border-2 ${selectedDevice === 'switch' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-100'}`}>
                 <div className="bg-blue-100 p-3 rounded-lg mb-2 mx-auto w-fit"><Network className="text-blue-600" /></div>
                 <span className="text-xs font-bold text-slate-700 block text-center">Switch</span>
               </button>
            </div>

             <div className="absolute bottom-[10%] right-[5%]">
               <button onClick={() => setSelectedDevice('hub')} className={`transition-transform hover:scale-110 p-4 rounded-xl bg-white shadow-lg border-2 ${selectedDevice === 'hub' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-amber-100'}`}>
                 <div className="bg-amber-100 p-3 rounded-lg mb-2 mx-auto w-fit"><Share2 className="text-amber-600" /></div>
                 <span className="text-xs font-bold text-slate-700 block text-center">Hub</span>
               </button>
            </div>
          </div>
        </div>

        {/* List/Details Area */}
        <div className="flex flex-col gap-4">
          {DEVICES.map(device => (
            <DeviceCard 
              key={device.id} 
              device={device} 
              isActive={selectedDevice === device.id} 
              onClick={() => handleDeviceSelect(device.id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSimulation = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
          <span>Level {currentLevelIndex + 1}</span>
          <span>{LEVELS.length} Levels</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentLevelIndex + 1) / LEVELS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-slate-100 overflow-hidden">
        {/* Scenario Header */}
        <div className="bg-slate-900 text-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-yellow-400">{currentLevelData.title}</h2>
              <p className="text-slate-300 leading-relaxed">{currentLevelData.description}</p>
            </div>
            <div className="hidden md:block bg-slate-800 p-4 rounded-xl min-w-[150px]">
              <div className="text-xs text-slate-400 mb-1">출발지</div>
              <div className="font-mono text-sm mb-3 text-green-400">➜ {currentLevelData.packetOrigin}</div>
              <div className="text-xs text-slate-400 mb-1">목적지</div>
              <div className="font-mono text-sm text-blue-400">🏁 {currentLevelData.packetDestination}</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-6 md:p-8 min-h-[400px] flex flex-col justify-between relative bg-slate-50">
          
          {/* Packet Animation */}
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-200">
             <div className="h-full w-1/4 bg-orange-500 animate-travel rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          </div>

          <div className="text-center py-8">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
              {currentLevelData.question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {currentLevelData.options.map((option) => (
                <button
                  key={option.deviceId}
                  onClick={() => simulationState === 'idle' && handleSimulationChoice(option.deviceId)}
                  disabled={simulationState !== 'idle'}
                  className={`p-6 rounded-2xl border-b-4 font-bold text-lg transition-all
                    ${simulationState === 'idle' 
                      ? 'bg-white border-slate-200 text-slate-700 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                    ${simulationState !== 'idle' && option.isCorrect && 'bg-green-100 border-green-400 text-green-800 opacity-100!'}
                    ${simulationState !== 'idle' && !option.isCorrect && simulationState === 'failure' && 'bg-red-50 border-red-200 text-slate-400'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Overlay */}
          {simulationState !== 'idle' && (
            <div className={`mt-8 p-6 rounded-2xl animate-[fadeIn_0.5s_ease-out] border-2 flex flex-col items-center text-center
              ${simulationState === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`
            }>
              <div className={`mb-4 p-3 rounded-full ${simulationState === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                {simulationState === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              
              <h4 className={`text-xl font-black mb-2 ${simulationState === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {simulationState === 'success' ? '정답입니다!' : '앗, 다시 생각해보세요!'}
              </h4>
              <p className="text-slate-700 mb-6 font-medium">{feedbackMessage}</p>

              {simulationState === 'success' ? (
                <button 
                  onClick={nextLevel}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
                >
                  다음 레벨로 <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setSimulationState('idle');
                    setFeedbackMessage('');
                  }}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg"
                >
                  다시 시도하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Navigation */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
            <button 
              onClick={() => setCurrentView(AppView.HOME)} 
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
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">네트워크 장비 도감</h1>
                <p className="text-sm text-slate-500 leading-tight mt-0.5">네트워크 장비의 역할을 택배 시스템 비유로 쉽고 재미있게 배우는 인터랙티브 교육 앱입니다.</p>
              </div>
            </button>
            
            <nav className="hidden md:flex items-center gap-6 font-bold text-sm text-slate-600">
              <button onClick={() => setCurrentView(AppView.LEARN)} className={`hover:text-blue-600 transition-colors ${currentView === AppView.LEARN ? 'text-blue-600' : ''}`}>장비 도감</button>
              <button onClick={() => setCurrentView(AppView.SIMULATION)} className={`hover:text-blue-600 transition-colors ${currentView === AppView.SIMULATION ? 'text-blue-600' : ''}`}>시뮬레이션</button>
              <button onClick={() => setCurrentView(AppView.SUMMARY)} className={`hover:text-blue-600 transition-colors ${currentView === AppView.SUMMARY ? 'text-blue-600' : ''}`}>요약 노트</button>
            </nav>
          </div>

          {/* Main Content */}
          {currentView === AppView.HOME && renderHome()}
          {currentView === AppView.LEARN && renderLearn()}
          {currentView === AppView.SIMULATION && renderSimulation()}
          {currentView === AppView.SUMMARY && <SummaryView />}
          {currentView === AppView.CERTIFICATE && <Certificate onRestart={() => setCurrentView(AppView.HOME)} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NetworkDeviceGuideApp;

