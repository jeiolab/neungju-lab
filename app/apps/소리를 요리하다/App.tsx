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
        <div className="min-h-screen bg-studio-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-studio-800 rounded-2xl p-8 border border-studio-700 shadow-2xl text-center">
                <div className="w-20 h-20 bg-studio-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="text-studio-accent" size={40} />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">오디오 압축 시각화 도구</h1>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    40MB 노래가 어떻게 4MB MP3로 줄어드는지 궁금하신가요? 
                    <br/>**심리음향학**, **주파수 마스킹**, **손실 압축**의 원리를 이 인터랙티브 실험실에서 탐구해보세요.
                </p>
                <button 
                    onClick={() => { initAudio(); setIntroDismissed(true); }}
                    className="px-8 py-4 bg-studio-accent hover:bg-blue-600 text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-blue-500/25"
                >
                    실험실 입장
                </button>
                <p className="mt-4 text-xs text-gray-500 font-mono">알림: 시작 버튼을 누르면 소리가 즉시 재생됩니다.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-900 text-white font-sans selection:bg-studio-accent/30">
      
      {/* Header */}
      <header className="border-b border-studio-800 bg-studio-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Activity size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">AudioCompress<span className="text-studio-accent">Lab</span></span>
            </div>
            <div className="text-xs font-mono text-gray-500 hidden sm:block">
                Web Audio API • Real-time DSP
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        
        {/* Visualizer Section */}
        <section className="mb-8">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-300 font-medium flex items-center gap-2">
                    <Activity size={16} /> 실시간 스펙트로그램
                </h2>
                <div className={`px-2 py-1 rounded text-xs font-mono font-bold ${isPlaying ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-studio-700 text-gray-400'}`}>
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
                <div key={concept.id} className="bg-studio-800/50 p-6 rounded-xl border border-studio-700/50 hover:border-studio-600 transition-colors">
                    <div className="text-4xl mb-4">{concept.visualIcon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{concept.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
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