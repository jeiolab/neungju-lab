'use client'

import React, { useState, useEffect } from 'react';
import { Activity, HelpCircle } from 'lucide-react';
import { useAudioEngine } from './hooks/useAudioEngine';
import AudioVisualizer from './components/AudioVisualizer';
import ControlPanel from './components/ControlPanel';
import BlindTestModal from './components/BlindTestModal';
import { CONCEPTS } from './constants';
import { SoundType, CompressionMode } from './types';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const AudioCompressLabApp = () => {
  const { 
    initAudio, 
    startSequencer, 
    stopAudio, 
    updateCompression, 
    analyser, 
    isReady 
  } = useAudioEngine();

  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>('mix');
  const [compressionMode, setCompressionMode] = useState<CompressionMode>('lossless');
  const [isBlindTestOpen, setIsBlindTestOpen] = useState(false);
  const [introDismissed, setIntroDismissed] = useState(false);

  // Sync compression mode changes to audio engine
  useEffect(() => {
    updateCompression(compressionMode);
  }, [compressionMode, updateCompression]);

  const handlePlayToggle = () => {
    if (!isReady) initAudio();
    
    if (isPlaying) {
      stopAudio();
    } else {
      startSequencer(soundType);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSoundChange = (type: SoundType) => {
    setSoundType(type);
    if (isPlaying) {
      // Restart with new sound if currently playing
      stopAudio();
      startSequencer(type);
    }
  };

  // Intro Screen
  if (!introDismissed) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full flex-grow flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="text-blue-600" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">소리를 요리하다</h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              40MB 노래가 어떻게 4MB MP3로 줄어드는지 궁금하신가요? 
              <br/><strong>심리음향학</strong>, <strong>주파수 마스킹</strong>, <strong>손실 압축</strong>의 원리를 이 인터랙티브 실험실에서 탐구해보세요.
            </p>
            <button 
              onClick={() => { initAudio(); setIntroDismissed(true); }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg"
            >
              실험실 입장
            </button>
            <p className="mt-4 text-xs text-gray-500 font-mono">알림: 시작 버튼을 누르면 소리가 즉시 재생됩니다.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  setIntroDismissed(false);
                  stopAudio();
                  setIsPlaying(false);
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
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">소리를 요리하다</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">오디오 손실 압축, 주파수 마스킹, 샘플링 레이트 감소의 원리를 시각적, 청각적으로 학습할 수 있는 교육용 인터랙티브 도구입니다.</p>
                </div>
              </button>
            </div>
          </header>

          {/* Visualizer Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 font-medium flex items-center gap-2">
                <Activity size={16} /> 실시간 스펙트로그램
              </h2>
                <div className={`px-2 py-1 rounded text-xs font-mono font-bold ${isPlaying ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                {isPlaying ? '신호 감지됨' : '대기 중'}
              </div>
            </div>
            <AudioVisualizer 
              analyser={analyser} 
              compressionMode={compressionMode}
              isPlaying={isPlaying}
            />
          </section>

          {/* Controls */}
          <ControlPanel 
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
            soundType={soundType}
            onSoundTypeChange={handleSoundChange}
            compressionMode={compressionMode}
            onCompressionChange={setCompressionMode}
            openBlindTest={() => setIsBlindTestOpen(true)}
          />

          {/* Educational Concepts */}
          <section className="max-w-5xl mx-auto mt-16 grid md:grid-cols-2 gap-6">
            {CONCEPTS.map(concept => (
              <div key={concept.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                <div className="text-4xl mb-4">{concept.visualIcon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{concept.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {concept.description}
                </p>
              </div>
            ))}
          </section>
        </div>
      </main>

      <BlindTestModal 
        isOpen={isBlindTestOpen}
        onClose={() => {
          setIsBlindTestOpen(false);
          setCompressionMode(compressionMode); // Reset engine to UI state
          updateCompression(compressionMode);
          stopAudio();
          setIsPlaying(false);
        }}
        setTempMode={(mode) => updateCompression(mode)}
        playAudio={() => startSequencer(soundType)}
        stopAudio={stopAudio}
      />
      <Footer />
    </div>
  );
};

export default AudioCompressLabApp;

