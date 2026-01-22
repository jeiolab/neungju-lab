import React, { useState, useEffect } from 'react';
import { Ear, Check, X, Play } from 'lucide-react';
import { CompressionMode } from '../types';

interface BlindTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Function to set temporary mode without updating global UI state
  setTempMode: (mode: CompressionMode) => void; 
  playAudio: () => void;
  stopAudio: () => void;
}

const BlindTestModal: React.FC<BlindTestModalProps> = ({ isOpen, onClose, setTempMode, playAudio, stopAudio }) => {
  const [stage, setStage] = useState<'intro' | 'playing' | 'guessing' | 'result'>('intro');
  const [targetMode, setTargetMode] = useState<CompressionMode>('lossless');
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStage('intro');
      setResult(null);
      stopAudio();
    }
  }, [isOpen, stopAudio]);

  const startTest = () => {
    // Randomly pick between Lossless and Heavy Compression (Standard MP3 is too hard for many on basic speakers)
    const modes: CompressionMode[] = ['lossless', 'low_quality'];
    const random = modes[Math.floor(Math.random() * modes.length)];
    setTargetMode(random);
    setTempMode(random); // Set audio engine
    
    setStage('playing');
    setIsPlaying(true);
    playAudio();
  };

  const handleGuess = (guess: 'lossless' | 'low_quality') => {
      stopAudio();
      setIsPlaying(false);
      setStage('result');
      if (guess === targetMode) {
          setResult('correct');
      } else {
          setResult('wrong');
      }
  };

  const reset = () => {
      setStage('intro');
      setResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-studio-800 w-full max-w-md rounded-2xl border border-studio-700 shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <X size={24} />
        </button>

        <div className="p-8 text-center">
            <div className="w-16 h-16 bg-studio-700 rounded-full flex items-center justify-center mx-auto mb-6 text-studio-accent">
                <Ear size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">오디오 블라인드 테스트</h2>
            <p className="text-gray-400 text-sm mb-8">당신의 귀는 CD 원음과 강한 압축 음원의 차이를 구분할 수 있나요?</p>

            {stage === 'intro' && (
                <button 
                    onClick={startTest}
                    className="w-full py-3 bg-studio-accent hover:bg-blue-600 text-white rounded-lg font-bold transition-all"
                >
                    듣기 시작
                </button>
            )}

            {stage === 'playing' && (
                <div className="animate-fade-in">
                    <div className="flex items-center justify-center gap-2 mb-8 text-emerald-400 font-mono text-sm animate-pulse">
                        <Play size={14} fill="currentColor"/> 오디오 재생 중...
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleGuess('lossless')}
                            className="p-4 bg-studio-900 border border-studio-600 hover:border-emerald-500 hover:bg-studio-700 rounded-lg text-white font-medium transition-all"
                        >
                            원본 (무손실)
                        </button>
                        <button 
                            onClick={() => handleGuess('low_quality')}
                            className="p-4 bg-studio-900 border border-studio-600 hover:border-amber-500 hover:bg-studio-700 rounded-lg text-white font-medium transition-all"
                        >
                            압축본 (저음질)
                        </button>
                    </div>
                </div>
            )}

            {stage === 'result' && (
                <div className="animate-fade-in">
                    <div className={`text-4xl font-bold mb-4 ${result === 'correct' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {result === 'correct' ? '정답입니다!' : '틀렸습니다!'}
                    </div>
                    <p className="text-gray-300 mb-6">
                        재생된 오디오는 
                        <span className="font-bold text-white mx-1">
                            {targetMode === 'lossless' ? '무손실 (원본)' : '강한 압축 (저음질)'}
                        </span>
                        이었습니다.
                    </p>
                    <button 
                        onClick={reset}
                        className="px-6 py-2 bg-studio-700 hover:bg-studio-600 rounded-lg text-white text-sm"
                    >
                        다시 시도하기
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BlindTestModal;