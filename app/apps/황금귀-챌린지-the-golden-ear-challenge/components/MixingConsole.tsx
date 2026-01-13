import React, { useState, useEffect, useMemo } from 'react';
import { Sliders, Music, Info, Mic2 } from 'lucide-react';
import { Bitrate, AudioStats } from '../types';

const MixingConsole: React.FC = () => {
  const [bitrate, setBitrate] = useState<Bitrate>(Bitrate.HIGH);
  const [cutOffLow, setCutOffLow] = useState<number>(20);
  const [cutOffHigh, setCutOffHigh] = useState<number>(20000);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Standard Song Specs
  const stats: AudioStats = {
    duration: 180, // 3 minutes
    sampleRate: 44100,
    bitDepth: 16,
    channels: 2
  };

  // Size Calculation
  const calculateSize = (br: Bitrate, s: AudioStats) => {
    let sizeMB = 0;
    if (br === Bitrate.FLAC) {
      // Uncompressed WAV formula: (SampleRate * BitDepth * Channels * Seconds) / 8 / 1024 / 1024
      // FLAC is usually compressed 50-70% of WAV, but we use WAV as "Lossless" reference here for clarity
      sizeMB = (s.sampleRate * s.bitDepth * s.channels * s.duration) / 8 / 1024 / 1024;
    } else {
      // MP3 formula: (Bitrate_kbps * 1000 * Seconds) / 8 / 1024 / 1024
      sizeMB = (br * 1000 * s.duration) / 8 / 1024 / 1024;
    }
    return sizeMB.toFixed(2);
  };

  // Generate Dummy Waveform Points
  const waveformPoints = useMemo(() => {
    const points = [];
    const width = 800;
    const segments = 100;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      let y = 50; // Center line

      // Simulate complex wave
      const fundamental = Math.sin((i / 5) * Math.PI);
      const harmonic1 = Math.sin((i / 2.5) * Math.PI) * 0.5;
      const noise = (Math.random() - 0.5) * 0.5;

      // Apply "Compression" Visuals
      let amplitude = 40;
      
      // If Low Bitrate, lose detail (noise/harmonics)
      if (bitrate === Bitrate.LOW) {
         y += (fundamental + (harmonic1 * 0.2)) * amplitude; 
      } 
      // If FLAC, keep full detail
      else if (bitrate === Bitrate.FLAC) {
         y += (fundamental + harmonic1 + noise) * amplitude;
      } 
      // High MP3
      else {
         y += (fundamental + harmonic1 + (noise * 0.5)) * amplitude;
      }

      // Apply Frequency Cuts (Visual Simulation)
      // If user cuts highs significantly (e.g. < 5k), wave becomes super smooth/sine-like
      if (cutOffHigh < 5000) {
        y = 50 + (Math.sin((i / 10) * Math.PI) * amplitude);
      }
      
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }, [bitrate, cutOffHigh]);


  return (
    <div className="h-full flex flex-col gap-6 p-6 bg-studio-800 rounded-lg shadow-2xl border border-studio-700">
      <div className="flex justify-between items-center border-b border-studio-600 pb-4">
        <h2 className="text-2xl font-bold text-studio-accent flex items-center gap-2">
          <Sliders className="w-6 h-6" /> 믹싱 콘솔 (Mixing Console)
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Music className="w-4 h-4" />
          <span>데모 트랙: "Neon Nights" (3:00)</span>
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="relative h-48 bg-black rounded-md border border-studio-600 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-studio-800 to-black opacity-50"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-12 opacity-20 pointer-events-none">
            {[...Array(12)].map((_, i) => <div key={i} className="border-r border-studio-500 h-full"></div>)}
        </div>

        {/* The Waveform */}
        <svg className="w-full h-full z-10" viewBox="0 0 800 100" preserveAspectRatio="none">
          <polyline 
            points={waveformPoints} 
            fill="none" 
            stroke={bitrate === Bitrate.FLAC ? '#00f0ff' : bitrate === Bitrate.HIGH ? '#00cc66' : '#ffcc00'} 
            strokeWidth={isPlaying ? 3 : 2}
            className={`transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
            strokeLinejoin="round"
          />
        </svg>

        {/* Overlay Text for "Loss" */}
        {bitrate === Bitrate.LOW && (
          <div className="absolute top-2 right-2 text-xs text-warn font-mono bg-black/80 px-2 py-1 rounded border border-warn/50">
            데이터 손실(Artifacts) 감지됨
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="space-y-6">
          {/* Bitrate Slider */}
          <div className="bg-studio-700 p-4 rounded-lg">
            <label className="text-sm text-gray-300 font-semibold mb-2 block">압축 코덱 / 비트레이트</label>
            <div className="flex flex-col gap-4">
               <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  step="1"
                  className="w-full accent-studio-accent h-2 bg-studio-900 rounded-lg appearance-none cursor-pointer"
                  value={bitrate === Bitrate.LOW ? 0 : bitrate === Bitrate.HIGH ? 1 : 2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val === 0) setBitrate(Bitrate.LOW);
                    else if (val === 1) setBitrate(Bitrate.HIGH);
                    else setBitrate(Bitrate.FLAC);
                  }}
               />
               <div className="flex justify-between text-xs font-mono text-gray-400">
                 <span className={bitrate === Bitrate.LOW ? 'text-warn font-bold' : ''}>MP3 128kbps</span>
                 <span className={bitrate === Bitrate.HIGH ? 'text-success font-bold' : ''}>MP3 320kbps</span>
                 <span className={bitrate === Bitrate.FLAC ? 'text-studio-accent font-bold' : ''}>WAV/FLAC (무손실)</span>
               </div>
            </div>
          </div>

          {/* Frequency Knobs (Sliders for simplicity in web) */}
          <div className="bg-studio-700 p-4 rounded-lg">
             <label className="text-sm text-gray-300 font-semibold mb-4 block">주파수 컷팅 (Filters)</label>
             <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Low Cut (초저음 삭제)</span>
                        <span className="font-mono text-studio-accent">{cutOffLow} Hz</span>
                    </div>
                    <input 
                        type="range" min="20" max="1000" step="10" 
                        value={cutOffLow}
                        onChange={(e) => setCutOffLow(Number(e.target.value))}
                        className="w-full accent-danger h-1 bg-studio-900 rounded cursor-pointer"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>High Cut (초고음 삭제)</span>
                        <span className="font-mono text-studio-accent">{cutOffHigh >= 20000 ? 'OFF' : `${cutOffHigh} Hz`}</span>
                    </div>
                    <input 
                        type="range" min="1000" max="20000" step="100" 
                        value={cutOffHigh}
                        onChange={(e) => setCutOffHigh(Number(e.target.value))}
                        className="w-full accent-danger h-1 bg-studio-900 rounded cursor-pointer"
                    />
                </div>
             </div>
          </div>
        </div>

        {/* Data / Calculator */}
        <div className="bg-studio-900 p-6 rounded-lg border border-studio-600 font-mono flex flex-col justify-between">
           <div>
              <h3 className="text-studio-accent mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> 용량 계산기
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                    <span>표본화율(Sample Rate):</span>
                    <span>{stats.sampleRate} Hz</span>
                </div>
                <div className="flex justify-between">
                    <span>비트 깊이(Bit Depth):</span>
                    <span>{stats.bitDepth} bit</span>
                </div>
                <div className="flex justify-between">
                    <span>길이(Duration):</span>
                    <span>{stats.duration} sec</span>
                </div>
              </div>
           </div>

           <div className="mt-6 pt-6 border-t border-studio-700">
              <div className="text-xs text-gray-500 mb-1">예상 파일 크기</div>
              <div className="text-4xl font-bold text-white flex items-baseline gap-2">
                  {calculateSize(bitrate, stats)} 
                  <span className="text-lg text-studio-accent">MB</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">
                {bitrate === Bitrate.FLAC 
                  ? "무손실 오디오는 상당한 저장 공간을 차지합니다." 
                  : `원본 대비 약 ${(100 - (parseInt(calculateSize(bitrate, stats))/parseInt(calculateSize(Bitrate.FLAC, stats)) * 100)).toFixed(0)}% 압축되었습니다.`}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MixingConsole;