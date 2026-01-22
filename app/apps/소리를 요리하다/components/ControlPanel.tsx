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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-5xl mx-auto mt-8">
      
      {/* Player Controls */}
      <div className="col-span-1 md:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-slate-600 text-sm font-semibold mb-4 flex items-center gap-2">
            <Music size={16} /> 음원 선택
          </h3>
          <div className="space-y-2">
            {(['drums', 'piano', 'mix'] as SoundType[]).map((type) => (
              <button
                key={type}
                onClick={() => onSoundTypeChange(type)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  soundType === type 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                   <span className="font-medium">{getSoundLabel(type)}</span>
                   {soundType === type && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={onPlayToggle}
          className={`mt-6 w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            isPlaying 
              ? 'bg-red-50 text-red-600 border-2 border-red-300 hover:bg-red-100' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
          }`}
        >
          {isPlaying ? <><Square fill="currentColor" size={20} /> 정지</> : <><Play fill="currentColor" size={20} /> 반복 재생</>}
        </button>
      </div>

      {/* Compression Lab */}
      <div className="col-span-1 md:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h3 className="text-slate-600 text-sm font-semibold mb-4 flex items-center gap-2">
            <Scissors size={16} /> 압축 엔진
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => onCompressionChange('lossless')}
              className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                compressionMode === 'lossless'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-emerald-600 mb-1">무손실 (WAV)</div>
              <div className="text-xs text-slate-500">원본 품질</div>
              <div className="text-xs text-slate-600 mt-2 font-mono">20Hz - 20kHz</div>
              {compressionMode === 'lossless' && <div className="absolute top-0 right-0 p-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div></div>}
            </button>

            <button
              onClick={() => onCompressionChange('mp3')}
              className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                compressionMode === 'mp3'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-blue-600 mb-1">일반 MP3</div>
              <div className="text-xs text-slate-500">128 kbps</div>
              <div className="text-xs text-slate-600 mt-2 font-mono">16kHz 이상 제거</div>
               {compressionMode === 'mp3' && <div className="absolute top-0 right-0 p-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div></div>}
            </button>

            <button
              onClick={() => onCompressionChange('low_quality')}
              className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                compressionMode === 'low_quality'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-amber-600 mb-1">강한 압축</div>
              <div className="text-xs text-slate-500">64 kbps</div>
              <div className="text-xs text-slate-600 mt-2 font-mono">3.5kHz 컷 + 마스킹</div>
              {compressionMode === 'low_quality' && <div className="absolute top-0 right-0 p-1"><div className="w-2 h-2 bg-amber-500 rounded-full"></div></div>}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-slate-600 border border-slate-200">
                <HardDrive size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-mono">예상 파일 크기</div>
                <div className="text-xl font-mono font-bold text-slate-800">
                  {FILE_SIZE_DATA[compressionMode].size} 
                  <span className="text-sm font-normal text-slate-500 ml-2">({FILE_SIZE_DATA[compressionMode].ratio})</span>
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>

            <div className="flex-1">
               <div className="text-xs text-slate-500 font-mono mb-1">데이터 보존율</div>
               <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ml-auto"
            >
                <Zap size={16} className="text-yellow-300" /> 블라인드 테스트
            </button>
          </div>
      </div>
    </div>
  );
};

export default ControlPanel;