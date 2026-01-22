import React, { useState, useEffect } from 'react';
import { Activity, HelpCircle } from 'lucide-react';
import { useAudioEngine } from './hooks/useAudioEngine';
import AudioVisualizer from './components/AudioVisualizer';
import ControlPanel from './components/ControlPanel';
import BlindTestModal from './components/BlindTestModal';
import { CONCEPTS } from './constants';
import { SoundType, CompressionMode } from './types';

const App = () => {
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="text-indigo-600" size={40} />
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-4">오디오 압축 시각화 도구</h1>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    40MB 노래가 어떻게 4MB MP3로 줄어드는지 궁금하신가요? 
                    <br/>**심리음향학**, **주파수 마스킹**, **손실 압축**의 원리를 이 인터랙티브 실험실에서 탐구해보세요.
                </p>
                <button 
                    onClick={() => { initAudio(); setIntroDismissed(true); }}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg"
                >
                    실험실 입장
                </button>
                <p className="mt-4 text-xs text-slate-500 font-mono">알림: 시작 버튼을 누르면 소리가 즉시 재생됩니다.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Activity size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-800">오디오 압축 <span className="text-indigo-600">시각화</span></span>
            </div>
            <div className="text-xs font-mono text-slate-500 hidden sm:block">
                Web Audio API • Real-time DSP
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Visualizer Section */}
        <section className="mb-8">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-700 font-semibold flex items-center gap-2">
                    <Activity size={16} /> 실시간 스펙트로그램
                </h2>
                <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${isPlaying ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
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
                <div key={concept.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                    <div className="text-4xl mb-4">{concept.visualIcon}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{concept.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {concept.description}
                    </p>
                </div>
            ))}
        </section>

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
    </div>
  );
};

export default App;