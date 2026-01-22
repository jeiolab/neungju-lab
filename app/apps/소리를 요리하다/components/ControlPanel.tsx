import React from 'react';
import { Play, Square, Scissors, HardDrive, Music, Zap } from 'lucide-react';
import { CompressionMode, SoundType } from '../types';
import { FILE_SIZE_DATA } from '../constants';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  soundType: SoundType;
  onSoundTypeChange: (type: SoundType) => void;
  compressionMode: CompressionMode;
  onCompressionChange: (mode: CompressionMode) => void;
  openBlindTest: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayToggle,
  soundType,
  onSoundTypeChange,
  compressionMode,
  onCompressionChange,
  openBlindTest
}) => {
  const getSoundLabel = (type: SoundType) => {
      switch(type) {
          case 'drums': return '드럼';
          case 'piano': return '피아노';
          case 'mix': return '종합 믹스';
          default: return type;
      }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-5xl mx-auto mt-8 p-4">
      
      {/* Player Controls */}
      <div className="col-span-1 md:col-span-4 bg-studio-800 p-6 rounded-xl border border-studio-700 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-gray-400 text-sm font-mono uppercase mb-4 flex items-center gap-2">
            <Music size={16} /> 음원 선택 (Source)
          </h3>
          <div className="space-y-2">
            {(['drums', 'piano', 'mix'] as SoundType[]).map((type) => (
              <button
                key={type}
                onClick={() => onSoundTypeChange(type)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  soundType === type 
                    ? 'bg-studio-700 border-studio-accent text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-transparent border-studio-700 text-gray-400 hover:bg-studio-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                   <span className="font-medium">{getSoundLabel(type)}</span>
                   {soundType === type && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={onPlayToggle}
          className={`mt-6 w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            isPlaying 
              ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
              : 'bg-studio-accent text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
          }`}
        >
          {isPlaying ? <><Square fill="currentColor" size={20} /> 정지</> : <><Play fill="currentColor" size={20} /> 반복 재생</>}
        </button>
      </div>

      {/* Compression Lab */}
      <div className="col-span-1 md:col-span-8 bg-studio-800 p-6 rounded-xl border border-studio-700 shadow-xl">
         <h3 className="text-gray-400 text-sm font-mono uppercase mb-4 flex items-center gap-2">
            <Scissors size={16} /> 압축 엔진 (Compression)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => onCompressionChange('lossless')}
              className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                compressionMode === 'lossless'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-studio-700 bg-studio-900 hover:border-studio-600'
              }`}
            >
              <div className="font-bold text-emerald-400 mb-1">무손실 (WAV)</div>
              <div className="text-xs text-gray-500">원본 품질</div>
              <div className="text-xs text-gray-400 mt-2 font-mono">20Hz - 20kHz</div>
              {compressionMode === 'lossless' && <div className="absolute top-0 right-0 p-1"><div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div></div>}
            </button>

            <button
              onClick={() => onCompressionChange('mp3')}
              className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                compressionMode === 'mp3'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-studio-700 bg-studio-900 hover:border-studio-600'
              }`}
            >
              <div className="font-bold text-blue-400 mb-1">일반 MP3</div>
              <div className="text-xs text-gray-500">128 kbps</div>
              <div className="text-xs text-gray-400 mt-2 font-mono">16kHz 이상 제거</div>
               {compressionMode === 'mp3' && <div className="absolute top-0 right-0 p-1"><div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div></div>}
            </button>

            <button
              onClick={() => onCompressionChange('low_quality')}
              className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                compressionMode === 'low_quality'
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-studio-700 bg-studio-900 hover:border-studio-600'
              }`}
            >
              <div className="font-bold text-amber-400 mb-1">강한 압축</div>
              <div className="text-xs text-gray-500">64 kbps</div>
              <div className="text-xs text-gray-400 mt-2 font-mono">3.5kHz 컷 + 마스킹</div>
              {compressionMode === 'low_quality' && <div className="absolute top-0 right-0 p-1"><div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div></div>}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="bg-studio-900/50 rounded-lg p-4 border border-studio-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-studio-800 rounded-lg text-gray-400">
                <HardDrive size={18} />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono">예상 파일 크기</div>
                <div className="text-xl font-mono font-bold text-white">
                  {FILE_SIZE_DATA[compressionMode].size} 
                  <span className="text-sm font-normal text-gray-500 ml-2">({FILE_SIZE_DATA[compressionMode].ratio})</span>
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-studio-700 hidden sm:block"></div>

            <div className="flex-1">
               <div className="text-xs text-gray-500 font-mono mb-1">데이터 보존율</div>
               <div className="w-full bg-studio-800 rounded-full h-2 overflow-hidden">
                 <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                        compressionMode === 'lossless' ? 'bg-emerald-500 w-full' : 
                        compressionMode === 'mp3' ? 'bg-blue-500 w-[10%]' : 'bg-amber-500 w-[5%]'
                    }`}
                 ></div>
               </div>
            </div>

            <button 
                onClick={openBlindTest}
                className="px-4 py-2 bg-studio-700 hover:bg-studio-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ml-auto"
            >
                <Zap size={16} className="text-yellow-400" /> 블라인드 테스트
            </button>
          </div>
      </div>
    </div>
  );
};

export default ControlPanel;